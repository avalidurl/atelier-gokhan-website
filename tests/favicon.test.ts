import { describe, expect, it } from 'vitest';
import { readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

const REPO_ROOT = resolve(__dirname, '..');
const PUBLIC_DIR = resolve(REPO_ROOT, 'public');

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

// Monochrome accent trio — house style is strictly black & white; hierarchy is
// carried by weight and value, never hue. The purple/rose/green keys are kept as
// the primary/mid/light neutral slots so the gradient semantics stay meaningful.
const ACCENTS = {
  purple: '#141414',
  rose: '#5A5A5A',
  green: '#7C7C7C',
};

describe('boiling pot favicon SVG', () => {
  const svg = readFileSync(resolve(PUBLIC_DIR, 'favicon.svg'), 'utf8');

  it('is well-formed SVG with a 16x16 viewBox', () => {
    expect(svg).toMatch(/<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
    expect(svg).toMatch(/viewBox="0 0 16 16"/);
  });

  it('announces the brand with the correct UTF-8 ö (Gökhan, not Gokhan)', () => {
    expect(svg).toMatch(/aria-label="[^"]*Gökhan[^"]*"/);
    expect(svg).not.toMatch(/Gokhan/);
  });

  it('keeps the agentbounty framed-tile spirit (inset dark frame)', () => {
    expect(svg).toMatch(
      /<rect[^>]*x="0"[^>]*y="0"[^>]*width="16"[^>]*height="16"[^>]*fill="#111111"/i,
    );
  });

  it('blends all three monochrome accents inside a gradient (not as flat blocks)', () => {
    const accentRegex = new RegExp(`stop[^>]+stop-color="${ACCENTS.purple}"`, 'i');
    const roseRegex = new RegExp(`stop[^>]+stop-color="${ACCENTS.rose}"`, 'i');
    const greenRegex = new RegExp(`stop[^>]+stop-color="${ACCENTS.green}"`, 'i');
    expect(svg).toMatch(accentRegex);
    expect(svg).toMatch(roseRegex);
    expect(svg).toMatch(greenRegex);
    expect(svg).toMatch(/<radialGradient[^>]*id="boil"[\s\S]*?<\/radialGradient>/i);
  });

  it('places the primary accent (#141414) at the leading/central stop of the primary gradient', () => {
    const primary = svg.match(/<radialGradient[^>]*id="boil"[\s\S]*?<\/radialGradient>/i);
    expect(primary).not.toBeNull();
    const stops = [
      ...(primary?.[0].matchAll(/<stop[^>]*stop-color="(#[0-9A-Fa-f]{6})"/g) ?? []),
    ].map((m) => m[1].toUpperCase());
    expect(stops.length).toBeGreaterThanOrEqual(3);
    expect(stops[0]).toBe(ACCENTS.purple.toUpperCase());
    expect(stops).toEqual(
      expect.arrayContaining([
        ACCENTS.purple.toUpperCase(),
        ACCENTS.rose.toUpperCase(),
        ACCENTS.green.toUpperCase(),
      ]),
    );
  });

  it('does not render the three accents as disjoint flat blocks', () => {
    const flatPurpleRect = new RegExp(`<rect[^>]+fill="${ACCENTS.purple}"[^>]*/>`, 'i');
    const flatRoseRect = new RegExp(`<rect[^>]+fill="${ACCENTS.rose}"[^>]*/>`, 'i');
    const flatGreenRect = new RegExp(`<rect[^>]+fill="${ACCENTS.green}"[^>]*/>`, 'i');
    expect(svg).not.toMatch(flatPurpleRect);
    expect(svg).not.toMatch(flatRoseRect);
    expect(svg).not.toMatch(flatGreenRect);
  });
});

describe('favicon PNG fallbacks', () => {
  it.each([
    ['favicon-32.png', 200],
    ['apple-touch-icon.png', 1500],
  ])('%s exists, is a real PNG, and is non-trivial in size', (filename, minBytes) => {
    const filePath = resolve(PUBLIC_DIR, filename);
    const stat = statSync(filePath);
    expect(stat.size).toBeGreaterThan(minBytes);
    const head = readFileSync(filePath).subarray(0, 8);
    expect(head.equals(PNG_MAGIC)).toBe(true);
  });
});
