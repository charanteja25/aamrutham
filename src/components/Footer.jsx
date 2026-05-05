import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <img src="/assets/Subject.png" alt="Aamrutham" className="footer-logo" />
        <p className="footer-tagline">Aam + Amrutham — Pure Mango Bliss</p>
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

      <div className="footer-bottom-row">
        <Link to="/hello" className="footer-walk-strip-btn">🥭 Walk with us →</Link>
        <div className="footer-legal-links">
          <Link to="/privacy">Privacy Policy</Link>
          <span className="footer-utility-divider">·</span>
          <Link to="/terms">Terms of Service</Link>
          <span className="footer-utility-divider">·</span>
          <span className="footer-copy">© {new Date().getFullYear()} Aamrutham</span>
        </div>
      </div>
    </footer>
  );
}
