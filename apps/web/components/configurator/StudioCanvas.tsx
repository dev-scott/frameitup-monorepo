'use client';

import { useMemo } from 'react';
import { useFrame } from '@/context/FrameContext';
import { getMouldureById } from '@/data/frames';
import { getFormatById } from '@/data/formats';
import { getPassepartoutById } from '@/data/materials';
import { buildMiterPaths, buildBevelPaths, lightenColor, darkenColor } from '@/utils/canvas';

const PX_PER_CM = 6;

export default function StudioCanvas() {
  const { config } = useFrame();

  const render = useMemo(() => {
    const format     = getFormatById(config.format);
    const mouldure   = getMouldureById(config.mouldureId);
    const passepartout = config.passepartoutId ? getPassepartoutById(config.passepartoutId) : null;

    const imgW  = format.widthCm  * PX_PER_CM;
    const imgH  = format.heightCm * PX_PER_CM;
    const ppW   = passepartout ? (config.passepartoutWidthMm / 10) * PX_PER_CM : 0;
    const moulW = (mouldure.widthMm / 10) * PX_PER_CM;

    const totalW = imgW + 2 * ppW + 2 * moulW;
    const totalH = imgH + 2 * ppW + 2 * moulW;
    const pad    = 40;
    const svgW   = totalW + pad * 2;
    const svgH   = totalH + pad * 2;

    const outerX = pad, outerY = pad, outerW = totalW, outerH = totalH;
    const ppX    = outerX + moulW, ppY = outerY + moulW;
    const ppAreaW = imgW + 2 * ppW, ppAreaH = imgH + 2 * ppW;
    const imageX = ppX + ppW, imageY = ppY + ppW;
    const innerX = ppX, innerY = ppY, innerW = ppAreaW, innerH = ppAreaH;

    const miterPaths = buildMiterPaths(outerX, outerY, outerW, outerH, innerX, innerY, innerW, innerH);
    const bevelPaths = passepartout ? buildBevelPaths(ppX, ppY, ppAreaW, ppAreaH, ppW * 0.3) : null;

    const colorLight  = lightenColor(mouldure.colorPrimary, 0.12);
    const colorDark   = darkenColor(mouldure.colorPrimary, 0.15);
    const colorShadow = darkenColor(mouldure.colorPrimary, 0.28);
    const ppColor     = passepartout?.colorHex ?? '#f8f5f0';
    const glassAlpha  = config.glassReflectIntensity * 0.3;
    const isFloating  = config.glassType === 'plexiglas-flottant';

    return {
      svgW, svgH, outerX, outerY, outerW, outerH,
      ppX, ppY, ppAreaW, ppAreaH, imageX, imageY, imgW, imgH,
      miterPaths, bevelPaths, ppColor,
      colorLight, colorDark, colorShadow,
      colorPrimary: mouldure.colorPrimary,
      mouldureIsWood: mouldure.isWood,
      grainDirection: mouldure.grainDirection,
      bevelWhite: '#f8f8f6',
      glassAlpha, isFloating, moulW, ppW,
      imageUrl: config.imageUrl,
    };
  }, [config]);

  const { svgW, svgH } = render;

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
        minHeight: 420,
      }}
    >
      <div
        style={{
          filter: render.isFloating
            ? 'drop-shadow(0 20px 50px rgba(0,0,0,0.18)) drop-shadow(0 6px 16px rgba(181,135,43,0.12))'
            : 'drop-shadow(0 14px 36px rgba(0,0,0,0.14)) drop-shadow(0 3px 10px rgba(0,0,0,0.08))',
          transition: 'filter 0.4s ease',
        }}
      >
        <svg
          width={svgW}
          height={svgH}
          viewBox={`0 0 ${svgW} ${svgH}`}
          style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="wood-grain" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency={render.grainDirection === 'horizontal' ? '0.65 0.12' : render.grainDirection === 'vertical' ? '0.12 0.65' : '0.4 0.4'}
                numOctaves="4" seed="5" result="noise"
              />
              <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
              <feBlend in="SourceGraphic" in2="grayNoise" mode="multiply" result="blended" />
              <feComposite in="blended" in2="SourceGraphic" operator="in" />
            </filter>

            <linearGradient id="glass-shimmer" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="white" stopOpacity={render.glassAlpha * 0.6} />
              <stop offset="30%"  stopColor="white" stopOpacity={render.glassAlpha * 1.4} />
              <stop offset="50%"  stopColor="white" stopOpacity={render.glassAlpha * 0.08} />
              <stop offset="80%"  stopColor="white" stopOpacity={render.glassAlpha * 0.9} />
              <stop offset="100%" stopColor="white" stopOpacity={render.glassAlpha * 0.15} />
            </linearGradient>

            <linearGradient id="bevel-top" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%"   stopColor={render.bevelWhite} stopOpacity="1" />
              <stop offset="100%" stopColor="#e8e4e0" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="bevel-bottom" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%"   stopColor="#d0ccc8" stopOpacity="1" />
              <stop offset="100%" stopColor={render.bevelWhite} stopOpacity="1" />
            </linearGradient>

            <linearGradient id="frame-top"    x1="0%" y1="0%"   x2="0%"   y2="100%">
              <stop offset="0%"   stopColor={render.colorLight} />
              <stop offset="100%" stopColor={render.colorPrimary} />
            </linearGradient>
            <linearGradient id="frame-bottom" x1="0%" y1="0%"   x2="0%"   y2="100%">
              <stop offset="0%"   stopColor={render.colorPrimary} />
              <stop offset="100%" stopColor={render.colorDark} />
            </linearGradient>
            <linearGradient id="frame-left"   x1="0%" y1="0%"   x2="100%" y2="0%">
              <stop offset="0%"   stopColor={render.colorDark} />
              <stop offset="100%" stopColor={render.colorPrimary} />
            </linearGradient>
            <linearGradient id="frame-right"  x1="0%" y1="0%"   x2="100%" y2="0%">
              <stop offset="0%"   stopColor={render.colorPrimary} />
              <stop offset="100%" stopColor={render.colorShadow} />
            </linearGradient>

            <clipPath id="img-clip">
              <rect x={render.imageX} y={render.imageY} width={render.imgW} height={render.imgH} />
            </clipPath>
          </defs>

          {/* Floating gap shadow */}
          {render.isFloating && (
            <rect
              x={render.outerX} y={render.outerY + render.moulW * 0.3}
              width={render.outerW} height={render.outerH - render.moulW * 0.3}
              rx={2} fill="rgba(0,0,0,0.06)"
            />
          )}

          {/* Frame miter faces */}
          <path d={render.miterPaths.top}    fill="url(#frame-top)"    filter={render.mouldureIsWood ? 'url(#wood-grain)' : undefined} />
          <path d={render.miterPaths.bottom} fill="url(#frame-bottom)" filter={render.mouldureIsWood ? 'url(#wood-grain)' : undefined} />
          <path d={render.miterPaths.left}   fill="url(#frame-left)"   filter={render.mouldureIsWood ? 'url(#wood-grain)' : undefined} />
          <path d={render.miterPaths.right}  fill="url(#frame-right)"  filter={render.mouldureIsWood ? 'url(#wood-grain)' : undefined} />

          {/* Passepartout surface */}
          {render.ppW > 0 && (
            <rect x={render.ppX} y={render.ppY} width={render.ppAreaW} height={render.ppAreaH} fill={render.ppColor} />
          )}

          {/* Passepartout bevel */}
          {render.bevelPaths && (
            <>
              <path d={render.bevelPaths.top}    fill="url(#bevel-top)"    opacity={0.85} />
              <path d={render.bevelPaths.bottom}  fill="url(#bevel-bottom)" opacity={0.7} />
              <path d={render.bevelPaths.left}    fill={render.bevelWhite}  opacity={0.9} />
              <path d={render.bevelPaths.right}   fill="#d0ccc8"             opacity={0.7} />
            </>
          )}

          {/* Image */}
          {render.imageUrl ? (
            <image
              href={render.imageUrl}
              x={render.imageX} y={render.imageY}
              width={render.imgW} height={render.imgH}
              preserveAspectRatio="xMidYMid slice"
              clipPath="url(#img-clip)"
            />
          ) : (
            <g>
              <rect x={render.imageX} y={render.imageY} width={render.imgW} height={render.imgH} fill="#F0EBE0" />
              <text x={render.imageX + render.imgW / 2} y={render.imageY + render.imgH / 2 - 8} textAnchor="middle" fill="#B0A090" fontSize={render.imgW > 80 ? '13' : '9'} fontFamily="Inter, sans-serif">
                Votre photo
              </text>
              <text x={render.imageX + render.imgW / 2} y={render.imageY + render.imgH / 2 + 12} textAnchor="middle" fill="#DDD5C4" fontSize={render.imgW > 80 ? '10' : '7'} fontFamily="Inter, sans-serif">
                ici
              </text>
            </g>
          )}

          {/* Glass shimmer */}
          {render.glassAlpha > 0.01 && (
            <rect x={render.ppX} y={render.ppY} width={render.ppAreaW} height={render.ppAreaH} fill="url(#glass-shimmer)" style={{ pointerEvents: 'none' }} />
          )}

          {/* Top-left edge highlight */}
          <rect x={render.outerX} y={render.outerY} width={render.outerW} height={2} fill={render.colorLight} opacity={0.6} />
          <rect x={render.outerX} y={render.outerY} width={2} height={render.outerH} fill={render.colorLight} opacity={0.4} />
        </svg>
      </div>
    </div>
  );
}
