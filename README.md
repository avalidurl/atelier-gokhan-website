<div align="center">

# atelier-gokhan-website

### The one-page venture-studio site for **Atelier Gökhan Turhan** — [gokhan.vc](https://gokhan.vc)

A static, zero-JavaScript Astro landing with a neo-brutalist "machine report" look and a canonical, tested link tree.

<p>
  <a href="https://gokhan.vc"><img alt="gokhan.vc" src="https://img.shields.io/website?url=https%3A%2F%2Fgokhan.vc&label=gokhan.vc&style=flat-square" /></a>
  <a href="https://github.com/gokhan-vc/atelier-gokhan-website/commits"><img alt="Last commit" src="https://img.shields.io/github/last-commit/gokhan-vc/atelier-gokhan-website?style=flat-square" /></a>
  <a href="https://github.com/gokhan-vc/atelier-gokhan-website/stargazers"><img alt="Stars" src="https://img.shields.io/github/stars/gokhan-vc/atelier-gokhan-website?style=social" /></a>
</p>

<p>
  <img alt="Astro" src="https://img.shields.io/badge/Astro-6-BC52EE?style=flat-square&logo=astro&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-strict-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img alt="Cloudflare Pages" src="https://img.shields.io/badge/Cloudflare%20Pages-static-F38020?style=flat-square&logo=cloudflare&logoColor=white" />
  <img alt="Vitest" src="https://img.shields.io/badge/tested%20with-Vitest-6E9F18?style=flat-square&logo=vitest&logoColor=white" />
</p>

</div>

---

## What this is

