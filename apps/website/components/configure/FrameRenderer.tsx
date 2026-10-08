// src/components/configure/FrameRenderer.tsx
"use client";

import React, { useId } from "react";
import { PhotoFilter } from "@/store/use-frame-store";

export type FrameMaterial = "bois" | "plexiglas" | "vitre";

export interface FrameRendererProps {
  imageSrc: string;
  material: FrameMaterial;
  artWidth?: number;
  artHeight?: number;
  frameWidth?: number;
  lean?: boolean;
  className?: string;
  // Options de personnalisation avancée
  photoFilter?: PhotoFilter;
  mouldingStyle?: string; // 'black' | 'champagne' | 'oak' | 'walnut' | 'gold' | 'white'
  hasMat?: boolean;
  matColor?: string;
  matWidth?: number;
  glassReflection?: number; // 0 to 100
}

const WOOD_DEPTH = 12;

export default function FrameRenderer({
  imageSrc,
  material,
  artWidth = 320,
  artHeight = 440,
  frameWidth = 26,
  lean = false,
  className = "",
  photoFilter = "none",
  mouldingStyle = "black",
  hasMat = false,
  matColor = "#FAFAF9",
  matWidth = 28,
  glassReflection = 35,
}: FrameRendererProps) {
  const uid = useId().replace(/:/g, "");
  const isWood = material === "bois";
  const isPlexi = material === "plexiglas";

  // Calcul des dimensions extérieures
  const effectiveMat = hasMat && !isWood ? Math.round(matWidth) : 0;
  
  let outerW: number;
  let outerH: number;
  if (isWood) {
    outerW = artWidth + WOOD_DEPTH;
    outerH = artHeight + WOOD_DEPTH;
  } else if (isPlexi) {
    outerW = artWidth + effectiveMat * 2 + 16;
    outerH = artHeight + effectiveMat * 2 + 16;
  } else {
    outerW = artWidth + (frameWidth + effectiveMat) * 2;
    outerH = artHeight + (frameWidth + effectiveMat) * 2;
  }

  // Filtres CSS photo
  const getFilterStyle = () => {
    switch (photoFilter) {
      case "bw":
        return "grayscale(100%) contrast(112%) brightness(102%)";
      case "warm":
        return "sepia(25%) saturate(120%) contrast(105%)";
      case "cool":
        return "hue-rotate(185deg) saturate(110%) brightness(102%)";
      case "sepia":
        return "sepia(75%) contrast(108%) brightness(96%)";
      case "vintage":
        return "contrast(110%) brightness(98%) saturate(85%) sepia(18%)";
      default:
        return "none";
    }
  };

  return (
    <div
      style={{
        position: "relative",
        width: outerW,
        height: outerH,
        filter: isPlexi
          ? "drop-shadow(0 20px 36px rgba(0,0,0,0.42)) drop-shadow(0 4px 12px rgba(0,0,0,0.25))"
          : "drop-shadow(0 28px 48px rgba(0,0,0,0.50)) drop-shadow(0 6px 14px rgba(0,0,0,0.30))",
        transform: lean
          ? "perspective(1400px) rotateY(-3.5deg) rotateX(1deg)"
          : undefined,
        transition: "transform 0.4s ease, filter 0.4s ease",
      }}
      className={className}
    >
      {isWood && (
        <WoodPanel
          uid={uid}
          imageSrc={imageSrc}
          artW={artWidth}
          artH={artHeight}
          filterStyle={getFilterStyle()}
        />
      )}
      {material === "vitre" && (
        <VitreFrame
          uid={uid}
          imageSrc={imageSrc}
          artW={artWidth}
          artH={artHeight}
          F={frameWidth}
          hasMat={hasMat}
          matColor={matColor}
          matWidth={effectiveMat}
          mouldingStyle={mouldingStyle}
          glassReflection={glassReflection}
          filterStyle={getFilterStyle()}
        />
      )}
      {isPlexi && (
        <PlexiFrame
          uid={uid}
          imageSrc={imageSrc}
          artW={artWidth}
          artH={artHeight}
          hasMat={hasMat}
          matColor={matColor}
          matWidth={effectiveMat}
          glassReflection={glassReflection}
          filterStyle={getFilterStyle()}
        />
      )}
    </div>
  );
}

