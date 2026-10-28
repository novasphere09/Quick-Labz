import React from 'react';
import { Shield, Lock, EyeOff, FileText, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-8">
      <div className="space-y-3">
        <Badge variant="blue">Data Protection & Privacy</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Last Updated: August 2026 • Governing Digital Pathology & Patient Information
        </p>
      </div>

      <Card className="space-y-6 p-6 sm:p-10 border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">1. Introduction & Scope</h2>
          <p>
            QuickLabz (&quot;we&quot;, &quot;our&quot;, or &quot;platform&quot;) is committed to protecting the privacy, confidentiality, and security of personal and diagnostic health information entrusted to us by patients. This Privacy Policy explains how we collect, store, process, and safeguard your data when utilizing our marketplace and doorstep phlebotomy facilitation services.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">2. Information We Collect</h2>
          <p>To schedule home blood collections and deliver diagnostic reports, we collect strictly necessary details:</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li><strong>Patient Profile:</strong> Full name, age, gender, contact number, and optional email address.</li>
            <li><strong>Collection Address:</strong> House number, street, area, landmark, and pin code to enable phlebotomist dispatch.</li>
            <li><strong>Test Specifications:</strong> Selected tests, chosen partner laboratory, and fasting confirmation.</li>
            <li><strong>Diagnostic Reports:</strong> Pathologist-verified laboratory report findings uploaded securely by partner laboratories for patient access.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">3. Purpose and Use of Data</h2>
          <p>Your information is used solely for:</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>Dispatching certified phlebotomists to your designated doorstep address.</li>
            <li>Routing specimen samples and patient identifiers accurately to your chosen partner diagnostic laboratory.</li>
            <li>Delivering certified digital pathology reports via secure authentication on QuickLabz.</li>
            <li>Sending booking confirmations, time slot reminders, and report readiness notifications via SMS/WhatsApp.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">4. Diagnostic Report Security & Isolation</h2>
          <p>
            Healthcare data is highly sensitive. Diagnostic reports are protected behind role-based access controls and unique booking identifiers. Reports are not indexed publicly by search engines or shared with third-party advertisers. QuickLabz does not sell patient health data.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">5. Contact Data Protection Officer</h2>
          <p>
            If you have questions regarding data access, corrections, or privacy safeguards, please write to us at <a href="mailto:quicklabzofficial@gmail.com" className="text-brand-600 font-semibold hover:underline">quicklabzofficial@gmail.com</a>.
          </p>
        </section>
      </Card>
    </div>
  );
}
