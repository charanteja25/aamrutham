import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { setIsOpen: openCart } = useCart();

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
          <a href="/#story" onClick={closeMenu}>Our Story</a>
          <a href="/#process" onClick={closeMenu}>Farm to You</a>
          <a href="/#varieties" onClick={closeMenu}>Varieties</a>
          <Link to="/products" onClick={closeMenu} className={isProducts ? 'active' : ''}>Our Mangoes</Link>
          <Link to="/team" onClick={closeMenu} className={location.pathname === '/team' ? 'active' : ''}>Our Team</Link>
          <button className="nav-pill" onClick={() => { openCart(true); closeMenu(); }}>Order Now ✦</button>
        </div>
      </nav>
    </header>
  );
}