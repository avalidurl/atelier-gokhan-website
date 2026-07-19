import { site } from './site';

export const HERO_ACCENTS = ['purple', 'rose', 'green'] as const;

export type HeroAccent = (typeof HERO_ACCENTS)[number];

export interface HeroSegment {
  readonly text: string;
  readonly accent?: HeroAccent;
  /** Renders with the name annotation (meaning + pronunciation) on hover/focus. */
  readonly gloss?: boolean;
}

export const heroSegments: ReadonlyArray<HeroSegment> = [
  { text: 'Gökhan', accent: 'purple', gloss: true },
  { text: ' Ventures', accent: 'purple' },
  { text: ' is a venture studio for a ' },
  { text: 'mechanomical', accent: 'rose' },
  { text: ' research into the techniques of ' },
  { text: 'AGI + human conviviality', accent: 'green' },
  { text: ' in the long now.' },
];

export function joinHeroText(segments: ReadonlyArray<HeroSegment>): string {
  return segments.map((segment) => segment.text).join('');
}

if (joinHeroText(heroSegments) !== site.blurb) {
  throw new Error(
    'Hero segments must concatenate to the canonical site.blurb verbatim (UTF-8 ö included).',
  );
}
