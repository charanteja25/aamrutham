# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Local Development

```bash
python3 -m http.server 3000
open http://localhost:3000
```

No build step. Edit HTML/CSS/JS and refresh. No npm, no bundler.

## Architecture

**Two-layer commerce architecture:**
- **GitHub Pages** (`www.aamrutham.com` / `charanteja25.github.io/aamrutham`) — brand marketing + shop discovery frontend
- **Zoho Commerce** (`shopaamrutham.zohoecommerce.in`) — backend: orders, payments, customer data, SEO analytics

The static site is the shopping experience; Zoho handles the transaction.

## Pages

| File | Role |
|---|---|
| `index.html` | Landing page — hero, brand story, process, variety showcase |
| `shop.html` | Product listing — pack selector, Add to Cart, Zoho Buy Button embeds |
| `product.html` | Product detail page — dynamic JS render from `PRODUCTS` object |
| `cart.js` | localStorage cart, drawer UI, bubble count |
| `style.css` | Base styles — **Tailwind CDN overrides these**, so layout-critical cart CSS lives in inline `<style>` blocks inside shop.html and product.html |

## Cart System (cart.js)

- Storage key: `aamrutham_cart` (localStorage)
- Item key format: `productId + '||' + packLabel`
- Cart drawer: `#cart-drawer` (fixed right panel), `#cart-overlay` (backdrop)
- **Do not add `document.body.style.overflow = 'hidden'`** — it was removed intentionally to keep the page scrollable when the drawer is open
- Cart icon clicks are wired via `addEventListener` in `DOMContentLoaded`, not inline `onclick`

## Zoho Commerce Integration

**Zoho store:** `https://shopaamrutham.zohoecommerce.in`

Current product URLs:
| Product | Zoho URL |
|---|---|
| Mettavalasa Peechu | `/product/mettavalasa/3543829000000032782` |
| Bobbili Peechu | `/product/bobbili-peechu/3543829000000032691` |
| Kothapalli Kobbari | `/product/kobbarimamidi/3543829000000032836` |
| Imam Pasand | `/product/imam/3543829000000032890` |

**Buy Button embed:** `zs-buy-button.js` from `ecommerce-stratus.zohostratus.in` — initialized once in shop.html, each product uses `data-embed-id` div targets.

**Domain note:** `www.aamrutham.com` DNS → GitHub Pages only. Zoho store runs on its own subdomain. Do not point Zoho product links at `www.aamrutham.com`.

## Product Data (product.html)

The `PRODUCTS` JS object in product.html holds all product metadata. When `renderProduct()` runs, it sets `window._currentProduct` so `cart.js` can access it via `productAddToCartFromPage()`.

## CSS Specificity

Tailwind CDN loads after `style.css` and overrides custom classes. For any cart/drawer/overlay CSS that must work:
- Put it in `<style>` blocks directly in the HTML file
- Use `!important` on `position`, `transform`, `z-index`, `display` properties

## Brand Colors

```css
--mango: #F5A623   /* warm orange */
--leaf:  #2D5016   /* deep green */
--cream: #FFF8EC   /* off-white background */
```

## Git Branches

| Branch | Purpose |
|---|---|
| `main` | Production (deployed to GitHub Pages) |
| `dev` | Active development |
| `zohocommerce` | Zoho Commerce integration experiments |
| `shopify` | Shopify integration experiments |
