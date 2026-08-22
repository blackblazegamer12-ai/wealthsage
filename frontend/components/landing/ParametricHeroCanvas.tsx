"use client";

import React, { useEffect, useRef, useState } from "react";
import { Sliders, Sparkles, Activity, ShieldCheck, Zap } from "lucide-react";

interface ParametricHeroCanvasProps {
  initialHealthScore?: number;
  initialVelocity?: number;
}

export default function ParametricHeroCanvas({
  initialHealthScore = 88,
  initialVelocity = 75,
}: ParametricHeroCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Dynamic interactive parameters controlled by user
  const [healthScore, setHealthScore] = useState<number>(initialHealthScore);
  const [velocity, setVelocity] = useState<number>(initialVelocity);
  const [frequency, setFrequency] = useState<number>(3);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Mouse coords normalized (-1 to 1)
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const isVisibleRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    // Particle nodes in the parametric field
    const particleCount = 45;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * 800,
      y: Math.random() * 450,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 2 + 1,
      alpha: Math.random() * 0.5 + 0.2,
      baseX: Math.random() * 800,
      baseY: Math.random() * 450,
    }));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    // Pause when out of viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    if (containerRef.current) observer.observe(containerRef.current);

    const render = () => {
      if (!isVisibleRef.current) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      time += 0.02 * (velocity / 50);

      // Smooth mouse interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      const width = canvas.getBoundingClientRect().width;
      const height = canvas.getBoundingClientRect().height;

      ctx.clearRect(0, 0, width, height);

      // Background subtle grid
      ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Parametric Waves (3 harmonic layers)
      const layers = [
        { color: "rgba(6, 182, 212, 0.4)", stroke: "#06b6d4", speed: 1, amp: 35, phase: 0 },
        { color: "rgba(16, 185, 129, 0.35)", stroke: "#10b981", speed: 1.4, amp: 45, phase: 2 },
        { color: "rgba(234, 179, 8, 0.4)", stroke: "#eab308", speed: 0.8, amp: 25, phase: 4 },
      ];

      layers.forEach((layer, idx) => {
        ctx.beginPath();
        const centerY = height * (0.45 + idx * 0.08);

        for (let x = 0; x <= width; x += 4) {
          const normX = x / width;
          const mouseInfluence = Math.sin(normX * Math.PI) * mouseRef.current.y * 30;
          const wave =
            Math.sin(normX * frequency * Math.PI + time * layer.speed + layer.phase) *
            (layer.amp * (healthScore / 70)) *
            Math.cos(normX * 2 + time * 0.5);

          const y = centerY + wave + mouseInfluence;

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.strokeStyle = layer.stroke;
        ctx.lineWidth = 2.5;
        ctx.shadowColor = layer.stroke;
        ctx.shadowBlur = 14;
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      // Render Interactive Particle Constellation
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Mouse displacement
        const dx = (mouseRef.current.x + 1) * 0.5 * width - p.x;
        const dy = (mouseRef.current.y + 1) * 0.5 * height - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          p.x -= (dx / dist) * 2;
          p.y -= (dy / dist) * 2;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(234, 179, 8, ${p.alpha})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      observer.disconnect();
    };
  }, [healthScore, velocity, frequency]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    mouseRef.current.targetX = x;
    mouseRef.current.targetY = y;
  };

  const handleMouseLeave = () => {
    mouseRef.current.targetX = 0;
    mouseRef.current.targetY = 0;
    setIsHovered(false);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#11131a]/95 via-[#08090d] to-[#08090d] border border-white/10 shadow-2xl p-4 sm:p-6"
    >
      {/* Ambient background glows */}
      <div className="absolute -top-10 -right-10 w-72 h-72 bg-amber-500/15 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-cyan-500/15 rounded-full blur-[90px] pointer-events-none" />

      {/* Top Telemetry Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Activity size={18} />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Parametric Quantum Yield Field
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse">
                REALTIME 60FPS
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Interactive multi-harmonic simulation of your sovereign cash velocity & compounding curvature
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/5 border border-white/10">
            <Zap size={13} className="text-amber-400" /> Velocity: <strong className="text-white tabular-nums">{velocity}%</strong>
          </span>
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/5 border border-white/10">
            <ShieldCheck size={13} className="text-emerald-400" /> Score: <strong className="text-emerald-400 tabular-nums">{healthScore}/100</strong>
          </span>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="relative w-full h-[280px] sm:h-[340px] rounded-2xl overflow-hidden bg-black/40 border border-white/5">
        <canvas ref={canvasRef} className="w-full h-full block cursor-crosshair" />

        {/* Overlay Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
          <span className="px-2.5 py-1 rounded-lg bg-black/70 border border-white/10 text-[10px] font-mono text-cyan-300 backdrop-blur-md">
            Harmonics: {frequency}λ
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-black/70 border border-white/10 text-[10px] font-mono text-amber-300 backdrop-blur-md">
            Entropy: 0.002%
          </span>
        </div>

        <div className="absolute bottom-3 right-3 pointer-events-none text-right">
          <p className="text-[10px] font-mono text-slate-400">Mouse Coordinate Warp</p>
          <p className="text-[11px] font-mono text-white tabular-nums">
            X: {mouseRef.current.targetX.toFixed(2)} | Y: {mouseRef.current.targetY.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Interactive Controls Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-4 pt-3 border-t border-white/10 relative z-10">
        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-slate-400 font-medium">Health Index</span>
            <span className="font-bold text-emerald-400 tabular-nums">{healthScore}/100</span>
          </div>
          <input
            type="range"
            min={30}
            max={100}
            value={healthScore}
            onChange={(e) => setHealthScore(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
          />
        </div>

        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-slate-400 font-medium">Cash Velocity Flow</span>
            <span className="font-bold text-cyan-400 tabular-nums">{velocity}%</span>
          </div>
          <input
            type="range"
            min={20}
            max={150}
            value={velocity}
            onChange={(e) => setVelocity(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-slate-400 font-medium">Harmonic Density</span>
            <span className="font-bold text-amber-400 tabular-nums">{frequency} Modes</span>
          </div>
          <input
            type="range"
            min={1}
            max={6}
            value={frequency}
            onChange={(e) => setFrequency(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
        </div>
      </div>
    </div>
  );
}
