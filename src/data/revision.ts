import { execFileSync } from 'node:child_process';

/**
 * The site's revision stamp — ONE value, ONE source.
 *
 * Five documents used to carry a hand-typed revision date, and they had drifted
 * into three different answers:
 *
 *   index.astro       Rev 2026-07-21
 *   Footer.astro      Rev 2026-07-18   ← renders on every page
 *   newsletter.astro  Rev 2026-07-18
 *   blog/index.astro  Rev 2026-07-17
 *   blog/[...slug]    Rev 2026-07-17
 *
 * Because the footer is site-wide, every one of those pages rendered two
 * different revision dates for one document at the same time. A revision stamp
 * that contradicts itself inside a single viewport is not a revision stamp; it
 * is decoration that looks like bookkeeping, and a reader clocks that faster
 * than they read either date.
 *
 * The stamp is now derived, never typed. `git log -1 --format=%cs` is the
 * committed state of this repository — which is exactly what "revision" means
 * for a document that ships out of it — so the value cannot drift from the
 * thing it describes, and no one has to remember to bump it.
 *
 * Two deliberate properties:
 *
 * 1. It reports the last COMMIT date, not `Date.now()`. Building twice on
 *    different days from the same commit yields the same stamp, because the
 *    document did not change. A stamp keyed to the clock would advance while
 *    the document stood still, which is the same lie in a fresher font.
 *
 * 2. When git cannot answer — no binary, no repository, a source tarball — the
 *    stamp reads `Rev —`. It does NOT fall back to a literal. A literal is how
 *    the drift above started, and a build with no access to the revision must
 *    not emit a document asserting one. `—` is the honest reading of a gauge
 *    that is not connected.
 *
 * A shallow clone is fine HERE and only here: depth 1 still carries an accurate
 * committer date for HEAD. It is `git rev-list --count` that collapses to 1 on
 * a shallow clone, which is why .github/workflows/ci.yml pins `fetch-depth: 0`
 * for the revision-count work that follows.
 *
 * Build-time only. Astro evaluates this module once per build in Node; nothing
 * here reaches the client.
 */

/** `%cs` is the committer date in strict YYYY-MM-DD, already zero-padded. */
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function headCommitDate(): string | null {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cs'], {
      encoding: 'utf8',
      // Swallow git's own stderr: "not a git repository" is an expected,
      // handled outcome here, not something to print during every build.
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    // Anything that is not a date is treated as no answer. An empty repository
    // returns empty, and a future git could pad the format differently.
    return ISO_DATE.test(out) ? out : null;
  } catch {
    return null;
  }
}

/** `2026-07-25`, or `null` when the revision is genuinely unknown. */
export const revisionDate: string | null = headCommitDate();

/**
 * The rendered stamp. Every document furniture site reads this — the masthead
 * doc strip, the footer colophon, the blog doc line, the per-post filing
 * reference. Import it; never retype it.
 */
export const revisionStamp: string = revisionDate ? `Rev ${revisionDate}` : 'Rev —';
