"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BeamButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function BeamButton({ href, children, className = "", onClick }: BeamButtonProps) {
  const isExternal = href.startsWith('http') || href.startsWith('#');
  
  const content = (
    <div className="relative z-10 flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm transition-all shadow-[0_0_20px_rgba(245,158,11,0.4)] w-full h-full">
      {children}
    </div>
  );

  return (
    <div className={`beam-border-wrapper hover:scale-105 transition-transform ${className}`}>
      {isExternal ? (
        <a href={href} onClick={onClick} className="beam-border-content w-full">
          {content}
        </a>
      ) : (
        <Link href={href} onClick={onClick} className="beam-border-content w-full">
          {content}
        </Link>
      )}
    </div>
  );
}
