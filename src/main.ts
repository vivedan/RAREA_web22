
import * as pc from 'playcanvas';
import './style.css';

// --------------------------------------------------
// CONFIGURATION
// --------------------------------------------------

const SOG_URL = '/splats/RAREAroom1.sog';
const PATH_URL = '/paths/torres_paths.json';
const LOGO_URL = '/images/RAREA_logo.png';

const scrollSensitivity = 0.003;
const movementSmoothness = 5;
const mouseSensitivity = 0.15;
const touchScrollSensitivity = 0.025;
const touchLookSensitivity = 0.2;

const showDebugPath = false;

// Overlay ranges as normalized progress (0–1).
// fadeIn/fadeOut define the fraction of the path
// used for each transition.
const OVERLAY_RANGES = [
  { start: 0.00, end: 0.06, fadeIn: 0,    fadeOut: 0.035 },
  { start: 0.06, end: 0.18, fadeIn: 0.035, fadeOut: 0.035 },
  { start: 0.18, end: 0.37, fadeIn: 0.035, fadeOut: 0.035 },
  { start: 0.37, end: 0.55, fadeIn: 0.035, fadeOut: 0.035 },
  { start: 0.55, end: 0.75, fadeIn: 0.035, fadeOut: 0.035 },
  { start: 0.83, end: 1.00, fadeIn: 0.035, fadeOut: 0 }
];

// --------------------------------------------------
// HTML
// --------------------------------------------------

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <canvas id="application"></canvas>

  <div id="status">Loading Rarea Studio...</div>

  <div id="overlays">
    <img
      id="floating-logo"
      src="${LOGO_URL}"
      alt="RAREA Studio"
    />

    <div id="scroll-hint">
      <span class="hint-desktop">SCROLL TO EXPLORE</span>
      <span class="hint-mobile">SWIPE TO EXPLORE</span>
      <span class="hint-arrow">↓</span>
    </div>

    <section class="overlay overlay-intro">
      <div class="overlay-content centered">
        <img class="logo logo-intro" src="${LOGO_URL}" alt="RAREA Studio">
        <h1>Rarea Studio</h1>
        <p class="subtitle">
          Art and information experience design in space.
        </p>
      </div>
    </section>

    <section class="overlay overlay-text">
      <div class="overlay-content left">
        <h2>Independent.<br>Internationally recognised.</h2>
        <p>
          RAREA is an independent creative studio designing
          distinctive experiences at the intersection of art,
          design and technology. Our work has received
          international recognition and multiple design awards.
        </p>
      </div>
    </section>

    <section class="overlay overlay-text">
      <div class="overlay-content left">
        <h2>Ideas made spatial.</h2>
        <p>
          We create immersive environments, digital installations
          and interactive experiences that transform spaces into
          meaningful encounters between people, stories and ideas.
        </p>
      </div>
    </section>

    <section class="overlay overlay-text">
      <div class="overlay-content left">
        <h2>Across industries.<br>Around the world.</h2>
        <p>
          From global brands to cultural institutions, we have
          collaborated with a diverse range of internationally
          recognised clients, bringing creative thinking to
          different contexts, scales and audiences.
        </p>
      </div>
    </section>

    <section class="overlay overlay-text">
      <div class="overlay-content left">
        <h2>A multidisciplinary perspective.</h2>
        <p>
          Our practice brings together creative direction,
          spatial design, digital media and emerging technologies.
          We approach every project through conceptual thinking,
          technical expertise and attention to detail.
        </p>
      </div>
    </section>

    <section class="overlay overlay-contact">
      <div class="contact-heading">
        <h2>Have something in mind?</h2>
        <p class="contact-subtitle">
          Let's create something together.
        </p>
      </div>

      <div class="contact-brand">
        <img class="logo logo-contact"
            src="${LOGO_URL}"
            alt="RAREA Studio">

        <h3>Rarea Studio</h3>

        <a class="contact-link"
          href="mailto:info@rareastudio.com">
          info@rareastudio.com
        </a>
      </div>
    </section>

  </div>

