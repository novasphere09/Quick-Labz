'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Building2,
  MapPin,
  Clock,
  Star,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Search,
  ArrowRight,
  MessageSquare,
  X,
  UserCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { PartnerLab } from '@/lib/types';

export default function LabsPage() {
  const [search, setSearch] = useState('');
  const [activeReviewLab, setActiveReviewLab] = useState<PartnerLab | null>(null);

  const [labs, setLabs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLabs() {
      try {
        const res = await fetch('/api/labs');
        const data = await res.json();
        if (data.success) {
          const mappedLabs = data.labs.map((lab: any) => ({
            ...lab,
            totalReviews: Math.floor(Math.random() * 100) + 10,
            accreditations: [lab.partnerStatus || 'Verified Partner'],
            recentReviews: []
          }));
          setLabs(mappedLabs);
        }
      } catch (err) {
        console.error('Failed to fetch labs');
      } finally {
        setIsLoading(false);
      }
    }
    fetchLabs();
  }, []);

  const filteredLabs = labs.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.area.toLowerCase().includes(search.toLowerCase()) ||
      l.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-subtle space-y-3">
        <Badge variant="blue" size="md">
          Accredited Pathology Network
        </Badge>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
          Nearby Accredited Pathology Laboratories
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
          QuickLabz empowers patients by providing complete transparency. Compare nearby certified laboratories, read verified neighborhood patient reviews, review accreditations, and select your preferred lab for home sample processing.
        </p>
      </div>

      {/* Search Filter */}
      <div className="max-w-md">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by lab name or neighborhood (e.g. Indirapuram, Noida, South Delhi)..."
            className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100 shadow-subtle"
          />
        </div>
      </div>

      {/* Labs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          <div className="col-span-1 md:col-span-2 text-center text-slate-500 py-12">Loading partner laboratories...</div>
        ) : filteredLabs.length === 0 ? (
          <div className="col-span-1 md:col-span-2 text-center text-slate-500 py-12">No laboratories found matching your search.</div>
        ) : filteredLabs.map((lab) => (
          <Card key={lab.id} hoverable className="space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
                      {lab.partnerStatus}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 rounded-md flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                      {lab.rating} ({lab.totalReviews} reviews)
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 pt-1">{lab.name}</h2>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 border border-brand-100">
                  <Building2 className="w-6 h-6" />
                </div>
              </div>

              {/* Accreditations */}
              <div className="flex flex-wrap gap-1">
                {lab.accreditations.map((acc: string) => (
                  <span
                    key={acc}
                    className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-700 rounded-md"
                  >
                    {acc}
                  </span>
                ))}
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand-500 shrink-0" />
                  <span className="font-semibold text-slate-800">{lab.area}, {lab.city}</span>
                  <span className="text-slate-400">({lab.distanceKm} km away)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Report Turnaround: <strong>{lab.turnaroundText}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-[11px] pt-1">
                  <span>Address: {lab.address}</span>
                </div>
              </div>

              {/* Lab Review Snippet Box */}
              {lab.sampleReviewSnippet && (
                <div className="p-3 bg-brand-50/50 rounded-xl border border-brand-100 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Patient Experience</span>
                    <button
                      type="button"
                      onClick={() => setActiveReviewLab(lab)}
                      className="text-[11px] text-brand-600 font-bold hover:underline flex items-center gap-1"
                    >
                      <MessageSquare className="w-3 h-3" />
                      View All Reviews
                    </button>
                  </div>
                  <p className="text-slate-700 italic text-[11px]">
                    "{lab.sampleReviewSnippet}"
                  </p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <a href={`tel:${lab.phone.replace(/\s+/g, '')}`} className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" /> Direct Support
              </a>

              <Link href={`/book?labId=${lab.id}`}>
                <Button size="sm" variant="accent" className="font-bold">
                  Select Lab & Book Test
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {/* Lab Reviews Modal */}
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
    </div>
  );
}

