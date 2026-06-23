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
  name: 'Atelier Gökhan Turhan',
  domain: 'gokhan.vc',
  url: 'https://gokhan.vc',
  blurb:
    'Atelier Gökhan Turhan is a venture studio for a mechanomical research into the techniques of AGI + human conviviality in the long now.',
  contactEmail: 'contact@gokhan.vc',
  description:
    'Atelier Gökhan Turhan is a venture studio for a mechanomical research into the techniques of AGI + human conviviality in the long now.',
  themeColor: '#8466C4',
};
