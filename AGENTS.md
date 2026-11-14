# AGENTS.md — Cambodia Overland Travel

Developer and AI-agent context for the **Cambodia Overland Travel** marketing site
(https://cambodiaoverlandtravel.com). Read this before changing code; read
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) before touching deployment, ports, or CI.

> This file replaced the generic Figma Make scaffold notes on 2026-11-14. It describes what the
> code actually does. If you find a contradiction, **trust the code**, then fix this file in the
> same commit.

---

## 1. What this is

A single-page React marketing site for a Cambodian overland tour operator: tour packages, regional
guides, editorial stories, an about page, ethical-tourism page, contact, and legal pages.

- **Production domain:** https://cambodiaoverlandtravel.com (also serves `*.pages.dev`-style previews via GH Pages)
- **GitHub:** https://github.com/sansoeng/cambodia-overland
- **Default branch:** `main` (pushes to `main` deploy to production — see §7)
- **Language:** English only (`site.json` → `language: "en"`). The `lang` attribute is injected by a Vite plugin, not hard-coded.

This project is **not** affiliated with `~/Desktop/BCE` (Battambang Construction & Engineering), even
though both share the same Figma Make scaffold, Tailwind v4, and port defaults. Do not cross-edit.

---

## 2. Commands

| Task | Command |
| --- | --- |
| Dev server | `pnpm dev` (port `$PORT`, default **8443**) |
| Dev on a free port | `PORT=8444 pnpm dev` |
| Production build | `pnpm build` → `dist/` |
| Staging build | `pnpm build:staging` → `dist/` (noindex) |
| Preview the build | `pnpm preview` |
| Type check | `pnpm typecheck` (`tsc --noEmit`) |
| Format | `pnpm format` (`oxfmt`) |

Toolchain is pinned in `.mise.toml`: Node 22, pnpm latest. Use **pnpm** — `pnpm-lock.yaml` is the
source of truth and CI fails the cache step without it.

There are **no tests and no linter** configured. `pnpm typecheck` plus a manual browser check is the
expected verification.

### Ports — read before starting a server

- This repo's Vite config reads `process.env.PORT || '8443'`.
- `~/Desktop/BCE` also defaults to **8443**. If BCE's server is already running, `pnpm dev` here will
  fail or silently bind elsewhere.
- Check first: `lsof -nP -iTCP:8443 -sTCP:LISTEN`. If it belongs to BCE
  (`ps -o command= -p <pid>`), run this project with `PORT=8444 pnpm dev`.
- Never assume a server on 8443 is this app. Verify the page title is
  **"Cambodia Overland — Expeditions & Adventure Tours"**.

---

## 3. Stack

- **React 19** + **React DOM 19**
- **Vite 8** with `@vitejs/plugin-react`
- **TypeScript 5.9** (`strict: true`, `noEmit`), path alias `@/*` → `src/*`
- **Tailwind CSS v4** via `@tailwindcss/vite` — no `tailwind.config.js`, no PostCSS config. Theme
  and `@font-face` rules live in `src/index.css`.
- **GSAP 3.15** + ScrollTrigger — all scroll choreography
- **Lenis 1.3** — smooth scrolling
- **figma-squircle** — apple-style rounded corners
- **oxfmt** — formatting

---

## 4. Architecture at a glance

### Routing (hash-based, hand-rolled)

There is no router library. `src/App.tsx` keeps `route` in state and syncs it with
`window.location.hash` on `hashchange`:

```ts
const pages = {
  '#/':            isStaging ? Home : ComingSoonPage,
  '#/home':        Home,
  '#/coming-soon': ComingSoonPage,
  '#/maintenance': ComingSoonPage,
  '#/package':     PackageDetails,
  '#/tours':       ToursPage,
  '#/stories':     BlogPage,
  '#/about':       AboutPage,
  '#/ethical-tourism': EthicalTourismPage,
  '#/contact':     ContactPage,
  '#/privacy':     PrivacyPage,
  '#/terms':       TermsPage,
}
```

Dynamic routes are matched by prefix, not in the map:

| URL | Component |
| --- | --- |
| `#/stories/<slug>` | `BlogPostPage` (slug → `src/blogPosts.ts`) |
| `#/regions/<slug>` | `RegionPage` (slug → `src/regions.ts`) |

**Critical:** the homepage is behind a launch gate. `#/` renders `ComingSoonPage` on production and
`Home` only when `isStagingEnvironment()` is true — i.e. `localhost`, `127.0.0.1`, a `staging.*`
host, `?staging` / `?preview`, `#/staging`, `#/preview`, or a remembered
`sessionStorage.cambodia_staging_mode`. The staging banner (`StagingBadge`) appears in those modes.
To see the real homepage locally, just use `localhost`.

