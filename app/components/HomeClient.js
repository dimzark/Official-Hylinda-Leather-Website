'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getImageUrl } from '../../lib/data';

const TAG_MAP = [
  { key: 'all', label: 'All' },
  { key: 'backpack', label: 'Backpack' },
  { key: 'shoulder', label: 'Shoulder' },
  { key: 'tote', label: 'Tote' },
  { key: 'clutch', label: 'Clutch' },
  { key: 'cross-body', label: 'Cross-body' },
  { key: 'bucket', label: 'Bucket' },
  { key: 'handbag', label: 'Handbag' },
  { key: 'camera', label: 'Camera' },
  { key: 'cardholder', label: 'Cardholder' },
  { key: 'passport', label: 'Passport' },
  { key: 'moleskine', label: 'Moleskine' },
  { key: 'accessories', label: 'Accessories' },
];

function stripHtml(html) {
  if (!html) return '';
  return String(html)
    .replace(/<[^>]*>/g, ' ')
    .replace(/\r\n/g, ' ')
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getProductTags(p) {
  const t = (p.title || '') + ' ' + (p.slug || '') + ' ' + (p.short_description || '');
  const lower = t.toLowerCase();
  const out = ['all'];
  TAG_MAP.forEach((item) => {
    if (item.key === 'all') return;
    if (lower.indexOf(item.key) !== -1) out.push(item.key);
  });
  if (out.length === 1) out.push('accessories');
  return out;
}

export default function HomeClient({ products, brand }) {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const [activeTag, setActiveTag] = useState('all');

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchTag = activeTag === 'all' || getProductTags(p).indexOf(activeTag) !== -1;
      if (!matchTag) return false;
      if (!searchQuery) return true;
      const text =
        (p.title || '') +
        ' ' +
        (p.slug || '') +
        ' ' +
        stripHtml(p.short_description || '') +
        ' ' +
        stripHtml(p.description || '');
      return text.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1;
    });
  }, [products, activeTag, searchQuery]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = sessionStorage.getItem('homeScrollPosition');
    if (saved !== null) {
      sessionStorage.removeItem('homeScrollPosition');
      const y = parseInt(saved, 10);
      if (!Number.isNaN(y)) window.scrollTo({ top: y, behavior: 'auto' });
    } else if (window.location.hash === '#collection') {
      document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <>
      <section
        className="hero"
        style={{ ['--hero-bg']: `url(${getImageUrl('2018/03/IMG_2810-copy-2.jpg')})` }}
      >
        <h1>{brand.heroHeadline || 'Your Personal Compass'}</h1>
        <p>
          {(() => {
            const desc = brand.heroDesc || 'Genuine leather bags and accessories designed and handcrafted with care.';
            const breakBefore = ' designed';
            const i = desc.indexOf(breakBefore);
            if (i >= 0) {
              return <>{desc.slice(0, i)}<br />{desc.slice(i + 1)}</>;
            }
            return desc;
          })()}
        </p>
        <Link
          href="/#collection"
          className="hero-cta"
          onClick={(e) => {
            if (typeof window !== 'undefined' && window.location.pathname === '/') {
              e.preventDefault();
              document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
        >
          Explore the Collection
        </Link>
      </section>

      <section className="toolbar">
        <div className="tags" id="tags">
          {TAG_MAP.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`tag ${activeTag === item.key ? 'active' : ''}`}
              onClick={() => setActiveTag(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      <section className="collection" id="collection">
        <div className="wrap">
          <h2>Collection</h2>
          <div className="products-grid" id="products-grid">
            {filtered.map((p) => {
              const slug = p.slug && p.slug !== String(p.id) ? p.slug : String(p.id);
              const imgSrc = (p.images && p.images[0]) ? getImageUrl(p.images[0]) : '';
              const raw = stripHtml(p.short_description || '');
              const short = raw.slice(0, 60);
              const shortDisplay = raw.length > 60 ? short + '…' : short;
              const price = p.price ? '€' + p.price : '';
              return (
                <Link
                  key={p.id}
                  href={`/product/${slug}`}
                  className="product-card"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      sessionStorage.setItem('homeScrollPosition', String(window.scrollY));
                    }
                  }}
                >
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
                    {shortDisplay && <div className="product-card__desc">{shortDisplay}</div>}
                  </div>
                </Link>
              );
            })}
          </div>
          {filtered.length === 0 && (
            <p className="no-results" id="no-results">
              No products match your search.
            </p>
          )}
        </div>
      </section>

      <section className="about" id="about">
        <div className="wrap">
          <h2>About</h2>
          <div className="about__story" id="about-story">
            {(brand.aboutStory || []).map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
          <p className="about__tagline" id="about-tagline">
            {brand.tagline || 'Your Personal Compass'}
          </p>
        </div>
      </section>

      <section className="video-section">
        <div className="wrap">
          <h2>Watch</h2>
          <div className="video-section__embed">
            <iframe
              src="https://www.youtube.com/embed/mCx7y4d3Pk8"
              title="Hylinda Leather"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>
    </>
  );
}
