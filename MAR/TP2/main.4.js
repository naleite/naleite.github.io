/**
 *  ThreeJS test file using the ThreeRender class
 */

//Loads all dependencies
requirejs(['ModulesLoaderV2.js'], function()
		{ 
			// Level 0 includes
			ModulesLoader.requireModules(["threejs/three.min.js"]) ;
			ModulesLoader.requireModules([ "myJS/ThreeRenderingEnv.js", 
			                              "myJS/ThreeLightingEnv.js", 
			                              "myJS/ThreeLoadingEnv.js", 
			                              "myJS/navZ.js",
			                              "FlyingVehicle.js"]) ;
			// Loads modules contained in includes and starts main function
			ModulesLoader.loadModules(start) ;
		}
) ;

function start()
{
	//	----------------------------------------------------------------------------
	//	MAR 2014 - TP Animation hélicoptère
	//	author(s) : Cozot, R. and Lamarche, F.
	//	---------------------------------------------------------------------------- 			
	//	global vars
	//	----------------------------------------------------------------------------
	//	keyPressed
	var currentlyPressedKeys = {};
	
	//	rendering env
	var renderingEnvironment =  new ThreeRenderingEnv();

	//	lighting env
	var Lights = new ThreeLightingEnv('rembrandt','neutral','spot',renderingEnvironment,5000);

	//	Loading env
	var Loader = new ThreeLoadingEnv();


	var heli=new THREE.Object3D();
	heli.name="heli";
	heli.position.x=0;
	heli.position.y=0;
	heli.position.z=0;
	renderingEnvironment.addToScene(heli);

	//var helicoCorp = Loader.load({filename: 'assets/helico/helicoCorp.obj', node: heli, name: 'helicoCorp'});//
	var helicoCorp = Loader.loadMesh('assets/helico','helicoCorp','obj',heli,'border',	0,0,0,'front');
	helicoCorp.name="helicoCorp";
	var turbineD = Loader.loadMesh('assets/helico','turbine','obj',	helicoCorp,'border',8,-3,3,'front');
	var turbineG = Loader.loadMesh('assets/helico','turbine','obj',	helicoCorp,'border',-8,-3,3,'front');
	var turbineC = Loader.loadMesh('assets/helico','turbine','obj',	helicoCorp,'border',0,0,4,'front');
	turbineC.rotation.x=90*3.14159/180;
	var axeD=Loader.loadMesh('assets/helico','axe','obj',turbineD,'border',0,1,0,'front');
	var axeG=Loader.loadMesh('assets/helico','axe','obj',turbineG,'border',0,1,0,'front');
	var axeC=Loader.loadMesh('assets/helico','axe','obj',turbineC,'border',0,1,0,'front');

	var paleD1=Loader.loadMesh('assets/helico','pale2','obj',axeD,'border',0,2,0,'front');
	var paleD2=Loader.loadMesh('assets/helico','pale2','obj',axeD,'border',0,2,0,'front');
	paleD2.rotation.y=120*3.14159/180;
	var paleD3=Loader.loadMesh('assets/helico','pale2','obj',axeD,'border',0,2,0,'front');
	paleD3.rotation.y=240*3.14159/180;

	var paleG1=Loader.loadMesh('assets/helico','pale2','obj',axeG,'border',0,2,0,'front');
	var paleG2=Loader.loadMesh('assets/helico','pale2','obj',axeG,'border',0,2,0,'front');
	paleG2.rotation.y=120*3.14159/180;
	var paleG3=Loader.loadMesh('assets/helico','pale2','obj',axeG,'border',0,2,0,'front');
	paleG3.rotation.y=240*3.14159/180;

	var paleC1=Loader.loadMesh('assets/helico','pale2','obj',axeC,'border',0,2,0,'front');
	var paleC2=Loader.loadMesh('assets/helico','pale2','obj',axeC,'border',0,2,0,'front');
	paleC2.rotation.y=120*3.14159/180;
	var paleC3=Loader.loadMesh('assets/helico','pale2','obj',axeC,'border',0,2,0,'front');
	paleC3.rotation.y=240*3.14159/180;

	var pales=[paleC1,paleC2,paleC3,paleD1,paleD2,paleD3,paleG1,paleG2,paleG3];

	//axeC.rotation.x=90*3.14159/180;
	//helicoCorp.position.x=heli.position.x;
	//helicoCorp.position.y=heli.position.y;
	//helicoCorp.position.z=heli.position.z;
	//heli.add(helicoCorp);

	//heli.add(turbineD);

	function run_pales(delta){
		for(i=0;i<pales.length;i++){
			pales[i].rotation.y+=delta;
		}
	}

	var rotationIncrement = 0.05 ;
	function orient_heli(vector3,rotationInc){

		heli.rotateOnAxis(vector3, rotationInc);
		run_pales(rotationInc);
	}

	// Camera setup
	renderingEnvironment.camera.position.x = 0 ;
	renderingEnvironment.camera.position.y = 0 ;
	renderingEnvironment.camera.position.z = 40 ;
	
	//	event listener
	//	---------------------------------------------------------------------------
	//	resize window
	window.addEventListener( 'resize', onWindowResize, false );
	//	keyboard callbacks 
	document.onkeydown = handleKeyDown;
	document.onkeyup = handleKeyUp;					

	//	callback functions
	//	---------------------------------------------------------------------------
	function handleKeyDown(event) { currentlyPressedKeys[event.keyCode] = true;}
	function handleKeyUp(event) {currentlyPressedKeys[event.keyCode] = false;}

	function handleKeys() {
		if (currentlyPressedKeys[67]) // (C) debug
		{
			// debug scene
			renderingEnvironment.scene.traverse(function(o){
				console.log('object:'+o.name+'>'+o.id+'::'+o.type);
			});
		}				

		if (currentlyPressedKeys[68]) // (D) Right
		{
			renderingEnvironment.scene.rotateOnAxis(new THREE.Vector3(0.0,1.0,0.0), rotationIncrement) ;
		}
		if (currentlyPressedKeys[81]) // (Q) Left 
		{		
			renderingEnvironment.scene.rotateOnAxis(new THREE.Vector3(0.0,1.0,0.0), -rotationIncrement) ;
		}
		if (currentlyPressedKeys[90]) // (Z) Up
		{
			renderingEnvironment.scene.rotateOnAxis(new THREE.Vector3(1.0,0.0,0.0), rotationIncrement) ;
		}
		if (currentlyPressedKeys[83]) // (S) Down 
		{
			renderingEnvironment.scene.rotateOnAxis(new THREE.Vector3(1.0,0.0,0.0), -rotationIncrement) ;
		}
	}

	//	window resize
	function  onWindowResize() 
	{
		renderingEnvironment.onWindowResize(window.innerWidth,window.innerHeight);
	}


	//var delta=0.01;
	function render() { 
		requestAnimationFrame( render );
		handleKeys();
		// Rendering


		var vector3=new THREE.Vector3(0.0,0.0,1.0);

		orient_heli(vector3,0.05);
		renderingEnvironment.renderer.render(renderingEnvironment.scene, renderingEnvironment.camera); 
	};

	render(); 
}