### Page transitions

`App.tsx` owns a full-screen overlay (`ptx`) that animates the logo (built from pieces in
`src/logoParts.ts`), swaps the route, and reveals the new page. The overlay must stay mounted; route
changes go through the `swap()` helper so scroll resets and the transition run together. The initial
page load is handled separately by the inline loader script in `index.html` (adds `is-loading` /
`has-loader` before paint, skipped for inner pages, `prefers-reduced-motion`, and in-site `#section`
arrivals).

### Component map

| File | Responsibility |
| --- | --- |
| `src/main.tsx` | Entrypoint: imports `index.css`, mounts `App` into `#root` |
| `src/App.tsx` | Route table, transitions, home page composition, staging badge |
| `src/Hero.tsx` | `HeroLine`, `PageHero`, `WordTitle`, `useHeroScroll` |
| `src/sections.tsx` | Home sections: `Community`, `Purpose`, `Stories`, `PlanTrip`, `Footer`, `PillButton`, carousel helpers |
| `src/motion.tsx` | Shared motion primitives: `Reveal`, `StickyFeatures`, `ScrollRevealText`, `useSquircles`, `usePinRefresh`, `useTitleReveal`, `useFloatingLabel`, `Feature` type |
| `src/smooth.ts` | Lenis singleton: `getLenis`, `lockScroll`, `scrollToTarget` |
| `src/PackageDetails.tsx` | The single hard-coded itinerary page at `#/package` (Cambodia Discovery). It does **not** read a tour id — adding a second package means templating it first |
| `src/BookingDialog.tsx` | `BookingProvider`, `useBooking`, `BookButton` — enquiry modal |
| `src/ListingPages.tsx` | `ToursPage` (`#/tours`), `BlogPage` (`#/stories`) |
| `src/RegionPage.tsx` | One region page from `regions.ts` |
| `src/BlogPostPage.tsx` | One article from `blogPosts.ts` |
| `src/AboutPage.tsx`, `EthicalTourismPage.tsx`, `ContactPage.tsx`, `LegalPage.tsx`, `ComingSoonPage.tsx`, `Faq.tsx`, `Reviews.tsx` | Static pages / sections |
| `src/RouteMap.tsx` + `src/cambodiaGeo.ts` | SVG route map; geo paths and lon/lat→SVG projection |
| `src/SiteNav.tsx` | Header nav, `primaryNav`, `secondaryNav`, `socials` |
| `src/siteImages.ts` | **Every image path in one place** |

### Content lives in TypeScript, not a CMS

| File | Contains |
| --- | --- |
| `src/content.tsx` | `tours` (home carousel), `moreTours` (tours page only), `allTours`, `TourCard`, `stories`, `StoryCard`, `formatDate` |
| `src/blogPosts.ts` | Long-form article bodies keyed by story slug |
| `src/regions.ts` | The three regions (`culture-history`, `eco-east`, `southern-coast`) |
| `src/siteImages.ts` | Image map; use `a('file.webp')` for `public/assets/*` or a full URL |
| `src/ContactPage.tsx` → `contact` | Phone, email, address, social links |
| `src/SiteNav.tsx` | Navigation labels and hrefs |

When adding a tour, add it to `content.tsx` (`tours` for the homepage carousel, `moreTours` for the
tours page only). The `#/package` page is currently written for one trip; making it data-driven is a
separate refactor. When adding an article, create the summary in `content.tsx` (`stories`) and the
body in `blogPosts.ts` under the same slug.

### Styling rules

- Tailwind utilities in JSX; global element styles and `@font-face` in `src/index.css`.
- Global element styles belong inside `@layer base { … }` — CSS outside a cascade layer beats every
  Tailwind utility regardless of specificity.
- Fonts: `public/fonts/PP_Neue_Montreal-{Book,Medium}.woff2` are declared in `index.css`. `index.html`
  also loads Google fonts (Hanuman, Kantumruy Pro, Noto Sans/Serif Khmer) and **preloads Aeonik
  files that do not exist in `public/fonts/`** — harmless but dead weight; remove those preloads if
  you touch that block.
- Images: everything under `public/assets/`; WebP first. Remote video lives on a CloudFront URL in
  `siteImages.ts` (`heroVideo.full`) — replace with owned footage before launch.

---

## 5. Repository layout

