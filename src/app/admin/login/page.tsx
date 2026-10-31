'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Logo } from '@/components/shared/Logo';
import { authService, DEMO_CREDENTIALS } from '@/services/auth.service';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = authService.login(email, password);
    if (result.success) {
      router.push('/admin/dashboard');
    } else {
      setError(result.error || 'Invalid credentials');
    }
  };

  const fillDemoCredentials = () => {
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
  };

  return (
    <div className="min-h-screen bg-[#F5F0E6] flex items-center justify-center p-6 relative overflow-hidden select-none font-sans">
      {/* Ambient architectural texture at corners */}
      <div className="absolute top-0 right-0 w-[500px] h-[350px] opacity-20 pointer-events-none overflow-hidden blur-sm">
        <Image
          src="/reference_assets/photo_handover_hd.jpg"
          alt="Architectural Ambient"
          fill
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#F5F0E6]/70 to-[#F5F0E6]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#F5F0E6]/70 to-[#F5F0E6]" />
      </div>

      <div className="max-w-md w-full bg-[#FFFFFF] border border-[#E5DEC9] p-8 sm:p-10 rounded-2xl shadow-xl space-y-7 relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <Logo size="lg" variant="dark" asLink={false} />
          <div className="pt-1">
            <span className="text-[10px] uppercase tracking-widest text-[#C5A15B] font-semibold border border-[#C5A15B]/30 bg-[#C5A15B]/10 px-2.5 py-0.5 rounded-full">
              Administration Portal
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#141414] tracking-tight">
            Studio CMS Sign In
          </h1>
          <p className="text-xs text-[#78726A] font-sans">
            Client administrative interface for managing projects, films, materials, and enquiries.
          </p>
        </div>

        {/* Demo Credentials Helper Pill */}
        <div className="p-3.5 bg-[#F5F0E6] border border-[#E5DEC9] rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#C5A15B] font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Demo Access Credentials:
            </span>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="text-[11px] font-semibold text-[#C5A15B] hover:text-[#141414] underline transition-colors"
            >
              Autofill
            </button>
          </div>
          <div className="text-[11px] font-sans text-[#78726A] space-y-0.5">
            <div>Email: <span className="text-[#141414] font-semibold">admin@heaveninteriors.com</span></div>
            <div>Password: <span className="text-[#141414] font-semibold">admin123</span></div>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-[#B43A3A] text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4.5">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#78726A] font-sans font-medium mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@heaveninteriors.com"
                className="w-full bg-[#F5F0E6]/50 border border-[#E5DEC9] rounded-xl px-4 py-2.5 pl-10 text-xs text-[#141414] focus:border-[#C5A15B] focus:bg-white focus:outline-none transition-colors"
              />
              <Mail className="w-4 h-4 text-[#78726A] absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#78726A] font-sans font-medium mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#F5F0E6]/50 border border-[#E5DEC9] rounded-xl px-4 py-2.5 pl-10 text-xs text-[#141414] focus:border-[#C5A15B] focus:bg-white focus:outline-none transition-colors"
              />
              <Lock className="w-4 h-4 text-[#78726A] absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#141414] hover:bg-[#C5A15B] text-[#FAF7F0] hover:text-[#141414] py-3 rounded-xl text-xs font-sans font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <span>Enter Studio CMS</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-1">
          <Link
            href="/"
            className="text-xs text-[#78726A] hover:text-[#C5A15B] transition-colors"
          >
            ← Return to Public Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}
