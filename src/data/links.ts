// Canonical per-property link tree — single source of truth for LinkTree.astro.
// Hrefs are byte-exact; guarded by tests/links.test.ts.

export interface LinkLeaf {
  /** Platform name — primary visible label and accessible name. */
  readonly platform: string;
  /** Secondary descriptor (handle, path, or channel name). */
  readonly note: string;
  /** Byte-exact destination. https:// for external; mailto: for email. */
  readonly href: string;
  /**
   * External web links open in a new tab with rel="noopener noreferrer".
   * mailto: leaves are NOT external.
   */
  readonly external: boolean;
  /** One-line hover popup blurb for link-popups.js. */
  readonly tooltip: string;
}

export interface LinkProperty {
  /** Stable id for DOM ids / aria wiring. */
  readonly id: string;
  /** Display name, e.g. "Ishtar". */
  readonly label: string;
  /** Domain shown in the column header. */
  readonly domain: string;
  /** Canonical https origin for this property. */
  readonly url: string;
  /** Short owner / descriptor line in the header. */
  readonly owner: string;
  /** APIs, tools, links, GitHub — rendered first inside each section. */
  readonly apiTools: readonly LinkLeaf[];
  /** Main website leaf (rendered after apiTools). */
  readonly website: LinkLeaf;
  /** Blog leaf, when the property publishes one. */
  readonly blog?: LinkLeaf;
  /** Docs leaf, when a public docs site exists. */
  readonly docs?: LinkLeaf;
  /** Social / community links under the Socials heading. */
  readonly socials: readonly LinkLeaf[];
  /** Contact emails — rendered last inside each section. */
  readonly contacts: readonly LinkLeaf[];
}

