import { Suspense } from 'react';
import './globals.css';
import { SITE_URL, brand, getImageUrl } from '../lib/data';
import Header from './components/Header';
import Footer from './components/Footer';

const siteName = brand.siteName || 'Hylinda Leather';
const description = brand.heroDesc || 'Genuine leather bags and accessories — designed and handcrafted with care.';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${siteName} — Hand Crafted Leather Goods`,
    template: `%s | ${siteName}`,
  },
  description,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName,
    title: `${siteName} — Hand Crafted Leather Goods`,
    description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteName} — Hand Crafted Leather Goods`,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

function stripHtml(html) {
  if (!html) return '';
  return String(html)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\r\n/g, ' ')
    .replace(/\n/g, ' ')
    .trim();
}

export default function RootLayout({ children }) {
  const logoUrl = getImageUrl('2018/03/cropped-hylinda-1-1.jpg');
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: SITE_URL,
    description: stripHtml(description),
    logo: logoUrl.startsWith('http') ? logoUrl : `${SITE_URL}${logoUrl}`,
  };
  if (brand.contact?.email) jsonLd.email = brand.contact.email;
  if (brand.contact?.facebook) jsonLd.sameAs = [brand.contact.facebook].filter(Boolean);
  if (brand.contact?.instagram) jsonLd.sameAs = [...(jsonLd.sameAs || []), brand.contact.instagram];

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Suspense fallback={null}>
          <Header />
        </Suspense>
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
