'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Shield, Building2, User, Truck, ChevronDown, Check } from 'lucide-react';
import { UserRole } from '@/lib/types';
import { getClientSessionRole, setClientSessionRole } from '@/lib/auth';

const ROLES: { key: UserRole; label: string; desc: string; icon: any; route: string }[] = [
  { key: 'PATIENT', label: 'Patient / Customer', desc: 'Browse tests, book collection & track reports', icon: User, route: '/dashboard' },
  { key: 'ADMIN', label: 'Admin Command Center', desc: 'Manage tests, dynamic prices, revenue & referrals', icon: Shield, route: '/admin' },
  { key: 'LAB_PARTNER', label: 'Partner Lab Portal', desc: 'Laboratory processing & report uploads', icon: Building2, route: '/lab-portal' },
  { key: 'COLLECTOR', label: 'Phlebotomist Portal', desc: 'Mobile route list & sample collection status', icon: Truck, route: '/collector-portal' },
];

export const RoleSwitcher: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<UserRole>('PATIENT');
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setCurrentRole(getClientSessionRole());
    const handler = () => setCurrentRole(getClientSessionRole());
    window.addEventListener('quicklabz-auth-change', handler);
    return () => window.removeEventListener('quicklabz-auth-change', handler);
  }, []);

  const handleSelectRole = (roleItem: typeof ROLES[0]) => {
    setClientSessionRole(roleItem.key);
    setCurrentRole(roleItem.key);
    setIsOpen(false);
    router.push(roleItem.route);
  };

  const activeRoleConfig = ROLES.find((r) => r.key === currentRole) || ROLES[0];
  const IconComponent = activeRoleConfig.icon;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-200 bg-brand-50 hover:bg-brand-100 text-brand-800 text-xs font-semibold transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <IconComponent className="w-3.5 h-3.5 text-brand-600" />
        <span className="hidden sm:inline">Role: {activeRoleConfig.label.split(' ')[0]}</span>
        <ChevronDown className="w-3.5 h-3.5 text-brand-500" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-hover border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3 py-2 border-b border-slate-100 mb-1">
              <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
                Switch Portal / Persona
              </p>
              <p className="text-xs text-slate-600">
                Experience QuickLabz across all roles
              </p>
            </div>

            <div className="space-y-1">
              {ROLES.map((r) => {
                const ItemIcon = r.icon;
                const isSelected = r.key === currentRole;

                return (
                  <button
                    key={r.key}
                    type="button"
                    onClick={() => handleSelectRole(r)}
                    className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-colors ${
                      isSelected
                        ? 'bg-brand-50 text-brand-900 font-medium'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div
                      className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                        isSelected ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <ItemIcon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold truncate">{r.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-brand-600" />}
                      </div>
                      <p className="text-[10px] text-slate-500 truncate">{r.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
