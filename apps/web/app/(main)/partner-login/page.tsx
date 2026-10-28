"use client";
export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Truck,
  Shield,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Activity,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

export default function PartnerLoginPage() {
  const router = useRouter();
  const [activeRole, setActiveRole] = useState<'LAB_PARTNER' | 'COLLECTOR' | 'AFFILIATE' | 'ADMIN'>('LAB_PARTNER');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState<1 | 2>(1);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const roles = [
    {
      key: 'LAB_PARTNER' as const,
      title: 'Partner Laboratory',
      subtitle: 'Pathology verification & report uploads',
      icon: Building2,
      route: '/lab-portal',
      defaultId: 'lab@apexdiagnostics.com',
    },
    {
      key: 'COLLECTOR' as const,
      title: 'Phlebotomist / Collector',
      subtitle: 'Doorstep route schedule & collection status',
      icon: Truck,
      route: '/collector-portal',
      defaultId: 'collector@quicklabz.com',
    },
    {
      key: 'AFFILIATE' as const,
      title: 'Clinic / Pharmacy Partner',
      subtitle: 'Referral tracking & payout status',
      icon: ShieldCheck,
      route: '/affiliate-portal',
      defaultId: 'clinic@example.com',
    },
  ];

  const handleSelectRole = (roleKey: 'LAB_PARTNER' | 'COLLECTOR' | 'AFFILIATE') => {
    setActiveRole(roleKey);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const target = roles.find((r) => r.key === activeRole)?.route || '/';

    const res = await signIn('credentials', {
      email: identifier.trim(),
      password,
      role: activeRole,
      otp: step === 2 ? otp : "",
      redirect: false,
    });

    setIsLoading(false);

    if (res?.error) {
      if (res.error === '2FA_REQUIRED') {
        setStep(2);
        setError('');
      } else {
        setError(res.error);
      }
    } else {
      router.push(target);
    }
  };

  const currentRoleConfig = roles.find((r) => r.key === activeRole) || roles[0];
  const IconComponent = currentRoleConfig.icon;

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-md w-full space-y-6">
        {/* Top Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-brand-500/25">
            <Activity className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Partner & Staff Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Secure login for accredited partner laboratories, certified phlebotomists, and operations staff.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-2 bg-slate-200/80 p-1.5 rounded-2xl">
          {roles.map((r) => {
            const ItemIcon = r.icon;
            const isSelected = activeRole === r.key;
            return (
              <button
                key={r.key}
                type="button"
                onClick={() => handleSelectRole(r.key)}
                className={`py-2.5 px-2 rounded-xl text-center transition-all flex flex-col items-center gap-1 ${
                  isSelected
                    ? 'bg-white text-brand-700 font-bold shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 font-medium'
                }`}
              >
                <ItemIcon className={`w-4 h-4 ${isSelected ? 'text-brand-600' : 'text-slate-400'}`} />
                <span className="text-[11px] leading-tight line-clamp-1">{r.title.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Login Form Card */}
        <Card className="p-6 sm:p-8 space-y-5 border-slate-200 shadow-hover">
          <div className="flex items-center gap-3 p-3 bg-brand-50 rounded-2xl border border-brand-100">
            <div className="p-2 rounded-xl bg-brand-500 text-white shrink-0">
              <IconComponent className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">{currentRoleConfig.title}</p>
              <p className="text-[11px] text-slate-600">{currentRoleConfig.subtitle}</p>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {step === 1 ? (
              <>
                <Input
                  label="Staff Email / Phone"
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="name@partnerlab.com"
                />

                <Input
                  label="Secure Password / Access PIN"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                />

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-brand-500" />
                    <span>Keep me signed in</span>
                  </label>
                  <Link href="/forgot-password" className="text-brand-600 hover:underline">
                    Forgot PIN?
                  </Link>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  size="lg"
                  className="font-bold mt-2"
                  isLoading={isLoading}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Log In to {currentRoleConfig.title.split(' ')[0]} Portal
                </Button>
              </>
            ) : (
              <>
                <div className="text-center mb-4">
                  <p className="text-sm font-medium text-slate-900">Enter Security Code</p>
                  <p className="text-xs text-slate-500">We sent a 6-digit code to your email.</p>
                </div>
                
                <Input
                  label="6-Digit OTP"
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  className="text-center text-lg tracking-widest font-bold"
                  maxLength={6}
                />
                
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  size="lg"
                  className="font-bold mt-2"
                  isLoading={isLoading}
                >
                  Verify & Access Portal
                </Button>
                
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full text-center text-xs font-semibold text-slate-500 hover:text-slate-900 mt-4"
                >
                  Back to login
                </button>
              </>
            )}
          </form>

          <div className="pt-3 border-t border-slate-100 text-center text-xs text-slate-600">
            Don't have a partner account?{' '}
            <Link href="/partner-login/register" className="font-bold text-brand-600 hover:underline">
              Register here
            </Link>
          </div>
        </Card>

        {/* Back to Marketplace Link */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col items-center gap-3">
          <p className="text-sm text-slate-600 font-medium">
            New Laboratory?{' '}
            <Link
              href="/partner-login/register"
              className="font-bold text-brand-600 hover:text-brand-700 transition-colors"
            >
              Register here
            </Link>
          </p>
          <p className="text-sm text-slate-600 font-medium">
            Phlebotomist / Delivery Partner?{' '}
            <Link
              href="/collector-register"
              className="font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              Join the fleet
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
