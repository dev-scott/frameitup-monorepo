'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, RoundedBox, useTexture, Center } from '@react-three/drei';
import * as THREE from 'three';

// ─── Textured Artwork Plane ─────────────────────────────────────────
function ArtPlane({ url, width, height, z }: { url: string; width: number; height: number; z: number }) {
  // Load texture using Drei helper. Works with base64 and object URLs.
  const texture = useTexture(url);
  
  // Adjust texture settings for crisp display
  texture.minFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;

  return (
    <mesh position={[0, 0, z]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

// ─── Fallback Artwork Plane (when no image is uploaded) ─────────────
function PlaceholderPlane({ width, height, z }: { width: number; height: number; z: number }) {
  return (
    <mesh position={[0, 0, z]}>
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial 
        color="#EDE8E3" 
        roughness={0.9} 
        metalness={0.0} 
      />
    </mesh>
  );
}

// ─── Reuseable Frame Material Component ─────────────────────────────
function FrameMaterialComponent({ frameId, frameColor, thick }: { frameId?: string; frameColor: string; thick: number }) {
  if (frameId === 'frame-vitre') {
    // Glass frame material (highly transparent, shiny glass block style)
    return (
      <meshPhysicalMaterial
        color="#ffffff"
        transparent
        opacity={0.35}
        roughness={0.01}
        metalness={0.1}
        clearcoat={1.0}
        clearcoatRoughness={0.01}
        transmission={0.95}
        thickness={thick}
        ior={1.52}
        envMapIntensity={2.5}
      />
    );
  }
  if (frameId === 'frame-plexiglas') {
    // Shiny, polished reflective black/colored acrylic plexiglass
    return (
      <meshPhysicalMaterial
        color={frameColor}
        roughness={0.04}
        metalness={0.2}
        clearcoat={1.0}
        clearcoatRoughness={0.02}
        envMapIntensity={1.8}
      />
    );
  }
  // Cadre en Bois: matte, classic warm wood feel
  return (
    <meshStandardMaterial
      color={frameColor}
      roughness={0.8}
      metalness={0.05}
      envMapIntensity={0.6}
    />
  );
}

// ─── The Main 3D Frame Object ───────────────────────────────────────
interface FrameObjectProps {
  imageSrc: string | null;
  frameColor: string;
  frameWidthMm: number;
  frameThicknessMm: number;
  artworkWidthMm: number;
  artworkHeightMm: number;
  hasMat: boolean;
  matColor: string;
  matWidthMm: number;
  glasingType: string;
  frameId?: string;
}

function FrameObject({
  imageSrc,
  frameColor,
  frameWidthMm,
  frameThicknessMm,
  artworkWidthMm,
  artworkHeightMm,
  hasMat,
  matColor,
  matWidthMm,
  glasingType,
  frameId,
}: FrameObjectProps) {
  // Convert mm to scene units (100mm = 1 unit)
  const scale = 0.01;
  const artW = artworkWidthMm * scale;
  const artH = artworkHeightMm * scale;
  const matW = hasMat ? matWidthMm * scale : 0;
  const borderW = frameWidthMm * scale;
  const thick = frameThicknessMm * scale;

  // Total dimensions
  const innerW = artW + matW * 2;
  const innerH = artH + matW * 2;
  const outerW = innerW + borderW * 2;
  const outerH = innerH + borderW * 2;

  // Calculated Z positions relative to thickness
  const zBacking = -thick / 2 + 0.002;
  const zMat = -thick / 2 + 0.004 + 0.001;
  const zArtwork = -thick / 2 + 0.004 + 0.002;
  const zGlass = thick / 2 - 0.002; // Sits just inside the front border edge

  // Glasing properties based on type
  const isMuseum = glasingType === 'MUSEUM_GLASS';
  const isAntiReflective = glasingType === 'ANTI_REFLECTIVE';
  const glassOpacity = isAntiReflective ? 0.08 : isMuseum ? 0.15 : 0.22;
  const glassColor = isMuseum ? '#E0F2FE' : '#F0FDFA';

  return (
    <group>
      {/* 1. Hollow Frame Border (4 separate bar meshes for absolute realism) */}
      
      {/* Top Bar */}
      <RoundedBox
        args={[outerW, borderW, thick]}
        radius={0.005}
        smoothness={4}
        position={[0, (outerH - borderW) / 2, 0]}
      >
        <FrameMaterialComponent frameId={frameId} frameColor={frameColor} thick={thick} />
      </RoundedBox>

      {/* Bottom Bar */}
      <RoundedBox
        args={[outerW, borderW, thick]}
        radius={0.005}
        smoothness={4}
        position={[0, -(outerH - borderW) / 2, 0]}
      >
        <FrameMaterialComponent frameId={frameId} frameColor={frameColor} thick={thick} />
      </RoundedBox>

      {/* Left Bar */}
      <RoundedBox
        args={[borderW, innerH, thick]}
        radius={0.005}
        smoothness={4}
        position={[-(outerW - borderW) / 2, 0, 0]}
      >
        <FrameMaterialComponent frameId={frameId} frameColor={frameColor} thick={thick} />
      </RoundedBox>

      {/* Right Bar */}
      <RoundedBox
        args={[borderW, innerH, thick]}
        radius={0.005}
        smoothness={4}
        position={[(outerW - borderW) / 2, 0, 0]}
      >
        <FrameMaterialComponent frameId={frameId} frameColor={frameColor} thick={thick} />
      </RoundedBox>

      {/* 2. Backing Board (placed inside the frame depth) */}
      <mesh position={[0, 0, zBacking]}>
        <boxGeometry args={[innerW, innerH, 0.004]} />
        <meshStandardMaterial 
          color="#BCB8B1" 
          roughness={0.9} 
          metalness={0.0} 
        />
      </mesh>

      {/* 3. Matting (Passe-partout) Plane - sits flat on backing board */}
      {hasMat && (
        <mesh position={[0, 0, zMat]}>
          <planeGeometry args={[innerW, innerH]} />
          <meshStandardMaterial 
            color={matColor} 
            roughness={0.8} 
            metalness={0.05} 
          />
        </mesh>
      )}

      {/* 4. Artwork Image - sits recessed inside the frame */}
      <Suspense fallback={<PlaceholderPlane width={artW} height={artH} z={zArtwork} />}>
        {imageSrc ? (
          <ArtPlane url={imageSrc} width={artW} height={artH} z={zArtwork} />
        ) : (
          <PlaceholderPlane width={artW} height={artH} z={zArtwork} />
        )}
      </Suspense>

      {/* 5. Glass Reflection Overlay - sits at the front of the frame depth to capture environment reflection */}
      <mesh position={[0, 0, zGlass]}>
        <planeGeometry args={[innerW, innerH]} />
        <meshPhysicalMaterial
          color={glassColor}
          transparent
          opacity={glassOpacity}
          roughness={0.05}
          metalness={0.9}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
        />
      </mesh>
    </group>
  );
}

// ─── Wall Mount Backdrop ────────────────────────────────────────────
function WallBackdrop() {
  return (
    <mesh position={[0, 0, -1.0]} receiveShadow>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial 
        color="#F5F5F4" 
        roughness={0.95} 
        metalness={0.0} 
      />
    </mesh>
  );
}

// ─── Main 3D Canvas Exporter ────────────────────────────────────────
export default function FramePreview3D(props: FrameObjectProps) {
  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden bg-stone-950 shadow-inner flex items-center justify-center">
      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 0, 8], fov: 45 }}
        className="w-full h-full"
      >
        <ambientLight intensity={0.65} />
        <spotLight 
          position={[6, 8, 12]} 
          angle={0.35} 
          penumbra={1} 
          intensity={1.5} 
          castShadow 
        />
        <directionalLight 
          position={[-6, 6, 6]} 
          intensity={0.8} 
        />
        <pointLight 
          position={[0, 0, 4]} 
          intensity={0.3} 
        />
        
        <Center>
          <FrameObject {...props} />
        </Center>
        
        <WallBackdrop />
        
        <OrbitControls 
          enableZoom={true} 
          enablePan={false}
          minDistance={3}
          maxDistance={12}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>

      {/* Control Help Overlay */}
      <div className="absolute bottom-4 left-4 pointer-events-none bg-black/60 backdrop-blur-md text-[10px] text-stone-300 px-3 py-1.5 rounded-full uppercase tracking-wider font-semibold">
        Drag to Orbit • Scroll to Zoom
      </div>
    </div>
  );
}
