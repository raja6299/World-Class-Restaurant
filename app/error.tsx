'use client';

import { useEffect } from 'react';
import { Logger } from '@/src/lib/logger';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Logger.error('Unhandled Global Exception', error, 'System');
  }, [error]);

  return (
    <div className="min-h-screen bg-aurum-charcoal-primary flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <h2 className="text-3xl font-playfair text-aurum-gold-primary font-semibold">We encountered an issue</h2>
        <p className="text-aurum-cream-secondary">
          Our system ran into an unexpected error. Don&apos;t worry, our team has been notified and is looking into it.
        </p>
        <button
          onClick={() => reset()}
          className="bg-aurum-gold-primary hover:bg-aurum-gold-secondary text-aurum-dark-navy font-medium px-8 py-3 rounded-md transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
