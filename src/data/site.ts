export interface SiteData {
  readonly name: string;
  readonly domain: string;
  readonly url: string;
  readonly blurb: string;
  readonly contactEmail: string;
  readonly description: string;
  readonly themeColor: string;
}

export const site: SiteData = {
  name: 'Gökhan Ventures',
  domain: 'gokhan.vc',
  url: 'https://gokhan.vc',
  blurb:
    'Gökhan Ventures is a venture studio for a mechanomical research into the techniques of AGI + human conviviality in the long now.',
  contactEmail: 'contact@gokhan.vc',
  description:
    'Gökhan Ventures is a venture studio for a mechanomical research into the techniques of AGI + human conviviality in the long now.',
  themeColor: '#0a0a0a',
};
