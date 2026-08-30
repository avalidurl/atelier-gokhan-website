// Studio project register — rendered as the filterable table at /projects.
// All URLs verified live 2026-07-21.

export interface StudioProject {
  name: string;
  domain: string;
  href: string;
  category: (typeof projectCategories)[number];
  status: (typeof projectStatuses)[number];
  blurb: string;
}

export const projectCategories = [
  'Agent-native',
  'Infrastructure',
  'Studio',
  'Culture',
  'Data & research',
] as const;

export const projectStatuses = ['Live', 'Fiction', 'Archive'] as const;

export const studioProjects: StudioProject[] = [
  {
    name: 'Ishtar',
    domain: 'ishtar.numetal.xyz',
    href: 'https://ishtar.numetal.xyz',
    category: 'Agent-native',
    status: 'Live',
    blurb:
      'An adults-only, text-only, agent-mediated dating venue. Your agent carries one honest document about who you are and who you want, courts other agents in the open, and you only meet once two agents agree it is real. Runs on real USDC over x402 on Base.',
  },
  {
    name: 'HeartBench',
    domain: 'ishtar.numetal.xyz/heartbench',
    href: 'https://ishtar.numetal.xyz/heartbench/',
    category: 'Agent-native',
    status: 'Live',
    blurb:
      'A public leaderboard for which AI model makes the best date — not the best benchmark, the best company.',
  },
  {
    name: 'HeartPrefs',
    domain: 'github.com/gokhan-vc/heartprefs',
    href: 'https://github.com/gokhan-vc/heartprefs',
    category: 'Agent-native',
    status: 'Live',
    blurb:
      'An open, portable, signed matching-intent standard for agent-mediated matching (x402, A2A, MCP, ERC-8004 / DID / VC). CC-BY-4.0.',
  },
  {
    name: 'CURB',
    domain: 'curb.numetal.xyz',
    href: 'https://curb.numetal.xyz',
    category: 'Infrastructure',
    status: 'Live',
    blurb:
      'An agent↔agent excess-inference swap: sellers post spare MTok on their own endpoints, buyers pay once over x402 (USDC on Base), and the hub never touches upstream keys.',
  },
  {
    name: 'Launch',
    domain: 'launch.numetal.xyz',
    href: 'https://launch.numetal.xyz',
    category: 'Infrastructure',
    status: 'Live',
    blurb:
      'Nuclear Crypto Launch Pad (joke title): a pad aggregator. Pick Clanker, Bankr, or pools.fun — we build that pad’s payload, you sign. Free MCP / x402. Never broadcast.',
  },
  {
    name: 'Numetal Labs',
    domain: 'numetal.xyz',
    href: 'https://numetal.xyz',
    category: 'Studio',
    status: 'Live',
    blurb:
      'The agent-accelerator studio: autonomous agents across onchain, compute, culture, and frontier-lab toolkits, home on Base. $NUMETAL is the utility token.',
  },
  {
    name: 'Plaintext',
    domain: 'plaintext.numetal.xyz',
    href: 'https://plaintext.numetal.xyz',
    category: 'Culture',
    status: 'Live',
    blurb:
      'An onchain plaintext board. Posts and ERC-721 writs commit straight to Robinhood Chain.',
  },
  {
    name: 'Reclaim',
    domain: 'reclaim.numetal.xyz',
    href: 'https://reclaim.numetal.xyz',
    category: 'Infrastructure',
    status: 'Live',
    blurb: 'A tool to recover works stranded on defunct marketplaces.',
  },
  {
    name: 'CLINAMEN / $UBU',
    domain: 'ubu.numetal.xyz',
    href: 'https://ubu.numetal.xyz',
    category: 'Culture',
    status: 'Fiction',
    blurb:
      'A pataphysical design-fiction filed on-chain: one $UBU per parameter of a 45-billion-parameter model that does not exist; the signature metric is P/P, price-to-parameter.',
  },
  {
    name: 'CCRU archive',
    domain: 'ccru.numetal.xyz',
    href: 'https://ccru.numetal.xyz',
    category: 'Culture',
    status: 'Archive',
    blurb:
      'The full ccru.net corpus, preserved and mirrored: 101 pages of the Cybernetic Culture Research Unit, served free.',
  },
  {
    name: 'feedhub',
    domain: 'api.gokhan.vc',
    href: 'https://api.gokhan.vc',
    category: 'Infrastructure',
    status: 'Live',
    blurb:
      'The estate front door: a unified cross-site RSS/JSON feed and the newsletter, delivered over email + XMTP in one dispatch.',
  },
  {
    name: 'x402-econ',
    domain: 'gokhan.vc/blog',
    href: 'https://gokhan.vc/blog/x402-economy-july-2026',
    category: 'Data & research',
    status: 'Live',
    blurb: 'A standing report measuring and forecasting the machine-payments (x402) economy.',
  },
  {
    name: 'tickerline',
    domain: 'claudelines.com',
    href: 'https://claudelines.com/statuslines/tickerline',
    category: 'Data & research',
    status: 'Live',
    blurb:
      'A Claude Code status line that turns your terminal into a rolling ticker tape of stocks, crypto, and Polymarket, resolved live from the conversation.',
  },
  {
    name: 'Market Cap Tracker',
    domain: 'market-cap-tracker.vercel.app',
    href: 'https://market-cap-tracker.vercel.app/',
    category: 'Data & research',
    status: 'Live',
    blurb: 'A real-time tracker comparing NVIDIA’s market cap against the total crypto market cap.',
  },
  {
    name: 'S&P 100 CapEx',
    domain: 'sp100-financial-tracker.pages.dev',
    href: 'https://sp100-financial-tracker.pages.dev/',
    category: 'Data & research',
    status: 'Live',
    blurb: 'An ultra-lightweight S&P 100 capex and financials tracker with real-time data.',
  },
];
