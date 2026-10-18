---
name: openrouter-api
description: Use this skill for ANY OpenRouter API usage — making completions calls, selecting models, handling streaming, managing API keys, error handling, or integrating OpenRouter into Chrome extensions, Node.js apps, or Next.js backends. Trigger whenever the user mentions OpenRouter, openrouter.ai, OR is calling any LLM API (GPT, Claude, Mistral, Llama) from their own backend or extension.
---

# OpenRouter API

Base URL: `https://openrouter.ai/api/v1` (OpenAI-compatible)

## Core completion call
```ts
const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': 'https://yoursite.com', // required for rankings
    'X-Title': 'Your App Name',             // optional, shows in dashboard
  },
  body: JSON.stringify({
    model: 'mistralai/mistral-7b-instruct:free',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: prompt }
    ],
    max_tokens: 1000,
    temperature: 0.7,
  })
});

const data = await res.json();
const text = data.choices[0].message.content;
```

## Model selection cheatsheet

| Use case | Model | Cost |
|----------|-------|------|
| Free tier / testing | `mistralai/mistral-7b-instruct:free` | Free |
| Fast + cheap | `meta-llama/llama-3.1-8b-instruct` | ~$0.05/1M |
| Balanced | `mistralai/mistral-small-3.1-24b` | ~$0.10/1M |
| Best quality | `anthropic/claude-sonnet-4-20250514` | ~$3/1M |
| Code | `deepseek/deepseek-coder-v2-instruct` | ~$0.14/1M |
| Long context | `google/gemini-flash-1.5` | ~$0.075/1M |

Always use `mistralai/mistral-7b-instruct:free` for dev/testing. Switch to paid only for prod.

## Streaming response
```ts
const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ model, messages, stream: true })
});

const reader = res.body!.getReader();
const decoder = new TextDecoder();
let full = '';

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  const chunk = decoder.decode(value);
  const lines = chunk.split('\n').filter(l => l.startsWith('data: '));
  for (const line of lines) {
    const json = line.slice(6);
    if (json === '[DONE]') break;
    const delta = JSON.parse(json).choices[0].delta.content ?? '';
    full += delta;
    // update UI with delta
  }
}
```

## From Chrome extension (background.js)
```js
// API key stored in chrome.storage.local, not hardcoded
const { openrouterKey } = await chrome.storage.local.get('openrouterKey');

const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${openrouterKey}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': chrome.runtime.getURL(''),
  },
  body: JSON.stringify({ model: 'mistralai/mistral-7b-instruct:free', messages })
});
```
Add `https://openrouter.ai/` to `host_permissions` in manifest.json.

## JSON structured output
```ts
body: JSON.stringify({
  model,
  messages: [
    { role: 'system', content: 'Respond ONLY with valid JSON. No markdown, no backticks.' },
    { role: 'user', content: `Return this shape: ${JSON.stringify(schema)}\n\nInput: ${input}` }
  ],
  response_format: { type: 'json_object' }, // supported on some models
})

// Parse safely
const raw = data.choices[0].message.content;
const clean = raw.replace(/```json|```/g, '').trim();
const parsed = JSON.parse(clean);
```

## Error handling
```ts
async function callOpenRouter(messages: any[], model = 'mistralai/mistral-7b-instruct:free') {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model, messages, max_tokens: 1000 })
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`OpenRouter error ${res.status}: ${err.error?.message}`);
  }

  const data = await res.json();
  if (!data.choices?.[0]?.message?.content) {
    throw new Error('Empty response from OpenRouter');
  }
  return data.choices[0].message.content;
}
```

## Cost estimation before calling
```ts
// Rough token estimate: 1 token ≈ 4 chars
const estimatedTokens = Math.ceil(prompt.length / 4);
// mistral-7b free = $0, llama-3.1-8b = $0.05/1M input
```

## .env.local
```
OPENROUTER_API_KEY=sk-or-v1-...
```

## Common errors
| Error | Fix |
|-------|-----|
| `401 No auth` | Check `Bearer ` prefix + key starts with `sk-or-` |
| `429 Rate limit` | Free tier: 200 req/day. Add retry with backoff or upgrade |
| `model not found` | Check exact model string at openrouter.ai/models |
| Empty `content` | Model refused — check system prompt isn't triggering safety filter |
