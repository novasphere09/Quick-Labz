'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  User,
  MapPin,
  FlaskConical,
  Building2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ChevronLeft,
  Clock,
  ShieldCheck,
  Tag,
  Phone,
  Printer,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { calculateReferralEarning } from '@/lib/referral';
import { usePincodeLookup } from '@/hooks/usePincodeLookup';

function BookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialTestId = searchParams.get('testId');
  const initialPkgId = searchParams.get('packageId');
  const initialLabId = searchParams.get('labId');
  const initialRef = searchParams.get('ref');

  // Multi-step index: 1 to 6 (7 is confirmation)
  const [currentStep, setCurrentStep] = useState(1);

  // Selected item state
  const [selectedItemType, setSelectedItemType] = useState<'TEST' | 'PACKAGE'>(
    initialPkgId ? 'PACKAGE' : 'TEST'
  );
  const [selectedTestId, setSelectedTestId] = useState<string>(initialTestId || '');
  const [selectedPackageId, setSelectedPackageId] = useState<string>(initialPkgId || '');
  
  const [tests, setTests] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  
  const [labs, setLabs] = useState<any[]>([]);
  const [isLoadingLabs, setIsLoadingLabs] = useState(true);

  useEffect(() => {
    async function fetchCatalog() {
      try {
        const [testsRes, packagesRes] = await Promise.all([
          fetch('/api/tests'),
          fetch('/api/packages')
        ]);
        
        const testsData = await testsRes.json();
        const packagesData = await packagesRes.json();
        
        if (testsData.success && testsData.tests.length > 0) {
          setTests(testsData.tests);
          if (!initialTestId) setSelectedTestId(testsData.tests[0].id);
        }
        
        if (packagesData.success && packagesData.packages.length > 0) {
          setPackages(packagesData.packages);
          if (!initialPkgId) setSelectedPackageId(packagesData.packages[0].id);
        }
      } catch (e) {
        console.error('Failed to fetch catalog for booking:', e);
      }
    }
    fetchCatalog();
  }, [initialTestId, initialPkgId]);

  useEffect(() => {
    async function fetchLabs() {
      setIsLoadingLabs(true);
      try {
        let url = '/api/labs';
        if (selectedItemType === 'TEST' && selectedTestId) {
          url += `?testId=${selectedTestId}`;
        } else if (selectedItemType === 'PACKAGE' && selectedPackageId) {
          url += `?packageId=${selectedPackageId}`;
        }
        
        const labsRes = await fetch(url);
        const labsData = await labsRes.json();
        
        if (labsData.success) {
          setLabs(labsData.labs);
          // If no lab is selected, or the currently selected lab is not in the new list, auto-select the first available
          if (labsData.labs.length > 0) {
            if (!initialLabId || !labsData.labs.find((l: any) => l.id === initialLabId)) {
               setSelectedLabId(labsData.labs[0].id);
            }
          } else {
             setSelectedLabId('');
          }
        }
      } catch (e) {
        console.error('Failed to fetch labs for booking:', e);
      } finally {
        setIsLoadingLabs(false);
      }
    }
    
    // Fetch labs only if we have a valid selection
    if ((selectedItemType === 'TEST' && selectedTestId) || (selectedItemType === 'PACKAGE' && selectedPackageId)) {
       fetchLabs();
    }
  }, [selectedItemType, selectedTestId, selectedPackageId, initialLabId]);

  const [selectedLabId, setSelectedLabId] = useState<string>(initialLabId || '');

  const { data: session } = useSession();

  // Step 1: Patient details
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientGender, setPatientGender] = useState('Male');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      if (session?.user) {
        try {
          const res = await fetch('/api/user/profile');
          const data = await res.json();
          if (data.success) {
            const profile = data.profile;
            const address = data.addresses?.[0];
            
            if (profile) {
              setPatientName(profile.fullName || session.user.name || '');
              setPatientAge(profile.age?.toString() || '');
              setPatientGender(profile.gender || 'Male');
            } else {
              setPatientName(session.user.name || '');
            }
            
            if (data.user?.phone) {
              setPatientPhone(data.user.phone);
              setIsPhoneVerified(true);
            }
            if (data.user?.email) {
              setPatientEmail(data.user.email);
            } else {
              setPatientEmail(session.user.email || '');
            }
            
            if (address) {
              setHouse(address.house || '');
              setStreet(address.street || '');
              setArea(address.area || '');
              setCity(address.city || 'Delhi NCR');
              setState(address.state || 'Delhi NCR');
              setPincode(address.pincode || '');
              if (address.landmark) setLandmark(address.landmark);
            }
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
    fetchProfile();
  }, [session]);

  const handleSendOtp = () => {
    if (patientPhone.length === 10) {
      setOtpSent(true);
      // MOCK OTP LOGIC
      // alert('Mock OTP sent to ' + patientPhone + '. Use 1234 to verify.');
    } else {
      setErrors({ ...errors, patientPhone: 'Must be 10 digits' });
    }
  };

  const handleVerifyOtp = () => {
    if (otp === '1234') {
      setIsPhoneVerified(true);
      setOtpSent(false);
      setErrors({ ...errors, otp: '' });
    } else {
      setErrors({ ...errors, otp: 'Invalid OTP' });
    }
  };

  // Step 2: Doorstep Address
  const [house, setHouse] = useState('');
  const [street, setStreet] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [landmark, setLandmark] = useState('');
  const { lookupPincode, isLookingUp } = usePincodeLookup();

  useEffect(() => {
    if (pincode.length === 6) {
      const fetchLocation = async () => {
        const location = await lookupPincode(pincode);
        if (location) {
          setCity(location.city);
          setState(location.state);
          setArea(location.area);
          setErrors(prev => ({ ...prev, pincode: '' }));
        } else {
          setErrors(prev => ({ ...prev, pincode: 'Invalid PIN code' }));
        }
      };
      fetchLocation();
    }
  }, [pincode, lookupPincode]);

  // Step 5: Collection Slot & Date
  const [scheduledDate, setScheduledDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('07:00 AM - 08:00 AM');
  const [paymentMode, setPaymentMode] = useState<'ONLINE' | 'CASH_ON_COLLECTION'>('ONLINE');

  // Step 6: Referral & Consent
  const [referralCode, setReferralCode] = useState(initialRef || '');
  const [referralValid, setReferralValid] = useState<boolean | null>(null);
  const [referralPartnerName, setReferralPartnerName] = useState('');
  const [consentAgreed, setConsentAgreed] = useState(true);
  const [bookingNotes, setBookingNotes] = useState('');

  // Confirmation result
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Current selected test / package object
  const activeTest = tests.find((t) => t.id === selectedTestId) || tests[0] || {};
  const activePackage = packages.find((p) => p.id === selectedPackageId) || packages[0] || {};
  const activeLab = labs.find((l) => l.id === selectedLabId) || labs[0] || null;

  const isFastingRequired =
    selectedItemType === 'PACKAGE' ? true : activeTest.fastingRequired;
  const currentPrice =
    selectedItemType === 'PACKAGE' ? activePackage.sellingPrice : activeTest.sellingPrice;
  const itemName =
    selectedItemType === 'PACKAGE' ? activePackage.name : activeTest.name;

  const distance = activeLab?.distanceKm || 5;
  const deliveryFee = distance <= 5 ? 50 : 50 + Math.ceil(distance - 5) * 10;
  const gstAmount = parseFloat((deliveryFee * 0.18).toFixed(2));
  
  const discountAmount = referralValid ? Math.round(currentPrice * 0.05) : 0;
  const finalTotalAmount = currentPrice - discountAmount + deliveryFee + gstAmount;

  // Fasting slots vs normal slots
  const morningFastingSlots = [
    '06:00 AM - 07:00 AM',
    '07:00 AM - 08:00 AM',
    '08:00 AM - 09:00 AM',
    '09:00 AM - 10:00 AM',
  ];

  const flexibleSlots = [
    '06:30 AM - 07:30 AM',
    '07:30 AM - 08:30 AM',
    '08:30 AM - 09:30 AM',
    '10:00 AM - 11:00 AM',
    '11:30 AM - 12:30 PM',
    '02:00 PM - 03:00 PM',
    '04:00 PM - 05:00 PM',
  ];

  const availableSlots = isFastingRequired ? morningFastingSlots : flexibleSlots;

  const handleValidateReferral = async (codeToValidate?: string) => {
    const code = (typeof codeToValidate === 'string' ? codeToValidate : referralCode).trim().toUpperCase();
    if (!code) {
      setReferralValid(null);
      setReferralPartnerName('');
      return;
    }
    
    try {
      const res = await fetch(`/api/referrals/validate?code=${code}`);
      const data = await res.json();
      if (data.success) {
        setReferralValid(true);
        setReferralPartnerName(data.partnerName);
      } else {
        setReferralValid(false);
        setReferralPartnerName('');
      }
    } catch (err) {
      setReferralValid(false);
      setReferralPartnerName('');
    }
  };

  useEffect(() => {
    if (initialRef) {
      handleValidateReferral(initialRef);
    }
  }, [initialRef]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Submit Booking
  const handleConfirmBooking = async () => {
    if (!consentAgreed) {
      setSubmitError('Please agree to the healthcare data processing consent.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      let rzpOrderId = null;

      // 1. If online, create a Razorpay order first
      if (paymentMode === 'ONLINE') {
        const orderRes = await fetch('/api/payments/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: finalTotalAmount }),
        });
        const orderData = await orderRes.json();
        
        if (!orderRes.ok || !orderData.success) {
          throw new Error('Could not initialize payment gateway.');
        }
        rzpOrderId = orderData.order.id;

        const res = await loadRazorpayScript();
        if (!res) {
          throw new Error('Razorpay SDK failed to load. Are you offline?');
        }

        // Open Razorpay Widget
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
          amount: Math.round(finalTotalAmount * 100),
          currency: 'INR',
          name: 'QuickLabz HealthTech',
          description: `Booking for ${itemName}`,
          image: '/logo.png',
          order_id: rzpOrderId,
          handler: async function (response: any) {
            // Payment Success! Now save to database
            await saveBookingToDB(response);
          },
          prefill: {
            name: patientName,
            email: patientEmail,
            contact: patientPhone,
          },
          theme: { color: '#0ea5e9' },
          modal: {
            ondismiss: function () {
              setIsSubmitting(false);
            },
          },
        };

        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.open();
      } else {
        // Cash on collection, just save
        await saveBookingToDB({});
      }
    } catch (e: any) {
      setSubmitError(e.message || 'Network error occurred.');
      setIsSubmitting(false);
    }
  };

  const saveBookingToDB = async (rzpResponse: any) => {
    // Generate clean booking number
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const bookingNumber = `QLZ-2026-${randomNum}`;

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session?.user?.id || null,
          bookingNumber,
          patientName,
          patientAge: parseInt(patientAge, 10),
          patientGender,
          patientPhone,
          patientEmail,
          house,
          street,
          area,
          city,
          state,
          pincode,
          landmark,
          labId: activeLab.id,
          scheduledDate,
          timeSlot,
          fastingWindow: isFastingRequired
            ? 'Fasting 10-12 hours required before collection'
            : 'No fasting required',
          totalAmount: finalTotalAmount,
          deliveryFee,
          gstAmount,
          paymentStatus: paymentMode === 'ONLINE' ? 'PAID' : 'CASH_ON_COLLECTION',
          referralCode: referralCode || null,
          referralEarned: calculateReferralEarning(
            currentPrice,
            selectedItemType === 'PACKAGE'
          ),
          itemType: selectedItemType,
          itemId: selectedItemType === 'PACKAGE' ? activePackage.id : activeTest.id,
          itemName,
          notes: rzpResponse.razorpay_payment_id ? `Payment ID: ${rzpResponse.razorpay_payment_id}\n${bookingNotes}` : bookingNotes,
          razorpay_payment_id: rzpResponse.razorpay_payment_id,
          razorpay_order_id: rzpResponse.razorpay_order_id,
          razorpay_signature: rzpResponse.razorpay_signature,
        }),
      });

      const data = await res.json();
      
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to complete booking. Please try again.');
      }

      setConfirmedBookingId(bookingNumber);
      setCurrentStep(7);
    } catch (e: any) {
      setSubmitError(e.message || 'Network error occurred while saving booking.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepsList = [
    { num: 1, title: 'Patient' },
    { num: 2, title: 'Address' },
    { num: 3, title: 'Test' },
    { num: 4, title: 'Lab' },
    { num: 5, title: 'Slot' },
    { num: 6, title: 'Confirm' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Header */}
      {currentStep < 7 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Book Home Blood Test
            </h1>
            <Badge variant="blue" size="md">
              Step {currentStep} of 6
            </Badge>
          </div>

          {/* Stepper Bar */}
          <div className="grid grid-cols-6 gap-2">
            {stepsList.map((s) => {
              const isPassed = currentStep > s.num;
              const isCurrent = currentStep === s.num;
              return (
                <div key={s.num} className="space-y-1">
                  <div
                    className={`h-1.5 rounded-full transition-all ${
                      isPassed
                        ? 'bg-emerald-500'
                        : isCurrent
                        ? 'bg-brand-500'
                        : 'bg-slate-200'
                    }`}
                  />
                  <span
                    className={`text-[10px] uppercase font-bold hidden sm:block truncate ${
                      isCurrent
                        ? 'text-brand-600'
                        : isPassed
                        ? 'text-emerald-700'
                        : 'text-slate-400'
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 1: PATIENT DETAILS */}
      {currentStep === 1 && (
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900">Step 1: Patient Information</h2>
            <p className="text-xs text-slate-500">
              Enter the details of the person who will be providing the blood sample.
            </p>
          </div>

          <div className="space-y-4">
            <Input
              label="Full Name of Patient"
              placeholder="e.g. Rohan Sharma"
              required
              value={patientName}
              onChange={(e) => { setPatientName(e.target.value); setErrors(p => ({ ...p, patientName: '' })); }}
              error={errors.patientName}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Age (Years)"
                type="number"
                placeholder="e.g. 34"
                min={1}
                max={120}
                required
                value={patientAge}
                onChange={(e) => { setPatientAge(e.target.value); setErrors(p => ({ ...p, patientAge: '' })); }}
                error={errors.patientAge}
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Gender <span className="text-rose-500">*</span>
                </label>
                <select
                  value={patientGender}
                  onChange={(e) => setPatientGender(e.target.value)}
                  className="w-full bg-white border border-surface-border rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
              <div className="space-y-2">
                <Input
                  label="Mobile Number (for SMS & WhatsApp Report)"
                  type="tel"
                  maxLength={10}
                  placeholder="10-digit mobile"
                  required
                  value={patientPhone}
                  onChange={(e) => { 
                    setPatientPhone(e.target.value.replace(/\D/g, '')); 
                    setErrors(p => ({ ...p, patientPhone: '' })); 
                    setIsPhoneVerified(false);
                    setOtpSent(false);
                  }}
                  error={errors.patientPhone}
                  disabled={isPhoneVerified}
                />
                
                {!isPhoneVerified && patientPhone.length === 10 && !otpSent && (
                  <Button type="button" size="sm" variant="outline" onClick={handleSendOtp}>
                    Verify via SMS OTP
                  </Button>
                )}

                {otpSent && !isPhoneVerified && (
                  <div className="flex items-center gap-2 bg-indigo-50 p-2 rounded-xl border border-indigo-100">
                    <div className="flex-1">
                      <Input 
                        placeholder="Enter OTP (use 1234)" 
                        value={otp} 
                        onChange={(e) => setOtp(e.target.value)} 
                        maxLength={4}
                        error={errors.otp}
                      />
                    </div>
                    <Button type="button" size="sm" variant="accent" onClick={handleVerifyOtp} className="mt-1">
                      Verify
                    </Button>
                  </div>
                )}
                
                {isPhoneVerified && (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 px-1">
                    <CheckCircle2 className="w-4 h-4" /> Phone Verified
                  </span>
                )}
              </div>

              <Input
                label="Email Address (Optional)"
                type="email"
                placeholder="name@example.com"
                value={patientEmail}
                onChange={(e) => { setPatientEmail(e.target.value); setErrors(p => ({ ...p, patientEmail: '' })); }}
                error={errors.patientEmail}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                const newErrors: Record<string, string> = {};
                if (!patientName.trim()) newErrors.patientName = 'Required';
                
                const age = parseInt(patientAge, 10);
                if (!age || age < 1 || age > 120) newErrors.patientAge = 'Invalid age';
                
                if (!patientPhone || patientPhone.length !== 10) newErrors.patientPhone = 'Must be 10 digits';
                if (!isPhoneVerified) newErrors.patientPhone = 'Please verify your phone number via OTP';
                
                if (patientEmail && !/^\S+@\S+\.\S+$/.test(patientEmail)) newErrors.patientEmail = 'Invalid email format';

                if (Object.keys(newErrors).length > 0) {
                  setErrors(newErrors);
                  return;
                }

                setCurrentStep(2);

                if (!activeLab) {
                  setErrors({ general: 'No laboratory selected or available. Please wait for labs to load or select a lab.' });
                  return;
                }
                setCurrentStep(2);
              }}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Continue to Address
            </Button>
          </div>
          {errors.general && <p className="text-sm font-medium text-red-600 mt-2 text-right">{errors.general}</p>}
        </Card>
      )}

      {/* STEP 2: DOORSTEP ADDRESS */}
      {currentStep === 2 && (
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900">Step 2: Doorstep Collection Address</h2>
            <p className="text-xs text-slate-500">
              Where should our certified phlebotomist visit for sample collection?
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="House / Flat / Building No."
                placeholder="e.g. Flat 402, Tower 3"
                required
                value={house}
                onChange={(e) => { setHouse(e.target.value); setErrors(p => ({ ...p, house: '' })); }}
                error={errors.house}
              />
              <Input
                label="Street / Society / Layout"
                placeholder="e.g. Express Green Apartments"
                required
                value={street}
                onChange={(e) => { setStreet(e.target.value); setErrors(p => ({ ...p, street: '' })); }}
                error={errors.street}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Area / Neighborhood"
                placeholder="e.g. Vaishali Sector 4"
                required
                value={area}
                onChange={(e) => { setArea(e.target.value); setErrors(p => ({ ...p, area: '' })); }}
                error={errors.area}
              />
              <Input
                label="Landmark (Optional)"
                placeholder="e.g. Near Mahagun Mall"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="PIN Code"
                maxLength={6}
                placeholder="e.g. 201010"
                required
                value={pincode}
                onChange={(e) => { setPincode(e.target.value.replace(/\D/g, '')); setErrors(p => ({ ...p, pincode: '' })); }}
                error={errors.pincode}
                rightElement={isLookingUp ? <span className="text-xs text-brand-500 font-medium mr-2">Looking up...</span> : undefined}
              />
              <Input
                label="City"
                placeholder="e.g. Ghaziabad / Delhi"
                required
                value={city}
                onChange={(e) => { setCity(e.target.value); setErrors(p => ({ ...p, city: '' })); }}
                error={errors.city}
              />
              <Input
                label="State"
                placeholder="e.g. Delhi NCR"
                required
                value={state}
                onChange={(e) => { setState(e.target.value); setErrors(p => ({ ...p, state: '' })); }}
                error={errors.state}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <Button
              variant="outline"
              size="md"
              leftIcon={<ChevronLeft className="w-4 h-4" />}
              onClick={() => setCurrentStep(1)}
            >
              Back
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                const newErrors: Record<string, string> = {};
                if (!house.trim()) newErrors.house = 'Required';
                if (!street.trim()) newErrors.street = 'Required';
                if (!area.trim()) newErrors.area = 'Required';
                if (!city.trim()) newErrors.city = 'Required';
                if (!state.trim()) newErrors.state = 'Required';
                if (!pincode || pincode.length !== 6) newErrors.pincode = 'Must be 6 digits';

                if (Object.keys(newErrors).length > 0) {
                  setErrors(newErrors);
                  return;
                }
                setCurrentStep(3);
              }}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Continue to Test Selection
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 3: TEST / PACKAGE SELECTION */}
      {currentStep === 3 && (
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 3: Confirm Test / Package</h2>
              <p className="text-xs text-slate-500">
                Verify or select the pathology screening for this booking.
              </p>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setSelectedItemType('TEST')}
                className={`px-3 py-1 rounded-lg ${
                  selectedItemType === 'TEST' ? 'bg-brand-500 text-white' : 'text-slate-600'
                }`}
              >
                Individual Test
              </button>
              <button
                onClick={() => setSelectedItemType('PACKAGE')}
                className={`px-3 py-1 rounded-lg ${
                  selectedItemType === 'PACKAGE' ? 'bg-brand-500 text-white' : 'text-slate-600'
                }`}
              >
                Health Package
              </button>
            </div>
          </div>

          {selectedItemType === 'TEST' ? (
            <div className="space-y-4">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Select Test from Catalog
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tests.map((t) => {
                  const isSelected = selectedTestId === t.id;
                  return (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTestId(t.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-brand-500 bg-brand-50/50 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-slate-900">{t.name}</h4>
                        <span className="text-xs font-black text-brand-600">₹{t.sellingPrice}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{t.description}</p>
                      {t.fastingRequired && (
                        <span className="inline-block mt-1 px-1.5 py-0.5 text-[9px] font-bold bg-amber-100 text-amber-800 rounded">
                          Fasting {t.fastingDurationHours}h Required
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Select Preventive Health Package
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {packages.map((pkg) => {
                  const isSelected = selectedPackageId === pkg.id;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPackageId(pkg.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-brand-500 bg-brand-50/50 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{pkg.name}</h4>
                          <p className="text-xs text-slate-600 mt-0.5">{pkg.description}</p>
                          <p className="text-[11px] text-slate-500 mt-1">
                            <strong>Covered:</strong> {pkg.includedTestsSummary}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-lg font-black text-slate-900">₹{pkg.sellingPrice}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <Button
              variant="outline"
              size="md"
              leftIcon={<ChevronLeft className="w-4 h-4" />}
              onClick={() => setCurrentStep(2)}
            >
              Back
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => setCurrentStep(4)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Continue to Lab Selection
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 4: LAB SELECTION (Section 13) */}
      {currentStep === 4 && (() => {
        const searchCity = city.trim().toLowerCase();
        const searchArea = area.trim().toLowerCase();
        
        // Filter labs based on city or area
        const displayLabs = labs.filter((lab) => {
          if (!searchCity && !searchArea) return true;
          const lCity = (lab.city || '').toLowerCase();
          const lArea = (lab.area || '').toLowerCase();
          
          return (
            (searchCity && lCity.includes(searchCity)) ||
            (searchCity && searchCity.includes(lCity)) ||
            (searchCity && lArea.includes(searchCity)) ||
            (searchArea && lArea.includes(searchArea)) ||
            (searchArea && lCity.includes(searchArea))
          );
        });

        return (
          <Card className="p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900">Step 4: Select Processing Laboratory</h2>
            <p className="text-xs text-slate-500">
              Pick the partner diagnostic lab that will test your sample.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {isLoadingLabs ? (
              <div className="text-center py-6 text-slate-500">Loading available labs...</div>
            ) : displayLabs.length === 0 ? (
              <div className="text-center py-6 text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
                <p>No partner laboratories are currently available in {city || area || 'this area'}.</p>
                <Button variant="outline" className="mt-4" onClick={() => router.push('/labs')}>View All Labs</Button>
              </div>
            ) : displayLabs.map((lab) => {
              const isSelected = selectedLabId === lab.id;
              // Generate mock distances and pricing offsets
              const randomDistance = (Math.random() * 5 + 1).toFixed(1);
              const offerPrice = currentPrice + (lab.name.length % 3 === 0 ? 100 : 0);
              return (
                <div
                  key={lab.id}
                  onClick={() => setSelectedLabId(lab.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? 'border-brand-500 bg-brand-50/50 shadow-card ring-2 ring-brand-500'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 text-[9px] font-bold bg-emerald-100 text-emerald-800 rounded">
                        ★ {lab.rating} • {lab.partnerStatus}
                      </span>
                      {isSelected && (
                        <span className="text-xs font-bold text-brand-600 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Selected
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 pt-1">{lab.name}</h4>
                    <p className="text-xs text-slate-500">
                      {lab.area} ({lab.distanceKm} km away)
                    </p>
                  </div>

                  <div className="text-[11px] text-slate-600 bg-white/60 p-2 rounded-xl border border-slate-100 flex items-center justify-between">
                    <span>TAT: <strong>{lab.turnaroundText}</strong></span>
                    <span className="text-emerald-700 font-semibold">Home Pickup Active</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <Button
              variant="outline"
              size="md"
              leftIcon={<ChevronLeft className="w-4 h-4" />}
              onClick={() => setCurrentStep(3)}
            >
              Back
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                if (!selectedLabId) {
                  setErrors({ labSelection: 'Please select a laboratory to continue.' });
                  return;
                }
                setErrors(p => ({ ...p, labSelection: '' }));
                setCurrentStep(5);
              }}
            >
              Confirm Laboratory
            </Button>
          </div>
          {errors.labSelection && <p className="text-sm font-medium text-red-600 mt-2 text-right">{errors.labSelection}</p>}
        </Card>
        );
      })()}

      {/* STEP 5: COLLECTION TIME SLOT & FASTING LOGIC (Section 12 & 15) */}
      {currentStep === 5 && (
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900">Step 5: Schedule Doorstep Collection</h2>
            <p className="text-xs text-slate-500">
              Choose your preferred date and convenient doorstep arrival window.
            </p>
          </div>

          {/* Fasting Requirement Banner */}
          {isFastingRequired && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-amber-900 text-xs sm:text-sm">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Fasting Collection Windows Active</strong>
                <span>
                  This test requires 10-12 hours fasting. We recommend selecting an early morning slot so you can eat breakfast right after sample collection.
                </span>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <Input
              label="Select Collection Date"
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
            />

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Available Time Slots on {scheduledDate}
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {availableSlots.map((slot) => {
                  const isSelected = timeSlot === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTimeSlot(slot)}
                      className={`p-3 rounded-xl text-xs font-semibold border flex items-center justify-between transition-all ${
                        isSelected
                          ? 'border-brand-500 bg-brand-50 text-brand-900 ring-2 ring-brand-500'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-brand-500" />
                        {slot}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-brand-600" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Payment Choice (Section 25) */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Payment Option
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMode('ONLINE')}
                  className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                    paymentMode === 'ONLINE'
                      ? 'border-brand-500 bg-brand-50 text-brand-900 ring-2 ring-brand-500'
                      : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  <p>Prepay Online (UPI / Card)</p>
                  <span className="text-[10px] text-emerald-600 font-normal">Fastest verification</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMode('CASH_ON_COLLECTION')}
                  className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                    paymentMode === 'CASH_ON_COLLECTION'
                      ? 'border-brand-500 bg-brand-50 text-brand-900 ring-2 ring-brand-500'
                      : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  <p>Pay on Collection (Cash/UPI)</p>
                  <span className="text-[10px] text-slate-500 font-normal">Pay directly to phlebotomist</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <Button
              variant="outline"
              size="md"
              leftIcon={<ChevronLeft className="w-4 h-4" />}
              onClick={() => setCurrentStep(4)}
            >
              Back
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => setCurrentStep(6)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Review Booking
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 6: CONFIRMATION, REFERRAL & CONSENT (Section 15, 23, 32) */}
      {currentStep === 6 && (
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900">Step 6: Review & Finalize Booking</h2>
            <p className="text-xs text-slate-500">
              Please double check all booking information before placing your order.
            </p>
          </div>

          {/* Booking Summary Box */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-4 text-xs sm:text-sm">
            <div className="flex items-start justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-xs text-slate-500 font-medium">Test / Package:</span>
                <h3 className="text-base font-bold text-slate-900">{itemName}</h3>
                <span className="text-xs text-slate-600">
                  Lab: <strong>{activeLab.name}</strong> ({activeLab.area})
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Tests Total</span>
                <span className="text-lg font-black text-slate-900">₹{currentPrice}</span>
              </div>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-200">
               <div>
                  <span className="text-xs text-slate-700 font-bold block">Home Collection Fee ({distance} km)</span>
                  <span className="text-[10px] text-slate-500">₹50 base + ₹10/km after 5km</span>
               </div>
               <span className="text-sm font-bold text-slate-900">₹{deliveryFee}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-200">
               <div>
                  <span className="text-xs text-slate-700 font-bold block">GST (18% on Delivery Fee)</span>
                  <span className="text-[10px] text-emerald-600 font-medium">Medical Tests are GST Exempt (0%)</span>
               </div>
               <span className="text-sm font-bold text-slate-900">₹{gstAmount}</span>
            </div>

            {referralValid && (
              <div className="flex items-center justify-between py-2 border-b border-slate-200">
                 <div>
                    <span className="text-xs text-emerald-700 font-bold block">Partner Discount (5% Off)</span>
                    <span className="text-[10px] text-emerald-600 font-medium">Applied via code: {referralCode.toUpperCase()}</span>
                 </div>
                 <span className="text-sm font-bold text-emerald-600">-₹{discountAmount}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
               <span className="text-sm text-slate-800 font-bold uppercase">Total Payable</span>
               <span className="text-2xl font-black text-brand-600">₹{finalTotalAmount}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-slate-500 font-medium block">Patient:</span>
                <strong className="text-slate-900">{patientName} ({patientAge} yrs, {patientGender})</strong>
                <p className="text-xs text-slate-600">{patientPhone} {patientEmail && `• ${patientEmail}`}</p>
              </div>

              <div>
                <span className="text-xs text-slate-500 font-medium block">Collection Window:</span>
                <strong className="text-slate-900">{scheduledDate} ({timeSlot})</strong>
                <p className="text-xs text-emerald-700 font-medium">Free Doorstep Collection</p>
              </div>

              <div className="sm:col-span-2">
                <span className="text-xs text-slate-500 font-medium block">Pickup Address:</span>
                <p className="text-slate-800">
                  {house}, {street}, {area}, {city} - {pincode}
                  {landmark && ` (Landmark: ${landmark})`}
                </p>
              </div>
            </div>
          </div>

          {/* Referral Code Box (Section 23) */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-brand-500" />
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Clinic / Doctor Referral Code (Optional)
              </label>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="e.g. CLINIC001, MEDICAL001, DOC002"
                value={referralCode}
                onChange={(e) => {
                  setReferralCode(e.target.value);
                  setReferralValid(null);
                }}
                className="uppercase text-xs"
              />
              <Button type="button" size="sm" variant="outline" onClick={() => handleValidateReferral()}>
                Apply
              </Button>
            </div>
            {referralValid === true && (
              <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                ✓ Valid partner code! Attributed to: {referralPartnerName}
              </p>
            )}
            {referralValid === false && (
              <p className="text-xs text-rose-600 font-medium">
                Invalid referral code. Please check or leave blank.
              </p>
            )}
          </div>

          {/* Special Instructions */}
          <Input
            label="Special Collection Notes / Ring Bell Instructions (Optional)"
            placeholder="e.g. Ring bell twice, gate code, elevator available"
            value={bookingNotes}
            onChange={(e) => setBookingNotes(e.target.value)}
          />

          {/* Mandatory Healthcare Consent Checkbox (Section 32) */}
          <div className="p-4 bg-brand-50/60 rounded-2xl border border-brand-200 space-y-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={consentAgreed}
                onChange={(e) => setConsentAgreed(e.target.checked)}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 mt-1 cursor-pointer"
              />
              <span className="text-xs text-slate-700 leading-relaxed select-none">
                <strong>Mandatory Healthcare Consent:</strong> I agree to the collection and processing of my diagnostic sample and health information for the purpose of fulfilling my diagnostic test booking in compliance with the QuickLabz Privacy Policy.
              </span>
            </label>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <Button
              variant="outline"
              size="md"
              leftIcon={<ChevronLeft className="w-4 h-4" />}
              onClick={() => setCurrentStep(5)}
            >
              Back
            </Button>
            <Button
              variant="accent"
              size="lg"
              isLoading={isSubmitting}
              disabled={!consentAgreed}
              onClick={handleConfirmBooking}
              className="font-bold shadow-lg shadow-accent-500/25"
            >
              Confirm Booking (₹{finalTotalAmount})
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 7: BOOKING CONFIRMED SCREEN (Section 16) */}
      {currentStep === 7 && confirmedBookingId && (
        <Card className="p-6 sm:p-10 text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <Badge variant="green" size="md">
              Doorstep Collection Confirmed
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Booking ID: {confirmedBookingId}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              We have reserved your test slot. A certified phlebotomist will arrive at your doorstep on{' '}
              <strong>{scheduledDate} ({timeSlot})</strong>.
            </p>
          </div>

          {/* Quick Summary Grid */}
          <div className="max-w-lg mx-auto bg-slate-50 p-5 rounded-2xl border border-slate-200 text-left text-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Patient:</span>
              <span className="font-bold text-slate-900">{patientName} ({patientAge} yrs)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Test:</span>
              <span className="font-bold text-slate-900">{itemName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Processing Lab:</span>
              <span className="font-bold text-slate-900">{activeLab.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Payment Status:</span>
              <span className="font-bold text-emerald-700">{paymentMode === 'ONLINE' ? 'Prepaid (Paid)' : 'Cash / UPI on Collection'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Collection Address:</span>
              <span className="font-semibold text-slate-800 text-right truncate max-w-[200px]">{house}, {area}</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a href={`/track/${confirmedBookingId}`} className="w-full sm:w-auto">
              <Button size="md" variant="primary" fullWidth className="font-bold">
                Track Live Booking Status →
              </Button>
            </a>
            <a href="/dashboard" className="w-full sm:w-auto">
              <Button size="md" variant="outline" fullWidth>
                View in Patient Dashboard
              </Button>
            </a>
          </div>

          <p className="text-[11px] text-slate-400">
            A confirmation SMS & WhatsApp alert has been sent to +91 {patientPhone}. Helpline: 7018623940.
          </p>
        </Card>
      )}
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500 text-sm">Loading booking engine...</div>}>
      <BookingContent />
    </Suspense>
  );
}

