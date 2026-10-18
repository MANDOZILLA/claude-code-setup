---
name: chrome-extension-boilerplate
description: Use this skill for ANY Chrome extension task — creating new extensions, adding features, debugging, working with manifest v3, content scripts, background service workers, popup/settings pages, messaging, storage, or permissions. Trigger whenever the user mentions Chrome extension, manifest.json, content_scripts, background.js, service worker, popup.html, browser.storage, chrome.runtime, or is building anything that runs in the browser as an extension.
---

# Chrome Extension Boilerplate (Manifest V3)

## Core file structure
```
extension/
├── manifest.json
├── background.js        ← service worker (NOT persistent page)
├── content.js           ← injected into pages
├── popup/
│   ├── popup.html
│   └── popup.js
├── settings/
│   ├── settings.html
│   └── settings.js
└── icons/
    ├── 16.png / 48.png / 128.png
```

## manifest.json template
```json
{
  "manifest_version": 3,
  "name": "Extension Name",
  "version": "1.0.0",
  "description": "...",
  "permissions": [],
  "host_permissions": [],
  "background": {
    "service_worker": "background.js",
    "type": "module"
  },
  "content_scripts": [{
    "matches": ["<all_urls>"],
    "js": ["content.js"],
    "run_at": "document_idle"
  }],
  "action": {
    "default_popup": "popup/popup.html",
    "default_icon": { "16": "icons/16.png", "48": "icons/48.png" }
  },
  "options_page": "settings/settings.html",
  "icons": { "16": "icons/16.png", "48": "icons/48.png", "128": "icons/128.png" }
}
```

## Key MV3 rules (do NOT violate)
- Background is a **service worker** — it can terminate anytime. Never store state in memory; always use `chrome.storage`.
- No `eval()`, no remote code execution.
- `host_permissions` is separate from `permissions` in MV3.
- `chrome.action` replaces `chrome.browserAction` / `chrome.pageAction`.
- Content scripts run in isolated world — can't access page's JS variables directly. Use `chrome.scripting.executeScript` for main world injection.

## Common permissions cheatsheet
| Need | Permission |
|------|-----------|
| Read/write storage | `"storage"` |
| All URLs | `"<all_urls>"` in host_permissions |
| Active tab only | `"activeTab"` |
| Intercept requests | `"webRequest"`, `"declarativeNetRequest"` |
| Tabs info | `"tabs"` |
| Desktop notifications | `"notifications"` |
| Clipboard write | `"clipboardWrite"` |
| Identity/OAuth | `"identity"` |

## Messaging patterns

### Popup → Background
```js
// popup.js
const response = await chrome.runtime.sendMessage({ type: 'DO_THING', data });

// background.js
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'DO_THING') {
    // async: return true to keep channel open
    doThing(msg.data).then(sendResponse);
    return true;
  }
});
```

### Background → Content script
```js
// background.js
const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
await chrome.tabs.sendMessage(tab.id, { type: 'DO_THING' });
```

## Storage patterns
```js
// Save
await chrome.storage.local.set({ key: value });
await chrome.storage.sync.set({ key: value }); // syncs across devices

// Read
const { key } = await chrome.storage.local.get('key');
const data = await chrome.storage.local.get(['key1', 'key2']);

// Listen for changes
chrome.storage.onChanged.addListener((changes, area) => {
  if (changes.key) console.log(changes.key.newValue);
});
```

## OpenRouter API call from background.js
```js
const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': chrome.runtime.getURL(''),
  },
  body: JSON.stringify({
    model: 'mistralai/mistral-7b-instruct:free',
    messages: [{ role: 'user', content: prompt }]
  })
});
const data = await res.json();
const text = data.choices[0].message.content;
```

## Content script injection (main world)
```js
// background.js — inject into page's JS context
await chrome.scripting.executeScript({
  target: { tabId },
  world: 'MAIN',
  func: () => { /* runs in page context */ }
});
```

## Service worker keep-alive pattern
```js
// background.js — for long async operations
const keepAlive = setInterval(chrome.runtime.getPlatformInfo, 20000);
// clear when done
clearInterval(keepAlive);
```

## Popup → Settings page navigation
```js
// From popup.js
chrome.runtime.openOptionsPage();
```

## Loading API keys safely
Never hardcode keys. Store in `chrome.storage.local`, read in background:
```js
const { apiKey } = await chrome.storage.local.get('apiKey');
if (!apiKey) throw new Error('API key not set — open settings');
```

## Common gotchas
- Content script `document_idle` fires after DOM ready — use `document_start` to intercept early page loads
- Service workers have no `window` or `document`
- `chrome.storage.sync` has 8KB per-item limit — use `local` for large data
- MV3 doesn't support blocking webRequest — use `declarativeNetRequest` for request blocking
- Always check `chrome.runtime.lastError` after callbacks (or use async/await versions)
