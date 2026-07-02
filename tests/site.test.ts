import { describe, it, expect } from 'vitest';
import { site } from '../src/data/site';

describe('site data', () => {
  it('exposes the brand name as Atelier Gökhan Turhan', () => {
    expect(site.name).toBe('Atelier Gökhan Turhan');
  });

  it('uses gokhan.vc as canonical domain and origin', () => {
    expect(site.domain).toBe('gokhan.vc');
    expect(site.url).toBe('https://gokhan.vc');
  });

  it('exposes contact@gokhan.vc as the contact email', () => {
    expect(site.contactEmail).toBe('contact@gokhan.vc');
  });

  it('renders the canonical venture-studio blurb verbatim with the accented ö', () => {
    const canonical =
      'Atelier Gökhan Turhan is a venture studio for a mechanomical research into the techniques of AGI + human conviviality in the long now.';
    expect(site.blurb).toBe(canonical);
    expect(site.blurb).toContain('Gökhan');
    expect(site.blurb).not.toContain('Ã¶');
    expect(site.blurb.endsWith('.')).toBe(true);
  });

  it('uses the primary monochrome accent (#141414) as theme color', () => {
    expect(site.themeColor).toBe('#141414');
  });
});
