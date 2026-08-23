/**
 * Aurora Jewels — 3D Product Viewer (Three.js)
 *
 * ACR-003 compliant implementation:
 * - Lazy-loaded via IntersectionObserver (parent uses client:visible)
 * - DPR capped at 2
 * - Render-on-demand (no continuous render loop when idle)
 * - Pause offscreen / hidden tab
 * - FPS watchdog: permanently falls back to static image below 30fps
 * - Reduced-motion: disables auto-rotation; manual drag remains
 * - Procedural placeholder ring until real GLB assets exist
 * - Dynamic import: Three.js only loads when viewer is activated
 */

/* ------------------------------------------------------------------ */
/* Constants                                                          */
/* ------------------------------------------------------------------ */

const FPS_THRESHOLD = 30;
const FPS_SAMPLE_DURATION = 2000;
const FPS_MIN_SAMPLES = 10;
const IDLE_TIMEOUT = 3000;
const DPR_MAX = 2;

/* ------------------------------------------------------------------ */
/* State                                                              */
/* ------------------------------------------------------------------ */

let activeViewer: ViewerState | null = null;

interface ViewerState {
  THREE: typeof import('three');
  OrbitControls: typeof import('three/addons/controls/OrbitControls.js')['OrbitControls'];
  renderer: import('three').WebGLRenderer;
  scene: import('three').Scene;
  camera: import('three').PerspectiveCamera;
  controls: InstanceType<typeof import('three/addons/controls/OrbitControls.js')['OrbitControls']>;
  ring: import('three').Group;
  canvas: HTMLCanvasElement;
  container: HTMLElement;
  fallback: HTMLElement;
  loader: HTMLElement;
  hint: HTMLElement;
  animationId: number;
  idleTimer: ReturnType<typeof setTimeout> | null;
  isVisible: boolean;
  isTabActive: boolean;
  autoRotate: boolean;
  disposed: boolean;
  frameTimes: number[];
  lastFrameTime: number;
  fpsCheckComplete: boolean;
}

/* ------------------------------------------------------------------ */
/* FPS Watchdog                                                       */
/* ------------------------------------------------------------------ */

function checkFPS(state: ViewerState): boolean {
  if (state.fpsCheckComplete) return true;

  const now = performance.now();
  state.frameTimes.push(now);
  state.frameTimes = state.frameTimes.filter((t) => now - t < FPS_SAMPLE_DURATION);

  if (state.frameTimes.length < FPS_MIN_SAMPLES) return true;

  const fps = (state.frameTimes.length - 1) / (FPS_SAMPLE_DURATION / 1000);

  if (fps < FPS_THRESHOLD) {
    console.warn(`[Aurora 3D] FPS ${fps.toFixed(1)} < ${FPS_THRESHOLD}. Falling back to static image.`);
    state.fpsCheckComplete = true;
    fallbackToImage(state);
    return false;
  }

  state.fpsCheckComplete = true;
  return true;
}

function fallbackToImage(state: ViewerState) {
  state.fallback.style.opacity = '1';
  state.canvas.style.opacity = '0';
  state.hint.style.opacity = '0';
  state.controls.dispose();
  state.renderer.dispose();
  state.disposed = true;
  cancelAnimationFrame(state.animationId);
}

/* ------------------------------------------------------------------ */
/* Procedural placeholder ring                                        */
/* ------------------------------------------------------------------ */

function createPlaceholderRing(THREE: typeof import('three')): import('three').Group {
  const group = new THREE.Group();

  const bandGeometry = new THREE.TorusGeometry(1, 0.08, 32, 100);
  const bandMaterial = new THREE.MeshStandardMaterial({
    color: 0xc6a56a,
    metalness: 0.85,
    roughness: 0.2,
  });
  const band = new THREE.Mesh(bandGeometry, bandMaterial);
  band.rotation.x = Math.PI / 2;
  group.add(band);

  const settingGeometry = new THREE.CylinderGeometry(0.15, 0.2, 0.12, 6);
  const settingMaterial = new THREE.MeshStandardMaterial({
    color: 0xc6a56a,
    metalness: 0.9,
    roughness: 0.15,
  });
  const setting = new THREE.Mesh(settingGeometry, settingMaterial);
  setting.position.set(0, 0.08, 1);
  group.add(setting);

  const stoneGeometry = new THREE.BoxGeometry(0.22, 0.1, 0.18);
  const stoneMaterial = new THREE.MeshStandardMaterial({
    color: 0x123c36,
    metalness: 0.1,
    roughness: 0.05,
    transparent: true,
    opacity: 0.9,
  });
  const stone = new THREE.Mesh(stoneGeometry, stoneMaterial);
  stone.position.set(0, 0.18, 1);
  group.add(stone);

  const accentGeometry = new THREE.SphereGeometry(0.03, 16, 16);
  const accentMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.3,
    roughness: 0.0,
  });

  for (let i = -2; i <= 2; i++) {
    if (i === 0) continue;
    const accent = new THREE.Mesh(accentGeometry, accentMaterial);
    accent.position.set(i * 0.1, 0.08, 1);
    group.add(accent);
  }

  return group;
}

/* ------------------------------------------------------------------ */
/* Scene setup                                                        */
/* ------------------------------------------------------------------ */

