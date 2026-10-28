import React from 'react';
import { AlertCircle, ShieldAlert, HeartPulse, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

export default function HealthDisclaimerPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-8">
      <div className="space-y-3">
        <Badge variant="orange">Statutory Healthcare Notice</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Health Information Disclaimer
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Important healthcare notice regarding diagnostic testing and medical guidance.
        </p>
      </div>

      <Card className="space-y-6 p-6 sm:p-10 border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-amber-900">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="font-medium text-xs sm:text-sm">
            QuickLabz does not provide medical diagnosis, doctor consultations, treatment advice, or emergency clinical care. All diagnostic tests must be reviewed with your personal healthcare physician.
          </p>
        </div>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">1. Not a Substitute for Medical Advice</h2>
          <p>
            Information provided on QuickLabz regarding blood tests, biological parameters, normal reference ranges, and preparation guidelines is for educational and booking facilitation purposes only. It does not constitute medical advice or a formal doctor-patient relationship.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">2. No Guarantee of Disease Detection or Prevention</h2>
          <p>
            Diagnostic testing screens for specific biological markers. A normal test result does not guarantee the total absence of illness, nor does an abnormal value constitute a definitive clinical diagnosis. Clinical symptoms and medical history must be evaluated by a licensed medical practitioner.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">3. Emergency Medical Situations</h2>
          <p>
            If you or someone under your care is experiencing an acute medical emergency (such as severe chest pain, shortness of breath, sudden weakness, or trauma), <strong>do not wait for an online test booking</strong>. Immediately call your local ambulance emergency services (e.g. 112 / 108) or visit the nearest hospital emergency department.
          </p>
        </section>
      </Card>
    </div>
  );
}
