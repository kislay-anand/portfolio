import * as THREE from 'three';

const RED = 0xe0263a;
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

/** A simple low-poly knight silhouette built from primitives (no external assets). */
function buildKnight() {
  const group = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({
    color: RED,
    roughness: 0.35,
    metalness: 0.4,
    emissive: RED,
    emissiveIntensity: 0.08,
  });

  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.5, 0.25, 24), material);
  base.position.y = 0.18;

  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.32, 0.7, 16), material);
  stem.position.y = 0.65;

  const head = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.55, 0.32), material);
  head.position.set(0.02, 1.15, 0);
  head.rotation.z = -0.18;

  const nose = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.22, 0.3), material);
  nose.position.set(0.32, 1.0, 0);
  nose.rotation.z = -0.1;

  group.add(base, stem, head, nose);
  group.position.y = 0.12;
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
  camera.lookAt(0, 0.3, 0);

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
  const knight = buildKnight();
  knight.position.set(0.5, 0, 0.5);
  scene.add(board, knight);

  const rig = new THREE.Group();
  rig.add(board, knight);
  scene.remove(board, knight);
  scene.add(rig);
  rig.rotation.x = -0.15;

  let raf = null;
  let targetRotation = 0;
  let currentRotation = 0;

  function onScroll() {
    const progress = Math.min(window.scrollY / (window.innerHeight * 1.2), 1);
    targetRotation = progress * Math.PI * 0.6;
  }

  function animate() {
    currentRotation += (targetRotation - currentRotation) * 0.06;
    rig.rotation.y = currentRotation + 0.15;
    if (!reducedMotion) {
      knight.position.y = 0.05 + Math.sin(performance.now() * 0.0012) * 0.03;
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
