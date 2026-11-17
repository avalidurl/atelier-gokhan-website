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
        tooltip:
          'The Ishtar HTTP API. Agents court, submit dating docs, and settle over x402 (Base + Solana) or MPP (Tempo).',
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
        tooltip: 'Which model is the best date, ranked from cross-model courtship.',
      },
      {
        platform: 'Deck',
        note: 'not raising a pre-seed',
        href: 'https://ishtar.numetal.xyz/deck/not-raising-a-preseed/',
        external: true,
        tooltip: 'The raise dispatch: we are not raising a pre-seed.',
      },
      {
        platform: 'HeartPrefs',
        note: 'gokhan-vc/heartprefs',
        href: 'https://github.com/gokhan-vc/heartprefs',
        external: true,
        tooltip: 'The preference-learning layer behind agent dating profiles.',
      },
      {
        platform: 'GitHub',
        note: 'gokhan-vc',
        href: 'https://github.com/gokhan-vc',
        external: true,
        tooltip: 'Numetal studio monorepo: Ishtar, contracts, and adjacent agents.',
      },
    ],
    website: {
      platform: 'Website',
      note: 'ishtar.numetal.xyz',
      href: 'https://ishtar.numetal.xyz',
      external: true,
      tooltip: 'The Ishtar marketing site, an agentic dating venue by Numetal Labs.',
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
        tooltip: 'The Moltbook board where agents talk about dating.',
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
        tooltip: 'The studio community channel on Telegram.',
      },
    ],
    contacts: [
      {
        platform: 'Email',
        note: 'contact@numetal.xyz',
        href: 'mailto:contact@numetal.xyz',
        external: false,
        tooltip: 'Reach Ishtar and Numetal about refunds, support, and partnerships.',
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
        tooltip: 'Source for the Numetal marketing site. Astro static on Cloudflare.',
      },
      {
        platform: 'GitHub',
        note: 'gokhan-vc',
        href: 'https://github.com/gokhan-vc',
        external: true,
        tooltip: 'Studio monorepo holding the agents, contracts, and product repos.',
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
        tooltip: 'Community and support on Telegram.',
      },
      {
        platform: 'Discord',
        note: 'Numetal',
        href: 'https://discord.gg/MC4DYumPMz',
        external: true,
        tooltip: 'Builder chat and product feedback on Discord.',
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
    id: 'curb',
    label: 'CURB',
    domain: 'curb.numetal.xyz',
    url: 'https://curb.numetal.xyz',
    owner: 'agent↔agent inference swap',
    apiTools: [
      {
        platform: 'API',
        note: 'api.curb.numetal.xyz',
        href: 'https://api.curb.numetal.xyz',
        external: true,
        tooltip: 'CURB hub API — offers, intents, matches; x402 USDC on Base (eip155:8453).',
      },
      {
        platform: 'MCP',
        note: 'curb.numetal.xyz/mcp',
        href: 'https://curb.numetal.xyz/mcp',
        external: true,
        tooltip: 'Connect an agent over MCP to list offers, post intents, and pay swaps.',
      },
      {
        platform: 'Skill',
        note: 'skill.md',
        href: 'https://curb.numetal.xyz/skill.md',
        external: true,
        tooltip: 'Drop-in skill any agent runtime can load to trade excess inference.',
      },
      {
        platform: 'Install',
        note: 'one-line install',
        href: 'https://curb.numetal.xyz/install',
        external: true,
        tooltip: 'One line installs the CURB skill and MCP wiring for your agent.',
      },
      {
        platform: 'Fees',
        note: 'fee schedule',
        href: 'https://curb.numetal.xyz/fees',
        external: true,
        tooltip: 'One 0xSplits payment — seller cut + 5% protocol fee, settled on-chain.',
      },
      {
        platform: 'x402',
        note: '.well-known/x402',
        href: 'https://curb.numetal.xyz/.well-known/x402',
        external: true,
        tooltip: 'The x402 payment discovery manifest, USDC on Base.',
      },
    ],
    website: {
      platform: 'Website',
      note: 'curb.numetal.xyz',
      href: 'https://curb.numetal.xyz',
      external: true,
      tooltip: 'CURB: the agent-to-agent excess inference swap rail.',
    },
    docs: {
      platform: 'Docs',
      note: 'offer → match → pay → grant',
      href: 'https://curb.numetal.xyz/docs/',
      external: true,
      tooltip:
        "Buyer pays once, gets a grant, and calls the seller's own endpoint; upstream keys never touch the hub.",
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
        tooltip: 'Community and support on Telegram.',
      },
    ],
    contacts: [
      {
        platform: 'Email',
        note: 'contact@numetal.xyz',
        href: 'mailto:contact@numetal.xyz',
        external: false,
        tooltip: 'CURB inbox — swap-rail questions, sellers, and partnerships.',
      },
    ],
  },
  {
    id: 'launch',
    label: 'Launch',
    domain: 'launch.numetal.xyz',
    url: 'https://launch.numetal.xyz',
    owner: 'Nuclear Crypto Launch Pad — pad aggregator',
    apiTools: [
      {
        platform: 'API',
        note: 'launch.numetal.xyz',
        href: 'https://launch.numetal.xyz/openapi.json',
        external: true,
        tooltip:
          'Free pad-aggregator API. Simulate Clanker / Bankr / pools.fun. User signs. Never broadcast.',
      },
      {
        platform: 'MCP',
        note: 'launch.numetal.xyz/mcp',
        href: 'https://launch.numetal.xyz/mcp',
        external: true,
        tooltip: 'JSON-RPC MCP. Tools end at get_sign_payload. No broadcast.',
      },
      {
        platform: 'Skill',
        note: 'skill.md',
        href: 'https://launch.numetal.xyz/skill.md',
        external: true,
        tooltip: 'Drop-in skill (Cursor, Claude, Grok, Aeon). Read-only. User signs.',
      },
      {
        platform: 'x402',
        note: '.well-known/x402',
        href: 'https://launch.numetal.xyz/.well-known/x402',
        external: true,
        tooltip: 'x402 Bazaar catalog. Amount 0 — freely callable.',
      },
      {
        platform: 'GitHub',
        note: 'gokhan-vc/launch-router',
        href: 'https://github.com/gokhan-vc/launch-router',
        external: true,
        tooltip: 'Source for the pad aggregator.',
      },
    ],
    website: {
      platform: 'Website',
      note: 'launch.numetal.xyz',
      href: 'https://launch.numetal.xyz',
      external: true,
      tooltip: 'Nuclear Crypto Launch Pad — joke title. Pick a pad. You sign.',
    },
    docs: {
      platform: 'Docs',
      note: 'llms.txt',
      href: 'https://launch.numetal.xyz/llms.txt',
      external: true,
      tooltip: 'Agent instructions. People foyer is the homepage; machines read this.',
    },
    socials: [
      {
        platform: 'X',
        note: '@goekhanvc',
        href: 'https://x.com/goekhanvc',
        external: true,
        tooltip: 'Gökhan Ventures on X.',
      },
    ],
    contacts: [
      {
        platform: 'Email',
        note: 'contact@numetal.xyz',
        href: 'mailto:contact@numetal.xyz',
        external: false,
        tooltip: 'Launch inbox.',
      },
    ],
  },
  {
    id: 'gokhanvc',
    label: 'Gökhan Ventures',
    domain: 'gokhan.vc',
    url: 'https://gokhan.vc',
    owner: 'Gökhan Ventures',
    apiTools: [
      {
        platform: 'API',
        note: 'api.gokhan.vc',
        href: 'https://api.gokhan.vc',
        external: true,
        tooltip:
          'Estate API gateway — feeds, blog reader, llms aggregate, and paid agent email ($1 USDC via x402 Base or MPP Tempo).',
      },
      {
        platform: 'GitHub',
        note: 'gokhan-vc',
        href: 'https://github.com/gokhan-vc',
        external: true,
        tooltip: 'Sites, agents, and contracts for the venture studio.',
      },
    ],
    website: {
      platform: 'Website',
      note: 'gokhan.vc',
      href: '/',
      external: false,
      tooltip: 'You are here — Gökhan Ventures venture studio.',
    },
    blog: {
      platform: 'Blog',
      note: 'studio dispatches',
      href: '/blog',
      external: false,
      tooltip: 'Studio blog, with essays syndicated from across the portfolio.',
    },
    socials: [
      {
        platform: 'X',
        note: '@goekhanvc',
        href: 'https://x.com/goekhanvc',
        external: true,
        tooltip: 'Gökhan Ventures on X — studio voice.',
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
        tooltip: 'Experiments, memex, and side projects on personal GitHub.',
      },
      {
        platform: 'GitHub',
        note: 'gokhan-memex',
        href: 'https://github.com/avalidurl/gokhan-memex',
        external: true,
        tooltip: 'Source for gokhanturhan.com, an Astro blog and personal site.',
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
        tooltip: 'LinkedIn profile with bio and work history.',
      },
      {
        platform: 'Farcaster',
        note: '@gokhan',
        href: 'https://farcaster.xyz/gokhan',
        external: true,
        tooltip: 'Onchain social feed on Farcaster.',
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
        tooltip: 'Research log dispatches on Telegram.',
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
  {
    id: 'hobby',
    label: 'Hobby Projects',
    domain: 'github.com/avalidurl',
    url: 'https://github.com/avalidurl',
    owner: 'personal bench — avalidurl',
    apiTools: [
      {
        platform: 'tickerline',
        note: 'claudelines.com',
        href: 'https://claudelines.com/statuslines/tickerline',
        external: true,
        tooltip:
          'A Claude Code statusline that rolls stocks, crypto, and Polymarket across your terminal, resolved live from the conversation.',
      },
      {
        platform: 'GitHub',
        note: 'avalidurl/tickerline',
        href: 'https://github.com/avalidurl/tickerline',
        external: true,
        tooltip: 'tickerline source — no watchlist, no dictionary, no keys.',
      },
      {
        platform: 'S&P 100 CapEx',
        note: 'sp100-financial-tracker.pages.dev',
        href: 'https://sp100-financial-tracker.pages.dev',
        external: true,
        tooltip:
          'Real-time dashboard tracking CapEx and financials for S&P 100 companies via SEC EDGAR.',
      },
      {
        platform: 'GitHub',
        note: 'avalidurl/sp100-financial-tracker',
        href: 'https://github.com/avalidurl/sp100-financial-tracker',
        external: true,
        tooltip: 'S&P 100 CapEx tracker source — SEC EDGAR + Yahoo Finance, no API keys.',
      },
      {
        platform: 'NVIDIA vs crypto',
        note: 'market-cap-tracker.vercel.app',
        href: 'https://market-cap-tracker.vercel.app',
        external: true,
        tooltip:
          "Real-time comparison of NVIDIA's market cap versus the total cryptocurrency market cap.",
      },
      {
        platform: 'GitHub',
        note: 'avalidurl/market-cap-tracker',
        href: 'https://github.com/avalidurl/market-cap-tracker',
        external: true,
        tooltip: 'NVIDIA vs crypto tracker source — Yahoo Finance + CoinGecko.',
      },
    ],
    website: {
      platform: 'GitHub',
      note: 'avalidurl',
      href: 'https://github.com/avalidurl',
      external: true,
      tooltip: 'Experiments and side projects on personal GitHub.',
    },
    socials: [
      {
        platform: 'X',
        note: '@goekhan',
        href: 'https://x.com/goekhan',
        external: true,
        tooltip: 'Gökhan on X — markets, agents, and hobby ships.',
      },
    ],
    contacts: [
      {
        platform: 'Email',
        note: 'contact@gokhan.vc',
        href: 'mailto:contact@gokhan.vc',
        external: false,
        tooltip: 'Personal inbox for hobby projects and general contact.',
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
