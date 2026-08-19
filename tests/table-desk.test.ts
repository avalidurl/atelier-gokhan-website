import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(__dirname, '..');
const post = readFileSync(resolve(ROOT, 'src/content/blog/raises-august-2026.md'), 'utf8');
const desk = readFileSync(resolve(ROOT, 'public/table-desk.js'), 'utf8');
const layout = readFileSync(resolve(ROOT, 'src/layouts/BaseLayout.astro'), 'utf8');
const css = readFileSync(resolve(ROOT, 'src/styles/global.css'), 'utf8');

describe('raises post: attributable links', () => {
  const required = [
    'https://www.etched.com',
    'https://higgsfield.ai',
    'https://groq.com',
    'https://wisprflow.ai',
    'https://www.gravisrobotics.com',
    'https://www.terraindustries.co',
    'https://www.databricks.com',
    'https://lovable.dev',
    'https://www.clearjet.com',
    'https://www.cambridgeaerospace.com',
    'https://www.thriveholdings.com',
    'https://www.wordsmith.ai',
    'https://www.neros.tech',
    'https://www.moove.io',
    'https://www.happyrobot.ai',
    'https://www.groundedevs.com',
    'https://www.getmoss.com',
    'https://www.reachcapital.com',
    'https://www.quantumlight.com',
    'https://www.accel.com',
    'https://legora.com',
    'https://www.tekever.com',
    'https://www.intel.com',
    'https://kalshi.com',
    'https://www.janestreet.com',
    'https://www.nvidia.com',
    'https://openai.com',
    'https://www.coatue.com',
    'https://www.blackstone.com',
    'https://www.mgx.ae',
    'https://www.troweprice.com',
    'https://www.sixthstreet.com',
    'https://www.d1cap.com',
    'https://www.altimeter.com',
    'https://a16z.com',
    'https://group.softbank',
    'https://menlovc.com',
    'https://dst.global',
    'https://thrivecap.com',
    'https://electric-sql.com',
    'https://pglite.dev',
    'https://www.theinformation.com',
    'https://techcrunch.com/2026/08/18/etcheds-valuation-doubles-to-21b-in-a-month/',
    'https://techcrunch.com/2026/08/17/groq-raises-350m-to-fuel-its-pivot-from-ai-chips-to-neocloud/',
    'https://www.bloomberg.com/news/articles/2026-08-12/ai-coding-startup-lovable-raises-400-million-at-13-3-billion-valuation',
    'https://www.ft.com/content/8202960d-ec90-4709-96e0-ab9cbddb5258',
  ];

  it('links every named company, desk, and cited outlet', () => {
    for (const href of required) {
      expect(post, href).toContain(href);
    }
  });

  it('does not leave the closed tape as unlinked company names', () => {
    expect(post).toMatch(/\| \[Etched\]\(/);
    expect(post).toMatch(/\| \[Higgsfield\]\(/);
    expect(post).toMatch(/\| \[Groq\]\(/);
    expect(post).toMatch(/\| \[Wispr\]\(/);
    expect(post).toMatch(/\| \[Databricks\]\(/);
    expect(post).toMatch(/\| \[Lovable\]\(/);
  });
});

describe('table desk', () => {
  it('is loaded sitewide from BaseLayout', () => {
    expect(layout).toMatch(/table-desk\.js\?v=\$\{tableDeskVersion\}/);
  });

  it('filters, sorts, resizes, and widens', () => {
    expect(desk).toContain('Filter rows');
    expect(desk).toContain('aria-sort');
    expect(desk).toContain('table-desk-resize');
    expect(desk).toContain('is-wide');
    expect(desk).toContain('data-table-static');
    expect(desk).toContain('wrap.appendChild(table)');
  });

  it('has bureau chrome in the house stylesheet', () => {
    expect(css).toMatch(/\.table-desk\s*\{/);
    expect(css).toMatch(/\.table-desk-filter\s*\{/);
    expect(css).toMatch(/\.table-desk-resize\s*\{/);
  });
});
