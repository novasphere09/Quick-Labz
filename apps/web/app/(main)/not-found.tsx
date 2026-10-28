import Link from 'next/link';
import Image from 'next/image';
import { Search, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-brand-500/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="text-center relative z-10 max-w-lg mx-auto">
        <Link href="/" className="inline-flex items-center justify-center mb-8">
          <Image 
            src="/logo.png" 
            alt="QuickLabz Logo" 
            width={180}
            height={68}
            className="h-16 w-auto object-contain drop-shadow-sm" 
          />
        </Link>
        
        <h1 className="text-[8rem] sm:text-[10rem] font-black text-slate-200 leading-none select-none">
          404
        </h1>
        
        <div className="-mt-12 sm:-mt-16 mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent z-0"></div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display relative z-10">
            Page Not Found
          </h2>
        </div>

        <p className="text-base text-slate-600 mb-10">
          Oops! It seems the page you're looking for doesn't exist, has been moved, or is temporarily unavailable. Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/">
            <Button 
              variant="primary" 
              size="lg" 
              className="font-bold shadow-lg shadow-brand-500/25 w-full sm:w-auto"
              leftIcon={<Home className="w-5 h-5" />}
            >
              Back to Home
            </Button>
          </Link>
          <Link href="/">
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto bg-white"
              leftIcon={<Search className="w-5 h-5" />}
            >
              Search Tests
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
