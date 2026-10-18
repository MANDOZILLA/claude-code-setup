---
name: google-oauth-apis
description: Use this skill for ANY Google API integration — Google Analytics 4 (GA4), Google Search Console (GSC), Gmail API, Google Drive API, OAuth2 setup, service accounts, or credential management. Trigger whenever the user mentions GA4, Google Analytics, Search Console, GSC, Gmail API, Google OAuth, service account JSON, @google-analytics/data, googleapis, or is wiring up any Google API in a project.
---

# Google OAuth & APIs

## Two auth methods

| | Service Account | OAuth2 (user) |
|--|--|--|
| Use for | Server-to-server, your own data | Acting on behalf of a user |
| Setup | JSON key file | Client ID + secret + refresh token |
| Best for | GA4, GSC (your properties) | Gmail sending as user |
| No user interaction | ✅ | ❌ needs browser flow once |

---

## GA4 — Google Analytics Data API

### Install
```bash
npm install @google-analytics/data
```

### Service account setup (one-time)
1. Google Cloud Console → IAM → Service Accounts → Create
2. Download JSON key → save as `service-account.json` in project root
3. GA4 Admin → Property → Account Access Management → Add user (service account email) as Viewer

### lib/ga4.ts singleton
```ts
import { BetaAnalyticsDataClient } from '@google-analytics/data';

let client: BetaAnalyticsDataClient | null = null;

export function getGA4Client() {
  if (!client) {
    client = new BetaAnalyticsDataClient({
      keyFilename: process.env.GA4_KEY_PATH, // e.g. ./service-account.json
    });
  }
  return client;
}

export async function runReport(propertyId: string, options: object) {
  const client = getGA4Client();
  const [res] = await client.runReport({
    property: `properties/${propertyId}`,
    ...options,
  });
  return res;
}
```

### Common GA4 report shapes
```ts
// Sessions + pageviews last 30 days
await runReport(propertyId, {
  dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
  metrics: [
    { name: 'sessions' },
    { name: 'screenPageViews' },
    { name: 'activeUsers' },
    { name: 'bounceRate' },
    { name: 'averageSessionDuration' },
  ],
});

// Traffic sources
await runReport(propertyId, {
  dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
  dimensions: [{ name: 'sessionDefaultChannelGroup' }],
  metrics: [{ name: 'sessions' }],
});

// Top pages
await runReport(propertyId, {
  dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
  dimensions: [{ name: 'pagePath' }],
  metrics: [{ name: 'screenPageViews' }, { name: 'bounceRate' }, { name: 'averageSessionDuration' }],
  orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
  limit: 20,
});

// Real-time active users
const [res] = await client.runRealtimeReport({
  property: `properties/${propertyId}`,
  metrics: [{ name: 'activeUsers' }],
  dimensions: [{ name: 'unifiedScreenName' }],
});
```

### Parse GA4 response rows
```ts
function parseRows(response: any) {
  return response.rows?.map((row: any) => {
    const dims = Object.fromEntries(
      row.dimensionValues.map((d: any, i: number) => [
        response.dimensionHeaders[i].name, d.value
      ])
    );
    const mets = Object.fromEntries(
      row.metricValues.map((m: any, i: number) => [
        response.metricHeaders[i].name, m.value
      ])
    );
    return { ...dims, ...mets };
  }) ?? [];
}
```

---

## Google Search Console API

### Install
```bash
npm install googleapis
```

### OAuth2 setup (one-time browser flow)
```ts
import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GSC_CLIENT_ID,
  process.env.GSC_CLIENT_SECRET,
  process.env.GSC_REDIRECT_URI, // e.g. http://localhost:3000/api/auth/callback
);

// Step 1: Get auth URL (open in browser)
const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://www.googleapis.com/auth/webmasters.readonly'],
});

// Step 2: Exchange code for tokens
const { tokens } = await oauth2Client.getToken(code);
oauth2Client.setCredentials(tokens);
// Save tokens.refresh_token to .env.local — never expires unless revoked
```

### lib/gsc.ts
```ts
import { google } from 'googleapis';

export function getGSCClient() {
  const auth = new google.auth.OAuth2(
    process.env.GSC_CLIENT_ID,
    process.env.GSC_CLIENT_SECRET,
  );
  auth.setCredentials({ refresh_token: process.env.GSC_REFRESH_TOKEN });
  return google.searchconsole({ version: 'v1', auth });
}

export async function getSearchAnalytics(siteUrl: string, days = 30) {
  const gsc = getGSCClient();
  const endDate = new Date().toISOString().split('T')[0];
  const startDate = new Date(Date.now() - days * 86400000).toISOString().split('T')[0];

  const res = await gsc.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate,
      endDate,
      dimensions: ['query'],
      rowLimit: 25,
      dataState: 'all',
    },
  });
  return res.data.rows ?? [];
}
```

---

## Gmail API (send as user)

### Install
```bash
npm install googleapis
```

### Send email
```ts
import { google } from 'googleapis';

export async function sendEmail(auth: any, { to, subject, body }: {
  to: string; subject: string; body: string;
}) {
  const gmail = google.gmail({ version: 'v1', auth });
  const raw = Buffer.from(
    `To: ${to}\r\nSubject: ${subject}\r\nContent-Type: text/plain\r\n\r\n${body}`
  ).toString('base64url');

  await gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw },
  });
}
```

---

## .env.local template
```
# GA4
GA4_KEY_PATH=./service-account.json

# GSC / Gmail OAuth
GSC_CLIENT_ID=
GSC_CLIENT_SECRET=
GSC_REFRESH_TOKEN=
GSC_REDIRECT_URI=http://localhost:3000/api/auth/callback
```

## Common errors
| Error | Fix |
|-------|-----|
| `403 User does not have sufficient permissions` | Add service account email to GA4 property as Viewer |
| `invalid_grant` | Refresh token expired or revoked — re-run OAuth flow |
| `API not enabled` | Enable Analytics Data API in Google Cloud Console |
| `Property not found` | Check `properties/XXXXXXXXX` — no leading zeros, no extra chars |
