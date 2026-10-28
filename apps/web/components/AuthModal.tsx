"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Mail, Lock, LogIn, AlertCircle, User, Phone, X } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
  subtitle?: string;
}

export function AuthModal({ isOpen, onClose, onSuccess, title = "Log in to Continue", subtitle = "Please sign in or create an account to book your test." }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Login State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<1 | 2>(1);

  // Register State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address2, setAddress2] = useState(""); // Honeypot

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
        otp: step === 2 ? otp : "",
      });

      if (res?.error) {
        if (res.error === "2FA_REQUIRED") {
          setStep(2);
          setError(""); // clear error
        } else {
          setError(res.error === "CredentialsSignin" ? "Invalid email or password" : res.error);
        }
      } else {
        onSuccess();
      }
    } catch (err) {
      setError("An error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password, address2 }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Registration failed");
      }

      // Automatically sign in after successful registration
      const signInRes = await signIn("credentials", {
        redirect: false,
        email,
        password,
        otp: "",
      });

      if (signInRes?.error) {
        if (signInRes.error === "2FA_REQUIRED") {
          // Switch to login tab, step 2 to input OTP!
          setActiveTab("login");
          setStep(2);
          setError("");
        } else {
          setError("Account created, but automatic login failed. Please log in manually.");
          setActiveTab("login");
        }
      } else {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during registration.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 pb-0 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="text-center mb-6">
            <Image 
              src="/logo.png" 
              alt="QuickLabz Logo" 
              width={120}
              height={40}
              className="h-8 w-auto object-contain mx-auto mb-4" 
            />
            <h2 className="text-xl font-bold text-slate-900">
              {activeTab === "login" && step === 2 ? "Two-Factor Authentication" : title}
            </h2>
            <p className="text-xs text-slate-500 mt-1.5">
              {activeTab === "login" && step === 2 ? `Enter the 6-digit code sent to ${email}` : subtitle}
            </p>
          </div>

          {/* Tabs */}
          {!(activeTab === "login" && step === 2) && (
          <div className="flex p-1 bg-slate-100 rounded-xl mb-6">
            <button
              onClick={() => { setActiveTab("login"); setError(""); }}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                activeTab === "login" 
                  ? "bg-white text-slate-900 shadow-sm" 
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => { setActiveTab("register"); setError(""); }}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                activeTab === "register" 
                  ? "bg-white text-slate-900 shadow-sm" 
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Sign Up
            </button>
          </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 pt-0 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 flex items-start gap-2.5 text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="text-xs font-semibold">{error}</p>
            </div>
          )}

          {activeTab === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              {step === 1 && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 text-sm bg-slate-50"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 text-sm bg-slate-50"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </>
              )}

              {step === 2 && (
                <div className="animate-in fade-in zoom-in duration-300">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">6-Digit Security Code</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      className="block w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 text-sm bg-slate-50 tracking-[0.5em] font-mono text-center"
                      placeholder="------"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => { setStep(1); setOtp(""); setPassword(""); }}
                    className="text-xs text-brand-600 font-semibold mt-3 hover:underline"
                  >
                    ← Back to Login
                  </button>
                </div>
              )}

              <Button
                type="submit"
                fullWidth
                variant="primary"
                disabled={isLoading}
                leftIcon={!isLoading && <LogIn className="w-4 h-4" />}
                className="mt-2"
              >
                {isLoading ? "Verifying..." : (step === 1 ? "Continue securely" : "Verify & Sign In")}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="hidden" aria-hidden="true" style={{ display: 'none' }}>
                <input type="text" value={address2} onChange={(e) => setAddress2(e.target.value)} tabIndex={-1} />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 text-sm bg-slate-50"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 text-sm bg-slate-50"
                    placeholder="9876543210"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 text-sm bg-slate-50"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 text-sm bg-slate-50"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <Button
                type="submit"
                fullWidth
                variant="accent"
                disabled={isLoading}
                className="mt-2 font-bold"
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