/* ================================================================
   HELPERS TRAPEZE MOULURE (Miter joinery 45°)
================================================================ */
function trapTop(W: number, F: number) {
  return `M0,0 L${W},0 L${W - F},${F} L${F},${F} Z`;
}
function trapBottom(W: number, F: number) {
  return `M${F},0 L${W - F},0 L${W},${F} L0,${F} Z`;
}
function trapLeft(H: number, F: number) {
  return `M0,0 L${F},${F} L${F},${H - F} L0,${H} Z`;
}
function trapRight(H: number, F: number) {
  return `M0,${F} L${F},0 L${F},${H} L0,${H - F} Z`;
}

/* ================================================================
   1. PANNEAU BOIS MASSIF (Wood Panel Print)
   - Pas de vitre, impression directe sur panneau rigide
   - Tranches biseautées avec texture grain chêne / noyer
   - Perspective 2.5D isométrique chaleureuse
   - Accroche murale métallique visible au sommet
================================================================ */
function WoodPanel({
  uid,
  imageSrc,
  artW,
  artH,
  filterStyle,
}: {
  uid: string;
  imageSrc: string;
  artW: number;
  artH: number;
  filterStyle: string;
}) {
  const D = WOOD_DEPTH;
  const outerW = artW + D;
  const outerH = artH + D;

  const fx = D;
  const fy = 0;

  const leftPts = `${D},0 ${D},${artH} 0,${artH + D} 0,${D}`;
  const botPts = `${D},${artH} ${D + artW},${artH} ${artW},${artH + D} 0,${artH + D}`;
  const hangerCenterX = fx + artW / 2;

  return (
    <svg
      width={outerW}
      height={outerH}
      viewBox={`0 0 ${outerW} ${outerH}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", inset: 0, overflow: "visible" }}
    >
      <defs>
        {/* Grain bois chaleureux */}
        <filter id={`${uid}-woodGrain`} x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.05 0.35" numOctaves="4" seed="14" result="noise" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.28
                    0 0 0 0 0.18
                    0 0 0 0 0.10
                    0 0 0 0.45 0"
            in="noise"
            result="coloredNoise"
          />
          <feBlend in="SourceGraphic" in2="coloredNoise" mode="multiply" />
        </filter>

        {/* Tranche gauche bois ombrée */}
        <linearGradient id={`${uid}-wLeft`} x1={D} y1={0} x2={0} y2={artH + D} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#805432" />
          <stop offset="35%" stopColor="#57361e" />
          <stop offset="100%" stopColor="#301b0c" />
        </linearGradient>

        {/* Tranche basse bois sombre */}
        <linearGradient id={`${uid}-wBottom`} x1={D} y1={artH} x2={artW} y2={artH + D} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4d301b" />
          <stop offset="60%" stopColor="#301c0d" />
          <stop offset="100%" stopColor="#1a0e06" />
        </linearGradient>

        {/* Vignette subtile face avant pour accentuer le relief */}
        <radialGradient id={`${uid}-wVignette`} cx="50%" cy="50%" r="72%">
          <stop offset="0%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.22)" />
        </radialGradient>

        {/* Liseré de chanfrein supérieur (lumière naturelle zénithale) */}
        <linearGradient id={`${uid}-wTopLight`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
          <stop offset="30%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>

        {/* Crochet métallique au dos */}
        <linearGradient id={`${uid}-hangerMetal`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f3f4f6" />
          <stop offset="35%" stopColor="#9ca3af" />
          <stop offset="70%" stopColor="#4b5563" />
          <stop offset="100%" stopColor="#1f2937" />
        </linearGradient>

        <clipPath id={`${uid}-woodClip`}>
          <rect x={fx} y={fy} width={artW} height={artH} rx="2" />
        </clipPath>
      </defs>

      {/* ── Crochet d'accroche mural au dos ── */}
      <g transform={`translate(${hangerCenterX - 11}, ${fy - 14})`}>
        <path d="M 3,14 C 3,4 19,4 19,14 L 16.5,14 C 16.5,6.5 5.5,6.5 5.5,14 Z" fill="rgba(0,0,0,0.45)" transform="translate(1,1)" />
        <path d="M 3,14 C 3,4 19,4 19,14 L 16.5,14 C 16.5,6.5 5.5,6.5 5.5,14 Z" fill={`url(#${uid}-hangerMetal)`} stroke="#111" strokeWidth="0.6" />
        <rect x="7" y="11" width="8" height="5" rx="1" fill={`url(#${uid}-hangerMetal)`} stroke="#1f2937" strokeWidth="0.5" />
        <circle cx="11" cy="13.5" r="1.2" fill="#111827" />
      </g>

      {/* ── Tranche gauche du panneau bois ── */}
      <g filter={`url(#${uid}-woodGrain)`}>
        <polygon points={leftPts} fill={`url(#${uid}-wLeft)`} />
      </g>

      {/* ── Tranche inférieure du panneau bois ── */}
      <g filter={`url(#${uid}-woodGrain)`}>
        <polygon points={botPts} fill={`url(#${uid}-wBottom)`} />
      </g>

      {/* Jonction d'angle tranche gauche / basse */}
      <line x1={D} y1={artH} x2={0} y2={artH + D} stroke="rgba(0,0,0,0.6)" strokeWidth="1.5" />

      {/* ── Photo pleine face imprimée sur panneau ── */}
      <image
        href={imageSrc}
        x={fx}
        y={fy}
        width={artW}
        height={artH}
        preserveAspectRatio="xMidYMid slice"
        clipPath={`url(#${uid}-woodClip)`}
        style={{ filter: filterStyle }}
      />

      {/* Vignette et ombrage de profondeur */}
      <rect x={fx} y={fy} width={artW} height={artH} fill={`url(#${uid}-wVignette)`} clipPath={`url(#${uid}-woodClip)`} />
      <rect x={fx} y={fy} width={artW} height={artH} fill={`url(#${uid}-wTopLight)`} clipPath={`url(#${uid}-woodClip)`} />

      {/* Chanfrein fin sur le pourtour */}
      <rect x={fx} y={fy} width={artW} height={artH} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
    </svg>
  );
}

/* ================================================================
   2. PLEXIGLAS GALERIE FLOTTANT (Acrylic Glass Float Mount)
   - Verre acrylique 4mm ultra-brillant avec chants polis miroir
   - 4 entretoises de fixation murales en acier inox brossé
   - Reflet de surface intense et profondeur lumineuse
================================================================ */
function PlexiFrame({
  uid,
  imageSrc,
  artW,
  artH,
  hasMat,
  matColor,
  matWidth,
  glassReflection,
  filterStyle,
}: {
  uid: string;
  imageSrc: string;
  artW: number;
  artH: number;
  hasMat: boolean;
  matColor: string;
  matWidth: number;
  glassReflection: number;
  filterStyle: string;
}) {
  const BORDER = 8; // Dégagement acrylique transparent
  const innerW = artW + (hasMat ? matWidth * 2 : 0);
  const innerH = artH + (hasMat ? matWidth * 2 : 0);
  const outerW = innerW + BORDER * 2;
  const outerH = innerH + BORDER * 2;

  const photoX = BORDER + (hasMat ? matWidth : 0);
  const photoY = BORDER + (hasMat ? matWidth : 0);

  const reflectionOpacity = Math.max(0.05, Math.min(0.85, glassReflection / 100));

  // Standoff bolt positions (aux 4 coins)
  const standoffMargin = 12;
  const bolts = [
    { x: standoffMargin, y: standoffMargin },
    { x: outerW - standoffMargin, y: standoffMargin },
    { x: standoffMargin, y: outerH - standoffMargin },
    { x: outerW - standoffMargin, y: outerH - standoffMargin },
  ];

  return (
    <svg
      width={outerW}
      height={outerH}
      viewBox={`0 0 ${outerW} ${outerH}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", inset: 0 }}
    >
      <defs>
        {/* Métal brossé pour entretoises inox */}
        <radialGradient id={`${uid}-boltHead`} cx="38%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="35%" stopColor="#e5e7eb" />
          <stop offset="70%" stopColor="#9ca3af" />
          <stop offset="100%" stopColor="#4b5563" />
        </radialGradient>

        <linearGradient id={`${uid}-boltRing`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#d1d5db" />
          <stop offset="50%" stopColor="#4b5563" />
          <stop offset="100%" stopColor="#9ca3af" />
        </linearGradient>

        {/* Reflet haute brillance acrylique diagonal */}
        <linearGradient id={`${uid}-plexiGlare`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.03)" />
          <stop offset="30%" stopColor="rgba(255,255,255,0.08)" />
          <stop offset="46%" stopColor={`rgba(255,255,255,${reflectionOpacity * 0.75})`} />
          <stop offset="53%" stopColor={`rgba(230,245,255,${reflectionOpacity * 0.35})`} />
          <stop offset="70%" stopColor="rgba(255,255,255,0.04)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>

        {/* Reflet spot lumineux supérieur */}
        <radialGradient id={`${uid}-plexiSpot`} cx="70%" cy="5%" r="45%">
          <stop offset="0%" stopColor={`rgba(255,255,255,${reflectionOpacity * 0.9})`} />
          <stop offset="40%" stopColor={`rgba(255,255,255,${reflectionOpacity * 0.25})`} />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>

        {/* Biseau du chant acrylique transparent 4mm */}
        <linearGradient id={`${uid}-plexiEdgeH`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
          <stop offset="50%" stopColor="rgba(200,230,245,0.4)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.3)" />
        </linearGradient>

        <clipPath id={`${uid}-plexiPhotoClip`}>
          <rect x={photoX} y={photoY} width={artW} height={artH} />
        </clipPath>
      </defs>

      {/* ── Base acrylique transparent / chants polis ── */}
      <rect
        x="0"
        y="0"
        width={outerW}
        height={outerH}
        rx="4"
        fill="rgba(240,245,250,0.15)"
        stroke="rgba(255,255,255,0.7)"
        strokeWidth="1.5"
      />

      {/* ── Passe-Partout acrylique (si actif) ── */}
      {hasMat && (
        <rect
          x={BORDER}
          y={BORDER}
          width={innerW}
          height={innerH}
          fill={matColor}
        />
      )}

      {/* ── Photo sous plexiglas ── */}
      <image
        href={imageSrc}
        x={photoX}
        y={photoY}
        width={artW}
        height={artH}
        preserveAspectRatio="xMidYMid slice"
        clipPath={`url(#${uid}-plexiPhotoClip)`}
        style={{ filter: filterStyle }}
      />

      {/* ── Épaisseur & éclat acrylique ── */}
      {/* Chant poli supérieur et gauche */}
      <rect x="1" y="1" width={outerW - 2} height="2.5" fill={`url(#${uid}-plexiEdgeH)`} />
      <rect x="1" y="1" width="2.5" height={outerH - 2} fill="rgba(255,255,255,0.6)" />

      {/* ── Balayage reflet haute brillance ── */}
      <rect x="0" y="0" width={outerW} height={outerH} rx="4" fill={`url(#${uid}-plexiGlare)`} pointerEvents="none" />
      <rect x="0" y="0" width={outerW} height={outerH} rx="4" fill={`url(#${uid}-plexiSpot)`} pointerEvents="none" />

      {/* ── 4 Entretoises murales inox (Standoffs) ── */}
      {bolts.map((b, idx) => (
        <g key={idx} transform={`translate(${b.x}, ${b.y})`}>
          {/* Ombre de l'entretoise */}
          <circle cx="0" cy="1.5" r="7" fill="rgba(0,0,0,0.4)" />
          {/* Bague extérieure */}
          <circle cx="0" cy="0" r="6.5" fill={`url(#${uid}-boltRing)`} stroke="#374151" strokeWidth="0.6" />
          {/* Tête moletée bombée */}
          <circle cx="0" cy="0" r="5" fill={`url(#${uid}-boltHead)`} />
          {/* Fente de vis ou alvéole centrale */}
          <circle cx="0" cy="0" r="1.5" fill="#1f2937" opacity="0.85" />
          {/* Éclat lumineux */}
          <circle cx="-1.5" cy="-1.5" r="1.2" fill="#ffffff" opacity="0.75" />
        </g>
      ))}
    </svg>
  );
}

/* ================================================================
   3. CADRE VITRÉ CONTEMPORAIN & CLASSIQUE (Glass Framed Art)
   - Moulure assemblée à onglets 45° (Noir Galerie, Chêne, Noyer, Or brossé, Blanc)
   - Passe-Partout optionnel avec biseau 45° coupe cœur blanc
   - Verre minéral protecteur avec reflet de lumière ajustable
================================================================ */
function VitreFrame({
  uid,
  imageSrc,
  artW,
  artH,
  F,
  hasMat,
  matColor,
  matWidth,
  mouldingStyle,
  glassReflection,
  filterStyle,
}: {
  uid: string;
  imageSrc: string;
  artW: number;
  artH: number;
  F: number;
  hasMat: boolean;
  matColor: string;
  matWidth: number;
  mouldingStyle: string;
  glassReflection: number;
  filterStyle: string;
}) {
  const effectiveMat = hasMat ? matWidth : 0;
  const innerW = artW + effectiveMat * 2;
  const innerH = artH + effectiveMat * 2;
  const outerW = innerW + F * 2;
  const outerH = innerH + F * 2;

  const photoX = F + effectiveMat;
  const photoY = F + effectiveMat;

  const reflectionOpacity = Math.max(0.05, Math.min(0.80, glassReflection / 100));

  // Configuration des teintes de moulure
  const getMouldingGradients = () => {
    switch (mouldingStyle) {
      case "champagne":
      case "gold":
        return {
          top: ["#d5af36", "#fae6a2", "#c49a2c", "#8b6a15"],
          bottom: ["#8b6a15", "#c49a2c", "#fae6a2", "#b38920"],
          left: ["#c49a2c", "#fae6a2", "#8b6a15"],
          right: ["#8b6a15", "#fae6a2", "#c49a2c"],
          innerLip: "#ffd700",
        };
      case "oak":
        return {
          top: ["#cf9e66", "#ebd0a9", "#ba834a", "#8a5822"],
          bottom: ["#8a5822", "#ba834a", "#ebd0a9", "#a87138"],
          left: ["#ba834a", "#ebd0a9", "#784b1d"],
          right: ["#784b1d", "#ebd0a9", "#ba834a"],
          innerLip: "#faedcd",
        };
      case "walnut":
        return {
          top: ["#543219", "#7d502e", "#422510", "#2b1406"],
          bottom: ["#2b1406", "#422510", "#7d502e", "#3a1e0a"],
          left: ["#422510", "#7d502e", "#241004"],
          right: ["#241004", "#7d502e", "#422510"],
          innerLip: "#b08968",
        };
      case "white":
        return {
          top: ["#f3f4f6", "#ffffff", "#e5e7eb", "#d1d5db"],
          bottom: ["#d1d5db", "#e5e7eb", "#ffffff", "#e5e7eb"],
          left: ["#e5e7eb", "#ffffff", "#d1d5db"],
          right: ["#d1d5db", "#ffffff", "#e5e7eb"],
          innerLip: "#ffffff",
        };
      case "black":
      default:
        return {
          top: ["#27272a", "#3f3f46", "#18181b", "#09090b"],
          bottom: ["#09090b", "#18181b", "#3f3f46", "#18181b"],
          left: ["#18181b", "#3f3f46", "#09090b"],
          right: ["#09090b", "#3f3f46", "#18181b"],
          innerLip: "#52525b",
        };
    }
  };

  const colors = getMouldingGradients();

  return (
    <svg
      width={outerW}
      height={outerH}
      viewBox={`0 0 ${outerW} ${outerH}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", inset: 0 }}
    >
      <defs>
        {/* Grain pour moulure */}
        <filter id={`${uid}-mouldingNoise`} x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.3" numOctaves="3" seed="18" result="noise" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.1 0 0 0 0 0.1 0 0 0 0 0.1 0 0 0 0.15 0" in="noise" result="coloredNoise" />
          <feBlend in="SourceGraphic" in2="coloredNoise" mode="multiply" />
        </filter>

        {/* Gradients moulures à 45° */}
        <linearGradient id={`${uid}-mTop`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colors.top[0]} />
          <stop offset="25%" stopColor={colors.top[1]} />
          <stop offset="65%" stopColor={colors.top[2]} />
          <stop offset="100%" stopColor={colors.top[3]} />
        </linearGradient>

        <linearGradient id={`${uid}-mBottom`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colors.bottom[0]} />
          <stop offset="35%" stopColor={colors.bottom[1]} />
          <stop offset="75%" stopColor={colors.bottom[2]} />
          <stop offset="100%" stopColor={colors.bottom[3]} />
        </linearGradient>

        <linearGradient id={`${uid}-mLeft`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={colors.left[0]} />
          <stop offset="50%" stopColor={colors.left[1]} />
          <stop offset="100%" stopColor={colors.left[2]} />
        </linearGradient>

        <linearGradient id={`${uid}-mRight`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={colors.right[0]} />
          <stop offset="50%" stopColor={colors.right[1]} />
          <stop offset="100%" stopColor={colors.right[2]} />
        </linearGradient>

        {/* Biseau cœur blanc passe-partout 45° */}
        <linearGradient id={`${uid}-matBevel`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="45%" stopColor="#e5e7eb" />
          <stop offset="100%" stopColor="#d1d5db" />
        </linearGradient>

        {/* Reflet de vitre diagonale */}
        <linearGradient id={`${uid}-glassReflection`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.01)" />
          <stop offset="30%" stopColor="rgba(255,255,255,0.04)" />
          <stop offset="47%" stopColor={`rgba(255,255,255,${reflectionOpacity * 0.6})`} />
          <stop offset="54%" stopColor={`rgba(235,245,255,${reflectionOpacity * 0.25})`} />
          <stop offset="70%" stopColor="rgba(255,255,255,0.02)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>

        {/* Spot lumière supérieure */}
        <radialGradient id={`${uid}-glassSpot`} cx="65%" cy="3%" r="40%">
          <stop offset="0%" stopColor={`rgba(255,255,255,${reflectionOpacity * 0.85})`} />
          <stop offset="40%" stopColor={`rgba(255,255,255,${reflectionOpacity * 0.2})`} />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>

        {/* Ombre de feuillure intérieure */}
        <filter id={`${uid}-innerRabbetShadow`} x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.5)" />
        </filter>

        <clipPath id={`${uid}-vitrePhotoClip`}>
          <rect x={photoX} y={photoY} width={artW} height={artH} />
        </clipPath>
      </defs>

      {/* ── 1. MOULURE EXTÉRIEURE À ONGLET 45° ── */}
      <g filter={`url(#${uid}-mouldingNoise)`}>
        <path d={trapTop(outerW, F)} fill={`url(#${uid}-mTop)`} />
        <g transform={`translate(0, ${outerH - F})`}>
          <path d={trapBottom(outerW, F)} fill={`url(#${uid}-mBottom)`} />
        </g>
        <path d={trapLeft(outerH, F)} fill={`url(#${uid}-mLeft)`} />
        <g transform={`translate(${outerW - F}, 0)`}>
          <path d={trapRight(outerH, F)} fill={`url(#${uid}-mRight)`} />
        </g>
      </g>

      {/* Lignes de coupe d'onglet 45° ultra-réalistes */}
      <line x1="0" y1="0" x2={F} y2={F} stroke="rgba(0,0,0,0.35)" strokeWidth="1" />
      <line x1={outerW} y1="0" x2={outerW - F} y2={F} stroke="rgba(0,0,0,0.35)" strokeWidth="1" />
      <line x1="0" y1={outerH} x2={F} y2={outerH - F} stroke="rgba(0,0,0,0.35)" strokeWidth="1" />
      <line x1={outerW} y1={outerH} x2={outerW - F} y2={outerH - F} stroke="rgba(0,0,0,0.35)" strokeWidth="1" />

      {/* Liseré fin intérieur (feuillure) */}
      <rect x={F - 1} y={F - 1} width={innerW + 2} height={innerH + 2} fill="none" stroke={colors.innerLip} strokeWidth="1" opacity="0.65" />

      {/* ── 2. PASSE-PARTOUT BISEAUTÉ (SI ACTIVÉ) ── */}
      {hasMat && (
        <g>
          {/* Surface du passe-partout */}
          <rect x={F} y={F} width={innerW} height={innerH} fill={matColor} />

          {/* Biseau intérieur 45° à cœur blanc */}
          <rect
            x={photoX - 2.5}
            y={photoY - 2.5}
            width={artW + 5}
            height={artH + 5}
            fill="none"
            stroke={`url(#${uid}-matBevel)`}
            strokeWidth="2.5"
          />

          {/* Ombre portée du passe-partout sur la photo */}
          <rect
            x={photoX}
            y={photoY}
            width={artW}
            height={artH}
            fill="none"
            stroke="rgba(0,0,0,0.4)"
            strokeWidth="2"
          />
        </g>
      )}

      {/* ── 3. PHOTO / OEUVRE D'ART ── */}
      <image
        href={imageSrc}
        x={photoX}
        y={photoY}
        width={artW}
        height={artH}
        preserveAspectRatio="xMidYMid slice"
        clipPath={`url(#${uid}-vitrePhotoClip)`}
        style={{ filter: filterStyle }}
      />

      {/* Ombre intérieure de feuillure quand pas de passe-partout */}
      {!hasMat && (
        <rect
          x={F}
          y={F}
          width={artW}
          height={artH}
          fill="none"
          stroke="rgba(0,0,0,0.4)"
          strokeWidth="3"
        />
      )}

      {/* ── 4. VERRE MINÉRAL & REFLETS RÉALISTES ── */}
      <rect
        x={F}
        y={F}
        width={innerW}
        height={innerH}
        fill={`url(#${uid}-glassReflection)`}
        pointerEvents="none"
      />
      <rect
        x={F}
        y={F}
        width={innerW}
        height={innerH}
        fill={`url(#${uid}-glassSpot)`}
        pointerEvents="none"
      />

      {/* Fin filet de lumière sur le bord extérieur */}
      <rect x="0.5" y="0.5" width={outerW - 1} height={outerH - 1} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
    </svg>
  );
}
