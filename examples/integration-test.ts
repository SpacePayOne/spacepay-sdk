import { SpacePay, Currency } from '../src'

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

  // Initialize backend client
  const backendClient = SpacePay.createBackendClient({
    baseUrl: config.baseUrl,
    publicKey: config.publicKey,
    secretKey: config.secretKey,
  })
  console.log('✅ Backend client initialized')

  try {
    // Test 1: Create a payment
    console.log('\n📝 Test 1: Creating payment...')
    const payment = await backendClient.createPayment({
      amount: 1, // 1 cent = $0.01 for testing
      currency: Currency.USD,
      orderId: `test_${Date.now()}`, // Unique order ID
      redirectUrl: 'https://merchant.example.com/checkout/success',
      customMetadata: '{"testId":"integration_test"}',
    })

    console.log('✅ Payment created successfully')
    console.log('   Payment ID:', payment.paymentId)
    console.log('   Payment URL:', payment.paymentUrl)
    console.log('   Payment Secret:', payment.secret)

    // Test 2: Get payment details using backend client
    console.log('\n📊 Test 2: Getting payment details...')
    const paymentDetails = await backendClient.getPaymentDetails(
      payment.paymentId
    )

    console.log('✅ Payment details retrieved')
    console.log('   Payment ID:', paymentDetails.id)
    console.log('   Status:', paymentDetails.status)

    // Test 3: Create payment client for frontend operations
    console.log('\n🔐 Test 3: Creating payment client...')
    const paymentClient = SpacePay.createPaymentClient({
      baseUrl: config.baseUrl,
      publicKey: config.publicKey,
      paymentSecret: payment.secret,
    })

    // Test 4: Get payment status using payment client
    console.log('\n📊 Test 4: Getting payment status...')
    const status = await paymentClient.getPaymentStatus(payment.paymentId)

    console.log('✅ Payment status retrieved')
    console.log('   Status:', status.status)

    // Test 5: Wait and check status again (to see if it changes)
    console.log('\n⏳ Test 5: Waiting 5 seconds and checking status again...')
    await new Promise((resolve) => setTimeout(resolve, 5000))

    const statusAfterWait = await paymentClient.getPaymentStatus(
      payment.paymentId
    )
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
