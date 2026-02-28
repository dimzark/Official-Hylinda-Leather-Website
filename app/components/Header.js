'use client';

import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { getImageUrl } from '../../lib/data';

export default function Header() {
  const logoUrl = getImageUrl('2018/03/cropped-hylinda-1-1.jpg');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const [value, setValue] = useState(q);

  useEffect(() => setValue(q), [q]);

  const onSearchChange = useCallback(
    (e) => {
      const v = e.target.value;
      setValue(v);
      const next = new URLSearchParams(searchParams);
      if (v) next.set('q', v);
      else next.delete('q');
      router.push(pathname + (next.toString() ? '?' + next.toString() : ''));
    },
    [pathname, router, searchParams]
  );

  return (
    <header>
      <div className="wrap">
        <Link href="/" className="logo-link">
          <img
            src={logoUrl}
            alt="Hylinda Leather"
            className="logo-img"
            width={40}
            height={40}
          />
          <div>
            <div className="logo-text">Hylinda Leather</div>
          </div>
        </Link>
        <input
          type="search"
          className="header__search"
          id="search"
          placeholder="Search"
          aria-label="Search products"
          value={value}
          onChange={onSearchChange}
        />
      </div>
    </header>
  );
}