`;

const canvas = document.querySelector<HTMLCanvasElement>('#application')!;
const status = document.querySelector<HTMLDivElement>('#status')!;

const overlays = Array.from(
  document.querySelectorAll<HTMLElement>('.overlay')
);

const floatingLogo =
  document.querySelector<HTMLElement>('#floating-logo')!;

const scrollHint =
  document.querySelector<HTMLElement>('#scroll-hint')!;

canvas.style.touchAction = 'none';

// --------------------------------------------------
// PLAYCANVAS
// --------------------------------------------------

const app = new pc.Application(canvas, {
  graphicsDeviceOptions: {
    antialias: false,
    alpha: false
  }
});

app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
app.setCanvasResolution(pc.RESOLUTION_AUTO);
app.start();

function resizeCanvas() {
  if (canvas.clientWidth === 0 || canvas.clientHeight === 0) return;
  app.resizeCanvas(canvas.clientWidth, canvas.clientHeight);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// --------------------------------------------------
// CAMERA
// --------------------------------------------------

const camera = new pc.Entity('Camera');

camera.addComponent('camera', {
  clearColor: new pc.Color(0.08, 0.08, 0.1),
  fov: 70
});

app.root.addChild(camera);

let yaw = 0;
let pitch = 0;

let initialYaw = 0;
let initialPitch = 0;

function updateCameraRotation() {
  camera.setEulerAngles(pitch, yaw, 0);
}

function resetCameraRotation() {
  yaw = initialYaw;
  pitch = initialPitch;
  updateCameraRotation();
}

// --------------------------------------------------
// MOUSE CONTROLS
// --------------------------------------------------

canvas.addEventListener('click', () => {
  if (window.matchMedia('(pointer: fine)').matches) {
    canvas.requestPointerLock();
  }
});

document.addEventListener('mousemove', (event) => {
  if (document.pointerLockElement !== canvas) return;

  yaw -= event.movementX * mouseSensitivity;
  pitch -= event.movementY * mouseSensitivity;
  pitch = pc.math.clamp(pitch, -89, 89);
});

// --------------------------------------------------
// PATH DATA
// --------------------------------------------------

type PathData = {
  id: string;
  closed: boolean;
  points: [number, number, number][];
};

type PathsFile = {
  paths: PathData[];
};

const pathRoot = new pc.Entity('GS Paths');
pathRoot.setEulerAngles(-90, 0, 0);
app.root.addChild(pathRoot);

let debugPaths: pc.Vec3[][] = [];
let debugClosed: boolean[] = [];

let pathDistances: number[] = [];
let pathTotalLength = 0;
let pathDistance = 0;
let targetPathDistance = 0;

function preparePath(points: pc.Vec3[]) {
  pathDistances = [0];

  for (let i = 1; i < points.length; i++) {
    const length = points[i].distance(points[i - 1]);
    pathDistances.push(pathDistances[i - 1] + length);
  }

  pathTotalLength = pathDistances[pathDistances.length - 1] ?? 0;
  pathDistance = 0;
  targetPathDistance = 0;

  console.log('Path length:', pathTotalLength.toFixed(2), 'm');
}

function getPositionOnPath(distance: number): pc.Vec3 | null {
  const points = debugPaths[0];
  if (!points || points.length < 2) return null;

  const d = pc.math.clamp(distance, 0, pathTotalLength);

  for (let i = 1; i < pathDistances.length; i++) {
    if (d <= pathDistances[i]) {
      const start = pathDistances[i - 1];
      const length = pathDistances[i] - start;
      const t = length > 0 ? (d - start) / length : 0;

      return new pc.Vec3().lerp(
        points[i - 1],
        points[i],
        t
      );
    }
  }

  return points[points.length - 1].clone();
}

function getDirectionOnPath(distance: number): pc.Vec3 | null {
  if (pathTotalLength <= 0) return null;

  const offset = Math.min(0.1, pathTotalLength / 2);

  const before = getPositionOnPath(
    Math.max(0, distance - offset)
  );

  const after = getPositionOnPath(
    Math.min(pathTotalLength, distance + offset)
  );

  if (!before || !after) return null;

  const direction = new pc.Vec3().sub2(after, before);
  if (direction.lengthSq() < 0.000001) return null;

  return direction.normalize();
}

function updateCameraOnPath() {
  const position = getPositionOnPath(pathDistance);
  if (position) camera.setPosition(position);
}

function calculateInitialOrientation() {
  const direction = getDirectionOnPath(0);
  if (!direction) return;

  initialYaw =
    Math.atan2(-direction.x, -direction.z) *
    pc.math.RAD_TO_DEG;

  const horizontalLength = Math.sqrt(
    direction.x ** 2 + direction.z ** 2
  );

  initialPitch =
    Math.atan2(direction.y, horizontalLength) *
    pc.math.RAD_TO_DEG;

  resetCameraRotation();
}

// --------------------------------------------------
// LOAD PATHS
// --------------------------------------------------

async function loadPaths() {
  try {
    const response = await fetch(PATH_URL);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = (await response.json()) as PathsFile;
    const transform = pathRoot.getWorldTransform();

    debugPaths = data.paths.map((path) =>
      path.points
        .map(([x, y, z]) =>
          transform.transformPoint(new pc.Vec3(x, y, z))
        )
        .reverse()
    );

    debugClosed = data.paths.map((path) => path.closed);

    if (debugPaths[0]?.length >= 2) {
      preparePath(debugPaths[0]);
      updateCameraOnPath();
      calculateInitialOrientation();
    }

    console.log('GS Paths loaded:', data.paths.length);

  } catch (error) {
    console.error('Error loading GS paths:', error);
  }
}

loadPaths();

// --------------------------------------------------
// MOUSE WHEEL
// --------------------------------------------------

canvas.addEventListener('wheel', (event) => {
  if (pathTotalLength <= 0) return;

  event.preventDefault();

  const delta = event.deltaY * (
    event.deltaMode === 1 ? 16 :
    event.deltaMode === 2 ? canvas.clientHeight : 1
  );

  targetPathDistance = pc.math.clamp(
    targetPathDistance + delta * scrollSensitivity,
    0,
    pathTotalLength
  );

}, { passive: false });

// --------------------------------------------------
// TOUCH CONTROLS
// --------------------------------------------------

let touchActive = false;
let lastTouchX = 0;
let lastTouchY = 0;

canvas.addEventListener('touchstart', (event) => {
  if (event.touches.length !== 1) {
    touchActive = false;
    return;
  }

  touchActive = true;
  lastTouchX = event.touches[0].clientX;
  lastTouchY = event.touches[0].clientY;

}, { passive: false });

canvas.addEventListener('touchmove', (event) => {
  if (!touchActive || event.touches.length !== 1) return;

  event.preventDefault();

  const touch = event.touches[0];
  const deltaX = touch.clientX - lastTouchX;
  const deltaY = touch.clientY - lastTouchY;

  lastTouchX = touch.clientX;
  lastTouchY = touch.clientY;

  if (pathTotalLength > 0) {
    targetPathDistance = pc.math.clamp(
      targetPathDistance - deltaY * touchScrollSensitivity,
      0,
      pathTotalLength
    );
  }

  yaw -= deltaX * touchLookSensitivity;

}, { passive: false });

canvas.addEventListener('touchend', () => {
  touchActive = false;
});

canvas.addEventListener('touchcancel', () => {
  touchActive = false;
});

// --------------------------------------------------
// KEYBOARD
// --------------------------------------------------

window.addEventListener('keydown', (event) => {
  if (event.code === 'KeyP') {
    const p = camera.getPosition();
    const r = camera.getEulerAngles();

    console.log('CAMERA POSITION:', p.x, p.y, p.z);
    console.log('CAMERA ROTATION:', r.x, r.y, r.z);
  }

  if (event.code === 'KeyR') {
    pathDistance = 0;
    targetPathDistance = 0;
    updateCameraOnPath();
    resetCameraRotation();
  }
});

// --------------------------------------------------
// OVERLAY ANIMATION
// --------------------------------------------------

// Smooth interpolation from 0 to 1
function smoothstep(t: number): number {
  const x = pc.math.clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
}

function getOverlayOpacity(
  progress: number,
  range: typeof OVERLAY_RANGES[number]
): number {

  if (progress < range.start || progress > range.end) {
    return 0;
  }

  const fadeIn = range.fadeIn > 0
    ? smoothstep(
        (progress - range.start) / range.fadeIn
      )
    : 1;

  const fadeOut = range.fadeOut > 0
    ? smoothstep(
        (range.end - progress) / range.fadeOut
      )
    : 1;

  return Math.min(fadeIn, fadeOut);
}

function updateOverlays(progress: number) {
  overlays.forEach((overlay, index) => {
    const range = OVERLAY_RANGES[index];
    if (!range) return;

    const opacity = getOverlayOpacity(progress, range);

    overlay.style.opacity = opacity.toString();
    overlay.style.visibility =
      opacity > 0 ? 'visible' : 'hidden';
  });
  // Floating logo visible only during overlays 01–04
  const logoOpacity = Math.max(
    ...OVERLAY_RANGES.slice(1, 5).map(
      range => getOverlayOpacity(progress, range)
    )
  );

  floatingLogo.style.opacity = logoOpacity.toString();
  floatingLogo.style.visibility =
    logoOpacity > 0 ? 'visible' : 'hidden';
    
  // Desaparece progresivamente durante el primer 5 % del recorrido
  const hintOpacity = 1 - smoothstep(progress / 0.05);

  scrollHint.style.opacity = hintOpacity.toString();
  scrollHint.style.visibility =
    hintOpacity > 0 ? 'visible' : 'hidden';
  }

// Intro visible immediately, even before loading.
updateOverlays(0);

// --------------------------------------------------
// GAUSSIAN SPLATTING
// --------------------------------------------------


const asset = new pc.Asset(
  'Rarea Studio',
  'gsplat',
  { url: SOG_URL }
);

app.assets.add(asset);

asset.ready(() => {
  const entity = new pc.Entity('Rarea Studio');
  entity.addComponent('gsplat', { asset });

  entity.setEulerAngles(0, 180, 180);
  app.root.addChild(entity);

  status.textContent = 'Rarea Studio loaded';

  setTimeout(() => status.remove(), 2000);

});

asset.on('error', (err) => {
  console.error(err);
  status.textContent = 'Error loading SOG.';
});

app.assets.load(asset);

// --------------------------------------------------
// MAIN UPDATE
// --------------------------------------------------


const debugColor = new pc.Color(0, 1, 0);

app.on('update', (dt: number) => {

  if (pathTotalLength > 0) {
    const smoothing =
      1 - Math.exp(-movementSmoothness * dt);

    pathDistance = pc.math.lerp(
      pathDistance,
      targetPathDistance,
      smoothing
    );

    updateCameraOnPath();
  }

  updateCameraRotation();

  const progress = pathTotalLength > 0
    ? pathDistance / pathTotalLength
    : 0;

  updateOverlays(progress);

  if (showDebugPath) {
    for (let p = 0; p < debugPaths.length; p++) {
      const points = debugPaths[p];

      for (let i = 0; i < points.length - 1; i++) {
        app.drawLine(points[i], points[i + 1], debugColor);
      }

      if (debugClosed[p] && points.length > 1) {
        app.drawLine(
          points[points.length - 1],
          points[0],
          debugColor
        );
      }
    }
  }

});
