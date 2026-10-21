# Makkah and Madina Guide (installable web app)

A step-by-step Umrah, Tawaf and Madina ziyarat guide with duas, Latin letters, audio, and offline use.
Works on any static host (Cloudflare Pages, GitHub Pages, Netlify, or any web server). No build step.

## Files
- `index.html`, `app.js`, `sw-register.js`, `sw.js`, `manifest.webmanifest`, icons: the app
- `_headers`: security headers for Cloudflare Pages and Netlify (GitHub Pages ignores it)
- `robots.txt`, `.nojekyll`, `LICENSE`: do not index, publish as is, all rights reserved (put your name in LICENSE)

## Deploy
**Cloudflare Pages** (works with a private repository): Workers & Pages > Create > Pages > connect the repository.
Framework: None. Build command: empty. Output directory: `/`.
To limit who can open it: Zero Trust > Access > Applications > add this site, then allow only the emails you choose.

**GitHub Pages**: Settings > Pages > deploy from the `main` branch, folder `/ (root)`.
Free accounts need a public repository. The app works under an address like `https://name.github.io/repo/`.

**Netlify**: drag the unzipped folder onto the Deploy manually page.

## Install on a phone
Open the address once while online. Android Chrome: menu > Install app. iPhone Safari: Share > Add to Home Screen.

## Security checklist
1. Turn on two-factor sign-in or a passkey on your hosting and GitHub accounts.
2. Give nobody else write access. Protect the `main` branch (require a pull request).
3. Keep the app free of outside scripts. The policy in `index.html` and `_headers` blocks them and blocks any data being sent out.
4. After deploying, check your address at securityheaders.com.
5. To update, replace the files and push. Phones fetch the new version the next time they open it online.

## Notes
- The app asks for no phone permissions and makes no network requests of its own.
- Saved progress and your own recordings stay in the browser on each phone.
- Content cannot be fully protected from copying. Use Cloudflare Access to limit who can open it.
