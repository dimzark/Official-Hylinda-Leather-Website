'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getImageUrl } from '../../lib/data';

export default function Header() {
  const logoUrl = getImageUrl('2018/03/cropped-hylinda-1-1.jpg');
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setValue(new URLSearchParams(window.location.search).get('q') || '');
  }, [pathname]);

  return (
    <header>
      <div className="wrap">
        <Link href="/" className="logo-link">
          <img
            src={logoUrl}
            alt="Hylinda Leather"
            className="logo-img"
            width={52}
            height={52}
          />
          <div>
            <div className="logo-text">Hylinda Leather</div>
          </div>
        </Link>
        {pathname === '/' && (
          <input
            type="search"
            className="header__search"
            id="search"
            placeholder="Search"
            aria-label="Search products"
            value={value}
            onChange={(e) => {
            const v = e.target.value;
            setValue(v);
            const url = pathname === '/' && v ? `/?q=${encodeURIComponent(v)}` : pathname || '/';
            router.push(url);
          }}
          />
        )}
      </div>
    </header>
  );
}
