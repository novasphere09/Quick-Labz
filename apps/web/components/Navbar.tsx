'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from "next-auth/react";
import {
  Activity,
  MapPin,
  Search,
  Menu,
  X,
  PhoneCall,
  ShieldCheck,
  User,
  FlaskConical,
  Package,
  Building2,
  HelpCircle,
  FileText,
  Truck,
  Lock,
  CheckCircle2,
} from 'lucide-react';
import { Button } from './ui/Button';
import { LocationModal } from './LocationModal';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Delhi NCR');
  const [selectedPincode, setSelectedPincode] = useState('201014');

  const patientLinks = [
    { name: 'Blood Tests', href: '/tests', icon: FlaskConical },
    { name: 'Health Packages', href: '/packages', icon: Package },
    { name: 'Lab Directory', href: '/labs', icon: Building2 },
  ];

  const partnerLinks = [
    { name: 'Partner with Us', href: '/partner-with-us', icon: Building2 },
    { name: 'Drive with Us', href: '/drive-with-us', icon: Truck },
    { name: 'Affiliate Program', href: '/affiliate-program', icon: ShieldCheck },
    { name: 'Partner Login', href: '/partner-login', icon: Lock },
  ];

  useEffect(() => {
    const savedCity = localStorage.getItem('quicklabz_city');
    const savedPin = localStorage.getItem('quicklabz_pincode');
    if (savedCity && savedPin) {
      setSelectedCity(savedCity);
      setSelectedPincode(savedPin);
    }

    if (status === 'authenticated') {
      fetch('/api/user/profile')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.addresses && data.addresses.length > 0) {
            const defaultAddress = data.addresses.find((a: any) => a.isDefault) || data.addresses[0];
            if (defaultAddress.city && defaultAddress.pincode) {
              const city = defaultAddress.city;
              const pin = defaultAddress.pincode;
              setSelectedCity(city);
              setSelectedPincode(pin);
              localStorage.setItem('quicklabz_city', city);
              localStorage.setItem('quicklabz_pincode', pin);
              window.dispatchEvent(new Event('locationChanged'));
            }
          }
        })
        .catch(console.error);
    }
  }, [status]);

  const handleSelectLocation = (city: string, pincode: string) => {
    setSelectedCity(city);
    setSelectedPincode(pincode);
    localStorage.setItem('quicklabz_city', city);
    localStorage.setItem('quicklabz_pincode', pincode);
    window.dispatchEvent(new Event('locationChanged'));
  };

  return (
    <>
      {/* Top Notification / Trust Bar */}
      <div className="bg-slate-950 border-b border-white/5 text-slate-400 text-xs py-2 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]"></span>
              Doorstep Sample Collection Active in Delhi NCR, Noida & Ghaziabad
            </span>
            <span className="text-white/20">|</span>
            <span className="text-slate-300 font-medium">
              Zero Collection Fee
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="tel:7018623940"
              className="flex items-center gap-1.5 hover:text-white transition-colors font-medium"
            >
              <PhoneCall className="w-3.5 h-3.5 text-accent-400" />
              <span>Helpline: +91 7018623940</span>
            </a>
            <span className="text-white/20">|</span>
            <Link
              href="/disclaimer"
              className="text-slate-500 hover:text-slate-300 transition-colors"
            >
              Health Disclaimer
            </Link>
          </div>
        </div>
      </div>
      <div className="bg-brand-600 text-white px-4 py-1.5 text-[11px] sm:text-xs font-semibold flex justify-center items-center gap-4 text-center">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-200" /> NABL & ISO Certified Partners
        </span>
        <span className="hidden sm:flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-brand-200" /> Free Doorstep Sample Collection
        </span>
      </div>

      {/* Main Navigation */}
      <nav className="sticky top-0 z-50 w-full transition-all duration-300 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 sm:h-20 items-center justify-between gap-4 sm:gap-8">
            
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center transition-transform hover:scale-105">
                <Image 
                  src="/logo.png" 
                  alt="QuickLabz Logo" 
                  width={300}
                  height={100}
                  quality={90}
                  className="h-14 sm:h-16 w-auto object-contain" 
                />
              </Link>
            </div>

            {/* Location Selector */}
            <button
              type="button"
              onClick={() => setIsLocationModalOpen(true)}
              className="hidden lg:flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-full py-1.5 px-3 text-xs shadow-sm hover:border-brand-300 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-brand-500 shrink-0" />
              <span className="font-bold text-slate-800">{selectedCity}</span>
              <span className="text-slate-500 ml-1">{selectedPincode}</span>
            </button>

            {/* Main Navigation Links */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              {patientLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-sm font-bold transition-colors flex flex-col group ${
                      isActive ? 'text-brand-600' : 'text-slate-600 hover:text-brand-600'
                    }`}
                  >
                    {link.name}
                    <span className={`h-0.5 bg-brand-500 transition-all duration-300 ease-out ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                  </Link>
                );
              })}

              {/* Partners Dropdown */}
              <div className="relative group">
                <button className="text-sm font-bold text-slate-600 hover:text-brand-600 transition-colors flex items-center gap-1 py-2">
                  Partners
                </button>
                <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 flex flex-col p-2">
                  {partnerLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.name}
                        href={link.href}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-slate-700 hover:text-brand-600 hover:bg-slate-50 font-semibold transition-colors"
                      >
                        <Icon className="w-4 h-4 text-brand-500" />
                        {link.name}
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Utility Actions (Search, Track, Account, CTA) */}
            <div className="flex items-center gap-2 sm:gap-3 ml-auto">
              <Link
                href="/tests"
                className="p-2 text-slate-600 hover:text-brand-600 hover:bg-slate-50 rounded-full transition-colors hidden sm:block"
                title="Search tests"
              >
                <Search className="w-5 h-5" />
              </Link>

              <Link href="/track">
                <Button variant="outline" size="sm" leftIcon={<FileText className="w-3.5 h-3.5 text-brand-500" />} className="hidden lg:flex items-center gap-1.5 rounded-full px-4 h-9 border-slate-300 hover:bg-slate-50 font-semibold text-slate-600">
                  Track Report
                </Button>
              </Link>

              {/* Auth / My Account Link */}
              {status === "loading" ? (
                <div className="w-24 h-9 bg-slate-100 rounded-full animate-pulse hidden sm:block border border-slate-200"></div>
              ) : session ? (
                <div className="hidden sm:flex items-center gap-2">
                  <Link href="/dashboard">
                    <Button variant="outline" size="sm" leftIcon={<User className="w-3.5 h-3.5" />} className="rounded-full h-9 px-4 font-bold border-slate-300 hover:bg-slate-50 text-slate-700">
                      {session.user?.name?.split(' ')[0] || 'Patient'}
                    </Button>
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="text-xs font-semibold text-slate-500 hover:text-red-500 transition-colors hidden xl:block px-1"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link href="/login" className="hidden sm:block">
                  <Button variant="outline" size="sm" leftIcon={<User className="w-3.5 h-3.5" />} className="rounded-full h-9 px-4 font-semibold border-slate-300 hover:bg-slate-50 text-slate-700">
                    Login / Sign Up
                  </Button>
                </Link>
              )}

              <Link href="/book" className="hidden sm:block">
                <Button size="sm" variant="accent" className="font-bold shadow-md shadow-accent-500/20 rounded-full px-5 h-9 sm:h-10 text-xs sm:text-sm whitespace-nowrap hover:scale-105 transition-transform hover:shadow-lg">
                  Book a Blood Test
                </Button>
              </Link>

              {/* Mobile Menu Toggle Button */}
              <button 
                type="button"
                className="p-2 -mr-2 text-slate-600 hover:text-brand-600 md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 bg-white">
            <div className="flex flex-col space-y-3">
              <Link href="/tests" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-lg">Blood Tests</Link>
              <Link href="/packages" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-lg">Health Packages</Link>
              <Link href="/labs" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-lg">Lab Directory</Link>
              <Link href="/track" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-lg flex items-center justify-between">
                Track Report <FileText className="w-4 h-4 text-brand-500" />
              </Link>
              
              <div className="px-4 pt-2 pb-1 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Partners</span>
              </div>
              {partnerLinks.map(link => {
                const Icon = link.icon;
                return (
                  <Link key={link.name} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-3">
                    <Icon className="w-4 h-4 text-brand-500" />
                    {link.name}
                  </Link>
                );
              })}
              
              <div className="pt-2 mt-2 border-t border-slate-100 px-4">
                {status === 'authenticated' ? (
                  <div className="space-y-3">
                     <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button fullWidth variant="outline" className="border-slate-200">My Dashboard</Button>
                     </Link>
                     <Button fullWidth variant="ghost" onClick={() => signOut()} className="text-red-500">Logout</Button>
                  </div>
                ) : (
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button fullWidth variant="outline" className="border-slate-200">Login / Sign Up</Button>
                  </Link>
                )}
              </div>
              <div className="px-4 pt-2">
                <Link href="/tests" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button fullWidth variant="accent" className="font-bold shadow-md h-12">Book a Blood Test</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Location Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        selectedCity={selectedCity}
        selectedPincode={selectedPincode}
        onSelectLocation={handleSelectLocation}
      />
    </>
  );
};
