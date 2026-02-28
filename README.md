# Hylinda Leather — Product Showcase

A static showcase site for Hylinda Leather products. This folder can be run as:

1. **Next.js app (recommended for Vercel + SEO)** — real URLs per product, meta tags, JSON-LD, sitemap.
2. **Legacy static** — open `index.html` from the repo root so images load (see below).

---

## Next.js (Vercel + SEO)

The site is built with **Next.js 14** and **static export** so it’s easy to deploy on Vercel and friendly to search engines.

### SEO features

- **Real URLs** — Each product has its own URL: `/product/[slug]` (e.g. `/product/brasov-leather-cross-body-bag`).
- **Per-page meta** — Unique `<title>`, `<meta name="description">`, and Open Graph tags for the homepage and every product.
- **JSON-LD** — Organization schema on the site, Product schema on each product page.
- **Sitemap** — `/sitemap.xml` generated at build time (home + all product URLs).
- **robots.txt** — Points crawlers to the sitemap.

### Run locally

```bash
cd website
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build static export

```bash
npm run build
```

Output is in the `out/` directory (plain HTML/CSS/JS, no server).

### Deploy on Vercel (e.g. hylindaleather.com)

1. Push the repo to GitHub (if not already).
2. In [Vercel](https://vercel.com), **Add New Project** and import the repo.
3. Set **Root Directory** to **`website`** (required — the Next.js app lives in this folder).
4. (Optional) Environment variables:
   - **`NEXT_PUBLIC_SITE_URL`** — Set to `https://hylindaleather.com` for production. (The code defaults to this if unset.)
   - **`NEXT_PUBLIC_IMAGE_BASE`** — Leave unset so images are served from `/uploads/` (files in `public/uploads/`).
5. Deploy. Vercel runs `next build` and serves the static export.
6. **Custom domain:** In the project, go to **Settings → Domains**, add **hylindaleather.com** as the production domain. Add **www.hylindaleather.com** too if you use it; `vercel.json` redirects www to the non-www domain.
7. Point your domain’s DNS at Vercel (A/CNAME as shown in the Vercel dashboard).

### Images

Product and hero images are loaded from a **base URL**:

- **Default** — `NEXT_PUBLIC_IMAGE_BASE` is not set, so the app uses `/uploads/`. Put your image files under `website/public/uploads/` (same paths as in the data, e.g. `public/uploads/2018/03/IMG_2810-copy-2.jpg`).
- **CDN or external** — Set `NEXT_PUBLIC_IMAGE_BASE` to your full base URL (e.g. `https://cdn.example.com/uploads/`). No trailing slash needed; the code normalizes it.

To reuse the WordPress backup uploads locally, copy the backup uploads folder into `website/public/uploads/` (keeping the same subpaths like `2018/03/`).

---

## Legacy static (single `index.html`)

From the **repository root** (parent of `website/`):

- Open `website/index.html` in your browser, or
- Run a local server and visit `http://localhost:PORT/website/`:
  - Python: `python -m http.server 8080`
  - Node: `npx serve .` then go to `http://localhost:3000/website/`

Images expect the WordPress backup uploads at:  
`../Wordpress/backup_2024-08-30-1935_Hylindaleather_Hand_crafted_le_200fd4c1a5b5-uploads/uploads/`

---

## Data

- **data/products.json** — Product list (extracted from `products.js`).
- **brand-content.json** — Site name, hero, about story, contact (email, Facebook, etc.).

Product order and exclusions (e.g. “Black Leather MacBook Case”) are applied in `lib/data.js`.
