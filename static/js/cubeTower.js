const { innerWidth, innerHeight } = window;

// const LINE_COLOR = 0x333344;
const LINE_COLOR = 0xbbbbbb;

const scene = new THREE.Scene();
const perspectiveCamera = new THREE.PerspectiveCamera(
  75,
  innerWidth / innerHeight,
  0.1,
  1000
);
const orthographicCamera = new THREE.OrthographicCamera(
  innerWidth / -300,
  innerWidth / 300,
  innerHeight / 300,
  innerHeight / -300,
  0.1,
  1000
);
const camera = perspectiveCamera;
// const camera = orthographicCamera;
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setClearColor(0xffffff, 0);
document.getElementById("cubeTower").appendChild(renderer.domElement);

const cubeGeometry = new THREE.BoxGeometry();
const cubeEdgeGeometry = new THREE.EdgesGeometry(cubeGeometry);
const cubeLine = new THREE.LineSegments(
  cubeEdgeGeometry,
  new THREE.LineBasicMaterial({ color: LINE_COLOR })
);
scene.add(cubeLine);
/*
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(cubeEdgeGeometry, material);
scene.add(cube);
*/
camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);
  cubeLine.rotation.x += 0.005;
  cubeLine.rotation.y += 0.005;
  renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", onWindowResize, false);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}
