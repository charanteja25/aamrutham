# Shopify Setup Guide for Aamrutham

This guide walks you through setting up a new Shopify store and integrating it with the Aamrutham frontend for checkout.

## Step 1: Create a Shopify Store

1. Go to [Shopify](https://www.shopify.com/) and sign up for a free trial
2. Choose a store name (e.g., `aamrutham-mangoes`)
3. Complete the initial setup wizard
4. Skip adding products manually - we'll configure the store for headless checkout

## Step 2: Enable Storefront API

1. Go to **Settings** → **Apps and sales channels**
2. Click **Develop apps**
3. Click **Create an app**
4. Name it "Aamrutham Web Storefront"
5. Click **Configure Storefront API**
6. Enable these permissions:
   - `unauthenticated_read_product_listings` - Read products
   - `unauthenticated_write_checkouts` - Create checkouts
   - `unauthenticated_read_checkouts` - Read checkout status
   - `unauthenticated_write_customers` - Create customer accounts (optional)
7. Click **Save**
8. Copy the **Storefront API access token** (you'll need this)

## Step 3: Get Your Store Domain

Your store domain will be in the format: `your-store-name.myshopify.com`

Example: `aamrutham-mangoes.myshopify.com`

## Step 4: Add Products to Shopify

For each mango variety, create a product in Shopify:

1. Go to **Products** → **Add product**
2. Add product details:
   - **Title**: Product name (e.g., "Kothapalli Kobbari")
   - **Description**: Product description
   - **Media**: Upload product images
   - **Pricing**: Set base price
   - **Inventory**: Track stock (optional)

3. For pack variants (2kg, 5kg, 10kg):
   - Scroll to **Variants** section
   - Add variant options like "Pack Size"
   - Add each pack size with its price

### Product Variant Setup Example:

**Product**: Kothapalli Kobbari

| Variant | Price | Compare at price |
|---------|-------|------------------|
| 2 kg Pack | ₹899 | ₹1099 |
| 5 kg Pack | ₹2099 | ₹2749 |
| 10 kg Pack | ₹3999 | ₹5499 |

## Step 5: Configure Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
VITE_SHOPIFY_STORE_DOMAIN=your-store-name.myshopify.com
VITE_SHOPIFY_STOREFRONT_TOKEN=your_storefront_api_token
```

## Step 6: Test the Integration

1. Start the development server: `npm run dev`
2. Add products to cart
3. Click "Proceed to Checkout"
4. You'll be redirected to Shopify's secure checkout
5. Complete a test order

## Shopify Buy SDK Integration

The integration uses Shopify's JavaScript Buy SDK which:
- Creates a checkout with your cart items
- Redirects to Shopify's hosted checkout page
- Handles payment processing securely
- Sends order confirmation emails

## Pricing

Shopify pricing (as of 2024):
- **Basic**: ₹1,994/month (best for new stores)
- **Shopify**: ₹5,599/month
- **Advanced**: ₹13,249/month

All plans include:
- Secure checkout
- Multiple payment gateways
- Order management
- Customer accounts

## Payment Gateways in India

Shopify supports these payment gateways for India:
- Razorpay
- PayU
- Paytm
- PayPal
- Credit/Debit cards

## Next Steps

After completing this setup:
1. Add your credentials to `.env`
2. Restart the development server
3. Test the checkout flow

## Troubleshooting

### "Access denied" error
- Verify your Storefront API token is correct
- Check that required permissions are enabled

### Products not showing
- Ensure products are "Active" in Shopify admin
- Check that products have the "Online Store" sales channel enabled

### Checkout redirect not working
- Verify store domain is correct (include `.myshopify.com`)
- Check browser console for errors

## Resources

- [Shopify Storefront API Docs](https://shopify.dev/docs/api/storefront)
- [JavaScript Buy SDK](https://shopify.dev/docs/themes/tools/javascript-buy-sdk)
- [Shopify Help Center](https://help.shopify.com/)