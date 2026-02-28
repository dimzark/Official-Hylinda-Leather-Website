import { SITE_URL, getAllProductSlugs } from '../lib/data';

export default function sitemap() {
  const slugs = getAllProductSlugs();
  const productUrls = slugs.map(({ slug }) => ({
    url: `${SITE_URL}/product/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...productUrls,
  ];
}
