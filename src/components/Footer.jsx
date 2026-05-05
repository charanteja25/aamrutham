import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-row">
        <div className="footer-left">
          <img src="/assets/Subject.png" alt="Aamrutham" className="footer-logo" />
          <span className="footer-tagline">Aam + Amrutham</span>
        </div>

        <div className="footer-center">
          <Link to="/bulk-enquiry" className="footer-tool-pill footer-tool-pill--bulk">🚚 Bulk Enquiry</Link>
          <Link to="/mango-calculator" className="footer-tool-pill footer-tool-pill--calc">🥭 Mango Calculator</Link>
          <Link to="/hello" className="footer-tool-pill footer-tool-pill--walk">🥭 Walk with us</Link>
        </div>

        <div className="footer-right">
          <Link to="/privacy">Privacy</Link>
          <span>·</span>
          <Link to="/terms">Terms</Link>
          <span>·</span>
          <span>© {new Date().getFullYear()} Aamrutham</span>
        </div>
      </div>
    </footer>
  );
}
