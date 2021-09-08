const LINE_COLOR = 0xbbbbbb;

// const CUBE_COLOR = 0x333344;
const CUBE_COLOR = LINE_COLOR;
const TOWER_COLOR = LINE_COLOR;

const GRAVITY = 0.0004;
// TODO get from screen pixel to ensure offscreen

const TOWER_SPIN_SPEED = 0.014;
const TOWER_DROP_SPEED = 0.01;
const TOWER_TOP = -1;
const TOWER_HEIGHT = 5;
const TOWER_POSITION_Y = TOWER_TOP - TOWER_HEIGHT / 2;

const CUBE_SIZE = 1;
const HALF_CUBE_SIZE = CUBE_SIZE / 2;
const CUBE_START_Y = 5;
const CUBE_STOP_Y = TOWER_TOP + HALF_CUBE_SIZE;
const CUBE_ROTATION_SPEED = 0;

const DEG_90 = Math.PI / 2;

const CUBE_MATERIAL = new THREE.LineBasicMaterial({ color: CUBE_COLOR });
const LINE_MATERIAL = new THREE.LineBasicMaterial({ color: LINE_COLOR });

const PHASES = ["drop1", "drop2", "drop3", "drop4"];
var currentPhase = 0;
var towerNeedsToDrop = false;

const scene = new THREE.Scene();

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
const renderer = new THREE.WebGLRenderer({ alpha: true });
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

// run
const animate = () => {
  requestAnimationFrame(animate);

  switch (PHASES[currentPhase]) {
    case "drop1":
      if (towerNeedsToDrop) {
        tower.position.y -= TOWER_DROP_SPEED;
        if (tower.position.y <= TOWER_POSITION_Y - 1) {
          towerNeedsToDrop = false;
          tower.remove(...tower.children);
          tower.position.y = TOWER_POSITION_Y;
        }
      }
      if (tower.rotation.y > DEG_90) tower.rotation.y = -DEG_90;
      if (tower.rotation.y < 0) tower.rotation.y += TOWER_SPIN_SPEED;
      break;
    case "drop2":
      if (tower.rotation.y < DEG_90) tower.rotation.y += TOWER_SPIN_SPEED;
      break;
    case "drop3":
      if (tower.rotation.y < DEG_90 * 2) tower.rotation.y += TOWER_SPIN_SPEED;
      break;
    case "drop4":
      if (tower.rotation.y < DEG_90 * 3) tower.rotation.y += TOWER_SPIN_SPEED;
      break;
  }

  // update cube
  cube.rotation.y += CUBE_ROTATION_SPEED;
  cube.position.y -= cubeFallingSpeed;
  cubeFallingSpeed += GRAVITY;
  if (cube.position.y < CUBE_STOP_Y) {
    // console.log(PHASES[currentPhase]);
    cube.position.y = CUBE_START_Y;
    cubeFallingSpeed = 0;

    const newCube = cube.clone();
    tower.add(newCube);
    newCube.position.y = TOWER_HEIGHT / 2 + HALF_CUBE_SIZE;
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
        towerNeedsToDrop = true;
        break;
    }

    if (++currentPhase >= PHASES.length) currentPhase = 0;
  }
  renderer.render(scene, camera);
};
animate();
