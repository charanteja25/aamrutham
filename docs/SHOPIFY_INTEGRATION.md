# Shopify Integration Guide

This guide explains how the Shopify checkout integration works in Aamrutham.

## How It Works

1. **Product Catalog**: Products are managed locally in the frontend/backend
2. **Cart**: Shopping cart is managed locally with Zustand
3. **Checkout**: When user proceeds to checkout, they're redirected to Shopify's secure checkout

## Setup Steps

### 1. Create Shopify Store

Follow the guide in `docs/SHOPIFY_SETUP.md` to:
- Create a Shopify store
- Enable Storefront API
- Get your API credentials

### 2. Add Products to Shopify

Create each mango variety as a product in Shopify with variants for pack sizes:

| Product | Variants |
|---------|----------|
| Kothapalli Kobbari | 2kg, 5kg, 10kg |
| Imam Pasand | 2kg, 5kg, 10kg |
| Bobbili Peetha | 2kg, 5kg, 10kg |
| Mettavalasa Peetha | 2kg, 5kg, 10kg |

### 3. Get Variant IDs

For each product variant in Shopify:
1. Go to Products → Select a product
2. Find the variant (e.g., "2 kg Pack")
3. Look at the URL: `admin/products/123456789/variants/987654321`
4. The variant ID is `987654321`
5. Convert to GID format: `gid://shopify/ProductVariant/987654321`

### 4. Update Product Mapping

Edit `frontend/src/config/shopifyProducts.ts`:

```typescript
export const SHOPIFY_PRODUCT_MAPPING: Record<string, Record<string, string>> = {
  'kothapalli-kobbari': {
    'pack-2kg': 'gid://shopify/ProductVariant/123456789',
    'pack-5kg': 'gid://shopify/ProductVariant/123456790',
    'pack-10kg': 'gid://shopify/ProductVariant/123456791',
  },
  // ... other products
};
```

### 5. Configure Environment

Create `frontend/.env`:

```env
VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
VITE_SHOPIFY_STOREFRONT_TOKEN=your_storefront_api_token
```

### 6. Install Dependencies

```bash
npm install
```

### 7. Test the Integration

1. Start the dev server: `npm run dev`
2. Add products to cart
3. Go to checkout
4. Enter name and phone
5. Click "Proceed to Secure Checkout"
6. You'll be redirected to Shopify checkout

## Checkout Flow

```
User adds items to cart
        ↓
User clicks "Proceed to Checkout"
        ↓
User enters name and phone
        ↓
User clicks "Proceed to Secure Checkout"
        ↓
App creates Shopify checkout with line items
        ↓
User is redirected to Shopify checkout page
        ↓
User completes payment on Shopify
        ↓
Shopify sends confirmation email
        ↓
Order appears in Shopify admin
```

## Fallback Mode

If Shopify is not configured (missing credentials or variant IDs), the app falls back to a local checkout that:
- Collects full customer information
- Creates a local order record
- Shows order confirmation

This is useful for development and testing.

## API Reference

### shopifyService

```typescript
import { shopifyService } from '@/services/shopify';

// Check if Shopify is configured
shopifyService.isConfigured();

// Create checkout and get URL
const checkout = await shopifyService.createCheckout([
  { variantId: 'gid://shopify/ProductVariant/123', quantity: 1 }
]);

// Redirect to checkout
shopifyService.redirectToCheckout(checkout);
```

### Product Mapping

```typescript
import { getShopifyVariantId, isShopifyConfigured } from '@/config/shopifyProducts';

// Get Shopify variant ID for local product
const variantId = getShopifyVariantId('kothapalli-kobbari', 'pack-2kg');

// Check if mapping is configured
if (isShopifyConfigured()) {
  // Use Shopify checkout
}
```

## Troubleshooting

### "No valid Shopify products found"
- Check that variant IDs are correctly mapped in `shopifyProducts.ts`
- Ensure variant IDs are in GID format: `gid://shopify/ProductVariant/123`

### "Access denied" error
- Verify Storefront API token is correct
- Check that required permissions are enabled

### Checkout redirect doesn't work
- Check browser console for errors
- Verify store domain includes `.myshopify.com`
- Ensure HTTPS is used in production

### Products show wrong price on Shopify
- Update variant prices in Shopify admin
- Prices are pulled from Shopify, not local data

## Security Notes

- Storefront API token is safe to use in frontend (it's read-only for products/checkout)
- Never expose Admin API credentials in frontend code
- All payment processing happens on Shopify's secure servers
- Customer payment data never touches your servers