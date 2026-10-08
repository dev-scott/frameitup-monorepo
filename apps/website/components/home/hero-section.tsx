'use client';

import { useRef, Suspense, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Environment, useTexture, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useLanguageStore } from '@/store/use-language-store';

/* ─── Frame artwork data ─────────────────────────────── */
const frames = [
  { position: [-2.8, 0.8, -1] as [number, number, number], rotation: [-0.05, 0.3, 0.05] as [number, number, number], scale: 0.9, color: '#8B6914', img: '/frame-1.jpg' },
  { position: [2.6, 0.4, -0.5] as [number, number, number], rotation: [0.05, -0.25, -0.04] as [number, number, number], scale: 1.0, color: '#2C2016', img: '/frame-2.jpg' },
  { position: [-0.2, -1.5, 0.5] as [number, number, number], rotation: [0.1, 0.1, -0.08] as [number, number, number], scale: 0.8, color: '#5C4A2A', img: '/frame-3.jpg' },
  { position: [0.8, 1.8, -2] as [number, number, number], rotation: [-0.08, 0.15, 0.03] as [number, number, number], scale: 1.1, color: '#3D2B1A', img: '/frame-4.jpg' },
  { position: [-1.8, -1.0, -1.5] as [number, number, number], rotation: [0.06, -0.2, 0.07] as [number, number, number], scale: 0.75, color: '#6B4F2C', img: '/frame-5.jpg' },
];

/* ─── Color palettes for procedural frames ───────────── */
const artColors: [string, string, string][] = [
  ['#E8D5B7', '#C4A882', '#8B6914'],
  ['#B8C5D6', '#7B9DB8', '#2C5F8A'],
  ['#D4B8C4', '#A87B9B', '#6B3A5E'],
  ['#C8D4B0', '#8BA870', '#4A6B3A'],
  ['#D4C4A8', '#B09878', '#6B5038'],
];

/* ─── Single 3D Frame ────────────────────────────────── */
function Frame3D({
  position, rotation, scale, color, index, floatSpeed,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  color: string;
  index: number;
  floatSpeed: number;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const palette: [string, string, string] = artColors[index % artColors.length] ?? artColors[0]!;

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.y += 0.002 * (hovered ? 3 : 1);
    meshRef.current.position.y = position[1] + Math.sin(t * floatSpeed + index) * 0.12;
    const s = hovered ? scale * 1.05 : scale;
    meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, s, 0.08));
  });

  return (
    <group
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={scale}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Frame border (thick) */}
      <RoundedBox args={[1.5, 1.9, 0.12]} radius={0.04} smoothness={4}>
        <meshStandardMaterial
          color={color}
          roughness={0.3}
          metalness={0.15}
          envMapIntensity={0.8}
        />
      </RoundedBox>

      {/* Art canvas */}
      <mesh position={[0, 0, 0.07]}>
        <planeGeometry args={[1.15, 1.55]} />
        <meshStandardMaterial
          color={palette[0]}
          roughness={0.9}
          metalness={0.0}
        />
      </mesh>

      {/* Abstract art strokes */}
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          position={[
            (i - 1) * 0.25,
            Math.sin(i * 1.3) * 0.3,
            0.075,
          ]}
          rotation={[0, 0, i * 0.4]}
        >
          <planeGeometry args={[0.06 + i * 0.04, 0.6 + i * 0.1]} />
          <meshStandardMaterial
            color={palette[1 + (i % 2)]}
            roughness={1}
            transparent
            opacity={0.6 + i * 0.1}
          />
        </mesh>
      ))}

      {/* Glass reflection */}
      <mesh position={[0, 0, 0.08]}>
        <planeGeometry args={[1.15, 1.55]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={0}
          metalness={0.05}
          transparent
          opacity={0.05}
        />
      </mesh>

      {/* Brand mark */}
      <mesh position={[0.4, -0.65, 0.09]}>
        <planeGeometry args={[0.25, 0.04]} />
        <meshStandardMaterial color={color} roughness={1} opacity={0.5} transparent />
      </mesh>
    </group>
  );
}

/* ─── Camera rig with mouse parallax ─────────────────── */
function CameraRig() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  useFrame(() => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.current.x * 0.4, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouse.current.y * 0.3, 0.04);
    camera.lookAt(0, 0, 0);
  });

  return (
    <mesh
      visible={false}
      onPointerMove={(e) => {
        mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
      }}
    >
      <planeGeometry args={[100, 100]} />
      <meshBasicMaterial />
    </mesh>
  );
}

/* ─── Scene ──────────────────────────────────────────── */
function Scene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
      <directionalLight position={[-5, -2, -3]} intensity={0.3} color="#f5c877" />
      <pointLight position={[0, 4, 2]} intensity={0.5} color="#d98d2e" />
      <Environment preset="studio" />
      {frames.map((f, i) => (
        <Float
          key={i}
          speed={0.8 + i * 0.2}
          rotationIntensity={0.15}
          floatIntensity={0.3}
        >
          <Frame3D {...f} index={i} floatSpeed={0.4 + i * 0.1} />
        </Float>
      ))}
      <CameraRig />
    </>
  );
}

