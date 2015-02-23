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
			                              "Helicopter.js",
											"MathExt.js",
											"Interpolators.js",
											"ParticleSystem.js"]) ;
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

	// car Position
	var CARx = 0;
	var CARy = 0 ;
	var CARz = 0 ;
	var CARtheta = 0 ;
	var dt = 0.05;
	var dx = 1.0;

	// Creates the vehicle (handled by physics)
	/*var heli = new Helicopter(
		{
			position: new THREE.Vector3(CARx, CARy, CARz),
			vPales: 0.05
			//zAngle : CARtheta+Math.PI/2.0
		}
	) ;*/


	var engine=new ParticleSystem.Engine_Class({
		particlesCount:10000,
		blendingMode: THREE.AdditiveBlending,
		textureFile: 'assets/particles/particle.png'

	});
	renderingEnvironment.addToScene(engine.particleSystem);
	/*{
		// Description of the emitter shape
		cone: {
			center: {THREE.Vector3} Cone center
			height: {THREE.Vector3} Cone height vector
			radius: {Scalar} Radius of the top of the cone
			flow: 	{Scalar} Number of particles emitted per second
		},
		// Description of the particles characteristics
		particle: {
			speed: 	  {MathExt.Interval_Class} Particle speed
			mass: 	  {MathExt.Interval_Class} Particle mass
			size:	  {MathExt.Interval_Class} Particle size
			lifeTime: {MathExt.Interval_Class} Particle lifetime
		}
	}*/
	var emitteur=new ParticleSystem.ConeEmitter_Class2({

		cone:{
			center: new THREE.Vector3(0,0,0),
			height: new THREE.Vector3(0,0,1),
			radius: 50,
			flow: 1000
		},
		particle:{
			speed: new MathExt.Interval_Class(5,10),
			mass: new MathExt.Interval_Class(0.1,0.3),
			size: new MathExt.Interval_Class(0.1,1.0),
			lifeTime: new MathExt.Interval_Class(1.0,7.0)
		}
	});
	engine.addEmitter(emitteur);

	//Q3
	var lifeTimeMo=new ParticleSystem.LifeTimeModifier_Class();
	var posMo=new ParticleSystem.PositionModifier_EulerItegration_Class();
	//Q4
	var fmwc=new ParticleSystem.ForceModifier_Weight_Class();
	//Q5
	var opMo=new ParticleSystem.OpacityModifier_TimeToDeath_Class(new Interpolators.Linear_Class(1,0));
	//Q6
	var startC=new THREE.Color();
	startC.setRGB(1,1,1);
	var endC=new THREE.Color();
	endC.setRGB(1,0,0);
	var colorMo=new ParticleSystem.ColorModifier_TimeToDeath_Class(startC,endC);

	engine.addModifier(lifeTimeMo);
	engine.addModifier(fmwc);
	engine.addModifier(posMo);
	engine.addModifier(opMo);
	engine.addModifier(colorMo);

	// Camera setup
	renderingEnvironment.camera.position.x = 0 ;
	renderingEnvironment.camera.position.y = 0 ;
	renderingEnvironment.camera.position.z = 40 ;
	//renderingEnvironment.camera.lookAt(0,0,1);
	
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
			//engine.particleSystem.rotateOnAxis(new THREE.Vector3(.0,.0,1.0), rotationIncrement);


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

		engine.animate(0.01,renderingEnvironment.renderer);


		renderingEnvironment.renderer.render(renderingEnvironment.scene, renderingEnvironment.camera); 
	};

	render(); 
}
