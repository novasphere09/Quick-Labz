'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Search, MapPin, Clock, Activity, FileText, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function TrackSearchPage() {
  const [bookingId, setBookingId] = useState('');
  const router = useRouter();
  const { data: session } = useSession();
  const [recentBookings, setRecentBookings] = useState<any[]>([]);

  useEffect(() => {
    if (session?.user) {
      fetch('/api/user/bookings')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.bookings) {
            setRecentBookings(data.bookings.slice(0, 5));
          }
        })
        .catch(console.error);
    }
  }, [session]);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (bookingId.trim()) {
      router.push(`/track/${bookingId.trim()}`);
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 sm:px-6 py-12 bg-slate-50/50">
      <div className="max-w-2xl w-full space-y-8">
        
        <div className="text-center space-y-4 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-100 text-brand-600 mb-2">
            <Activity className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Track Your Booking
          </h1>
          <p className="text-slate-600 max-w-xl mx-auto">
            Enter your unique QuickLabzzz booking ID to see real-time updates on your phlebotomist arrival, sample status, and digital report.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-card border border-slate-200 animate-fade-in-up-delay-1 hover:shadow-xl transition-shadow">
          <form onSubmit={handleTrack} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="bookingId" className="block text-sm font-bold text-slate-700">
                Booking ID / Order Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  id="bookingId"
                  type="text"
                  placeholder="e.g. QLZ-2026-00001"
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 sm:text-base text-slate-900 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              variant="primary" 
              size="lg" 
              fullWidth
              disabled={!bookingId.trim()}
              className="font-bold text-base shadow-lg shadow-brand-500/30"
            >
              Track Live Status
            </Button>
          </form>

          {recentBookings.length > 0 && (
            <div className="mt-8 pt-6 border-t border-slate-100 space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Your Recent Bookings</h3>
              <div className="space-y-3">
                {recentBookings.map((b) => (
                  <div key={b.id} onClick={() => router.push(`/track/${b.bookingNumber}`)} className="flex items-center justify-between p-3 sm:p-4 rounded-xl border border-slate-200 hover:border-brand-300 hover:bg-brand-50 cursor-pointer transition-all">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{b.bookingNumber}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{b.status.replace(/_/g, ' ')}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{b.bookingItems?.[0]?.itemName || 'Health Test'} • {b.scheduledDate}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Live Collector Tracking</h3>
            <p className="text-xs text-slate-500">Know exactly when your phlebotomist will arrive.</p>
          </div>
          
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Sample Journey</h3>
            <p className="text-xs text-slate-500">Track your sample from collection to the laboratory.</p>
          </div>

          <div className="flex flex-col items-center text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Digital Report PDF</h3>
            <p className="text-xs text-slate-500">Download your smart report as soon as it's ready.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