`atelier-gokhan-website` is the source for **[gokhan.vc](https://gokhan.vc)**, the landing page for
Atelier Gökhan Turhan — a small venture studio. It is a deliberately minimal one-pager: a hero
statement plus a **pedigree link tree** grouping the studio's and adjacent domains' social and contact
links, with the usual legal pages (terms, privacy, cookies), a 404, and an empty-by-design blog
collection ready for future posts.

It ships as a **fully static site with no client-side JavaScript** and a strict Content-Security-Policy,
so it loads fast, degrades gracefully, and has a minimal attack surface. Fonts are self-hosted (no
font CDN), and every outbound link is defined once in a typed, unit-tested data file — there are no
hardcoded hrefs scattered through the templates.

## Highlights

- **Zero-JS static output** — Astro renders to plain HTML/CSS; there are no inline `<script>` elements.
- **Strict CSP by default** — `default-src 'self'; script-src 'self'` (no `'unsafe-inline'` for scripts),
  plus HSTS, `X-Frame-Options: DENY`, `frame-ancestors 'none'`, `Referrer-Policy`, a locked-down
  `Permissions-Policy`, and COOP/CORP — enforced via `public/_headers`.
- **Single source of truth for links** — `src/data/links.ts` is the byte-exact link tree; a test suite
  (`tests/links.test.ts`) guards easy-to-miss details (handles, trailing slashes, `mailto:` vs external).
- **Self-hosted variable fonts** — Archivo (display) and Geist Mono (mono) via `@fontsource-variable/*`,
  so no third-party font requests.
- **Design tokens + primitives** — a `tokens.css` palette (accessible accent system) and reusable
  `.tile` / `.sheet` / `.dither-divider` primitives give the "machine report" aesthetic.
- **SEO baked in** — canonical URLs, Open Graph tags, a sitemap, an RSS feed endpoint, and JSON-LD
  structured data (Organization / Person / WebSite) rendered as a non-executable data block.
- **Tested** — Vitest covers the blog helpers, link tree, hero copy, favicon set, design system, and
  site metadata.

## Live

- **Site:** <https://gokhan.vc>
- **Studio:** X [@goekhanvc](https://x.com/goekhanvc) · GitHub [gokhan-vc](https://github.com/gokhan-vc)

## Stack

| Layer     | Choice                                                                                      |
| --------- | ------------------------------------------------------------------------------------------- |
| Framework | [Astro 6](https://astro.build) (static output, Content Layer for the blog)                  |
| Language  | TypeScript (strict)                                                                         |
| Fonts     | [Fontsource](https://fontsource.org) — Archivo Variable + Geist Mono Variable (self-hosted) |
| Feeds/SEO | `@astrojs/rss` + `@astrojs/sitemap`                                                         |
| Hosting   | [Cloudflare Pages](https://pages.cloudflare.com) (static assets + `_headers`)               |
| Tooling   | Prettier (+ `prettier-plugin-astro`), Vitest, `astro check`                                 |

## Develop

Requires Node.js and npm.

```bash
npm install
npm run dev       # Astro dev server on :4321
npm run build     # static output to dist/
npm run preview   # preview the built output (needed for sitemap/headers checks)
npm run check     # astro check (typecheck)
npm run lint      # Prettier check
npm test          # Vitest
```

> The strict CSP and other security headers live in `public/_headers` and are applied by **Cloudflare
> Pages**, not by `astro dev` / `astro preview`. Test header behavior against a Pages deploy.

## Deploy

The site is a static bundle deployed to Cloudflare Pages:

```bash
npm run build
npx wrangler pages deploy dist --project-name=<your-project>
```

Attaching a custom domain and any production go-live is gated on owner approval — contributors deploy
to a `*.pages.dev` preview URL.

## Project layout

```
public/            _headers (CSP + security headers), favicons, og-image.png, robots.txt, brand/
media/             og-image source art
src/
  data/            site.ts (metadata) · links.ts (canonical link tree) · hero.ts (hero copy)
  utils/           blog.ts (pure, testable blog helpers)
  styles/          tokens.css (design tokens) · global.css (primitives)
  layouts/         BaseLayout (head/SEO/JSON-LD) · LegalLayout (legal reading column)
  components/      Header · Footer · LinkTree
  content.config.ts  blog collection schema (Astro Content Layer)
  content/blog/    Markdown posts (ships empty by design)
  pages/           index · terms · privacy · cookies · 404 · blog/* · feed.xml.ts
tests/             links · blog · hero · favicon · design-system · site
docs/              email-routing.md (how to stand up contact@ forwarding)
```

## Security

There is no dedicated `SECURITY.md` yet. Security posture is enforced in code via the strict CSP and
headers in [`public/_headers`](public/_headers) and the zero-inline-script rendering approach described
above. Please report any vulnerability privately to the studio via
[contact@gokhan.vc](mailto:contact@gokhan.vc) rather than opening a public issue.

## Credits & third-party

Built with open-source software — credit to their authors and maintainers:

- **[Astro](https://astro.build)** — web framework · MIT
- **[`@astrojs/rss`](https://www.npmjs.com/package/@astrojs/rss)** and **[`@astrojs/sitemap`](https://www.npmjs.com/package/@astrojs/sitemap)** — official Astro integrations · MIT
- **[Fontsource](https://fontsource.org)** — self-hosted web-font packaging · MIT (font files under their own OFL licenses)
  - **[Archivo](https://fonts.google.com/specimen/Archivo)** by Omnibus-Type · SIL Open Font License 1.1
  - **[Geist Mono](https://vercel.com/font)** by Vercel · SIL Open Font License 1.1
- **[TypeScript](https://www.typescriptlang.org)** · Apache-2.0 · **[Vitest](https://vitest.dev)** · MIT · **[Prettier](https://prettier.io)** (+ `prettier-plugin-astro`) · MIT
- **[Cloudflare Pages](https://pages.cloudflare.com)** and **[Wrangler](https://developers.cloudflare.com/workers/wrangler/)** — hosting & deploy tooling

The neo-brutalist "machine report" aesthetic (hard offset shadows, framed tiles, dither dividers,
monospaced report typography) is inspired by the terminal/engineering-report visual tradition
associated with **[U.S. Graphics Company](https://x.com/usgraphics)**; this repo reimplements the look
from scratch in its own tokens and does not vendor their assets.

## License

This project is licensed under the **MIT License** — remix freely with attribution. See [LICENSE](./LICENSE).
owner** unless and until a license is added. If you want to reuse anything here, contact
[contact@gokhan.vc](mailto:contact@gokhan.vc).
