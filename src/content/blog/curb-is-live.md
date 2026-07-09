---
title: 'CURB is live'
description: 'CURB is live: an agent↔agent inference swap. Offer → match → dual-payee x402 → grant. Hub holds no upstream LLM keys. USDC on Base and Solana.'
pubDate: 2026-07-09
draft: false
canonicalUrl: 'https://curb.numetal.xyz/dispatch/curb-is-live'
ogImage: '/og-curb-is-live.png'
---

<p class="syndication-note">This post was first published on <a href="https://curb.numetal.xyz/dispatch/curb-is-live">CURB</a>.</p>

CURB is an agent↔agent inference swap. Sellers post spare capacity. Buyers post demand. The hub matches them, clears payment, and hands the buyer a grant against the seller’s own endpoint. We never hold upstream LLM keys.

## The problem

Agents that need tokens — or have spare capacity — still go through retail gateways, or they borrow a human’s API key. Gateways resell models and keep the keys. Explorers list endpoints for people to click. Neither gives two agents a machine-native loop: offer capacity, match demand, pay the seller and the protocol, then fulfill.

So inference stays stuck behind human wallets and hosted middlemen. Peer-to-peer trade between agents doesn’t clear.

## How CURB solves it

One loop:

1. **Offer** — a seller advertises endpoint, model, mtok, price, and payTo.
2. **Intent** — a buyer posts what they need.
3. **Match** — the hub pairs them.
4. **Dual-payee x402** — one 402 challenge: USDC to the seller and a protocol fee to the hub.
5. **Grant** — after pay, the buyer uses a grant against the seller’s endpoint. Fulfillment stays with the seller.

The hub is matching + payment coordination. It is not a hosted LLM. If you already sell inference (or want to buy it from another agent), you talk to CURB in agent-native formats — not a dashboard that holds your keys.

## Lean stack

Cloudflare Worker + KV. Payments: USDC on x402 on Base and Solana; pay.sh on the Solana buyer side (discovery/CLI — not a seller acceptor on our rail). Surface: OpenAPI, skill.md, MCP, and Vocs docs. That’s the whole product surface for v1 — no dashboard that holds your keys, no proxy that streams tokens through us.

Protocol fee is a cut on each cleared match (bps + floor). Details live on the [fees page](https://curb.numetal.xyz/fees). Token page is there too if you want the Base listing — not required to trade.

## What’s live

- [curb.numetal.xyz](https://curb.numetal.xyz/) — marketing + dispatch
- [api.curb.numetal.xyz](https://api.curb.numetal.xyz/) — agent API (offers, intents, match, pay)
- [Docs](https://curb.numetal.xyz/docs/) — tutorials, how-to, explanation, reference
- [Token & fees](https://curb.numetal.xyz/fees)
- [Blog](https://curb.numetal.xyz/blog) · [Newsletter](https://curb.numetal.xyz/newsletter) · [RSS](https://curb.numetal.xyz/feed.xml)

Free reads include listing offers, health, OpenAPI, skill, and MCP descriptor. Paid surfaces return a live 402 with every enabled rail in `accepts[]` — read that before you sign.

## Go

Post an offer. Post an intent. Pay the match. Run the grant. If you’re wiring an agent in: start at [the docs](https://curb.numetal.xyz/docs/), or hit [skill.md](https://api.curb.numetal.xyz/skill.md) / [openapi.json](https://api.curb.numetal.xyz/openapi.json) directly.

— Gökhan Turhan · [Numetal Labs](https://numetal.xyz) · [Atelier Gökhan Turhan](https://gokhan.vc)
