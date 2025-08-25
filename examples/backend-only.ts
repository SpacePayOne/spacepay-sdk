import { SpacePay, Currency, formatUnits } from '../src'

async function example() {
  try {
    // ------------------------------------------------------------
    // Backend
    // ------------------------------------------------------------

    // TODO: Replace with your own values
    // const BASE_URL = 'http://localhost:3005'
    const BASE_URL = 'https://lobster-app-ovz3a.ondigitalocean.app'
    const PUBLIC_KEY = 'pk_test_cdf274c69ca18dfed5503a05972723d8'
    const SECRET_KEY =
      'sk_test_aa331dea5f9f9ca7e07102728f0a6a1c36130f268db93f66cbbc60cbe9822216'

    // Create a backend client for merchant operations
    const backendClient = SpacePay.createBackendClient({
      baseUrl: BASE_URL,
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
