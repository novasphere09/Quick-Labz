import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Activity,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  HeartHandshake,
  FileText,
  AlertCircle,
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Upper Footer - Important Marketplace Notice */}
      <div className="border-b border-slate-800/80 bg-slate-950/60 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">
                Transparent HealthTech Digital Pathology Marketplace
              </p>
              <p className="text-xs text-slate-400">
                QuickLabz aggregates verified nearby laboratories and provides certified doorstep phlebotomy services.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end md:self-auto">
            <Link
              href="/how-it-works"
              className="text-xs text-brand-400 hover:text-brand-300 font-semibold underline underline-offset-4"
            >
              Learn how our marketplace works →
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand & About */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="flex items-start transition-transform hover:scale-105 inline-block">
              <Image 
                src="/logo.png" 
                alt="QuickLabz Logo" 
                width={600}
                height={200}
                quality={90}
                className="h-10 sm:h-12 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" 
              />
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed pr-4">
              Blood Tests, From the Comfort of Home. Choose trusted nearby pathology laboratories, compare transparent pricing, and receive digital reports directly on your phone.
            </p>

            <div className="space-y-2.5 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-accent-400 shrink-0" />
                <a href="tel:7018623940" className="hover:text-white transition-colors">
                  <strong>Phone / WhatsApp:</strong> +91 7018623940
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-accent-400 shrink-0" />
                <a href="mailto:quicklabzofficial@gmail.com" className="hover:text-white transition-colors">
                  <strong>Email:</strong> quicklabzofficial@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Patient Services
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link href="/tests" className="hover:text-white transition-colors">Compare Blood Tests</Link></li>
              <li><Link href="/packages" className="hover:text-white transition-colors">Health Packages</Link></li>
              <li><Link href="/labs" className="hover:text-white transition-colors">Accredited Labs</Link></li>
              <li><Link href="/how-it-works" className="hover:text-white transition-colors">How QuickLabz Works</Link></li>
              <li><Link href="/track" className="hover:text-white transition-colors">Track Sample & Reports</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">My Bookings</Link></li>
            </ul>
          </div>

          {/* Popular Tests */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Popular Tests
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link href="/tests/lipid-profile" className="hover:text-white transition-colors">Lipid Profile (from ₹359)</Link></li>
              <li><Link href="/tests/cbc-complete-blood-count" className="hover:text-white transition-colors">Complete Blood Count (₹299)</Link></li>
              <li><Link href="/tests/hba1c" className="hover:text-white transition-colors">HbA1C Glycated Hb (₹399)</Link></li>
              <li><Link href="/tests/tft-total-thyroid-profile" className="hover:text-white transition-colors">Thyroid Profile TFT (₹399)</Link></li>
              <li><Link href="/tests/vitamin-d3" className="hover:text-white transition-colors">Vitamin D3 Test (₹679)</Link></li>
              <li><Link href="/packages" className="hover:text-white transition-colors">Full Body Checkup (₹2699)</Link></li>
            </ul>
          </div>

          {/* Partner & Staff Logins */}
          <div>
            <h4 className="text-xs font-bold text-brand-400 uppercase tracking-wider mb-4">
              Partner & Staff Logins
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link href="/partner-login" className="text-white hover:text-brand-300 font-semibold transition-colors">🔐 Staff Portal Login</Link></li>
              <li><Link href="/lab-portal" className="hover:text-white transition-colors">Partner Lab Console</Link></li>
              <li><Link href="/partner-login/register" className="hover:text-white transition-colors">Register as a Partner Lab</Link></li>
              <li><Link href="/collector-portal" className="hover:text-white transition-colors">Phlebotomist Route App</Link></li>
              <li><Link href="/collector-register" className="hover:text-white transition-colors">Register as a Phlebotomist</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About QuickLabz</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Support & Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Governance & Policies
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy & Data Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/refund" className="hover:text-white transition-colors">Refund & Cancellation</Link></li>
              <li><Link href="/disclaimer" className="hover:text-white transition-colors">Medical Disclaimer</Link></li>
            </ul>
          </div>
        </div>

        {/* Mandatory Healthcare Legal Disclaimer (Prompt Section 1, 2, 53) */}
        <div className="mt-12 pt-8 border-t border-slate-800 text-[11px] text-slate-500 space-y-3 leading-relaxed">
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800/80">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p>
              <strong className="text-slate-300">Statutory HealthTech Disclosure:</strong> QuickLabz is a technology marketplace platform connecting patients with independent, certified diagnostic laboratories for doorstep sample collection and digital report delivery. QuickLabz does not perform diagnostic tests directly and does not provide medical diagnosis, treatment recommendations, or doctor consultations. Diagnostic tests facilitate screening and monitoring; please consult a qualified physician for clinical interpretation.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <p>© {new Date().getFullYear()} QuickLabz Technologies. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
