const ANTIALIAS = true;

const LINE_COLOR = 0x777799;

const CUBE_COLOR = LINE_COLOR;
const TOWER_COLOR = LINE_COLOR;

const GLOBAL_SPEED_MODIFIER = 0.8;

const GRAVITY = 0.06 * 160 * GLOBAL_SPEED_MODIFIER;

// TODO get from screen pixel to ensure offscreen

const TOWER_SPIN_SPEED = 2.1 * GLOBAL_SPEED_MODIFIER;
const TOWER_DROP_SPEED = 1.5 * GLOBAL_SPEED_MODIFIER;
const TOWER_TOP = -0.7;
const TOWER_HEIGHT = 5;
const TOWER_POSITION_Y = TOWER_TOP - TOWER_HEIGHT / 2;

const CUBE_SIZE = 1;
const HALF_CUBE_SIZE = CUBE_SIZE / 2;
const CUBE_START_Y = 5;
const CUBE_STOP_Y = TOWER_TOP + HALF_CUBE_SIZE;
const CUBE_ROTATION_SPEED = 1.7435 * GLOBAL_SPEED_MODIFIER;
const CUBE_START_ROTATION = 0;
const CUBE_FADE_SPEED = 1.5 * GLOBAL_SPEED_MODIFIER;

const DEG_90 = Math.PI / 2;

const CUBE_MATERIAL = new THREE.LineBasicMaterial({
  color: CUBE_COLOR,
});
const FALLEN_CUBE_MATERIAL = new THREE.LineBasicMaterial({
  color: CUBE_COLOR,
  transparent: true,
  opacity: 1,
});
const LINE_MATERIAL = new THREE.LineBasicMaterial({ color: LINE_COLOR });

const PHASES = ["drop1", "drop2", "drop3", "drop4"];

const FADE_SPEED = 0x010101;

var currentPhase = 0;
var towerNeedsToDrop = false;
var towerNeedsToStartDrop = false;

const scene = new THREE.Scene();

const clock = new THREE.Clock();

const domRoot = document.getElementById("cube-tower");
domRoot.innerHTML = "";

const root = new THREE.Group();
root.rotation.y = -0.3;
root.position.y = -0.5;
scene.add(root);

// Camera
const PIXEL_RATIO = window.innerWidth / window.innerHeight;
const perspectiveCamera = new THREE.PerspectiveCamera(
  75,
  PIXEL_RATIO,
  0.1,
  1000
);
const camera = perspectiveCamera;
camera.position.z = 5;

// Renderer
const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: ANTIALIAS,
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(domRoot.offsetWidth, domRoot.offsetHeight);
renderer.setClearColor(0xffffff, 0);
domRoot.appendChild(renderer.domElement);

// Cube
const cubeGeometry = new THREE.BoxGeometry(CUBE_SIZE);
const cubeEdgeGeometry = new THREE.EdgesGeometry(cubeGeometry);
const cube = new THREE.LineSegments(cubeEdgeGeometry, CUBE_MATERIAL);
cube.position.y = CUBE_START_Y;
cube.position.x = -HALF_CUBE_SIZE;
cube.position.z = HALF_CUBE_SIZE;
var cubeFallingSpeed = 0;
root.add(cube);

// Tower
const towerGeometry = new THREE.BoxGeometry(2, TOWER_HEIGHT, 2);
const towerEdgeGeometry = new THREE.EdgesGeometry(towerGeometry);
const tower = new THREE.LineSegments(towerEdgeGeometry, LINE_MATERIAL);
tower.position.y = TOWER_POSITION_Y;
root.add(tower);

const onResize = () => {
  camera.aspect = domRoot.offsetWidth / domRoot.offsetHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(domRoot.offsetWidth, domRoot.offsetHeight);
};
// initialize resize listener
window.addEventListener("resize", onResize, false);
onResize();

let animationFramesBetweenRenderFrames = 0;

// run
const animate = () => {
  requestAnimationFrame(animate);
  if (document.hidden) return;

  const delta = clock.getDelta();

  // Adjust constants for the timing of this frame
  const towerSpinSpeed = TOWER_SPIN_SPEED * delta;
  const towerDropSpeed = TOWER_DROP_SPEED * delta;
  const cubeRotationSpeed = CUBE_ROTATION_SPEED * delta;
  const gravity = GRAVITY * delta;

  switch (PHASES[currentPhase]) {
    case "drop1":
      if (towerNeedsToStartDrop) {
        towerNeedsToStartDrop = false;
        towerNeedsToDrop = true;
        tower.position.y += 1;
        for (let child of tower.children) {
          child.material = FALLEN_CUBE_MATERIAL;
          child.position.y -= 1;
        }
      }
      // drop tower if it's not finished dropping
      if (towerNeedsToDrop) {
        tower.position.y -= towerDropSpeed;
        FALLEN_CUBE_MATERIAL.opacity -= CUBE_FADE_SPEED * delta;
        if (tower.position.y <= TOWER_POSITION_Y) {
          towerNeedsToDrop = false;
          tower.remove(...tower.children);
          tower.position.y = TOWER_POSITION_Y;
          FALLEN_CUBE_MATERIAL.opacity = 1;
        }
      }
      if (tower.rotation.y > DEG_90) tower.rotation.y = -DEG_90;
      if (tower.rotation.y < 0) tower.rotation.y += towerSpinSpeed;
      break;

    case "drop2":
      if (tower.rotation.y < DEG_90) tower.rotation.y += towerSpinSpeed;
      break;

    case "drop3":
      if (tower.rotation.y < DEG_90 * 2) tower.rotation.y += towerSpinSpeed;
      break;

    case "drop4":
      if (tower.rotation.y < DEG_90 * 3) tower.rotation.y += towerSpinSpeed;
      break;
  }

  // update cube
  cube.rotation.y += cubeRotationSpeed;
  cube.position.y -= cubeFallingSpeed * delta;
  cubeFallingSpeed += gravity;

  // cube has landed on tower
  if (cube.position.y < CUBE_STOP_Y) {
    // console.log({ cubeFallingSpeed, gravity, delta });
    // TODO instead of adding cubes as children, create a mesh of the tower
    // with each cube during the initialization phase, and just set which
    // is visible based on phase.

    const newCube = cube.clone();
    tower.add(newCube);
    newCube.position.y = TOWER_HEIGHT / 2 + HALF_CUBE_SIZE;
    newCube.rotation.y = 0;
    switch (PHASES[currentPhase]) {
      case "drop1":
        break;
      case "drop2":
        newCube.position.z -= 1;
        break;
      case "drop3":
        newCube.position.z -= 1;
        newCube.position.x += 1;
        break;
      case "drop4":
        newCube.position.x += 1;
        // towerNeedsToDrop = true;
        towerNeedsToStartDrop = true;
        break;
    }

    // reset falling cube
    cube.position.y = CUBE_START_Y;
    cube.rotation.y = CUBE_START_ROTATION;
    cubeFallingSpeed = 0;

    if (++currentPhase >= PHASES.length) currentPhase = 0;
  }
  renderer.render(scene, camera);
};
animate();
