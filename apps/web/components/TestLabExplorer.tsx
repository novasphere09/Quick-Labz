'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Building2,
  MapPin,
  Clock,
  Star,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  AlertTriangle,
  Sparkles,
  Droplets,
  Tag,
  SlidersHorizontal,
  ChevronRight,
  UserCheck,
  MessageSquare,
  X,
  Award,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { LabTestOffer, PartnerLab } from '@/lib/types';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AuthModal } from '@/components/AuthModal';

interface TestLabExplorerProps {
  initialTestId?: string;
  className?: string;
}

export const TestLabExplorer: React.FC<TestLabExplorerProps> = ({
  initialTestId = 'test-lipid-profile',
  className = '',
}) => {
  const [selectedTestId, setSelectedTestId] = useState<string>(initialTestId);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recommended' | 'price' | 'distance' | 'rating' | 'speed'>('recommended');
  const [activeReviewLab, setActiveReviewLab] = useState<PartnerLab | null>(null);

  const { data: session } = useSession();
  const router = useRouter();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [pendingBooking, setPendingBooking] = useState<{ testId: string; labId: string } | null>(null);

  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);
  const [dbLabs, setDbLabs] = useState<PartnerLab[]>([]);
  const [isLoadingLabs, setIsLoadingLabs] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  
  const [allTests, setAllTests] = useState<any[]>([]);

  React.useEffect(() => {
    async function fetchTests() {
      try {
        const res = await fetch('/api/tests');
        const data = await res.json();
        if (data.success && data.tests.length > 0) {
          setAllTests(data.tests);
        }
      } catch (err) {
        console.error('Failed to fetch tests catalog', err);
      }
    }
    fetchTests();
  }, []);

  const handleAutoDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await res.json();
        
        if (data && data.address) {
          const city = data.address.city || data.address.town || data.address.village || data.address.county || '';
          const area = data.address.suburb || data.address.neighbourhood || data.address.residential || '';
          
          setSelectedCity(city);
          setSelectedArea(area);
          setUserLat(latitude);
          setUserLng(longitude);
        }
      } catch (err) {
        console.error("Failed to detect location", err);
        alert("Failed to auto-detect location. Please enter manually.");
      } finally {
        setIsLocating(false);
      }
    }, (error) => {
      console.error("Geolocation error", error);
      alert("Failed to get your location. Please check your permissions.");
      setIsLocating(false);
    });
  };

  // Active selected test
  const activeTest = useMemo(() => {
    if (allTests.length === 0) return null;
    return allTests.find((t) => t.id === selectedTestId) || allTests[0];
  }, [selectedTestId, allTests]);

  // Filtered test catalog for the search / pills
  const matchedTests = useMemo(() => {
    if (!searchQuery.trim()) return allTests.slice(0, 8);
    return allTests.filter(
      (t) =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allTests]);

  // Fetch dynamic labs from API with Graceful Degradation / Fault Tolerance
  React.useEffect(() => {
    async function fetchLabs() {
      if (!activeTest) return;
      setIsLoadingLabs(true);
      try {
        let url = `/api/labs?testId=${activeTest.id}`;
        if (selectedCity) url += `&city=${encodeURIComponent(selectedCity)}`;
        if (selectedArea) url += `&area=${encodeURIComponent(selectedArea)}`;
        if (userLat !== null) url += `&lat=${userLat}`;
        if (userLng !== null) url += `&lng=${userLng}`;
        
        // Timeout handling for fault tolerance
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!res.ok) {
          throw new Error(`API returned status: ${res.status}`);
        }

        const data = await res.json();
        if (data.success) {
          setDbLabs(data.labs);
        } else {
          throw new Error('API reported failure');
        }
      } catch (err) {
        console.warn('⚠️ [Fault Tolerance] Failed to fetch dynamic labs.', err);
        // We've removed the fallback to STATIC_LABS here so that you only see YOUR real database labs!
        setDbLabs([]);
      } finally {
        setIsLoadingLabs(false);
      }
    }
    fetchLabs();
  }, [activeTest?.id, selectedCity, selectedArea, userLat, userLng]);

  // Dynamic lab offers for the currently selected test based on API data
  const rawOffers = useMemo(() => {
    if (!activeTest) return [];
    const basePrice = activeTest.sellingPrice;
    
    const offers = dbLabs.map(lab => {
      const labTestInfo = (lab as any).labTests && (lab as any).labTests.length > 0 ? (lab as any).labTests[0] : null;
      const offerPrice = labTestInfo?.calculatedSellingPrice || basePrice;
      const mrp = Math.round(offerPrice * 1.6); // Simple 60% markup for MRP display
      
      const tatOffset = lab.slug?.includes('metro') ? 4 : lab.slug?.includes('city') ? -2 : 0;
      const discountPercent = Math.round(((mrp - offerPrice) / mrp) * 100);
      const tatHours = Math.max(6, (activeTest.turnaroundHours || 18) + tatOffset);

      return {
        labId: lab.id,
        lab,
        testId: activeTest.id,
        testName: activeTest.name,
        offerPrice,
        mrp,
        discountPercent,
        distanceKm: lab.distanceKm,
        turnaroundText: `${tatHours} Hours`,
        turnaroundHours: tatHours,
        rating: lab.rating,
        totalReviews: lab.totalReviews,
        accreditations: lab.accreditations || [],
        sampleReviewSnippet: lab.sampleReviewSnippet,
      } as LabTestOffer;
    });

    if (offers.length === 0) return [];

    const minPrice = Math.min(...offers.map((o) => o.offerPrice));
    const minDistance = Math.min(...offers.map((o) => o.distanceKm));
    const maxRating = Math.max(...offers.map((o) => o.rating));
    const minTat = Math.min(...offers.map((o) => o.turnaroundHours));

    return offers.map((o) => ({
      ...o,
      isBestPrice: o.offerPrice === minPrice,
      isNearest: o.distanceKm === minDistance,
      isTopRated: o.rating === maxRating,
      isFastest: o.turnaroundHours === minTat,
    }));
  }, [dbLabs, activeTest]);

  // Sorted lab offers
  const sortedOffers = useMemo(() => {
    const list = [...rawOffers];
    if (sortBy === 'price') {
      return list.sort((a, b) => a.offerPrice - b.offerPrice);
    }
    if (sortBy === 'distance') {
      return list.sort((a, b) => a.distanceKm - b.distanceKm);
    }
    if (sortBy === 'rating') {
      return list.sort((a, b) => b.rating - a.rating);
    }
    if (sortBy === 'speed') {
      return list.sort((a, b) => a.turnaroundHours - b.turnaroundHours);
    }
    // Default: Recommended (combination of distance & rating)
    return list.sort((a, b) => (b.isBestPrice ? 1 : 0) - (a.isBestPrice ? 1 : 0));
  }, [rawOffers, sortBy]);

  const handleBookWithLab = (testId: string, labId: string) => {
    if (!session) {
      setPendingBooking({ testId, labId });
      setAuthModalOpen(true);
    } else {
      router.push(`/book?testId=${testId}&labId=${labId}`);
    }
  };

  return (
    <div className={"space-y-6 " + className}>
      {/* 1. TOP TITLE & TEST SELECTOR HEADER */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-brand-500" />
              <span>Transparent Diagnostics Marketplace</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Select a Test & Compare Nearby Lab Offers
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Pick any diagnostic test below to see real-time price offers, lab ratings, accreditations, and doorstep turnaround times from accredited laboratories near you.
            </p>
          </div>

          {/* Quick Search input for tests */}
          <div className="relative w-full lg:w-80 shrink-0">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search test (e.g. CBC, Vitamin D)..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-8 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Popular / Searched Test Selector Pills */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            {searchQuery ? `Matching Tests (${matchedTests.length})` : 'Popular Blood Tests (Click to Compare Labs):'}
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {matchedTests.map((t) => {
              const isSelected = t.id === activeTest.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedTestId(t.id)}
                  type="button"
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                    isSelected
                      ? 'bg-brand-500 text-white border-brand-500 shadow-md shadow-brand-500/25 scale-[1.02]'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-white hover:border-brand-300'
                  }`}
                >
                  <Droplets className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-brand-500'}`} />
                  <span>{t.name.split('(')[0].trim()}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-md font-extrabold ${
                      isSelected ? 'bg-brand-600 text-white' : 'bg-slate-200/80 text-slate-800'
                    }`}
                  >
                    from ₹{Math.round(t.sellingPrice * 0.9)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Test Information Banner */}
        {activeTest && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-50/80 via-white to-brand-50/50 border border-brand-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm sm:text-base font-extrabold text-slate-900">
                {activeTest.name}
              </span>
              {activeTest.fastingRequired ? (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                  Fasting {activeTest.fastingDurationHours}h Required
                </span>
              ) : (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
                  No Fasting Required
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
              {activeTest.description}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href={`/tests/${activeTest.slug}`}
              className="text-xs font-bold text-brand-600 hover:text-brand-700 underline underline-offset-4"
            >
              Test Specs & Prep Guide →
            </Link>
          </div>
        </div>
        )}

        {/* Location Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-4 border-t border-slate-100 mt-6">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your Location:</span>
          
          <input
            type="text"
            placeholder="City (e.g. Ghaziabad)"
            value={selectedCity}
            onChange={e => setSelectedCity(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-1.5 text-sm outline-none focus:border-brand-500"
          />
          <input
            type="text"
            placeholder="Area (e.g. Indirapuram)"
            value={selectedArea}
            onChange={e => setSelectedArea(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-1.5 text-sm outline-none focus:border-brand-500"
          />
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleAutoDetectLocation}
            disabled={isLocating}
            className="text-xs font-semibold"
          >
            <MapPin className="w-3.5 h-3.5 mr-1" />
            {isLocating ? 'Locating...' : 'Auto-detect'}
          </Button>
          {(selectedCity || selectedArea || userLat !== null) && (
             <Button 
               size="sm" 
               variant="ghost" 
               onClick={() => { setSelectedCity(''); setSelectedArea(''); setUserLat(null); setUserLng(null); }} 
               className="text-xs text-red-500 font-semibold"
             >
               Clear Filters
             </Button>
          )}
        </div>
      </div>

      {/* 2. LAB OFFERS SECTION WITH SORTING TABS */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900">
              Accredited Laboratories Offering This Test ({sortedOffers.length})
            </h3>
            <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
              Free Home Collection
            </span>
          </div>

          {/* Sort Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm shrink-0">
            <span className="text-[11px] font-bold text-slate-400 px-2 hidden sm:inline">Sort:</span>
            {[
              { key: 'recommended', label: 'Best Match' },
              { key: 'price', label: 'Cheapest First' },
              { key: 'distance', label: 'Nearest Lab' },
              { key: 'rating', label: 'Highest Rated' },
              { key: 'speed', label: 'Fastest TAT' },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setSortBy(tab.key as any)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                  sortBy === tab.key
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. LAB OFFER CARDS GRID */}
        {isLoadingLabs ? (
          <div className="py-12 text-center text-slate-500">Finding labs matching your criteria...</div>
        ) : sortedOffers.length === 0 ? (
          <div className="py-16 px-4 text-center bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center space-y-4">
            <div className="w-20 h-20 bg-brand-50 text-brand-300 rounded-full flex items-center justify-center mb-2 animate-pulse">
              <Search className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No Laboratories Found</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              We couldn't find any accredited laboratories offering the <span className="font-semibold text-slate-700">{activeTest?.name}</span> in your currently selected location.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button variant="outline" onClick={() => { setSelectedCity(''); setSelectedArea(''); setUserLat(null); setUserLng(null); }}>
                Clear Location Filters
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {sortedOffers.map((offer) => {
            const lab = offer.lab;
            return (
              <div
                key={offer.labId}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 hover:border-brand-400 hover:shadow-hover transition-all flex flex-col justify-between space-y-4 group relative overflow-hidden"
              >
                {/* Highlights Ribbon */}
                {offer.isBestPrice && (
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-emerald-600 to-emerald-500 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-bl-xl shadow-sm tracking-wider">
                    Best Price Offer
                  </div>
                )}
                {offer.isFastest && !offer.isBestPrice && (
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-blue-600 to-blue-500 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-bl-xl shadow-sm tracking-wider">
                    Fastest Report
                  </div>
                )}
                {offer.isTopRated && !offer.isBestPrice && !offer.isFastest && (
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-600 to-amber-500 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-bl-xl shadow-sm tracking-wider">
                    Highest Rated
                  </div>
                )}

                <div className="space-y-3">
                  {/* Lab Header */}
                  <div className="flex items-start gap-3.5 pr-14">
                    <div className="w-11 h-11 rounded-2xl bg-brand-50 border border-brand-100 text-brand-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Building2 className="w-5 h-5" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <h4 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                          {lab.name}
                        </h4>
                      </div>

                      {/* Accreditations */}
                      <div className="flex flex-wrap items-center gap-1">
                        {lab.accreditations.map((acc) => (
                          <span
                            key={acc}
                            className="px-1.5 py-0.2 text-[9px] font-extrabold rounded bg-slate-100 text-slate-700 border border-slate-200"
                          >
                            {acc}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Location, Distance & Turnaround Badges */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
                    <div className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-xl">
                      <MapPin className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                      <div className="truncate">
                        <span className="font-semibold text-slate-800 block truncate">{lab.area}</span>
                        <span className="text-[10px] text-slate-500">{offer.distanceKm} km from you</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-xl">
                      <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <div>
                        <span className="font-semibold text-slate-800 block">Report TAT</span>
                        <span className="text-[10px] text-brand-600 font-bold">{offer.turnaroundText}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating & Patient Review Quote */}
                  <div className="p-3 bg-brand-50/40 rounded-2xl border border-brand-100/60 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <div className="flex text-amber-400">
                          {'★'.repeat(5)}
                        </div>
                        <span className="text-xs font-black text-slate-800">{lab.rating}</span>
                        <span className="text-[11px] text-slate-500">({offer.totalReviews} reviews)</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveReviewLab(lab)}
                        className="text-[11px] font-bold text-brand-600 hover:text-brand-800 flex items-center gap-0.5"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>View Reviews</span>
                      </button>
                    </div>

                    {offer.sampleReviewSnippet && (
                      <p className="text-[11px] text-slate-600 italic line-clamp-2">
                        "{offer.sampleReviewSnippet}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Lab Facility Photos */}
                {(lab.frontImageUrl || lab.insideImageUrl || lab.equipmentImageUrl) && (
                  <div className="flex gap-2 overflow-x-auto pb-1 mt-1 snap-x">
                    {lab.frontImageUrl && (
                      <div className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl border border-slate-200 overflow-hidden relative group/img snap-start bg-slate-100">
                        <img src={lab.frontImageUrl} alt="Front" className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-300" />
                        <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[8px] font-bold text-center py-0.5 opacity-0 group-hover/img:opacity-100 transition-opacity">Front</div>
                      </div>
                    )}
                    {lab.insideImageUrl && (
                      <div className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl border border-slate-200 overflow-hidden relative group/img snap-start bg-slate-100">
                        <img src={lab.insideImageUrl} alt="Reception" className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-300" />
                        <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[8px] font-bold text-center py-0.5 opacity-0 group-hover/img:opacity-100 transition-opacity">Inside</div>
                      </div>
                    )}
                    {lab.equipmentImageUrl && (
                      <div className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl border border-slate-200 overflow-hidden relative group/img snap-start bg-slate-100">
                        <img src={lab.equipmentImageUrl} alt="Equipment" className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-300" />
                        <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[8px] font-bold text-center py-0.5 opacity-0 group-hover/img:opacity-100 transition-opacity">Equipment</div>
                      </div>
                    )}
                  </div>
                )}

                {/* Pricing & Booking Row */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-black text-slate-900">
                        ₹{offer.offerPrice}
                      </span>
                      <span className="text-xs text-slate-400 line-through">
                        ₹{offer.mrp}
                      </span>
                      <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                        {offer.discountPercent}% OFF
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-600 font-semibold block">
                      ✓ Free Doorstep Phlebotomy
                    </span>
                  </div>

                  <Button
                    variant="accent"
                    size="sm"
                    className="font-bold shadow-md shadow-accent-500/20 text-xs px-4"
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    onClick={() => handleBookWithLab(activeTest?.id, lab.id)}
                  >
                    Book with this Lab
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        )}
      </div>

      {/* 4. LAB REVIEWS MODAL */}
      {activeReviewLab && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-150 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full">
                  ★ {activeReviewLab.rating} • {activeReviewLab.totalReviews} Verified Patient Ratings
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{activeReviewLab.name}</h3>
                <p className="text-xs text-slate-500">{activeReviewLab.area}, {activeReviewLab.city}</p>
              </div>
              <button
                onClick={() => setActiveReviewLab(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Recent Patient Reviews
              </h4>

              {activeReviewLab.recentReviews.map((rev) => (
                <div key={rev.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-800">{rev.author}</span>
                      {rev.verified && (
                        <span className="flex items-center gap-0.5 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded">
                          <UserCheck className="w-2.5 h-2.5" /> Verified Patient
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400">{rev.date}</span>
                  </div>

                  <div className="flex text-amber-400 text-xs">
                    {'★'.repeat(Math.round(rev.rating))}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    "{rev.comment}"
                  </p>

                  {rev.locality && (
                    <span className="text-[10px] text-slate-400 block pt-0.5">
                      Location: {rev.locality}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                fullWidth
                onClick={() => setActiveReviewLab(null)}
              >
                Close Reviews
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 5. AUTH MODAL */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => { setAuthModalOpen(false); setPendingBooking(null); }}
        onSuccess={() => {
          setAuthModalOpen(false);
          router.refresh();
          if (pendingBooking) {
            router.push(`/book?testId=${pendingBooking.testId}&labId=${pendingBooking.labId}`);
          }
        }}
        title="Log in to Book"
        subtitle="Please log in or create a quick account to secure your booking with this laboratory."
      />
    </div>
  );
};
