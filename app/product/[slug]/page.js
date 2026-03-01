import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getProductBySlug,
  getAllProductSlugs,
  getImageUrl,
  products,
  SITE_URL,
} from '../../../lib/data';
import ProductGallery from '../../../app/components/ProductGallery';

function stripHtml(html) {
  if (!html) return '';
  return String(html)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\r\n/g, ' ')
    .replace(/\n/g, ' ')
    .trim();
}

/** Remove "Ready to ship in X business days." and similar from description HTML. */
function stripShippingLine(html) {
  if (!html) return '';
  return String(html)
    .replace(/\s*Ready to ship in [\d\-]+ business days\.?\s*/gi, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Rewrite WordPress product links (hylindaleather.com/product/xxx) to our /product/slug links. */
function rewriteProductLinks(html) {
  if (!html) return '';
  return String(html).replace(
    /href=["']https?:\/\/(?:www\.)?hylindaleather\.com\/product\/([^"'\s\/?#]+)[^"']*["']/gi,
    (match, pathSeg) => {
      const slug = pathSeg.replace(/\/$/, '');
      const p = getProductBySlug(slug);
      if (!p) return match;
      const ourSlug = p.slug && p.slug !== String(p.id) ? p.slug : String(p.id);
      return `href="/product/${ourSlug}"`;
    }
  );
}

/** Wrap bullet lines in a styled block (no "Details" label). Order: Genuine leather first, then dimensions, then rest. */
function wrapDetailsBlock(html) {
  if (!html) return '';
  let s = String(html);
  s = s.replace(/<strong>\s*Details\s*:?\s*<\/strong>/gi, 'Details: ');
  s = s.replace(/<strong>\s*Details\s*<\/strong>\s*:?\s*/gi, 'Details: ');
  return s.replace(
    /(Details\s*:?\s*)(?:<\/[^>]+>)?\s*(?:\n|<br\s*\/?>)\s*((?:(?:[\u2022\u2042\u2043‣][^\n<]*(?:\n|<br\s*\/?>)\s*)*)(?:[\u2022\u2042\u2043‣][^\n<]*))/gi,
    (_, _label, lines) => {
      const raw = lines.replace(/\n/g, '<br>').replace(/<br\s*\/?>/gi, '<br>').trim();
      const items = raw.split(/<br\s*\/?>/gi).map((line) => line.trim()).filter(Boolean);
      const isGenuineLeather = (t) => /genuine\s+leather/i.test(t);
      const isDimensions = (t) => /[HLWD]:\s*\d|\d+\s*cm/i.test(t);
      const sorted = [...items].sort((a, b) => {
        const aGen = isGenuineLeather(a) ? 0 : 1;
        const bGen = isGenuineLeather(b) ? 0 : 1;
        if (aGen !== bGen) return aGen - bGen;
        const aDim = isDimensions(a) ? 0 : 1;
        const bDim = isDimensions(b) ? 0 : 1;
        if (aDim !== bDim) return aDim - bDim;
        return 0;
      });
      const content = sorted.join('<br>');
      return '<div class="product-page__details-block">' + content + '</div>';
    }
  );
}

export async function generateStaticParams() {
  return getAllProductSlugs();
}

export async function generateMetadata({ params }) {
  const product = getProductBySlug(params.slug);
  if (!product) return { title: 'Product' };
  const title = product.title || 'Product';
  const desc = stripHtml(product.short_description || product.description || '').slice(0, 160);
  const imagePath = product.featured_image || (product.images && product.images[0]);
  const imageUrl = imagePath ? getImageUrl(imagePath) : null;
  const fullImageUrl = imageUrl && imageUrl.startsWith('http') ? imageUrl : `${SITE_URL}${imageUrl}`;

  return {
    title,
    description: desc || `${title} — Hylinda Leather`,
    openGraph: {
      title,
      description: desc || title,
      url: `${SITE_URL}/product/${params.slug}`,
      images: fullImageUrl ? [{ url: fullImageUrl, alt: title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc || title,
    },
  };
}

export default function ProductPage({ params }) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const related = products
    .filter((p) => p.id !== product.id)
    .slice(0, 16);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: stripHtml(stripShippingLine(product.description || product.short_description || '')),
    image: (product.images || [])
      .slice(0, 5)
      .map((path) => {
        const u = getImageUrl(path);
        return u.startsWith('http') ? u : `${SITE_URL}${u}`;
      }),
    sku: product.sku || undefined,
    offers: product.price
      ? {
          '@type': 'Offer',
          price: product.price,
          priceCurrency: 'EUR',
          availability: product.stock_status === 'instock' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        }
      : undefined,
  };

  const slugFor = (p) => (p.slug && p.slug !== String(p.id) ? p.slug : String(p.id));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="product-detail-page">
        <div className="wrap" style={{ maxWidth: 1100, padding: '0 2rem' }}>
          <Link href="/" className="product-page__back">
            ← Back to collection
          </Link>
        </div>
        <div className="product-page__layout">
          <div className="product-page__gallery">
            <ProductGallery product={product} />
          </div>
          <div className="product-page__detail">
            <h1 className="product-page__title">{product.title || ''}</h1>
            {product.price && (
              <p className="product-page__price">€{product.price}</p>
            )}
            <div
              className="product-page__description"
              dangerouslySetInnerHTML={{
                __html: rewriteProductLinks(
                wrapDetailsBlock(
                  stripShippingLine(
                    (product.description || '').replace(/\r\n/g, '\n').replace(/rn/g, '\n')
                  )
                )
              ),
              }}
            />
            <p className="product-page__order-note">Made to order. Inquire for availability and details.</p>
            <a
              href={`mailto:hylindaleather@gmail.com?subject=${encodeURIComponent('Interest in ' + (product.title || 'Product'))}&body=${encodeURIComponent('I would like to buy ' + (product.title || 'this product') + '. Can you give me more details about the availability?')}`}
              className="product-page__order-btn"
            >
              Order / Inquire
            </a>
          </div>
        </div>
        {related.length > 0 && (
          <div className="product-page__related">
            <h2>You might also like</h2>
            <div className="products-grid">
              {related.map((p) => {
                const s = slugFor(p);
                const imgSrc = (p.images && p.images[0]) ? getImageUrl(p.images[0]) : '';
                const short = stripHtml(p.short_description || '').slice(0, 80);
                const price = p.price ? '€' + p.price : '';
                return (
                  <Link key={p.id} href={`/product/${s}`} className="product-card">
                    <div className="product-card__img-wrap">
                      <img
                        className="product-card__img"
                        src={imgSrc}
                        alt={p.title || ''}
                        loading="lazy"
                      />
                    </div>
                    <div className="product-card__body">
                      <div className="product-card__title">{p.title || ''}</div>
                      {price && <div className="product-card__price">{price}</div>}
                      {short && <div className="product-card__desc">{short}</div>}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
