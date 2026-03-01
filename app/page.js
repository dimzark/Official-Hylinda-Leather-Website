import HomeClient from './components/HomeClient';
import { products, brand } from '../lib/data';

export default function HomePage() {
  return (
    <HomeClient
      products={products}
      brand={brand}
    />
  );
}
