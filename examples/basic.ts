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
      amount: 100, // 100 cents = $1.00
      currency: 'USD',
      orderId: 'order_123',
    })

    console.log('Payment:', payment)
    console.log('Payment:', JSON.stringify(payment, null, 4))

    // Check payment status
    const paymentDetails = await client.getPaymentStatus(payment.id)
    console.log('Payment details:', paymentDetails)
    console.log('Payment status:', paymentDetails.status)
    console.log('Transaction hash:', paymentDetails.txHash)
    console.log('Received amount:', paymentDetails.receivedAmount)
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
