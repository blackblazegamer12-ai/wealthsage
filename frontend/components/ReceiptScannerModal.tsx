import React, { useRef } from 'react';
import { Camera, Sparkles } from 'lucide-react';

interface ReceiptScannerModalProps {
  isScanning: boolean;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ReceiptScannerModal({
  isScanning,
  onFileUpload,
}: ReceiptScannerModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={onFileUpload}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isScanning}
        title="Scan receipt"
        className="p-3.5 bg-[#161824] border border-white/10 rounded-2xl hover:border-[#8B5CF6]/50 hover:bg-[#8B5CF6]/10 transition-all text-[#8B5CF6] disabled:opacity-50 shrink-0"
      >
        {isScanning ? <Sparkles className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
      </button>
    </>
  );
}
