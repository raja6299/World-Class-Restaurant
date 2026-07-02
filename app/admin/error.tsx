'use client';

import { useEffect } from 'react';
import { Logger } from '@/src/lib/logger';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    Logger.error('Unhandled Admin Exception', error, 'System');
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 text-center">
      <div className="p-6 bg-red-950/20 border border-red-900/50 rounded-2xl max-w-md">
        <h2 className="text-2xl font-serif text-red-500 mb-2">Something went wrong</h2>
        <p className="text-zinc-400 mb-6 text-sm">{(error as Error).message}</p>
        <button
          onClick={() => reset()}
          className="px-6 py-2 bg-red-500 hover:bg-red-400 text-black font-medium rounded-lg transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
