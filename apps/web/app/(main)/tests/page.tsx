'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  Filter,
  Clock,
  Droplets,
  AlertTriangle,
  Building2,
  CheckCircle2,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

function TestsContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCat = searchParams.get('category') || 'all';

  const [search, setSearch] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [fastingFilter, setFastingFilter] = useState<'all' | 'fasting' | 'no-fasting'>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'name'>('popular');

  const [tests, setTests] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    let controller = new AbortController();
    let timeoutId: NodeJS.Timeout;

    async function fetchData() {
      try {
        setIsLoading(true);
        const city = localStorage.getItem('quicklabz_city') || 'Delhi NCR';
        const [testsRes, catsRes] = await Promise.all([
          fetch(`/api/tests?city=${encodeURIComponent(city)}`, { signal: controller.signal }),
          fetch('/api/categories', { signal: controller.signal })
        ]);
        const testsData = await testsRes.json();
        const catsData = await catsRes.json();
        
        if (testsData.success) setTests(testsData.tests);
        if (catsData.success) setCategories(catsData.categories);
      } catch (err: any) {
        if (err.name === 'AbortError') {
          console.error('Request timed out fetching tests data');
        } else {
          console.error('Failed to fetch tests data', err);
        }
      } finally {
        setIsLoading(false);
      }
    }

    const initFetch = () => {
      controller = new AbortController();
      timeoutId = setTimeout(() => controller.abort(), 8000);
      fetchData();
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

  const filteredTests = useMemo(() => {
    return tests.filter((t) => {
      // Search matching
      const matchesSearch =
        !search?.trim() ||
        t.name?.toLowerCase().includes(search.toLowerCase()) ||
        t.description?.toLowerCase().includes(search.toLowerCase());

      // Category matching
      const matchesCategory =
        selectedCategory === 'all' ||
        t.categoryId === `cat-${selectedCategory}` ||
        t.slug.includes(selectedCategory);

      // Fasting matching
      const matchesFasting =
        fastingFilter === 'all' ||
        (fastingFilter === 'fasting' && t.fastingRequired) ||
        (fastingFilter === 'no-fasting' && !t.fastingRequired);

      return matchesSearch && matchesCategory && matchesFasting;
    }).sort((a, b) => {
      if (sortBy === 'popular') return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
      if (sortBy === 'price-low') return a.sellingPrice - b.sellingPrice;
      if (sortBy === 'price-high') return b.sellingPrice - a.sellingPrice;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [tests, search, selectedCategory, fastingFilter, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-brand-50/40 to-slate-100 pb-20 selection:bg-brand-500/30 relative overflow-hidden">
      {/* Hero Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-brand-200/30 rounded-full blur-[100px] mix-blend-multiply animate-blob"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-200/30 rounded-full blur-[80px] mix-blend-multiply animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8 relative z-10">
        {/* Header Banner */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-8 border border-slate-200/60 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 animate-fade-in-up">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand-700 text-xs font-bold uppercase tracking-wider">
              Complete Digital Pathology Catalog
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
              Pathology & Blood Tests Catalog
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              Browse accredited blood tests, verify preparation instructions, select your preferred nearby laboratory, and book doorstep sample collection.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a href="/packages">
              <Button variant="accent" size="sm" className="font-bold shadow-md shadow-accent-500/20 hover:scale-105 transition-transform">
                View Health Packages →
              </Button>
            </a>
          </div>
        </div>

        {/* Search & Category Filter Section */}
        <div className="space-y-4 animate-fade-in-up-delay-1">
          {/* Search Input and Sort bar */}
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by test name (e.g. Lipid, CBC, Thyroid, Vitamin D, HbA1C)..."
                className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 shadow-sm transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              {/* Fasting Quick Toggle */}
              <div className="flex bg-white rounded-2xl border border-slate-200 p-1 text-xs font-bold shadow-sm shrink-0">
                <button
                  onClick={() => setFastingFilter('all')}
                  className={`px-3 py-2 rounded-xl transition-all ${
                    fastingFilter === 'all'
                      ? 'bg-brand-50 text-brand-700 border border-brand-200 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All Tests
                </button>
                <button
                  onClick={() => setFastingFilter('fasting')}
                  className={`px-3 py-2 rounded-xl transition-all ${
                    fastingFilter === 'fasting'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Fasting Only
                </button>
                <button
                  onClick={() => setFastingFilter('no-fasting')}
                  className={`px-3 py-2 rounded-xl transition-all ${
                    fastingFilter === 'no-fasting'
                      ? 'bg-brand-50 text-brand-700 border border-brand-200 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  No Fasting
                </button>
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold text-slate-700 focus:outline-none focus:border-brand-500 shadow-sm cursor-pointer"
              >
                <option value="popular">Sort: Popular First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>

          {/* 12 Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                selectedCategory === 'all'
                  ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900'
              }`}
            >
              All Categories ({tests.length})
            </button>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                    isSelected
                      ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Count & Warning Alert */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600 bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-sm">
          <span>Showing <strong className="text-slate-900">{filteredTests.length}</strong> available blood & pathology tests</span>
          <span className="text-amber-700 font-medium flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            Fasting instructions must be followed as specified on individual test cards.
          </span>
        </div>

        {/* Test Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-3xl p-6 border border-slate-100 flex flex-col justify-between h-[300px]">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="h-6 bg-slate-200 rounded w-2/3"></div>
                    <div className="h-5 bg-slate-200 rounded w-16"></div>
                  </div>
                  <div className="h-4 bg-slate-200 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 rounded w-4/5"></div>
                  
                  <div className="h-24 bg-slate-100 rounded-2xl w-full mt-4"></div>
                </div>
                <div className="mt-4 flex justify-between items-end border-t border-slate-100 pt-4">
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-200 rounded w-12"></div>
                    <div className="h-6 bg-slate-200 rounded w-20"></div>
                  </div>
                  <div className="h-10 bg-slate-200 rounded-xl w-24"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredTests.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No matching tests found</h3>
            <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
              Try adjusting your search keywords or resetting the category and fasting filters.
            </p>
            <Button
              size="sm"
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold border border-slate-200 mt-2"
              onClick={() => {
                setSearch('');
                setSelectedCategory('all');
                setFastingFilter('all');
              }}
            >
              Clear All Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up-delay-2">
            {filteredTests.map((test) => (
              <div key={test.id} className="group relative bg-white border border-slate-200 hover:border-brand-500/50 rounded-3xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                      {test.name}
                    </h3>
                    {test.fastingRequired ? (
                      <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-md text-[10px] font-black uppercase tracking-wider whitespace-nowrap shadow-sm">
                        Fasting {test.fastingDurationHours}h
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-600 border border-slate-200 rounded-md text-[10px] font-black uppercase tracking-wider whitespace-nowrap shadow-sm">
                        No Fasting
                      </span>
                    )}
                  </div>
  
                  <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                    {test.description}
                  </p>
  
                  {/* Fasting Warning Note if required */}
                  {test.fastingRequired && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 flex items-start gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{test.preparationNotes}</span>
                    </div>
                  )}
  
                  <div className="p-4 bg-slate-50 rounded-2xl space-y-2 text-xs text-slate-600 border border-slate-100 shadow-inner">
                    <div className="flex items-center justify-between">
                      <span>Sample:</span>
                      <span className="font-semibold text-slate-900">{test.sampleType.split('(')[0]}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Turnaround:</span>
                      <span className="font-semibold text-slate-900">{test.turnaroundHours} Hours</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Partner Labs:</span>
                      <span className="font-bold text-emerald-600">4 Accredited Hubs</span>
                    </div>
                  </div>
                </div>
  
                {/* Price & Book Row */}
                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">Offers From</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-black text-slate-900">
                        ₹{Math.round(test.sellingPrice * 0.9)}
                      </span>
                      <span className="text-xs text-slate-500 line-through font-semibold">
                        ₹{Math.round(test.sellingPrice * 1.6)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a href={`/tests/${test.slug}`}>
                      <Button size="sm" variant="outline" className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold shadow-sm">
                        Compare
                      </Button>
                    </a>
                    <a href={`/book?testId=${test.id}`}>
                      <Button size="sm" variant="accent" className="font-bold shadow-[0_0_15px_rgba(249,115,22,0.3)] hover:scale-105 transition-transform">
                        Book
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <style dangerouslySetInnerHTML={{__html: `
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
        `}} />
      </div>
    </div>
  );
}

export default function TestsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500 text-sm">Loading test catalog...</div>}>
      <TestsContent />
    </Suspense>
  );
}
