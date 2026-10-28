'use client';

import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MessageSquare,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

const FAQS = [
  {
    q: "How can I track my booking or report?",
    a: "You can track your booking status directly from the 'Track' link in the top navigation menu using your Booking ID and Phone Number."
  },
  {
    q: "When will I receive my reports?",
    a: "Report delivery time totally depends upon your test profile. We ensure there is no delay from our side and process it as fast as possible, but we don't force labs to rush tests because health information is sensitive and cannot be compromised."
  },
  {
    q: "Can I reschedule or cancel my booking?",
    a: "Yes, you can reschedule or cancel your booking up to 2 hours before the scheduled collection time by contacting support."
  },
  {
    q: "Do I need to fast before my test?",
    a: "Fasting requirements depend on the specific test. Please check the test details on our catalog or contact us if you are unsure."
  }
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'General Enquiry',
    message: '',
    documentId: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSubmitted(true);
        setErrorMsg('');
        setFormData({ name: '', phone: '', email: '', subject: 'General Enquiry', message: '', documentId: '' });
      } else {
        setErrorMsg('Failed to submit your request. Please try again.');
      }
    } catch (error) {
      setErrorMsg('An unexpected error occurred. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <Badge variant="blue" size="md">
          Help & Customer Support
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Contact QuickLabz
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Need help with test booking, sample collection status, or report access? Our patient care team is here to assist you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Direct Contact Details & WhatsApp CTA */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="space-y-6 p-6 sm:p-8 border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">Direct Support Channels</h2>

            <div className="space-y-4 text-xs sm:text-sm text-slate-700">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs text-slate-400 font-semibold uppercase">Phone Support</span>
                  <a href="tel:7018623940" className="font-bold text-slate-900 hover:text-brand-600">
                    +91 7018623940
                  </a>
                  <p className="text-[11px] text-slate-500 mt-0.5">Available Mon-Sun, 6:00 AM - 9:00 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs text-slate-400 font-semibold uppercase">WhatsApp Care</span>
                  <a
                    href="https://wa.me/917018623940?text=Hi%20QuickLabz%2C%20I%20need%20help%20with%20a%20booking"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-slate-900 hover:text-emerald-600"
                  >
                    +91 7018623940
                  </a>
                  <p className="text-[11px] text-slate-500 mt-0.5">Instant chat assistance</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs text-slate-400 font-semibold uppercase">Official Email</span>
                  <a href="mailto:quicklabzofficial@gmail.com" className="font-bold text-slate-900 hover:text-brand-600 break-all">
                    quicklabzofficial@gmail.com
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="https://wa.me/917018623940?text=Hi%20QuickLabz%2C%20I%20have%20an%20enquiry"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block"
              >
                <Button variant="accent" fullWidth size="md" leftIcon={<MessageSquare className="w-4 h-4" />}>
                  Chat with QuickLabz on WhatsApp
                </Button>
              </a>
            </div>
          </Card>
        </div>

        {/* Right Column: Support / Feedback Form */}
        <div className="lg:col-span-7">
          <Card className="p-6 sm:p-8 border-slate-200 shadow-subtle">
            {submitted ? (
              <div className="py-8 sm:py-12 space-y-8 animate-in fade-in duration-500 max-w-md mx-auto">
                <div className="text-center space-y-2">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Ticket Submitted Successfully</h3>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Your request has been securely logged. Here is what happens next:
                  </p>
                </div>

                <div className="relative pl-6 space-y-6">
                  {/* Vertical Line */}
                  <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-slate-100"></div>
                  
                  {/* Step 1: Received */}
                  <div className="relative flex items-start gap-4">
                    <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-emerald-500 ring-4 ring-white flex items-center justify-center z-10">
                      <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Query Received</h4>
                      <p className="text-xs text-slate-500 mt-0.5">We have received your support request.</p>
                    </div>
                  </div>

                  {/* Step 2: Under Review */}
                  <div className="relative flex items-start gap-4">
                    <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-brand-200 ring-4 ring-white flex items-center justify-center z-10 animate-pulse">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-600"></div>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Under Review</h4>
                      <p className="text-xs text-slate-500 mt-0.5">A Patient Care representative is analyzing your issue.</p>
                    </div>
                  </div>

                  {/* Step 3: Resolution */}
                  <div className="relative flex items-start gap-4">
                    <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-slate-200 ring-4 ring-white flex items-center justify-center z-10">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-400">Resolution</h4>
                      <p className="text-xs text-slate-400 mt-0.5">We will contact you within 15-30 minutes with a solution.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-center">
                  <Button size="sm" variant="outline" onClick={() => setSubmitted(false)}>
                    Submit Another Query
                  </Button>
                </div>
              </div>
            ) : !showForm ? (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-xl font-bold text-slate-900">Frequently Asked Questions</h2>
                  <p className="text-sm text-slate-500 mt-1">Find quick answers to our most common queries.</p>
                </div>
                
                <div className="space-y-3">
                  {FAQS.map((faq, idx) => (
                    <div 
                      key={idx} 
                      className="border border-slate-200 rounded-xl overflow-hidden transition-all duration-200"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                        className="w-full text-left px-5 py-4 flex justify-between items-center bg-slate-50 hover:bg-slate-100 focus:outline-none"
                      >
                        <span className="font-semibold text-slate-800 text-sm pr-4">{faq.q}</span>
                        <div className={`w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0 border border-slate-200 transition-transform duration-300 ${openFaqIndex === idx ? 'rotate-180' : ''}`}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </div>
                      </button>
                      <div 
                        className={`px-5 overflow-hidden transition-all duration-300 ease-in-out ${openFaqIndex === idx ? 'py-4 max-h-40 opacity-100 border-t border-slate-100' : 'max-h-0 opacity-0'}`}
                      >
                        <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 text-center space-y-4 bg-brand-50 rounded-xl p-6">
                  <AlertCircle className="w-8 h-8 text-brand-600 mx-auto" />
                  <h3 className="text-lg font-bold text-slate-900">Query Not Solved?</h3>
                  <p className="text-sm text-slate-600 max-w-sm mx-auto">
                    If you couldn't find the answer you were looking for, our patient care team is ready to help you out directly.
                  </p>
                  <div className="pt-2">
                    <Button variant="primary" size="md" onClick={() => setShowForm(true)} rightIcon={<Send className="w-4 h-4" />}>
                      Submit a Support Ticket
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                <div className="border-b border-slate-100 pb-3 flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Submit a Support Ticket</h2>
                    <p className="text-xs text-slate-500">We typically respond within 15-30 minutes during active hours.</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
                    Back to FAQs
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Your Full Name"
                    placeholder="e.g. Rohan Sharma"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <Input
                    label="Mobile Number"
                    placeholder="10-digit mobile"
                    maxLength={10}
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Email Address (Optional)"
                    type="email"
                    placeholder="e.g. name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Subject
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-white border border-surface-border rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                      <option value="General Enquiry">General Enquiry</option>
                      <option value="Booking Reschedule / Cancel">Booking Reschedule / Cancel</option>
                      <option value="Report Not Received">Report Status / Delay</option>
                      <option value="Partner Lab Onboarding">Partner Lab Onboarding</option>
                      <option value="Doctor / Clinic Referral">Doctor / Clinic Referral</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Input
                    label="Booking ID / Document ID (Optional)"
                    placeholder="e.g. QLZ-2026-1234"
                    value={formData.documentId}
                    onChange={(e) => setFormData({ ...formData, documentId: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Message / Question <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Please provide booking ID (if applicable) and details of your request..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white border border-surface-border rounded-xl p-4 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder-slate-400"
                  />
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-sm font-semibold flex items-center gap-2 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {errorMsg}
                  </div>
                )}

                <Button type="submit" disabled={isSubmitting} variant="primary" size="md" fullWidth rightIcon={<Send className="w-4 h-4" />}>
                  {isSubmitting ? 'Submitting...' : 'Submit Support Request'}
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
