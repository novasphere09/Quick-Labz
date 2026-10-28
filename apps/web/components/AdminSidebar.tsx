"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard,
  Users,
  FileText,
  Activity,
  Building2,
  Truck,
  LogOut,
  IndianRupee,
  MessageSquare,
  Menu,
  X
} from "lucide-react";
import { LogoutButton } from "@/components/LogoutButton";

export function AdminSidebar({ userEmail }: { userEmail: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Header with Hamburger */}
      <div className="md:hidden flex items-center justify-between bg-slate-900 text-white p-4 shrink-0 absolute top-0 left-0 right-0 z-20 h-16">
        <div className="flex items-center">
          <Activity className="w-5 h-5 text-brand-500 mr-2" />
          <span className="font-bold tracking-tight">QuickLabz <span className="text-brand-500">Admin</span></span>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 -mr-2 text-slate-300 hover:text-white">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 md:relative
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="h-16 hidden md:flex items-center px-6 border-b border-slate-800 shrink-0">
          <Activity className="w-6 h-6 text-brand-500 mr-2" />
          <span className="text-xl font-bold text-white tracking-tight">QuickLabz <span className="text-brand-500">Admin</span></span>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 mt-16 md:mt-0">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-4 px-2">Main</div>
          <Link href="/admin" onClick={() => setIsOpen(false)} className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${pathname === '/admin' ? 'bg-brand-500/10 text-brand-400' : 'hover:bg-slate-800 hover:text-white'}`}>
            <LayoutDashboard className="w-5 h-5" />
            Overview
          </Link>
          <Link href="/admin/bookings" onClick={() => setIsOpen(false)} className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${pathname === '/admin/bookings' ? 'bg-brand-500/10 text-brand-400' : 'hover:bg-slate-800 hover:text-white'}`}>
            <FileText className="w-5 h-5" />
            Bookings & Orders
          </Link>
          <Link href="/admin/catalog" onClick={() => setIsOpen(false)} className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${pathname === '/admin/catalog' ? 'bg-brand-500/10 text-brand-400' : 'hover:bg-slate-800 hover:text-white'}`}>
            <Activity className="w-5 h-5" />
            Catalog (Tests & Packages)
          </Link>
          <Link href="/admin/financials" onClick={() => setIsOpen(false)} className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${pathname === '/admin/financials' ? 'bg-brand-500/10 text-brand-400' : 'hover:bg-slate-800 hover:text-white'}`}>
            <IndianRupee className={`w-5 h-5 ${pathname === '/admin/financials' ? '' : 'text-emerald-500'}`} />
            Financials & Payouts
          </Link>
          <Link href="/admin/support" onClick={() => setIsOpen(false)} className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${pathname === '/admin/support' ? 'bg-brand-500/10 text-brand-400' : 'hover:bg-slate-800 hover:text-white'}`}>
            <MessageSquare className={`w-5 h-5 ${pathname === '/admin/support' ? '' : 'text-blue-400'}`} />
            Support Tickets
          </Link>

          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-8 px-2">Live Directory</div>
          <Link href="/admin/users" onClick={() => setIsOpen(false)} className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${pathname === '/admin/users' ? 'bg-brand-500/10 text-brand-400' : 'hover:bg-slate-800 hover:text-white'}`}>
            <Users className="w-5 h-5" />
            Registered Patients
          </Link>
          <Link href="/admin/labs" onClick={() => setIsOpen(false)} className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${pathname === '/admin/labs' ? 'bg-brand-500/10 text-brand-400' : 'hover:bg-slate-800 hover:text-white'}`}>
            <Building2 className="w-5 h-5" />
            Lab Partners
          </Link>
          <Link href="/admin/labs/pending" onClick={() => setIsOpen(false)} className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${pathname === '/admin/labs/pending' ? 'bg-brand-500/10 text-brand-400' : 'hover:bg-slate-800 hover:text-white'}`}>
            <FileText className={`w-5 h-5 ${pathname === '/admin/labs/pending' ? '' : 'text-amber-500'}`} />
            Pending Approvals
          </Link>
          <Link href="/admin/collectors" onClick={() => setIsOpen(false)} className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${pathname === '/admin/collectors' ? 'bg-brand-500/10 text-brand-400' : 'hover:bg-slate-800 hover:text-white'}`}>
            <Truck className="w-5 h-5" />
            Delivery Partners
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800 shrink-0 space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold text-sm shrink-0">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Administrator</p>
              <p className="text-[10px] text-slate-500 truncate">{userEmail}</p>
            </div>
          </div>
          <LogoutButton variant="ghost" className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </LogoutButton>
        </div>
      </aside>
    </>
  );
}
