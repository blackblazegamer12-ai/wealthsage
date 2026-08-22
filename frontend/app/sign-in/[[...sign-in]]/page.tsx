import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { Sparkles, ArrowLeft, ShieldCheck } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-[#08090d] relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Brand Link */}
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 transition-all hover:bg-white/10"
        >
          <ArrowLeft size={14} /> Back to Sovereign Landing
        </Link>
      </div>

      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold mb-2">
          <Sparkles size={14} /> WealthSage Auth Gateway
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Enter Your Sovereign Vault
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-sm">
          Access institutional AI financial telemetry, predictive compounding engines, and cryptographic audit logs.
        </p>
      </div>

      <div className="w-full max-w-md flex justify-center">
        <SignIn
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          fallbackRedirectUrl="/dashboard"
        />
      </div>

      <div className="mt-8 flex items-center gap-2 text-[11px] text-slate-500">
        <ShieldCheck size={14} className="text-emerald-400" />
        <span>256-bit AES Vault Encryption · SOC2 Type II Certified Pipeline</span>
      </div>
    </div>
  );
}
