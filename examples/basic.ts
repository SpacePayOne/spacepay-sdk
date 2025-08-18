import { SpacePayClient, Currency } from '../src'

// Initialize the client
const client = new SpacePayClient({
  // TODO: do we need to define base url here?
  // baseUrl: 'http://localhost:3005',
  baseUrl: 'https://lobster-app-ovz3a.ondigitalocean.app',
  // TODO: remove from git and database after internal testing
  publicKey: 'pk_test_cdf274c69ca18dfed5503a05972723d8',
  // TODO: remove from git and database after internal testing
  secretKey:
    'sk_test_aa331dea5f9f9ca7e07102728f0a6a1c36130f268db93f66cbbc60cbe9822216',
  config: {
    timeoutMs: 30000,
  },
})

async function example() {
  try {
    console.log(Currency.USD)
    // Create a new payment
    const payment = await client.createPayment({
      orderId: 'order_123',
      amount: 100, // 100 cents = $1.00
      currency: Currency.USD,
    })

    console.log('Payment:', payment)
    console.log('Payment:', JSON.stringify(payment, null, 4))

    const paymentId = payment.id
    // const paymentId = '29b8b410-5f1f-417f-88db-4b168593982b'

    // Check payment status
    const paymentDetails = await client.getPaymentStatus(paymentId)
    console.log('Payment details:', paymentDetails)
    console.log('Payment status:', paymentDetails.status)
    console.log('Transaction hash:', paymentDetails.txHash)
    console.log('Received amount:', paymentDetails.receivedAmount)

    // Get active quotes for the payment
    const quotes = await client.getActiveQuotes(paymentId)
    console.log('Active quotes:', quotes)

    // Create or update a quote for a specific token
    const quote = await client.createOrUpdateQuote(paymentId, {
      contractAddress: '0x0000000000000000000000000000000000000000',
      chainId: 11155111, // Ethereum Sepolia
    })
    console.log('Updated quote:', quote)

    // Get active quotes for the payment
    const quotes2 = await client.getActiveQuotes(paymentId)
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
