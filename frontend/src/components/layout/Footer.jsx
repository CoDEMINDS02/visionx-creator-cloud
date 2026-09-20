import { Link } from 'react-router-dom';
import { Twitter, Instagram, Youtube, Linkedin } from 'lucide-react';

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '/#features' },
      { label: 'AI Engine', href: '/#features' },
      { label: 'Pricing', href: '/#pricing' },
      { label: 'Changelog', href: '#' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: '#' },
      { label: 'Tutorials', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Support', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Partners', href: '#' },
      { label: 'Contact', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Cookie Policy', href: '#' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <Link to="/" className="brand" style={{ marginBottom: 14 }}>
            <svg width="28" height="28" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="ftlogo" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
              <path d="M4 4L18 30L32 4H24.5L18 16.5L11.5 4H4Z" fill="url(#ftlogo)" />
            </svg>
            <span className="brand-name">
              VISION<span className="x">X</span>
              <span className="brand-sub">CREATOR CLOUD</span>
            </span>
          </Link>
          <p style={{ marginTop: 16, maxWidth: 260, fontSize: 13.5 }}>
            AI-powered image diagnosis & enhancement for creators, professionals, and businesses.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <div className="footer-col" key={col.title}>
            <h4>{col.title}</h4>
            {col.links.map((link) => (
              <a key={link.label} href={link.href}>
                {link.label}
              </a>
            ))}
          </div>
        ))}
      </div>

      <div className="footer-bottom">
        <span>© 2026 VisionX Creator Cloud. All rights reserved.</span>
        <div className="social-icons">
          <a href="#" aria-label="Twitter"><Twitter /></a>
          <a href="#" aria-label="Instagram"><Instagram /></a>
          <a href="#" aria-label="YouTube"><Youtube /></a>
          <a href="#" aria-label="LinkedIn"><Linkedin /></a>
        </div>
      </div>
    </footer>
  );
}
