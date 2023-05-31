import './App.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import * as dat from 'dat.gui'


function doThreeJS()
{
 
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );


  scene.background = new THREE.Color(0.8,0.5,0.9); //new THREE.Color( 'skyblue' );

  
  const spotLight = new THREE.SpotLight(0xfffffff);
  scene.add(spotLight);
  spotLight.position.set(-10,30,0);
  spotLight.castShadow = true;
  spotLight.angle = Math.PI/3;

  const SpotlightHelper = new THREE.SpotLightHelper(spotLight);
  scene.add(SpotlightHelper);
    
    //Luz ambiental
    const ambientLight = new THREE.AmbientLight(0x99aaff,1);
    scene.add(ambientLight);

    const gridHelper = new THREE.GridHelper(10,10);
    scene.add(gridHelper);

    scene.fog = new THREE.Fog(0xe7bcf3, 5, 100);

    const renderer = new THREE.WebGLRenderer();
    renderer.toneMapping = THREE.ACESFilmicToneMapping; //opciones aestethic
    renderer.outputColorSpace = THREE.SRGBColorSpace; //opciones aestethic
    renderer.setPixelRatio(window.devicePixelRatio); //opciones aestethic
    renderer.setSize( window.innerWidth, window.innerHeight );

    renderer.shadowMap.enabled = true; //

    const controls = new OrbitControls( camera, renderer.domElement );

    document.body.appendChild( renderer.domElement );

    const geometry = new THREE.BoxGeometry( 3, 3, 3 );
    const material = new THREE.MeshPhongMaterial( { color: 0xffffff } );
    const cube = new THREE.Mesh( geometry, material );
    
    cube.castShadow = true; 
    cube.position.x = 5;


    const material2 = new THREE.MeshPhongMaterial( { color: 0xffffff } );
    const cube2 = new THREE.Mesh( geometry, material2 );
    scene.add(cube2)
    cube2.position.y = 3;
    cube2.castShadow = true;

    //SPAWN CUBOS
    for (let i = 0; i < (6); i++ )
    {   
      const geometry = new THREE.BoxGeometry( .8, .8, .8 );
      let randomColor = new THREE.MeshPhongMaterial( { color: "#"+ Math.floor(Math.random()*16777215).toString(16) } );
      const cube = new THREE.Mesh( geometry, randomColor );
      scene.add(cube);

      cube.name = 'cubo3';
      
      //POSICION ALEATORIA
      let posX = randNum(-3, 3);
      let posY = randNum(-3, 3);
      let posZ = randNum(-3, 3);
      cube.position.set( posX, posY, posZ );
      
      cube2.attach(cube);
    }
    
    const planeGeometry = new THREE.PlaneGeometry(20,20,1,1)
    const planeMaterial = new THREE.MeshPhongMaterial({color:0x3399bb})
    const plane = new THREE.Mesh(planeGeometry, planeMaterial)
    scene.add(plane)
    plane.position.y = -5;
    plane.rotateX(-90 * (Math.PI/180))
    plane.receiveShadow = true;
    
    camera.position.z = 5;

    const gui = new dat.GUI();
    
    const options = {
      colorcubo: '#ffffff',
      angle : Math.PI/3,
      penumbra : 0.5,
      intensity: 1,
      wireframe: false
      
    }
    
    gui.add (options, 'angle', 0, Math.PI/2);
    gui.add (options, 'penumbra', 0, 1);
    gui.add (options, 'intensity', 0, 1);
    gui.addColor (options, 'colorcubo').onChange((e) =>{
      cube.material.color.set(e);
    });
    gui.add(options, 'wireframe').onChange(function(e){
      plane.material.wireframe = e;
    })
    
    const mousePos = new THREE.Vector2();
    
    window.addEventListener('mousemove', function(e){
      mousePos.x = (e.clientX / this.window.innerWidth) * 2 - 1;
      mousePos.y = - (e.clientY / this.window.innerHeight) * 2 + 1;
    });
    
    const rayCaster = new THREE.Raycaster();
    
    const cubeID = cube.id;
    
    let Loaded = false;
    setTimeout(() => {
      Loaded = true
    }, 1500);
    
    setTimeout(() => {
      
    },3000)
    
    const clock = new THREE.Clock();
    let delta = 0
    let time = 0
    
    //FUNCION PARA NUMERO ALEATORIO
    function randNum(min, max) 
    {
      return Math.random() * (max - min) + min;
    }

    function animate() {
      requestAnimationFrame( animate );
      
      const intersect = rayCaster.intersectObjects(scene.children);
      
      window.onclick = (event => {
        for (let i = 0; i < intersect.length; i++)
        {
          if(intersect[i].object.name == 'cubo3' && cube2.children.includes(intersect[i].object))
          {
            scene.add(intersect[i].object);
            intersect[i].object.position.x += cube2.position.x;
            intersect[i].object.position.y += cube2.position.y;
          }
          else if(intersect[i].object.name == 'cubo3' && !cube2.children.includes(intersect[i].object))
          {
            intersect[i].object.position.x -= cube2.position.x;
            intersect[i].object.position.y -= cube2.position.y;
            cube2.add(intersect[i].object)
          }
        }
      });
      
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      
      spotLight.angle = options.angle;
      spotLight.penumbra = options.penumbra;
      spotLight.intensity = options.intensity;
      SpotlightHelper.update();
      
      if(Loaded){
        
        rayCaster.setFromCamera(mousePos,camera);
        const intersects = rayCaster.intersectObjects(scene.children);
        
        for (let i = 0; i < intersects.length; i++) {
          if(intersects[i].object.id == cubeID){
            const cuboide = intersects[i].object;
            cuboide.material.color.set(0xFF0000);
          }
          
          
        }
      }
          
      // RAYCASTER
      delta = clock.getDelta();
      time += delta;
      
      cube2.position.set(Math.sin(time) *6,3,0);
      
      renderer.render( scene, camera );
    }
    

    window.addEventListener( 'resize', onWindowResize, false );
    
    function onWindowResize(){ 
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize( window.innerWidth, window.innerHeight );
    }
    
    animate();
}

const App = () => {

  return (
    <>
      {/* <div id="info">Buenas</div> */}
      <div className='App'>{doThreeJS()}</div>       
    </>
  )
}

export default App