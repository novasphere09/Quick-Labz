'use client';

import React from 'react';
import {
  Sparkles,
  CheckCircle2,
  Building2,
  MapPin,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function PackagesPage() {
  const [packages, setPackages] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let controller = new AbortController();
    let timeoutId: NodeJS.Timeout;

    async function fetchPackages() {
      try {
        setIsLoading(true);
        const city = localStorage.getItem('quicklabz_city') || 'Delhi NCR';
        const url = `/api/packages?city=${encodeURIComponent(city)}`;
        
        const res = await fetch(url, { signal: controller.signal });
        const data = await res.json();
        if (data.success) {
          setPackages(data.packages);
        }
      } catch (e: any) {
        if (e.name === 'AbortError') {
          console.error('Request timed out fetching packages data');
        } else {
          console.error('Failed to fetch packages data', e);
        }
      } finally {
        setIsLoading(false);
      }
    }

    const initFetch = () => {
      controller = new AbortController();
      timeoutId = setTimeout(() => controller.abort(), 8000);
      fetchPackages();
    };

    initFetch();

    const handleLocationChange = () => {
      clearTimeout(timeoutId);
      controller.abort();
      initFetch();
    };

    window.addEventListener('locationChanged', handleLocationChange);

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
      window.removeEventListener('locationChanged', handleLocationChange);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium">Loading health packages...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-brand-50/40 to-slate-100 pb-20 selection:bg-brand-500/30 relative overflow-hidden">
      {/* Hero Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-20 -right-20 w-96 h-96 bg-accent-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-10 relative z-10">
        {/* Header Banner */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-10 border border-slate-200/60 shadow-xl space-y-4 text-center animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand-700 text-xs font-bold uppercase tracking-wider mx-auto">
            Preventive Pathology Screening
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Curated Preventive Health Packages
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Comprehensive multi-organ health screenings tailored for preventive wellness, metabolic monitoring, and early biomarker detection. All packages include certified doorstep collection.
          </p>
        </div>

        {packages.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-[2.5rem] p-12 text-center border border-slate-200 shadow-sm animate-fade-in-up-delay-1">
            <div className="w-16 h-16 bg-brand-50 text-brand-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">No Packages Available</h2>
            <p className="text-slate-500 max-w-md mx-auto">
              We are currently updating our curated health packages for your location. Please check back later or explore our individual tests catalog.
            </p>
            <a href="/tests" className="inline-block mt-6">
              <Button variant="outline" className="font-semibold bg-white border-slate-300 hover:bg-slate-50 text-slate-700 rounded-full px-6">
                Browse Individual Tests
              </Button>
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in-up-delay-1">
            {packages.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-[2rem] border border-slate-200 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col group">
                {/* Lab Badge Header */}
                <div className="bg-slate-50 border-b border-slate-100 p-5 sm:px-8 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center shrink-0 shadow-sm">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">
                        {pkg.lab ? pkg.lab.name : 'Multiple Verified Labs'}
                      </p>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> {pkg.lab ? `${pkg.lab.area}, ${pkg.lab.city}` : 'Available in your area'}
                      </p>
                    </div>
                  </div>
                  {pkg.lab && (
                    <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full text-xs font-black border border-amber-200 shadow-sm">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {pkg.lab.rating}
                    </div>
                  )}
                </div>

                <div className="p-5 sm:p-8 flex-1 flex flex-col">
                  {/* Package Info */}
                  <div className="mb-6">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand-700 text-[10px] font-black uppercase tracking-widest mb-4 shadow-sm">
                      <Sparkles className="w-3 h-3" />
                      {pkg.isCustom ? 'Exclusive Partner Package' : 'Curated Health Package'}
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight group-hover:text-brand-600 transition-colors">{pkg.name}</h3>
                    <p className="text-sm text-slate-600 mt-3 leading-relaxed">{pkg.description}</p>
                  </div>

                  {/* Tests Included Grid */}
                  {pkg.tests && pkg.tests.length > 0 && (
                    <div className="space-y-4 mb-8 mt-auto">
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2">
                        Tests & Parameters Included ({pkg.tests.length})
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {pkg.tests.map((t: any) => (
                          <div key={t.id} className="flex items-start gap-2.5 p-3 bg-slate-50/80 rounded-xl border border-slate-100 hover:bg-slate-100 transition-colors">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span className="text-xs font-semibold text-slate-700 leading-snug">{t.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Pricing & Booking Footer */}
                <div className="bg-slate-900 text-white p-5 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-auto">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Package Price</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black">₹{pkg.sellingPrice}</span>
                      <span className="text-xs text-slate-400 font-medium line-through">₹{Math.round(pkg.sellingPrice * 1.4)}</span>
                    </div>
                  </div>
                  <a href={`/book?packageId=${pkg.id}`} className="block">
                    <Button variant="accent" size="lg" className="font-black shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:scale-105 transition-transform rounded-xl w-full sm:w-auto h-12 px-8">
                      Book Now
                    </Button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
