'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// global-error must render its own HTML and BODY tags
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Fatal Global Error Captured:', error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 px-4 text-center font-sans">
          <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
            <AlertTriangle className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-3">Critical System Error</h1>
          <p className="text-base text-slate-600 mb-8 max-w-lg">
            A fatal error has occurred that caused the application to crash. We have logged this incident and are actively investigating.
          </p>
          <Button
            size="lg"
            onClick={() => window.location.reload()}
            variant="primary"
            leftIcon={<RefreshCcw className="w-5 h-5" />}
            className="font-bold shadow-lg shadow-brand-500/30"
          >
            Reload Application
          </Button>
        </div>
      </body>
    </html>
  );
}