```
cambodia-overland/
├── index.html              # Vite shell + inline loader + SEO meta (figma:* placeholders injected by plugin)
├── vite.config.ts          # React, Tailwind, Figma Make preview plugins, PORT handling
├── .figma/make/site.json   # Title, description, language, icons, OG image, robots
├── .github/workflows/deploy.yml  # GitHub Pages deploy on push to main/production
├── docs/ARCHITECTURE.md    # Living infrastructure snapshot
├── public/
│   ├── CNAME               # cambodiaoverlandtravel.com
│   ├── assets/             # Photos, brand SVGs, hero video previews
│   ├── fonts/              # PP Neue Montreal woff2
│   ├── robots.txt, sitemap.xml
└── src/                    # See component map above
```

`dist/` is build output and is git-ignored. `.figma/` and the Make plugins in `vite.config.ts`
power the Figma Make preview; treat them as generated — edit only when the preview itself is broken.

---

## 6. Invariants — do not break these

1. **`#/` stays gated.** Production must keep showing `ComingSoonPage` until launch. Never remove
   `isStagingEnvironment()` or flip the `#/` mapping.
2. **`public/CNAME` must stay `cambodiaoverlandtravel.com`**, or GitHub Pages unbinds the domain.
3. **Hash routing only.** Deep links like `/about` 404 on GitHub Pages. Use `#/about`.
4. **No router library.** Adding one means rewriting `App.tsx` transitions — don't.
5. **Lenis owns scrolling.** Use `scrollToTarget()` / `getLenis()` from `smooth.ts` instead of
   `window.scrollTo`, and `lockScroll(true/false)` while a dialog is open.
6. **One DOM node per animation.** GSAP timelines are created in `useLayoutEffect`; always clean up
   with `gsap.context()` / `ctx.revert()` and call `ScrollTrigger.refresh()` after layout changes
   (`usePinRefresh` exists for this).
7. **Respect reduced motion.** Every new scroll animation must no-op under
   `prefers-reduced-motion: reduce`.
8. **Content is typed.** `Tour`, `Story`, `Region`, `BlogPost` shapes are exported; keep new data
   conforming rather than casting to `any`.

---

## 7. Deployment — two environments

Full details, secrets and the cutover checklist: [`docs/CLOUDFLARE.md`](docs/CLOUDFLARE.md).

| | Production | Staging |
| --- | --- | --- |
| Host | Cloudflare Worker (static assets) `cambodia-overland` | Cloudflare Worker `cambodia-overland-staging` |
| Branch | `main` / `production` | `staging` |
| URL | `cambodiaoverlandtravel.com` (+ `www`) | `staging.cambodiaoverlandtravel.com` |
| Config | `wrangler.jsonc` | `wrangler.staging.jsonc` |
| Build | `pnpm build` | `pnpm build:staging` (adds noindex) |
| Indexing | allowed | **blocked** |

- **Cloudflare account:** `e4cdc4b38fac7bca7ed64cf4b72f0b15` (Overland's own account). It is managed
  with the sansoeng16@gmail.com Global API key, which has access to both this and BCE's account.
  The key/email live in the git-ignored `.env`; `CLOUDFLARE_ACCOUNT_ID` must be the Overland one.
- **CI:** `.github/workflows/deploy.yml` — Node 22, pnpm 12, `pnpm typecheck`, build per branch, then
  `wrangler deploy` (with `--config wrangler.staging.jsonc` for staging). Repo secrets:
  `CLOUDFLARE_API_KEY`, `CLOUDFLARE_EMAIL`, `CLOUDFLARE_ACCOUNT_ID`, optional
  `VITE_WEB3FORMS_ACCESS_KEY`.
- **Manual deploy:** `pnpm deploy:staging` / `pnpm deploy`.
- **Do not push to `main` casually** — it deploys production. Use the `staging` branch for anything
  unverified; staging is live at `staging.cambodiaoverlandtravel.com`.
- **Legacy:** production used to be served by GitHub Pages. The apex and `www` were cut over to this
  Worker on 2026-11-14, Pages was disabled, and the leftover `public/CNAME` was removed.
  Cutover/rollback details: `docs/CLOUDFLARE.md` §4.
- **Rollback:** `npx wrangler rollback`, or Dashboard → Worker → deployments.
- **Local `pnpm build` writes `dist/`**; it is ignored by git. Don't commit it.

---

## 8. Working agreements

- Verify in the browser before claiming a UI change works. Check the console for errors and confirm
  the page title, not just a 200 status.
- Prefer small, targeted edits. This is a design-heavy codebase; keep the existing naming
  (`pd__*`, `ptx__*`, section classes) and file-per-section structure.
- Run `pnpm format` on files you substantially touch (oxfmt).
- When you change architecture, infra, ports, or the deploy path, update
  [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) in the same commit.
- Never commit secrets. There are none today; `CONTACT` details are public by design.
