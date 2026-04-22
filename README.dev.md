# README.dev.md — Aamrutham Dev Branch

This branch is for active development. All new features, UI changes, and bug fixes go here first. Only merge to `main` when something is tested and ready for the live site.

---

## Branch Rules

| Branch | Purpose |
|---|---|
| `dev` | Work in progress — this branch |
| `main` | Live site on GitHub Pages — only merge when ready |
| `zohocommerce` | Zoho Commerce integration work |
| `shopify` | Shopify integration experiments |

---

## Getting Started

```bash
git clone https://github.com/charanteja25/aamrutham.git
cd aamrutham
git checkout dev
python3 -m http.server 3000
open http://localhost:3000
```

No npm, no build step. Edit and refresh.

---

## How to Contribute

1. Branch off `dev` for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes, test locally
3. Push and open a PR targeting `dev` (not `main`)
4. Once reviewed and merged to `dev`, it gets tested before going to `main`

---

## What to Work On

- UI/UX improvements (CSS, animations, mobile)
- New pages or sections
- Accessibility and performance
- Telugu language content
- Real product photography integration

---

## Key Files

| File | What it does |
|---|---|
| `index.html` | Landing page |
| `shop.html` | Product listing with cart |
| `product.html` | Product detail page |
| `cart.js` | Local cart logic (localStorage) |
| `style.css` | Base styles (Tailwind CDN loads after — use inline `<style>` with `!important` for layout-critical CSS) |

---

## Brand Colors

```
--mango: #F5A623
--leaf:  #2D5016
--cream: #FFF8EC
```

Fonts: Playfair Display (headings), Lato (body), Noto Telugu (Telugu text)
