# 🥭 Aamrutham — Premium Mango E-Commerce Platform

> *Aam + Amrutham. The finest mango varieties, straight from Bobbili farms to Hyderabad.*

**Live site:** https://charanteja25.github.io/aamrutham

---

## About

Aamrutham is a premium mango brand launching **Summer 2026** in Hyderabad. This is a full-stack e-commerce application with bilingual support (English & Telugu) and multiple payment gateway integrations.

## Features

- **Bilingual Support**: Full English and Telugu (తెలుగు) language support
- **Product Catalog**: Premium heritage mango varieties with pack options
- **Shopping Cart**: Persistent cart with localStorage
- **Multiple Payment Options**:
  - **Shopify Checkout** (default) - Full hosted checkout experience
  - **Razorpay** - Indian payment gateway (Cards, UPI, Netbanking)
  - **Cash on Delivery** - Always available fallback
- **Responsive Design**: Mobile-first with Tailwind CSS

## Project Structure

```
aamrutham/
├── backend/                    # Node.js + Express + TypeScript API
│   ├── src/
│   │   ├── data/              # Product data and translations
│   │   ├── routes/            # API routes
│   │   │   ├── products.ts    # Product endpoints
│   │   │   ├── cart.ts        # Cart management
│   │   │   ├── orders.ts      # Order processing
│   │   │   ├── checkout.ts    # Checkout config
│   │   │   ├── razorpay.ts    # Razorpay integration
│   │   │   └── i18n.ts        # Translations
│   │   ├── types/             # TypeScript interfaces
│   │   └── index.ts           # Server entry point
│   └── package.json
│
├── frontend/                   # React + Vite + TypeScript + Tailwind
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API and payment services
│   │   │   ├── api.ts         # Backend API client
│   │   │   ├── shopify.ts     # Shopify integration
│   │   │   └── razorpay.ts    # Razorpay integration
│   │   ├── store/             # Zustand state management
│   │   ├── config/            # App configuration
│   │   ├── i18n.ts            # Internationalization
│   │   └── main.tsx           # App entry point
│   └── package.json
│
├── docs/                       # Documentation
│   ├── SHOPIFY_SETUP.md       # Shopify store setup guide
│   ├── SHOPIFY_INTEGRATION.md # Shopify technical docs
│   └── PAYMENT_SETUP.md       # Payment gateway setup
│
└── package.json               # Root workspace config
```

## Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js + Express | REST API server |
| TypeScript | Type safety |
| Razorpay SDK | Payment processing |

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| Vite | Build tool |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| React Router | Navigation |
| Zustand | State management |
| i18next | Internationalization |

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repo
git clone https://github.com/charanteja25/aamrutham.git
cd aamrutham

# Install all dependencies
npm install
```

### Development

```bash
# Run both backend and frontend
npm run dev

# Run backend only (port 3001)
npm run dev:backend

# Run frontend only (port 3000)
npm run dev:frontend
```

### Build

```bash
npm run build
```

## Configuration

### Environment Variables

#### Backend (`backend/.env`)
```env
# Server
PORT=3001

# Shopify (optional - enables Shopify checkout)
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_TOKEN=your_storefront_api_token

# Razorpay (optional - enables Razorpay checkout)
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_secret_key
```

#### Frontend (`frontend/.env`)
```env
# Shopify (for direct Storefront API calls)
VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
VITE_SHOPIFY_STOREFRONT_TOKEN=your_storefront_api_token
```

### Payment Provider Priority

The checkout provider is determined automatically:

1. **Shopify** (default) - if configured
2. **Razorpay** - if Shopify not configured but Razorpay is
3. **Cash on Delivery** - always available as fallback

See `docs/PAYMENT_SETUP.md` for detailed setup instructions.

## API Endpoints

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get product by ID |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/cart` | Create new cart |
| GET | `/api/cart/:cartId` | Get cart |
| POST | `/api/cart/:cartId/items` | Add item to cart |
| PUT | `/api/cart/:cartId/items/:productId/:packId` | Update quantity |
| DELETE | `/api/cart/:cartId/items/:productId/:packId` | Remove item |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Create order |
| GET | `/api/orders/:orderId` | Get order by ID |

### Checkout
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/checkout/config` | Get active checkout provider |

### Razorpay
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/razorpay/create-order` | Create payment order |
| POST | `/api/razorpay/verify` | Verify payment |

### i18n
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/i18n/languages` | Get available languages |
| GET | `/api/i18n/:lang` | Get translations |

## Language Support

| Language | Code | Native |
|----------|------|--------|
| English | `en` | English |
| Telugu | `te` | తెలుగు |

Language can be switched using the dropdown in the header. Selection is persisted in localStorage.

## Documentation

- [Shopify Setup Guide](docs/SHOPIFY_SETUP.md) - Create and configure Shopify store
- [Shopify Integration](docs/SHOPIFY_INTEGRATION.md) - Technical integration details
- [Payment Setup](docs/PAYMENT_SETUP.md) - Configure payment gateways

## Contributing

1. Fork this repo
2. Create a branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Push and open a Pull Request

### Key areas where help is welcome
- 🎨 Design improvements (CSS, animations)
- 📸 Real product photography integration
- 🌐 Additional language support
- 📱 Mobile UX enhancements
- ♿ Accessibility improvements
- 🧪 Test coverage

## License

© 2026 Aamrutham. All rights reserved.