import type { PaymentContextSource } from '../types/config'

export async function resolvePaymentContext(
  options: PaymentContextSource
): Promise<{ paymentId: string; paymentSecretKey: string }> {
  if (options.fetchPaymentContext) {
    const ctx = await options.fetchPaymentContext()
    if (!ctx || !ctx.paymentId || !ctx.paymentSecretKey) {
      throw new Error(
        'SpacePay embedded: fetchPaymentContext must return { paymentId, paymentSecretKey }'
      )
    }
    return ctx
  }

  if (!options.paymentId || !options.paymentSecretKey) {
    throw new Error(
      'SpacePay embedded: provide paymentId & paymentSecretKey or fetchPaymentContext'
    )
  }

  return {
    paymentId: options.paymentId,
    paymentSecretKey: options.paymentSecretKey,
  }
}
