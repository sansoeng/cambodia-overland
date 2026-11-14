# Cambodia Overland — Architecture (living reference)

**Last verified:** 2026-11-14 · **Verified by:** agent (repo inspection, live dev server, `git remote`, workflow file)
**Audience:** humans and AI agents working in this repo.

> Snapshot of how the site is wired **today**, plus the decisions behind it. Read this before changing
> hosting, ports, CI, or the enquiry flow. Update it in the same commit when the architecture changes.
> Secrets never belong here — names only.

---

## 1. Snapshot

| Piece | Value |
| --- | --- |
| Repo | `github.com/sansoeng/cambodia-overland` |
| Local path | `~/Desktop/cambodia-overland` (canonical; no duplicate copies) |
| Default branch | `main` (also triggers deploy on `production`) |
| Public site | https://cambodiaoverlandtravel.com (prod) · https://staging.cambodiaoverlandtravel.com (staging) |
| Host | **Cloudflare Workers (static assets)** — `cambodia-overland` (main) and `cambodia-overland-staging` (staging branch) |
| CI | `.github/workflows/deploy.yml` — Node 22, pnpm 12, `wrangler deploy` |
| Build output | `dist/` (git-ignored) |
| Backend | **none** |
| CMS | **none** — content is TypeScript (`src/content.tsx`, `blogPosts.ts`, `regions.ts`) |
| Analytics | **none configured** (`site.json` has no `analytics` key; the Vite plugin would inject GA if set) |
| Launch state | `#/` serves `ComingSoonPage` in production (see §4) |

---

## 2. Request flow

```
Visitor
  cambodiaoverlandtravel.com ──DNS (Cloudflare)──▶ Cloudflare Pages project cambodia-overland
  staging.cambodiaoverlandtravel.com ──▶ Cloudflare Pages project cambodia-overland-staging
        └─▶ static bundle (React 19, pre-built by Vite)
              ├─ hash routes  (#/tours, #/about, #/stories/<slug>, …) handled client-side
              ├─ assets       /assets/*, /fonts/*, videos (local mp4 + one CloudFront URL)
              └─ no server calls at runtime

Enquiries
  Contact form   ─▶ validated in the browser ─▶ mailto:hi@cambodiaoverlandtravel.com
  Booking dialog ─▶ Web3Forms POST (only if VITE_WEB3FORMS_ACCESS_KEY was set at build time)
                 └▶ otherwise mailto: fallback
```

There is no API, database, auth, or server-side rendering. Everything is static and client-side.

### Enquiry flow detail

- `src/ContactPage.tsx` validates name / email / message and then hands a pre-filled `mailto:` link to
  the visitor's mail app. It deliberately does not POST anywhere.
- `src/BookingDialog.tsx` reads `import.meta.env.VITE_WEB3FORMS_ACCESS_KEY` **at build time**. When set,
  it POSTs JSON to `https://api.web3forms.com/submit`; when absent (the current state — no `.env` is
  committed) it falls back to `mailto:`. Web3Forms keys are client-visible by design, but still keep
  them in `.env` rather than in source, and never commit `.env` (`.gitignore` covers `.env*`).

---

## 3. Build & hosting

### Production & staging

| | Production | Staging |
| --- | --- | --- |
| Branch | `main` (legacy `production` also deploys) | `staging` |
| Pages project | `cambodia-overland` | `cambodia-overland-staging` |
| Build | `pnpm build` | `pnpm build:staging` |
| Domain | `cambodiaoverlandtravel.com` + `www` | `staging.cambodiaoverlandtravel.com` |
| Indexing | allowed | blocked (robots + `_headers` + meta) |

1. Push to the branch (or dispatch the workflow manually).
2. GitHub Actions installs with pnpm 12, runs `pnpm typecheck`, builds with the right mode.
3. `npx wrangler deploy` (prod) or `npx wrangler deploy --config wrangler.staging.jsonc`.
4. Cloudflare serves the deployment from the static-asset Worker; rollback is `wrangler rollback`.

