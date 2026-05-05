import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <img src="/assets/Subject.png" alt="Aamrutham" className="footer-logo" />
        <p className="footer-tagline">Aam + Amrutham — Pure Mango Bliss</p>
      </div>

      <div className="footer-links">
        <a href="/#story">Our Story</a>
        <a href="/#process">Farm to You</a>
        <a href="/#varieties">Varieties</a>
        <a href="/products">Our Mangoes</a>
        <Link to="/bulk-enquiry">Bulk Enquiry</Link>
        <Link to="/mango-calculator">Mango Calculator</Link>
      </div>

      <Link to="/hello" className="footer-walk-strip-btn">
        🥭 Walk with us →
      </Link>

      <div className="footer-legal-links">
        <Link to="/privacy">Privacy Policy</Link>
        <span className="footer-utility-divider">·</span>
        <Link to="/terms">Terms of Service</Link>
        <span className="footer-utility-divider">·</span>
        <span className="footer-copy">© {new Date().getFullYear()} Aamrutham</span>
      </div>
    </footer>
  );
}
