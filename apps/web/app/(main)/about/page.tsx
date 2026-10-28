import React from 'react';
import {
  Activity,
  ShieldCheck,
  Building2,
  Users,
  Target,
  HeartHandshake,
  CheckCircle2,
  Mail,
  Phone,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 space-y-16">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="blue" size="md">
          About QuickLabz
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Democratizing Diagnostic Testing at Home
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          QuickLabz is an early-stage Indian HealthTech platform built to make pathology testing accessible, transparent, and comfortable.
        </p>
      </div>

      {/* Mission & Positioning Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        <Card className="space-y-4 p-8 border-slate-200">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Our Mission</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Diagnostic testing should not require patients—especially elderly parents, pregnant women, or busy professionals—to sit in crowded waiting rooms or navigate confusing pricing. We build technology that brings verified laboratory services directly to patient doorsteps with complete transparency.
          </p>
        </Card>

        <Card className="space-y-4 p-8 border-slate-200">
          <div className="w-12 h-12 rounded-2xl bg-accent-50 text-accent-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Our Marketplace Model</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            QuickLabz operates as a pure B2C technology platform. We partner with verified, certified independent pathology laboratories. We provide the digital booking engine, temperature-controlled doorstep phlebotomy dispatch, and secure digital report delivery, giving you total freedom of choice.
          </p>
        </Card>
      </div>

      {/* Important Transparency Statement (Section 1 & 2) */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 space-y-4">
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6 text-accent-400" />
          <h2 className="text-xl font-bold text-white">
            Important Clarity on Who We Are
          </h2>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          QuickLabz is <strong>not</strong> a diagnostic laboratory and does not perform testing itself. All laboratory tests booked through our platform are processed by independent, verified pathology partner laboratories. QuickLabz facilitates test discovery, doorstep sample collection by trained professionals, and digital report dissemination.
        </p>
      </div>

      {/* Core Principles */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 text-center">
          Our Guiding Principles
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card className="space-y-2.5">
            <h3 className="text-base font-bold text-slate-900">1. Absolute Transparency</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              No hidden collection fees, no surprise add-ons. You see the exact price, turnaround time, and laboratory before booking.
            </p>
          </Card>
          <Card className="space-y-2.5">
            <h3 className="text-base font-bold text-slate-900">2. Certified Phlebotomists</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every home collection is conducted by certified, trained collection professionals using sealed, single-use vacuum tubes.
            </p>
          </Card>
          <Card className="space-y-2.5">
            <h3 className="text-base font-bold text-slate-900">3. Data Privacy First</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Medical reports are confidential. We never sell personal information and ensure strict role-based report access.
            </p>
          </Card>
        </div>
      </div>

      {/* Direct Contact Info */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-subtle text-center space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Get in Touch with QuickLabz</h2>
        <p className="text-xs text-slate-600 max-w-md mx-auto">
          Have queries regarding a booking, partner laboratory onboarding, or clinic referrals?
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-semibold text-slate-800">
          <a href="tel:7018623940" className="flex items-center gap-2 text-brand-600 hover:underline">
            <Phone className="w-4 h-4" /> +91 7018623940
          </a>
          <a href="mailto:quicklabzofficial@gmail.com" className="flex items-center gap-2 text-brand-600 hover:underline">
            <Mail className="w-4 h-4" /> quicklabzofficial@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
}
