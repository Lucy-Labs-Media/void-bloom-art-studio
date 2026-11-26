# Void Bloom Art Studio website

A static GitHub Pages site. Plain HTML, CSS and JavaScript. No build step, no framework, no npm.

All rights reserved. See LICENSE.md.

## Structure

```
index.html              Home: hero, collection, partnerships, Art Studio IQ "coming soon", about, contact
art-studio-iq/index.html Page for artists with the full waitlist form (#beta)
style.css               All styles. Every color is a variable in :root (Studio Palette, light and dark)
script.js               Cookie consent, Reading comfort, form checks and sending, inquiry prefill
assets/                 Six images, each as 800 and 1600 px WebP plus a 1600 px JPEG fallback
site-copy/              Lindsey's words for the Art Studio IQ sections (she writes these)
tools/check-todos.sh    Lists placeholders still on the site
.nojekyll               Tells GitHub Pages to serve the files as they are
```

Every internal link and asset path is relative, because the site is served from a project path.

## Before you share the link

1. Run `bash tools/check-todos.sh`. It must print "No placeholders left."
2. Paste the real Web3Forms access key over every `value="YOUR_ACCESS_KEY_HERE"` (4 hidden fields: contact, coming-soon signup and its second step on the home page, and the beta form on the Art Studio IQ page). Send a test from each form.
3. Confirm the GA4 ID `G-Y1MWXMB71H` belongs to this site, or replace it.
4. Confirm the TikTok link `@fullsignal_` belongs to Void Bloom, or remove it.
5. Confirm the site address. The files assume https://lucy-labs-media.github.io/void-bloom-art-studio/ (canonical, og tags and form redirects). Search for `lucy-labs-media.github.io/void-bloom-art-studio` and replace it everywhere if the repo name is different.
6. Add the privacy page (phase W4) and link it from the footer before the Google Play closed test.

## Where the names appear

Business name "Void Bloom Art Studio": `index.html` (title, meta tags, brand, footer), `art-studio-iq/index.html` (brand, footer).
App name "Art Studio IQ": `index.html` (the coming-soon section, form text, footer link), `art-studio-iq/index.html`, `site-copy/art-studio-iq.md`, `script.js` (event name only).
Site address: see step 5.

## Forms

All forms post to Web3Forms. The coming-soon form and the beta form send the person's phone type (Android, iPhone or Both), where they came from (`source`, UTM values, referrer) and, in a second optional step, what they make. Scout can count the phone answers to check the iPhone gate in the build plan.

## Accessibility

WCAG 2.2 AA target: skip link, landmarks, visible focus, 4.5:1 text contrast in light, dark and Reading comfort modes, reduced motion respected, labeled form fields with error text.
