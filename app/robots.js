import { SITE_URL } from '../lib/data';

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
