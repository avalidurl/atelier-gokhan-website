import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { HERO_ACCENTS, heroSegments, joinHeroText } from '../src/data/hero';
import { nameGloss } from '../src/data/name';
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

  it('emphasizes the full "Gökhan Ventures" brand in the lead purple accent', () => {
    // The brand is split across two purple segments so "Gökhan" alone can carry the
    // name gloss; together they must still read as the whole brand, in order.
    const purple = heroSegments.filter((segment) => segment.accent === 'purple');
    expect(purple.map((segment) => segment.text).join('')).toContain('Gökhan Ventures');
    expect(purple[0]?.text).toBe('Gökhan');
  });

  it('marks exactly the "Gökhan" segment for the name gloss', () => {
    const glossed = heroSegments.filter((segment) => segment.gloss);
    expect(glossed).toHaveLength(1);
    expect(glossed[0]?.text).toBe('Gökhan');
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

describe('name gloss (meaning + pronunciation annotation)', () => {
  it('names the person, not the brand', () => {
    expect(nameGloss.title).toBe('Gökhan Turhan');
  });

  it('states a meaning for both names', () => {
    expect(nameGloss.tip).toContain('sky');
    expect(nameGloss.tip).toContain('khan');
    expect(nameGloss.tip.toLowerCase()).toContain('noble title');
  });

  it('carries both IPA and a plain-English respelling', () => {
    expect(nameGloss.tip).toContain('/ɟøcˈhan/');
    expect(nameGloss.tip).toContain('/tuɾˈhan/');
    expect(nameGloss.tip).toContain('gurk-HAHN');
    expect(nameGloss.tip).toContain('toor-HAHN');
  });

  it('stays short enough for a hover card and free of mojibake', () => {
    expect(nameGloss.tip.length).toBeLessThanOrEqual(260);
    expect(nameGloss.tip).not.toContain('Ã');
    expect(nameGloss.tip).not.toContain('�');
  });

  it('does not assert the contested Turhan etymology as settled', () => {
    // Nişanyan (tûr+han) and TDV İslâm Ansiklopedisi (variant of tarhan) disagree;
    // the copy must not pick a winner.
    expect(nameGloss.tip).not.toMatch(/tarhan/i);
    expect(nameGloss.tip).not.toMatch(/eldest son/i);
  });
});

// The landing hero was rebuilt in a04e42d ("landing: mirror gokhanturhan.com —
// project index box, drop the who-i-am blurb"): the accentuated multi-segment
// blurb was replaced by a ruled masthead whose h1 is the plain wordmark. The
// hero.ts data module still ships and is still covered by the two suites above
// (it feeds the meta description), but index.astro no longer renders it, so the
// three assertions below now pin the masthead the page actually emits.
describe('home page renders the masthead hero', () => {
  it('pins the masthead to the shared site data module', () => {
    expect(indexAstro).toMatch(/from\s+['"]\.\.\/data\/site['"]/);
    expect(indexAstro).toMatch(/description=\{site\.blurb\}/);
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

  it('wraps the h1 in the ruled masthead furniture — doc strip, stamp, foot row', () => {
    expect(indexAstro).toMatch(/class="hero-sheet masthead"/);
    expect(indexAstro).toMatch(/class="mast-row"/);
    expect(indexAstro).toMatch(/class="mast-row mast-row--foot"/);
    expect(indexAstro).toMatch(/class="stamp"/);
  });

  it('does not contain leftover coming-soon, agentbounty, TODO, or wrong @gokhanturhan handle copy', () => {
    expect(indexAstro).not.toMatch(/coming\s*soon/i);
    // NOTE: the /agent accelerator/ ban was dropped here. a04e42d put
    // "agent accelerator" into the masthead subtitle deliberately; the string is
    // current studio copy, not leftover placeholder text. The rest of this guard
    // still pins genuinely-dead copy.
    expect(indexAstro).not.toMatch(/agentbounty/i);
    expect(indexAstro).not.toMatch(/\bTODO\b/);
    expect(indexAstro).not.toMatch(/@gokhanturhan/);
  });
});
