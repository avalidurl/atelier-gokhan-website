import { describe, expect, it } from 'vitest';
import { properties, allLeaves } from '../src/data/links';

const EXPECTED_ORDER = ['ishtar', 'numetal', 'gokhanvc', 'memex'] as const;

const EXPECTED_HREFS: Record<string, string[]> = {
  ishtar: [
    'https://api.ishtar.numetal.xyz',
    'https://api.ishtar.numetal.xyz/openapi.json',
    'https://api.ishtar.numetal.xyz/skill',
    'https://ishtar.numetal.xyz/heartbench/',
    'https://ishtar.numetal.xyz/deck/not-raising-a-preseed/',
    'https://github.com/gokhan-vc/heartprefs',
    'https://github.com/gokhan-vc',
    'https://ishtar.numetal.xyz',
    'https://ishtar.numetal.xyz/blog/',
    'https://ishtar.numetal.xyz/docs/agents/overview',
    'https://www.moltbook.com/m/courtship',
    'https://x.com/numetalxyz',
    'https://t.me/numetalxyz',
    'mailto:contact@numetal.xyz',
  ],
  numetal: [
    'https://github.com/gokhan-vc/numetal-website',
    'https://github.com/gokhan-vc',
    'https://numetal.xyz',
    'https://numetal.xyz/blog',
    'https://x.com/numetalxyz',
    'https://t.me/numetalxyz',
    'https://discord.gg/MC4DYumPMz',
    'mailto:contact@numetal.xyz',
  ],
  gokhanvc: [
    'https://api.gokhan.vc',
    'https://github.com/gokhan-vc',
    '/',
    '/blog',
    'https://x.com/ateliergokhan',
    'mailto:contact@gokhan.vc',
  ],
  memex: [
    'https://github.com/avalidurl',
    'https://github.com/avalidurl/gokhan-memex',
    'https://gokhanturhan.com',
    'https://gokhanturhan.com/journal/',
    'https://x.com/goekhan',
    'https://www.linkedin.com/in/goekhanturhan/',
    'https://farcaster.xyz/gokhan',
    'https://bsky.app/profile/gokhan.substack.com',
    'https://gokhan.substack.com',
    'https://t.me/gokhanturhans',
    'https://discord.gg/ZcxcwRPT7R',
    'mailto:contact@gokhanturhan.com',
  ],
};

const EXPECTED_CONTACTS: Record<string, string> = {
  ishtar: 'contact@numetal.xyz',
  numetal: 'contact@numetal.xyz',
  gokhanvc: 'contact@gokhan.vc',
  memex: 'contact@gokhanturhan.com',
};

function leavesForProperty(id: string) {
  const property = properties.find((p) => p.id === id);
  if (!property) throw new Error(`missing property ${id}`);
  return [
    ...property.apiTools,
    property.website,
    ...(property.blog ? [property.blog] : []),
    ...(property.docs ? [property.docs] : []),
    ...property.socials,
    ...property.contacts,
  ];
}

describe('link tree data — structure', () => {
  it('has exactly four properties in founder order', () => {
    expect(properties.map((p) => p.id)).toEqual([...EXPECTED_ORDER]);
    expect(properties.map((p) => p.label)).toEqual([
      'Ishtar',
      'Numetal Labs',
      'Gökhan VC',
      'Personal Memex',
    ]);
  });

  it('every property has a valid canonical https URL', () => {
    for (const property of properties) {
      expect(property.url).toMatch(/^https:\/\//);
      expect(() => new URL(property.url)).not.toThrow();
    }
  });

  it('every property has exactly one contact email at the bottom', () => {
    for (const property of properties) {
      expect(property.contacts).toHaveLength(1);
      const contact = property.contacts[0];
      expect(contact.platform).toBe('Email');
      expect(contact.note).toBe(EXPECTED_CONTACTS[property.id]);
      expect(contact.href).toBe(`mailto:${EXPECTED_CONTACTS[property.id]}`);
    }
  });

  it('renders Socials only when social leaves exist', () => {
    for (const property of properties) {
      if (property.socials.length > 0) {
        expect(property.socials.every((leaf) => leaf.external)).toBe(true);
      }
    }
  });
});

describe('link tree data — byte-exact hrefs', () => {
  for (const id of EXPECTED_ORDER) {
    it(`${id}: leaves match canonical order and hrefs`, () => {
      const leaves = leavesForProperty(id);
      expect(leaves.map((leaf) => leaf.href)).toEqual(EXPECTED_HREFS[id]);
    });
  }
});

describe('link tree data — link hygiene', () => {
  it('has exactly four mailto leaves with correct addresses', () => {
    const mailtos = allLeaves.filter((leaf) => leaf.href.startsWith('mailto:'));
    expect(mailtos.map((leaf) => leaf.href).sort()).toEqual([
      'mailto:contact@gokhan.vc',
      'mailto:contact@gokhanturhan.com',
      'mailto:contact@numetal.xyz',
      'mailto:contact@numetal.xyz',
    ]);
    for (const leaf of mailtos) {
      expect(leaf.external).toBe(false);
    }
  });

  it('marks every https leaf as external', () => {
    const httpsLeaves = allLeaves.filter((leaf) => leaf.href.startsWith('https://'));
    expect(httpsLeaves.length).toBeGreaterThan(0);
    for (const leaf of httpsLeaves) {
      expect(leaf.external).toBe(true);
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

  it('has no duplicate hrefs within a single property', () => {
    for (const property of properties) {
      const hrefs = leavesForProperty(property.id).map((leaf) => leaf.href);
      expect(new Set(hrefs).size).toBe(hrefs.length);
    }
  });

  it('every leaf has a non-empty platform, note, and tooltip', () => {
    for (const leaf of allLeaves) {
      expect(leaf.platform.trim().length).toBeGreaterThan(0);
      expect(leaf.note.trim().length).toBeGreaterThan(0);
      expect(leaf.tooltip.trim().length).toBeGreaterThan(0);
    }
  });
});
