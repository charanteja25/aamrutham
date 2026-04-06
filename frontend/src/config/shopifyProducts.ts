export const SHOPIFY_PRODUCT_MAPPING: Record<string, Record<string, string>> = {
  'kothapalli-kobbari': {
    'pack-2kg': 'gid://shopify/ProductVariant/YOUR_VARIANT_ID_1',
    'pack-5kg': 'gid://shopify/ProductVariant/YOUR_VARIANT_ID_2',
    'pack-10kg': 'gid://shopify/ProductVariant/YOUR_VARIANT_ID_3',
  },
  'imam-pasand': {
    'pack-2kg': 'gid://shopify/ProductVariant/YOUR_VARIANT_ID_4',
    'pack-5kg': 'gid://shopify/ProductVariant/YOUR_VARIANT_ID_5',
    'pack-10kg': 'gid://shopify/ProductVariant/YOUR_VARIANT_ID_6',
  },
  'bobbili-peechu': {
    'pack-2kg': 'gid://shopify/ProductVariant/YOUR_VARIANT_ID_7',
    'pack-5kg': 'gid://shopify/ProductVariant/YOUR_VARIANT_ID_8',
    'pack-10kg': 'gid://shopify/ProductVariant/YOUR_VARIANT_ID_9',
  },
  'mettavalasa-peechu': {
    'pack-2kg': 'gid://shopify/ProductVariant/YOUR_VARIANT_ID_10',
    'pack-5kg': 'gid://shopify/ProductVariant/YOUR_VARIANT_ID_11',
    'pack-10kg': 'gid://shopify/ProductVariant/YOUR_VARIANT_ID_12',
  },
};

export function getShopifyVariantId(productId: string, packId: string): string | null {
  return SHOPIFY_PRODUCT_MAPPING[productId]?.[packId] || null;
}

export function isShopifyConfigured(): boolean {
  const firstMapping = Object.values(SHOPIFY_PRODUCT_MAPPING)[0];
  const firstVariant = Object.values(firstMapping)[0];
  return !firstVariant.includes('YOUR_VARIANT_ID');
}