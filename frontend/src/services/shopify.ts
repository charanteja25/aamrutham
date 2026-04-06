const SHOPIFY_STORE_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || '';
const SHOPIFY_STOREFRONT_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN || '';

const GRAPHQL_ENDPOINT = `https://${SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`;

interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        price: {
          amount: string;
          currencyCode: string;
        };
        compareAtPrice?: {
          amount: string;
          currencyCode: string;
        };
        available: boolean;
      };
    }>;
  };
}

interface ShopifyCheckout {
  id: string;
  webUrl: string;
  totalPrice: {
    amount: string;
    currencyCode: string;
  };
  lineItems: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        quantity: number;
        variant: {
          id: string;
          title: string;
          price: {
            amount: string;
          };
        };
      };
    }>;
  };
}

async function shopifyFetch<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await response.json();
  
  if (json.errors) {
    throw new Error(json.errors[0].message);
  }
  
  return json.data;
}

const CREATE_CHECKOUT_MUTATION = `
  mutation createCheckout($input: CheckoutCreateInput!) {
    checkoutCreate(input: $input) {
      checkout {
        id
        webUrl
        totalPrice {
          amount
          currencyCode
        }
        lineItems(first: 100) {
          edges {
            node {
              id
              title
              quantity
              variant {
                id
                title
                price {
                  amount
                }
              }
            }
          }
        }
      }
      checkoutUserErrors {
        code
        field
        message
      }
    }
  }
`;

const ADD_LINE_ITEMS_MUTATION = `
  mutation addLineItems($checkoutId: ID!, $lineItems: [CheckoutLineItemInput!]!) {
    checkoutLineItemsAdd(checkoutId: $checkoutId, lineItems: $lineItems) {
      checkout {
        id
        webUrl
        totalPrice {
          amount
          currencyCode
        }
      }
      checkoutUserErrors {
        code
        field
        message
      }
    }
  }
`;

const GET_PRODUCTS_QUERY = `
  query getProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
                available
              }
            }
          }
        }
      }
    }
  }
`;

const GET_PRODUCT_BY_HANDLE_QUERY = `
  query getProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      handle
      description
      images(first: 5) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 10) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
            available
          }
        }
      }
    }
  }
`;

export interface CartLineItem {
  variantId: string;
  quantity: number;
}

export const shopifyService = {
  isConfigured(): boolean {
    return Boolean(SHOPIFY_STORE_DOMAIN && SHOPIFY_STOREFRONT_TOKEN);
  },

  async getProducts(limit = 20): Promise<ShopifyProduct[]> {
    const data = await shopifyFetch<{ products: { edges: Array<{ node: ShopifyProduct }> } }>(
      GET_PRODUCTS_QUERY,
      { first: limit }
    );
    return data.products.edges.map(edge => edge.node);
  },

  async getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
    const data = await shopifyFetch<{ productByHandle: ShopifyProduct | null }>(
      GET_PRODUCT_BY_HANDLE_QUERY,
      { handle }
    );
    return data.productByHandle;
  },

  async createCheckout(lineItems: CartLineItem[]): Promise<ShopifyCheckout> {
    const data = await shopifyFetch<{ checkoutCreate: { checkout: ShopifyCheckout; checkoutUserErrors: Array<{ message: string }> } }>(
      CREATE_CHECKOUT_MUTATION,
      {
        input: {
          lineItems: lineItems.map(item => ({
            variantId: item.variantId,
            quantity: item.quantity,
          })),
        },
      }
    );

    if (data.checkoutCreate.checkoutUserErrors.length > 0) {
      throw new Error(data.checkoutCreate.checkoutUserErrors[0].message);
    }

    return data.checkoutCreate.checkout;
  },

  async addLineItems(checkoutId: string, lineItems: CartLineItem[]): Promise<ShopifyCheckout> {
    const data = await shopifyFetch<{ checkoutLineItemsAdd: { checkout: ShopifyCheckout; checkoutUserErrors: Array<{ message: string }> } }>(
      ADD_LINE_ITEMS_MUTATION,
      {
        checkoutId,
        lineItems: lineItems.map(item => ({
          variantId: item.variantId,
          quantity: item.quantity,
        })),
      }
    );

    if (data.checkoutLineItemsAdd.checkoutUserErrors.length > 0) {
      throw new Error(data.checkoutLineItemsAdd.checkoutUserErrors[0].message);
    }

    return data.checkoutLineItemsAdd.checkout;
  },

  redirectToCheckout(checkout: ShopifyCheckout): void {
    window.location.href = checkout.webUrl;
  },
};

export type { ShopifyProduct, ShopifyCheckout };