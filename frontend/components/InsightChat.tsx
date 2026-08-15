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
    <div className="bg-[#161824] p-6 rounded-2xl border border-white/10 relative overflow-hidden flex flex-col h-[500px]">
      <div className="absolute top-20 right-20 w-40 h-40 bg-[#8B5CF6]/10 rounded-full blur-3xl pointer-events-none" />
      
      <h2 className="text-xl font-bold mb-6 text-[#8B5CF6] flex items-center gap-2">
        <span>✨</span> AI Insights
      </h2>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {insights.map((insight) => (
          <div 
            key={insight.id}
            className={`p-4 rounded-xl border-l-4 text-sm leading-relaxed ${
              insight.type === 'advice' ? 'bg-white/[0.04] border-[#8B5CF6]' : 'bg-white/[0.02] border-white/20 opacity-80'
            }`}
          >
            <p><strong className="text-white">{insight.type === 'advice' ? 'WealthSage' : 'Alert'}:</strong> {insight.message}</p>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-4 border-t border-white/10">
        <input 
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleSendMessage}
          disabled={loading}
          placeholder={loading ? "Sage is thinking..." : "Ask Sage (Press Enter)..."}
          className="w-full bg-[#090A0F] border border-white/20 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#8B5CF6] transition-colors"
        />
      </div>
    </div>
  );
}