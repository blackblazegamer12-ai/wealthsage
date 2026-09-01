"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import ToastContainer, { ToastMessage } from './Toast';

export default function PlaidLinkButton({ userId, onBankConnected }: { userId: string; onBankConnected?: () => void }) {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusText, setStatusText] = useState("🔗 Connect Bank Account");
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((title: string, description: string, type: "success" | "ai" | "warning" | "info") => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4500);
  }, []);

  useEffect(() => {
    async function createLinkToken() {
      try {
        const response = await fetch('/api/plaid/create-link-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId })
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.link_token) {
            setToken(data.link_token);
            setLoading(false);
            return;
          }
        } else {
          const errorData = await response.json();
          addToast("Plaid Link Error", errorData.error || "Failed to initialize Plaid.", "warning");
        }
        
        setStatusText("🔗 Connection Unavailable");
        setLoading(false);
      } catch (err) {
        console.warn("Backend link token unavailable:", err);
        setStatusText("🔗 Connection Unavailable");
        addToast("Network Error", "Unable to reach Plaid servers.", "warning");
        setLoading(false);
      }
    }
    
    createLinkToken();
  }, [userId, addToast]);

  const { open, ready } = usePlaidLink({
    token: token,
    onSuccess: async (public_token) => {
      try {
        const response = await fetch('/api/plaid/exchange-public-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ public_token, user_id: userId })
        });
        
        if (response.ok) {
          addToast("Success", "Bank successfully connected with WealthSage!", "success");
          if (onBankConnected) setTimeout(() => onBankConnected(), 1500);
          else setTimeout(() => window.location.reload(), 1500);
        } else {
           const errorData = await response.json();
           addToast("Exchange Error", errorData.error || "Failed to securely save bank connection.", "warning");
        }
      } catch (err) {
        console.error("Error exchanging token:", err);
        addToast("Exchange Error", "Failed to communicate securely with the server.", "warning");
      }
    },
    onExit: (err, metadata) => {
      if (err) {
        addToast("Plaid Link Exit", err.display_message || err.error_message || "An error occurred during link.", "warning");
      }
    }
  });

  const handleClick = () => {
    if (token && ready) {
      open();
    } else if (!token && !loading) {
      addToast("Setup Required", "Plaid is not properly configured. Check your environment variables.", "warning");
    }
  };

  return (
    <>
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts(t => t.filter(x => x.id !== id))} />
      <button 
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="bg-white/5 hover:bg-white/10 text-white font-semibold py-2.5 px-5 rounded-2xl transition-all border border-emerald-500/30 hover:border-emerald-400/60 shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer disabled:opacity-50 text-sm backdrop-blur-md flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 rounded-full border-2 border-emerald-500/30 border-t-emerald-400 animate-spin"></span>
            Initializing Secure Link...
          </>
        ) : (
          statusText
        )}
      </button>
    </>
  );
}
