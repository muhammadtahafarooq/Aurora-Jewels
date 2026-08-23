import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Props {
  /** Accessible name of the product shown in the viewer */
  name: string;
  /** Optional Draco-compressed GLB. A procedural champagne-gold placeholder is used when absent. */
  glbUrl?: string;
}

type Phase = 'loading' | 'ready' | 'fallback';

const FALLBACK_FLAG = 'aj_3d_fallback';
const MIN_FPS = 30;
const FPS_GRACE_SECONDS = 3;

export default function ProductViewer({ name, glbUrl }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>('loading');

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Permanent fallback for devices that already failed the FPS watchdog.
    if (sessionStorage.getItem(FALLBACK_FLAG) === '1') {
      setPhase('fallback');
      return;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setPhase('fallback');
      return;
    }

    /* --- FPS watchdog state (declared early; checked inside the loop) --- */
    let fpsFrames = 0;
    let fpsLowSeconds = 0;
    let fpsWarmup = 0;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);

    renderer.setClearAlpha(0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.cssText =
      'width:100%;height:100%;display:block;touch-action:none;cursor:grab';

    /* --- Lighting: single environment bake + one key light --- */
    const pmrem = new THREE.PMREMGenerator(renderer);
    let environment: THREE.Texture | null = null;
    import('three/examples/jsm/environments/RoomEnvironment.js').then(({ RoomEnvironment }) => {
      environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environment = environment;
      requestRender();
    });

    const key = new THREE.DirectionalLight(0xfff8ec, 1.1);
    key.position.set(3, 4, 5);
    scene.add(key);

    /* --- Object: GLB asset or procedural champagne-gold ring placeholder --- */
    const disposables: Array<{ dispose: () => void }> = [];
    const group = new THREE.Group();
    scene.add(group);

    if (glbUrl) {
      Promise.all([
        import('three/examples/jsm/loaders/GLTFLoader.js'),
        import('three/examples/jsm/loaders/DRACOLoader.js'),
      ])
        .then(async ([{ GLTFLoader }, { DRACOLoader }]) => {
          const draco = new DRACOLoader();
          draco.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
          const loader = new GLTFLoader();
          loader.setDRACOLoader(draco);
          const gltf = await loader.loadAsync(glbUrl);
          group.add(gltf.scene);
          const sphere = new THREE.Box3().setFromObject(gltf.scene).getBoundingSphere(new THREE.Sphere());
          frameObject(sphere);
          draco.dispose();
        })
        .catch(() => setPhase('fallback'));
    } else {
      // Placeholder: champagne-gold ring matching the brand accent (#C6A56A).
      const geometry = new THREE.TorusGeometry(1, 0.32, 48, 96);
      geometry.rotateX(Math.PI / 2.6);
      const material = new THREE.MeshStandardMaterial({
        color: 0xc6a56a,
        metalness: 1,
        roughness: 0.22,
        envMapIntensity: 1.2,
      });
      group.add(new THREE.Mesh(geometry, material));
      disposables.push(geometry, material);
      const sphere = new THREE.Box3().setFromObject(group).getBoundingSphere(new THREE.Sphere());
      frameObject(sphere);
    }

    function frameObject(sphere: THREE.Sphere) {
      const dist = (sphere.radius / Math.sin((camera.fov * Math.PI) / 360)) * 1.15;
      camera.position.set(0, sphere.center.y + 0.15, dist);
      camera.lookAt(sphere.center);
      targetDist.v = dist;
      setPhase('ready');
      resize();
    }

    /* --- Responsive sizing --- */
    function resize() {
      const w = mount!.clientWidth;
      const h = mount!.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      requestRender();
    }
    const ro = new ResizeObserver(resize);
    ro.observe(mount!);

    /* --- Lightweight custom controls (drag rotate / wheel+pinch zoom) --- */
    const targetRot = { x: 0, y: 0 };
    const curRot = { x: 0, y: 0 };
    const targetDist = { v: 4 };
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let lastInteraction = performance.now();
    const pointers = new Map<number, { x: number; y: number }>();
    let pinchStart = 0;

    const interacted = () => {
      lastInteraction = performance.now();
    };

    const onPointerDown = (e: PointerEvent) => {
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 1) {
        dragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
        renderer.domElement.style.cursor = 'grabbing';
      } else if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        pinchStart = Math.hypot(a.x - b.x, a.y - b.y);
      }
      interacted();
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      interacted();

      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (pinchStart > 0 && d > 0) {
          targetDist.v = THREE.MathUtils.clamp(
            targetDist.v * (pinchStart / d),
            camera.position.z * 0.65,
            camera.position.z * 1.4
          );
        }
        pinchStart = d;
        requestRender();
        return;
      }

      if (!dragging) return;
      targetRot.y += (e.clientX - lastX) * 0.008;
      targetRot.x = THREE.MathUtils.clamp(targetRot.x + (e.clientY - lastY) * 0.006, -0.6, 0.6);
      lastX = e.clientX;
      lastY = e.clientY;
      requestRender();
    };

    const onPointerUp = (e: PointerEvent) => {
      pointers.delete(e.pointerId);
      if (pointers.size < 2) pinchStart = 0;
      if (pointers.size === 0) {
        dragging = false;
        renderer.domElement.style.cursor = 'grab';
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      interacted();
      targetDist.v = THREE.MathUtils.clamp(
        targetDist.v + e.deltaY * 0.0025,
        camera.position.z * 0.65,
        camera.position.z * 1.4
      );
      requestRender();
    };

    const el = renderer.domElement;
    el.addEventListener('pointerdown', onPointerDown);
    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerup', onPointerUp);
    el.addEventListener('pointercancel', onPointerUp);
    el.addEventListener('wheel', onWheel, { passive: false });

    /* --- Render-on-demand loop: idle auto-rotate only when there is work --- */
    let raf = 0;
    let running = false;
    let visible = true;
    let needsRender = true;

    function requestRender() {
      needsRender = true;
      start();
    }

    function frame() {
      raf = requestAnimationFrame(frame);

      // Slow, controlled idle rotation — disabled under reduced motion
      const idle = performance.now() - lastInteraction > 3000;
      if (!reducedMotion && idle && !dragging) {
        targetRot.y += 0.0035;
        needsRender = true;
      }

      const dx = targetRot.x - curRot.x;
      const dy = targetRot.y - curRot.y;
      const dz = targetDist.v - camera.position.z;

      if (Math.abs(dx) > 0.0001 || Math.abs(dy) > 0.0001 || Math.abs(dz) > 0.001 || needsRender) {
        curRot.x += dx * 0.12;
        curRot.y += dy * 0.12;
        camera.position.z += dz * 0.12;
        group.rotation.x = curRot.x;
        group.rotation.y = curRot.y;
        renderer.render(scene, camera);
        needsRender = false;
        fpsFrames++;
      }

      // FPS watchdog handled by interval below
    }

    function start() {
      if (running || !visible || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(frame);
    }

    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(mount!);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVis);

    /* --- FPS watchdog: sustained <30fps after warmup → permanent static fallback --- */
    const fpsInterval = window.setInterval(() => {
      if (!running) return;
      if (fpsWarmup < FPS_GRACE_SECONDS) {
        fpsWarmup++;
        fpsFrames = 0;
        return;
      }
      if (fpsFrames >= MIN_FPS) {
        fpsLowSeconds = 0;
      } else {
        fpsLowSeconds++;
        if (fpsLowSeconds >= 3) {
          sessionStorage.setItem(FALLBACK_FLAG, '1');
          cleanup();
          setPhase('fallback');
          return;
        }
      }
      fpsFrames = 0;
    }, 1000);

    function cleanup() {
      stop();
      window.clearInterval(fpsInterval);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      el.removeEventListener('pointerdown', onPointerDown);
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerup', onPointerUp);
      el.removeEventListener('pointercancel', onPointerUp);
      el.removeEventListener('wheel', onWheel);
      disposables.forEach((d) => d.dispose());
      environment?.dispose();
      pmrem.dispose();
      renderer.dispose();
      el.remove();
    }

    return cleanup;
  }, [glbUrl]);

  return (
    <div
      className="relative aspect-[4/5] w-full overflow-hidden bg-surface-warm"
      role="img"
      aria-label={`Interactive 3D view of ${name}`}
    >
      {/* Static fallback — also the no-JS state; critical content never lives in the canvas */}
      {phase !== 'ready' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="type-eyebrow text-muted">
            {phase === 'loading' ? (
              <span className="skeleton inline-block h-[12px] w-[140px]" aria-hidden="true" />
            ) : (
              `${name} — Product Imagery`
            )}
          </span>
        </div>
      )}
      <div ref={mountRef} className="absolute inset-0" />
      {phase === 'ready' && (
        <p className="status-label pointer-events-none absolute bottom-3 left-3">
          Drag to rotate · Scroll to zoom
        </p>
      )}
    </div>
  );
}
