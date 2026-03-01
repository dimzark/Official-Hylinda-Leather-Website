const rawProducts = require('../data/products.json');
const brandContent = require('../brand-content.json');

function orderKey(p) {
  const t = (p.title || '').toUpperCase();
  if (t.indexOf('BRASOV') === 0) return 0;
  if (t.indexOf('CHICAGO') === 0) return 1;
  if (t.indexOf('ADELAIDE') === 0) return 2;
  if (t.indexOf('NARVA') === 0) return 3;
  if (t.indexOf('MEDELLIN') === 0) return 4;
  if (/CAMERA|PHOTOGRAPHY/.test(t)) return 6;
  return 5;
}

const products = rawProducts
  .filter((p) => (p.title || '').trim() !== 'Black Leather MacBook Case')
  .sort((a, b) => orderKey(a) - orderKey(b));

const IMAGE_BASE = process.env.NEXT_PUBLIC_IMAGE_BASE || '/uploads/';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://hylindaleather.com';

const brand = {
  siteName: brandContent.siteName || 'Hylinda Leather',
  heroHeadline: brandContent.heroHeadline || brandContent.siteDescription || 'Your personal compass',
  heroDesc: brandContent.heroDesc || 'Genuine leather bags and accessories designed and handcrafted with care.',
  aboutStory: (brandContent.about && brandContent.about.story) ? brandContent.about.story : [],
  tagline: brandContent.tagline || brandContent.siteDescription || 'Your Personal Compass',
  contact: brandContent.contact || {},
};

function getImageUrl(path) {
  if (!path) return '';
  return IMAGE_BASE.replace(/\/$/, '') + '/' + path.replace(/^\//, '');
}

function getProductBySlug(slug) {
  const s = String(slug || '');
  return products.find((p) => (p.slug || '').toString() === s || String(p.id) === s) || null;
}

function getAllProductSlugs() {
  return products.map((p) => ({ slug: p.slug && p.slug !== String(p.id) ? p.slug : String(p.id) }));
}

module.exports = {
  products,
  brand,
  IMAGE_BASE,
  SITE_URL,
  getImageUrl,
  getProductBySlug,
  getAllProductSlugs,
};
