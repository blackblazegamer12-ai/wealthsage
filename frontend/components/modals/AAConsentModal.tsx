"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, CheckCircle, KeyRound, Smartphone, X, Loader2 } from "lucide-react";

interface AAConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnected: () => void;
}

const BANKS = [
  { id: "sbi", name: "State Bank of India", short: "SBI", color: "#1a4dbe" },
  { id: "hdfc", name: "HDFC Bank", short: "HDFC", color: "#004b87" },
  { id: "icici", name: "ICICI Bank", short: "ICICI", color: "#f37a1f" },
  { id: "axis", name: "Axis Bank", short: "AXIS", color: "#97144d" },
];

type ModalStep = "select" | "otp" | "success";

export default function AAConsentModal({ isOpen, onClose, onConnected }: AAConsentModalProps) {
  const [step, setStep] = useState<ModalStep>("select");
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleBankSelect = (bankId: string) => {
    setSelectedBank(bankId);
    setStep("otp");
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;
    setIsVerifying(true);
    // Simulate OTP verification
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsVerifying(false);
    setStep("success");
    setTimeout(() => {
      onConnected();
      handleReset();
    }, 2500);
  };

  const handleReset = () => {
    setStep("select");
    setSelectedBank(null);
    setOtp("");
    setIsVerifying(false);
    onClose();
  };

  if (!isOpen) return null;

  const bank = BANKS.find((b) => b.id === selectedBank);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleReset}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          >
            <div
              className="w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden"
              style={{ backgroundColor: "var(--bg)", borderColor: "var(--border-subtle)" }}
            >
              {/* Header */}
              <div className="px-6 py-5 border-b flex items-center justify-between" style={{ borderColor: "var(--border-subtle)" }}>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl border" style={{ backgroundColor: "rgba(16,185,129,0.12)", borderColor: "rgba(16,185,129,0.3)" }}>
                    <Building2 size={18} style={{ color: "#10b981" }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>🔗 Connect Bank Account (RBI AA)</h3>
                    <p className="text-[10px] uppercase tracking-wider font-mono" style={{ color: "var(--text-muted)" }}>Account Aggregator Framework</p>
                  </div>
                </div>
                <button onClick={handleReset} className="p-2 rounded-xl border hover:bg-white/5 transition-all" style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}>
                  <X size={16} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {step === "select" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                      Select your bank to link via RBI-regulated Account Aggregator. Your data is encrypted and shared only with your consent.
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {BANKS.map((b) => (
                        <button
                          key={b.id}
                          onClick={() => handleBankSelect(b.id)}
                          className="rounded-2xl border p-4 flex flex-col items-center gap-3 transition-all hover:bg-white/5 hover:scale-[1.02] active:scale-[0.98]"
                          style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--card-bg)" }}
                        >
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-sm"
                            style={{ backgroundColor: b.color }}
                          >
                            {b.short}
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-primary)" }}>
                            {b.name}
                          </span>
                        </button>
                      ))}
                    </div>
                    <p className="text-[10px] text-center" style={{ color: "var(--text-muted)" }}>
                      Powered by Setu / Finvu • RBI Licensed AA
                    </p>
                  </motion.div>
                )}

                {step === "otp" && bank && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-xs" style={{ backgroundColor: bank.color }}>
                        {bank.short}
                      </div>
                      <div>
                        <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{bank.name}</p>
                        <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Enter the OTP sent to your registered mobile</p>
                      </div>
                    </div>

                    <form onSubmit={handleOtpSubmit} className="space-y-4">
                      <div className="flex items-center gap-3">
                        <KeyRound size={16} style={{ color: "var(--text-muted)" }} />
                        <input
                          type="text"
                          maxLength={6}
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                          placeholder="● ● ● ● ● ●"
                          className="flex-1 border rounded-xl py-3 px-4 text-center text-lg font-mono tracking-[0.5em] focus:outline-none"
                          style={{ backgroundColor: "var(--surface-overlay)", borderColor: "var(--border-subtle)", color: "var(--text-primary)" }}
                          autoFocus
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={otp.length !== 6 || isVerifying}
                        className="w-full py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-40 flex items-center justify-center gap-2"
                        style={{ backgroundColor: "var(--accent)", color: "var(--bg)" }}
                      >
                        {isVerifying ? (
                          <>
                            <Loader2 size={16} className="animate-spin" /> Verifying...
                          </>
                        ) : (
                          <>
                            <Smartphone size={16} /> Verify & Link Account
                          </>
                        )}
                      </button>
                    </form>
                    <p className="text-[10px] text-center" style={{ color: "var(--text-muted)" }}>Demo: Enter any 6 digits to simulate verification</p>
                  </motion.div>
                )}

                {step === "success" && bank && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-4 py-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", damping: 10 }}
                      className="w-16 h-16 rounded-full mx-auto flex items-center justify-center"
                      style={{ backgroundColor: "rgba(16,185,129,0.15)" }}
                    >
                      <CheckCircle size={32} style={{ color: "#10b981" }} />
                    </motion.div>
                    <div>
                      <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Account Linked Successfully</p>
                      <p className="text-[10px] mt-1" style={{ color: "var(--text-muted)" }}>{bank.name} is now connected via Account Aggregator</p>
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl status-approved">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Active / Linked</span>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
