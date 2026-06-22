// Canonical per-domain "pedigree" link tree — the single source of truth for
// every href rendered by LinkTree.astro. Hrefs are byte-exact and authoritative
// (see contract-work/link-tree.md). Nothing here may be hardcoded elsewhere.
//
// Easy-to-miss distinctions guarded by tests/links.test.ts:
//   - X handle is `goekhan` (with the e) for the personal domain, `ateliergokhan`
//     for the studio, `numetalxyz` for Numetal.
//   - GitHub personal is `avalidurl`; studio org is `gokhan-vc`.
//   - LinkedIn keeps its trailing slash.
//   - Telegram personal is `gokhanturhans` (plural).

export interface LinkLeaf {
  /** Platform name — the primary visible label and the accessible name. */
  readonly platform: string;
  /** Secondary descriptor shown beside the label (handle or channel name). */
  readonly note: string;
  /** Byte-exact destination. https:// for external; mailto: for email. */
  readonly href: string;
  /**
   * External web links open in a new tab with rel="noopener noreferrer".
   * The mailto leaf is NOT external — it activates the mail handler in place.
   */
  readonly external: boolean;
}

export interface LinkDomain {
  /** Stable id used for DOM ids / aria wiring. */
  readonly id: string;
  /** Domain label rendered as the branch root heading, e.g. "gokhan.vc". */
  readonly label: string;
  /** The domain's own canonical URL (not rendered as an anchor). */
  readonly url: string;
  /** Short descriptor of who owns this branch. */
  readonly owner: string;
  /** Social/contact leaves owned by this domain. */
  readonly socials: readonly LinkLeaf[];
}

export const domains: readonly LinkDomain[] = [
  {
    id: 'gokhanvc',
    label: 'gokhan.vc',
    url: 'https://gokhan.vc',
    owner: 'Atelier Gökhan Turhan',
    socials: [
      {
        platform: 'X',
        note: '@ateliergokhan',
        href: 'https://x.com/ateliergokhan',
        external: true,
      },
      {
        platform: 'GitHub',
        note: 'gokhan-vc',
        href: 'https://github.com/gokhan-vc',
        external: true,
      },
      {
        platform: 'Email',
        note: 'contact@gokhan.vc',
        href: 'mailto:contact@gokhan.vc',
        external: false,
      },
    ],
  },
  {
    id: 'gokhanturhancom',
    label: 'gokhanturhan.com',
    url: 'https://gokhanturhan.com',
    owner: 'Gökhan Turhan — personal',
    socials: [
      { platform: 'X', note: '@goekhan', href: 'https://x.com/goekhan', external: true },
      {
        platform: 'GitHub',
        note: 'avalidurl',
        href: 'https://github.com/avalidurl',
        external: true,
      },
      {
        platform: 'LinkedIn',
        note: 'in/goekhanturhan',
        href: 'https://www.linkedin.com/in/goekhanturhan/',
        external: true,
      },
      {
        platform: 'Farcaster',
        note: '@gokhan',
        href: 'https://farcaster.xyz/gokhan',
        external: true,
      },
      {
        platform: 'Bluesky',
        note: 'gokhan.substack.com',
        href: 'https://bsky.app/profile/gokhan.substack.com',
        external: true,
      },
      {
        platform: 'Substack',
        note: 'gokhan.substack.com',
        href: 'https://gokhan.substack.com',
        external: true,
      },
      {
        platform: 'Telegram',
        note: 'Research Log',
        href: 'https://t.me/gokhanturhans',
        external: true,
      },
      {
        platform: 'Discord',
        note: 'Market Research Unit',
        href: 'https://discord.gg/ZcxcwRPT7R',
        external: true,
      },
    ],
  },
  {
    id: 'numetalxyz',
    label: 'numetal.xyz',
    url: 'https://numetal.xyz',
    owner: 'Numetal',
    socials: [
      { platform: 'X', note: '@numetalxyz', href: 'https://x.com/numetalxyz', external: true },
      { platform: 'Telegram', note: 'Numetal', href: 'https://t.me/numetalxyz', external: true },
      {
        platform: 'Discord',
        note: 'Numetal',
        href: 'https://discord.gg/MC4DYumPMz',
        external: true,
      },
    ],
  },
];

/** Flat list of every leaf across all domains (14 total). */
export const allLeaves: readonly LinkLeaf[] = domains.flatMap((d) => d.socials);
