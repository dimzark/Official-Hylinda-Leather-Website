import { brand } from '../../lib/data';

export default function Footer() {
  const c = brand.contact || {};
  const year = new Date().getFullYear();

  return (
    <footer>
      <div className="wrap">
        <div className="footer__contact" id="footer-contact">
          {c.email && (
            <a href={`mailto:${c.email}`} aria-label="Email">
              <svg
                className="footer__social-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </a>
          )}
          {c.address && <span>{c.address}</span>}
          {c.facebook && (
            <a href={c.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg
                className="footer__social-icon"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
          )}
          {c.instagram && (
            <a href={c.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg
                className="footer__social-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
          )}
          <a href="https://www.etsy.com/shop/HylindaLeather" target="_blank" rel="noopener noreferrer" aria-label="Etsy Shop">
            <svg
              className="footer__social-icon"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M8.559 2.445c0-.325.033-.52.59-.52h7.465c1.3 0 2.02 1.11 2.54 3.193l.42 1.666h1.27c.23-4.728.43-6.784.43-6.784s-3.196.36-5.09.36H6.635L1.521.196v1.37l1.725.326c1.21.24 1.5.496 1.6 1.606 0 0 .11 3.27.11 8.64 0 5.385-.09 8.61-.09 8.61 0 .973-.39 1.333-1.59 1.573l-1.722.33V24l5.13-.165h8.55c1.935 0 6.39.165 6.39.165.105-1.17.75-6.48.855-7.064h-1.2l-1.284 2.91c-1.005 2.28-2.476 2.445-4.11 2.445h-4.906c-1.63 0-2.415-.64-2.415-2.05V12.8s3.62 0 4.79.096c.912.064 1.463.325 1.76 1.598l.39 1.695h1.41l-.09-4.278.192-4.305h-1.391l-.45 1.89c-.283 1.244-.48 1.47-1.754 1.6-1.666.17-4.815.14-4.815.14V2.45h-.05z" />
            </svg>
          </a>
        </div>
        <p className="footer__copyright" id="footer-copyright">
          © {year} Hylinda Leather
        </p>
      </div>
    </footer>
  );
}
