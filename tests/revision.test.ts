import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { revisionDate, revisionStamp } from '../src/data/revision';

const REPO_ROOT = resolve(__dirname, '..');

/** Every file that renders document furniture and could hand-type a stamp. */
function renderableFiles(): string[] {
  const exts = ['.astro', '.ts', '.js', '.md', '.html'];
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

const read = (p: string) => readFileSync(resolve(REPO_ROOT, p), 'utf8');

/** Source with comments stripped — prose describing a defect is not the defect. */
const code = (src: string) => src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');

const revisionModule = read('src/data/revision.ts');

// The five documents that carry a revision stamp. The footer is the reason this
// suite exists: it renders on every page, so any page whose own stamp disagreed
// with it showed two revision dates for one document in one viewport.
const STAMP_SITES = [
  'src/components/Footer.astro',
  'src/pages/index.astro',
  'src/pages/newsletter.astro',
  'src/pages/blog/index.astro',
  'src/pages/blog/[...slug].astro',
];

describe('revision stamp — one value, one source', () => {
  it('every stamp site imports the shared module', () => {
    for (const file of STAMP_SITES) {
      expect(read(file), `${file} does not read the shared revision`).toMatch(
        /import \{[^}]*\brevisionStamp\b[^}]*\} from '[./]*data\/revision'/,
      );
    }
  });

  it('every stamp site renders that import, not a literal', () => {
    for (const file of STAMP_SITES) {
      expect(read(file), `${file} imports the revision but does not render it`).toMatch(
        /\{revisionStamp\}|\$\{revisionStamp\}/,
      );
    }
  });

  it('no file anywhere hand-types a revision date', () => {
    // The defect: index.astro said Rev 2026-07-21 while the footer beneath it
    // said Rev 2026-07-18, and /blog said Rev 2026-07-17 above the same footer.
    // Three answers, one document, one screen. A typed stamp is one that has to
    // be remembered, and it drifts the moment it isn't.
    const offenders = renderableFiles()
      .filter((f) => f !== resolve(REPO_ROOT, 'src/data/revision.ts'))
      .filter((f) => /\bRev\s+\d{4}-\d{2}-\d{2}/.test(readFileSync(f, 'utf8')))
      .map((f) => relative(REPO_ROOT, f));
    expect(offenders, `hand-typed revision date in: ${offenders.join(', ')}`).toEqual([]);
  });

  it('derives the value from git rather than a checked-in constant', () => {
    expect(revisionModule).toMatch(/execFileSync/);
    expect(revisionModule).toMatch(/--format=%cs/);
    // No literal date may appear as a fallback. Falling back to one is exactly
    // how the drift started; a build that cannot read the revision must not
    // assert one.
    expect(code(revisionModule)).not.toMatch(/\d{4}-\d{2}-\d{2}/);
  });

  it('fails to an em dash, never to an invented or clock-derived date', () => {
    // A stamp keyed to the wall clock advances while the document stands still.
    expect(code(revisionModule)).not.toMatch(/Date\.now\(\)|new Date\(/);
    if (revisionDate === null) {
      expect(revisionStamp).toBe('Rev —');
    } else {
      expect(revisionDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(revisionStamp).toBe(`Rev ${revisionDate}`);
    }
  });

  it('resolves to a real date in this repository', () => {
    // This checkout is a git repository, so the graceful path must not be the
    // one being exercised — otherwise the suite above would pass on a stamp
    // that reads `Rev —` in production.
    expect(revisionDate).not.toBeNull();
  });
});
