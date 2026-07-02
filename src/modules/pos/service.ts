import { env } from '@/src/config/env';
import { Logger, NotConfiguredError } from '@/src/lib/logger';

export type POSProvider = 'PETPOOJA' | 'POSIST' | 'SQUARE';

export interface POSSyncResult {
  success: boolean;
  posOrderId?: string;
  error?: string;
}

export interface POSOrderPayload {
  orderId: string;
  totalAmount: number;
  items: unknown[];
  [key: string]: unknown;
}

export class POSIntegrationService {
  /**
   * Pushes an order to the central POS system for unified billing/inventory.
   */
  static async syncOrder(orderData: POSOrderPayload): Promise<POSSyncResult> {
    const activeProvider = env.POS_PROVIDER;

    if (!activeProvider) {
      throw new NotConfiguredError('POS_PROVIDER is not configured');
    }

    Logger.debug('Syncing order to POS', 'POS', { orderData });

    switch (activeProvider) {
      case 'PETPOOJA':
        return this.petpoojaSync();
      case 'POSIST':
        return this.posistSync();
      case 'SQUARE':
        return this.squareSync();
      default:
        throw new NotConfiguredError(`Unsupported POS Provider: ${activeProvider}`);
    }
  }

  // --- Provider Adapters ---

  private static async petpoojaSync(): Promise<POSSyncResult> {
    throw new Error('Provider not implemented: PETPOOJA');
  }

  private static async posistSync(): Promise<POSSyncResult> {
    throw new Error('Provider not implemented: POSIST');
  }

  private static async squareSync(): Promise<POSSyncResult> {
    throw new Error('Provider not implemented: SQUARE');
  }
}
