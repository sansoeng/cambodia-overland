# Cloudflare — staging & production

How the site is hosted, and the exact steps to stand up or recover an environment.
Read with [`ARCHITECTURE.md`](ARCHITECTURE.md).

---

## 1. Accounts & projects

| | Production | Staging |
| --- | --- | --- |
| Cloudflare account | `e4cdc4b38fac7bca7ed64cf4b72f0b15` — *Cotcambodiaoverland@gmail.com's Account* | same |
| Worker (static assets) | `cambodia-overland` | `cambodia-overland-staging` |
| Default URL | https://cambodia-overland.cambodia-overland.workers.dev | https://staging.cambodiaoverlandtravel.com |
| Custom domain | `cambodiaoverlandtravel.com`, `www` — attached | `staging.cambodiaoverlandtravel.com` — attached |
| Git branch | `main` / `production` | `staging` |
| Config | `wrangler.jsonc` | `wrangler.staging.jsonc` |
| Build | `pnpm build` | `pnpm build:staging` |
| Indexing | allowed | **blocked** |

Cloudflare retired standalone Pages: new projects are static-asset **Workers** (Pages-compatible).
Both sites are therefore deployed with `wrangler deploy`, not `wrangler pages deploy`.

### Who can manage it

The zone and both Workers live in the **Overland account**. That account is managed with the
**sansoeng16@gmail.com Global API key**, which has full access to both accounts:

```sh
# proves the key sees both accounts
curl -s https://api.cloudflare.com/client/v4/accounts \
  -H "X-Auth-Email: $CLOUDFLARE_EMAIL" -H "X-Auth-Key: $CLOUDFLARE_API_KEY"
```

BCE's `.env` holds that key; `cambodia-overland/.env` (git-ignored) copies the key/email and pins
`CLOUDFLARE_ACCOUNT_ID` to the Overland account:

```
CLOUDFLARE_API_KEY=…
CLOUDFLARE_EMAIL=sansoeng16@gmail.com
CLOUDFLARE_ACCOUNT_ID=e4cdc4b38fac7bca7ed64cf4b72f0b15
```

A key issued by the Overland account itself (`cotcambodiaoverland@gmail.com`) also works, but the
shared key is the one the team uses.

### Why staging is un-indexable

`pnpm build:staging` runs Vite with `SITE_ENV=staging`, then `scripts/postbuild.mjs`:

- rewrites `dist/robots.txt` to `Disallow: /`
- writes `dist/_headers` with `X-Robots-Tag: noindex, nofollow`
- replaces the `robots` meta tag in `dist/index.html` with `noindex, nofollow`

Verified live: the staging host returns `x-robots-tag: noindex, nofollow` and serves
`Disallow: /`. Production builds are untouched (`index, follow`).

---

## 2. GitHub Actions secrets

Repository → **Settings → Secrets and variables → Actions**:

| Secret | Required | Value |
| --- | --- | --- |
| `CLOUDFLARE_API_KEY` | yes | sansoeng16@gmail.com Global API key |
| `CLOUDFLARE_EMAIL` | yes | `sansoeng16@gmail.com` |
| `CLOUDFLARE_ACCOUNT_ID` | yes | `e4cdc4b38fac7bca7ed64cf4b72f0b15` |
| `VITE_WEB3FORMS_ACCESS_KEY` | no | enables the booking form POST; without it the dialog opens `mailto:` |

`.github/workflows/deploy.yml` builds per branch and deploys with the matching wrangler config.

---

## 3. Setup / recovery

```bash
# Authenticate (only needed locally; CI uses secrets)
cd ~/Desktop/cambodia-overland
set -a; . ./.env; set +a
npx wrangler whoami        # account must show the Overland account

# Create the Workers if they ever disappear
npx wrangler deploy --config wrangler.staging.jsonc   # creates cambodia-overland-staging
npx wrangler deploy                                   # creates cambodia-overland

# Manual deploys
pnpm deploy:staging       # build:staging + wrangler deploy --config wrangler.staging.jsonc
pnpm deploy               # build + wrangler deploy (production)
```

`wrangler.staging.jsonc` contains the staging custom domain as a `routes` entry with
`custom_domain: true`, so deploying creates/keeps the DNS record and certificate automatically.

### History note

Before this setup, `staging.cambodiaoverlandtravel.com` was an 806-byte **proxy Worker** that
re-fetched `cambodiaoverlandtravel.com` on every request (plus a `100::` AAAA record and a
`staging…/*` worker route). That was removed on 2026-11-14 in favour of the real staging Worker.
The old script is backed up outside the repo; nothing else used it.

---

## 4. Production cutover (done 2026-11-14)

The apex and `www` previously pointed at GitHub Pages. On 2026-11-14 they were moved to the
production Worker:

1. Production routes were added to `wrangler.jsonc` (`cambodiaoverlandtravel.com` and
   `www.cambodiaoverlandtravel.com`, both `custom_domain: true`).
2. The four proxied apex `A` records (`185.199.10x.153`) and the `www` CNAME
   (`sansoeng.github.io`) were deleted — Workers custom domains refuse to attach over them.
3. `wrangler deploy` created the Worker custom domains and the `100::` proxy records.
4. Verified: apex returns 200 with `index, follow`, the coming-soon gate still renders, no
   `x-github-request-id` headers, staging unaffected.
5. GitHub Pages was disabled (`DELETE /repos/{owner}/{repo}/pages` → 204; the API now returns 404).

**Rollback:** remove the two custom-domain routes, restore apex `A` records `185.199.108.153`,
`185.199.109.153`, `185.199.110.153`, `185.199.111.153` (proxied) and the `www` CNAME to
`sansoeng.github.io` (proxied), then re-enable Pages in the repo settings. GitHub Pages must be
re-enabled first (the last deployed artifact is gone once disabled).

**Rollback of a bad Worker deploy:** `npx wrangler rollback` (or Dashboard → Workers →
deployments → choose a version). Assets versions are retained.

---

## 5. DNS records that matter

| Record | Purpose |
| --- | --- |
| `staging` → Worker custom domain (auto) | staging site |
| `_dmarc`, `selector1/2._domainkey` | Microsoft 365 mail — do not touch |
| `MX` → `…mail.protection.outlook.com` | mail — do not touch |
| `_github-pages-challenge-…` TXT | legacy GH Pages domain proof — safe to remove after cutover |
| apex A / `www` CNAME | GitHub Pages today, Workers after cutover |

---

## 6. Checklist

- [x] Staging Worker created and deployed
- [x] `staging.cambodiaoverlandtravel.com` attached, serving the staging build
- [x] Staging returns `X-Robots-Tag: noindex` and `robots.txt` says `Disallow: /`
- [x] Production Worker deployed on its `workers.dev` URL with `index, follow`
- [x] `staging` branch pushed → CI green (run 43582755424, 2026-11-14)
- [x] Repo secrets added (`CLOUDFLARE_API_KEY`, `CLOUDFLARE_EMAIL`, `CLOUDFLARE_ACCOUNT_ID`)
- [x] Apex + `www` cut over from GitHub Pages (2026-11-14)
- [x] GitHub Pages disabled after cutover
