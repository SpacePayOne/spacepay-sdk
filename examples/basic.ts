import { SpacePay, Currency } from '../src'

async function example() {
  try {
    // TODO: Replace with your own values
    const BASE_URL = 'http://localhost:3005'
    const PUBLIC_KEY = 'pk_test_cdf274c69ca18dfed5503a05972723d8'
    const SECRET_KEY =
      'sk_test_aa331dea5f9f9ca7e07102728f0a6a1c36130f268db93f66cbbc60cbe9822216'

    // Create a backend client for merchant operations
    const backendClient = SpacePay.createBackendClient({
      baseUrl: BASE_URL,
      publicKey: PUBLIC_KEY,
      secretKey: SECRET_KEY,
      timeoutMs: 30000,
    })

    // Create a new payment using backend client
    const payment = await backendClient.createPayment({
      orderId: 'order_123',
      amount: 100, // 100 cents = $1.00
      currency: Currency.USD,
      redirectUrl: 'https://merchant.example.com/checkout/success',
      customMetadata: '{"cartId":"abc123","promo":"SUMMER24"}',
    })

    console.log('Payment:', payment)
    console.log('Payment URL:', payment.paymentUrl)
    console.log('Payment Secret:', payment.secret)

    const paymentId = payment.paymentId

    // Create a payment client for frontend operations
    const paymentClient = SpacePay.createPaymentClient({
      baseUrl: BASE_URL,
      publicKey: PUBLIC_KEY,
      paymentSecret: payment.secret,
      timeoutMs: 30000,
    })

    // Check payment status using payment client
    const paymentDetails = await paymentClient.getPaymentStatus(paymentId)
    console.log('Payment details:', paymentDetails)
    console.log('Payment status:', paymentDetails.status)
    console.log('Transaction hash:', paymentDetails.txHash)
    console.log('Received amount:', paymentDetails.receivedAmount)

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
