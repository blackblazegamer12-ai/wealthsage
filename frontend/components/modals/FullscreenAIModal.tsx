"use client";
import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Minimize2,
  Sparkles,
  Send,
  Camera,
  Trash2,
  RotateCcw,
  Bot,
  User,
  Zap,
  ShieldAlert,
  ArrowRight
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import ReceiptScannerModal from "../ReceiptScannerModal";
import VoiceInputButton from "../voice/VoiceInputButton";

interface FullscreenAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  insights: Array<{ id: string; message: string; type: string }>;
  inputValue: string;
  setInputValue: (val: string) => void;
  onSendMessage: (msg: string) => void;
  isTyping: boolean;
  isScanning: boolean;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearChat?: () => void;
}

export default function FullscreenAIModal({
  isOpen,
  onClose,
  insights,
  inputValue,
  setInputValue,
  onSendMessage,
  isTyping,
  isScanning,
  onFileUpload,
  onClearChat
}: FullscreenAIModalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [insights, isTyping]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const quickPills = [
    { label: "⚡ Deep Cash Leak Audit", prompt: "Perform a deep audit on my spending habits and identify cash flow leaks." },
    { label: "📊 5-Year Compound Forecast", prompt: "Forecast my 5-year wealth trajectory based on current monthly surplus." },
    { label: "🛡️ Zero-Revenue Runway", prompt: "Evaluate my survival runway in months if income drops to zero." },
    { label: "🛒 Log $45 Grocery Run", prompt: "Log $45 expense at Whole Foods for groceries" },
    { label: "📈 Rebalance $2k into Index SIP", prompt: "Log an automated index fund SIP investment of $2,000 monthly" },
    { label: "🧹 Reset Ledger", prompt: "reset the ledger" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue("");
    }
  };

  const handleVoiceTranscript = (spokenText: string) => {
    setInputValue(spokenText);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="fullscreen-ai-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 lg:p-10 bg-black/60 backdrop-blur-3xl overflow-hidden"
        >
          {/* Clean AI workspace */}
          <motion.div
            initial={{ scale: 0.96, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="w-full max-w-5xl h-full max-h-[92vh] card-clean rounded-2xl flex flex-col relative overflow-hidden"
          >
            {/* Top Mirror Header Bar */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/30 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl royal-btn-accent flex items-center justify-center">
                  <Sparkles size={20} className="text-black" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-lg tracking-tight">
                      WealthSage Glass Mirror AI
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[var(--accent-glow)] text-[var(--accent-primary)] border border-[var(--border-royal)]">
                      LLaMA 3.3 Versatile 70B
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Fullscreen quant reasoning engine with mathematical proofs & autonomous ledger manipulation.
                  </p>
                </div>
              </div>

              {/* Window Controls */}
              <div className="flex items-center gap-2">
                {onClearChat && (
                  <button
                    type="button"
                    onClick={onClearChat}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/10 text-xs font-semibold flex items-center gap-1.5"
                    title="Clear chat context"
                  >
                    <RotateCcw size={14} /> Clear
                  </button>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all border border-white/15 flex items-center gap-1 text-xs font-bold"
                  title="Minimize back to dashboard"
                >
                  <Minimize2 size={16} /> Exit Mirror
                </button>
              </div>
            </div>

            {/* Chat Stream Viewport */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 scroll-smooth"
            >
              {insights.map((msg) => {
                const isUser = msg.type === "user";

                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-start gap-3.5 max-w-3xl ${
                      isUser ? "ml-auto flex-row-reverse" : "mr-auto"
                    }`}
                  >
                    {/* Avatar Icon */}
                    <div
                      className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 border ${
                        isUser
                          ? "bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] border-[var(--border-royal)]"
                          : "royal-btn-accent text-black border-white/20"
                      }`}
                    >
                      {isUser ? <User size={18} /> : <Bot size={18} />}
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={`p-5 rounded-3xl text-sm leading-relaxed backdrop-blur-xl border ${
                        isUser
                          ? "bg-[var(--accent-glow)] border-[var(--border-royal)] text-white rounded-tr-sm"
                          : "bg-black/40 border-white/10 text-slate-100 rounded-tl-sm shadow-xl"
                      }`}
                    >
                      {isUser ? (
                        <p className="whitespace-pre-wrap font-medium">{msg.message}</p>
                      ) : (
                        <div className="prose prose-invert max-w-none text-slate-200 prose-p:leading-relaxed prose-headings:text-white prose-a:text-[var(--accent-primary)]">
                          <ReactMarkdown
                            remarkPlugins={[remarkMath]}
                            rehypePlugins={[[rehypeKatex, { strict: false }]]}
                          >
                            {msg.message}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-black/40 border border-white/10 w-fit text-sm text-[var(--accent-primary)]"
                >
                  <Sparkles className="animate-spin w-4 h-4" />
                  <span className="text-white font-medium">WealthSage Quantum Engine is synthesizing...</span>
                </motion.div>
              )}
            </div>

            {/* Quick Strategy Pills Bar */}
            <div className="px-6 py-2.5 bg-black/40 border-t border-white/10 flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest shrink-0 mr-1 flex items-center gap-1">
                <Zap size={12} className="text-[var(--accent-primary)]" /> Prompts:
              </span>
              {quickPills.map((qp) => (
                <button
                  key={qp.label}
                  type="button"
                  onClick={() => onSendMessage(qp.prompt)}
                  className="shrink-0 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/10 text-xs text-slate-300 hover:text-white border border-white/10 transition-all font-medium"
                >
                  {qp.label}
                </button>
              ))}
            </div>

            {/* Bottom Translucent Floating Dock */}
            <div className="p-4 sm:p-6 border-t border-white/10 bg-black/50 backdrop-blur-2xl">
              <form onSubmit={handleSubmit} className="flex items-center gap-2.5">
                <ReceiptScannerModal isScanning={isScanning} onFileUpload={onFileUpload} />

                {/* Voice Input Mic Button */}
                <VoiceInputButton onTranscript={handleVoiceTranscript} />

                <div className="relative flex-1">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type or click the microphone to speak financial questions or commands..."
                    className="w-full bg-[#090a0f]/80 border border-white/15 rounded-2xl py-4 pl-5 pr-14 text-white placeholder-slate-400 focus:outline-none focus:border-[var(--accent-primary)] transition-all text-sm shadow-inner"
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isTyping}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-xl royal-btn-accent disabled:opacity-40 transition-all cursor-pointer"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
