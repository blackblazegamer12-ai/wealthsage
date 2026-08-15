"use client";
import React, { useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';

export default function PlaidLinkButton({ userId, onBankConnected }: { userId: string; onBankConnected?: () => void }) {
  const [token, setToken] = useState<string | null>(null);
  const [isMock, setIsMock] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statusText, setStatusText] = useState("🔗 Connect Bank Account");

  useEffect(() => {
    async function createLinkToken() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        
        const response = await fetch(`${apiUrl}/api/plaid/create-link-token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId })
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.link_token) {
            setToken(data.link_token);
            setIsMock(Boolean(data.is_mock));
            setStatusText(data.is_mock ? "🔗 Connect Bank (Demo Mode)" : "🔗 Connect Bank Account");
            setLoading(false);
            return;
          }
        }
        
        setStatusText("🔗 Connect Bank (Demo Mode)");
        setIsMock(true);
        setLoading(false);
      } catch (err) {
        console.warn("Backend link token unavailable, enabling demo mode:", err);
        setStatusText("🔗 Connect Bank (Demo Mode)");
        setIsMock(true);
        setLoading(false);
      }
    }
    
    // Safety timer: If backend doesn't respond in 3 seconds, unlock button anyway
    const timer = setTimeout(() => {
      if (loading) {
        setLoading(false);
        setIsMock(true);
        setStatusText("🔗 Connect Bank (Demo Mode)");
      }
    }, 3000);

    createLinkToken();
    return () => clearTimeout(timer);
  }, [userId]);

  const { open, ready } = usePlaidLink({
    token: token && !isMock ? token : null,
    onSuccess: async (public_token) => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        await fetch(`${apiUrl}/api/plaid/exchange-token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ public_token, user_id: userId })
        });
        alert("Bank successfully connected with WealthSage!");
        if (onBankConnected) onBankConnected();
        else window.location.reload();
      } catch (err) {
        console.error("Error exchanging token:", err);
      }
    },
  });

  const handleClick = () => {
    if (token && !isMock && ready) {
      open();
    } else {
      alert("⚡ Running in Sandbox Demo Mode: Bank account connection simulated successfully!");
      if (onBankConnected) onBankConnected();
    }
  };

  return (
    <button 
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 px-4 rounded-2xl transition-all shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/35 cursor-pointer disabled:opacity-50 text-sm"
    >
      {loading ? "Initializing..." : statusText}
    </button>
  );
}