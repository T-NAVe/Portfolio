// preload images
import doom1 from '/Doom01.png'
import doom2 from '/Doom02.png'
import doom3 from '/Doom03.png'
import doom4 from '/Doom04.png'
import doom5 from '/Doom05.png'

import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const image = new Image();
const $body = document.querySelector("#body")
const $loading = document.querySelector('.loading')
const $bar = document.querySelector('.bar')
const $dooom = document.querySelector("#doom").getContext("2d")
const $main = document.querySelector('main')

// TODO: Fix - doesn't work for some reason
window.scrollTo(0, 0);

image.onload = () => {
  $dooom.drawImage(image, 0, 0);
}
image.src = doom5;
image.src = doom4;
image.src = doom3;
image.src = doom2;
image.src = doom1;

window.addEventListener('resize', onWindowResize);
let width = window.innerWidth;
let height = window.innerHeight
let bufferValue = 8;
// to start we will allways need 3 objects
// Scene, Camera and Renderer
const objectURLs = []
const loadingManager = new THREE.LoadingManager();

loadingManager.setURLModifier( ( url ) => {
	objectURLs.push( url )
	return url
} )

loadingManager.onProgress = function (url, itemsLoaded, itemsTotal) {

  const percentage = Math.floor(itemsLoaded * 100 / itemsTotal)
  
  $bar.style.width = `${percentage}%`
  // check if percentage is a multiple of 20. pertage may not be exactly 20 so we need to check if it is close to 20
  if (percentage % 20 <= 3) {
    const doom = Math.floor(Math.random() * 5) + 1
    image.src = `/Doom0${doom}.png`
  }

  // if percentage 100% hide the loading screen and overflow the body
  if (percentage === 100) {
    setTimeout(() => {
      $bar.style.width = '100%'
      $loading.style.transition = 'opacity 0.3s ease-in-out'
      $loading.style.opacity = '0'
      $body.style.overflow = 'auto';
    }, 200)
  }  
}

loadingManager.onLoad = function ( ) {
  setTimeout(() => {
    $loading.style.display = 'none'
    $main.style.visibility = 'visible'
  }, 500)
}

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

const loader = new GLTFLoader( loadingManager )

loader.load('models/doom/scene.gltf', (gltf) => {
  const model = gltf.scene
  model.position.setX(323);
  model.position.setZ(22.3);
  model.position.setY(-12);
  model.scale.set(0.1, 0.1, 0.1);
  model.up.set(0.0, 0.0, 1.0)
  scene.add(model);
  gltf.scene.rotateY(THREE.Math.degToRad(90))
  objectURLs.forEach( ( url ) => URL.revokeObjectURL( url ) )
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


//background
const spaceTexture = new THREE.TextureLoader(loadingManager).load('space.jpg');
scene.background = spaceTexture

//Avatar
const avatarTexture = new THREE.TextureLoader(loadingManager).load('pp.jpg');
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

  const scrollPercentage = (window.scrollY * 100 / (document.querySelector('main').clientHeight - window.innerHeight))/100
  const cameraPercentage = 354 * scrollPercentage + 8; //max position * percentage + min position.
  camera.position.z = cameraPercentage;
  // this handlers tryes to navigate the camera trough the stairs, that's why it has some hardcoded values
  if (camera.position.z >= 50 && camera.position.z <= 91 && camera.position.y >= -11.40 && bufferValue > document.body.getBoundingClientRect().top) {
    if(camera.position.y -0.3 < -11.699999999999992 ){
      return
    }else{
      camera.position.y += -0.3
      bufferValue = document.body.getBoundingClientRect().top;
    }
  }
  if (camera.position.z >= 50 && camera.position.z <= 80 && bufferValue < document.body.getBoundingClientRect().top) {
    if(camera.position.y + 0.3 > 0){
      return
    }else{
      camera.position.y += 0.3
      bufferValue = document.body.getBoundingClientRect().top;
    }
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
