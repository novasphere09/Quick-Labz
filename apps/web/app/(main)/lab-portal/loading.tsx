export default function LabPortalLoading() {
  return (
    <div className="space-y-6 animate-pulse p-6">
      <div className="h-8 w-64 bg-slate-200 rounded mb-6"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 h-32"></div>
        ))}
      </div>
      <div className="mt-8 bg-white rounded-xl border border-slate-200 h-[400px]"></div>
    </div>
  );
}
