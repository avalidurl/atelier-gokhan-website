# atelier-gokhan-website

Astro **static** site for the **Atelier Gökhan Turhan** venture-studio one-pager
([gokhan.vc](https://gokhan.vc)), deployed to **Cloudflare Pages**. Neo-brutalist "machine report"
aesthetic with a lilac-purple / rose / green accent system and self-hosted Archivo.

## Scripts

- `npm run dev` — Astro dev server on `:4321`
- `npm run build` — static output to `dist/`
- `npm run preview` — preview the built output on `:4173` (needed for sitemap/headers checks)
- `npm run check` — `astro check` (typecheck)
- `npm run lint` — Prettier check
- `npm test` — Vitest

## Structure

```
public/            _headers (CSP), favicon.svg + PNG fallbacks, og-image.png, robots.txt
media/             og-image.svg (source for og-image.png; rasterize with rsvg-convert)
src/
  data/            site.ts (metadata) · links.ts (canonical per-domain link tree — single source of truth)
  utils/           blog.ts (pure, testable blog helpers)
  styles/          tokens.css (design tokens) · global.css (primitives: .tile/.sheet/.dither-divider)
  layouts/         BaseLayout (head/SEO/JSON-LD) · LegalLayout (legal reading column)
  components/        Header · Footer · LinkTree
  content.config.ts  blog collection schema (Astro 6 Content Layer — MUST be at src/content.config.ts)
  content/blog/    Markdown posts (ships empty by design)
  pages/           index · terms · privacy · cookies · 404 · blog/index · blog/[...slug] · feed.xml.ts
tests/             links · blog · hero · favicon · design-system · site
docs/              email-routing.md (how to stand up contact@ forwarding)
```

## Design system

- **Neutrals:** `--bg #e7e7e7` · `--paper #fff` · `--ink #141414` · `--muted #7c7c7c` · hairlines.
- **Accents:** `--accent-purple #8466C4` (PRIMARY — links/emphasis), `--accent-rose #E06699`,
  `--accent-green #1F9E6B`. Accessibility: purple is the only accent that clears ~AA for normal
  text on white; **rose/green are reserved for large text, borders, and UI accents only.**
- **Primitives:** hard offset shadow `2px 2px 0`, framed tiles, dither divider, press-down `:active`.
- **Type:** Archivo (variable), self-hosted via `@fontsource-variable/archivo` — no font CDN.

## Security headers / CSP (`public/_headers`)

Strict, enforced by Cloudflare Pages (not by `astro dev`/`preview`):
`default-src 'self'; script-src 'self'` (no `'unsafe-inline'`); `style-src 'self' 'unsafe-inline'`
(Astro scoped styles); `font-src 'self'`; `img-src 'self' data:`; `frame-ancestors 'none'`; plus
HSTS, `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, Permissions-Policy,
COOP/CORP. There are **no inline `<script>`** elements; the JSON-LD block is a
`type="application/ld+json"` data block (not executable JS, so it does not violate `script-src`).

## Deploy (staging only by default)

```bash
npm run build
npx wrangler pages deploy dist --project-name=<project>
```

Uses `CLOUDFLARE_DEPLOY_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` from `the operator environment`.
**Founder-gated:** attaching the `gokhan.vc` custom domain and any production go-live require
explicit owner approval — deploy to the `*.pages.dev` staging URL only unless told otherwise.

## Contact email

`mailto:contact@gokhan.vc` is wired everywhere. Receiving mail (forward to
`operator@example.invalid` via Cloudflare Email Routing) is founder-gated — see
[`docs/email-routing.md`](docs/email-routing.md).
