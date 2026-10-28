import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

export default function RefundPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-8">
      <div className="space-y-3">
        <Badge variant="blue">Policy Guidelines</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Refund & Cancellation Policy
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Clear, patient-friendly policies for test cancellations and refunds.
        </p>
      </div>

      <Card className="space-y-6 p-6 sm:p-10 border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">1. Cancellation Before Phlebotomist Dispatch</h2>
          <p>
            You may cancel or reschedule your diagnostic test booking free of charge up to <strong>2 hours prior</strong> to your scheduled collection time slot. In case of prepaid orders, a 100% refund will be initiated immediately to your original payment method.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">2. Cancellation After Phlebotomist En Route</h2>
          <p>
            If a cancellation is requested after the certified phlebotomist has departed for your location or arrived at your doorstep, a nominal doorstep conveyance fee of ₹50 may be deducted from the refund amount.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">3. Post-Collection Policy</h2>
          <p>
            Once the biological sample has been drawn, barcoded, and received by the partner laboratory for chemical processing, cancellation or refund cannot be processed as single-use medical consumables and laboratory reagents have been utilized.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">4. Sample Hemolysis or Re-collection</h2>
          <p>
            In rare circumstances where a specimen is found to be hemolyzed, clotted, or insufficient by the laboratory analyzer, QuickLabz will arrange a <strong>free doorstep re-collection</strong> at no extra charge to the patient.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">5. How to Request Refund or Reschedule</h2>
          <p>
            You can reschedule or cancel a booking directly from your <strong>Patient Dashboard</strong> or by contacting our helpline on WhatsApp/Phone at <a href="tel:7018623940" className="text-brand-600 font-bold hover:underline">+91 7018623940</a>.
          </p>
        </section>
      </Card>
    </div>
  );
}
