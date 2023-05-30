
import './App.css'
import * as THREE from 'three';
import * as CANNON from 'cannon';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'


function doThreeJS(){
 
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

  //Color fondo
  scene.background = new THREE.Color(0.8,0.5,0.9); //new THREE.Color( 'skyblue' );

  //Luz direccional
  const light = new THREE.DirectionalLight(0xffffff,0.6);
  light.position.set(0,4,2);
  scene.add(light);
  light.castShadow = true;
  
  //Luz ambiental
  const ambientLight = new THREE.AmbientLight(0x99aaff,1);
  scene.add(ambientLight);


  const renderer = new THREE.WebGLRenderer();
  //renderer.toneMapping = THREE.ACESFilmicToneMapping; //opciones aestethic
  //renderer.outputColorSpace = THREE.SRGBColorSpace; //opciones aestethic
  //renderer.setPixelRatio(window.devicePixelRatio); //opciones aestethic
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.shadowMap.enabled = true;

  const controls = new OrbitControls( camera, renderer.domElement );

  document.body.appendChild( renderer.domElement );

  //CUBO
  const geometry = new THREE.BoxGeometry( 1, 1, 1 );
  const material = new THREE.MeshPhongMaterial( { color: 0xffffff } );
  const cube = new THREE.Mesh( geometry, material );
  cube.castShadow = true;
  scene.add( cube );

  //PLANO
  const planoGeometry = new THREE.PlaneGeometry(25,25,5,5);
  const planoMaterial = new THREE.MeshPhongMaterial({
    color:0x339944, 
    wireframe:false, 
    side:THREE.DoubleSide
  });
  const planoMesh = new THREE.Mesh(planoGeometry,planoMaterial);
  //planoMesh.rotateX(-90 * (Math.PI/180));
  scene.add(planoMesh);  
  planoMesh.receiveShadow = true;

  camera.position.z = 5;
  camera.position.y = 2;
  controls.update();

  //ESFERA DINAMICO
  const esferaGeo = new THREE.SphereGeometry(2);
  const esferaMat = new THREE.MeshPhongMaterial({
    color: 0xeebb77,
    wireframe: false
  });
  const esfeMesh = new THREE.Mesh(esferaGeo,esferaMat);
  scene.add(esfeMesh);
  esfeMesh.castShadow=true;

  //MUNDO DE FISICAS
  const world = new CANNON.World();
  world.gravity = new CANNON.Vec3(0,-9.81,0);

  //PISO
  const pisoPhysicsMaterial = new CANNON.Material("ice");
  const pisoBody = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(12.5,12.5,0.1)),
    //mass: 0,
    type: CANNON.Body.STATIC,
    material: pisoPhysicsMaterial
  })

  world.addBody(pisoBody);

  const cuboPhysicsMat = new CANNON.Material("cubo");

  //CUBO DINAMICO
  const cuboBody = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Box(new CANNON.Vec3(0.5,0.5,0.5)),
    position: new CANNON.Vec3(0,15,0),
    material: cuboPhysicsMat
  })
  
  world.addBody(cuboBody);
  cuboBody.angularVelocity.set(0,-15,0);
  //cuboBody.angularDamping = 0.3;

  const pisoCuboPhysicsMat = new CANNON.ContactMaterial(
    pisoPhysicsMaterial,cuboPhysicsMat,
    {restitution: 1}
  )

  world.addContactMaterial(pisoCuboPhysicsMat);

  //ESFERA DINAMICA
  const esferaBody = new CANNON.Body({
    mass: 10,
    shape: new CANNON.Sphere(2),
    position: new CANNON.Vec3(0.2,5,0)
  })

  world.addBody(esferaBody);
  esferaBody.linearDamping = 0.3;

  const physicsStep = 1/60;

  function animate() {
    world.step(physicsStep);
    //requestAnimationFrame( animate );

    planoMesh.position.copy(pisoBody.position);
    planoMesh.quaternion.copy(pisoBody.quaternion);

    cube.position.copy(cuboBody.position);
    cube.quaternion.copy(cuboBody.quaternion);

    esfeMesh.position.copy(esferaBody.position);
    esfeMesh.quaternion.copy(esferaBody.quaternion);

    renderer.render( scene, camera );
  }

  pisoBody.quaternion.setFromEuler(-90 * Math.PI/180,0,0);

  renderer.setAnimationLoop(animate);


  window.addEventListener( 'resize', onWindowResize, false );
  
  function onWindowResize(){ //funcion para redimensionar ventana si el usuario le anda moviendo
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
  }
  
  animate(); //Iniciamos el loop
}





const App = () => {

  return (
    <>
      <div id="info">Buenas</div>
      <div className='App'>{doThreeJS()}</div>       
    </>
  )
}

export default App