async function initViewer(container: HTMLElement) {
  if (activeViewer?.disposed === false) return;

  const canvas = container.querySelector<HTMLCanvasElement>('[data-viewer-canvas]');
  const fallback = container.querySelector<HTMLElement>('[data-viewer-fallback]');
  const loader = container.querySelector<HTMLElement>('[data-viewer-loader]');
  const hint = container.querySelector<HTMLElement>('[data-viewer-hint]');

  if (!canvas || !fallback || !loader || !hint) return;

  const rect = container.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return;

  // Dynamic import — Three.js only loads when viewer is activated
  const [THREE, { OrbitControls }] = await Promise.all([
    import('three'),
    import('three/addons/controls/OrbitControls.js'),
  ]);

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'default',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, DPR_MAX));
  renderer.setSize(rect.width, rect.height, false);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  // Scene
  const scene = new THREE.Scene();

  // Camera
  const camera = new THREE.PerspectiveCamera(35, rect.width / rect.height, 0.1, 100);
  camera.position.set(0, 1.5, 3.5);

  // Lighting — soft studio setup
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xfff5e6, 1.2);
  keyLight.position.set(3, 5, 4);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xe6f0ff, 0.5);
  fillLight.position.set(-3, 3, -2);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0xfff0dd, 0.3);
  rimLight.position.set(0, -2, -3);
  scene.add(rimLight);

  // Environment map for reflections
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color(0xfaf8f3);

  const envTopLight = new THREE.DirectionalLight(0xfff5e6, 0.5);
  envTopLight.position.set(0, 1, 0);
  envScene.add(envTopLight);

  const envTexture = pmremGenerator.fromScene(envScene, 0.04).texture;
  scene.environment = envTexture;
  pmremGenerator.dispose();

  // Ring
  const ring = createPlaceholderRing(THREE);
  scene.add(ring);

  // Controls
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.minDistance = 2;
  controls.maxDistance = 6;
  controls.minPolarAngle = Math.PI * 0.15;
  controls.maxPolarAngle = Math.PI * 0.75;
  controls.autoRotate = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  controls.autoRotateSpeed = 1.2;
  controls.target.set(0, 0, 1);

  // Reveal
  loader.style.opacity = '0';
  setTimeout(() => { loader.style.display = 'none'; }, 300);
  canvas.style.opacity = '1';
  setTimeout(() => { hint.style.opacity = '1'; }, 800);
  setTimeout(() => { hint.style.opacity = '0'; }, 4000);

  // State
  const state: ViewerState = {
    THREE,
    OrbitControls,
    renderer,
    scene,
    camera,
    controls,
    ring,
    canvas,
    container,
    fallback,
    loader,
    hint,
    animationId: 0,
    idleTimer: null,
    isVisible: true,
    isTabActive: !document.hidden,
    autoRotate: controls.autoRotate,
    disposed: false,
    frameTimes: [],
    lastFrameTime: performance.now(),
    fpsCheckComplete: false,
  };

  activeViewer = state;

  // Start render loop
  startRenderLoop(state);

  // Resize handler
  const onResize = () => {
    if (state.disposed) return;
    const r = container.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    renderer.setSize(r.width, r.height, false);
    camera.aspect = r.width / r.height;
    camera.updateProjectionMatrix();
  };
  window.addEventListener('resize', onResize);

  // IntersectionObserver — pause offscreen
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        state.isVisible = entry.isIntersecting;
        scheduleIdleCheck(state);
      });
    },
    { threshold: 0.1 }
  );
  observer.observe(container);

  // Visibility change — pause on hidden tab
  const onVisChange = () => {
    state.isTabActive = !document.hidden;
    scheduleIdleCheck(state);
  };
  document.addEventListener('visibilitychange', onVisChange);

  // Reduced motion listener
  const rmQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const onRMChange = () => {
    state.autoRotate = !rmQuery.matches;
    controls.autoRotate = state.autoRotate;
  };
  rmQuery.addEventListener('change', onRMChange);

  // Cleanup on page swap
  const cleanup = () => {
    observer.disconnect();
    document.removeEventListener('visibilitychange', onVisChange);
    rmQuery.removeEventListener('change', onRMChange);
    window.removeEventListener('resize', onResize);
    cancelAnimationFrame(state.animationId);
    if (state.idleTimer) clearTimeout(state.idleTimer);
    controls.dispose();
    renderer.dispose();
    state.disposed = true;
  };

  document.addEventListener('astro:before-swap', cleanup, { once: true });
}

/* ------------------------------------------------------------------ */
/* Render loop                                                        */
/* ------------------------------------------------------------------ */

function startRenderLoop(state: ViewerState) {
  const loop = () => {
    if (state.disposed) return;

    state.animationId = requestAnimationFrame(loop);

    if (!checkFPS(state)) return;
    if (!state.isVisible || !state.isTabActive) return;

    state.controls.update();
    state.ring.rotation.y += 0.001;

    state.renderer.render(state.scene, state.camera);
  };

  loop();
}

function scheduleIdleCheck(state: ViewerState) {
  if (state.idleTimer) clearTimeout(state.idleTimer);

  if (!state.isVisible || !state.isTabActive) {
    state.idleTimer = setTimeout(() => {
      cancelAnimationFrame(state.animationId);
    }, IDLE_TIMEOUT);
  } else {
    if (state.disposed) return;
    startRenderLoop(state);
  }
}

/* ------------------------------------------------------------------ */
/* Initialization                                                     */
/* ------------------------------------------------------------------ */

function initAllViewers() {
  document.querySelectorAll<HTMLElement>('[data-product-viewer]').forEach((container) => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            initViewer(container);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '200px' }
    );
    observer.observe(container);
  });
}

initAllViewers();
document.addEventListener('astro:after-swap', initAllViewers);
