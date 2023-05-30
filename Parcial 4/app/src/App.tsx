import './App.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

function doThree()
{
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  //Controls
  const controls = new OrbitControls(camera, renderer.domElement);

  const geometry = new THREE.BoxGeometry( 1, 1, 1 );
  //const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  const material = new THREE.MeshPhongMaterial({color:0xffffff});
  const cube = new THREE.Mesh( geometry, material );
  scene.add( cube );

  scene.background = new THREE.Color(0.8,0.5,0.9);

  const planeGeometry = new THREE.PlaneGeometry(20,20,1,1);
  const blackMaterial = new THREE.MeshPhongMaterial({color:0x333333, side: THREE.DoubleSide, wireframe: false});
  const plane = new THREE.Mesh(planeGeometry,blackMaterial);
  plane.position.y = -5;
  plane.rotateX(-90 * (Math.PI/180));

  scene.add(plane);

  camera.position.z = 10;
  camera.position.y = 5;
  controls.update();

  //LUZ DIRECCIONAL
  const light = new THREE.DirectionalLight(0xffffff, 0.6);
  light.position.set(0,4,2);
  scene.add(light);

  //LUZ AMBIENTAL
  const ambientLight = new THREE.AmbientLight(0x99aaff,1);
  scene.add(ambientLight);

  const spaceShipTexture = new THREE.TextureLoader().load('modelos/Spaceship_albedo_RojoPuro.png' ); 
    // immediately use the texture for material creation 
  const spaceShipMat = new THREE.MeshPhongMaterial( { map:spaceShipTexture } );

  let spaceShip: THREE.Mesh;

  const fbxLoader = new FBXLoader();
  fbxLoader.load(
    'modelos/Spaceship.fbx',
      (object: any) => {
        object.traverse(function (child: THREE.Mesh<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.Material | THREE.Material[]>) {
            if ((child as THREE.Mesh).isMesh) {
                (child as THREE.Mesh).material = spaceShipMat
                if ((child as THREE.Mesh).material) {
                    ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).transparent = false
                }
            }
        })
        // object.scale.set(.01, .01, .01)
        spaceShip = object;
        scene.add(spaceShip);
        spaceShip.scale.set(0.5,0.5,0.5);
        spaceShip.position.set(-5,-5,-5);
    },
    (xhr:any) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error:any) => {
        console.log(error)
    }
  )

  function animate() {
    requestAnimationFrame( animate );

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    if(spaceShip != undefined || spaceShip != null)
    {
      spaceShip.translateZ(0.01);
    }

    controls.update();

    renderer.render( scene, camera );
  }

  animate();

  window.addEventListener( 'resize', onWindowResize, false );
  
  function onWindowResize(){ //funcion para redimensionar ventana si el usuario le anda moviendo
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
  }
}

function App() {

  return (
    <>
      <div>
        {doThree()}
      </div>
    </>
  )
}

export default App