Staging builds run `scripts/postbuild.mjs`, which rewrites `robots.txt`, writes `_headers` with
`X-Robots-Tag: noindex` and replaces the robots meta tag. Production builds skip it.

Detailed runbook: [`CLOUDFLARE.md`](CLOUDFLARE.md).

### Figma Make helpers (not the production path)

`.figma/make/deploy` and `.figma/make/deploy-preview` run `pnpm build` and then
`figma make deploy --build-dir dist`. These belong to the Figma Make workspace and require the Make
CLI. GitHub Pages is the configured public host; confirm with the owner before using the Make deploy
scripts.

### Local

| Mode | Command | Port |
| --- | --- | --- |
| Dev server | `pnpm dev` | `$PORT` or **8443** |
| Dev when 8443 is taken | `PORT=8444 pnpm dev` | 8444 |
| Production preview | `pnpm preview` | Vite default (4173) |

`vite.config.ts` parses `process.env.PORT || '8443'` for both `server` and `preview`.

**Port collision with BCE:** `~/Desktop/BCE` is a separate site whose dev server also defaults to
8443. Only one can bind. Check ownership before assuming:

```sh
lsof -nP -iTCP:8443 -sTCP:LISTEN
ps -o command= -p <pid>     # expect .../BCE/node_modules/.bin/vite for the other project
```

A 200 response is not proof of identity — verify the page title is
`Cambodia Overland — Expeditions & Adventure Tours`.

---

## 4. Runtime architecture

### Entry and routing

```
index.html
  ├─ inline loader script  → adds .is-loading/.has-loader before paint (skipped for inner pages,
  │                          reduced motion, and in-site #section arrivals)
  ├─ figma:* placeholders  → replaced by the Vite plugin from .figma/make/site.json
  │                          (title, description, lang, icons, OG image, robots)
  └─ <div id="root">       → src/main.tsx
                               ├─ startSmoothScroll()  (Lenis + GSAP ticker)
                               └─ <App/>               (hash router + page transitions)
```

- Routes are a plain object in `App.tsx`; no router dependency.
- `#/stories/<slug>` and `#/regions/<slug>` are prefix-matched and rendered by `BlogPostPage` /
  `RegionPage`.
- Route changes run through an overlay transition (logo assembled from `src/logoParts.ts`). Unknown
  routes fall back to `Home`.
- Deep links must use the hash. `https://…/about` returns a GitHub Pages 404.

### Launch gate

`isStagingEnvironment()` returns true for `localhost`, `127.0.0.1`, `staging.*` hosts,
`?staging` / `?preview` query strings, `#/staging` / `#/preview` hashes, and a remembered
`sessionStorage.cambodia_staging_mode`. Only then does `#/` render the real `Home`; otherwise the
visitor gets `ComingSoonPage`. A fixed `StagingBadge` appears in those modes.

**This is the production switch.** Launching the full site = changing that mapping, not editing CSS.

### Scrolling and motion

- `src/smooth.ts` owns a single Lenis instance, driven by GSAP's ticker so ScrollTrigger stays in
  sync. `prefers-reduced-motion: reduce` disables it entirely.
- `scrollToTarget()` handles in-page `#section` links; `#/route` hashes are left to the router.
- `lockScroll()` is reference-counted so stacked overlays release scrolling only when the last closes.
- Components create GSAP contexts inside `useLayoutEffect` and revert them on unmount.
  `usePinRefresh()` schedules `ScrollTrigger.refresh()` after layout changes.

### Content model

| Content | Source of truth |
| --- | --- |
| Tours (carousel + listing) | `src/content.tsx` → `tours`, `moreTours`, `allTours` |
| Stories (summaries) | `src/content.tsx` → `stories` |
| Story bodies | `src/blogPosts.ts` keyed by slug |
| Regions | `src/regions.ts` (3 slugs) |
| Package itinerary | `src/PackageDetails.tsx` — hard-coded for one trip |
| Images | `src/siteImages.ts` → `public/assets/*` or absolute URLs |
| Contact details | `src/ContactPage.tsx` → `contact` |
| Navigation | `src/SiteNav.tsx` → `primaryNav`, `secondaryNav`, `socials` |
| SEO / title / description | `.figma/make/site.json` + static tags in `index.html` |

