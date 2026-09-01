"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mic, Camera, PenTool, CheckCircle, UploadCloud } from "lucide-react";

interface FastCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: { description: string; amount: string; type: string; category: string };
  setFormData: React.Dispatch<React.SetStateAction<{ description: string; amount: string; type: string; category: string }>>;
  onSubmit: (e: React.FormEvent) => void;
  isDemoMode?: boolean;
  onDirectSave?: (payload: { description: string, amount: number, type: 'inflow'|'outflow', category: string }) => void;
}

export default function FastCaptureModal({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSubmit,
  isDemoMode,
  onDirectSave,
}: FastCaptureModalProps) {
  const [activeTab, setActiveTab] = useState<"voice" | "receipt" | "manual">("manual");
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Mock Voice Logging
  const handleVoiceToggle = () => {
    if (isDemoMode) return;
    if (!isListening) {
      setIsListening(true);
      setTranscript("");
      // Simulate listening and parsing
      setTimeout(() => setTranscript("Spent ₹450 on fuel..."), 1500);
      setTimeout(() => {
        setIsListening(false);
        if (onDirectSave) {
          onDirectSave({ description: "Fuel Station", amount: 450, type: "outflow", category: "Transport" });
        }
        setActiveTab("manual");
        onClose();
      }, 3000);
    } else {
      setIsListening(false);
    }
  };

  // Mock Receipt OCR
  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isDemoMode) return;
    if (e.target.files && e.target.files.length > 0) {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        if (onDirectSave) {
          onDirectSave({ description: "Swiggy Delivery", amount: 780, type: "outflow", category: "Food" });
        }
        setActiveTab("manual");
        onClose();
      }, 2000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="fast-capture-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          onClick={onClose}
        >
          <motion.div
            key="fast-capture-card"
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border"
            style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border-subtle)' }}
          >
            {/* Header */}
            <div className="p-6 pb-0 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Fast Capture</h2>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Zero-friction ledger entry</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl transition-colors bg-white/5 hover:bg-white/10"
                style={{ color: 'var(--text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            {isDemoMode && (
              <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs text-center font-bold">
                Disabled in Demo Mode
              </div>
            )}

            {/* Tabs */}
            <div className="flex px-6 pt-4 gap-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
              {(["voice", "receipt", "manual"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 text-xs font-bold uppercase tracking-widest transition-all ${
                    activeTab === tab
                      ? "border-b-2"
                      : "opacity-50 hover:opacity-100"
                  }`}
                  style={{
                    borderColor: activeTab === tab ? 'var(--accent)' : 'transparent',
                    color: activeTab === tab ? 'var(--accent)' : 'var(--text-primary)'
                  }}
                >
                  {tab === "voice" ? <span className="flex gap-2 items-center"><Mic size={14}/> Voice</span> :
                   tab === "receipt" ? <span className="flex gap-2 items-center"><Camera size={14}/> Receipt</span> :
                   <span className="flex gap-2 items-center"><PenTool size={14}/> Manual</span>}
                </button>
              ))}
            </div>

            <div className="p-6">
              {/* Voice Tab */}
              {activeTab === "voice" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-10">
                  <button
                    onClick={handleVoiceToggle}
                    disabled={isDemoMode}
                    className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all ${isListening ? 'animate-pulse' : 'hover:scale-105'} ${isDemoMode ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                    style={{ backgroundColor: isListening ? 'var(--accent-glow)' : 'var(--accent)', color: isListening ? 'var(--accent)' : 'var(--bg)', border: `1px solid ${isListening ? 'var(--accent)' : 'transparent'}` }}
                  >
                    <Mic size={32} />
                  </button>
                  <p className="mt-6 text-sm font-mono h-6 text-center" style={{ color: 'var(--text-primary)' }}>
                    {isListening ? "Listening..." : "Tap to speak (e.g., 'Spent ₹450 on fuel')"}
                  </p>
                  <p className="mt-2 text-xs h-4 font-mono font-bold" style={{ color: 'var(--accent)' }}>
                    {transcript}
                  </p>
                </motion.div>
              )}

              {/* Receipt Tab */}
              {activeTab === "receipt" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-6">
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl cursor-pointer transition-all hover:bg-white/[0.02]" style={{ borderColor: 'var(--border-royal)' }}>
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {isProcessing ? (
                        <>
                          <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin mb-4" style={{ borderColor: 'var(--accent) transparent var(--accent) var(--accent)' }}></div>
                          <p className="text-sm font-bold" style={{ color: 'var(--accent)' }}>Extracting data via OCR...</p>
                        </>
                      ) : (
                        <>
                          <UploadCloud size={40} className="mb-3" style={{ color: 'var(--text-muted)' }} />
                          <p className="mb-2 text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                            <span style={{ color: 'var(--accent)' }}>Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>PNG, JPG, PDF (Max 5MB)</p>
                        </>
                      )}
                    </div>
                    <input type="file" className="hidden" accept="image/*,.pdf" onChange={handleReceiptUpload} disabled={isProcessing || isDemoMode} />
                  </label>
                </motion.div>
              )}

              {/* Manual Tab */}
              {activeTab === "manual" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                      <label className="text-xs mb-1.5 block font-bold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Description</label>
                      <input
                        type="text"
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        disabled={isDemoMode}
                        className="w-full rounded-xl p-3 outline-none transition-all text-sm font-bold border disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ backgroundColor: 'var(--surface-overlay)', color: 'var(--text-primary)', borderColor: 'var(--border-subtle)' }}
                        placeholder="e.g. Swiggy Order"
                      />
                    </div>

                    <div>
                      <label className="text-xs mb-1.5 block font-bold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Amount (₹)</label>
                      <input
                        type="number"
                        required
                        min="1"
                        step="1"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        disabled={isDemoMode}
                        className="w-full rounded-xl p-3 outline-none transition-all text-sm font-bold border disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ backgroundColor: 'var(--surface-overlay)', color: 'var(--text-primary)', borderColor: 'var(--border-subtle)' }}
                        placeholder="450"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs mb-1.5 block font-bold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Type</label>
                        <select
                          value={formData.type}
                          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                          disabled={isDemoMode}
                          className="w-full rounded-xl p-3 outline-none appearance-none transition-all text-sm font-bold border disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ backgroundColor: 'var(--surface-overlay)', color: 'var(--text-primary)', borderColor: 'var(--border-subtle)' }}
                        >
                          <option value="outflow">Outflow</option>
                          <option value="inflow">Inflow</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs mb-1.5 block font-bold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Category</label>
                        <input
                          type="text"
                          required
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          disabled={isDemoMode}
                          className="w-full rounded-xl p-3 outline-none transition-all text-sm font-bold border disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ backgroundColor: 'var(--surface-overlay)', color: 'var(--text-primary)', borderColor: 'var(--border-subtle)' }}
                          placeholder="Food & Dining"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isDemoMode}
                      className={`w-full py-3.5 rounded-xl mt-4 text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] ${isDemoMode ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                      style={{ backgroundColor: 'var(--accent)', color: 'var(--bg)' }}
                    >
                      <CheckCircle size={16} /> Save Record
                    </button>
                  </form>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
