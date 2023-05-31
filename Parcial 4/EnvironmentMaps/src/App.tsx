import './App.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

function doThreeJS(){
 
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

  //Color fondo
  scene.background = new THREE.Color(0.8,0.5,0.9); //new THREE.Color( 'skyblue' );

  //Luz direccional
  const light = new THREE.DirectionalLight(0xffffff,0.6);
  light.position.set(0,4,2);
  scene.add(light);
  
  //Luz ambiental
  const ambientLight = new THREE.AmbientLight(0x99aaff,1);
  scene.add(ambientLight);


  const renderer = new THREE.WebGLRenderer();
  renderer.toneMapping = THREE.ACESFilmicToneMapping; //opciones aestethic
  //renderer.outputColorSpace = THREE.SRGBColorSpace; //opciones aestethic
  //renderer.setPixelRatio(window.devicePixelRatio); //opciones aestethic
  //renderer.toneMappingExposure = 0.1;
  renderer.setSize( window.innerWidth, window.innerHeight );

  const controls = new OrbitControls( camera, renderer.domElement );

  document.body.appendChild( renderer.domElement );

  const geometry = new THREE.BoxGeometry( 1, 1, 1 );
  const material = new THREE.MeshStandardMaterial({color: 0x3333ff, roughness: 0.01, metalness: 1})
  const cube = new THREE.Mesh( geometry, material );
  scene.add( cube );

  camera.position.z = 5;

  const loader = new RGBELoader();
  loader.load('/environments/yaris_4k.hdr', function(texture){
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
    scene.environment = texture;

    const sphereGeo = new THREE.SphereGeometry(1);
    const spheremat = new THREE.MeshStandardMaterial({
      color: 0xFF3333,
      roughness: 0,
      metalness: 0.9,
      envMap: texture
    })
    const sphere = new THREE.Mesh(sphereGeo, spheremat);
    sphere.position.set(2,0,0);
    scene.add(sphere);
  })

  //ELEMENTOS HTML
  const htmlRenderer = new CSS2DRenderer();
  htmlRenderer.setSize(window.innerWidth, window.innerHeight);
  htmlRenderer.domElement.style.position = 'absolute';
  htmlRenderer.domElement.style.top = '0px';
  htmlRenderer.domElement.style.pointerEvents = 'none';
  document.body.appendChild(htmlRenderer.domElement);

  const p = document.createElement('p');
  p.textContent = 'Hola';
  p.className = 'pInWorld';
  const div = document.createElement('div');
  div.appendChild(p);
  const divContainer = new CSS2DObject(div);
  scene.add(divContainer);

  const ptool = document.createElement('p');
  ptool.className = 'tooltip hide';
  ptool.textContent = 'tooltip';
  const pContainer = document.createElement('div');
  pContainer.appendChild(ptool);
  const pointLabel = new CSS2DObject(pContainer);
  pointLabel.position.set(0,1,0);
  scene.add(pointLabel);

  const listener = new THREE.AudioListener();
  camera.add(listener);
  const sound = new THREE.Audio(listener);
  const audioLoader = new THREE.AudioLoader();
  audioLoader.load('/audio/wineGlassClink.wav',function(buffer){
    sound.setBuffer(buffer);
    sound.setLoop(false);
    sound.setVolume(1);
  })

  const mousePosition = new THREE.Vector2();
  const rayCaster = new THREE.Raycaster();
  window.addEventListener('click',(e)=>{
   
      mousePosition.x =  ( e.clientX / window.innerWidth ) * 2 - 1;
      mousePosition.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
      
      rayCaster.setFromCamera(mousePosition,camera);
      const intersects = rayCaster.intersectObjects(scene.children);
      if(intersects.length>0)
      {
        const ObjPos = intersects[0].object.position;
        ptool.className = 'tooltip show'
        pointLabel.position.set(ObjPos.x, ObjPos.y+1,ObjPos.z);
        ptool.textContent = ObjPos.x.toString();
        setTimeout(()=>{ptool.className='tooltip hide'},2000);
        if(sound.isPlaying)
        {
          sound.stop();
        }sound.play();
      }
  })

  //CARGAR MODELO GLTF
  const gltfLoader = new GLTFLoader();

  //let model:any;
  gltfLoader.load(
    // resource URL
    '/tarea/models/Modern_House.gltf',
    // called when the resource is loaded
    function ( gltf ) {
  
      scene.add( gltf.scene );
  
      gltf.animations; // Array<THREE.AnimationClip>
      gltf.scene; // THREE.Group
      console.log(gltf.scene.children);
      //model = gltf.scene.children[5];
      gltf.scenes; // Array<THREE.Group>
      gltf.cameras; // Array<THREE.Camera>
      gltf.asset; // Object
  
    },
    // called while loading is progressing
    function ( xhr ) {
  
      console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
  
    },
    // called when loading has errors
    function ( error ) {
  
      console.log( 'An error happened' );
  
    }
  );

  function animate() {
    requestAnimationFrame( animate );

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    /*
    if(model != null)
      model.rotation.y += 0.01;
      */

    renderer.render( scene, camera );
    htmlRenderer.render(scene,camera);
  }


  window.addEventListener( 'resize', onWindowResize, false );
  
  function onWindowResize(){ //funcion para redimensionar ventana si el usuario le anda moviendo
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    htmlRenderer.setSize(window.innerWidth, window.innerHeight);
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

