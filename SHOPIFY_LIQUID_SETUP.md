# Shopify Liquid Theme Setup Guide

## 📋 Complete Process for Creating Shopify Shop Page

---

## STEP 1: Upload Liquid Files to Shopify

1. Go to **Shopify Admin**
2. Navigate to **Sales channels > Online Store > Themes**
3. Click **Customize** on your active theme (or create new theme)
4. Click **← Back to theme**
5. Click **Edit code**
6. Create/Upload files in correct folders:
   - `theme.liquid` → **Layout** folder
   - `collection.liquid` → **Templates** folder
   - `product.liquid` → **Templates** folder
   - `cart.liquid` → **Templates** folder
   - `product-card.liquid` → **Snippets** folder

---

## STEP 2: Create Metafields

1. Go to **Settings > Metafields**
2. Click **Products** → **Create definition**

**Create these metafields:**

| Name | Namespace | Key | Type |
|------|-----------|-----|------|
| Variety Type | custom | variety_type | Text |
| Telugu Name | custom | telugu_name | Text |
| Brix Level | custom | brix | Text |
| Fiber Content | custom | fiber | Text |
| Season | custom | season | Text |
| Region | custom | region | Text |

---

## STEP 3: Add Products to Shopify

For each mango variety:

1. **Products** → **Add product**
2. Fill in:
   - **Title**: (e.g., "Suvarnarekha")
   - **Description**: (long description with story)
   - **Images**: (3+ high-quality photos)
   - **Variants**: Create 3 variants:
     - Pack of 6 - ₹499
     - Pack of 12 - ₹899
     - Pack of 18 - ₹1299

3. **Metafields** section (scroll down):
   - **Variety Type**: Choose one:
     - `signature` (Mettavalasa, Bobbili, Kothapalli, Imam)
     - `core` (Suvarnarekha, Banganapalli, Chinna, Cheruku, Panchadara)
     - `heritage` (Aamrutham Heritage Box)
   - **Telugu Name**: (e.g., "సువర్ణరేఖ")
   - **Brix Level**: (e.g., "18–21")
   - **Fiber Content**: (e.g., "Fiberless")
   - **Season**: (e.g., "May – June")
   - **Region**: (e.g., "Andhra Pradesh")

---

## STEP 4: Create Collections

1. Go to **Products > Collections**
2. Create collection:
   - **Name**: "All Products"
   - **Add ALL products** to this collection
   - This becomes your shop page: `/collections/all`

---

## STEP 5: Test Your Shop

Visit: `https://yourstore.myshopify.com/collections/all`

✓ Verify:
- [ ] Products show in 3 sections (Signature, Core, Heritage)
- [ ] Product images load
- [ ] Add to Cart buttons work
- [ ] Cart updates correctly
- [ ] Checkout flow works

---

## 🎨 Brand Colors & Fonts

Already included in Liquid files:

**Fonts:**
- Playfair Display (headings)
- Lato (body text)
- Noto Serif Telugu (Telugu text)

**Colors:**
- Mango: `#F5A623`
- Mango Dark: `#E07B39`
- Leaf: `#2D5016`
- Cream: `#FFF8EC`

---

## 📝 Product Data Template

For each product, use this data:

```
Title: [Mango Variety Name]
Description: [Long description from products.html]
Images: [3+ farm photos]
Variants:
  - Pack of 6 - ₹499
  - Pack of 12 - ₹899
  - Pack of 18 - ₹1299
Metafields:
  - Variety Type: signature/core/heritage
  - Telugu Name: [Telugu script]
  - Brix Level: [number range]
  - Fiber Content: [description]
  - Season: [months]
  - Region: [location]
```

---

## 10 Products to Add

**Signature Premium (variety_type: "signature")**
1. Mettavalasa Peechu
2. Bobbili Peechu
3. Kothapalli Kobbari
4. Imam Pasand

**Core Varieties (variety_type: "core")**
5. Suvarnarekha
6. Banganapalli
7. Chinna Rasalu
8. Cheruku Rasalu
9. Panchadara Kalisa

**Heritage Box (variety_type: "heritage")**
10. Aamrutham Heritage Box (bundle product)

---

## ✅ Checklist

- [ ] Liquid files uploaded to Shopify
- [ ] Metafields created
- [ ] All 10 products added
- [ ] Collection "All Products" created
- [ ] All products added to collection
- [ ] Shop page tested at `/collections/all`
- [ ] Add to Cart working
- [ ] Cart page working
- [ ] Checkout working
- [ ] Navbar links to `/collections/all`

---

## 🔗 Your Site Structure After Setup

```
GitHub (your-site.com)
├── index.html (home)
├── products.html (varieties guide)
└── shop.html (redirects to Shopify)

Shopify (yourstore.myshopify.com)
└── /collections/all (shop page with all products)
    ├── Add to Cart
    └── Checkout
```

---

## 💡 Quick Links

- **Shop Page**: `yourstore.myshopify.com/collections/all`
- **Admin**: `yourstore.myshopify.com/admin`
- **Products**: `yourstore.myshopify.com/admin/products`
- **Collections**: `yourstore.myshopify.com/admin/collections`

---

**All set! Your Shopify shop is ready to go.** 🥭
