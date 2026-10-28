import React from 'react';
import { 
  Truck, 
  Banknote, 
  Clock, 
  MapPin, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function DriveWithUsPage() {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="pt-16 pb-12 bg-gradient-to-br from-brand-500 via-brand-600 to-brand-800 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 opacity-10 pointer-events-none">
          <Truck className="w-96 h-96" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 border border-white/30 text-white text-xs font-bold uppercase tracking-wider">
              Earn on Your Schedule
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
              Join the QuickLabz Phlebotomy Fleet.
            </h1>
            <p className="text-lg text-brand-100 leading-relaxed">
              Earn up to ₹35,000/month by collecting blood samples from patients' homes and dropping them at partner labs. Flexible hours, daily payouts, and full training provided.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <a href="/collector-register">
                <Button size="lg" variant="accent" className="font-bold text-lg shadow-xl shadow-accent-500/20 bg-slate-900 hover:bg-slate-800 border-none text-white">
                  Apply as Delivery Partner <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Why Drive with Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <h2 className="text-3xl font-extrabold text-slate-900">Why Drive with QuickLabz?</h2>
          <p className="text-slate-600">
            A reliable source of income with the respect of the healthcare industry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-8 border-slate-200 shadow-hover transition-all space-y-4 text-center">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto text-emerald-600">
              <Banknote className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Great Earnings</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Earn a fixed fee per successful collection, plus distance bonuses. The more you collect, the more you earn. Top partners make ₹35,000+ monthly.
            </p>
          </Card>
          
          <Card className="p-8 border-slate-200 shadow-hover transition-all space-y-4 text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto text-blue-600">
              <Clock className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Flexible Schedule</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Log in to the Collector App when you want to work. Choose morning fasting shifts (6AM-10AM) or afternoon shifts based on your availability.
            </p>
          </Card>

          <Card className="p-8 border-slate-200 shadow-hover transition-all space-y-4 text-center">
            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto text-amber-600">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Safety & Support</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              We provide you with sterile collection kits, temperature-controlled bags, PPE, and 24/7 on-call doctor support for difficult draws.
            </p>
          </Card>
        </div>
      </section>

      {/* Requirements */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-900 mb-6">Requirements to Join</h2>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-brand-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-slate-900">Phlebotomy Certification</h4>
                      <p className="text-sm text-slate-600">DMLT, BMLT, or a valid Phlebotomy certificate with at least 6 months of active venipuncture experience.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-brand-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-slate-900">Two-Wheeler & License</h4>
                      <p className="text-sm text-slate-600">You need a valid driving license and a bike/scooter to navigate the city quickly.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-brand-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-slate-900">Smartphone</h4>
                      <p className="text-sm text-slate-600">An Android or iOS smartphone to use the QuickLabz Collector App for live routing and status updates.</p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col justify-center items-center text-center bg-slate-50 rounded-2xl p-8 border border-slate-100">
                <MapPin className="w-16 h-16 text-slate-300 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Ready to start?</h3>
                <p className="text-sm text-slate-600 mb-6">Applications are currently open for Delhi NCR (Indirapuram, Noida, South Delhi) and Gurugram.</p>
                <a href="/collector-register" className="w-full">
                  <Button fullWidth size="lg" variant="primary" className="font-bold">
                    Submit Application
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
