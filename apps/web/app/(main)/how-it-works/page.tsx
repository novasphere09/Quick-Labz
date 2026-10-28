import React from 'react';
import {
  Search,
  Building2,
  Calendar,
  Truck,
  FileCheck,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  HeartHandshake,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function HowItWorksPage() {
  const steps = [
    {
      number: '01',
      title: 'Choose Your Blood Test or Package',
      desc: 'Browse our catalog of 28+ individual pathology tests or comprehensive preventive health packages. View transparent prices, sample requirements, and fasting instructions upfront.',
      icon: Search,
    },
    {
      number: '02',
      title: 'Select Your Preferred Partner Laboratory',
      desc: 'QuickLabz lets you pick which accredited pathology laboratory processes your sample. Compare nearby laboratories, distance, turnaround times, and verified patient ratings.',
      icon: Building2,
    },
    {
      number: '03',
      title: 'Schedule Your Home Collection Slot',
      desc: 'Pick your preferred date and time slot. For fasting tests, select our early morning slots (6:00 AM - 10:00 AM). Enter patient details and your doorstep address.',
      icon: Calendar,
    },
    {
      number: '04',
      title: 'Doorstep Sample Collection by Certified Phlebotomist',
      desc: 'A certified, vaccinated phlebotomist visits your home with a sealed sterile kit. Your blood/urine sample is barcoded and safely placed into a temperature-controlled cold-chain container.',
      icon: Truck,
    },
    {
      number: '05',
      title: 'Receive Digital Report on Phone & Dashboard',
      desc: 'Once the partner laboratory completes the test and the pathologist signs off, you receive an instant alert on WhatsApp and SMS. View and download your certified PDF report anytime.',
      icon: FileCheck,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 space-y-16">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="blue" size="md">
          Transparent Patient Journey
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          How QuickLabz Works
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          We bring certified laboratory diagnostics directly to your doorstep. Simple, transparent, and completely patient-focused.
        </p>
      </div>

      {/* Steps Visual Layout */}
      <div className="space-y-6">
        {steps.map((s, idx) => {
          const StepIcon = s.icon;
          return (
            <Card key={idx} className="p-6 sm:p-8 flex flex-col md:flex-row items-start gap-6 border-slate-200 hover:border-brand-200">
              <div className="flex items-center gap-4 shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-black text-lg border border-brand-100">
                  {s.number}
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center md:hidden">
                  <StepIcon className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">{s.title}</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
                  {s.desc}
                </p>
              </div>

              <div className="hidden md:flex w-12 h-12 rounded-2xl bg-slate-50 text-brand-500 items-center justify-center shrink-0 border border-slate-100">
                <StepIcon className="w-6 h-6" />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Safety & Quality Standards Box */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-subtle space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Our Clinical Quality & Safety Commitments
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs sm:text-sm text-slate-700">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-slate-900">100% Sterile Sealed Vacutainers</strong>
              Single-use needles and tubes opened strictly in front of the patient.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-slate-900">Cold-Chain Temperature Box</strong>
              Samples are stored in gel-pack containers to preserve specimen integrity.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-slate-900">Unique Barcoded Accessioning</strong>
              Prevents sample mix-ups and enables real-time status tracking at every milestone.
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center space-y-4">
        <a href="/book">
          <Button size="lg" variant="accent" className="font-bold shadow-lg shadow-accent-500/25">
            Book Your Home Blood Test Now
          </Button>
        </a>
      </div>
    </div>
  );
}
