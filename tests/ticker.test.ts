import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const REPO_ROOT = resolve(__dirname, '..');
const liveTicker = readFileSync(resolve(REPO_ROOT, 'src/components/LiveTicker.astro'), 'utf8');

/**
 * The accessible names numetal.xyz ships on its own ticker
 * (numetal-website/src/layouts/Base.astro). Pinned as literals rather than read
 * across the filesystem: that repo is not a dependency of this one and is not
 * checked out in CI, so a cross-repo read would make this suite pass by being
 * skipped — the one failure mode it exists to prevent.
 *
 * If numetal's copy changes, this constant goes stale in the safe direction:
 * the assertion below can only start passing more easily, never wrongly fail.
 */
const NUMETAL_TICKER_LABELS = ['Ishtar is live. Agentic dating. Use Ishtar at ishtar.numetal.xyz'];

/** Every aria-label literal declared in the component. */
function tickerLabels(): string[] {
  return [...liveTicker.matchAll(/^const \w*LABEL =\s*\n?\s*'([^']+)'/gm)].map((m) => m[1]);
}

describe('live ticker accessible names', () => {
  it('declares one accessible name per filing', () => {
    expect(tickerLabels()).toHaveLength(3);
  });

  it('shares no accessible name with numetal.xyz', () => {
    // Two companies asserting the same sentence, in the same band, in the same
    // shape, is an assertion in its own right — that one template produced both.
    // That assertion was true, which was the whole problem.
    for (const label of tickerLabels()) {
      expect(
        NUMETAL_TICKER_LABELS,
        `gokhan.vc ships numetal.xyz's accessible name verbatim: "${label}"`,
      ).not.toContain(label);
    }
  });

  it('speaks at studio level — each name places the product in the portfolio', () => {
    const labels = tickerLabels();
    expect(labels.length).toBeGreaterThan(0);
    for (const label of labels) {
      expect(label, `not a studio-level name: "${label}"`).toContain('Gökhan Ventures');
    }
  });

  it('gives the two filings distinct names', () => {
    const labels = tickerLabels();
    expect(new Set(labels).size).toBe(labels.length);
  });

  it('names the destination host in each accessible name', () => {
    const labels = tickerLabels();
    expect(labels.some((l) => l.includes('ishtar.numetal.xyz'))).toBe(true);
    expect(labels.some((l) => l.includes('curb.numetal.xyz'))).toBe(true);
    expect(labels.some((l) => l.includes('launch.numetal.xyz'))).toBe(true);
  });
});

describe('live ticker is frozen', () => {
  it('does not start the marquee on the default path', () => {
    // The freeze (1.2): the reduced-motion path is the default path. The
    // @keyframes and the reduced-motion override are retained deliberately, so
    // this asserts on the shorthand that would actually start it.
    const track = liveTicker.match(/\.ticker-track \{[\s\S]*?\n {2}\}/)?.[0] ?? '';
    expect(track).not.toBe('');
    expect(track).not.toMatch(/animation:\s*ticker-roll/);
  });

  it('keeps the band, both filings and the reduced-motion guarantee', () => {
    expect(liveTicker).toMatch(/class="ticker"/);
    expect(liveTicker).toMatch(/seg-ishtar/);
    expect(liveTicker).toMatch(/seg-curb/);
    expect(liveTicker).toMatch(/@keyframes ticker-roll/);
    expect(liveTicker).toMatch(/prefers-reduced-motion:\s*reduce/);
  });
});
