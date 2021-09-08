const ANTIALIAS = false;

const LINE_COLOR = 0x777799;

const CUBE_COLOR = LINE_COLOR;
const TOWER_COLOR = LINE_COLOR;

const GRAVITY = 0.0004 * 150;
// TODO get from screen pixel to ensure offscreen

const TOWER_SPIN_SPEED = 0.014 * 150;
const TOWER_DROP_SPEED = 1.5;
const TOWER_TOP = -1;
const TOWER_HEIGHT = 5;
const TOWER_POSITION_Y = TOWER_TOP - TOWER_HEIGHT / 2;

const CUBE_SIZE = 1;
const HALF_CUBE_SIZE = CUBE_SIZE / 2;
const CUBE_START_Y = 5;
const CUBE_STOP_Y = TOWER_TOP + HALF_CUBE_SIZE;
const CUBE_ROTATION_SPEED = 1.35;
const CUBE_START_ROTATION = 0;

const DEG_90 = Math.PI / 2;

const CUBE_MATERIAL = new THREE.LineBasicMaterial({ color: CUBE_COLOR });
const LINE_MATERIAL = new THREE.LineBasicMaterial({ color: LINE_COLOR });

const PHASES = ["drop1", "drop2", "drop3", "drop4"];

var currentPhase = 0;
var towerNeedsToDrop = false;

const scene = new THREE.Scene();
const clock = new THREE.Clock();

const domRoot = document.getElementById("cube-tower");

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
// renderer.setSize(window.innerWidth, window.innerHeight);
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
  // camera.aspect = window.innerWidth / window.innerHeight;
  camera.aspect = domRoot.offsetWidth / domRoot.offsetHeight;
  camera.updateProjectionMatrix();
  // renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setSize(domRoot.offsetWidth, domRoot.offsetHeight);
};
// initialize resize listener
window.addEventListener("resize", onResize, false);
onResize();

let animationFramesBetweenRenderFrames = 0;

// run
const animate = () => {
  requestAnimationFrame(animate);

  // TODO use delta time, going to require updating all animation values unfortunately
  // it's consistently around 0.007 on desktop
  const delta = clock.getDelta();

  const towerSpinSpeed = TOWER_SPIN_SPEED * delta;
  const towerDropSpeed = TOWER_DROP_SPEED * delta;
  const cubeRotationSpeed = CUBE_ROTATION_SPEED * delta;
  const gravity = GRAVITY * delta;

  switch (PHASES[currentPhase]) {
    case "drop1":
      if (towerNeedsToDrop) {
        tower.position.y -= towerDropSpeed;
        if (tower.position.y <= TOWER_POSITION_Y - 1) {
          towerNeedsToDrop = false;
          tower.remove(...tower.children);
          tower.position.y = TOWER_POSITION_Y;
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
  cube.position.y -= cubeFallingSpeed;
  cubeFallingSpeed += gravity;

  // cube has landed on tower
  if (cube.position.y < CUBE_STOP_Y) {
    cube.position.y = CUBE_START_Y;
    cube.rotation.y = CUBE_START_ROTATION;
    cubeFallingSpeed = 0;

    // TODO instead of adding cubes as children, create a mesh of the tower
    // with each cube during the initialization phase, and just set which
    // is visible based on phase.

    const newCube = cube.clone();
    tower.add(newCube);
    newCube.position.y = TOWER_HEIGHT / 2 + HALF_CUBE_SIZE;
    switch (PHASES[currentPhase]) {
      case "drop1":
        console.log("DROP1:", newCube.position);
        break;
      case "drop2":
        newCube.position.z -= 1;
        console.log("DROP2:", newCube.position);
        break;
      case "drop3":
        newCube.position.z -= 1;
        newCube.position.x += 1;
        console.log("DROP3:", newCube.position);
        break;
      case "drop4":
        newCube.position.x += 1;
        towerNeedsToDrop = true;
        console.log("DROP4:", newCube.position);
        break;
    }

    if (++currentPhase >= PHASES.length) currentPhase = 0;
  }
  renderer.render(scene, camera);
};
animate();
