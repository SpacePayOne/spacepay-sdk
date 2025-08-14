import { SpacePayClient } from '../src'

/**
 * Integration test example for SpacePay Client SDK
 *
 * This example shows how to test the SDK with real API endpoints.
 * Set the following environment variables to run:
 *
 * SPACEPAY_BASE_URL=https://api.spacepay.com
 * SPACEPAY_PUBLIC_KEY=your_public_key
 * SPACEPAY_SECRET_KEY=your_secret_key
 */

// Environment variables for testing
const config = {
  baseUrl: process.env.SPACEPAY_BASE_URL || 'https://api.spacepay.com',
  publicKey: process.env.SPACEPAY_PUBLIC_KEY || 'test_public_key',
  secretKey: process.env.SPACEPAY_SECRET_KEY || 'test_secret_key',
}

async function integrationTest() {
  console.log('🚀 Starting SpacePay Client SDK Integration Test')
  console.log('='.repeat(50))

  // Initialize client
  const client = new SpacePayClient(config)
  console.log('✅ Client initialized')

  try {
    // Test 1: Create a payment
    console.log('\n📝 Test 1: Creating payment...')
    const payment = await client.createPayment({
      amount: 1, // 1 cent = $0.01 for testing
      currency: 'USD',
      orderId: `test_${Date.now()}`, // Unique order ID
    })

    console.log('✅ Payment created successfully')
    console.log('   Payment ID:', payment.id)
    console.log('   Payment Address:', payment.paymentAddress)
    console.log('   Expiration:', payment.expiration)

    // Test 2: Get payment status
    console.log('\n📊 Test 2: Getting payment status...')
    const status = await client.getPaymentStatus(payment.id)

    console.log('✅ Payment status retrieved')
    console.log('   Status:', status.status)
    console.log('   Chain ID:', status.chainId)
    console.log('   Token Address:', status.tokenAddress)

    // Test 3: Wait and check status again (to see if it changes)
    console.log('\n⏳ Test 3: Waiting 5 seconds and checking status again...')
    await new Promise((resolve) => setTimeout(resolve, 5000))

    const statusAfterWait = await client.getPaymentStatus(payment.id)
    console.log('✅ Status after wait:', statusAfterWait.status)

    console.log('\n🎉 All integration tests passed!')
  } catch (error) {
    console.error('\n❌ Integration test failed:')
    if (error instanceof Error) {
      console.error('   Error:', error.message)
      console.error('   Stack:', error.stack)
    } else {
      console.error('   Unknown error:', error)
    }

    // Exit with error code for CI/CD
    process.exit(1)
  }
}

// Run integration test if this file is executed directly
// In ESM, we can check if this is the main module using import.meta.url
if (import.meta.url === `file://${process.argv[1]}`) {
  integrationTest().catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
}

export { integrationTest }
