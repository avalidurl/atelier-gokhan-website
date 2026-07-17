import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const REPO_ROOT = resolve(__dirname, '..');
const tokensCss = readFileSync(resolve(REPO_ROOT, 'src/styles/tokens.css'), 'utf8');
const globalCss = readFileSync(resolve(REPO_ROOT, 'src/styles/global.css'), 'utf8');

// The house style is a filed technical document: exactly four color tokens per
// theme, monospace only, ruled boxes on one paper plane. Hierarchy is carried
// by border weight, casing, spacing, and size — never hue.
const LIGHT = { ink: '#0a0a0a', paper: '#f4f4f2', dim: '#5c5c5c', faint: '#d8d8d4' };
const DARK = { ink: '#e8e8e6', paper: '#0e0e0e', dim: '#9a9a9a', faint: '#2a2a2a' };

describe('design tokens', () => {
  it('exposes exactly the four light-theme tokens', () => {
    expect(tokensCss).toMatch(new RegExp(`--ink:\\s*${LIGHT.ink}`, 'i'));
    expect(tokensCss).toMatch(new RegExp(`--paper:\\s*${LIGHT.paper}`, 'i'));
    expect(tokensCss).toMatch(new RegExp(`--dim:\\s*${LIGHT.dim}`, 'i'));
    expect(tokensCss).toMatch(new RegExp(`--faint:\\s*${LIGHT.faint}`, 'i'));
  });

  it('ships the dark theme via prefers-color-scheme with inverted ink', () => {
    expect(tokensCss).toMatch(/@media\s*\(prefers-color-scheme:\s*dark\)/);
    expect(tokensCss).toMatch(new RegExp(`--ink:\\s*${DARK.ink}`, 'i'));
    expect(tokensCss).toMatch(new RegExp(`--paper:\\s*${DARK.paper}`, 'i'));
    expect(tokensCss).toMatch(new RegExp(`--dim:\\s*${DARK.dim}`, 'i'));
    expect(tokensCss).toMatch(new RegExp(`--faint:\\s*${DARK.faint}`, 'i'));
  });

  it('carries no hex colors beyond the eight theme values', () => {
    const allowed = new Set(
      [...Object.values(LIGHT), ...Object.values(DARK)].map((c) => c.toLowerCase()),
    );
    const hexes = tokensCss.match(/#[0-9a-fA-F]{3,8}\b/g) ?? [];
    for (const hex of hexes) {
      expect(allowed.has(hex.toLowerCase()), `unexpected color ${hex} in tokens.css`).toBe(true);
    }
  });

  it('resolves every legacy alias to one of the four tokens', () => {
    expect(tokensCss).toMatch(/--bg:\s*var\(--paper\)/);
    expect(tokensCss).toMatch(/--muted:\s*var\(--dim\)/);
    expect(tokensCss).toMatch(/--line:\s*var\(--faint\)/);
    expect(tokensCss).toMatch(/--hard:\s*var\(--ink\)/);
    expect(tokensCss).toMatch(/--accent-purple:\s*var\(--ink\)/);
    expect(tokensCss).toMatch(/--accent-rose:\s*var\(--dim\)/);
    expect(tokensCss).toMatch(/--accent-green:\s*var\(--dim\)/);
  });

  it('declares color-scheme light dark', () => {
    expect(tokensCss).toMatch(/color-scheme:\s*light dark/);
  });

  it('uses one monospace family for everything — no webfont loading', () => {
    expect(tokensCss).toMatch(/--font-mono:[^;]*ui-monospace/);
    expect(tokensCss).toMatch(/--font-sans:\s*var\(--font-mono\)/);
    expect(globalCss).not.toMatch(/@fontsource/);
    expect(globalCss).not.toMatch(/fonts\.googleapis\.com/);
    expect(globalCss).not.toMatch(/fonts\.gstatic\.com/);
    expect(globalCss).not.toMatch(/use\.typekit\.net/);
  });
});

describe('global stylesheet', () => {
  it('imports the design tokens', () => {
    expect(globalCss).toMatch(/@import\s+['"]\.\/tokens\.css['"]/);
  });

  it('sets the document base: 14px monospace on the paper plane', () => {
    expect(globalCss).toMatch(/font-family:\s*var\(--font-mono\)/);
    expect(globalCss).toMatch(/font-size:\s*14px/);
    expect(globalCss).toMatch(/font-variant-numeric:\s*tabular-nums/);
    expect(globalCss).toMatch(/background:\s*var\(--paper\)/);
  });

  it('bans shadows, radii, and transitions from the stylesheet layer', () => {
    for (const css of [tokensCss, globalCss]) {
      expect(css).not.toMatch(/box-shadow:\s*[^;]*px/);
      expect(css).not.toMatch(/border-radius:\s*[1-9]/);
      expect(css).not.toMatch(/transition:/);
      expect(css).not.toMatch(/animation:/);
    }
  });

  it('keeps the perforation bar as the only gradient', () => {
    const gradients = globalCss.match(/gradient\(/g) ?? [];
    expect(gradients.length).toBe(1);
    expect(globalCss).toMatch(
      /\.dither-divider\s*\{[\s\S]*?repeating-linear-gradient\(90deg,\s*var\(--ink\)/,
    );
  });

  it('defines the ruled-box primitives (.tile, .sheet, .masthead, .stamp, .colophon)', () => {
    expect(globalCss).toMatch(/\.tile\s*\{[\s\S]*?border:\s*var\(--border-hard\)/);
    expect(globalCss).toMatch(/\.sheet\s*\{[\s\S]*?border:\s*var\(--border-hard\)/);
    expect(globalCss).toMatch(/\.masthead\s*\{[\s\S]*?border:\s*2px solid var\(--ink\)/);
    expect(globalCss).toMatch(/\.stamp\s*\{[\s\S]*?rotate\(-1\.6deg\)/);
    expect(globalCss).toMatch(/\.colophon\s*\{[\s\S]*?border-top:\s*2px solid var\(--ink\)/);
  });

  it('respects prefers-reduced-motion', () => {
    expect(globalCss).toMatch(/prefers-reduced-motion:\s*reduce/);
  });

  it('carries no hex colors at all — tokens only', () => {
    expect(globalCss).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(globalCss).not.toMatch(/rgba?\(/);
    expect(globalCss).not.toMatch(/hsla?\(/);
  });
});
