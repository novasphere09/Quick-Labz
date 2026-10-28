'use client';

import React, { useState } from 'react';
import {
  Search,
  Activity,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  FileText,
  Home,
  Star,
  Sparkles,
  AlertCircle,
  ChevronRight,
  ChevronDown,
  Building2,
  PhoneCall,
  Check,
  Heart,
  Droplets,
  Sun,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { TestLabExplorer } from '@/components/TestLabExplorer';

export function HomePageClient({ 
  initialLabs, 
  initialTests, 
  initialPackages 
}: { 
  initialLabs: any[]; 
  initialTests: any[]; 
  initialPackages: any[]; 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  
  // Use initial server-fetched data directly
  const labs = initialLabs;
  const tests = initialTests;
  const packages = initialPackages;
  const isLoading = false;

  // Search filter matching
  const searchResults = searchQuery.trim()
    ? tests.filter(
        (t) =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description?.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  const popularTests = tests.filter((t) => t.popular).slice(0, 6);
  const fullBodyPkg = packages[0] || null;

  const faqs = [
    {
      q: 'Is QuickLabz a diagnostic laboratory?',
      a: 'No. QuickLabz is a modern digital health platform and marketplace. We partner with verified, certified independent diagnostic laboratories to provide convenient doorstep sample collection, transparent price comparisons, and digital report delivery.',
    },
    {
      q: 'How does home sample collection work?',
      a: 'When you book a test, a certified, trained phlebotomist visits your home or office with a sterile collection kit at your chosen time slot. Your barcoded sample is safely transported in a temperature-controlled container to your selected partner laboratory.',
    },
    {
      q: 'Can I choose my preferred laboratory?',
      a: 'Yes! Unlike traditional aggregators, QuickLabz lets you browse partner laboratories near your location, compare turnaround times, ratings, and choose where your sample is processed.',
    },
    {
      q: 'Do all blood tests require fasting?',
      a: 'No, only specific metabolic and lipid tests (such as Fasting Blood Sugar, Lipid Profile, LFT) require 8 to 12 hours fasting. Every test card on QuickLabz clearly specifies preparation guidelines.',
    },
    {
      q: 'How and when will I receive my report?',
      a: 'As soon as the partner laboratory validates and signs off your test results, you will receive a notification via SMS and WhatsApp. You can securely view and download your full PDF report from your QuickLabz account.',
    },
    {
      q: 'Is doorstep sample collection available everywhere?',
      a: 'We currently serve key metro zones across Delhi NCR (including Indirapuram, Vaishali, Sector 62 Noida, and South/Central Delhi) and are rapidly onboarding certified partner labs across new pin codes.',
    },
  ];

  return (
    <div className="pb-20 bg-gradient-to-br from-slate-50 via-brand-50/40 to-slate-100 min-h-screen relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-20 -right-20 w-96 h-96 bg-accent-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-1/2 w-96 h-96 bg-emerald-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Main Content Wrapper */}
      <div className="space-y-16 md:space-y-24 relative z-10">
        {/* 1. HERO SECTION */}
        <section className="relative pt-8 md:pt-16 pb-20 overflow-hidden border-b border-slate-200/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Value Proposition & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 border border-brand-100 text-brand-700 text-xs font-bold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
                <span>Transparent Pathology Marketplace • Zero Collection Fee</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Blood Tests, From the <br className="hidden lg:block" />
                <span className="text-brand-600">
                  Comfort of Home.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed animate-fade-in-up-delay-1">
                Select your test, compare real-time price offers & reviews from certified nearby pathology laboratories, and get your blood sample collected right at your doorstep.
              </p>

              {/* Instant Search Bar */}
              <div className="relative max-w-xl mx-auto lg:mx-0 pt-2 animate-fade-in-up-delay-2 z-50">
                <div className="relative flex items-center shadow-lg rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200 focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-50 transition-all hover:shadow-xl">
                  <div className="pl-4 text-slate-400">
                    <Search className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for a blood test (e.g. CBC, Vitamin D)..."
                    className="w-full py-4 pl-3 pr-28 text-sm sm:text-base text-slate-900 placeholder-slate-400 focus:outline-none rounded-2xl bg-transparent"
                  />
                  <div className="absolute right-2">
                    <a href={searchQuery ? `/tests?q=${encodeURIComponent(searchQuery)}` : '#compare-labs'}>
                      <Button size="sm" variant="accent" className="font-bold shadow-md">
                        Search
                      </Button>
                    </a>
                  </div>
                </div>

                {/* Live Search Autocomplete Results Dropdown */}
                {searchResults.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-30">
                    <p className="text-[10px] uppercase font-bold text-slate-500 px-3 py-1.5">
                      Matching Blood Tests
                    </p>
                    <div className="space-y-1">
                      {searchResults.map((t) => (
                         <a
                         key={t.id}
                         href={`/tests/${t.slug}`}
                         className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-left transition-colors group"
                       >
                         <div>
                           <p className="text-sm font-bold text-slate-900 group-hover:text-brand-600">
                             {t.name}
                           </p>
                           <p className="text-xs text-slate-500 line-clamp-1">
                             {t.description}
                           </p>
                         </div>
                         <div className="text-right shrink-0 ml-3">
                           <span className="text-sm font-extrabold text-slate-900">
                             ₹{t.sellingPrice}
                           </span>
                           <span className="block text-[10px] text-brand-600 font-semibold">
                             Compare Labs →
                           </span>
                         </div>
                       </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular Quick Search Pills */}
                <div className="flex flex-wrap items-center gap-2 pt-4 text-xs">
                  <span className="font-semibold text-slate-500">Popular:</span>
                  {['CBC', 'Vitamin D', 'HbA1C', 'TSH', 'Lipid Profile'].map((term) => (
                    <button
                      key={term}
                      onClick={() => setSearchQuery(term)}
                      className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 justify-center lg:justify-start animate-fade-in-up-delay-3">
                <a href="#compare-labs" className="w-full sm:w-auto relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-brand-600 to-accent-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                  <Button
                    size="lg"
                    variant="accent"
                    fullWidth
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    className="relative font-bold shadow-lg shadow-accent-500/30 h-12 px-6 rounded-xl hover:scale-105 transition-transform"
                  >
                    Select Test & Compare Labs
                  </Button>
                </a>
                <a href="/tests" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" fullWidth className="h-12 px-6 rounded-xl bg-white">
                    Explore Catalog
                  </Button>
                </a>
              </div>

            </div>

            {/* Right Column: Hero Visual Showcase */}
            <div className="lg:col-span-5 relative hidden lg:block animate-fade-in-up-delay-2">
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-100 to-emerald-50 rounded-[3rem] transform rotate-2 scale-105 animate-pulse-slow"></div>
              <div className="relative mx-auto max-w-md bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-slate-100/50">
                {/* Floating Notification Card */}
                <div className="absolute -top-6 -left-8 bg-white rounded-2xl p-4 shadow-xl border border-slate-100 flex items-center gap-3 animate-float z-20">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Doorstep Collection Confirmed</p>
                    <p className="text-[11px] text-slate-500">Phlebotomist arriving at 7:30 AM</p>
                  </div>
                </div>

                {/* Smartphone Style Interactive Patient Journey Mock */}
                <div className="space-y-5">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-500 to-brand-600 p-0.5">
                         <div className="w-full h-full bg-white rounded-full flex items-center justify-center font-black text-xs text-brand-600">
                           QL
                         </div>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">QuickLabz Marketplace</p>
                        <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          4 CERTIFIED LABS NEARBY
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <p className="text-[9px] font-bold text-brand-600 uppercase tracking-wider mb-1">1. Selected Test</p>
                      <div className="flex justify-between items-center">
                        <p className="font-bold text-slate-900 text-sm">Lipid Profile</p>
                        <p className="text-xs font-bold text-emerald-600">from ₹399</p>
                      </div>
                    </div>

                    <div className="bg-brand-50 rounded-xl p-4 border border-brand-100 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-brand-100 rounded-bl-full -z-0"></div>
                      <p className="text-[9px] font-bold text-brand-600 uppercase tracking-wider mb-1 relative z-10">2. Compared & Picked Lab</p>
                      <div className="flex justify-between items-center relative z-10">
                        <div>
                          <p className="font-bold text-slate-900 text-sm">Apex Diagnostic Care</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">2.1 km away • NABL • Report in 12h</p>
                        </div>
                        <div className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md text-[10px] font-black">
                          ★ 4.9
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <p className="text-[9px] font-bold text-brand-600 uppercase tracking-wider mb-1">3. Doorstep Collection</p>
                      <p className="font-bold text-slate-900 text-sm">Certified Phlebotomist • Sterile Kit</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Digital PDF report on WhatsApp & Portal</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CORE INTERACTIVE TEST & LAB OFFERS MARKETPLACE EXPLORER */}
      <section id="compare-labs" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24 relative z-20">
        {/* Stats Strip */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 mb-12 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-6 divide-x divide-slate-100 transition-all duration-500 hover:shadow-2xl">
            <div className="text-center group cursor-default">
              <p className="text-3xl font-black text-slate-900 transition-transform duration-300 group-hover:scale-110 group-hover:text-brand-600">500+</p>
              <p className="text-xs text-slate-500 font-semibold mt-1">Certified Labs</p>
            </div>
            <div className="text-center group cursor-default">
              <p className="text-3xl font-black text-slate-900 transition-transform duration-300 group-hover:scale-110 group-hover:text-brand-600">10k+</p>
              <p className="text-xs text-slate-500 font-semibold mt-1">Tests Done</p>
            </div>
            <div className="text-center hidden md:block group cursor-default">
              <p className="text-3xl font-black text-slate-900 transition-transform duration-300 group-hover:scale-110 group-hover:text-brand-600">100%</p>
              <p className="text-xs text-slate-500 font-semibold mt-1">Accurate Reports</p>
            </div>
            <div className="text-center hidden md:block group cursor-default">
              <p className="text-3xl font-black text-slate-900 transition-transform duration-300 group-hover:scale-110 group-hover:text-brand-600">30 Min</p>
              <p className="text-xs text-slate-500 font-semibold mt-1">Quick Collection</p>
            </div>
          </div>
        </div>

        <TestLabExplorer />
      </section>

      {/* 2. POPULAR BLOOD TESTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand-700 text-xs font-bold mb-4">
              Most Booked Tests
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Popular Blood Tests
            </h2>
            <p className="text-slate-600 mt-2 max-w-2xl text-lg">
              Sample collected from home by certified professionals and processed by verified partner labs.
            </p>
          </div>
          <a href="/tests" className="shrink-0 text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 bg-white hover:bg-slate-50 px-4 py-2 rounded-xl transition-colors border border-slate-200 shadow-sm">
            Browse All 28+ Tests <ChevronRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularTests.map((test) => (
            <div key={test.id} className="group relative bg-white border border-slate-200 hover:border-brand-500/50 rounded-3xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                    {test.name}
                  </h3>
                  {test.fastingRequired ? (
                    <span className="px-2 py-1 bg-orange-50 text-orange-600 border border-orange-100 rounded-md text-[10px] font-black uppercase tracking-wider whitespace-nowrap">
                      Fasting {test.fastingDurationHours}h
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 border border-slate-200 rounded-md text-[10px] font-black uppercase tracking-wider whitespace-nowrap">
                      No Fasting
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                  {test.description}
                </p>

                <div className="p-4 bg-slate-50 rounded-2xl space-y-2 text-xs text-slate-600 border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span>Sample:</span>
                    <span className="font-semibold text-slate-900">{test.sampleType.split('(')[0]}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Report Time:</span>
                    <span className="font-semibold text-slate-900">{test.turnaroundHours} Hours</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Starting From</span>
                  <span className="text-2xl font-black text-slate-900">
                    ₹{test.sellingPrice}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <a href={`/tests/${test.slug}`}>
                    <Button size="sm" variant="outline" className="bg-white hover:bg-slate-50 text-slate-700 font-semibold border-slate-200">
                      Details
                    </Button>
                  </a>
                  <a href={`/book?testId=${test.id}`}>
                    <Button size="sm" variant="accent" className="font-bold shadow-md">
                      Book Now
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FULL BODY HEALTH PACKAGE BANNER */}
      {(isLoading || fullBodyPkg) && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="relative overflow-hidden bg-gradient-to-r from-brand-600 to-brand-700 rounded-[3rem] p-8 sm:p-14 text-white shadow-xl">
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] pointer-events-none -mr-48 -mt-48"></div>
             
            {isLoading ? (
              <div className="relative z-10 py-10 text-center text-brand-100">
                Loading recommended package...
              </div>
            ) : fullBodyPkg ? (
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-8 space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 border border-white/20 text-white text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    <span>Premier Preventive Screening</span>
                  </div>

                  <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                    {fullBodyPkg.name}
                  </h2>

                  <p className="text-lg text-brand-100 max-w-2xl leading-relaxed">
                    {fullBodyPkg.description || `Comprehensive 75+ parameter full-body screening including CBC, ESR, FBS, Liver (LFT), Kidney (RFT), Lipid Profile, Calcium, CRP, Thyroid (TFT), Electrolytes, Iron, Vitamin D3, Vitamin B12, and HbA1C.`}
                  </p>

                  <div className="flex flex-wrap gap-3 pt-2 text-sm">
                    {['Comprehensive Tests', 'Fasting Required', 'Free Home Collection', 'Same-Day Report'].map((item) => (
                      <span key={item} className="px-3 py-1.5 rounded-xl bg-white/10 text-white border border-white/20 font-medium backdrop-blur-sm">
                        ✓ {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-4 bg-white rounded-[2rem] p-8 text-slate-900 text-center space-y-6 shadow-2xl border border-slate-100">
                  <div>
                    <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Special Package Price</span>
                    <div className="text-5xl font-black text-slate-900 mt-2 mb-1">
                      ₹{fullBodyPkg.sellingPrice}
                    </div>
                    <span className="text-xs text-emerald-600 font-bold">Includes All Laboratory & Doorstep Fees</span>
                  </div>

                  <a href={`/book?packageId=${fullBodyPkg.id}`} className="block">
                    <Button size="lg" variant="accent" fullWidth className="h-14 font-black text-lg shadow-lg hover:scale-105 transition-transform rounded-xl">
                      Book Full Body Package
                    </Button>
                  </a>

                  <p className="text-[11px] text-slate-500 font-medium">
                    10-12 hours overnight fasting recommended
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </section>
      )}

      {/* 4. WHY QUICKLABZ? */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand-700 text-xs font-bold mb-2">
            Marketplace Advantages
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Why Patients Choose QuickLabz
          </h2>
          <p className="text-lg text-slate-600">
            We simplify pathology testing through verified local laboratory partnerships and certified doorstep phlebotomy.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Home Sample Collection',
              desc: 'Trained, certified phlebotomists visit your home or office with temperature-controlled sterile equipment.',
              icon: Home,
              color: 'text-brand-600 bg-brand-50 border-brand-100',
            },
            {
              title: 'Nearby Partner Labs',
              desc: 'Select from accredited and verified pathology laboratories in your neighborhood. You choose where your sample goes.',
              icon: Building2,
              color: 'text-accent-600 bg-accent-50 border-accent-100',
            },
            {
              title: 'Transparent Pricing',
              desc: 'No hidden laboratory charges or surprise add-ons. Clear, competitive test pricing displayed upfront.',
              icon: ShieldCheck,
              color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
            },
            {
              title: 'Fast Digital Reports',
              desc: 'Receive your pathologist-verified digital report directly on your phone and download printable PDF anytime.',
              icon: FileText,
              color: 'text-purple-600 bg-purple-50 border-purple-100',
            },
            {
              title: 'Convenient Slot Booking',
              desc: 'Pick your preferred morning fasting slot (6:00 AM - 10:00 AM) or flexible non-fasting afternoon slots.',
              icon: Clock,
              color: 'text-blue-600 bg-blue-50 border-blue-100',
            },
            {
              title: 'No Unnecessary Lab Visits',
              desc: 'Avoid traffic, parking hassles, and crowded clinic waiting rooms. Complete your diagnostic test safely from home.',
              icon: Heart,
              color: 'text-rose-600 bg-rose-50 border-rose-100',
            },
          ].map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div key={idx} className="bg-white border border-slate-200 rounded-3xl p-8 hover:border-brand-500/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border mb-6 group-hover:scale-110 transition-transform ${item.color}`}>
                  <IconComp className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. VERIFIED PARTNER LABORATORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand-700 text-xs font-bold mb-4">
              Accredited Pathology Network
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Verified Partner Laboratories
            </h2>
          </div>
          <a href="/labs" className="shrink-0 text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 bg-white hover:bg-slate-50 px-4 py-2 rounded-xl transition-colors border border-slate-200 shadow-sm">
            View All Partner Labs <ChevronRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {labs.length === 0 ? (
            <div className="col-span-1 md:col-span-2 lg:col-span-4 text-center text-slate-500 py-6">
              More partner laboratories are joining soon...
            </div>
          ) : (
            labs.slice(0, 4).map((lab) => (
              <div key={lab.id} className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col justify-between hover:border-brand-500/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md">
                      {lab.partnerStatus || 'Verified Partner'}
                    </span>
                    <div className="flex items-center gap-1 text-amber-700 text-xs font-bold bg-amber-50 px-2 py-1 rounded-md border border-amber-100">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{lab.rating || 4.8}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{lab.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-brand-600 mt-1.5 font-medium">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span className="truncate">{lab.area}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl space-y-2 text-xs text-slate-600 border border-slate-100">
                    <div className="flex items-center justify-between">
                      <span>Turnaround:</span>
                      <span className="font-semibold text-slate-900">{lab.turnaroundText || '24 Hours'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Collection:</span>
                      <span className="font-semibold text-emerald-600">Home Visit Active</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100">
                  <a href={`/book?labId=${lab.id}`} className="block">
                    <Button size="sm" fullWidth variant="outline" className="bg-white hover:bg-slate-50 text-slate-700 font-semibold border-slate-200 rounded-lg h-10">
                      Select for Booking
                    </Button>
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 6. FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand-700 text-xs font-bold">
            Patient Support & FAQs
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all shadow-sm hover:border-brand-300"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left font-bold text-base text-slate-900 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-brand-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Custom Keyframes for Animations */}
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
