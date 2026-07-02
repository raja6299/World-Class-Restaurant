import { env } from '@/src/config/env';
import { Logger, NotConfiguredError } from '@/src/lib/logger';

export type MonitoringProvider = 'DATADOG' | 'SENTRY' | 'NEWRELIC';

export class MonitoringService {
  static logError(error: Error, context?: Record<string, unknown>) {
    Logger.debug(`[Monitoring] Attempting to log error: ${(error as Error).message}`, 'Monitoring', context);
    
    const activeProvider = env.MONITORING_PROVIDER;

    if (!activeProvider) {
      throw new NotConfiguredError('MONITORING_PROVIDER is not configured');
    }

    switch (activeProvider) {
      case 'SENTRY':
        return this.sentryLogError();
      case 'DATADOG':
        return this.datadogLogError();
      case 'NEWRELIC':
        return this.newrelicLogError();
      default:
        throw new NotConfiguredError(`Unsupported monitoring provider: ${activeProvider}`);
    }
  }

  static trackEvent(eventName: string, properties?: Record<string, unknown>) {
    Logger.debug(`[Monitoring] Attempting to track event: ${eventName}`, 'Monitoring', properties);
    
    const activeProvider = env.MONITORING_PROVIDER;

    if (!activeProvider) {
      throw new NotConfiguredError('MONITORING_PROVIDER is not configured');
    }
    
    switch (activeProvider) {
      case 'SENTRY':
        return this.sentryTrackEvent();
      case 'DATADOG':
        return this.datadogTrackEvent();
      case 'NEWRELIC':
        return this.newrelicTrackEvent();
      default:
        throw new NotConfiguredError(`Unsupported monitoring provider: ${activeProvider}`);
    }
  }

  // --- Provider Adapters ---

  private static sentryLogError(): void {
    throw new Error('Provider not implemented: SENTRY');
  }

  private static datadogLogError(): void {
    throw new Error('Provider not implemented: DATADOG');
  }

  private static newrelicLogError(): void {
    throw new Error('Provider not implemented: NEWRELIC');
  }

  private static sentryTrackEvent(): void {
    throw new Error('Provider not implemented: SENTRY');
  }

  private static datadogTrackEvent(): void {
    throw new Error('Provider not implemented: DATADOG');
  }

  private static newrelicTrackEvent(): void {
    throw new Error('Provider not implemented: NEWRELIC');
  }
}
