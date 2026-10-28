import React from 'react';
import { CheckCircle2, Circle, Clock, AlertTriangle, Truck, TestTube, FileCheck } from 'lucide-react';
import { BookingStatus } from '@/lib/types';

interface StatusTimelineProps {
  currentStatus: BookingStatus;
  scheduledDate?: string;
  timeSlot?: string;
}

const STAGES: { key: BookingStatus; label: string; description: string }[] = [
  { key: 'BOOKING_RECEIVED', label: 'Booking Received', description: 'Order logged and awaiting partner lab slot confirmation.' },
  { key: 'LAB_CONFIRMED', label: 'Lab Confirmed', description: 'Selected partner laboratory accepted and queued the test slot.' },
  { key: 'COLLECTOR_ASSIGNED', label: 'Collector Assigned', description: 'Certified phlebotomist allocated for home doorstep visit.' },
  { key: 'COLLECTION_SCHEDULED', label: 'Collection Scheduled', description: 'Phlebotomist dispatched with sterile collection kit.' },
  { key: 'SAMPLE_COLLECTED', label: 'Sample Collected', description: 'Barcoded blood/urine sample secured in temperature-controlled bag.' },
  { key: 'SAMPLE_RECEIVED_AT_LAB', label: 'Sample Received at Lab', description: 'Specimen checked in and accessioned at partner pathology lab.' },
  { key: 'TESTING_IN_PROGRESS', label: 'Testing in Progress', description: 'High-precision automated analyzer processing clinical parameters.' },
  { key: 'REPORT_READY', label: 'Report Ready', description: 'Pathologist verified and signed off findings.' },
  { key: 'REPORT_DELIVERED', label: 'Report Delivered', description: 'Secure digital report ready for PDF viewing and download.' },
];

export const StatusTimeline: React.FC<StatusTimelineProps> = ({ currentStatus }) => {
  const currentIndex = STAGES.findIndex((s) => s.key === currentStatus);
  const isCancelled = currentStatus === 'CANCELLED';

  if (isCancelled) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h4 className="text-base font-bold text-rose-900">Booking Cancelled</h4>
        <p className="text-xs text-rose-700 mt-1">
          This test booking was cancelled. No charges applied.
        </p>
      </div>
    );
  }

  return (
    <div className="py-2">
      {/* Mobile / Compact & Desktop Progress Steps */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
        {STAGES.map((stage, idx) => {
          const isDone = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isFuture = idx > currentIndex;

          return (
            <div key={stage.key} className="relative flex items-start group">
              {/* Timeline Indicator Dot */}
              <div
                className={`absolute -left-6 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                  isDone
                    ? 'bg-emerald-500 text-white ring-4 ring-emerald-50'
                    : isCurrent
                    ? 'bg-brand-500 text-white ring-4 ring-brand-100 animate-pulse'
                    : 'bg-white border-2 border-slate-300 text-slate-300'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : isCurrent ? (
                  <Clock className="w-3.5 h-3.5" />
                ) : (
                  <Circle className="w-2.5 h-2.5" />
                )}
              </div>

              {/* Step Details */}
              <div className="ml-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-bold ${
                      isDone
                        ? 'text-slate-800'
                        : isCurrent
                        ? 'text-brand-600'
                        : 'text-slate-400'
                    }`}
                  >
                    {stage.label}
                  </span>
                  {isCurrent && (
                    <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-brand-50 text-brand-600 rounded-full border border-brand-200">
                      Active Status
                    </span>
                  )}
                  {isDone && (
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5">
                      ✓ Done
                    </span>
                  )}
                </div>
                <p
                  className={`text-xs mt-0.5 leading-relaxed ${
                    isCurrent
                      ? 'text-slate-700 font-medium'
                      : isDone
                      ? 'text-slate-500'
                      : 'text-slate-400'
                  }`}
                >
                  {stage.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