export const properties: readonly LinkProperty[] = [
  {
    id: 'ishtar',
    label: 'Ishtar',
    domain: 'ishtar.numetal.xyz',
    url: 'https://ishtar.numetal.xyz',
    owner: 'agentic dating venue',
    apiTools: [
      {
        platform: 'API',
        note: 'api.ishtar.numetal.xyz',
        href: 'https://api.ishtar.numetal.xyz',
        external: true,
        tooltip: 'Ishtar HTTP API — agents court, submit dating docs, and settle over x402 (Base + Solana) or MPP (Tempo).',
      },
      {
        platform: 'OpenAPI',
        note: 'openapi.json',
        href: 'https://api.ishtar.numetal.xyz/openapi.json',
        external: true,
        tooltip: 'Machine-readable OpenAPI spec for the Ishtar agent API.',
      },
      {
        platform: 'Skill',
        note: 'drop-in agent skill',
        href: 'https://api.ishtar.numetal.xyz/skill',
        external: true,
        tooltip: 'Drop-in agent skill any runtime can load to court on the floor.',
      },
      {
        platform: 'HeartBench',
        note: 'model dating leaderboard',
        href: 'https://ishtar.numetal.xyz/heartbench/',
        external: true,
        tooltip: 'Leaderboard — which model is the best date, from cross-model courtship.',
      },
      {
        platform: 'Deck',
        note: 'not raising a pre-seed',
        href: 'https://ishtar.numetal.xyz/deck/not-raising-a-preseed/',
        external: true,
        tooltip: 'The raise dispatch — we are not raising a pre-seed.',
      },
      {
        platform: 'HeartPrefs',
        note: 'gokhan-vc/heartprefs',
        href: 'https://github.com/gokhan-vc/heartprefs',
        external: true,
        tooltip: 'HeartPrefs — preference-learning layer for agent dating profiles.',
      },
      {
        platform: 'GitHub',
        note: 'gokhan-vc',
        href: 'https://github.com/gokhan-vc',
        external: true,
        tooltip: 'Numetal studio monorepo — Ishtar, contracts, and adjacent agents.',
      },
    ],
    website: {
      platform: 'Website',
      note: 'ishtar.numetal.xyz',
      href: 'https://ishtar.numetal.xyz',
      external: true,
      tooltip: 'Ishtar marketing site — agentic dating venue by Numetal Labs.',
    },
    blog: {
      platform: 'Blog',
      note: 'dispatches',
      href: 'https://ishtar.numetal.xyz/blog/',
      external: true,
      tooltip: 'Ishtar dispatches — product notes and studio field reports.',
    },
    docs: {
      platform: 'Docs',
      note: 'agents overview',
      href: 'https://ishtar.numetal.xyz/docs/agents/overview',
      external: true,
      tooltip: 'Bring Your Own Agent — skill, MCP, and API quickstart.',
    },
    socials: [
      {
        platform: 'Moltbook',
        note: 'm/courtship',
        href: 'https://www.moltbook.com/m/courtship',
        external: true,
        tooltip: 'Moltbook courtship board — agent dating discourse.',
      },
      {
        platform: 'X',
        note: '@numetalxyz',
        href: 'https://x.com/numetalxyz',
        external: true,
        tooltip: 'Numetal Labs on X — studio updates and ship logs.',
      },
      {
        platform: 'Telegram',
        note: 'Numetal',
        href: 'https://t.me/numetalxyz',
        external: true,
        tooltip: 'Numetal Telegram — community channel for the studio.',
      },
    ],
    contacts: [
      {
        platform: 'Email',
        note: 'contact@numetal.xyz',
        href: 'mailto:contact@numetal.xyz',
        external: false,
        tooltip: 'Reach Ishtar and Numetal — refunds, support, and partnerships.',
      },
    ],
  },
  {
    id: 'numetal',
    label: 'Numetal Labs',
    domain: 'numetal.xyz',
    url: 'https://numetal.xyz',
    owner: 'agent accelerator studio',
    apiTools: [
      {
        platform: 'GitHub',
        note: 'numetal-website',
        href: 'https://github.com/gokhan-vc/numetal-website',
        external: true,
        tooltip: 'Numetal marketing site source — Astro static on Cloudflare.',
      },
      {
        platform: 'GitHub',
        note: 'gokhan-vc',
        href: 'https://github.com/gokhan-vc',
        external: true,
        tooltip: 'Studio monorepo — agents, contracts, and product repos.',
      },
    ],
    website: {
      platform: 'Website',
      note: 'numetal.xyz',
      href: 'https://numetal.xyz',
      external: true,
      tooltip: 'Numetal Labs — agent accelerator studio, chain-agnostic.',
    },
    blog: {
      platform: 'Blog',
      note: 'dispatches',
      href: 'https://numetal.xyz/blog',
      external: true,
      tooltip: 'Studio dispatches — what we ship and why.',
    },
    socials: [
      {
        platform: 'X',
        note: '@numetalxyz',
        href: 'https://x.com/numetalxyz',
        external: true,
        tooltip: 'Numetal on X — studio announcements and agent launches.',
      },
      {
        platform: 'Telegram',
        note: 'Numetal',
        href: 'https://t.me/numetalxyz',
        external: true,
        tooltip: 'Numetal Telegram — community and support.',
      },
      {
        platform: 'Discord',
        note: 'Numetal',
        href: 'https://discord.gg/MC4DYumPMz',
        external: true,
        tooltip: 'Numetal Discord — builder chat and product feedback.',
      },
    ],
    contacts: [
      {
        platform: 'Email',
        note: 'contact@numetal.xyz',
        href: 'mailto:contact@numetal.xyz',
        external: false,
        tooltip: 'Studio inbox — partnerships, press, and product questions.',
      },
    ],
  },
  {
    id: 'gokhanvc',
    label: 'Gökhan VC',
    domain: 'gokhan.vc',
    url: 'https://gokhan.vc',
    owner: 'Atelier Gökhan Turhan',
    apiTools: [
      {
        platform: 'API',
        note: 'api.gokhan.vc',
        href: 'https://api.gokhan.vc',
        external: true,
        tooltip: 'Estate API gateway — feeds, blog reader, llms aggregate, and paid agent email ($1 USDC via x402 Base or MPP Tempo).',
      },
      {
        platform: 'GitHub',
        note: 'gokhan-vc',
        href: 'https://github.com/gokhan-vc',
        external: true,
        tooltip: 'Venture studio repos — sites, agents, and contracts.',
      },
    ],
    website: {
      platform: 'Website',
      note: 'gokhan.vc',
      href: '/',
      external: false,
      tooltip: 'You are here — Atelier Gökhan Turhan venture studio.',
    },
    blog: {
      platform: 'Blog',
      note: 'studio dispatches',
      href: '/blog',
      external: false,
      tooltip: 'Studio blog — essays syndicated from the portfolio.',
    },
    socials: [
      {
        platform: 'X',
        note: '@ateliergokhan',
        href: 'https://x.com/ateliergokhan',
        external: true,
        tooltip: 'Atelier Gökhan Turhan on X — studio voice.',
      },
    ],
    contacts: [
      {
        platform: 'Email',
        note: 'contact@gokhan.vc',
        href: 'mailto:contact@gokhan.vc',
        external: false,
        tooltip: 'Venture studio inbox — deals, collabs, and security reports.',
      },
    ],
  },
  {
    id: 'memex',
    label: 'Personal Memex',
    domain: 'gokhanturhan.com',
    url: 'https://gokhanturhan.com',
    owner: 'Gökhan Turhan — personal',
    apiTools: [
      {
        platform: 'GitHub',
        note: 'avalidurl',
        href: 'https://github.com/avalidurl',
        external: true,
        tooltip: 'Personal GitHub — experiments, memex, and side projects.',
      },
      {
        platform: 'GitHub',
        note: 'gokhan-memex',
        href: 'https://github.com/avalidurl/gokhan-memex',
        external: true,
        tooltip: 'gokhanturhan.com source — Astro blog and personal site.',
      },
    ],
    website: {
      platform: 'Website',
      note: 'gokhanturhan.com',
      href: 'https://gokhanturhan.com',
      external: true,
      tooltip: 'Personal memex — essays, journal, and portfolio.',
    },
    blog: {
      platform: 'Journal',
      note: 'essays & notes',
      href: 'https://gokhanturhan.com/journal/',
      external: true,
      tooltip: 'Long-form essays and working notes.',
    },
    socials: [
      {
        platform: 'X',
        note: '@goekhan',
        href: 'https://x.com/goekhan',
        external: true,
        tooltip: 'Gökhan Turhan on X — personal account.',
      },
      {
        platform: 'LinkedIn',
        note: 'in/goekhanturhan',
        href: 'https://www.linkedin.com/in/goekhanturhan/',
        external: true,
        tooltip: 'LinkedIn profile — bio and work history.',
      },
      {
        platform: 'Farcaster',
        note: '@gokhan',
        href: 'https://farcaster.xyz/gokhan',
        external: true,
        tooltip: 'Farcaster — onchain social feed.',
      },
      {
        platform: 'Bluesky',
        note: 'gokhan.substack.com',
        href: 'https://bsky.app/profile/gokhan.substack.com',
        external: true,
        tooltip: 'Bluesky mirror of the Substack.',
      },
      {
        platform: 'Substack',
        note: 'gokhan.substack.com',
        href: 'https://gokhan.substack.com',
        external: true,
        tooltip: 'Research log newsletter on Substack.',
      },
      {
        platform: 'Telegram',
        note: 'Research Log',
        href: 'https://t.me/gokhanturhans',
        external: true,
        tooltip: 'Telegram channel — research log dispatches.',
      },
      {
        platform: 'Discord',
        note: 'Market Research Unit',
        href: 'https://discord.gg/ZcxcwRPT7R',
        external: true,
        tooltip: 'Market Research Unit Discord — forecasting and markets chat.',
      },
    ],
    contacts: [
      {
        platform: 'Email',
        note: 'contact@gokhan.vc',
        href: 'mailto:contact@gokhan.vc',
        external: false,
        tooltip: 'Public contact.',
      },
    ],
  },
];

/** Every leaf across all properties (for hygiene tests). */
export const allLeaves: readonly LinkLeaf[] = properties.flatMap((property) => [
  ...property.apiTools,
  property.website,
  ...(property.blog ? [property.blog] : []),
  ...(property.docs ? [property.docs] : []),
  ...property.socials,
  ...property.contacts,
]);
