// src/components/configure/RoomPreview.tsx
"use client";

import React, { useState } from "react";
import FrameRenderer, { FrameMaterial } from "./FrameRenderer";
import { PhotoFilter, RoomTheme } from "@/store/use-frame-store";

interface RoomPreviewProps {
  imageSrc: string;
  material: FrameMaterial;
  sizeLabel: string | null; // 'A2' | 'A3' | 'A4' | 'A5'
  photoFilter: PhotoFilter;
  mouldingStyle: string;
  hasMat: boolean;
  matColor: string;
  matWidth: number;
  glassReflection: number;
  initialTheme?: RoomTheme;
}

export default function RoomPreview({
  imageSrc,
  material,
  sizeLabel = "A3",
  photoFilter,
  mouldingStyle,
  hasMat,
  matColor,
  matWidth,
  glassReflection,
  initialTheme = "living-modern",
}: RoomPreviewProps) {
  const [theme, setTheme] = useState<RoomTheme>(initialTheme);

  // Échelle relative du cadre selon le format ISO par rapport au mobilier du salon
  // A2 est imposant au-dessus d'un canapé, A5 est un petit cadre intime
  const getScaleDimensions = () => {
    switch (sizeLabel) {
      case "A2":
        return { w: 250, h: 350, label: "Format A2 (42 × 60 cm) — Pièce maîtresse" };
      case "A3":
        return { w: 200, h: 280, label: "Format A3 (30 × 42 cm) — Équilibre parfait" };
      case "A4":
        return { w: 155, h: 218, label: "Format A4 (21 × 30 cm) — Idéal étagère ou duo" };
      case "A5":
      default:
        return { w: 120, h: 170, label: "Format A5 (15 × 21 cm) — Format intime" };
    }
  };

  const { w, h, label } = getScaleDimensions();

  return (
    <div className="relative w-full h-[520px] md:h-[620px] rounded-3xl overflow-hidden border border-[var(--border)] shadow-2xl flex flex-col justify-between select-none">
      {/* ── 1. FOND DE PIÈCE / DÉCOR ARCHITECTURAL ── */}
      {theme === "living-modern" && (
        <div className="absolute inset-0 bg-[#ebe7df]">
          {/* Texture mur chaux / plâtre doux */}
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: `radial-gradient(#a39b8b 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
            }}
          />
          {/* Ligne de cimaise / boiserie en haut */}
          <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-[#d8d3c8] to-transparent" />
          {/* Sol en parquet chêne clair */}
          <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#cbb194] to-[#dec8b0] border-t border-[#bfa384]">
            {/* Plinthe */}
            <div className="absolute top-0 left-0 right-0 h-4 bg-[#ede8e0] border-b border-[#cfc8bc]" />
          </div>
          {/* Canapé moderne scandinave stylisé en bas */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[85%] max-w-xl h-24 rounded-t-3xl bg-[#393b3e] shadow-2xl flex justify-center items-start pt-2">
            {/* Coussins lin doux */}
            <div className="flex gap-4 w-full px-8 justify-around">
              <div className="w-1/3 h-10 rounded-t-xl bg-[#4b4e53] shadow-inner" />
              <div className="w-1/3 h-10 rounded-t-xl bg-[#d98d2e]/30 shadow-inner border-t border-[#d98d2e]/40" />
              <div className="w-1/3 h-10 rounded-t-xl bg-[#4b4e53] shadow-inner" />
            </div>
          </div>
          {/* Plante d'intérieur sur le côté */}
          <div className="absolute bottom-16 left-6 md:left-12 flex flex-col items-center opacity-85">
            <div className="w-4 h-14 bg-gradient-to-t from-emerald-800 to-emerald-600 rounded-full rotate-[-15deg] shadow-lg" />
            <div className="w-4 h-16 bg-gradient-to-t from-emerald-700 to-emerald-500 rounded-full rotate-[12deg] -mt-10 shadow-lg" />
            <div className="w-8 h-10 bg-[#b0907a] rounded-b-xl shadow-md -mt-2" />
          </div>
        </div>
      )}

      {theme === "minimalist-gallery" && (
        <div className="absolute inset-0 bg-[#f4f2ee]">
          {/* Cône de spot lumineux de musée */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(255,250,235,0.85)_0%,transparent_75%)] pointer-events-none" />
          {/* Rail de spot en haut */}
          <div className="absolute top-2 left-10 right-10 h-1 bg-[#1c1917] rounded-full flex justify-center">
            <div className="w-4 h-3 bg-[#1c1917] rounded-b-md shadow-md" />
          </div>
          {/* Sol en béton ciré gris doux */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#c5c3be] to-[#dedcd7] border-t border-[#b8b6b0]">
            <div className="absolute top-0 left-0 right-0 h-3 bg-[#e8e6e1]" />
          </div>
          {/* Banc de galerie minimaliste en bois noir */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-72 h-6 bg-[#18181b] rounded shadow-xl flex justify-between px-6">
            <div className="w-2 h-7 bg-[#18181b] shadow-md -bottom-5 relative" />
            <div className="w-2 h-7 bg-[#18181b] shadow-md -bottom-5 relative" />
          </div>
        </div>
      )}

      {theme === "cozy-wood" && (
        <div className="absolute inset-0 bg-[#2d2824]">
          {/* Tasseaux de bois verticaux (panneaux acoustiques tendance) */}
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: `repeating-linear-gradient(90deg, #1c1815, #1c1815 14px, #4d3826 14px, #4d3826 28px)`,
            }}
          />
          {/* Halo de lampe chaleureuse */}
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-[radial-gradient(circle,rgba(230,165,75,0.18)_0%,transparent_70%)] pointer-events-none" />
          {/* Console / bureau flottant en chêne massif */}
          <div className="absolute bottom-0 left-0 right-0 h-28 bg-[#1f1b18] border-t-4 border-[#8c6747] shadow-2xl flex items-start justify-between px-16 pt-3">
            <div className="w-8 h-12 rounded-t-md bg-[#2d251f] border border-[#523d2c]" />
            <div className="w-16 h-8 rounded-md bg-[#161311] shadow-inner" />
          </div>
        </div>
      )}

      {/* ── 2. CADRE ACCROCHÉ AU MUR (CENTRAL & PROPORTIONNÉ) ── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center pt-8 pb-16">
        {/* Ombre portée douce sur le mur d'arrière-plan */}
        <div className="relative group">
          <FrameRenderer
            imageSrc={imageSrc}
            material={material}
            artWidth={w}
            artHeight={h}
            photoFilter={photoFilter}
            mouldingStyle={mouldingStyle}
            hasMat={hasMat}
            matColor={matColor}
            matWidth={matWidth * 0.7}
            glassReflection={glassReflection}
            className="transition-all duration-500 hover:scale-[1.02]"
          />
        </div>

        {/* Cordelette invisible ou repère d'échelle */}
        <div className="mt-4 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white/90 text-xs font-medium border border-white/10 shadow-lg">
          {label}
        </div>
      </div>

      {/* ── 3. SÉLECTEUR DE DÉCORS FLOTTANT EN BAS ── */}
      <div className="relative z-20 p-4 bg-black/50 backdrop-blur-xl border-t border-white/15 flex flex-wrap items-center justify-between gap-3 text-white">
        <span className="text-xs font-semibold tracking-wider uppercase text-amber-300/90 flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Mise en situation murale :
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setTheme("living-modern")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              theme === "living-modern"
                ? "bg-[var(--brand-500)] text-white shadow-brand"
                : "bg-white/10 hover:bg-white/20 text-white/80"
            }`}
          >
            🛋️ Salon Scandinave
          </button>
          <button
            type="button"
            onClick={() => setTheme("minimalist-gallery")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              theme === "minimalist-gallery"
                ? "bg-[var(--brand-500)] text-white shadow-brand"
                : "bg-white/10 hover:bg-white/20 text-white/80"
            }`}
          >
            🏛️ Galerie d'Art
          </button>
          <button
            type="button"
            onClick={() => setTheme("cozy-wood")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              theme === "cozy-wood"
                ? "bg-[var(--brand-500)] text-white shadow-brand"
                : "bg-white/10 hover:bg-white/20 text-white/80"
            }`}
          >
            🪵 Tasseaux & Chêne
          </button>
        </div>
      </div>
    </div>
  );
}
