import { URL } from 'node:url'
import { SpacePay, Currency } from '../src'

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
    const backendPayment = await backendClient.createPayment({
      orderId: 'order_123',
      amount: 100, // 100 cents = $1.00
      currency: Currency.USD,
      redirectUrl: 'https://merchant.example.com/checkout/success',
      customMetadata: '{"cartId":"abc123","promo":"SUMMER24"}',
    })

    console.log('Payment URL:', backendPayment.paymentUrl)

    // ------------------------------------------------------------
    // Frontend
    // ------------------------------------------------------------

    // parse payment url
    const paymentUrl = new URL(backendPayment.paymentUrl)
    const paymentId = paymentUrl.searchParams.get('paymentId')!
    const paymentSecret = paymentUrl.searchParams.get('secret')!

    // Create a payment client for frontend operations
    const paymentClient = SpacePay.createPaymentClient({
      baseUrl: BASE_URL,
      publicKey: PUBLIC_KEY,
      paymentSecret,
    })

    // Check payment status using payment client
    const paymentStatus = await paymentClient.getPaymentStatus(paymentId)
    console.log('Payment status:', paymentStatus.status)

    // Get payment details using payment client
    const paymentDetails = await paymentClient.getPaymentDetails(paymentId)
    console.log('Payment details:', paymentDetails)
    console.log('Deposit address:', paymentDetails.depositAddress?.address)

    // Get active quotes for the payment using payment client
    const quotes = await paymentClient.getActiveQuotes(paymentId)
    console.log('Active quotes:', quotes)

    // Create or update a quote for a specific token using payment client
    const quote = await paymentClient.createOrUpdateQuote(paymentId, {
      contractAddress: '0x0000000000000000000000000000000000000000',
      chainId: 11155111, // Ethereum Sepolia
    })
    console.log('Updated quote:', quote)

    // Get active quotes for the payment again
    const quotes2 = await paymentClient.getActiveQuotes(paymentId)
    console.log('Active quotes:', quotes2)

    console.log('All done!')
    console.log(
      `Please send ${quote.expectedAmountAsset} ${quote.token.symbol} to: ${paymentDetails.depositAddress?.address}`
    )
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
