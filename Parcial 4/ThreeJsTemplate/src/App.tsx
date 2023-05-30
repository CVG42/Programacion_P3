
import './App.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import * as dat from 'dat.gui';

function doThreeJS(){
 
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

  //Color fondo
  scene.background = new THREE.Color(0.8,0.5,0.9); //new THREE.Color( 'skyblue' );

  /*
  //Luz direccional
  const dLight = new THREE.DirectionalLight(0xffffff,0.6);
  dLight.position.set(0,4,2);
  scene.add(dLight);
  dLight.castShadow = true; //para habilitar sombras
  dLight.shadow.camera.right = 12;

  //helper luz direccional
  const dLightHelper = new THREE.DirectionalLightHelper(dLight,5);
  scene.add(dLightHelper);

  //Helper camara sombra
  const dLightShadowHelper = new THREE.CameraHelper(dLight.shadow.camera);
  scene.add(dLightShadowHelper);
*/

  //LUZ DE PUNTO O CONO
  const spotlight = new THREE.SpotLight(0xffffff);
  scene.add(spotlight);
  spotlight.position.set(-10,30,0);
  spotlight.castShadow = true;
  spotlight.angle = Math.PI/3;

  const spLightHelper = new THREE.SpotLightHelper(spotlight);
  scene.add(spLightHelper);

  //Luz ambiental
  const ambientLight = new THREE.AmbientLight(0x99aaff,1);
  scene.add(ambientLight);

  const gridHelper = new THREE.GridHelper(10,10);
  scene.add(gridHelper);

  scene.fog = new THREE.Fog(0xe7bcf3,5,50)


  const renderer = new THREE.WebGLRenderer();
  renderer.toneMapping = THREE.ACESFilmicToneMapping; //opciones aestethic
  renderer.outputColorSpace = THREE.SRGBColorSpace; //opciones aestethic
  renderer.setPixelRatio(window.devicePixelRatio); //opciones aestethic
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.shadowMap.enabled = true;

  const controls = new OrbitControls( camera, renderer.domElement );

  document.body.appendChild( renderer.domElement );

  const geometry = new THREE.BoxGeometry( 1, 1, 1 );
  const material = new THREE.MeshPhongMaterial( { color: 0xffffff } );
  const cube = new THREE.Mesh( geometry, material );
  scene.add( cube );
  cube.position.x = 5;

  cube.castShadow = true;

  const planeGeometry = new THREE.PlaneGeometry(20,20,10,10);
  const planeMaterial = new THREE.MeshPhongMaterial({color:0x3399bb});
  const plane = new THREE.Mesh(planeGeometry,planeMaterial);
  scene.add(plane);
  plane.position.y = -5;
  plane.rotateX(-90*(Math.PI/180));
  plane.receiveShadow = true;
  
  camera.position.z = 5;

  const gui = new dat.GUI();
  const options = {
    colorCubo: '#ffffff',
    angle : Math.PI/3,
    penumbra: 0.5,
    intensity: 1,
    wireframe: false
  }

  gui.add(options, 'angle', 0, Math.PI/2);
  gui.add(options, 'penumbra', 0, 1);
  gui.add(options, 'intensity', 0, 1);
  gui.addColor(options, 'colorCubo').onChange((e)=>{
    cube.material.color.set(e);
  });
  gui.add(options,'wireframe').onChange((e)=>{
    plane.material.wireframe = e;
  });

  const mousePos = new THREE.Vector2();

  window.addEventListener('mousemove', (e)=>{
    //las coordenadas deben estar en un rango de (0,1)
    mousePos.x = (e.clientX / window.innerWidth) * 2 -1;
    mousePos.y = -(e.clientY / window.innerHeight) * 2 + 1;
  })

  const rayCaster = new THREE.Raycaster();

  const cubeId = cube.id;
  cube.name = "cubitoDubidu";

  function animate() {
    requestAnimationFrame( animate );

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    spotlight.angle = options.angle;
    spotlight.penumbra = options.penumbra;
    spotlight.intensity = options.intensity;
    spLightHelper.update();

    //raycaster
    rayCaster.setFromCamera(mousePos,camera);
    const intersects = rayCaster.intersectObject(scene.children);

    for(let i = 0; i < intersects.length; i++)
    {
      if(intersects[i].object.id === cubeId)
      {
        const cuboide = intersects[i].object;
        const cubeMesh = cuboide as THREE.Mesh;
        cuboide.material.color.set(0xFF0000);
      }
    }

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
      {/*<div id="info">Buenas</div>*/}
      <div className='App'>{doThreeJS()}</div>       
    </>
  )
}

export default App

