// Post-build adjustments for Cloudflare Pages.
//
// Production builds are left exactly as Vite emitted them.
// Staging builds are made un-indexable at three levels:
//   1. dist/robots.txt     -> Disallow: /
//   2. dist/_headers       -> X-Robots-Tag: noindex (Cloudflare Pages reads this file)
//   3. dist/index.html     -> <meta name="robots" content="noindex, nofollow">
//
// Usage: SITE_ENV=staging node scripts/postbuild.mjs

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const dist = join(process.cwd(), 'dist')
const env = process.env.SITE_ENV ?? 'production'

if (!existsSync(join(dist, 'index.html'))) {
  console.error('[postbuild] dist/index.html not found — run vite build first')
  process.exit(1)
}

if (env !== 'staging') {
  console.log('[postbuild] production build — no changes')
  process.exit(0)
}

writeFileSync(join(dist, 'robots.txt'), 'User-agent: *\nDisallow: /\n')

const headersPath = join(dist, '_headers')
const noindex = '/*\n  X-Robots-Tag: noindex, nofollow\n'
// Keep any headers already written by other tooling, then add ours once.
const existing = existsSync(headersPath) ? readFileSync(headersPath, 'utf8') : ''
writeFileSync(headersPath, existing.includes('X-Robots-Tag') ? existing : `${existing}${existing && !existing.endsWith('\n') ? '\n' : ''}${noindex}`)

const htmlPath = join(dist, 'index.html')
let html = readFileSync(htmlPath, 'utf8')
const robotsTag = '<meta name="robots" content="noindex, nofollow" />'
if (/<meta[^>]*name="robots"[^>]*>/i.test(html)) {
  // The site.json plugin injects "index, follow" — replace it, don't add a second tag.
  html = html.replace(/<meta[^>]*name="robots"[^>]*>/i, robotsTag)
} else {
  html = html.replace('</head>', `    ${robotsTag}\n  </head>`)
}
writeFileSync(htmlPath, html)

console.log('[postbuild] staging build — robots.txt, _headers and meta noindex written')
