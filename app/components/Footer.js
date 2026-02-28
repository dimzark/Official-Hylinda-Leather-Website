import { brand } from '../../lib/data';

export default function Footer() {
  const c = brand.contact || {};
  const year = new Date().getFullYear();

  return (
    <footer>
      <div className="wrap">
        <div className="footer__contact" id="footer-contact">
          {c.email && (
            <span>
              <a href={`mailto:${c.email}`}>{c.email}</a>
            </span>
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
        </div>
        <p className="footer__copyright" id="footer-copyright">
          © {year} Hylinda Leather
        </p>
      </div>
    </footer>
  );
}
