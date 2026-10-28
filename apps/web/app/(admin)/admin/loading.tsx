export default function AdminDashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div>
        <div className="h-8 w-64 bg-slate-200 rounded mb-2"></div>
        <div className="h-4 w-48 bg-slate-200 rounded"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-6 bg-white rounded-xl border border-slate-200 h-28"></div>
        ))}
      </div>
      <div className="mt-8">
        <div className="h-6 w-40 bg-slate-200 rounded mb-4"></div>
        <div className="bg-white rounded-xl border border-slate-200 h-64"></div>
      </div>
    </div>
  );
}
