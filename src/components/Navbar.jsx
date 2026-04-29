import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const closeMenu = () => setOpen(false);
  const isProducts = location.pathname.startsWith('/products');

  return (
    <header className="navbar-shell">
      <nav className="navbar container">
        <Link to="/" className="nav-brand" onClick={closeMenu}>
          <img src="/assets/Subject.png" alt="Aamrutham" className="nav-logo mango-source-logo" />
          <span className="nav-brand-text">Aamrutham</span>
        </Link>

        <button className={`nav-toggle ${open ? 'open' : ''}`} onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
          <span />
          <span />
          <span />
        </button>

        <div className={`nav-links ${open ? 'open' : ''}`}>
          <Link to="/products" onClick={closeMenu} className={`nav-pill-mango nav-mangoes-first${isProducts ? ' active' : ''}`}>🥭 Our Mangoes</Link>
          <a href="/#story" onClick={closeMenu}>Our Story</a>
          <a href="/#process" onClick={closeMenu}>Farm to You</a>
          <Link to="/team" onClick={closeMenu} className={location.pathname === '/team' ? 'active' : ''}>Our Team</Link>
          <Link to="/values" onClick={closeMenu} className={location.pathname === '/values' ? 'active' : ''}>Our Values</Link>
          <Link to="/mango-calculator" onClick={closeMenu} className={`nav-pill-calc${location.pathname === '/mango-calculator' ? ' active' : ''}`}>🧮 Mango Calc</Link>
          <Link to="/bulk-enquiry" onClick={closeMenu} className={`nav-pill-bulk${location.pathname === '/bulk-enquiry' ? ' active' : ''}`}>Bulk Enquiry</Link>
        </div>
      </nav>
    </header>
  );
}