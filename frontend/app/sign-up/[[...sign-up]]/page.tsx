import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { Sparkles, ArrowLeft, ShieldCheck } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-[#08090d] relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

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
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-2">
          <Sparkles size={14} /> Initialize Sovereign Vault
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Create Your WealthSage Account
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-sm">
          Join thousands of high-velocity quant engineers and families optimizing real-time net worth.
        </p>
      </div>

      <div className="w-full max-w-md flex justify-center">
        <SignUp
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          fallbackRedirectUrl="/dashboard"
        />
      </div>

      <div className="mt-8 flex items-center gap-2 text-[11px] text-slate-500">
        <ShieldCheck size={14} className="text-emerald-400" />
        <span>End-to-End Encrypted Session · Zero Knowledge Ledger Security</span>
      </div>
    </div>
  );
}
