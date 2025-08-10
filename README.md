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
yarn add spacepay-client-sdk
```

## Quick Start

```typescript
import { SpacePayClient } from 'spacepay-client-sdk'

// Initialize the client
const client = new SpacePayClient({
  baseUrl: 'https://api.spacepay.com',
  publicKey: 'your_public_key_here',
  secretKey: 'your_secret_key_here',
})

// Create a payment
const payment = await client.createPayment({
  amount: '50.00',
  currency: 'USDC',
  chainId: 1, // Ethereum mainnet
  orderId: 'order_123',
  returnUrl: 'https://myapp.com/success',
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
  amount: string // Decimal string, e.g. "50.00"
  currency: string // Currency code, e.g. "USDC"
  chainId: number // Blockchain network ID
  orderId: string // Your internal order ID
  metadata?: Record<string, any> // Optional metadata
  returnUrl?: string // URL to redirect after payment
}

const payment = await client.createPayment({
  amount: '100.00',
  currency: 'USDC',
  chainId: 1,
  orderId: 'order_456',
  metadata: { customerId: 'cust_123' },
})
```

### Checking Payment Status

```typescript
const status = await client.getPaymentStatus('payment_id_here')

interface PaymentStatusResponse {
  status: PaymentStatus
  txHash: string | null
  receivedAmount: {
    amount: string
    amountMinor: string
    currency: string
    decimals: number
  }
  chainId: number
  tokenAddress: string | null
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

### Error Handling

```typescript
import { ApiError } from 'spacepay-client-sdk'

try {
  const payment = await client.createPayment(request)
} catch (error) {
  if (error instanceof ApiError) {
    console.error('API Error:', error.message)
    console.error('Status:', error.status)
    console.error('Request ID:', error.requestId)
  } else {
    console.error('Unexpected error:', error)
  }
}
```

## Examples

See the `examples/` directory for complete usage examples:

- [Basic Usage](./examples/basic-usage.ts) - Simple payment creation and status checking

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
