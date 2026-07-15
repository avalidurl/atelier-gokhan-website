import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const REPO_ROOT = resolve(__dirname, '..');
const tokensCss = readFileSync(resolve(REPO_ROOT, 'src/styles/tokens.css'), 'utf8');
const globalCss = readFileSync(resolve(REPO_ROOT, 'src/styles/global.css'), 'utf8');

describe('design tokens', () => {
  it('exposes the agentbounty-aligned neutral palette', () => {
    expect(tokensCss).toMatch(/--bg:\s*#e7e7e7/i);
    expect(tokensCss).toMatch(/--paper:\s*#ffffff/i);
    expect(tokensCss).toMatch(/--ink:\s*#141414/i);
    expect(tokensCss).toMatch(/--muted:\s*#7c7c7c/i);
    expect(tokensCss).toMatch(/--line:\s*#cdcdcd/i);
    expect(tokensCss).toMatch(/--hard:\s*#8c8c8c/i);
  });

  it('exposes the monochrome accent trio with #141414 as the primary token', () => {
    // House style is strictly black & white: hierarchy by weight/value, never hue.
    // The accent-* var names are kept, but every value is now a neutral grey.
    expect(tokensCss).toMatch(/--accent-purple:\s*#141414/i);
    expect(tokensCss).toMatch(/--accent-rose:\s*#5a5a5a/i);
    expect(tokensCss).toMatch(/--accent-green:\s*#7c7c7c/i);
  });

  it('declares a system color-scheme of light', () => {
    expect(tokensCss).toMatch(/color-scheme:\s*light/);
  });
});

describe('global stylesheet', () => {
  it('self-hosts Archivo via @fontsource-variable/archivo (no external CDN)', () => {
    expect(globalCss).toMatch(/@import\s+['"]@fontsource-variable\/archivo\/wght\.css['"]/);
    expect(globalCss).not.toMatch(/fonts\.googleapis\.com/);
    expect(globalCss).not.toMatch(/fonts\.gstatic\.com/);
    expect(globalCss).not.toMatch(/use\.typekit\.net/);
  });

  it('imports the design tokens', () => {
    expect(globalCss).toMatch(/@import\s+['"]\.\/tokens\.css['"]/);
  });

  it('defines the neo-brutalist .tile primitive with a hard 2px 2px 0 shadow', () => {
    expect(globalCss).toMatch(/\.tile\s*\{[\s\S]*?box-shadow:\s*var\(--shadow-hard\)/);
    expect(tokensCss).toMatch(/--shadow-hard:\s*2px 2px 0/);
  });

  it('defines a dither divider primitive', () => {
    expect(globalCss).toMatch(/\.dither-divider\s*\{/);
    expect(globalCss).toMatch(/data:image\/svg\+xml/);
  });

  it('respects prefers-reduced-motion', () => {
    expect(globalCss).toMatch(/prefers-reduced-motion:\s*reduce/);
  });

  it('uses the Archivo Variable family in the body font stack', () => {
    expect(tokensCss).toMatch(/--font-sans:[^;]*Archivo Variable/);
  });

  it('carries no residual accent hues — strictly monochrome', () => {
    // The legacy red/purple accents must never return to the stylesheet layer.
    expect(globalCss).not.toMatch(/#e10600/i);
    expect(globalCss).not.toMatch(/#8466c4/i);
    expect(tokensCss).not.toMatch(/#e10600/i);
    expect(tokensCss).not.toMatch(/#8466c4/i);
  });
});
