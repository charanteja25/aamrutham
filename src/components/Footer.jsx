import React from 'react';
import { Link } from 'react-router-dom';
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">

        {/* Left — walk with us */}
        <div className="footer-col footer-col-left">
          <Link to="/hello" className="footer-walk-btn">🥭 Walk with us →</Link>
        </div>

        {/* Centre — logo + tagline + legal */}
        <div className="footer-col footer-col-center">
          <img src="/assets/Subject.png" alt="Aamrutham" className="footer-logo" />
          <p className="footer-tagline">Aam + Amrutham — Pure Mango Bliss</p>
          <div className="footer-legal-links">
            <Link to="/privacy">Privacy</Link>
            <span>·</span>
            <Link to="/terms">Terms</Link>
            <span>·</span>
            <span>© {new Date().getFullYear()} Aamrutham</span>
          </div>
        </div>

        {/* Right — tools stacked */}
        <div className="footer-col footer-col-right">
          <Link to="/bulk-enquiry" className="footer-tool-pill footer-tool-pill--bulk">🚚 Bulk Enquiry</Link>
          <Link to="/mango-calculator" className="footer-tool-pill footer-tool-pill--calc">🥭 Mango Calculator</Link>
        </div>

      </div>
    </footer>
  );
}
