'use client';

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from 'react';
import type { FrameConfig, PrintFormat, GlassType, FrameFinish, HangingType } from '@/types/frame';

// ─── Default Config ───────────────────────────────────────────────────────────

const DEFAULT_CONFIG: FrameConfig = {
  imageUrl: null,
  imageFile: null,
  format: 'A4',
  mouldureId: 'chene-naturel',
  passepartoutId: 'blanc-coton',
  passepartoutWidthMm: 30,
  glassType: 'antireflet',
  finish: 'mat',
  hangingType: 'fil-metallique',
  glassReflectIntensity: 0.3,
};

// ─── Actions ─────────────────────────────────────────────────────────────────

type Action =
  | { type: 'SET_IMAGE'; imageUrl: string | null; imageFile: File | null }
  | { type: 'SET_FORMAT'; format: PrintFormat }
  | { type: 'SET_MOULDURE'; mouldureId: string }
  | { type: 'SET_PASSEPARTOUT'; passepartoutId: string | null }
  | { type: 'SET_PASSEPARTOUT_WIDTH'; widthMm: number }
  | { type: 'SET_GLASS'; glassType: GlassType }
  | { type: 'SET_FINISH'; finish: FrameFinish }
  | { type: 'SET_HANGING'; hangingType: HangingType }
  | { type: 'SET_GLASS_REFLECT'; intensity: number }
  | { type: 'RESET' };

function frameReducer(state: FrameConfig, action: Action): FrameConfig {
  switch (action.type) {
    case 'SET_IMAGE':
      return { ...state, imageUrl: action.imageUrl, imageFile: action.imageFile };
    case 'SET_FORMAT':
      return { ...state, format: action.format };
    case 'SET_MOULDURE':
      return { ...state, mouldureId: action.mouldureId };
    case 'SET_PASSEPARTOUT':
      return {
        ...state,
        passepartoutId: action.passepartoutId,
        passepartoutWidthMm: action.passepartoutId ? state.passepartoutWidthMm : 0,
      };
    case 'SET_PASSEPARTOUT_WIDTH':
      return { ...state, passepartoutWidthMm: action.widthMm };
    case 'SET_GLASS':
      return { ...state, glassType: action.glassType };
    case 'SET_FINISH':
      return { ...state, finish: action.finish };
    case 'SET_HANGING':
      return { ...state, hangingType: action.hangingType };
    case 'SET_GLASS_REFLECT':
      return { ...state, glassReflectIntensity: action.intensity };
    case 'RESET':
      return DEFAULT_CONFIG;
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface FrameContextValue {
  config: FrameConfig;
  setImage: (imageUrl: string | null, file: File | null) => void;
  setFormat: (format: PrintFormat) => void;
  setMouldure: (mouldureId: string) => void;
  setPassepartout: (passepartoutId: string | null) => void;
  setPassepartoutWidth: (widthMm: number) => void;
  setGlass: (glassType: GlassType) => void;
  setFinish: (finish: FrameFinish) => void;
  setHanging: (hangingType: HangingType) => void;
  setGlassReflect: (intensity: number) => void;
  reset: () => void;
}

const FrameContext = createContext<FrameContextValue | null>(null);

export function FrameProvider({ children }: { children: ReactNode }) {
  const [config, dispatch] = useReducer(frameReducer, DEFAULT_CONFIG);

  const setImage = useCallback(
    (imageUrl: string | null, file: File | null) =>
      dispatch({ type: 'SET_IMAGE', imageUrl, imageFile: file }),
    [],
  );
  const setFormat = useCallback(
    (format: PrintFormat) => dispatch({ type: 'SET_FORMAT', format }),
    [],
  );
  const setMouldure = useCallback(
    (mouldureId: string) => dispatch({ type: 'SET_MOULDURE', mouldureId }),
    [],
  );
  const setPassepartout = useCallback(
    (passepartoutId: string | null) =>
      dispatch({ type: 'SET_PASSEPARTOUT', passepartoutId }),
    [],
  );
  const setPassepartoutWidth = useCallback(
    (widthMm: number) => dispatch({ type: 'SET_PASSEPARTOUT_WIDTH', widthMm }),
    [],
  );
  const setGlass = useCallback(
    (glassType: GlassType) => dispatch({ type: 'SET_GLASS', glassType }),
    [],
  );
  const setFinish = useCallback(
    (finish: FrameFinish) => dispatch({ type: 'SET_FINISH', finish }),
    [],
  );
  const setHanging = useCallback(
    (hangingType: HangingType) => dispatch({ type: 'SET_HANGING', hangingType }),
    [],
  );
  const setGlassReflect = useCallback(
    (intensity: number) => dispatch({ type: 'SET_GLASS_REFLECT', intensity }),
    [],
  );
  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);

  return (
    <FrameContext.Provider
      value={{
        config,
        setImage,
        setFormat,
        setMouldure,
        setPassepartout,
        setPassepartoutWidth,
        setGlass,
        setFinish,
        setHanging,
        setGlassReflect,
        reset,
      }}
    >
      {children}
    </FrameContext.Provider>
  );
}

export function useFrame(): FrameContextValue {
  const ctx = useContext(FrameContext);
  if (!ctx) throw new Error('useFrame must be used inside <FrameProvider>');
  return ctx;
}
