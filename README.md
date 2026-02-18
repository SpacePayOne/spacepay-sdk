# SpacePay Client SDK

A lightweight, TypeScript-first SDK for integrating with SpacePay-like crypto payment gateways. Works in Node.js 18+ and modern browsers.

## Features

- 🚀 **Lightweight** - No heavy dependencies, minimal bundle size
- 🔒 **Type-safe** - Full TypeScript support with comprehensive type definitions
- 🌐 **Universal** - Works in Node.js 18+ and modern browsers
- ⚡ **Modern** - Uses native fetch API and modern JavaScript features
- 🛡️ **Robust** - Built-in error handling, timeout management, and retry logic

## Installation

```bash
yarn add @spacepay/client-sdk
```

## Backend (Node.js)

```typescript
import { createBackendClient } from '@spacepay/client-sdk/backend'

const client = createBackendClient({
  baseUrl: 'https://api.spacepay.com',
  publicKey: 'your_public_key_here',
  secretKey: 'your_secret_key_here',
})

// Create a payment
const payment = await client.createPayment({
  amount: 5000, // 5000 cents = $50.00
  currency: 'USD',
  orderId: 'order_123',
})

console.log('Payment created:', payment.paymentId)
```

## API Reference

### Client Configuration

```typescript
interface ClientOptions {
  baseUrl: string // API base URL
  publicKey: string // Merchant public key
  secretKey: string // Merchant secret key
  config?: {
    timeoutMs?: number // Request timeout (default: 30000)
  }
}
```

### Creating Payments

```typescript
interface CreatePaymentRequest {
  amount: number // Amount in cents, e.g. 5000 for $50.00
  currency: string // Currency code, e.g. "USD"
  orderId: string // Your internal order ID
}

const payment = await client.createPayment({
  amount: 10000, // 10000 cents = $100.00
  currency: 'USD',
  orderId: 'order_456',
})
```

### Checking Payment Status

```typescript
const status = await client.getPaymentStatus('payment_id_here')

interface PaymentStatusDto {
  id: string
  status: PaymentStatus
}
```

### Payment Status Values

- `pending` - Payment created, waiting for funds
- `processing` - Payment detected, confirming on blockchain
- `confirmed` - Payment confirmed and settled
- `failed` - Payment failed or rejected
- `expired` - Payment expired without completion
- `refunded` - Payment was refunded
- `partially_refunded` - Partial refund issued

## Frontend (TypeScript / bundlers)

Use the frontend entry for browser-safe usage (no secret key) and embedded checkout:

```ts
import {
  createCheckoutClient,
  initEmbeddedCheckout,
} from '@spacepay/client-sdk/frontend'

const paymentClient = createCheckoutClient({
  baseUrl: 'https://api.spacepay.com',
  publicKey: 'pk_...',
  paymentSecret: 'ps_...',
})
```

### Embedded Checkout

You can embed the SpacePay checkout UI into your own checkout page in a Stripe-like way:

```ts
import { initEmbeddedCheckout } from '@spacepay/client-sdk/frontend'

const checkout = await initEmbeddedCheckout({
  baseUrl: 'https://pay.spacepay.com',
  paymentId: 'payment_id_from_backend',
  secret: 'payment_secret_from_backend',
})

checkout.mount('#spacepay-checkout')
```

This will:

- Render a small inline iframe (e.g. a \"Pay with SpacePay\" button) into the `#spacepay-checkout` container.
- Listen for messages from the embedded SpacePay UI:
  - `spacepay-request-login` → opens a centered modal with the SpacePay login/top-up iframe.
  - `spacepay-user-authenticated` → closes the modal and refreshes the inline iframe.

> The payment-button and login pages are part of the SpacePay frontend and must emit these messages via `window.parent.postMessage`. See `examples/EMBEDDED_PAGE_INSTRUCTIONS.md` for details.

## CDN / Browser (global)

If you prefer a `<script>` tag, you can use the prebuilt browser bundle:

```html
<script src="https://cdn.example.com/@spacepay/client-sdk/spacepay.bundle.js"></script>
<script>
  (async function () {
    const checkout = await window.SpacePaySDK.initEmbeddedCheckout({
      baseUrl: 'https://pay.spacepay.com',
      paymentId: '...',
      secret: '...',
    })

    checkout.mount('#spacepay-checkout')
  })()
</script>
```

The same bundle also exposes `SpacePaySDK.createBackendClient` and `SpacePaySDK.createCheckoutClient` for browser-based integrations that call your backend.

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

```bash
# Install dependencies
yarn install

# Build the project (includes format checking)
yarn build

# Development mode with watch
yarn dev

# Clean build artifacts
yarn clean

# Format code with Prettier
yarn format

# Check code formatting
yarn format:check

# Lint code with ESLint
yarn lint

# Fix linting issues automatically
yarn lint:fix
```

### Project Structure

```
src/
├── index.ts              # Main entry point
├── client.ts             # Main SDK client
├── types/                # TypeScript definitions
│   ├── index.ts
│   ├── payment.ts
│   ├── config.ts
│   └── errors.ts
└── utils/                # Utility functions
    ├── index.ts
    ├── crypto.ts
    └── validation.ts
```

### Code Quality

This project uses both [Prettier](https://prettier.io/) and [ESLint](https://eslint.org/) for code quality:

**Prettier** - Code formatting (`.prettierrc`):

- Single quotes
- No semicolons
- 80 character line width
- ES5 trailing commas
- HTML files use 120 character line width

**ESLint** - Code linting (`eslint.config.js`):

- TypeScript-specific rules
- No unused variables
- Consistent code patterns
- Integration with Prettier (no conflicts)

The build process automatically checks both formatting and linting, ensuring code quality standards are met.

## Browser Support

This SDK works in modern browsers that support:

- Fetch API
- AbortController
- Crypto API (for UUID generation)

For older browsers, you may need to include polyfills for these features.

## Node.js Support

- **Node.js 18+**: Full support with native fetch API
- **Node.js 16-17**: Requires `node-fetch` polyfill
- **Node.js <16**: Not supported

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

For support and questions:

- Create an issue on GitHub
- Check the examples directory
- Review the API documentation
