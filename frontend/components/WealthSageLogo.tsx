import React from 'react';

interface WealthSageLogoProps {
  className?: string;
}

export default function WealthSageLogo({ className = "w-8 h-8" }: WealthSageLogoProps) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      aria-label="WealthSage Logo"
      role="img"
    >
      <defs>
        <linearGradient id="ws-brass" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E5C158" />
          <stop offset="100%" stopColor="#B48A5A" />
        </linearGradient>
        <linearGradient id="ws-emerald" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
        <filter id="ws-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Left Abstract Line (Warm Brass) */}
      <path 
        d="M 20 30 L 38 75 L 50 48" 
        stroke="url(#ws-brass)" 
        strokeWidth="10" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      
      {/* Right Abstract Line (Emerald) */}
      <path 
        d="M 50 48 L 62 75 L 80 25" 
        stroke="url(#ws-emerald)" 
        strokeWidth="10" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      
      {/* Upward Trending Arrow / Peak */}
      <path 
        d="M 64 25 L 80 25 L 80 41" 
        stroke="url(#ws-emerald)" 
        strokeWidth="10" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />

      {/* Emerald Glow Layer */}
      <path 
        d="M 50 48 L 62 75 L 80 25 M 64 25 L 80 25 L 80 41" 
        stroke="url(#ws-emerald)" 
        strokeWidth="10" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        filter="url(#ws-glow)"
        opacity="0.45"
      />
    </svg>
  );
}
