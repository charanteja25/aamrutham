import React from 'react';

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
      <p className="footer-copy">© 2026 Aamrutham. Made with 🥭 in Hyderabad, India.</p>
    </footer>
  );
}
