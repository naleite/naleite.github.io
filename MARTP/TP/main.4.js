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
	var turbineD = Loader.loadMesh('assets/helico','turbine','obj',	helicoCorp,'border',8.5,-3,2,'front');
	var turbineG = Loader.loadMesh('assets/helico','turbine','obj',	helicoCorp,'border',-8.5,-3,2,'front');
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


	function run_pales_v(vitesse){
		for(i=0;i<pales.length;i++){
			pales[i].rotation.y+=vitesse;
		}

	}


	function acc_pales_v(vitesse,acc){
		for(i=3;i<pales.length;i++){
			pales[i].rotation.y+=vitesse;
		}
	}


	//Q2
	function orient_heli(vector_v){

		//heli.rotateOnAxis(vector_v, vitesse);
		var x=vector_v.x;
		var y=vector_v.y;
		var angle=Math.atan2(y,x);
		heli.rotation.z+=angle;
		//run_pales_v(vitesse);
	}



	//Q3
	function orient_turbine(vector_A){
		var x=vector_A.x;
		var y=vector_A.y;
		var angle=Math.atan2(y,x);
		console.log("Angle acc:"+angle+" x,y "+x+" "+y);
		turbineD.rotation.z+=angle;
		turbineG.rotation.z+=angle;
		//var vitesseAcc=vitesse;
		//run_pales(vitesseAcc,0.3);

	}

	function getAcc(vec0,vec1){
		var acc=new THREE.Vector3(vec1.x-vec0.x,vec1.y-vec0.y,vec1.z-vec0.z);
		return acc;
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

	var rotationIncrement = 0.05 ;
	var paleVitesseDef=0.1;
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
			//renderingEnvironment.scene.rotateOnAxis(new THREE.Vector3(0.0,1.0,0.0), rotationIncrement) ;
			var vectorD=new THREE.Vector3(1,1.1,1.0);
			var vectorD2=new THREE.Vector3(1.3,1,1.0);
			console.log(vectorD.x+"  "+vectorD.y+"  "+vectorD.z);
			var vitesse=0.05;
			var acc=getAcc(vectorD,vectorD2);
			orient_heli(vectorD);
			orient_turbine(acc);

		}
		if (currentlyPressedKeys[81]) // (Q) Left 
		{
			var vectorQ=new THREE.Vector3(1.0,1.0,-1.0);
			var vectorQ=new THREE.Vector3(1.2,1.0,-1.0);
			var vitesse=0.05;
			var acc=0.01;
			orient_heli(vectorQ,vitesse);
			//renderingEnvironment.scene.rotateOnAxis(new THREE.Vector3(0.0,1.0,0.0), -rotationIncrement) ;
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

		run_pales_v(paleVitesseDef);
		//heli.position.atan2();


		//orient_turbine(vector3,vitesse,acc);
		renderingEnvironment.renderer.render(renderingEnvironment.scene, renderingEnvironment.camera); 
	};

	render(); 
}