---

## 5. Environment matrix

| Variable | Where | Required | Effect when missing |
| --- | --- | --- | --- |
| `PORT` | shell at dev time | no | dev server uses 8443 |
| `SITE_ENV` | build time (`build:staging` sets it) | no | build is treated as production |
| `VITE_WEB3FORMS_ACCESS_KEY` | `.env` / CI secret at build time | no | booking dialog falls back to `mailto:` |
| `CLOUDFLARE_API_KEY` | repo secret + local `.env` | yes (deploy) | `wrangler pages deploy` fails |
| `CLOUDFLARE_EMAIL` | repo secret + local `.env` | yes with a Global key | auth fails |
| `CLOUDFLARE_ACCOUNT_ID` | repo secret + local `.env` | yes | wrangler cannot pick an account |

Cloudflare credentials belong to the **Overland account**, not BCE's. No secrets are stored in the
repo; `.env` is git-ignored (`.env.example` is tracked).

---

## 6. Known issues / follow-ups

1. **Aeonik font preloads** in `index.html` reference files that are not in `public/fonts/` (the site
   actually uses PP Neue Montreal). Harmless 404-free dead weight — remove the preloads.
2. **`#/package` is single-trip.** The page hard-codes the Cambodia Discovery itinerary; the other
   tours have no detail page.
3. **Bundle size.** The main chunk is ~506 kB raw / ~167 kB gzipped and Vite warns above 500 kB.
   Code-splitting `PackageDetails` and the GSAP-heavy sections is the obvious next step.
4. **Hero video is borrowed footage** (`d1z1bhj01il1nu.cloudfront.net`) from the reference design.
   Replace with owned Cambodia footage before launch.
5. **`index.html` `lang` is a placeholder** (`<!-- figma:lang -->`) filled by the plugin from
   `site.json`. Keep both in sync if the language changes.
6. **Sitemap lists hash URLs** with a 2026-11-08 `lastmod`. Regenerate when routes or dates change.

---

## 7. Decision log

| Date | Decision | Why |
| --- | --- | --- |
| 2026-11-14 | **Cloudflare (Workers static assets) with two environments** (prod `main`, staging `staging`) replaces GitHub Pages | Domain DNS already on Cloudflare; BCE uses the same model; staging needs a real isolated deploy with noindex; Cloudflare retired standalone Pages so new projects are Workers |
| 2026-11-14 | Overland Cloudflare is managed with the shared sansoeng16 Global API key; `CLOUDFLARE_ACCOUNT_ID` selects the Overland account | The account was granted full access; one credential, explicit account pinning, no second secret to rotate |
| 2026-11-14 | Staging noindex enforced at three layers (`robots.txt`, `_headers`, meta) | A single mechanism is too easy to bypass or forget |
| 2026-11-14 | Removed the old staging **proxy Worker** (`staging…/*` route + `100::` record) that re-fetched production | It duplicated production content with no isolation; replaced by a real staging build |
| 2026-11-14 | Canonical repo is `~/Desktop/cambodia-overland`; duplicate `cambodia-overland 2` and the Nov-10 zip removed | The duplicate was a git-less copy with byte-identical `src/`; the real repo already had history, a remote, and CI |
| 2026-11-14 | Docs restructured: this file + a project-specific `AGENTS.md` + a global agent map | Prior guide was generic Figma Make scaffold text that described neither the site nor the deploy path |
| pre-existing | Hash routing, no router library | GitHub Pages has no rewrite rules; hash routes need no 404 hack |
| pre-existing | Static content in TypeScript | No backend budget; editor-friendly and type-checked |

---

## Updating this file

Change it in the same commit when you: alter hosting/CI, add an env var or backend, change the launch
gate, change ports, or add/remove a top-level tool. Keep the snapshot table first and append to the
decision log rather than rewriting history.
