import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import GUI from 'lil-gui';
import wheelURL from '../cad_out/wheel.glb?url'

//const {Structure3D} = require('FIK');

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//===CAMERA, CONTROLS===
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
const controls = new OrbitControls( camera, renderer.domElement );
camera.position.set( 0, 2, 5 );
controls.update();

//===GUI===

const gui = new GUI();
const settings = {
    run: true,
    speed: 0.01,
    reverser: 1,
    resetView() {
        controls.reset();
        camera.position.set( 0, 2, 5 );
    }
};
gui.add(settings, 'run').name('Run');
gui.add(settings, 'speed', -0.1, 0.1, 0.01).name('Speed');
gui.add(settings, 'reverser', -1, 1, 0.1).name('Reverser position');
gui.add(settings, 'resetView').name('Reset view');

//===LIGHTING===

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 3);
directionalLight.position.set(-1, 2, 4);
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
scene.add(ambientLight);

//load meshes
const loader = new GLTFLoader();
var wheel;
loader.load(wheelURL, function(gltf) {
    scene.add(gltf.scene);
    wheel = gltf.scene;
}, gltfOnProgress, gltfOnError);

// called when the resource is loaded
function gltfOnLoad(gltf, name) {
    scene.add( gltf.scene );

		gltf.animations; // Array<THREE.AnimationClip>
		gltf.scene; // THREE.Group
		gltf.scenes; // Array<THREE.Group>
		gltf.cameras; // Array<THREE.Camera>
		gltf.asset; // Object
        console.log(meshName);
    window[meshName] = gltf.scene;
}

// called while resource loading is progressing
function gltfOnProgress(xhr) {
    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
}

// called when resource loading has errors
function gltfOnError(error) {
    console.log( 'An error happened' );
}

function animate() {
    if (settings.run) {
        if (wheel) {
            wheel.rotation.z -= settings.speed;
        }
    }

	//Required to reset position properly after "Reset camera" button is pressed
	controls.update();

	renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );