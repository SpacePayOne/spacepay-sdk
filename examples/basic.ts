import { SpacePayClient } from '../src'

// Initialize the client
const client = new SpacePayClient({
  baseUrl: 'http://localhost:3005',
  publicKey: 'pk_test_cdf274c69ca18dfed5503a05972723d8',
  secretKey:
    'sk_test_313a0981e789e1cbcef07296101b79a3c3e6f828f50cca742d0be8f9072fb8b2',
  config: {
    timeoutMs: 30000,
  },
})

async function example() {
  try {
    // Create a new payment
    const payment = await client.createPayment({
      amount: 5000, // 5000 cents = $50.00
      currency: 'USDC',
      chainId: 1, // Ethereum mainnet
      orderId: 'order_123',
      metadata: {
        customerId: 'cust_456',
        description: 'Premium subscription',
      },
      returnUrl: 'https://myapp.com/success',
    })

    console.log('Payment created:', payment)
    console.log('Payment ID:', payment.paymentId)
    console.log('Payment address:', payment.paymentAddress)

    // Check payment status
    const status = await client.getPaymentStatus(payment.paymentId)
    console.log('Payment status:', status.status)
    console.log('Transaction hash:', status.txHash)
    console.log('Received amount:', status.receivedAmount)
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
