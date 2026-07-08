# Dazzen — Launching Soon

Static, dependency-free landing page (`index.html` + `styles.css` + `script.js`). No build step.

## Local preview

```
cd dazzen-landing
python3 -m http.server 8000
```

Open `http://localhost:8000`.

## Editing content

Copy, benefits, and philosophy pillars live directly in `index.html`. Site-wide settings live at the top of `script.js`:

```js
const CONFIG = {
  launchDate: '2026-10-15T00:00:00+05:30', // countdown target — update when a real date is set
  showCountdown: true,                      // set false to hide the countdown section
  waitlistEndpoint: '...',                  // POST target for signups (see below)
};
```

## Waitlist data

Both signup forms (hero card and the closing CTA) POST `{ firstName, email, phone, timestamp, source }` as JSON to `CONFIG.waitlistEndpoint`, and duplicate-check by email using the browser's `localStorage` (`dazzen_waitlist` key) as a client-side guard.

This build is wired to a Google Apps Script Web App backed by a Google Sheet (columns: Name, Email, Phone, Timestamp, Source), matching the setup from the design chat. To view signups, open that Sheet directly.

**If you need to change the endpoint** (new Sheet, different backend, etc.), update `waitlistEndpoint` in `script.js`. The Apps Script side:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
  var data = JSON.parse(e.postData.contents);
  sheet.appendRow([
    data.firstName || '',
    data.email || '',
    data.phone || '',
    data.timestamp || new Date().toISOString(),
    data.source || ''
  ]);
  return ContentService.createTextOutput(JSON.stringify({ status: 'success' })).setMimeType(ContentService.MimeType.JSON);
}
```

Deploy via **Deploy → Manage deployments → New version** whenever `Code.gs` changes — Apps Script Web Apps freeze to whatever code existed at the last deployment, so edits alone won't go live.

Other backend options (code comments in `script.js` have the same notes):
- **Supabase / a serverless function**: point `waitlistEndpoint` at your function; keep `SUPABASE_URL`/`SUPABASE_ANON_KEY` server-side only.
- **Formspree / Basin**: create a form endpoint at formspree.io or usebasin.com and paste its URL in directly — no server code needed.

## Deployment

**Vercel**
1. `npx vercel` from this folder (or connect the repo in the Vercel dashboard) and deploy — no build command needed, output directory is `.` (or set to this folder if it's a subdirectory of a larger repo).
2. Project → Settings → Domains → add `dazzen.in` (and `www.dazzen.in`), then set the DNS records Vercel gives you at your domain registrar.

**Netlify**
1. Drag-and-drop this folder into Netlify, or connect the repo (build command: none, publish directory: this folder).
2. Site settings → Domain management → add custom domain `dazzen.in`, then update DNS at your registrar per Netlify's instructions (either Netlify DNS or an A/CNAME record).

DNS changes can take up to 24–48 hours to propagate globally.

## Assets

- `assets/images/dazzen-logo.png` — brand mark, used in nav and footer (unaltered from the original upload).
- `assets/images/philosophy.webp` / `.jpg` — philosophy-section image (compressed from the original design export; WebP served first, JPEG fallback via `<picture>`).

Note: the original design project also contains an unused product-bottle-lineup image (`percentation-image-mr6mlnmj.png`) that was never placed in the final design — it's not included here. Add it later if you want it somewhere on the page.
