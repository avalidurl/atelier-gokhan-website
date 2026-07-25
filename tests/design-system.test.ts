import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const REPO_ROOT = resolve(__dirname, '..');

/** Every source file that can carry a font-family, in src/ and public/. */
function styleBearingFiles(): string[] {
  const exts = ['.css', '.astro', '.ts', '.js', '.md', '.html'];
  const out: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) walk(full);
      else if (exts.some((e) => entry.endsWith(e))) out.push(full);
    }
  };
  walk(resolve(REPO_ROOT, 'src'));
  walk(resolve(REPO_ROOT, 'public'));
  return out;
}

/** CSS with /* … *\/ comments removed, so prose about a face is not read as a
 *  declaration of it. */
function declarationsOnly(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

/** Every declaration that lands on <body>, including the `html, body` reset —
 *  the computed style is the union of all rules whose selector list has a bare
 *  `body` in it, not just the one block that happens to be first. */
function bodyDeclarations(css: string): string {
  return [...declarationsOnly(css).matchAll(/([^{}]+)\{([^{}]*)\}/g)]
    .filter((m) => m[1].split(',').some((sel) => sel.trim() === 'body'))
    .map((m) => m[2])
    .join('\n');
}
const tokensCss = readFileSync(resolve(REPO_ROOT, 'src/styles/tokens.css'), 'utf8');
const globalCss = readFileSync(resolve(REPO_ROOT, 'src/styles/global.css'), 'utf8');

// The house style is a filed technical document: exactly four color tokens per
// theme, two type roles (prose face for language, data face for identifiers and
// machine strings), ruled boxes on one paper plane. Hierarchy is carried by
// face, border weight, casing, spacing, and size — never hue.
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

  it('splits type into two role faces — text and data — that are not each other', () => {
    // R1/R2/R3 take the text face; R4/R5 take the data face.
    expect(tokensCss).toMatch(/--font-text:[\s\S]*?sans-serif/);
    expect(tokensCss).toMatch(/--font-data:[^;]*ui-monospace/);
    // The defect this replaced: the prose face aliased to the mono face, which
    // set an 11,000-word report in SF Mono and made it read as terminal output
    // before a word was parsed. It must not come back under either spelling.
    expect(tokensCss).not.toMatch(/--font-sans:\s*var\(--font-mono\)/);
    expect(tokensCss).not.toMatch(/--font-text:\s*var\(--font-data\)/);
    expect(tokensCss).not.toMatch(/--font-data:\s*var\(--font-text\)/);
  });

  it('keeps the legacy aliases resolving forward, for one release only', () => {
    expect(tokensCss).toMatch(/--font-mono:\s*var\(--font-data\)/);
    expect(tokensCss).toMatch(/--font-sans:\s*var\(--font-text\)/);
  });

  it('has no call site left on a legacy alias, so the aliases can just be deleted', () => {
    // The point of renaming rather than re-valuing: --font-sans/--font-mono are
    // the two names that got aliased to each other, so every call site had to be
    // revisited and given an explicit role. This keeps that true. When the
    // one-release grace period ends, deleting the two alias lines is safe iff
    // this passes.
    const offenders = styleBearingFiles()
      .filter((f) => f !== resolve(REPO_ROOT, 'src/styles/tokens.css'))
      .filter((f) => /var\(\s*--font-(mono|sans)\b/.test(readFileSync(f, 'utf8')))
      .map((f) => relative(REPO_ROOT, f));
    expect(offenders, `still resolving through a legacy alias: ${offenders.join(', ')}`).toEqual(
      [],
    );
  });

  it('names no font family it does not ship, and loads no webfont', () => {
    // Self-hosting is Phase 3. Until the woff2 files and @font-face rules land,
    // naming a family here would resolve to a locally-installed copy on some
    // machines and to the fallback on others — a per-visitor render with
    // nothing in the repo to explain it.
    const declared = declarationsOnly(tokensCss);
    for (const family of ['Public Sans', 'Commit Mono', 'Newsreader']) {
      expect(declared, `${family} is named but not self-hosted`).not.toContain(family);
    }
    expect(tokensCss).not.toMatch(/@font-face/);
    for (const css of [tokensCss, globalCss]) {
      expect(css).not.toMatch(/@fontsource/);
      expect(css).not.toMatch(/fonts\.googleapis\.com/);
      expect(css).not.toMatch(/fonts\.gstatic\.com/);
      expect(css).not.toMatch(/use\.typekit\.net/);
    }
  });
});

describe('global stylesheet', () => {
  it('imports the design tokens', () => {
    expect(globalCss).toMatch(/@import\s+['"]\.\/tokens\.css['"]/);
  });

  it('sets the document base: 14px prose face on the paper plane', () => {
    const body = bodyDeclarations(globalCss);
    expect(body).not.toBe('');
    expect(body).toMatch(/font-family:\s*var\(--font-text\)/);
    expect(body).toMatch(/font-size:\s*14px/);
    expect(body).toMatch(/background:\s*var\(--paper\)/);
  });

  it('does not put tabular-nums on body', () => {
    // Inert while everything was monospaced; actively wrong once prose is
    // proportional. Figures are aligned per-role at the R3 sites that hold
    // quantities (essay tables, the legal retention table), not globally.
    expect(bodyDeclarations(globalCss)).not.toMatch(/font-variant-numeric/);
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
