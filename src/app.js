import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import * as dat from 'lil-gui'

// Scene and  Camera
const gui = new dat.GUI();
const scene = new THREE.Scene();
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
camera.position.z = 3;
scene.add(camera);
const canvas = document.getElementById('c');

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update rendrer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})
// window.addEventListener('dblclick', () => {
//     if (!document.fullscreenElement) {
//         canvas.requestFullscreen()
//     } else {
//         document.exitFullscreen()
//     }
// })

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enabled = false;

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap



// Lights   
const light2 = new THREE.DirectionalLight(0xffffff)
scene.add(light2)
light2.castShadow = true
const light3 = new THREE.AmbientLight()
scene.add(light3)
light3.intensity = 2.1

// Environment
const cubeTextureLoader = new THREE.CubeTextureLoader()
const envMapTex = cubeTextureLoader.load([
    '/env/px.png',
    '/env/nx.png',
    '/env/py.png',
    '/env/ny.png',
    '/env/pz.png',
    '/env/nz.png'
]);
// scene.background = envMapTex;
scene.environment = envMapTex;


// Models
let video = document.getElementById('video');
video.play();
const videoTexture = new THREE.VideoTexture(video);

videoTexture.minFilter = THREE.LinearFilter;
videoTexture.magFilter = THREE.LinearFilter;
videoTexture.format = THREE.RGBAFormat;
videoTexture.wrapS = videoTexture.wrapT = THREE.RepeatWrapping
videoTexture.offset.set( 0, 0 );
videoTexture.repeat.set( .5, .5 );

const material = new THREE.MeshBasicMaterial({ map: videoTexture });

// GLTF
const lamboLoader = new GLTFLoader()
lamboLoader.load('/scene.gltf',
(gltf)=>{


	scene.add(gltf.scene)
    const material = new THREE.MeshBasicMaterial({ map: videoTexture });

	// gltf.scene.position.set(5, 1.15, 0.7)
    // gltf.scene.rotation.set(0.4, -7, 0)

    gltf.scene.position.set(5, 0.6, 0.8)
    gltf.scene.rotation.set(6.976, -3.1, 0)

	// gltf.scene.envMap = envMapTex;
	// gltf.scene.envMapIntensity = .4;
	// gltf.scene.traverse( function( child ) { if ( child instanceof THREE.Mesh ) { child.material = material; } } );
    gltf.scene.scale.set(0.1, 0.1, 0.1)

    // gui.add(gltf.scene.position,'x').min(-50).max(50).step(0.001);
    // gui.add(gltf.scene.position,'y').min(-50).max(50).step(0.001);
    // gui.add(gltf.scene.position,'z').min(-50).max(50).step(0.001);

    // gui.add(gltf.scene.rotation,'x').min(-50).max(50).step(0.001).name('rot x');
    // gui.add(gltf.scene.rotation,'y').min(-50).max(50).step(0.001).name('rot y');
    // gui.add(gltf.scene.rotation,'z').min(-50).max(50).step(0.001).name('rot z');

    const fx = -1.1
    const fy = 1.15
    const fz = 0.7

    const clock2 = new THREE.Clock();
    
    
    const runcar = () => {

        if(gltf.scene.position.x >= fx){
            // const elapsedtime2 = clock.getElapsedTime()
            // console.log(elapsedtime2);

            gltf.scene.position.x -= .05
            // gltf.scene.position.y -= .1
            // gltf.scene.position.z += 1
            // console.log(gltf.scene.position);
            setTimeout(runcar,25);
        }
    }
    runcar();
})


// Fonts
function lamboFont() {
    const fontLoader = new FontLoader();
    fontLoader.load(
        '/fonts/gentilis_bold.typeface.json',
        (font) => {
            const textGeometry = new TextGeometry(
                'Lambourgini',
                {
                    font: font,
                    size: 0.5,
                    height: 0.01,
                    curveSegments: 12,
                    bevelEnabled: false,
                    bevelThickness: 0.03,
                    bevelSize: 0.02,
                    bevelOffset: 0,
                    bevelSegments: 5
                }
            )
            const textMaterial = new THREE.MeshBasicMaterial()
            const text = new THREE.Mesh(textGeometry, material)
            scene.add(text)
            text.position.set(-2, 1, 1)
            // text.rotation.set(0, -0.5, 0)

            // gui.add(text.rotation,'y').min(-50).max(50).step(0.001).name('text')

        }
    )
}
// setTimeout(lamboFont, 5400)
lamboFont();











// Time
const clock = new THREE.Clock()
const cursor = {
    x: 0,
    y: 0
}
window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - .5
    cursor.y = - (event.clientY / sizes.height - .5)
})
const tick = () => {
    const elapsedtime = clock.getElapsedTime()


    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        videoTexture.needsUpdate = true;
    }


    // Update controls
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}
tick();
