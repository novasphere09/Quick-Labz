'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  User,
  Clock,
  FileText,
  MapPin,
  Calendar,
  Phone,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Download,
  AlertCircle,
  Plus,
  Truck,
  Building2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';


export default function PatientDashboard() {
  const [activeTab, setActiveTab] = useState<'bookings' | 'reports' | 'addresses' | 'profile'>('bookings');
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const { data: session, status } = useSession();
  const [bookings, setBookings] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [userAddresses, setUserAddresses] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleAddAddress = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSavingAddress(true);
    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        house: formData.get('house'),
        street: formData.get('street'),
        area: formData.get('area'),
        pincode: formData.get('pincode'),
        city: formData.get('city'),
      };
      
      const res = await fetch('/api/user/address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (res.ok) {
        const responseData = await res.json();
        setUserAddresses([...userAddresses, responseData.address]);
        setIsAddressModalOpen(false);
      } else {
        alert('Failed to save address');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred');
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setSaveStatus('idle');
    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        age: formData.get('age'),
        gender: formData.get('gender'),
        bloodGroup: formData.get('bloodGroup'),
      };
      
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (res.ok) {
        const responseData = await res.json();
        setUserData(responseData.user);
        setUserProfile(responseData.profile);
        setSaveStatus('success');
        
        // Hide success message after 3 seconds
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        setSaveStatus('error');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSavingProfile(false);
    }
  };

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [bookingsRes, profileRes] = await Promise.all([
          fetch('/api/user/bookings'),
          fetch('/api/user/profile')
        ]);
        const bookingsData = await bookingsRes.json();
        const profileData = await profileRes.json();

        if (bookingsData.success) {
          setBookings(bookingsData.bookings);
        }
        if (profileData.success) {
          setUserData(profileData.user);
          setUserProfile(profileData.profile);
          setUserAddresses(profileData.addresses || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    
    if (status === 'loading') {
      setIsLoading(true);
      return;
    }
    
    if (session?.user) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [session, status]);

  const user = {
    name: userProfile?.fullName || userData?.name || session?.user?.name || 'Loading...',
    email: userData?.email || session?.user?.email || '',
    phone: userData?.phone || 'Not provided',
    age: userProfile?.age || 30,
    gender: userProfile?.gender || 'Male',
    bloodGroup: userProfile?.bloodGroup || 'Not set',
  };

  const addresses = userAddresses.length > 0 ? userAddresses.map((a, i) => ({
    id: a.id,
    tag: a.isDefault ? 'Home (Default)' : `Address ${i + 1}`,
    house: a.house,
    street: a.street,
    area: a.area,
    city: `${a.city}, ${a.state}`,
    pincode: a.pincode,
    landmark: a.landmark || 'None',
  })) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Patient Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-500 text-white flex items-center justify-center text-xl font-bold font-display shadow-md shadow-brand-500/20">
            RS
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{user.name}</h1>
              <Badge variant="green" size="sm">Verified Patient</Badge>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              {user.phone} • {user.email}
            </p>
            <p className="text-[11px] text-slate-400">
              Demographics: {user.age} Yrs / {user.gender} • Blood Group: {user.bloodGroup}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a href="/book">
            <Button variant="accent" size="sm" className="font-bold">
              + Book New Test
            </Button>
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {[
          { key: 'bookings', label: 'My Bookings & Tests', icon: Clock, count: bookings.length },
          { key: 'reports', label: 'Digital Reports Vault', icon: FileText, count: bookings.filter((b) => b.status === 'REPORT_DELIVERED').length },
          { key: 'addresses', label: 'Saved Addresses', icon: MapPin, count: addresses.length },
          { key: 'profile', label: 'Patient Profile', icon: User },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: BOOKINGS */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Your Diagnostic Bookings</h2>

          <div className="space-y-4">
            {isLoading ? (
              <div className="p-6 text-center text-slate-500">Loading bookings...</div>
            ) : bookings.length === 0 ? (
              <div className="p-6 text-center text-slate-500 border border-slate-200 rounded-xl">No bookings found. <a href="/tests" className="text-brand-600 underline">Book a test now</a>.</div>
            ) : bookings.map((b) => (
              <Card key={b.id} className="p-6 space-y-4 border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-brand-600">{b.bookingNumber}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-slate-500">{b.scheduledDate} ({b.timeSlot})</span>
                  </div>

                  {b.status === 'CANCELLED' ? (
                    <Badge variant="rose" size="sm" dot>Cancelled</Badge>
                  ) : b.status === 'REPORT_DELIVERED' ? (
                    <Badge variant="green" size="sm" dot>Report Ready & Delivered</Badge>
                  ) : (
                    <Badge variant="blue" size="sm" dot>Processing / Scheduled</Badge>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1 max-w-xl">
                    <h3 className="text-base font-bold text-slate-900">{b.bookingItems?.[0]?.itemName || 'Blood Test'}</h3>
                    <p className="text-xs text-slate-600 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                      Lab: <strong>{b.laboratory?.name || 'Assigned soon'}</strong>
                    </p>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      Phlebotomist: {b.collector?.name ? `${b.collector.name} (${b.collector.phone})` : 'Assigned soon'}
                    </p>
                  </div>

                  <div className="text-right sm:text-right shrink-0">
                    <span className="text-xs text-slate-400 block">Amount</span>
                    <span className="text-xl font-extrabold text-slate-900">₹{b.totalAmount}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <a href={`/track/${b.bookingNumber}`}>
                    <Button size="sm" variant="outline">
                      Track Live Status Timeline →
                    </Button>
                  </a>

                  {b.status === 'REPORT_DELIVERED' && (
                    <a href={`/reports/${b.bookingNumber}`}>
                      <Button size="sm" variant="accent" leftIcon={<FileText className="w-4 h-4" />}>
                        View / Download Report PDF
                      </Button>
                    </a>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: DIGITAL REPORTS VAULT */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Verified Pathology Reports</h2>
            <span className="text-xs text-slate-500">Secure, encrypted diagnostic vault</span>
          </div>

          {bookings.filter(b => b.status === 'REPORT_DELIVERED').length === 0 ? (
            <div className="p-6 text-center text-slate-500 border border-slate-200 rounded-xl">
              No digital reports available yet.
            </div>
          ) : (
            bookings.filter(b => b.status === 'REPORT_DELIVERED').map((b) => (
              <Card key={b.id} className="p-6 border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-base font-bold text-slate-900">{b.bookingItems?.[0]?.itemName || 'Blood Test'}</h3>
                    <p className="text-xs text-slate-500">
                      Lab: {b.laboratory?.name || 'QuickLabz Partner'} • Ref: <strong>{b.bookingNumber}</strong> • {b.scheduledDate}
                    </p>
                    <span className="inline-block text-[11px] text-emerald-700 font-semibold">
                      ✓ Verified by Pathologist
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a href={`/reports/${b.bookingNumber}`}>
                    <Button size="sm" variant="accent" leftIcon={<Download className="w-4 h-4" />}>
                      View & Download PDF
                    </Button>
                  </a>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* TAB 3: SAVED ADDRESSES */}
      {activeTab === 'addresses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Doorstep Collection Addresses</h2>
            <Button
              size="sm"
              variant="outline"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setIsAddressModalOpen(true)}
            >
              Add New Address
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <Card key={addr.id} className="p-5 space-y-2 border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-brand-50 text-brand-700 rounded-md">
                    {addr.tag}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-900">
                  {addr.house}, {addr.street}
                </p>
                <p className="text-xs text-slate-600">
                  {addr.area}, {addr.city} - {addr.pincode}
                </p>
                <p className="text-[11px] text-slate-400">
                  Landmark: {addr.landmark}
                </p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PATIENT PROFILE */}
      {activeTab === 'profile' && (
        <form onSubmit={handleProfileSubmit}>
          <Card className="p-6 sm:p-8 space-y-6 max-w-2xl border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Patient Demographics & Medical Profile
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Full Name" name="name" defaultValue={user.name} required />
              <Input label="Mobile Number" name="phone" defaultValue={user.phone} placeholder="e.g. 9876543210" />
              <Input label="Email Address" name="email" defaultValue={user.email} />
              <Input label="Age" name="age" type="number" defaultValue={user.age.toString()} />
              <Input label="Gender" name="gender" defaultValue={user.gender} />
              <Input label="Blood Group" name="bloodGroup" defaultValue={user.bloodGroup} />
            </div>

            <div className="flex items-center gap-4">
              <Button size="sm" variant="primary" type="submit" disabled={isSavingProfile}>
                {isSavingProfile ? 'Saving...' : 'Save Profile Updates'}
              </Button>
              
              {saveStatus === 'success' && (
                <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg text-sm font-medium animate-in fade-in duration-300">
                  <CheckCircle2 className="w-4 h-4" />
                  Profile updated successfully
                </div>
              )}
              {saveStatus === 'error' && (
                <div className="flex items-center gap-2 text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg text-sm font-medium animate-in fade-in duration-300">
                  <AlertCircle className="w-4 h-4" />
                  Failed to update profile
                </div>
              )}
            </div>
          </Card>
        </form>
      )}

      {/* Address Add Modal */}
      <Modal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        title="Add Doorstep Address"
        subtitle="Save home or office address for fast test bookings"
      >
        <form onSubmit={handleAddAddress} className="space-y-4">
          <Input name="house" label="House / Flat No." placeholder="e.g. Flat 402" required />
          <Input name="street" label="Society / Street" placeholder="e.g. Tower 3, Green Apartments" required />
          <Input name="area" label="Area / Sector" placeholder="e.g. Indirapuram Sector 4" required />
          <div className="grid grid-cols-2 gap-3">
            <Input name="pincode" label="PIN Code" placeholder="201014" required />
            <Input name="city" label="City" placeholder="Ghaziabad / Delhi NCR" required />
          </div>
          <Button
            type="submit"
            size="md"
            variant="primary"
            fullWidth
            disabled={isSavingAddress}
          >
            {isSavingAddress ? 'Saving...' : 'Save Address'}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
