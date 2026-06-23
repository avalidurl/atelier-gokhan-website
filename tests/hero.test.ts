import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { HERO_ACCENTS, heroSegments, joinHeroText } from '../src/data/hero';
import { site } from '../src/data/site';

const REPO_ROOT = resolve(__dirname, '..');
const indexAstro = readFileSync(resolve(REPO_ROOT, 'src/pages/index.astro'), 'utf8');

describe('home hero segments', () => {
  it('concatenates to the canonical venture-studio blurb verbatim', () => {
    expect(joinHeroText(heroSegments)).toBe(site.blurb);
  });

  it('preserves the accented "Gökhan" UTF-8 codepoint without mojibake', () => {
    const joined = joinHeroText(heroSegments);
    expect(joined).toContain('Gökhan');
    expect(joined).not.toContain('Ã¶');
    expect(joined).not.toContain('\uFFFD');
  });

  it('includes the verbatim "AGI + human conviviality" thesis phrase and final period', () => {
    const joined = joinHeroText(heroSegments);
    expect(joined).toContain('AGI + human conviviality');
    expect(joined.endsWith('the long now.')).toBe(true);
  });

  it('uses all three brand accents at least once on distinct phrase groups', () => {
    const accents = new Set(
      heroSegments.flatMap((segment) => (segment.accent ? [segment.accent] : [])),
    );
    expect(accents).toEqual(new Set(HERO_ACCENTS));
  });

  it('emphasizes "Atelier Gökhan Turhan" in the lead purple accent', () => {
    const purple = heroSegments.find((segment) => segment.accent === 'purple');
    expect(purple?.text).toContain('Atelier Gökhan Turhan');
  });

  it('emphasizes the unusual word "mechanomical" in the rose accent', () => {
    const rose = heroSegments.find((segment) => segment.accent === 'rose');
    expect(rose?.text.toLowerCase()).toContain('mechanomical');
  });

  it('uses the green accent for a non-empty closing phrase', () => {
    const green = heroSegments.find((segment) => segment.accent === 'green');
    expect(green?.text.trim().length).toBeGreaterThan(0);
  });

  it('exposes plain (non-accented) connective tissue between accent phrases', () => {
    const plainCount = heroSegments.filter((segment) => !segment.accent).length;
    expect(plainCount).toBeGreaterThanOrEqual(2);
  });
});

describe('home page renders the accentuated hero', () => {
  it('imports the hero segments from the shared data module', () => {
    expect(indexAstro).toMatch(/from\s+['"]\.\.\/data\/hero['"]/);
    expect(indexAstro).toMatch(/heroSegments/);
  });

  it('renders the hero blurb as a single h1 with no <img> inside the hero', () => {
    const heroSection = indexAstro.match(
      /<section[^>]*class=['"][^'"]*hero[^'"]*['"][\s\S]*?<\/section>/,
    );
    expect(heroSection).not.toBeNull();
    const sectionText = heroSection?.[0] ?? '';
    expect(sectionText).toMatch(/<h1[\s\S]*?<\/h1>/);
    expect((sectionText.match(/<h1/g) ?? []).length).toBe(1);
    expect(sectionText).not.toMatch(/<img[\s>]/);
  });

  it('emits an accent utility class binding on the rendered hero spans', () => {
    expect(indexAstro).toMatch(/accent-\$\{segment\.accent\}/);
    expect(indexAstro).toMatch(/<span\s+class=/);
  });

  it('does not contain leftover coming-soon, agentbounty, TODO, or wrong @gokhanturhan handle copy', () => {
    expect(indexAstro).not.toMatch(/coming\s*soon/i);
    expect(indexAstro).not.toMatch(/agent\s*accelerator/i);
    expect(indexAstro).not.toMatch(/agentbounty/i);
    expect(indexAstro).not.toMatch(/\bTODO\b/);
    expect(indexAstro).not.toMatch(/@gokhanturhan/);
  });
});
