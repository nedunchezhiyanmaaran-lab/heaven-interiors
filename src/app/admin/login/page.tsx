'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-6 relative">
      <div className="max-w-md w-full bg-[#181818] border border-[#C5A15B]/30 p-8 sm:p-10 rounded-xl shadow-2xl space-y-8">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <Logo size="lg" variant="light" asLink={false} />
          <div className="pt-2">
            <span className="text-[10px] uppercase tracking-widest text-[#C5A15B] font-mono border border-[#C5A15B]/40 px-2 py-0.5 rounded">
              Administration Portal
            </span>
          </div>
          <h1 className="text-xl font-serif text-[#F5F0E6]">
            Studio CMS Sign In
          </h1>
          <p className="text-xs text-[#E9E5DE]/60 font-sans">
            Client administrative interface for managing projects, films, materials, and enquiries.
          </p>
        </div>

        {/* Demo Credentials Helper Pill */}
        <div className="p-3 bg-[#1e1e1e] border border-[#C5A15B]/20 rounded-lg space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#C5A15B] font-medium flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Demo Access Credentials:
            </span>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="text-[11px] underline text-[#DFC488] hover:text-[#F5F0E6]"
            >
              Autofill
            </button>
          </div>
          <div className="text-[11px] font-mono text-[#E9E5DE]/70 space-y-0.5">
            <div>Email: <span className="text-white">admin@heaveninteriors.com</span></div>
            <div>Password: <span className="text-white">admin123</span></div>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-950/40 border border-red-800 text-red-200 text-xs rounded flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#C5A15B] font-sans mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@heaveninteriors.com"
                className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-2.5 pl-10 text-xs text-[#F5F0E6] focus:border-[#C5A15B] focus:outline-none transition-colors"
              />
              <Mail className="w-4 h-4 text-white/40 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#C5A15B] font-sans mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-2.5 pl-10 text-xs text-[#F5F0E6] focus:border-[#C5A15B] focus:outline-none transition-colors"
              />
              <Lock className="w-4 h-4 text-white/40 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full btn-gold py-3 rounded-lg text-xs uppercase tracking-wider font-sans font-medium flex items-center justify-center gap-2 shadow-lg"
          >
            <span>Enter Studio CMS</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2">
          <a
            href="/"
            className="text-xs text-[#E9E5DE]/50 hover:text-[#C5A15B] transition-colors"
          >
            ← Return to Public Portfolio
          </a>
        </div>
      </div>
    </div>
  );
}

