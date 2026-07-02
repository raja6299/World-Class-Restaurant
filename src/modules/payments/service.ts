import { env } from '@/src/config/env';
import { Logger, NotConfiguredError } from '@/src/lib/logger';

export type PaymentProvider = 'RAZORPAY' | 'STRIPE' | 'PHONEPE';

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  clientSecret?: string;
  paymentUrl?: string;
}

export class PaymentService {
  static async createPaymentIntent(
    orderId: string,
    amount: number,
    currency: string = 'INR'
  ): Promise<PaymentIntent> {
    const activeProvider = env.PAYMENT_PROVIDER;
    
    if (!activeProvider) {
      throw new NotConfiguredError('PAYMENT_PROVIDER is not configured');
    }

    Logger.debug(`Creating payment intent for ${orderId}`, 'Payments', { amount, currency });

    switch (activeProvider) {
      case 'RAZORPAY':
        return this.razorpayCreate();
      case 'STRIPE':
        return this.stripeCreate();
      case 'PHONEPE':
        return this.phonepeCreate();
      default:
        throw new NotConfiguredError(`Unsupported Payment Provider: ${activeProvider}`);
    }
  }

  static async verifyPayment(paymentId: string): Promise<boolean> {
    const activeProvider = env.PAYMENT_PROVIDER;
    if (!activeProvider) {
      throw new NotConfiguredError('PAYMENT_PROVIDER is not configured');
    }
    
    Logger.debug(`Verifying payment ${paymentId}`, 'Payments');

    switch (activeProvider) {
      case 'RAZORPAY':
        return this.razorpayVerify();
      case 'STRIPE':
        return this.stripeVerify();
      case 'PHONEPE':
        return this.phonepeVerify();
      default:
        throw new NotConfiguredError(`Unsupported Payment Provider: ${activeProvider}`);
    }
  }

  // --- Provider Adapters ---

  private static async razorpayCreate(): Promise<PaymentIntent> {
    throw new Error('Provider not implemented: RAZORPAY');
  }

  private static async stripeCreate(): Promise<PaymentIntent> {
    throw new Error('Provider not implemented: STRIPE');
  }

  private static async phonepeCreate(): Promise<PaymentIntent> {
    throw new Error('Provider not implemented: PHONEPE');
  }

  private static async razorpayVerify(): Promise<boolean> {
    throw new Error('Provider not implemented: RAZORPAY verify');
  }

  private static async stripeVerify(): Promise<boolean> {
    throw new Error('Provider not implemented: STRIPE verify');
  }

  private static async phonepeVerify(): Promise<boolean> {
    throw new Error('Provider not implemented: PHONEPE verify');
  }
}
