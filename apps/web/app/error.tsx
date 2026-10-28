'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service like Sentry
    console.error('Next.js Runtime Error Captured:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-black text-slate-900 mb-2">Something went wrong!</h2>
      <p className="text-sm text-slate-600 mb-8 max-w-md">
        We've detected an unexpected error on this page. Our engineering team has been notified.
        Please try refreshing the page or contact support if the issue persists.
      </p>
      <div className="flex gap-4">
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          leftIcon={<RefreshCcw className="w-4 h-4" />}
        >
          Refresh Page
        </Button>
        <Button
          onClick={() => reset()}
          variant="primary"
        >
          Try Again
        </Button>
      </div>
    </div>
  );
}
