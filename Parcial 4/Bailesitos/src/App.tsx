import './App.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';

function doThreeJS(){
 
  const dances = ['Happy','HipHop','Macarena','Samba'];
  let previousAction:THREE.AnimationAction, activeAction : THREE.AnimationAction;
  let ndance=0;
  let nModels = 10;
  let waitTimer = 1;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

  //Color fondo
  scene.background = new THREE.Color(0.25,0.6,0.3); //new THREE.Color( 'skyblue' );

  //Luz direccional
  const light = new THREE.DirectionalLight(0xffffff,0.6);
  light.position.set(0,4,2);
  scene.add(light);
  light.castShadow=true;
  
  //Luz ambiental
  const ambientLight = new THREE.AmbientLight(0x99aaff,1);
  scene.add(ambientLight);


  const renderer = new THREE.WebGLRenderer();
  renderer.toneMapping = THREE.ACESFilmicToneMapping; //opciones aestethic
  renderer.outputColorSpace = THREE.SRGBColorSpace; //opciones aestethic
  renderer.setPixelRatio(window.devicePixelRatio); //opciones aestethic
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.shadowMap.enabled = true;

  const clock = new THREE.Clock();

  const controls = new OrbitControls( camera, renderer.domElement );

  document.body.appendChild( renderer.domElement );
  let model: THREE.Object3D<THREE.Event> | THREE.AnimationObjectGroup;
  let clips: THREE.AnimationClip[] =[];
  let mixer: THREE.AnimationMixer | null;

  const loader = new GLTFLoader();
  loader.load( 'models/robot.gltf', function ( gltf ) {

    model = gltf.scene;
    model.traverse(function(node){
      if(node.isMesh)
        node.castShadow=true;
    })

    clips = gltf.animations;
    
    /*scene.add( model );

    mixer = new THREE.AnimationMixer( model );
    const clip = THREE.AnimationClip.findByName( clips, dances[ndance] );
    const action = mixer.clipAction( clip );
    console.log(action,clip);
    activeAction=action;
    action.play();*/
    

  }, undefined, function ( e ) {

    console.error( e );

  } );

  camera.position.z = 15;
  camera.position.y = 5;

  const planeGeo = new THREE.PlaneGeometry(20,20,1,1);
  const planeMat = new THREE.MeshPhongMaterial({color:0x336699});
  const plane = new THREE.Mesh(planeGeo,planeMat);
  scene.add(plane);
  plane.rotateX(-90*(Math.PI/180));
  plane.receiveShadow=true;

  let delta;

  const mixers=[];

  function animate() {
    requestAnimationFrame( animate );

    delta = clock.getDelta();

    waitTimer-=delta;

    if (nModels > 0 && waitTimer <= 0) {
      nModels--;
      waitTimer = 1;
      const clone = SkeletonUtils.clone(model);
      clone.position.set(Math.random()*14-7,0,Math.random()*14-7);
      scene.add(clone)

      const nDance = Math.floor(Math.random()*4);
      const mixer = new THREE.AnimationMixer(clone);
      const clip = THREE.AnimationClip.findByName(clips, dances[nDance]);
      const action = mixer.clipAction(clip);
      action.play();
      mixers.push(mixer)
    }
    
    /*if(mixer!=null){
      mixer.update(delta);
    }*/

    if (mixers.length > 0) {
      mixers.forEach(function(mixer){
        mixer.update(delta);
      })
    }

    renderer.render( scene, camera );
  }


  function fadeToAction( n: number, duration: number ) {

    const clip = THREE.AnimationClip.findByName( clips, dances[n] );
    const action = mixer!.clipAction( clip );

    previousAction = activeAction;
    activeAction = action;

    if ( previousAction !== activeAction ) {

      previousAction.fadeOut( duration );

    }

    activeAction
      .reset()
      .setEffectiveTimeScale( 1 )
      .setEffectiveWeight( 1 )
      .fadeIn( duration )
      .play();

  }

  window.addEventListener( 'resize', onWindowResize, false );
  
  function onWindowResize(){ //funcion para redimensionar ventana si el usuario le anda moviendo
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
  }
  
  /*setInterval(()=>{
    
    fadeToAction( ndance, 0.9 );
    ndance++;
    if(ndance>=4)
      ndance=0;

  },3000)*/

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