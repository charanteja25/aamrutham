# Payment Gateway Setup Guide

This guide explains how to configure payment gateways for Aamrutham.

## Overview

Aamrutham supports three checkout methods:

| Provider | Description | Priority |
|----------|-------------|----------|
| **Shopify** | Full hosted checkout experience | Default (if configured) |
| **Razorpay** | Indian payment gateway (Cards, UPI, Netbanking) | Fallback |
| **Local (COD)** | Cash on Delivery | Always available |

The active provider is determined by the backend API based on environment configuration.

## Configuration Priority

1. If Shopify is configured → Shopify is default
2. Else if Razorpay is configured → Razorpay is default
3. Else → Local (COD) is default

---

## Shopify Setup

### 1. Create Shopify Store

Follow the detailed guide in `docs/SHOPIFY_SETUP.md`

### 2. Configure Environment

Add to `backend/.env`:
```env
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_TOKEN=your_storefront_api_token
```

Add to `frontend/.env`:
```env
VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
VITE_SHOPIFY_STOREFRONT_TOKEN=your_storefront_api_token
```

### 3. Map Product Variants

Update `frontend/src/config/shopifyProducts.ts` with your Shopify variant IDs.

---

## Razorpay Setup

### 1. Create Razorpay Account

1. Go to [Razorpay](https://razorpay.com/)
2. Sign up for a new account
3. Complete KYC verification
4. Get your API keys from Settings → API Keys

### 2. Get API Keys

- **Key ID**: Starts with `rzp_test_` (test) or `rzp_live_` (production)
- **Key Secret**: Secret key shown only once

### 3. Configure Environment

Add to `backend/.env`:
```env
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_secret_key
```

### 4. Test Mode vs Live Mode

**Test Mode:**
- Use `rzp_test_` keys
- Use test card numbers: 4111 1111 1111 1111
- No real charges

**Live Mode:**
- Use `rzp_live_` keys
- Complete KYC first
- Real transactions

### 5. Supported Payment Methods

- Credit/Debit Cards (Visa, Mastercard, RuPay)
- UPI (Google Pay, PhonePe, Paytm, etc.)
- Netbanking (All major banks)
- Wallets (Paytm, Freecharge, etc.)
- EMI (on select cards)

---

## Local Checkout (COD)

No configuration needed. Always available as fallback.

Features:
- Collects customer name, phone, address
- Creates order in local database
- Payment collected on delivery

---

## Environment Variables Summary

### Backend (`backend/.env`)

```env
# Server
PORT=3001

# Shopify (optional)
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_TOKEN=your_storefront_api_token

# Razorpay (optional)
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_secret_key
```

### Frontend (`frontend/.env`)

```env
# Shopify (optional - for direct Storefront API calls)
VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
VITE_SHOPIFY_STOREFRONT_TOKEN=your_storefront_api_token
```

---

## Testing the Integration

### 1. Check Configuration

```bash
# Start backend
npm run dev:backend

# Check checkout config
curl http://localhost:3001/api/checkout/config
```

Response:
```json
{
  "provider": "shopify",
  "shopify": {
    "enabled": true,
    "storeDomain": "your-store.myshopify.com"
  },
  "razorpay": {
    "enabled": false
  }
}
```

### 2. Test Checkout Flow

1. Start both servers: `npm run dev`
2. Add products to cart
3. Go to checkout
4. Verify the correct payment options appear
5. Complete a test order

---

## Troubleshooting

### "Shopify not configured"
- Check both backend and frontend env files
- Verify Storefront API token is correct
- Ensure variant IDs are mapped in `shopifyProducts.ts`

### "Razorpay not configured"
- Check backend env file has both KEY_ID and KEY_SECRET
- Restart backend server after adding env vars

### "Payment options not showing"
- Check browser console for errors
- Verify `/api/checkout/config` returns correct data
- Ensure at least one provider is configured

### Razorpay test payments failing
- Use test mode keys (`rzp_test_`)
- Use test card: 4111 1111 1111 1111
- Any future expiry date, any CVV

---

## Pricing Comparison

| Gateway | Transaction Fee | Setup Fee |
|---------|----------------|-----------|
| Shopify Payments | 2% - 2.9% | Included in plan |
| Razorpay | 2% - 2.5% | Free |
| COD | ₹50 - ₹100 (collection) | None |

---

## Security Notes

- Never commit `.env` files to git
- Use test keys for development
- Rotate keys periodically
- Razorpay Key Secret should only be in backend
- Shopify Storefront token is safe for frontend (read-only)