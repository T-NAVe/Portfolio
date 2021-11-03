import './style.css'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

window.addEventListener('resize', onWindowResize);
let width = window.innerWidth;
let height = window.innerHeight
let bufferValue = 8;
let bufferValue2 = 8;
// to start we will allways need 3 objects
// Scene, Camera and Renderer

//scene == container
const scene = new THREE.Scene()

//the first argument is FOV and the second argument is the aspect ratio the third argument is the view frustum wich control wich objects are visible relative to the camera

const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 3000);

//instantiate the renderer and asign the canvas to it.
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg')
});
//set pixel ratio to the device pixel ratio
renderer.setPixelRatio(window.devicePixelRatio);
//make it full screen by setting the renderer size to the window size
renderer.setSize(window.innerWidth, window.innerHeight);
//by default camera starts at the middle of the scene
camera.position.setZ(10);

//objects

const loader = new GLTFLoader()

loader.load('models/doom/scene.gltf', (gltf) => {
  let model = gltf.scene
  model.position.setX(323);
  model.position.setZ(22.3);
  model.position.setY(-12);
  model.scale.set(0.1, 0.1, 0.1);
  model.up.set(0.0, 0.0, 1.0)
  scene.add(model);
  gltf.scene.rotateY(THREE.Math.degToRad(90))
}, undefined, (error) => {

  console.error(error);

});




//add lights
const pointLight = new THREE.PointLight(0x0000ff);
pointLight.position.setY(1)
const pointLight1 = new THREE.PointLight(0x0000ff);
pointLight1.position.setY(2)
pointLight1.position.setX(3)
const pointLight2 = new THREE.PointLight(0x0000ff);
pointLight2.position.setX(-3)
pointLight2.position.setY(2)


const ambientLight = new THREE.AmbientLight(0xffffff);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.setZ(15)
directionalLight.position.setX(8)
scene.add(pointLight, pointLight1, pointLight2, ambientLight, directionalLight);


const lightHelper = new THREE.PointLightHelper(pointLight);
const lightHelper1 = new THREE.PointLightHelper(pointLight1);
const lightHelper2 = new THREE.PointLightHelper(pointLight2);
const lightHelper3 = new THREE.PointLightHelper(directionalLight);
const gridHelper = new THREE.GridHelper(200, 50);
//scene.add(lightHelper,lightHelper1 ,lightHelper2, gridHelper,lightHelper3);

//add controls for better development
const controls = new OrbitControls(camera, renderer.domElement);

//background
const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture

//Avatar
const avatarTexture = new THREE.TextureLoader().load('pp.jpg');
const avatar = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshPhongMaterial({
    map: avatarTexture,
    specular: 0x050505,
    shininess: 300

  })
)
avatar.position.setY(3)
scene.add(avatar)


//set animation loop to call the render method
function animate() {
  requestAnimationFrame(animate);
  avatar.rotation.y += 0.003

  controls.update()

  renderer.render(scene, camera)
}
animate()

function onWindowResize() {

  width = window.innerWidth;
  height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);

}
function moveCamera() {
  const top = document.body.getBoundingClientRect().top;
  camera.position.z = 10 + (top * -0.055)

  if (camera.position.z >= 50 && camera.position.z <= 91 && camera.position.y >= -11.40 && bufferValue > document.body.getBoundingClientRect().top) {
    camera.position.y += -0.3
    bufferValue = document.body.getBoundingClientRect().top;
  }
  if (camera.position.z >= 50 && camera.position.z <= 80 && bufferValue < document.body.getBoundingClientRect().top) {
    camera.position.y += 0.3
    bufferValue = document.body.getBoundingClientRect().top;
  }
  if (camera.position.z < 44) {
    camera.position.y = 0
  }
  if (camera.position.z > 91) {
    camera.position.y = -11.699999999999992
  }
}
document.getElementById('body').onscroll = () => {
  moveCamera()
};
