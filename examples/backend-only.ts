import SpacePay, { Currency, formatUnits } from '../src'

async function example() {
  try {
    // ------------------------------------------------------------
    // Backend
    // ------------------------------------------------------------

    // TODO: Replace with your own values
    // const BASE_URL = 'http://localhost:3005'
    const BASE_URL = 'base_url_here'
    const PUBLIC_KEY = 'public_key_here'
    const SECRET_KEY = 'secret_key_here'

    // Create a backend client for merchant operations
    const backendClient = SpacePay.createBackendClient({
      apiBaseUrl: BASE_URL,
      publicKey: PUBLIC_KEY,
      secretKey: SECRET_KEY,
    })

    // Create a new payment using backend client
    const payment = await backendClient.createPayment({
      orderId: 'order_123',
      amount: 100, // 100 cents = $1.00
      currency: Currency.USD,
      redirectUrl: 'https://merchant.example.com/checkout/success',
      customMetadata: '{"cartId":"abc123","promo":"SUMMER24"}',
    })
    const defaultQuote = payment.payment.quotes[0]

    console.log('Payment:', payment)
    console.log('Payment URL:', payment.paymentUrl)
    console.log('Payment Secret:', payment.secret)
    console.log('Payment ID:', payment.paymentId)
    console.log(
      `Please send ${formatUnits(
        defaultQuote.expectedAmountAsset,
        defaultQuote.token.decimals
      )} ${defaultQuote.token.symbol} to: ${payment.payment.depositAddress?.address}`
    )
    console.log('All done!')
  } catch (error) {
    console.log(error)
    if (error instanceof Error) {
      console.error('Error:', error.message)
    } else {
      console.error('Unknown error:', error)
    }
  }
}

// Run the example
example()
