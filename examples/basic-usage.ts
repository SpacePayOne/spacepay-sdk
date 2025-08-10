import { SpacePayClient } from '../src'

// Initialize the client
const client = new SpacePayClient({
  baseUrl: 'https://api.spacepay.com',
  publicKey: 'your_public_key_here',
  secretKey: 'your_secret_key_here',
  config: {
    timeoutMs: 30000,
  },
})

async function example() {
  try {
    // Create a new payment
    const payment = await client.createPayment({
      amount: '50.00',
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
    if (error instanceof Error) {
      console.error('Error:', error.message)
    } else {
      console.error('Unknown error:', error)
    }
  }
}

// Run the example
example()
