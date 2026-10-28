import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { Users, FileText, Activity, IndianRupee, TrendingUp } from "lucide-react";

export default async function AdminDashboardPage() {
  const [totalUsers, totalBookings, totalLabs, totalRevenueRaw, recentBookings] = await Promise.all([
    prisma.user.count({ where: { role: "PATIENT" } }),
    prisma.booking.count(),
    prisma.laboratory.count(),
    prisma.booking.aggregate({
      _sum: {
        totalAmount: true,
        grossMargin: true,
      },
      where: {
        paymentStatus: "PAID",
      }
    }),
    prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        bookingNumber: true,
        patientName: true,
        totalAmount: true,
        status: true,
        createdAt: true,
        laboratory: {
          select: { name: true }
        }
      }
    })
  ]);

  const totalRevenue = totalRevenueRaw._sum.totalAmount || 0;
  const totalGrossMargin = totalRevenueRaw._sum.grossMargin || 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Welcome to Command Center</h2>
        <p className="text-slate-500 mt-1">Here's what's happening with QuickLabz today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6">
        <Card className="p-6 border-l-4 border-l-brand-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Patients</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-2">{totalUsers}</h3>
            </div>
            <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Bookings</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-2">{totalBookings}</h3>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
              <FileText className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Revenue</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-2">₹{totalRevenue.toLocaleString()}</h3>
            </div>
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
              <IndianRupee className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Gross Margin</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-2">₹{totalGrossMargin.toLocaleString()}</h3>
            </div>
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Active Labs</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-2">{totalLabs}</h3>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
              <Activity className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Recent Bookings</h3>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 font-medium">Booking ID</th>
                  <th className="px-6 py-4 font-medium">Patient</th>
                  <th className="px-6 py-4 font-medium">Laboratory</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentBookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                      No bookings found.
                    </td>
                  </tr>
                ) : (
                  recentBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-brand-600">
                        {booking.bookingNumber}
                      </td>
                      <td className="px-6 py-4 text-slate-700">{booking.patientName}</td>
                      <td className="px-6 py-4 text-slate-600">{booking.laboratory.name}</td>
                      <td className="px-6 py-4 font-medium">₹{booking.totalAmount.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                          {booking.status.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
