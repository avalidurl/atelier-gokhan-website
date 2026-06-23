import { describe, expect, it } from 'vitest';
import { domains, allLeaves } from '../src/data/links';

// The authoritative tree from contract-work/link-tree.md. Any drift here is a
// validation failure (VAL-TREE-002/003/004), so the expected hrefs are spelled
// out byte-for-byte rather than derived from the source under test.
const EXPECTED: Record<string, { label: string; leaves: Record<string, string> }> = {
  gokhanvc: {
    label: 'gokhan.vc',
    leaves: {
      X: 'https://x.com/ateliergokhan',
      GitHub: 'https://github.com/gokhan-vc',
      Email: 'mailto:contact@gokhan.vc',
    },
  },
  gokhanturhancom: {
    label: 'gokhanturhan.com',
    leaves: {
      X: 'https://x.com/goekhan',
      GitHub: 'https://github.com/avalidurl',
      LinkedIn: 'https://www.linkedin.com/in/goekhanturhan/',
      Farcaster: 'https://farcaster.xyz/gokhan',
      Bluesky: 'https://bsky.app/profile/gokhan.substack.com',
      Substack: 'https://gokhan.substack.com',
      Telegram: 'https://t.me/gokhanturhans',
      Discord: 'https://discord.gg/ZcxcwRPT7R',
    },
  },
  numetalxyz: {
    label: 'numetal.xyz',
    leaves: {
      X: 'https://x.com/numetalxyz',
      Telegram: 'https://t.me/numetalxyz',
      Discord: 'https://discord.gg/MC4DYumPMz',
    },
  },
};

describe('link tree data — structure', () => {
  it('has exactly the three domain roots in order', () => {
    expect(domains.map((d) => d.id)).toEqual(['gokhanvc', 'gokhanturhancom', 'numetalxyz']);
    expect(domains.map((d) => d.label)).toEqual(['gokhan.vc', 'gokhanturhan.com', 'numetal.xyz']);
  });

  it('has 3 / 8 / 3 leaves per domain (14 total)', () => {
    expect(domains.map((d) => d.socials.length)).toEqual([3, 8, 3]);
    expect(allLeaves).toHaveLength(14);
  });

  it('every domain root has a valid absolute https URL (the clickable root target)', () => {
    for (const d of domains) {
      expect(d.url).toMatch(/^https:\/\//);
      expect(() => new URL(d.url)).not.toThrow();
    }
    // the three roots map to their own domains
    expect(domains.map((d) => d.url)).toEqual([
      'https://gokhan.vc',
      'https://gokhanturhan.com',
      'https://numetal.xyz',
    ]);
  });
});

describe('link tree data — byte-exact hrefs', () => {
  for (const domain of domains) {
    const expected = EXPECTED[domain.id];
    it(`${domain.label}: every leaf matches the canonical href`, () => {
      expect(expected).toBeDefined();
      expect(domain.label).toBe(expected.label);
      const got = Object.fromEntries(domain.socials.map((l) => [l.platform, l.href]));
      expect(got).toEqual(expected.leaves);
    });
  }
});

describe('link tree data — link hygiene', () => {
  it('has exactly one mailto leaf, exactly contact@gokhan.vc, marked non-external', () => {
    const mailtos = allLeaves.filter((l) => l.href.startsWith('mailto:'));
    expect(mailtos).toHaveLength(1);
    expect(mailtos[0].href).toBe('mailto:contact@gokhan.vc');
    expect(mailtos[0].external).toBe(false);
  });

  it('has 13 external leaves, all absolute https URLs opened in a new tab', () => {
    const external = allLeaves.filter((l) => l.external);
    expect(external).toHaveLength(13);
    for (const leaf of external) {
      expect(leaf.href).toMatch(/^https:\/\//);
      expect(() => new URL(leaf.href)).not.toThrow();
    }
  });

  it('contains no placeholder or unresolved hrefs', () => {
    for (const leaf of allLeaves) {
      expect(leaf.href).not.toBe('');
      expect(leaf.href).not.toBe('#');
      expect(leaf.href).not.toMatch(/javascript:/i);
      expect(leaf.href).not.toMatch(/\{\{|\}\}|undefined|null/);
    }
  });

  it('has no duplicate hrefs', () => {
    const hrefs = allLeaves.map((l) => l.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it('every leaf has a non-empty platform and note', () => {
    for (const leaf of allLeaves) {
      expect(leaf.platform.trim().length).toBeGreaterThan(0);
      expect(leaf.note.trim().length).toBeGreaterThan(0);
    }
  });
});
