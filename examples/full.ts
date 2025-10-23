import { URL } from 'node:url'
import { SpacePay, Currency, formatUnits } from '../src'

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

    console.log(
      `Please send ${formatUnits(
        quote.expectedAmountAsset,
        quote.token.decimals
      )} ${quote.token.symbol} to: ${paymentDetails.depositAddress?.address}`
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
