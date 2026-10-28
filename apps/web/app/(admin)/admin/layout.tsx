import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/nextAuth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard,
  Users,
  FileText,
  Activity,
  Settings,
  Building2,
  Truck,
  LogOut,
  IndianRupee,
  MessageSquare
} from "lucide-react";
import { LogoutButton } from "@/components/LogoutButton";
import { AdminSidebar } from "@/components/AdminSidebar";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // @ts-ignore
  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin-login");
  }

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden pt-16 md:pt-0">
      <AdminSidebar userEmail={session?.user?.email || ""} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-slate-50">
        <header className="h-16 hidden md:flex bg-white border-b border-slate-200 items-center px-8 shrink-0">
          <h1 className="text-lg font-semibold text-slate-800">Command Center</h1>
        </header>
        <div className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
