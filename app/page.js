import { Suspense } from 'react';
import HomeClient from './components/HomeClient';
import { products, brand } from '../lib/data';

export default function HomePage() {
  return (
    <Suspense fallback={<div className="wrap" style={{ padding: '4rem 2rem', textAlign: 'center' }}>Loading…</div>}>
      <HomeClient products={products} brand={brand} />
    </Suspense>
  );
}
