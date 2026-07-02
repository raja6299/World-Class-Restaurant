import { env } from '@/src/config/env';
import { Logger, NotConfiguredError } from '@/src/lib/logger';

export type HardwareProvider = 'EPSON' | 'SUNMI';

export class HardwareService {
  /**
   * Dispatches a print job to a thermal printer (KOT or Receipt).
   * Note: In a cloud environment, this usually queues a job that a local desktop agent or native app picks up.
   */
  static async printReceipt(orderId: string) {
    const activeProvider = env.HARDWARE_PROVIDER;

    if (!activeProvider) {
      throw new NotConfiguredError('HARDWARE_PROVIDER is not configured');
    }

    Logger.debug(`Printing receipt for order: ${orderId}`, 'Hardware');

    switch (activeProvider) {
      case 'EPSON':
        return this.epsonPrint();
      case 'SUNMI':
        return this.sunmiPrint();
      default:
        throw new NotConfiguredError(`Unsupported hardware provider: ${activeProvider}`);
    }
  }

  // --- Provider Adapters ---

  private static async epsonPrint(): Promise<void> {
    throw new Error('Provider not implemented: EPSON');
  }

  private static async sunmiPrint(): Promise<void> {
    throw new Error('Provider not implemented: SUNMI');
  }
}
