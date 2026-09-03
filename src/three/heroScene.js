import * as THREE from 'three';

const RED = 0xe0263a;
const BLACK = 0x141414;
const DARK_SQUARE = 0x101010;
const LIGHT_SQUARE = 0x1d1d1d;

function buildBoard() {
  const group = new THREE.Group();
  const squareSize = 1;
  const boardSize = 8;
  const geometry = new THREE.BoxGeometry(squareSize * 0.96, 0.12, squareSize * 0.96);

  for (let x = 0; x < boardSize; x += 1) {
    for (let z = 0; z < boardSize; z += 1) {
      const isDark = (x + z) % 2 === 0;
      const material = new THREE.MeshStandardMaterial({
        color: isDark ? DARK_SQUARE : LIGHT_SQUARE,
        roughness: 0.75,
        metalness: 0.15,
      });
      const square = new THREE.Mesh(geometry, material);
      square.position.set(
        (x - boardSize / 2 + 0.5) * squareSize,
        0,
        (z - boardSize / 2 + 0.5) * squareSize
      );
      group.add(square);
    }
  }
  return group;
}

/**
 * A low-poly king piece built from primitives (no external model files):
 * a wide base, a tapered body, a crown band, and a cross on top.
 */
function buildKing(color) {
  const group = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.35,
    metalness: 0.45,
    emissive: color,
    emissiveIntensity: 0.06,
  });

  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.54, 0.2, 24), material);
  base.position.y = 0.1;

  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.4, 0.95, 20), material);
  body.position.y = 0.72;

  const shoulder = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.22, 0.16, 20), material);
  shoulder.position.y = 1.24;

  const crownBand = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.14, 20), material);
  crownBand.position.y = 1.4;

  const crossVertical = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.34, 0.09), material);
  crossVertical.position.y = 1.65;
  const crossHorizontal = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.09, 0.09), material);
  crossHorizontal.position.y = 1.62;

  group.add(base, body, shoulder, crownBand, crossVertical, crossHorizontal);
  return group;
}

export function initHeroScene(container) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isSmallScreen = window.innerWidth < 760;
  const lowPower = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;

  // On small/low-power devices or reduced-motion, skip WebGL entirely and
  // let the CSS radial-gradient (.hero::before) carry the visual instead.
  if (isSmallScreen || lowPower) return () => {};

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );
  camera.position.set(3.4, 3.6, 6.4);
  camera.lookAt(0, 0.5, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const key = new THREE.DirectionalLight(0xffffff, 1.1);
  key.position.set(4, 6, 3);
  scene.add(key);
  const rim = new THREE.PointLight(RED, 1.4, 20);
  rim.position.set(-3, 2, -2);
  scene.add(rim);

  const board = buildBoard();

  // Two kings facing each other across the board — red and black. The rig's
  // initial rotation (below) is chosen so the red king faces the camera
  // first when the page opens; scrolling slowly turns the whole board so
  // the black king comes into view too.
  const redKing = buildKing(RED);
  redKing.position.set(0, 0.1, 1.6);
  redKing.rotation.y = 0; // faces outward, toward the camera/viewer

  const blackKing = buildKing(BLACK);
  blackKing.position.set(0, 0.1, -1.6);
  blackKing.rotation.y = Math.PI; // rotated to face the red king across the board

  const rig = new THREE.Group();
  rig.add(board, redKing, blackKing);
  rig.rotation.x = -0.15;
  // Opening orientation: red king toward the viewer.
  rig.rotation.y = 0.05;
  scene.add(rig);

  let raf = null;
  let targetRotation = rig.rotation.y;
  let currentRotation = rig.rotation.y;

  function onScroll() {
    // Ties the board's rotation to progress through the *entire* page (not
    // just the hero), so the piece keeps slowly turning as you scroll all
    // the way down, rather than settling after the first screen.
    const scrollable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const progress = Math.min(window.scrollY / scrollable, 1);
    targetRotation = 0.05 + progress * Math.PI * 1.85;
  }

  function animate() {
    currentRotation += (targetRotation - currentRotation) * 0.06;
    rig.rotation.y = currentRotation;
    if (!reducedMotion) {
      const bob = Math.sin(performance.now() * 0.0011) * 0.025;
      redKing.position.y = 0.1 + bob;
      blackKing.position.y = 0.1 - bob;
    }
    renderer.render(scene, camera);
    raf = requestAnimationFrame(animate);
  }

  function onResize() {
    const { clientWidth, clientHeight } = container;
    camera.aspect = clientWidth / clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(clientWidth, clientHeight);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);
  animate();

  // Pause rendering when the tab is hidden to save battery/CPU.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && raf) {
      cancelAnimationFrame(raf);
      raf = null;
    } else if (!document.hidden && raf === null) {
      animate();
    }
  });

  return function destroy() {
    if (raf) cancelAnimationFrame(raf);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
    renderer.dispose();
    container.innerHTML = '';
  };
}
