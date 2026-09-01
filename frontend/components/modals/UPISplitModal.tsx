import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, QrCode, Users, Copy, CheckCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface UPISplitModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: any;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(amount);

export default function UPISplitModal({ isOpen, onClose, transaction }: UPISplitModalProps) {
  const [splitCount, setSplitCount] = useState(2);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !transaction) return null;

  const totalAmount = Number(transaction.amount) || 0;
  const splitAmount = (totalAmount / splitCount).toFixed(2);

  // Generate UPI Intent URL (Using a dummy VPA for demonstration)
  // Format: upi://pay?pa=name@bank&pn=Name&am=Amount&cu=INR&tn=Note
  const upiId = "wealthsage@upi"; 
  const upiIntentUrl = `upi://pay?pa=${upiId}&pn=WealthSageUser&am=${splitAmount}&cu=INR&tn=Split for ${encodeURIComponent(transaction.description || 'Expense')}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(upiIntentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-md bg-[var(--bg)] border border-[var(--border-color)] rounded-3xl overflow-hidden shadow-2xl shadow-[var(--accent-brass-dim)] glass-panel"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <QrCode className="text-[var(--accent)]" /> Smart UPI Split
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-1 font-mono">
                {transaction.description} • {formatCurrency(totalAmount)}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Split Controls */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-3 text-[var(--text-muted)] font-mono text-sm">
                <Users size={16} /> Split Between
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setSplitCount(Math.max(2, splitCount - 1))}
                  className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >-</button>
                <span className="font-bold text-white text-lg w-4 text-center">{splitCount}</span>
                <button 
                  onClick={() => setSplitCount(Math.min(10, splitCount + 1))}
                  className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >+</button>
              </div>
            </div>

            {/* QR Display */}
            <div className="flex flex-col items-center justify-center py-4">
              <p className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-widest mb-4">
                Scan to pay {formatCurrency(Number(splitAmount))}
              </p>
              
              <div className="p-4 bg-white rounded-2xl shadow-xl">
                <QRCodeSVG value={upiIntentUrl} size={180} level="H" includeMargin={false} />
              </div>

              <div className="mt-6 flex items-center gap-2">
                <button 
                  onClick={handleCopyLink}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-mono tracking-wide bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  {copied ? <CheckCircle size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  {copied ? "Copied UPI Link" : "Copy Intent URL"}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
