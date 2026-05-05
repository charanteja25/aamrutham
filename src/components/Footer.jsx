import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer>
      {/* Walk with us band */}
      <div className="footer-walk-band">
        <div className="footer-walk-inner">
          <div className="footer-walk-text">
            <span className="footer-walk-eyebrow">Year One · Aamrutham</span>
            <h2 className="footer-walk-heading">This is just the beginning.</h2>
            <p className="footer-walk-sub">
              We started with mangoes. We're exploring what else the land can give — all held to the same standard. Walk with us.
            </p>
          </div>
          <Link to="/hello" className="footer-walk-btn">Walk with us →</Link>
        </div>
      </div>

      {/* Main footer */}
      <div className="site-footer">
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

        <div className="footer-legal-links">
          <Link to="/privacy">Privacy Policy</Link>
          <span className="footer-utility-divider">·</span>
          <Link to="/terms">Terms of Service</Link>
        </div>

        <p className="footer-copy">© {new Date().getFullYear()} Aamrutham. Made with ❤️ for 🥭</p>
      </div>
    </footer>
  );
}
