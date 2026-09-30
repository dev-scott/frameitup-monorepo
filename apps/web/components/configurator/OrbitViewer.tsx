'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@/context/FrameContext';
import { getMouldureById } from '@/data/frames';
import { getFormatById } from '@/data/formats';

export default function OrbitViewer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { config } = useFrame();

  const format = getFormatById(config.format);
  const mouldure = getMouldureById(config.mouldureId);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── Scene setup ──────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    const W = canvas.clientWidth, H = canvas.clientHeight;
    renderer.setSize(W, H, false);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#F5F5F4');

    const camera = new THREE.PerspectiveCamera(45, W / H, 0.01, 100);
    camera.position.set(0, 0, 3.5);

    // ── Lights ────────────────────────────────────────────────────────────────
    const ambient = new THREE.AmbientLight(0xfff8e8, 0.4);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xfff0d0, 1.8);
    keyLight.position.set(2, 3, 3);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x8090ff, 0.3);
    fillLight.position.set(-2, -1, 2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xc9a96e, 0.5);
    rimLight.position.set(0, -3, -2);
    scene.add(rimLight);

    // ── Frame geometry ────────────────────────────────────────────────────────
    // Dimensions in Three.js units (1 unit ≈ 10cm)
    const fW = format.widthCm / 30;  // A4 = 0.7
    const fH = format.heightCm / 30;
    const mouldureW = mouldure.widthMm / 300; // ~0.133 for 40mm
    const frameDepth = mouldure.depthMm / 300;
    const ppW = config.passepartoutId ? config.passepartoutWidthMm / 300 : 0;

    // Frame material
    const parsedColor = new THREE.Color(mouldure.colorPrimary);
    const frameMat = new THREE.MeshStandardMaterial({
      color: parsedColor,
      roughness: mouldure.isWood ? 0.75 : (config.finish === 'brillant' ? 0.05 : 0.4),
      metalness: mouldure.isWood ? 0 : (mouldure.id.includes('argent') || mouldure.id.includes('dore') ? 0.85 : 0.1),
    });

    const group = new THREE.Group();

    // 4 frame bars (top/bottom/left/right)
    const totalW = fW + mouldureW * 2;
    const totalH = fH + mouldureW * 2;

    // Top bar
    const barGeo = (w: number, h: number, d: number) => new THREE.BoxGeometry(w, h, d);

    const topBar = new THREE.Mesh(barGeo(totalW, mouldureW, frameDepth), frameMat);
    topBar.position.y = fH / 2 + mouldureW / 2;
    topBar.castShadow = true;
    group.add(topBar);

    const bottomBar = new THREE.Mesh(barGeo(totalW, mouldureW, frameDepth), frameMat);
    bottomBar.position.y = -(fH / 2 + mouldureW / 2);
    bottomBar.castShadow = true;
    group.add(bottomBar);

    const leftBar = new THREE.Mesh(barGeo(mouldureW, fH, frameDepth), frameMat);
    leftBar.position.x = -(fW / 2 + mouldureW / 2);
    leftBar.castShadow = true;
    group.add(leftBar);

    const rightBar = new THREE.Mesh(barGeo(mouldureW, fH, frameDepth), frameMat);
    rightBar.position.x = fW / 2 + mouldureW / 2;
    rightBar.castShadow = true;
    group.add(rightBar);

    // Passepartout
    if (ppW > 0 && config.passepartoutId) {
      const ppMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0xf8f5f0),
        roughness: 0.9,
        metalness: 0,
      });
      const ppGeo = new THREE.BoxGeometry(fW, fH, frameDepth * 0.4);
      const ppMesh = new THREE.Mesh(ppGeo, ppMat);
      ppMesh.position.z = frameDepth * 0.3;
      group.add(ppMesh);

      // Cutout for image area
      const innerW = fW - ppW * 2;
      const innerH = fH - ppW * 2;
      const imgMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color('#1c1812'),
        roughness: 0.8,
      });
      const imgGeo = new THREE.BoxGeometry(innerW, innerH, frameDepth * 0.1);
      const imgMesh = new THREE.Mesh(imgGeo, imgMat);
      imgMesh.position.z = frameDepth * 0.5;

      if (config.imageUrl) {
        const texLoader = new THREE.TextureLoader();
        texLoader.load(config.imageUrl, (tex) => {
          imgMesh.material = new THREE.MeshStandardMaterial({
            map: tex,
            roughness: 0.6,
          });
        });
      }
      group.add(imgMesh);
    }

    // Glass/plexiglas panel
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.12,
      roughness: 0.02,
      metalness: 0,
      transmission: 0.8,
      thickness: 0.02,
    });
    const glassGeo = new THREE.BoxGeometry(
      fW + mouldureW * 0.2,
      fH + mouldureW * 0.2,
      0.01,
    );
    const glassMesh = new THREE.Mesh(glassGeo, glassMat);
    glassMesh.position.z = frameDepth / 2 + 0.005;

    if (config.glassType === 'plexiglas-flottant') {
      // Floating: small offset from frame
      glassMesh.position.z = frameDepth / 2 + 0.02;
      glassMesh.scale.set(0.96, 0.96, 1);
    }
    group.add(glassMesh);

    scene.add(group);

    // ── Orbit controls (manual implementation) ────────────────────────────────
    let isDragging = false;
    let prevX = 0, prevY = 0;
    let rotX = 0, rotY = 0;
    let velX = 0, velY = 0;
    const AUTO_ROTATE_SPEED = 0.004;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
      velX = velY = 0;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      velX = dx * 0.008;
      velY = dy * 0.008;
      rotY += velX;
      rotX += velY;
      rotX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, rotX));
      prevX = e.clientX;
      prevY = e.clientY;
    };
    const onMouseUp = () => { isDragging = false; };

    const onTouchStart = (e: TouchEvent) => {
      isDragging = true;
      prevX = e.touches[0].clientX;
      prevY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      const dx = e.touches[0].clientX - prevX;
      const dy = e.touches[0].clientY - prevY;
      velX = dx * 0.008;
      velY = dy * 0.008;
      rotY += velX;
      rotX += velY;
      rotX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, rotX));
      prevX = e.touches[0].clientX;
      prevY = e.touches[0].clientY;
    };
    const onTouchEnd = () => { isDragging = false; };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    canvas.addEventListener('touchmove', onTouchMove, { passive: true });
    canvas.addEventListener('touchend', onTouchEnd);

    // ── Animation loop ─────────────────────────────────────────────────────────
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!isDragging) {
        // Auto-rotate + dampen velocity
        rotY += AUTO_ROTATE_SPEED;
        velX *= 0.95;
        velY *= 0.95;
      }

      group.rotation.y = rotY;
      group.rotation.x = rotX;

      renderer.render(scene, camera);
    };
    animate();

    // ── Cleanup ───────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
      renderer.dispose();
      frameMat.dispose();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.format, config.mouldureId, config.passepartoutId, config.passepartoutWidthMm, config.glassType, config.finish, config.imageUrl]);

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '360px',
          borderRadius: 12,
          background: '#F0EBE0',
          cursor: 'grab',
          touchAction: 'none',
        }}
        width={600}
        height={360}
      />
      <p
        style={{
          textAlign: 'center',
          fontSize: '0.75rem',
          color: '#5a4e42',
          marginTop: '8px',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        Faites glisser pour pivoter · Rotation automatique en cours
      </p>
    </div>
  );
}