/* ─── Animated badge ─────────────────────────────────── */
const badgeVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const titleVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.3 },
  },
};

const wordVariants = {
  hidden: { opacity: 0, y: 40, rotateX: 30 },
  visible: {
    opacity: 1, y: 0, rotateX: 0,
    transition: { duration: 0.7, ease: 'easeOut' as const },
  },
};

/* ─── Main Hero ──────────────────────────────────────── */
export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 80]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const { t } = useLanguageStore();
  const titleWords1 = t.hero.line1;
  const titleWords2 = t.hero.line2;

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Ambient background */}
      <div className="absolute inset-0 bg-[var(--bg-primary)]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_-10%,rgba(217,141,46,0.12)_0%,transparent_65%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_10%_90%,rgba(217,141,46,0.06)_0%,transparent_50%)]" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(var(--text-muted) 1px, transparent 1px),
              linear-gradient(90deg, var(--text-muted) 1px, transparent 1px)`,
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      {/* 3D Canvas - Client Only */}
      <motion.div
        style={{ y, opacity }}
        className="absolute inset-0 z-0"
      >
        {mounted && (
          <Canvas
            camera={{ position: [0, 0, 6], fov: 50 }}
            style={{ background: 'transparent' }}
            dpr={[1, 2]}
          >
            <Suspense fallback={null}>
              <Scene />
            </Suspense>
          </Canvas>
        )}
      </motion.div>

      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-[var(--bg-primary)] via-[rgba(250,250,249,0.85)] to-transparent dark:from-[var(--bg-primary)] dark:via-[rgba(15,14,13,0.8)] dark:to-transparent" />

      {/* Hero content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 pt-32 pb-16 w-full">
        <div className="max-w-2xl">
          {/* Badge */}
          <motion.div
            variants={badgeVariants}
            initial="hidden"
            animate="visible"
            className="mb-8"
          >
            <span className="badge-premium">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-500)] animate-pulse" />
              {t.hero.badge}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={titleVariants}
            initial="hidden"
            animate="visible"
            className="font-display text-6xl md:text-7xl xl:text-8xl font-bold leading-[1.05] mb-6 tracking-tight"
            style={{ perspective: '800px' }}
          >
            <div className="flex gap-4 flex-wrap mb-1">
              {titleWords1.map((word) => (
                <motion.span key={word} variants={wordVariants} className="inline-block text-[var(--text-primary)]">
                  {word}
                </motion.span>
              ))}
            </div>
            <div className="flex gap-4 flex-wrap">
              {titleWords2.map((word, i) => (
                <motion.span
                  key={word}
                  variants={wordVariants}
                  className={`inline-block ${i === 1 ? 'shimmer-text' : 'text-[var(--brand-500)]'}`}
                >
                  {word}
                </motion.span>
              ))}
            </div>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.7 }}
            className="text-lg md:text-xl text-[var(--text-muted)] mb-10 leading-relaxed max-w-lg"
          >
            {t.hero.subtitle}{' '}
            <span className="text-[var(--text-secondary)] font-medium">{t.hero.subtitleHighlight}</span>{' '}
            {t.hero.subtitleEnd}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.7 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="/configure"
              id="hero-start-designing-btn"
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[var(--brand-500)] hover:bg-[var(--brand-600)] text-white font-semibold rounded-2xl text-base shadow-brand hover:shadow-brand-lg transition-all duration-300 hover:-translate-y-1"
            >
              <span>{t.hero.cta}</span>
              <motion.span
                className="text-lg"
                animate={{ x: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              >
                →
              </motion.span>
              {/* Ripple effect */}
              <span className="absolute inset-0 rounded-2xl bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            </Link>

            <Link
              href="/frames"
              id="hero-browse-frames-btn"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[var(--bg-card)] dark:bg-[var(--bg-tertiary)] border border-[var(--border-strong)] text-[var(--text-primary)] font-semibold rounded-2xl text-base hover:border-[var(--brand-400)] hover:bg-[var(--bg-secondary)] transition-all duration-300 hover:-translate-y-1"
            >
              {t.hero.ctaBrowse}
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.7 }}
            className="flex items-center gap-6 mt-12"
          >
            <div className="flex -space-x-2">
              {['#8B6914', '#2C2016', '#5C4A2A', '#3D2B1A'].map((c, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-[var(--bg-primary)] flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: c }}
                >
                  {['A', 'B', 'C', 'D'][i]}
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1 text-[var(--brand-500)]">
                {'★★★★★'.split('').map((s, i) => <span key={i} className="text-sm">{s}</span>)}
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                <span className="font-semibold text-[var(--text-secondary)]">{t.hero.trustRating}</span> {t.hero.trustReviews}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-xs font-medium tracking-widest uppercase text-[var(--text-subtle)]">
          {t.hero.scroll}
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-[var(--brand-500)] to-transparent animate-pulse" />
      </motion.div>
    </section>
  );
}
