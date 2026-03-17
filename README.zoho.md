# README.zoho.md — Zoho Commerce Integration Branch

This branch contains all Zoho Commerce integration work — Buy Button embeds, cart-to-Zoho checkout flow, and any Zoho-specific configuration.

---

## Architecture

The Aamrutham site uses a two-layer commerce setup:

- **GitHub Pages** (`www.aamrutham.com`) — brand frontend, product discovery, local cart UI
- **Zoho Commerce** (`shopaamrutham.zohoecommerce.in`) — handles actual orders, payments, customer data, SEO analytics

The static site is the experience. Zoho is the transaction engine.

---

## Zoho Store

**Store URL:** `https://shopaamrutham.zohoecommerce.in`

Login at: `https://commerce.zoho.in`

---

## Product IDs

| Product | Handle | Zoho Product ID |
|---|---|---|
| Mettavalasa Peechu | `mettavalasa` | `3543829000000032782` |
| Bobbili Peechu | `bobbili-peechu` | `3543829000000032691` |
| Kothapalli Kobbari | `kobbarimamidi` | `3543829000000032836` |
| Imam Pasand | `imam` | `3543829000000032890` |

Product URL format: `https://shopaamrutham.zohoecommerce.in/product/{handle}/{productId}`

---

## Buy Button Embed

Each product card in `shop.html` uses Zoho's Buy Button embed instead of a plain link. The script (`zs-buy-button.js`) loads once and inits all 4 products.

To update or add a product:
1. In Zoho Commerce → Products → select product → Buy Button → copy embed code
2. Add a `<div data-embed-id="zoho-{name}">` placeholder in the card
3. Add the product entry to the `PRODUCTS` array in the script block at the bottom of `shop.html`

---

## Checkout Flow

```
User clicks "Buy Now" (Zoho Buy Button)
  → Zoho product page / inline cart
    → Zoho checkout
      → Payment (COD or online)
        → Order recorded in Zoho Commerce dashboard
          → Customer email captured by Zoho
```

---

## Zoho Commerce Settings to Configure

| Setting | Location | Status |
|---|---|---|
| Currency | Settings → Store → Currency | Set to INR ₹ |
| Cash on Delivery | Settings → Payment → COD | Enable |
| Product prices | Products → each product | Verify correct prices |
| Order notifications | Settings → Notifications | Set your email |

---

## Local Cart vs Zoho Cart

The site has a local cart (localStorage, `cart.js`) for UX — users can browse and queue items. When they click checkout, they go to Zoho where the actual cart and payment happen.

The local cart does **not** sync with Zoho inventory or orders. It's purely a display layer.
