'use client';

import React, { useState } from 'react';
import { MapPin, Check, AlertCircle, Sparkles, Search } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCity: string;
  selectedPincode: string;
  onSelectLocation: (city: string, pincode: string) => void;
}

const SERVICED_PINCODES: Record<string, { city: string; area: string }> = {
  '110001': { city: 'Delhi NCR', area: 'Connaught Place / Central Delhi' },
  '110016': { city: 'Delhi NCR', area: 'Hauz Khas / Green Park' },
  '110049': { city: 'Delhi NCR', area: 'South Extension' },
  '110092': { city: 'Delhi NCR', area: 'Laxmi Nagar / East Delhi' },
  '201301': { city: 'Noida', area: 'Sector 15 / Sector 18 Noida' },
  '201309': { city: 'Noida', area: 'Sector 62 / Sector 63 IT Hub' },
  '201010': { city: 'Ghaziabad', area: 'Vaishali / Kaushambi' },
  '201014': { city: 'Ghaziabad', area: 'Indirapuram / Vasundhara' },
  '122001': { city: 'Gurugram', area: 'DLF Phase 1-5 / Cyber City' },
  '560001': { city: 'Bengaluru', area: 'MG Road / Indiranagar (Beta Hub)' },
  '400001': { city: 'Mumbai', area: 'Fort / South Mumbai (Beta Hub)' },
};

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  selectedCity,
  selectedPincode,
  onSelectLocation,
}) => {
  const [pinInput, setPinInput] = useState(selectedPincode || '');
  const [status, setStatus] = useState<'idle' | 'loading' | 'serviced' | 'unserviced' | 'waitlisted'>('idle');
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [matchedArea, setMatchedArea] = useState<{ city: string; area: string } | null>(null);

  const handleCheckPincode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanPin = pinInput.trim();
    if (!cleanPin || cleanPin.length < 6) return;

    setStatus('loading');

    try {
      const res = await fetch(`/api/locations/check?pincode=${cleanPin}`);
      const data = await res.json();

      if (data.success && data.isServiced) {
        setMatchedArea({ city: data.city, area: data.area });
        setStatus('serviced');
      } else {
        setStatus('unserviced');
      }
    } catch (err) {
      if (SERVICED_PINCODES[cleanPin]) {
        setMatchedArea(SERVICED_PINCODES[cleanPin]);
        setStatus('serviced');
      } else {
        setStatus('unserviced');
      }
    }
  };

  const handleConfirmLocation = () => {
    if (matchedArea) {
      onSelectLocation(matchedArea.city, pinInput);
      onClose();
    }
  };

  const handleJoinWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('waitlisted');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Select Your Service Location"
      subtitle="QuickLabz currently provides doorstep sample collection in selected metro hubs."
    >
      <div className="space-y-5">
        {/* Pincode Search Input */}
        <form onSubmit={handleCheckPincode} className="space-y-3">
          <Input
            label="Enter Your 6-Digit PIN Code"
            placeholder="e.g. 201014, 110001, 201309"
            maxLength={6}
            value={pinInput}
            onChange={(e) => {
              setPinInput(e.target.value.replace(/\D/g, ''));
              setStatus('idle');
            }}
            leftIcon={<Search className="w-4 h-4" />}
            rightElement={
              <Button
                type="button"
                size="sm"
                variant="primary"
                onClick={() => handleCheckPincode()}
                disabled={pinInput.length !== 6 || status === 'loading'}
              >
                {status === 'loading' ? 'Checking...' : 'Check'}
              </Button>
            }
          />
        </form>

        {/* Serviced Result */}
        {status === 'serviced' && matchedArea && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl animate-in fade-in duration-200">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <Check className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-emerald-900">
                  Home Collection is Available!
                </h4>
                <p className="text-xs text-emerald-700 mt-0.5">
                  We have certified phlebotomists and partner labs active in{' '}
                  <span className="font-semibold">{matchedArea.area}, {matchedArea.city}</span> ({pinInput}).
                </p>
                <Button
                  size="sm"
                  variant="primary"
                  className="mt-3 bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500"
                  onClick={handleConfirmLocation}
                >
                  Set as My Location
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Unserviced Result - Prompt Rule #14 Fallback */}
        {status === 'unserviced' && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl animate-in fade-in duration-200">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-amber-900">
                  We're not serving your area yet
                </h4>
                <p className="text-xs text-amber-800 mt-1">
                  QuickLabz is expanding rapidly. Leave your details below and we'll notify you the moment home sample collection becomes available in your area.
                </p>

                <form onSubmit={handleJoinWaitlist} className="mt-3 flex gap-2">
                  <Input
                    placeholder="Enter mobile or email"
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                    required
                    className="text-xs py-1.5"
                  />
                  <Button type="submit" size="sm" variant="accent">
                    Notify Me
                  </Button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Waitlisted Confirmation */}
        {status === 'waitlisted' && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-center">
            <Sparkles className="w-6 h-6 text-brand-600 mx-auto mb-1" />
            <h4 className="text-sm font-bold text-blue-900">Thank You!</h4>
            <p className="text-xs text-blue-700 mt-0.5">
              We've registered your PIN code. You'll be the first to know when we launch doorstep testing here!
            </p>
          </div>
        )}

        {/* Popular Active Hubs */}
        <div className="pt-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Active Metro Service Hubs
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { city: 'Delhi NCR (Indirapuram / Vaishali)', pin: '201014' },
              { city: 'Noida (Sector 62 & 18)', pin: '201309' },
              { city: 'Central & South Delhi', pin: '110001' },
              { city: 'Gurugram (Cyber City)', pin: '122001' },
            ].map((hub) => (
              <button
                key={hub.pin}
                type="button"
                onClick={() => {
                  setPinInput(hub.pin);
                  setMatchedArea(SERVICED_PINCODES[hub.pin]);
                  setStatus('serviced');
                }}
                className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50/50 text-left transition-all group"
              >
                <MapPin className="w-4 h-4 text-brand-500 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-slate-800 group-hover:text-brand-700">
                    {hub.city}
                  </p>
                  <p className="text-[10px] text-slate-500">PIN: {hub.pin}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
