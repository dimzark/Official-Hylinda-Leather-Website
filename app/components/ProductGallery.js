'use client';

import { useState, useCallback, useRef } from 'react';
import { getImageUrl } from '../../lib/data';

const SWIPE_THRESHOLD = 50;
const SNAP_DURATION_MS = 300;

export default function ProductGallery({ product }) {
  const images = product.images && product.images.length ? product.images : product.featured_image ? [product.featured_image] : [];
  const [index, setIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartX = useRef(0);
  const isDraggingRef = useRef(false);

  const currentImg = images[index];
  const currentSrc = currentImg ? getImageUrl(currentImg) : '';

  const go = useCallback(
    (delta) => {
      setIndex((i) => (i + delta + images.length) % images.length);
    },
    [images.length]
  );

  const clampDrag = useCallback(
    (delta) => {
      if (images.length <= 1) return 0;
      if (index === 0 && delta > 0) return 0;
      if (index === images.length - 1 && delta < 0) return 0;
      return delta;
    },
    [images.length, index]
  );

  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
    isDraggingRef.current = true;
    setIsDragging(true);
    setDragOffset(0);
  }, []);

  const handleTouchMove = useCallback(
    (e) => {
      if (images.length <= 1 || !isDraggingRef.current) return;
      const delta = e.touches[0].clientX - touchStartX.current;
      setDragOffset(clampDrag(delta));
    },
    [images.length, clampDrag]
  );

  const handleTouchEnd = useCallback(
    (e) => {
      if (images.length <= 1) return;
      isDraggingRef.current = false;
      setIsDragging(false);
      const delta = e.changedTouches[0].clientX - touchStartX.current;
      if (delta < -SWIPE_THRESHOLD) go(1);
      else if (delta > SWIPE_THRESHOLD) go(-1);
      setDragOffset(0);
    },
    [images.length, go]
  );

  if (!images.length) {
    return <div className="product-page__main-wrap" style={{ aspectRatio: 1, background: 'var(--off2)' }} />;
  }

  const trackStyle = {
    display: 'flex',
    width: `${images.length * 100}%`,
    transform: `translateX(calc(-${index * 100}% + ${dragOffset}px))`,
    transition: isDragging ? 'none' : `transform ${SNAP_DURATION_MS}ms ease-out`,
  };
  const slideStyle = { flex: `0 0 ${100 / images.length}%` };

  return (
    <>
      <div
        className="product-page__main-wrap product-page__main-wrap--track"
        style={{ touchAction: 'pan-y' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="product-page__track" style={trackStyle}>
          {images.map((path, i) => (
            <div key={i} className="product-page__slide" style={slideStyle}>
              <img
                className="product-page__main-img"
                src={getImageUrl(path)}
                alt={i === index ? (product.title || '') : ''}
                draggable={false}
              />
            </div>
          ))}
        </div>
        {images.length > 1 && (
          <>
            <button
              type="button"
              className="product-page__nav product-page__nav--prev"
              onClick={() => go(-1)}
              aria-label="Previous image"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              className="product-page__nav product-page__nav--next"
              onClick={() => go(1)}
              aria-label="Next image"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </>
        )}
        <button
          type="button"
          className="product-page__fullscreen"
          onClick={() => setFullscreen(true)}
          aria-label="View full screen"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
          </svg>
        </button>
      </div>
      {images.length > 1 && (
        <div className="product-page__thumbs">
          {images.map((path, i) => (
            <button
              key={i}
              type="button"
              className={`product-page__thumb ${i === index ? 'active' : ''}`}
              onClick={() => setIndex(i)}
            >
              <img src={getImageUrl(path)} alt="" />
            </button>
          ))}
        </div>
      )}

      {fullscreen && (
        <div
          className="fullscreen-overlay open"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.92)',
            zIndex: 300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            touchAction: 'pan-y',
          }}
          onClick={(e) => e.target === e.currentTarget && setFullscreen(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <button
            type="button"
            onClick={() => setFullscreen(false)}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'white',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.5rem',
              zIndex: 301,
            }}
            aria-label="Close"
          >
            ×
          </button>
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); go(-1); }}
                style={{
                  position: 'absolute',
                  left: '1.5rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.9)',
                  border: 'none',
                  cursor: 'pointer',
                  zIndex: 301,
                }}
                aria-label="Previous"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); go(1); }}
                style={{
                  position: 'absolute',
                  right: '1.5rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.9)',
                  border: 'none',
                  cursor: 'pointer',
                  zIndex: 301,
                }}
                aria-label="Next"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </>
          )}
          <div
            className="fullscreen-overlay__track-wrap"
            style={{
              position: 'relative',
              width: '100%',
              maxHeight: '100%',
              flex: 1,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              touchAction: 'pan-y',
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="fullscreen-overlay__track"
              style={{
                display: 'flex',
                width: `${images.length * 100}%`,
                transform: `translateX(calc(-${index * 100}% + ${dragOffset}px))`,
                transition: isDragging ? 'none' : `transform ${SNAP_DURATION_MS}ms ease-out`,
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {images.map((path, i) => (
                <div
                  key={i}
                  style={{
                    flex: `0 0 ${100 / images.length}%`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 0.5rem',
                  }}
                >
                  <img
                    src={getImageUrl(path)}
                    alt={product.title || ''}
                    style={{ maxWidth: '100%', maxHeight: '85vh', objectFit: 'contain' }}
                    onClick={(e) => e.stopPropagation()}
                    draggable={false}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
