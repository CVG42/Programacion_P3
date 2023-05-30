import './App.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { color } from 'three/examples/jsm/nodes/Nodes.js';

function doThreeJS(){
 
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

  //Color fondo
  scene.background = new THREE.Color(0.8,0.5,0.9); //new THREE.Color( 'skyblue' );

  /*
  //Luz direccional
  const light = new THREE.DirectionalLight(0xffffff,0.6);
  light.position.set(0,4,2);
  scene.add(light);
  light.castShadow = true;
  //light.shadow.camera.right = 12; 

  //helper luz direccional
  const lightHelper = new THREE.DirectionalLightHelper(light,5);
  scene.add(lightHelper);
  
  //Helper camara sombra
  const LightShadowHelper = new THREE.CameraHelper(light.shadow.camera);
  scene.add(LightShadowHelper);*/
  
  //luz de punto o cono
  const spotlight = new THREE.SpotLight(0xffffff);
  scene.add(spotlight)
  spotlight.position.set(-10,30,0)
  spotlight.castShadow = true;
  spotlight.angle = Math.PI/3;

  //spotlight helper
  const spotlightHelper = new THREE.SpotLightHelper(spotlight);
  scene.add(spotlightHelper)

  //Luz ambiental
  const ambientLight = new THREE.AmbientLight(0x99aaff,1);
  scene.add(ambientLight);

  //Grid Helper
  /*const gridHelper = new THREE.GridHelper(10,5);
  scene.add(gridHelper)*/

  //Fog
  scene.fog = new THREE.Fog(0xe7bcf3,0,100)


  const renderer = new THREE.WebGLRenderer();
  renderer.toneMapping = THREE.ACESFilmicToneMapping; //opciones aestethic cambia tono
  renderer.outputColorSpace = THREE.SRGBColorSpace; //opciones aestethic bloom con colorcito
  renderer.setPixelRatio(window.devicePixelRatio); //opciones aestethic antialiasing
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.shadowMap.enabled = true;

  const controls = new OrbitControls( camera, renderer.domElement );

  document.body.appendChild( renderer.domElement );

  const geometry = new THREE.BoxGeometry( 1, 1, 1 );
  const material = new THREE.MeshPhongMaterial( { color: 0xffffff } );
  const cube = new THREE.Mesh( geometry, material );
  scene.add( cube );
  cube.castShadow = true;
  cube.position.x = 5;

  const material2 = new THREE.MeshPhongMaterial( { color: 0xaabbcc } );
  const cube2 = new THREE.Mesh( geometry, material2 );
  cube2.castShadow = true;
  cube2.position.y = 3;
  cube2.scale.set(2,2,2);
  scene.add( cube2 );

  const planeGeometry = new THREE.PlaneGeometry(20,20,10,10);
  const planeMaterial = new THREE.MeshPhongMaterial({color: 0x3399bb, side: THREE.DoubleSide})
  const plane = new THREE.Mesh(planeGeometry,planeMaterial)
  scene.add(plane)
  plane.position.y = -5;
  plane.rotateX(-90 * (Math.PI/180))
  plane.receiveShadow = true;
  

  camera.position.z = 5;

  const gui = new dat.GUI();
  
  const options = {
    colorCubo: '#ffffff',
    angle: Math.PI/3,
    penumbra: 0.5,
    intensity: 1,
    wireframe: false
  }

  gui.add(options,'angle',0,Math.PI/2);
  gui.add(options,'penumbra',0,1);
  gui.add(options,'intensity',0,1);
  gui.addColor(options,'colorCubo').onChange(function(e){
    cube.material.color.set(e);
  });
  gui.add(options,'wireframe').onChange(function(e){
    plane.material.wireframe = e
  })

  const mousePos = new THREE.Vector2();

  //Raycasting
  window.addEventListener('mousemove',function(e){
    mousePos.x = (e.clientX/window.innerWidth) * 2 -1;
    mousePos.y = - (e.clientY/window.innerHeight) * 2 + 1
  })

  const rayCaster = new THREE.Raycaster();

  const cubeId = cube.id;
  cube.name = 'cubitoDubidu'
  let loaded = false;

  setTimeout(() => {
    console.log("loaded") 
    loaded=true
    //cube2.add(cube) //No respeta la transformación local
    cube2.attach(cube)
  }, 1500);

  setTimeout(() => {
    console.log("loaded") 
    scene.attach(cube)
  }, 3000);

  const clock = new THREE.Clock();
  let delta = 0;
  let time = 0;

  function animate() { //loop del juego
    requestAnimationFrame( animate );

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    spotlight.angle = options.angle;
    spotlight.penumbra = options.penumbra;
    spotlight.intensity = options.intensity;
    spotlightHelper.update();

    if (loaded) {
      rayCaster.setFromCamera(mousePos,camera);
      const intersects = rayCaster.intersectObjects(scene.children);
      //console.log(intersects)

      for (let i = 0; i < intersects.length; i++) {
        if (intersects[i].object.name == 'cubitoDubidu') {
          const cuboide = intersects[i].object;
          cuboide.material.color.set(0xFF0000)
        }
      
      }
    }

    delta = clock.getDelta();
    time += delta;

    cube2.position.set(Math.sin(time) * 6,3,0)
    renderer.render( scene, camera );
  }


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