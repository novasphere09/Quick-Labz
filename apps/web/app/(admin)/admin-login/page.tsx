"use client";
export const dynamic = 'force-dynamic';

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Mail, Lock, LogIn, AlertCircle } from "lucide-react";

function AdminLoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Invalid admin credentials");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error) {
      setError("An error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-900 relative overflow-hidden">
      {/* Dark theme for admin */}
      <div className="w-full max-w-md bg-slate-800 rounded-3xl shadow-2xl border border-slate-700 p-8 relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-6">
            <span className="text-3xl font-black text-brand-500">QuickLabz</span>
            <span className="ml-2 px-2 py-1 bg-brand-500/20 text-brand-400 text-xs font-bold rounded">ADMIN</span>
          </div>
          <h2 className="text-2xl font-bold text-white font-display">
            Command Center Login
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Restricted access for authorized personnel only
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-900/50 border border-red-800 flex items-start gap-3 text-red-200">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleCredentialsLogin} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-slate-300 mb-1.5"
            >
              Admin Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-500" />
              </div>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-slate-600 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm transition-all bg-slate-700 text-white placeholder-slate-400"
                placeholder="admin@quicklabz.com"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-slate-300"
              >
                Password
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-500" />
              </div>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-slate-600 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm transition-all bg-slate-700 text-white placeholder-slate-400"
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button
            type="submit"
            fullWidth
            size="lg"
            variant="primary"
            disabled={isLoading}
            leftIcon={!isLoading && <LogIn className="w-5 h-5" />}
          >
            {isLoading ? "Authenticating..." : "Secure Login"}
          </Button>
        </form>
      </div>
      <div className="mt-8 text-center">
        <Link href="/" className="text-slate-500 hover:text-slate-300 text-sm font-medium transition-colors">
          ← Return to main website
        </Link>
      </div>
    </div>
  );
}



export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminLoginPageContent />
    </Suspense>
  );
}
