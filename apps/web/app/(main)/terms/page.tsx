import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-8">
      <div className="space-y-3">
        <Badge variant="blue">Legal Agreement</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Terms & Conditions
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Last Updated: August 2026 • Platform Terms of Service
        </p>
      </div>

      <Card className="space-y-6 p-6 sm:p-10 border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">1. Nature of Platform</h2>
          <p>
            QuickLabz operates as a digital healthcare marketplace connecting users with independent certified pathology laboratories and third-party phlebotomists. QuickLabz is not a diagnostic pathology laboratory and does not perform testing or analysis itself.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">2. Booking & Doorstep Sample Collection</h2>
          <p>
            By booking a test, you authorize a trained phlebotomist to visit your registered location to collect the biological specimen (blood, urine) and transport it to your selected laboratory in accordance with medical storage guidelines.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">3. Fasting and Medical Preparation Compliance</h2>
          <p>
            The patient is solely responsible for adhering to fasting and preparation guidelines indicated on the test catalog (e.g. 10-12 hours overnight fasting for FBS/Lipid). QuickLabz and partner laboratories shall not be liable for inaccurate test values caused by non-compliance with fasting protocols.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">4. Diagnostic Turnaround Times</h2>
          <p>
            Turnaround times displayed on the platform are approximate estimates based on partner laboratory processing capacity. Unforeseen events such as sample re-testing or courier delays may occasionally adjust delivery windows.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">5. Limitation of Clinical Liability</h2>
          <p>
            Laboratory test findings are indicative and intended to assist medical practitioners. QuickLabz does not provide medical diagnoses or treatment prescriptions. Always share test findings with a licensed healthcare practitioner.
          </p>
        </section>
      </Card>
    </div>
  );
}
