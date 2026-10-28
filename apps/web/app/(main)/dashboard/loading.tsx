export default function PatientDashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse p-6 max-w-7xl mx-auto">
      <div className="h-8 w-48 bg-slate-200 rounded mb-6"></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 h-48"></div>
          <div className="bg-white rounded-xl border border-slate-200 h-[400px]"></div>
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 h-64"></div>
        </div>
      </div>
    </div>
  );
}
