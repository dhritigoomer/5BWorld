import * as THREE from 'three';
import {OrbitControls} from './three.js-master/examples/jsm/controls/OrbitControls.js';
import {OBJLoader} from './three.js-master/examples/jsm/loaders/OBJLoader.js';
import {MTLLoader} from './three.js-master/examples/jsm/loaders/MTLLoader.js';

function main() {

	const canvas = document.querySelector( '#c' );
	const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );
	// Source for next two lines: ChatGPT
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;

	// CAMERA
	// Source: Kitty Playground by Yukti Malhan https://people.ucsc.edu/~ymalhan/asg5/asg5.html
  let camera;
	initCamera();
	let controls = new OrbitControls(camera, canvas);

	const scene = new THREE.Scene();
	// camera.position.z = 3;

  // const controls = new OrbitControls( camera, canvas );
	// controls.target.set( 0, 0, 0 );
	// controls.update();
	function initCamera() {
		const fov = 10;
		const aspect = window.innerWidth / window.innerHeight;;
		const near = 0.1;
		const far = 100;

		camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.set(0, 12, 30);

        const controls = new OrbitControls(camera, canvas);
        controls.target.set(0, 12, 0);
        controls.update();
	}

	const scene = new THREE.Scene();

    {

		const color = 0xFFFFFF;
		const intensity = 3;
		const light = new THREE.DirectionalLight( color, intensity );
		light.position.set( - 1, 2, 4 );
		scene.add( light );

	}
	{

		const color = 0xFFFFFF;
		const intensity = 0.3;
		const light = new THREE.AmbientLight(color, intensity);
		scene.add(light);

	}
	{

		const skyColor = 0xB1E1FF;
        const groundColor = 0xB97A20;
        const intensity = 0.4;
        const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
        scene.add(light);

	}

		const boxWidth = 1;
		const boxHeight = 1;
		const boxDepth = 1;
		const geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );

   	const loadManager = new THREE.LoadingManager();
		const loader = new THREE.TextureLoader( loadManager );

    function makeInstance( geometry, color, x ) {

		const material = new THREE.MeshPhongMaterial( { color } );

		const cube = new THREE.Mesh( geometry, material );
		scene.add( cube );

		cube.position.x = x;

		return cube;

	}

    function makeInstanceTexture(geometry, materials, x) {
        const cube = new THREE.Mesh(geometry, materials);
        scene.add(cube);

        cube.position.x = x;

        return cube;
    }

    const materials = [
		new THREE.MeshBasicMaterial( { map: loadColorTexture( './puppy-1.jpg' ) } ),
		new THREE.MeshBasicMaterial( { map: loadColorTexture( './puppy-2.jpg' ) } ),
		new THREE.MeshBasicMaterial( { map: loadColorTexture( './puppy-3.jpg' ) } ),
		new THREE.MeshBasicMaterial( { map: loadColorTexture( './puppy-4.jpg' ) } ),
		new THREE.MeshBasicMaterial( { map: loadColorTexture( './puppy-5.jpg' ) } ),
		new THREE.MeshBasicMaterial( { map: loadColorTexture( './puppy-6.jpg' ) } ),
	];

    const cubes = [
		makeInstance( geometry, 0x44aa88, 0 ),
		makeInstance( geometry, 0x8844aa, - 2 ),
		makeInstance( geometry, 0xaa8844, 2 ),
        makeInstanceTexture( geometry, materials, -4),
	];

    {

		const loader = new THREE.TextureLoader();
		const texture = loader.load(
			'./tears_of_steel_bridge.jpg',
			() => {

				texture.mapping = THREE.EquirectangularReflectionMapping;
				texture.colorSpace = THREE.SRGBColorSpace;
				scene.background = texture;

			} );

		}

    {
        const objLoader = new OBJLoader();
		const mtlLoader = new MTLLoader();
		mtlLoader.load( './indoor-plant/indoor-plant.mtl', ( mtl ) => {

			mtl.preload();
            for (const material of Object.values(mtl.materials)) {
                material.side = THREE.DoubleSide;
            }
			objLoader.setMaterials( mtl );
			objLoader.load( './indoor-plant/indoor-plant.obj', ( root ) => {
                root.position.set(6, 0, 0);
				scene.add( root );
			} );

		} );

	}

    function resizeRendererToDisplaySize( renderer ) {

		const canvas = renderer.domElement;
		const width = canvas.clientWidth;
		const height = canvas.clientHeight;
		const needResize = canvas.width !== width || canvas.height !== height;
		if ( needResize ) {

			renderer.setSize( width, height, false );

		}

		return needResize;

	}

    function loadColorTexture( path ) {

		const texture = loader.load( path );
		texture.colorSpace = THREE.SRGBColorSpace;
		return texture;

	}
	function makeCone( color, x, y, height, radius ) {

				// Source: ChatGPT, https://threejs.org/manual/#en/primitives

		const material = new THREE.MeshPhongMaterial( { color } );
				const coneGeometry = new THREE.ConeGeometry(radius, height, 32);
		const cone = new THREE.Mesh( coneGeometry, material );
		cone.position.x = x;
		cone.position.y = y;
				scene.add( cone );

		return cone;

	}

	function makeCube( color, x, y, width, height, depth ) {

		// Source: https://threejs.org/manual/#en/primitives

		const material = new THREE.MeshPhongMaterial( { color } );
		const boxGeometry = new THREE.BoxGeometry(width, height, depth);
		const cube = new THREE.Mesh( boxGeometry, material );
		cube.position.x = x;
		cube.position.y = y;
		scene.add( cube );

		return cube;

	}

	function makeSphere( color, x, y, radius, width, height ) {

		// Source: ChatGPT, https://threejs.org/manual/#en/primitives

		const material = new THREE.MeshPhongMaterial( { color } );
		const sphereGeometry = new THREE.SphereGeometry(radius, width, height);
		const sphere = new THREE.Mesh( sphereGeometry, material );
		sphere.position.x = x;
		sphere.position.y = y;
		scene.add(sphere);

		return sphere;
	}

		function makeTorus( color, x, y, radius, tubeRadius ) {

				// Source: ChatGPT, https://threejs.org/manual/#en/primitives

		const material = new THREE.MeshPhongMaterial( { color } );
				const torusGeometry = new THREE.TorusGeometry(radius, tubeRadius, 32, 32);
		const torus = new THREE.Mesh( torusGeometry, material );
		torus.position.x = x;
		torus.position.y = y;
				scene.add( torus );

		return torus;

	}
	const shapes = [

		// Top row
		makeCone( 0x8844aa, -4, 2, 1, 1 ),
		makeSphere ( 0x96ab35, -2, 2, 0.75, 22, 22 ),
		makeCube ( 0xaa8849, 0, 2, 1, 1, 1),
		makeSphere ( 0x96ab35, 2, 2, 0.75, 22, 22 ),
		makeCone( 0x8844aa, 4, 2, 1, 1 ),

		// Middle row 1
		makeCube( 0xaa8849, -4, 0, 1, 1, 1 ),
		makeCone( 0x8844aa, -2, 0, 1, 1 ),
		makeTorus( 0xaa8844, 2, 0, 0.5, 0.25 ),
		makeCube ( 0xab7644, 4, 0, 1, 1, 1 ),

		// Middle row 2
		makeTorus( 0xac94503, -4, -2, 0.5, 0.25 ),
		makeCube ( 0xaa8849, -2, -2, 1, 1, 1 ),
		makeSphere ( 0x96ab35, 0, -2, 0.75, 22, 22 ),
		makeCone( 0x8844aa, 2, -2, 1, 1 ),
		makeTorus( 0xac94503, 4, -2, 0.5, 0.25 ),

		// Bottom row
		makeCube ( 0xaa8849, -4, -4, 1, 1, 1 ),
		makeTorus( 0xac9900, -2, -4, 0.5, 0.25 ),
		makeTorus( 0xac9900, 0, -4, 0.5, 0.25 ),
		makeCube ( 0xab7644, 2, -4, 1, 1, 1 ),
		makeSphere( 0xab7644, 4, -4, 0.75, 22, 22 )
	];

    function render( time ) {

		time *= 0.001;
		shapes.forEach( ( cube, ndx ) => {

			const speed = 1 + ndx * .1;
			const rot = time * speed;
			cube.rotation.x = rot;
			cube.rotation.y = rot;

		} );
		// if ( resizeRendererToDisplaySize( renderer ) ) {
		//
		// 	const canvas = renderer.domElement;
		// 	camera.aspect = canvas.clientWidth / canvas.clientHeight;
		// 	camera.updateProjectionMatrix();
		//
		// }

		cubes.forEach( ( cube, ndx ) => {

			const speed = 1 + ndx * .1;
			const rot = time * speed;
			cube.rotation.x = rot;
			cube.rotation.y = rot;

		} );

		renderer.render( scene, camera );

		requestAnimationFrame( render );

	}

	requestAnimationFrame( render );

}

main();
