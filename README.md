# 🥭 Aamrutham — Premium Mango Website

> *Aam + Amrutham. The finest mango varieties, straight from Bobbili farms to Hyderabad.*

**Live site:** https://charanteja25.github.io/aamrutham

---

## About

Aamrutham is a premium mango brand launching **Summer 2026** in Hyderabad. This repo contains the Phase 1 static website — built to establish brand identity, showcase mango varieties, and drive pre-orders.

## Pages

| Page | Description |
|---|---|
| `index.html` | Landing page — hero, brand story, quality badges, process, varieties, CTA |
| `shop.html` | Shop page — product cards with pack selector, Zoho Commerce integration ready |

## Tech Stack

| Plugin | Purpose | CDN |
|---|---|---|
| Tailwind CSS | Utility-first CSS framework | `cdn.tailwindcss.com` |
| AOS | Animate on Scroll | `cdn.jsdelivr.net/npm/aos@2.3.4` |
| Swiper.js | Touch carousel for badges | `cdn.jsdelivr.net/npm/swiper@11` |
| Font Awesome | Icons | `cdnjs.cloudflare.com/font-awesome/6.5.1` |
| Google Fonts | Playfair Display, Lato, Noto Telugu | `fonts.googleapis.com` |

## Run Locally

```bash
# Clone the repo
git clone https://github.com/charanteja25/aamrutham.git
cd aamrutham

# Start local server
python3 -m http.server 3000

# Open in browser
open http://localhost:3000
```

No npm, no build step — edit and refresh.

## Contributing

1. Fork this repo
2. Create a branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Push and open a Pull Request

### Key areas where help is welcome
- 🎨 Design improvements (CSS, animations)
- 📸 Real product photography integration
- 🌐 Telugu language content
- 📱 Mobile UX enhancements
- ♿ Accessibility improvements

## Connecting Zoho Commerce

When you have your Zoho Commerce store URL, open `shop.html` and update **one line**:

```js
// shop.html — line ~200
const ZOHO_STORE_URL = "https://yourstore.zohoshoppe.com"; // ← add your URL here
```

That's it. All "Buy Now" buttons go live automatically.

## Connecting GoDaddy Domain

1. Log in to GoDaddy → DNS Manager
2. Add a `CNAME` record: `www` → `charanteja25.github.io`
3. Add 4 `A` records pointing to GitHub Pages IPs:
   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```
4. In GitHub repo → Settings → Pages → Custom domain → enter your domain
5. Check "Enforce HTTPS"

## Content Updates

### Update WhatsApp number
Search for `919999999999` in both `index.html` and `shop.html` and replace with your number (country code + number, no spaces or +).

### Update Instagram handle
In `index.html` footer, replace the Instagram link href with your handle:
```html
<a href="https://instagram.com/aamrutham_hyd" ...>Instagram</a>
```

### Add real product images
Replace placeholder `<div>` blocks in `shop.html` with:
```html
<img src="assets/banginapalli.jpg" class="product-img" alt="Banginapalli Mangoes" />
```

### Add mango varieties
Copy any `.product-card` block in `shop.html` and update the content, price, and Zoho product ID.

## License

© 2026 Aamrutham. All rights reserved.
