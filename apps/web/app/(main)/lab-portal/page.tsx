'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2,
  FileCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  Upload,
  DollarSign,
  TrendingUp,
  Search,
  Filter,
  Eye,
  FileText,
  FlaskConical,
  Beaker,
  UserCircle,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { BookingStatus } from '@/lib/types';

export default function LabPortal() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'bookings' | 'catalog' | 'packages' | 'payouts' | 'profile'>('bookings');
  
  const [lab, setLab] = useState<any>(null);
  const [labBookings, setLabBookings] = useState<any[]>([]);
  const [collectors, setCollectors] = useState<any[]>([]);
  const [catalogTests, setCatalogTests] = useState<any[]>([]);
  const [catalogPackages, setCatalogPackages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const [selectedBookingForReport, setSelectedBookingForReport] = useState<typeof labBookings[0] | null>(null);
  const [reportSummary, setReportSummary] = useState('');
  const [reportDoctor, setReportDoctor] = useState('Dr. Alok Verma, MD (Pathology)');
  const [reportFile, setReportFile] = useState<File | null>(null);
  const [reportConfirmed, setReportConfirmed] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editingPrices, setEditingPrices] = useState<Record<string, string>>({});
  
  const [upiId, setUpiId] = useState('');
  const [savePayoutStatus, setSavePayoutStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isSavingPayout, setIsSavingPayout] = useState(false);

  const [reverifyDocs, setReverifyDocs] = useState({ documentUrl: '', frontImageUrl: '', insideImageUrl: '', equipmentImageUrl: '' });
  
  const [profileFiles, setProfileFiles] = useState<{ frontImage: File | null, insideImage: File | null, equipmentImage: File | null }>({ frontImage: null, insideImage: null, equipmentImage: null });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Custom Package Modal State
  const [isCreateCustomPackageModalOpen, setIsCreateCustomPackageModalOpen] = useState(false);
  const [customPackageName, setCustomPackageName] = useState('');
  const [customPackageDescription, setCustomPackageDescription] = useState('');
  const [customPackagePrice, setCustomPackagePrice] = useState('');
  const [selectedCustomPackageTests, setSelectedCustomPackageTests] = useState<string[]>([]);
  const [isCreatingPackage, setIsCreatingPackage] = useState(false);

  useEffect(() => {
    async function fetchPortalData() {
      try {
        const [portalRes, testsRes, packagesRes] = await Promise.all([
          fetch('/api/labs/portal'),
          fetch('/api/labs/portal/tests'),
          fetch('/api/labs/portal/packages')
        ]);
        const portalData = await portalRes.json();
        const testsData = await testsRes.json();
        const packagesData = await packagesRes.json();
        
        if (portalData.success) {
          setLab(portalData.lab);
          setLabBookings(portalData.lab.bookings || []);
          setCollectors(portalData.collectors || []);
          setUpiId(portalData.lab.upiId || '');
        } else {
          if (portalData.message === 'Lab not found' || portalRes.status === 404) {
            router.push('/lab-portal/register');
            return;
          }
          setError(portalData.message || 'Failed to load portal data');
          if (portalRes.status === 401) {
            router.push('/partner-login');
          }
        }

        if (testsData.success) {
          setCatalogTests(testsData.tests);
        }
        if (packagesData.success) {
          setCatalogPackages(packagesData.packages);
        }
      } catch (err) {
        setError('Failed to connect to the server');
      } finally {
        setIsLoading(false);
      }
    }
    fetchPortalData();
  }, [router]);

  // Handle Booking Status Flow
  const updateBookingStatus = async (id: string, newStatus: BookingStatus, collectorId?: string, extraData?: any) => {
    setIsUpdating(true);
    try {
      const res = await fetch('/api/labs/portal/bookings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: id, status: newStatus, collectorId, ...extraData })
      });
      const data = await res.json();
      if (data.success) {
        setLabBookings(labBookings.map((b) => (b.id === id ? { ...b, status: newStatus } : b)));
      } else {
        alert(data.message || 'Failed to update booking');
      }
    } catch (err) {
      alert('Network error');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUploadReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingForReport) return;
    if (!reportFile) {
      alert("Please select a PDF or Image file for the report.");
      return;
    }

    setIsUpdating(true);
    
    try {
      const formData = new FormData();
      formData.append('bookingId', selectedBookingForReport.id);
      formData.append('status', 'REPORT_DELIVERED');
      formData.append('reportSummary', reportSummary);
      formData.append('reportDoctor', reportDoctor);
      formData.append('file', reportFile);

      const res = await fetch('/api/labs/portal/bookings', {
        method: 'PUT',
        body: formData,
      });

      const data = await res.json();
      
      if (data.success) {
        setLabBookings(
          labBookings.map((b) =>
            b.id === selectedBookingForReport.id ? { ...b, status: 'REPORT_DELIVERED', reportUploaded: true } : b
          )
        );
        setSelectedBookingForReport(null);
        setReportFile(null);
        setReportSummary('');
      } else {
        alert(data.message || 'Failed to upload report');
      }
    } catch (err) {
      alert("Network error while uploading file.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePayoutSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSavingPayout(true);
    setSavePayoutStatus('idle');
    try {
      const res = await fetch('/api/lab/payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ upiId }),
      });
      
      if (res.ok) {
        setSavePayoutStatus('success');
        setTimeout(() => setSavePayoutStatus('idle'), 3000);
      } else {
        setSavePayoutStatus('error');
      }
    } catch (error) {
      setSavePayoutStatus('error');
    } finally {
      setIsSavingPayout(false);
    }
  };

  const handleReverify = async () => {
    if (!reverifyDocs.documentUrl || !reverifyDocs.frontImageUrl || !reverifyDocs.insideImageUrl || !reverifyDocs.equipmentImageUrl) {
      alert('Please provide valid public links for your Govt Registration Document and all three facility photos.');
      return;
    }
    
    setIsUpdating(true);
    try {
      const res = await fetch('/api/labs/portal/reverify', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reverifyDocs)
      });
      const data = await res.json();
      if (data.success) {
        setLab({ ...lab, approvalStatus: 'PENDING' });
      } else {
        alert(data.message || 'Failed to request re-verification');
      }
    } catch (err) {
      alert('Network error while requesting re-verification');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profileFiles.frontImage && !profileFiles.insideImage && !profileFiles.equipmentImage) {
      showToast('Please select at least one photo to update.', 'error');
      return;
    }

    // Check file sizes
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if ((profileFiles.frontImage && profileFiles.frontImage.size > MAX_SIZE) ||
        (profileFiles.insideImage && profileFiles.insideImage.size > MAX_SIZE) ||
        (profileFiles.equipmentImage && profileFiles.equipmentImage.size > MAX_SIZE)) {
      showToast('Images must be smaller than 5MB each.', 'error');
      return;
    }

    setIsUpdatingProfile(true);
    try {
      const formData = new FormData();
      if (profileFiles.frontImage) formData.append('frontImage', profileFiles.frontImage);
      if (profileFiles.insideImage) formData.append('insideImage', profileFiles.insideImage);
      if (profileFiles.equipmentImage) formData.append('equipmentImage', profileFiles.equipmentImage);

      const res = await fetch('/api/labs/portal/profile', {
        method: 'PUT',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        showToast('Facility photos uploaded successfully!', 'success');
        // Clear files after successful upload
        setProfileFiles({ frontImage: null, insideImage: null, equipmentImage: null });
      } else {
        showToast(data.message || 'Failed to update photos', 'error');
      }
    } catch (err) {
      showToast('Network error while updating photos', 'error');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const updateTestSettings = async (testId: string, updates: { available?: boolean; customLabPrice?: number }) => {
    if (updates.available !== undefined) {
      setCatalogTests(tests => tests.map(t => t.id === testId ? { ...t, available: updates.available } : t));
    }
    
    try {
      const res = await fetch('/api/labs/portal/tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testId, ...updates })
      });
      const data = await res.json();
      if (!data.success) {
        // Revert on failure
        if (updates.available !== undefined) {
          setCatalogTests(tests => tests.map(t => t.id === testId ? { ...t, available: !updates.available } : t));
        }
        showToast(data.message || 'Failed to update test', 'error');
      } else {
        if (updates.customLabPrice !== undefined) {
          // Use server calculated selling price
          setCatalogTests(tests => tests.map(t => t.id === testId ? { 
            ...t, 
            customLabPrice: updates.customLabPrice,
            calculatedSellingPrice: data.labTest?.calculatedSellingPrice || t.sellingPrice
          } : t));
          showToast('Price updated successfully', 'success');
          setEditingPrices(prev => { const next = {...prev}; delete next[testId]; return next; });
        } else {
          showToast('Test availability updated', 'success');
        }
      }
    } catch (err) {
       if (updates.available !== undefined) {
         setCatalogTests(tests => tests.map(t => t.id === testId ? { ...t, available: !updates.available } : t));
       }
       showToast('Network error', 'error');
    }
  };

  const updatePackageSettings = async (packageId: string, updates: { available?: boolean; customLabPrice?: number }) => {
    if (updates.available !== undefined) {
      setCatalogPackages(pkgs => pkgs.map(p => p.id === packageId ? { ...p, available: updates.available } : p));
    }
    
    try {
      const res = await fetch('/api/labs/portal/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId, ...updates })
      });
      const data = await res.json();
      if (!data.success) {
        if (updates.available !== undefined) {
          setCatalogPackages(pkgs => pkgs.map(p => p.id === packageId ? { ...p, available: !updates.available } : p));
        }
        showToast(data.message || 'Failed to update package', 'error');
      } else {
        if (updates.customLabPrice !== undefined) {
          setCatalogPackages(pkgs => pkgs.map(p => p.id === packageId ? { 
            ...p, 
            customLabPrice: updates.customLabPrice,
            calculatedSellingPrice: data.labPackage?.calculatedSellingPrice || p.sellingPrice
          } : p));
          showToast('Price updated successfully', 'success');
          setEditingPrices(prev => { const next = {...prev}; delete next[packageId]; return next; });
        } else {
          showToast('Package availability updated', 'success');
        }
      }
    } catch (err) {
       if (updates.available !== undefined) {
         setCatalogPackages(pkgs => pkgs.map(p => p.id === packageId ? { ...p, available: !updates.available } : p));
       }
       showToast('Network error', 'error');
    }
  };

  const handleCreateCustomPackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPackageName || !customPackagePrice || selectedCustomPackageTests.length === 0) {
      showToast('Please fill all required fields and select at least one test', 'error');
      return;
    }
    
    setIsCreatingPackage(true);
    try {
      const res = await fetch('/api/labs/portal/packages/custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: customPackageName,
          description: customPackageDescription || 'Custom health package',
          testIds: selectedCustomPackageTests,
          customLabPrice: Number(customPackagePrice)
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Custom package created successfully!', 'success');
        // Refresh packages list
        const pkgsRes = await fetch('/api/labs/portal/packages');
        const pkgsData = await pkgsRes.json();
        if (pkgsData.success) {
          setCatalogPackages(pkgsData.packages);
        }
        // Reset modal
        setIsCreateCustomPackageModalOpen(false);
        setCustomPackageName('');
        setCustomPackageDescription('');
        setCustomPackagePrice('');
        setSelectedCustomPackageTests([]);
      } else {
        showToast(data.message || 'Failed to create package', 'error');
      }
    } catch (err) {
      showToast('Network error', 'error');
    } finally {
      setIsCreatingPackage(false);
    }
  };

  const payoutBookings = labBookings.filter(b => b.labBaseAmount > 0 && b.status !== 'CANCELLED' && b.status !== 'BOOKING_RECEIVED' && b.status !== 'COLLECTION_SCHEDULED' && b.status !== 'COLLECTOR_ASSIGNED' && b.status !== 'SAMPLE_COLLECTED');
  const totalWholesaleEarned = payoutBookings.reduce((sum, b) => sum + (b.labBaseAmount || 0), 0);
  const totalPendingPayout = payoutBookings.filter(b => b.labPayoutStatus === 'PENDING').reduce((sum, b) => sum + (b.labBaseAmount || 0), 0);
  const totalPaidPayout = payoutBookings.filter(b => b.labPayoutStatus === 'PAID').reduce((sum, b) => sum + (b.labBaseAmount || 0), 0);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading secure portal...</div>;
  }

  if (error || !lab) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <p className="text-red-600">{error || 'Portal access restricted'}</p>
        <Button onClick={() => router.push('/partner-login')}>Return to Login</Button>
      </div>
    );
  }

  if (lab.approvalStatus === 'PENDING') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="max-w-md p-8 text-center space-y-4">
          <Clock className="w-12 h-12 text-amber-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Account Under Verification</h2>
          <p className="text-slate-500 text-sm">
            Your laboratory registration is currently being reviewed by our administration team. 
            Once your provided documents are verified, this dashboard will be unlocked.
          </p>
        </Card>
      </div>
    );
  }

  if (lab.approvalStatus === 'REJECTED' || lab.approvalStatus === 'TERMINATED') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12">
        <Card className="max-w-xl w-full p-8 space-y-6 border-red-100 shadow-xl text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Account Inactive</h2>
            <p className="text-slate-500 text-sm mt-2">
              Your laboratory account has been deactivated by the administration. 
              You can apply for re-verification by providing updated and correct document links below.
            </p>
          </div>
          
          <div className="bg-slate-50 rounded-xl p-5 text-left border border-slate-200 space-y-4">
            <h3 className="font-semibold text-slate-800 border-b border-slate-200 pb-2 mb-3">Provide Updated Documents</h3>
            <Input
              label="New Govt Registration Document Link"
              placeholder="e.g., Google Drive link to PDF"
              value={reverifyDocs.documentUrl}
              onChange={(e) => setReverifyDocs(prev => ({ ...prev, documentUrl: e.target.value }))}
              required
            />
            <Input
              label="New Front Facility Photo Link"
              placeholder="e.g., Imgur link to photo"
              value={reverifyDocs.frontImageUrl}
              onChange={(e) => setReverifyDocs(prev => ({ ...prev, frontImageUrl: e.target.value }))}
              required
            />
            <Input
              label="New Inside Reception Photo Link"
              placeholder="e.g., Imgur link to photo"
              value={reverifyDocs.insideImageUrl}
              onChange={(e) => setReverifyDocs(prev => ({ ...prev, insideImageUrl: e.target.value }))}
              required
            />
            <Input
              label="New Lab Equipment Photo Link"
              placeholder="e.g., Imgur link to photo"
              value={reverifyDocs.equipmentImageUrl}
              onChange={(e) => setReverifyDocs(prev => ({ ...prev, equipmentImageUrl: e.target.value }))}
              required
            />
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <Button 
              onClick={handleReverify}
              disabled={isUpdating || !reverifyDocs.documentUrl || !reverifyDocs.frontImageUrl || !reverifyDocs.insideImageUrl || !reverifyDocs.equipmentImageUrl}
              className="w-full bg-brand-600 hover:bg-brand-700 h-12 text-base font-bold"
            >
              {isUpdating ? 'Applying...' : 'Submit Updated Documents for Re-verification'}
            </Button>
            <a href="mailto:support@quicklabz.com?subject=Lab Re-verification Request" className="inline-block w-full text-center">
              <span className="text-sm font-semibold text-slate-500 hover:text-brand-600 hover:underline">
                Need help? Email Support Team
              </span>
            </a>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-brand-600" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {lab.name} • Partner Portal
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Manage your incoming specimens, control your test catalog, and view your revenue.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <span className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold w-max self-end">
            ✓ Verified Partner Laboratory
          </span>
          <div className="flex overflow-x-auto snap-x bg-slate-100 p-1 rounded-xl [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap flex-shrink-0 snap-start ${
                activeTab === 'bookings' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Live Bookings
            </button>
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap flex-shrink-0 snap-start ${
                activeTab === 'catalog' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Test Catalog & Pricing
            </button>
            <button
              onClick={() => setActiveTab('packages')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap flex-shrink-0 snap-start ${
                activeTab === 'packages' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Health Packages
            </button>
            <button
              onClick={() => setActiveTab('payouts')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap flex-shrink-0 snap-start ${
                activeTab === 'payouts' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Payout Details
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap flex-shrink-0 snap-start ${
                activeTab === 'profile' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Facility Photos
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'packages' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <Card className="p-6 sm:p-8 border-slate-200 shadow-sm mx-auto">
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Manage Your Health Packages</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Opt-in to provide full body health packages via your laboratory. You can also customize your B2B rates.
                </p>
              </div>
              <Button onClick={() => setIsCreateCustomPackageModalOpen(true)} className="whitespace-nowrap font-bold h-10 shadow-md">
                + Create Custom Package
              </Button>
            </div>
            
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                    <tr>
                      <th className="px-6 py-4">Package Name</th>
                      <th className="px-6 py-4">Your Package Price</th>
                      <th className="px-6 py-4 text-center">Offer This Package?</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {catalogPackages.map((pkg) => {
                      const isEditing = editingPrices[pkg.id] !== undefined;
                      const priceValue = isEditing ? editingPrices[pkg.id] : (pkg.customLabPrice || pkg.labPrice);
                      return (
                        <tr key={pkg.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-semibold text-slate-800">
                            {pkg.name}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="relative">
                                <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input 
                                  type="number" 
                                  value={priceValue}
                                  onChange={(e) => setEditingPrices({...editingPrices, [pkg.id]: e.target.value})}
                                  disabled={!pkg.available}
                                  className="w-32 pl-8 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 disabled:bg-slate-100 disabled:text-slate-400"
                                />
                              </div>
                              {isEditing && (
                                <Button 
                                  size="sm" 
                                  onClick={() => updatePackageSettings(pkg.id, { customLabPrice: Number(priceValue) })}
                                  className="h-8 px-3 text-xs"
                                >
                                  Save
                                </Button>
                              )}
                            </div>
                            {pkg.available && (
                              <div className="text-[10px] text-slate-500 mt-1 font-semibold">
                                Selling Price (inc. platform margin): ₹{pkg.calculatedSellingPrice || Math.round(Number(priceValue) * 1.30)}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <label className="relative flex justify-center items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                checked={pkg.available}
                                onChange={(e) => updatePackageSettings(pkg.id, { available: e.target.checked })}
                              />
                              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
                            </label>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <Card className="p-6 sm:p-8 border-slate-200 shadow-sm max-w-3xl mx-auto">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">Manage Facility Photos</h2>
              <p className="text-sm text-slate-500 mt-1">
                Upload real photos of your laboratory. Maximum size is 5MB per image. 
                Uploading a new photo will automatically replace your old one.
              </p>
            </div>
            
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Front Facility Photo</label>
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2">
                  <Upload className="w-5 h-5 text-slate-400 shrink-0" />
                  <input
                    type="file"
                    accept="image/jpeg, image/png, image/webp"
                    className="text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 cursor-pointer w-full"
                    onChange={(e) => setProfileFiles(prev => ({ ...prev, frontImage: e.target.files?.[0] || null }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Inside Reception Photo</label>
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2">
                  <Upload className="w-5 h-5 text-slate-400 shrink-0" />
                  <input
                    type="file"
                    accept="image/jpeg, image/png, image/webp"
                    className="text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 cursor-pointer w-full"
                    onChange={(e) => setProfileFiles(prev => ({ ...prev, insideImage: e.target.files?.[0] || null }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Lab Equipment Photo</label>
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2">
                  <Upload className="w-5 h-5 text-slate-400 shrink-0" />
                  <input
                    type="file"
                    accept="image/jpeg, image/png, image/webp"
                    className="text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 cursor-pointer w-full"
                    onChange={(e) => setProfileFiles(prev => ({ ...prev, equipmentImage: e.target.files?.[0] || null }))}
                  />
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-100">
                <Button 
                  type="submit" 
                  variant="accent" 
                  disabled={isUpdatingProfile}
                  className="w-full sm:w-auto font-bold px-8 h-12 shadow-lg shadow-accent-500/20"
                >
                  {isUpdatingProfile ? 'Uploading...' : 'Upload Photos'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="space-y-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-5 space-y-1 border-slate-200">
              <span className="text-xs text-slate-500 font-semibold">Assigned Lab Bookings</span>
              <div className="text-2xl font-black text-slate-900">{labBookings.length}</div>
              <span className="text-[11px] text-brand-600 font-semibold">Total active queue</span>
            </Card>

            <Card className="p-5 space-y-1 border-slate-200">
              <span className="text-xs text-slate-500 font-semibold">Pending Acceptance</span>
              <div className="text-2xl font-black text-amber-600">
                {labBookings.filter(b => b.status === 'BOOKING_RECEIVED').length}
              </div>
              <span className="text-[11px] text-slate-500">Awaiting your confirmation</span>
            </Card>

            <Card className="p-5 space-y-1 border-slate-200">
              <span className="text-xs text-slate-500 font-semibold">Pending Delivery</span>
              <div className="text-2xl font-black text-blue-600">
                {labBookings.filter(b => b.status === 'SAMPLE_COLLECTED').length}
              </div>
              <span className="text-[11px] text-blue-600 font-semibold">Incoming from collectors</span>
            </Card>

            <Card className="p-5 space-y-1 border-slate-200">
              <span className="text-xs text-slate-500 font-semibold">Total Wholesale Revenue</span>
              <div className="text-2xl font-black text-slate-900">₹{totalWholesaleEarned}</div>
              <span className="text-[11px] text-slate-500">Settled on monthly cycle</span>
            </Card>
          </div>

          {/* Lab Order Queue Table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Specimen Accession & Reporting Queue</h2>
              <span className="text-xs text-slate-500">Action required on pending items</span>
            </div>

            <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-subtle">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Booking Details</th>
                    <th className="py-3 px-4">Test Name</th>
                    <th className="py-3 px-4">Lab Payout</th>
                    <th className="py-3 px-4">Status & Handoff</th>
                    <th className="py-3 px-4 text-right">Lab Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {labBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-black text-brand-600 mb-1">{b.bookingNumber}</div>
                        <strong className="text-slate-900 block">{b.patientName}</strong>
                        <span className="text-[10px] text-slate-500">{b.patientAge} Yrs / {b.patientGender}</span>
                      </td>
                      <td className="py-3 px-4 font-semibold max-w-[200px] truncate">
                        {b.testName}
                      </td>
                      <td className="py-3 px-4 font-extrabold text-slate-900">
                        ₹{b.labWholesaleAmount}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={
                          b.status === 'CANCELLED' ? 'rose' :
                          b.status === 'BOOKING_RECEIVED' ? 'amber' :
                          b.status === 'SAMPLE_COLLECTED' ? 'blue' :
                          b.status === 'REPORT_DELIVERED' ? 'green' : 'slate'
                        }>
                          {b.status.replace(/_/g, ' ')}
                        </Badge>
                        <div className="text-[10px] text-slate-500 mt-1">
                          {b.collector ? `Collector: ${b.collector}` : 'No collector assigned'}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {b.status === 'BOOKING_RECEIVED' && (
                          <Button 
                            size="sm" 
                            variant="primary" 
                            className="text-[11px] py-1 h-auto"
                            disabled={isUpdating}
                            onClick={() => updateBookingStatus(b.id, 'LAB_CONFIRMED')}
                          >
                            Accept Booking
                          </Button>
                        )}
                        
                        {b.status === 'LAB_CONFIRMED' && (
                          <div className="flex flex-col gap-2">
                            <select 
                              className="text-[11px] p-1 border border-slate-300 rounded focus:ring-1 focus:ring-brand-500 bg-white"
                              onChange={(e) => {
                                if (e.target.value) {
                                  updateBookingStatus(b.id, 'COLLECTOR_ASSIGNED', e.target.value);
                                }
                              }}
                              disabled={isUpdating}
                              defaultValue=""
                            >
                              <option value="" disabled>Select Collector to Assign</option>
                              {collectors.map(c => (
                                <option key={c.id} value={c.id}>{c.name} ({c.area})</option>
                              ))}
                            </select>
                          </div>
                        )}
                        
                        {b.status === 'SAMPLE_COLLECTED' && (
                          <Button 
                            size="sm" 
                            variant="primary" 
                            className="text-[11px] py-1 h-auto"
                            disabled={isUpdating}
                            onClick={() => updateBookingStatus(b.id, 'SAMPLE_RECEIVED_AT_LAB')}
                          >
                            Mark Sample Received
                          </Button>
                        )}

                        {b.status === 'SAMPLE_RECEIVED_AT_LAB' && (
                          <Button 
                            size="sm" 
                            variant="accent" 
                            className="text-[11px] py-1 h-auto"
                            disabled={isUpdating}
                            onClick={() => setSelectedBookingForReport(b)}
                          >
                            Upload Report
                          </Button>
                        )}

                        {b.status === 'REPORT_DELIVERED' && (
                          <span className="text-emerald-600 font-bold text-xs flex items-center justify-end gap-1">
                            <CheckCircle2 className="w-4 h-4"/> Completed
                          </span>
                        )}
                        
                        {(b.status === 'COLLECTOR_ASSIGNED' || b.status === 'COLLECTION_SCHEDULED') && (
                          <span className="text-slate-500 font-semibold text-[11px]">
                            Awaiting Collector
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {labBookings.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500">
                        No bookings found for your laboratory yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'catalog' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
             <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900">Manage Your Test Offerings</h2>
              <p className="text-xs text-slate-500">Toggle the tests you wish to offer. QuickLabz transparently displays your payout versus our commission.</p>
             </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-4 px-6">Test Name & Category</th>
                  <th className="py-4 px-6 text-brand-700 font-extrabold bg-brand-50/50">Your Test Price</th>
                  <th className="py-4 px-6 text-right">Offer This Test?</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {catalogTests.map(test => {
                  const payout = test.customLabPrice || test.labPrice;
                  const isEditing = editingPrices[test.id] !== undefined;
                  return (
                    <tr key={test.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900">{test.name}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{test.category?.name || 'General'}</div>
                      </td>
                      <td className="py-4 px-6 font-black text-brand-700 bg-brand-50/20 text-sm">
                        <div className="flex items-center gap-2">
                          {isEditing ? (
                            <div className="flex flex-col gap-1">
                              <input 
                                type="number" 
                                className="w-20 px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-brand-500" 
                                value={editingPrices[test.id]}
                                onChange={(e) => setEditingPrices(p => ({...p, [test.id]: e.target.value}))}
                              />
                              <div className="flex gap-2">
                                <button className="text-[10px] text-emerald-600 font-bold hover:underline" onClick={() => updateTestSettings(test.id, { customLabPrice: parseFloat(editingPrices[test.id]) })}>Save</button>
                                <button className="text-[10px] text-slate-500 hover:underline" onClick={() => setEditingPrices(p => { const next = {...p}; delete next[test.id]; return next; })}>Cancel</button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <span>₹{payout}</span>
                              {test.available && (
                                <button className="text-brand-600 underline text-[10px] font-normal" onClick={() => setEditingPrices(p => ({...p, [test.id]: String(payout)}))}>Edit</button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={test.available}
                            onChange={() => updateTestSettings(test.id, { available: !test.available })}
                          />
                          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-500"></div>
                        </label>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'packages' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
             <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900">Manage Your Health Packages</h2>
              <p className="text-xs text-slate-500">Opt-in to provide full body health packages via your laboratory. You can also customize your B2B rates.</p>
             </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-4 px-6">Package Name</th>
                  <th className="py-4 px-6 text-brand-700 font-extrabold bg-brand-50/50">Your Package Price</th>
                  <th className="py-4 px-6 text-right">Offer This Package?</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {catalogPackages.map(pkg => {
                  const payout = pkg.customLabPrice || pkg.labPrice;
                  const isEditing = editingPrices[pkg.id] !== undefined;
                  return (
                    <tr key={pkg.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900">{pkg.name}</div>
                      </td>
                      <td className="py-4 px-6 font-black text-brand-700 bg-brand-50/20 text-sm">
                        <div className="flex items-center gap-2">
                          {isEditing ? (
                            <div className="flex flex-col gap-1">
                              <input 
                                type="number" 
                                className="w-20 px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-brand-500" 
                                value={editingPrices[pkg.id]}
                                onChange={(e) => setEditingPrices(p => ({...p, [pkg.id]: e.target.value}))}
                              />
                              <div className="flex gap-2">
                                <button className="text-[10px] text-emerald-600 font-bold hover:underline" onClick={() => updatePackageSettings(pkg.id, { customLabPrice: parseFloat(editingPrices[pkg.id]) })}>Save</button>
                                <button className="text-[10px] text-slate-500 hover:underline" onClick={() => setEditingPrices(p => { const next = {...p}; delete next[pkg.id]; return next; })}>Cancel</button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <span>₹{payout}</span>
                              {pkg.available && (
                                <button className="text-brand-600 underline text-[10px] font-normal" onClick={() => setEditingPrices(p => ({...p, [pkg.id]: String(payout)}))}>Edit</button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={pkg.available}
                            onChange={() => updatePackageSettings(pkg.id, { available: !pkg.available })}
                          />
                          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-500"></div>
                        </label>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'payouts' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="p-5 space-y-1 border-slate-200">
                  <span className="text-xs text-slate-500 font-semibold">Total Wholesale Value</span>
                  <div className="text-2xl font-black text-slate-900">₹{totalWholesaleEarned}</div>
                  <span className="text-[11px] text-slate-500">Lifetime value</span>
                </Card>
                <Card className="p-5 space-y-1 border-emerald-200 bg-emerald-50/30">
                  <span className="text-xs text-emerald-700 font-semibold">Paid to Bank</span>
                  <div className="text-2xl font-black text-emerald-700">₹{totalPaidPayout}</div>
                  <span className="text-[11px] text-emerald-600">Successfully settled</span>
                </Card>
                <Card className="p-5 space-y-1 border-amber-200 bg-amber-50/30">
                  <span className="text-xs text-amber-700 font-semibold">Pending Payout</span>
                  <div className="text-2xl font-black text-amber-700">₹{totalPendingPayout}</div>
                  <span className="text-[11px] text-amber-600">To be settled next cycle</span>
                </Card>
              </div>

              {/* Payouts Table */}
              <Card className="border-slate-200 overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900">Recent Payout Activity</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
                      <tr>
                        <th className="py-3 px-5">Booking ID</th>
                        <th className="py-3 px-5">Test / Package</th>
                        <th className="py-3 px-5 text-right">Wholesale Amount</th>
                        <th className="py-3 px-5 text-center">Payout Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {payoutBookings.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-8 text-center text-slate-500">No payout activity yet</td>
                        </tr>
                      ) : (
                        payoutBookings.map((b) => (
                          <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                            <td className="py-3 px-5 font-bold text-brand-600">{b.bookingNumber}</td>
                            <td className="py-3 px-5 text-slate-700">{b.bookingItems?.[0]?.itemName || 'Unknown Test'}</td>
                            <td className="py-3 px-5 font-bold text-slate-900 text-right">₹{b.labBaseAmount}</td>
                            <td className="py-3 px-5 text-center">
                              <span className={`inline-flex px-2 py-1 rounded text-[10px] font-bold ${b.labPayoutStatus === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                {b.labPayoutStatus === 'PAID' ? 'PAID' : 'PENDING'}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            {/* Settings Card */}
            <div>
              <Card className="p-6 space-y-6 border-slate-200">
                <div className="space-y-2">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                    Bank Details
                  </h2>
                  <p className="text-xs text-slate-500">
                    Update your UPI ID to receive wholesale payouts for completed specimen tests.
                  </p>
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <p className="text-[11px] text-emerald-800 leading-relaxed font-medium">
                    <strong>Payout Schedule:</strong> Payouts for completed bookings are usually processed securely within <strong>1 week</strong> of report delivery.
                  </p>
                </div>

                <form onSubmit={handlePayoutSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-semibold text-slate-700 uppercase tracking-wider">
                      UPI ID (Unified Payments Interface)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. yourname@upi or 9876543210@paytm"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full bg-white border border-surface-border focus:border-brand-500 focus:ring-brand-500 rounded-lg px-3 py-2 text-sm text-slate-800"
                    />
                  </div>

                  <div className="flex flex-col gap-2 pt-2">
                    <Button size="sm" variant="primary" type="submit" disabled={isSavingPayout} className="w-full">
                      {isSavingPayout ? 'Saving...' : 'Save Payout Details'}
                    </Button>
                    
                    {savePayoutStatus === 'success' && (
                      <div className="flex justify-center items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2 py-1.5 rounded-lg text-xs font-bold animate-in fade-in duration-300">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Saved successfully
                      </div>
                    )}
                    {savePayoutStatus === 'error' && (
                      <div className="flex justify-center items-center gap-1.5 text-rose-600 bg-rose-50 px-2 py-1.5 rounded-lg text-xs font-bold animate-in fade-in duration-300">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Failed to save
                      </div>
                    )}
                  </div>
                </form>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Upload Report Modal */}
      {selectedBookingForReport && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedBookingForReport(null)}
          title={`Upload Report for ${selectedBookingForReport.bookingNumber}`}
          subtitle={`Patient: ${selectedBookingForReport.patientName} • Test: ${selectedBookingForReport.bookingItems?.[0]?.itemName || 'Unknown Test'}`}
        >
          <form onSubmit={handleUploadReport} className="space-y-4">
            <Input
              label="Signing Pathologist Doctor Name"
              value={reportDoctor}
              onChange={(e) => setReportDoctor(e.target.value)}
              required
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Clinical Pathology Summary / Remarks
              </label>
              <textarea
                rows={3}
                required
                placeholder="Enter pathologist remarks and conclusion..."
                value={reportSummary}
                onChange={(e) => setReportSummary(e.target.value)}
                className="w-full bg-white border border-surface-border rounded-xl p-3 text-xs text-slate-800"
              />
            </div>

            <label className="block p-4 border-2 border-dashed border-slate-300 rounded-2xl text-center space-y-2 hover:border-brand-500 cursor-pointer transition-colors relative">
              <input 
                type="file" 
                accept=".pdf,image/*" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                onChange={(e) => setReportFile(e.target.files?.[0] || null)}
              />
              <Upload className="w-6 h-6 text-slate-400 mx-auto" />
              <p className="text-xs font-semibold text-slate-700">
                {reportFile ? reportFile.name : "Attach Lab Analyzer Raw PDF / Results"}
              </p>
              <span className="text-[10px] text-slate-400">PDF, JPG or PNG up to 10MB</span>
            </label>

            <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
              <input 
                type="checkbox" 
                id="confirm-report" 
                className="mt-0.5" 
                checked={reportConfirmed} 
                onChange={(e) => setReportConfirmed(e.target.checked)} 
              />
              <label htmlFor="confirm-report" className="text-xs text-amber-800 leading-relaxed cursor-pointer select-none">
                <strong>WARNING:</strong> I have double-checked that this file belongs to patient <strong>{selectedBookingForReport.patientName}</strong> and strictly matches their booked test ({selectedBookingForReport.bookingItems?.[0]?.itemName || 'Unknown Test'}). Uploading incorrect reports can have severe consequences.
              </label>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button type="button" size="sm" variant="outline" onClick={() => setSelectedBookingForReport(null)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" variant="accent" className="font-bold" disabled={!reportConfirmed || !reportFile}>
                Publish & Notify Patient
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Create Custom Package Modal */}
      <Modal
        isOpen={isCreateCustomPackageModalOpen}
        onClose={() => setIsCreateCustomPackageModalOpen(false)}
        title="Create Custom Package"
        subtitle="Bundle your available tests into a unique package."
        maxWidth="lg"
      >
        <form onSubmit={handleCreateCustomPackage} className="space-y-4">
          <Input
            label="Package Name"
            placeholder="e.g. Total Body Assessment"
            value={customPackageName}
            onChange={(e) => setCustomPackageName(e.target.value)}
            required
          />
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="Brief description of the package..."
              value={customPackageDescription}
              onChange={(e) => setCustomPackageDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
          <Input
            label="Your Base Price (₹)"
            type="number"
            placeholder="e.g. 1500"
            value={customPackagePrice}
            onChange={(e) => setCustomPackagePrice(e.target.value)}
            required
          />
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Select Tests to Include
            </label>
            <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl bg-slate-50 p-2 space-y-1">
              {catalogTests.filter(t => t.available).map(test => (
                <label key={test.id} className="flex items-center gap-2 p-2 hover:bg-white rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCustomPackageTests.includes(test.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCustomPackageTests([...selectedCustomPackageTests, test.id]);
                      } else {
                        setSelectedCustomPackageTests(selectedCustomPackageTests.filter(id => id !== test.id));
                      }
                    }}
                    className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
                  />
                  <span className="text-sm font-medium text-slate-800">{test.name}</span>
                </label>
              ))}
              {catalogTests.filter(t => t.available).length === 0 && (
                <div className="p-4 text-center text-sm text-slate-500">
                  You haven't opted into any tests yet. Opt into tests from the Catalog tab first.
                </div>
              )}
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsCreateCustomPackageModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="accent" disabled={isCreatingPackage}>
              {isCreatingPackage ? 'Creating...' : 'Create Package'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Custom Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex items-center px-5 py-3.5 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom-8 fade-in duration-300 border backdrop-blur-2xl ${
          toastMessage.type === 'success' ? 'bg-slate-900/90 border-brand-500/30 text-white shadow-[0_0_30px_rgba(59,130,246,0.2)]' : 'bg-red-950/90 border-red-500/30 text-red-100 shadow-[0_0_30px_rgba(239,68,68,0.2)]'
        }`}>
          {toastMessage.type === 'success' ? (
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mr-3 shadow-inner border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          ) : (
             <div className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mr-3 shadow-inner border border-red-500/20">
              <AlertCircle className="w-4 h-4" />
            </div>
          )}
          <span className="font-bold text-sm tracking-wide mr-2">{toastMessage.message}</span>
        </div>
      )}
    </div>
  );
}
