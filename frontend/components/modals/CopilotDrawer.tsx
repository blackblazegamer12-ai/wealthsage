"use client";
import React, { useRef, useEffect } from "react";
import { useFocusTrap } from "../../lib/useFocusTrap";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Sparkles,
  Send,
  Camera,
  Trash2,
  RotateCcw,
  Bot,
  User,
  Zap
} from "lucide-react";
import dynamic from "next/dynamic";
import ReceiptScannerModal from "../ReceiptScannerModal";
import VoiceInputButton from "../voice/VoiceInputButton";

const MarkdownRenderer = dynamic(() => import("../MarkdownRenderer"), { 
  ssr: false,
  loading: () => <div className="text-sm text-gray-500 animate-pulse">Loading AI modules...</div>
});

interface CopilotDrawerProps {
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
  isDemoMode?: boolean;
}

export default function CopilotDrawer({
  isOpen,
  onClose,
  insights,
  inputValue,
  setInputValue,
  onSendMessage,
  isTyping,
  isScanning,
  onFileUpload,
  onClearChat,
  isDemoMode
}: CopilotDrawerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const focusTrapRef = useFocusTrap(isOpen);

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
    { label: "🛒 Log ₹2000 Grocery Run", prompt: "Log ₹2000 expense at Whole Foods for groceries" },
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
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            ref={focusTrapRef}
            role="dialog"
            aria-modal="true"
            aria-label="AI Copilot Drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-[60] w-full md:w-[450px] lg:w-[500px] border-l flex flex-col shadow-2xl"
            style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border-subtle)' }}
          >
            {/* Header */}
            <div className="px-6 py-5 border-b flex items-center justify-between md:backdrop-blur-xl max-md:backdrop-blur-sm max-md:bg-black/60" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border-subtle)' }}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl flex items-center justify-center border" style={{ backgroundColor: 'var(--accent)', color: 'var(--bg)', borderColor: 'var(--accent)' }}>
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="font-bold tracking-tight text-sm" style={{ color: 'var(--text-primary)' }}>
                    Copilot
                  </h3>
                  <p className="text-[10px] uppercase font-mono tracking-widest mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    Gemini Intelligence
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {onClearChat && (
                  <button
                    type="button"
                    onClick={onClearChat}
                    className="p-2 rounded-xl transition-all border text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-white/5"
                    style={{ color: 'var(--text-muted)', borderColor: 'var(--border-subtle)' }}
                  >
                    <RotateCcw size={12} /> Clear
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-xl transition-all border hover:bg-white/5"
                  style={{ color: 'var(--text-primary)', borderColor: 'var(--border-subtle)' }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div
              ref={scrollRef}
              aria-live="polite" 
              role="log" 
              className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scroll-smooth"
            >
              {insights.map((msg) => {
                const isUser = msg.type === "user";

                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-start gap-3 max-w-[90%] ${
                      isUser ? "ml-auto flex-row-reverse" : "mr-auto"
                    }`}
                  >
                    {/* Avatar Icon */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                        isUser
                          ? "bg-white/10 text-white border-white/20"
                          : "border-transparent"
                      }`}
                      style={!isUser ? { backgroundColor: 'var(--accent)', color: 'var(--bg)' } : {}}
                    >
                      {isUser ? <User size={14} /> : <Bot size={14} />}
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={`p-4 text-xs leading-relaxed border ${
                        isUser
                          ? "rounded-2xl rounded-tr-sm"
                          : "rounded-2xl rounded-tl-sm"
                      }`}
                      style={{
                        backgroundColor: isUser ? 'var(--surface-overlay)' : 'var(--card-bg)',
                        borderColor: isUser ? 'var(--border-subtle)' : 'var(--border-subtle)',
                        color: 'var(--text-primary)'
                      }}
                    >
                      {isUser ? (
                        <p className="whitespace-pre-wrap font-medium">{msg.message}</p>
                      ) : (
                        <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed">
                          <MarkdownRenderer 
                            content={msg.message} 
                            className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10 prose-headings:font-bold prose-a:text-[var(--accent)]"
                          />
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
                  className="flex items-center gap-2 p-3 rounded-2xl border w-fit text-xs"
                  style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-subtle)', color: 'var(--accent)' }}
                >
                  <Sparkles className="animate-spin w-3 h-3" />
                  <span className="font-bold uppercase tracking-widest text-[9px]">Synthesizing...</span>
                </motion.div>
              )}
            </div>

            {/* Quick Prompts */}
            <div className={`px-4 py-3 border-t overflow-x-auto no-scrollbar flex items-center gap-2 ${isDemoMode ? 'opacity-50 pointer-events-none grayscale' : ''}`} style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg)' }}>
              {quickPills.map((qp) => (
                <button
                  key={qp.label}
                  type="button"
                  onClick={() => onSendMessage(qp.prompt)}
                  disabled={isDemoMode}
                  aria-label={`Quick prompt: ${qp.label}`}
                  className="shrink-0 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all hover:bg-white/5"
                  style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
                >
                  {qp.label}
                </button>
              ))}
            </div>

            {/* Input Area */}
            <div className={`p-4 border-t ${isDemoMode ? 'opacity-50 pointer-events-none grayscale' : ''}`} style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg)' }}>
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <ReceiptScannerModal isScanning={isScanning} onFileUpload={onFileUpload} />
                <VoiceInputButton onTranscript={handleVoiceTranscript} />

                <div className="relative flex-1">
                  <input
                    type="text"
                    disabled={isDemoMode}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={isDemoMode ? "Chat is disabled in Demo Mode" : "Ask Copilot..."}
                    className="w-full border rounded-xl py-3 pl-4 pr-12 text-xs focus:outline-none transition-all shadow-inner"
                    style={{ backgroundColor: 'var(--surface-overlay)', color: 'var(--text-primary)', borderColor: 'var(--border-subtle)' }}
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isTyping || isDemoMode}
                    aria-label="Send message"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg disabled:opacity-40 transition-all cursor-pointer"
                    style={{ backgroundColor: 'var(--accent)', color: 'var(--bg)' }}
                  >
                    <Send size={14} />
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
