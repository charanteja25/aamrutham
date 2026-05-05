import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <img src="/assets/Subject.png" alt="Aamrutham" className="footer-logo" />
      <p className="footer-tagline">Aam + Amrutham — Pure Mango Bliss</p>

      <div className="footer-links">
        <a href="/#story">Our Story</a>
        <a href="/#process">Farm to You</a>
        <a href="/#varieties">Varieties</a>
        <a href="/products">Our Mangoes</a>
      </div>

      <div className="footer-tools">
        <span className="footer-tools-label">Handy Tools</span>
        <div className="footer-tools-pills">
          <Link to="/bulk-enquiry" className="footer-tool-pill footer-tool-pill--bulk">
            🚚 Bulk Enquiry
          </Link>
          <Link to="/mango-calculator" className="footer-tool-pill footer-tool-pill--calc">
            🥭 Mango Calculator
          </Link>
        </div>
      </div>

      {/* Walk with us */}
      <div className="footer-walk-strip">
        <div className="footer-walk-strip-text">
          <p className="footer-walk-strip-heading">This is just the beginning.</p>
          <p className="footer-walk-strip-sub">We started with mangoes. Walk with us for what comes next.</p>
        </div>
        <Link to="/hello" className="footer-walk-strip-btn">Walk with us →</Link>
      </div>

      <div className="footer-legal-links">
        <Link to="/privacy">Privacy Policy</Link>
        <span className="footer-utility-divider">·</span>
        <Link to="/terms">Terms of Service</Link>
      </div>

      <p className="footer-copy">© {new Date().getFullYear()} Aamrutham. Made with ❤️ for 🥭</p>
    </footer>
  );
}
