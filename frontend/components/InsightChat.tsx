"use client";
import React, { useState } from 'react';

export interface AIInsight {
  id: string;
  type: 'advice' | 'alert' | 'user';
  message: string;
}

interface InsightChatProps {
  insights: AIInsight[];
  userId?: string;
}

export default function InsightChat({ insights, userId = "demo-user-id" }: InsightChatProps) {
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputMessage.trim() !== '') {
      setLoading(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        
        const response = await fetch(`${apiUrl}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: inputMessage,
            history: [], 
            transactions: [], 
            user_id: userId   
          })
        });

        if (!response.ok) {
          throw new Error(`Server returned status: ${response.status}`);
        }

        const data = await response.json();

        if (data.action === "REFRESH_DATA") {
          alert("Ledger successfully wiped by WealthSage!");
          window.location.reload(); 
        } else {
          alert("WealthSage: " + (data.reply || "No response received"));
        }
      } catch (error) {
        console.error("Chat error:", error);
        alert("Failed to connect to WealthSage AI.");
      } finally {
        setLoading(false);
        setInputMessage("");
      }
    }
  };

  return (
    <div className="p-6 rounded-2xl relative overflow-hidden flex flex-col h-[500px]" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
      <div className="absolute top-20 right-20 w-40 h-40 rounded-full blur-3xl pointer-events-none" style={{ backgroundColor: 'var(--accent-glow)' }} />
      
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--accent-primary)' }}>
        <span>✨</span> AI Insights
      </h2>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {insights.map((insight) => (
          <div 
            key={insight.id}
            className={`p-4 rounded-xl border-l-4 text-sm leading-relaxed ${
              insight.type === 'advice' ? 'opacity-100' : 'opacity-80'
            }`}
            style={{ 
              backgroundColor: 'var(--surface-overlay)', 
              borderLeftColor: insight.type === 'advice' ? 'var(--accent-primary)' : 'var(--border-strong)'
            }}
          >
            <p><strong style={{ color: 'var(--text-primary)' }}>{insight.type === 'advice' ? 'WealthSage' : 'Alert'}:</strong> <span style={{ color: 'var(--text-secondary)' }}>{insight.message}</span></p>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <input 
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleSendMessage}
          disabled={loading}
          placeholder={loading ? "Sage is thinking..." : "Ask Sage (Press Enter)..."}
          className="w-full rounded-xl p-3 focus:outline-none transition-colors"
          style={{ backgroundColor: 'var(--surface-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
        />
      </div>
    </div>
  );
}