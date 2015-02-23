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
			                              "Helicopter.js","Interpolators.js",
				"ParticleSystem.js"]) ;
			// Loads modules contained in includes and starts main function
			ModulesLoader.loadModules(start) ;
		}
) ;

function start(){
	//	----------------------------------------------------------------------------
	//	MAR 2014 - nav test
	//	author(s) : Cozot, R. and Lamarche, F.
	//	date : 11/16/2014
	//	last : 11/25/2014
	//	---------------------------------------------------------------------------- 			
	//	global vars
	//	----------------------------------------------------------------------------
	//	keyPressed
	var currentlyPressedKeys = {};
	
	// heli Position
	var helix = -220;
	var heliy = 0 ;
	var heliz = 12 ;
	var helitheta = 0 ;
	// heli speed
	var dt = 0.05; 
	var dx = 1.0;

	// Creates the helico (handled by physics)
	var helico = new Helicopter(
			{
				position: new THREE.Vector3(helix, heliy, heliz),
				zAngle : helitheta+Math.PI/2.0
			}
			) ;
	
	//	rendering env
	var RC =  new ThreeRenderingEnv();

	//	lighting env
	var Lights = new ThreeLightingEnv('rembrandt','neutral','spot',RC,5000);

	//	Loading env
	var Loader = new ThreeLoadingEnv();

	//	Meshes
	Loader.loadMesh('assets','border_Zup_02','obj',	RC.scene,'border',	-340,-340,0,'front');
	Loader.loadMesh('assets','ground_Zup_03','obj',	RC.scene,'ground',	-340,-340,0,'front');
	Loader.loadMesh('assets','circuit_Zup_02','obj',RC.scene,'circuit',	-340,-340,0,'front');
	//Loader.loadMesh('assets','tree_Zup_02','obj',	RC.scene,'trees',	-340,-340,0,'double');
	Loader.loadMesh('assets','arrivee_Zup_01','obj',	RC.scene,'decors',	-340,-340,0,'front');


	//	heli
	// heli Translation
	var heli0 = new THREE.Object3D();
	heli0.name = 'heli0';
	RC.addToScene(heli0);
	// initial POS
	heli0.position.x = helix;
	heli0.position.y = heliy;
	heli0.position.z = heliz;
	// heli Rotation floor slope follow
	var heli1 = new THREE.Object3D();
	heli1.name = 'heli1';
	heli0.add(heli1);
	// heli vertical rotation
	var heli2 = new THREE.Object3D();
	heli2.name = 'heli2';
	heli1.add(heli2);
	//heli2.rotation.z = helitheta ;
	// the heli itself
	// simple method to load an object
	//var heli3 = Loader.load({filename: 'assets/heli_Zup_01.obj', node: heli2, name: 'heli3'}) ;

	var heli3=new THREE.Object3D();
	heli2.add(heli3);
	heli3.name="heli3";

	// attach the scene camera to heli

	var camera0=RC.camera;
	heli3.add(camera0) ;
	RC.camera.position.x = 0.0 ;
	RC.camera.position.z = 20.0 ;
	RC.camera.position.y = -50.0 ;
	RC.camera.rotation.x = 85.0*3.14159/180.0 ;

	//RC.addToScene(heli3);

	//var helicoCorp = Loader.load({filename: 'assets/helico/helicoCorp.obj', node: heli, name: 'helicoCorp'});//
	var helicoCorp = Loader.loadMesh('assets/helico','helicoCorp','obj',heli3,'border',	0,0,0,'front');
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


	//	Skybox
	Loader.loadSkyBox('assets/maps',['px','nx','py','ny','pz','nz'],'jpg', RC.scene, 'sky',4000);

	//	Planes Set for Navigation 
	// 	z up 
	var NAV = new navPlaneSet(
					new navPlane('p01',	-260, -180,	 -80, 120,	+0,+0,'px')); 		// 01	
	NAV.addPlane(	new navPlane('p02', -260, -180,	 120, 200,	+0,+20,'py')); 		// 02		
	NAV.addPlane(	new navPlane('p03', -260, -240,	 200, 240,	+20,+20,'px')); 	// 03		
	NAV.addPlane(	new navPlane('p04', -240, -160,  200, 260,	+20,+20,'px')); 	// 04		
	NAV.addPlane(	new navPlane('p05', -160,  -80,  200, 260,	+20,+40,'px')); 	// 05		
	NAV.addPlane(	new navPlane('p06',  -80, -20,   200, 260,	+40,+60,'px')); 	// 06		
	NAV.addPlane(	new navPlane('p07',  -20,  +40,  140, 260,	+60,+60,'px')); 	// 07		
	NAV.addPlane(	new navPlane('p08',    0,  +80,  100, 140,	+60,+60,'px')); 	// 08		
	NAV.addPlane(	new navPlane('p09',   20, +100,   60, 100,	+60,+60,'px')); 	// 09		
	NAV.addPlane(	new navPlane('p10',   40, +100,   40,  60,	+60,+60,'px')); 	// 10		
	NAV.addPlane(	new navPlane('p11',  100,  180,   40, 100,	+40,+60,'nx')); 	// 11		
	NAV.addPlane(	new navPlane('p12',  180,  240,   40,  80,	+40,+40,'px')); 	// 12		
	NAV.addPlane(	new navPlane('p13',  180,  240,    0,  40,	+20,+40,'py')); 	// 13 		
	NAV.addPlane(	new navPlane('p14',  200,  260,  -80,   0,	+0,+20,'py')); 		// 14		
	NAV.addPlane(	new navPlane('p15',  180,  240, -160, -80,	+0,+40,'ny')); 		// 15		
	NAV.addPlane(	new navPlane('p16',  160,  220, -220,-160,	+40,+40,'px')); 	// 16	
	NAV.addPlane(	new navPlane('p17',   80,  160, -240,-180,	+40,+40,'px')); 	// 17	
	NAV.addPlane(	new navPlane('p18',   20,   80, -220,-180,	+40,+40,'px')); 	// 18	
	NAV.addPlane(	new navPlane('p19',   20,   80, -180,-140,	+40,+60,'py')); 	// 19	
	NAV.addPlane(	new navPlane('p20',   20,   80, -140,-100,	+60,+80,'py')); 	// 20	
	NAV.addPlane(	new navPlane('p21',   20,   60, -100, -40,	+80,+80,'px')); 	// 21		
	NAV.addPlane(	new navPlane('p22',  -80,   20, -100, -40,	+80,+80,'px')); 	// 22		
	NAV.addPlane(	new navPlane('p23', -140,  -80, -100, -40,	+80,+80,'px')); 	// 23		
	NAV.addPlane(	new navPlane('p24', -140,  -80, -140,-100,	+60,+80,'py')); 	// 24		
	NAV.addPlane(	new navPlane('p25', -140,  -80, -200,-140,	+40,+60,'py')); 	// 25		
	NAV.addPlane(	new navPlane('p26', -100,  -80, -240,-200,	+40,+40,'px')); 	// 26		
	NAV.addPlane(	new navPlane('p27', -220, -100, -260,-200,	+40,+40,'px')); 	// 27	
	NAV.addPlane(	new navPlane('p28', -240, -220, -240,-200,	+40,+40,'px')); 	// 28	
	NAV.addPlane(	new navPlane('p29', -240, -180, -200,-140,	+20,+40,'ny')); 	// 29	
	NAV.addPlane(	new navPlane('p30', -240, -180, -140, -80,	+0,+20,'ny')); 		// 30			
	NAV.setPos(helix,heliy,heliz);
	NAV.initActive();



	//Particule
	function getParticleSystem() {
		var engine = new ParticleSystem.Engine_Class({
			particlesCount: 10000,
			blendingMode: THREE.AdditiveBlending,
			textureFile: 'assets/particles/explosion.jpg'

		});

		var emitteur = new ParticleSystem.ConeEmitter_Class2({

			cone: {
				center: new THREE.Vector3(0, -5, 0),
				height: new THREE.Vector3(0, -1, 0),
				radius: 0.05,
				flow: 1000
			},
			particle: {
				speed: new MathExt.Interval_Class(50, 100),
				mass: new MathExt.Interval_Class(0.1, 0.3),
				size: new MathExt.Interval_Class(5, 10),
				lifeTime: new MathExt.Interval_Class(0.1, 0.3)
			}
		});
		engine.addEmitter(emitteur);

		//Q3 lifeTimeModifier
		var lifeTimeMo = new ParticleSystem.LifeTimeModifier_Class();
		var posMo = new ParticleSystem.PositionModifier_EulerItegration_Class();
		//Q4
		var fmwc = new ParticleSystem.ForceModifier_Weight_Class();
		//Q5
		var opMo = new ParticleSystem.OpacityModifier_TimeToDeath_Class(new Interpolators.Linear_Class(1, 0));
		//Q6
		var startC = new THREE.Color();
		startC.setRGB(1, 0.8, 0.7);
		var endC = new THREE.Color();
		endC.setRGB(1, 0, 0);
		var colorMo = new ParticleSystem.ColorModifier_TimeToDeath_Class(startC, endC);

		engine.addModifier(lifeTimeMo);
		//engine.addModifier(fmwc);
		engine.addModifier(posMo);
		engine.addModifier(opMo);
		engine.addModifier(colorMo);

		return engine

	}

	var par1=getParticleSystem();
	turbineD.add(par1.particleSystem);

	var par2=getParticleSystem();
	turbineG.add(par2.particleSystem);

	//var navMesh = NAV.toMesh();
	//RC.addToScene(navMesh);
	//	event listener
	//	---------------------------------------------------------------------------
	//	resize window
	window.addEventListener( 'resize', onWindowResize, false );
	//	keyboard callbacks 
	document.onkeydown = handleKeyDown;
	document.onkeyup = handleKeyUp;
	//document.onkeypress=handleKeyPress;


	//	callback functions
	//	---------------------------------------------------------------------------
	function handleKeyDown(event) { currentlyPressedKeys[event.keyCode] = true;}
	function handleKeyUp(event) {currentlyPressedKeys[event.keyCode] = false;}

	function handleKeys() {

		if (currentlyPressedKeys[67]) // (C) debug
		{
			// debug scene
			//RC.scene.traverse(function(o){
			//	console.log('object:'+o.name+'>'+o.id+'::'+o.type);
			//});
			//console.log('x:'+heli3.position.x+" y:"+heli3.position.y+" z:"+heli3.position.z);
		}				
		if (currentlyPressedKeys[68]) // (D) Right
		{
			helico.turnRight(1000) ;
		}
		if (currentlyPressedKeys[81]) // (Q) Left 
		{		
			helico.turnLeft(1000) ;
		}
		if (currentlyPressedKeys[90]) // (Z) Up
		{
			helico.goFront(1200, 1200) ;
		}
		if (currentlyPressedKeys[83]) // (S) Down 
		{
			helico.brake(100) ;
		}


	}


	//	window resize
	function  onWindowResize() {RC.onWindowResize(window.innerWidth,window.innerHeight);}

	function render() { 
		requestAnimationFrame( render );
		handleKeys();
		// helico stabilization
		helico.stabilizeSkid(50) ;
		helico.stabilizeTurn(1000) ;
		var oldPosition = helico.position.clone() ;
		helico.update(1.0/60) ;
		var newPosition = helico.position.clone() ;
		newPosition.sub(oldPosition) ;
		// NAV
		NAV.move(newPosition.x, newPosition.y, 200,200) ;
		// heli0
		heli0.position.set(NAV.x, NAV.y, NAV.z) ;
		// Updates the helico
		helico.position.x = NAV.x ;
		helico.position.y = NAV.Y ;
		//helico.position.z = heliz ;
		// Updates heli1
		heli1.matrixAutoUpdate = false;
		heli1.matrix.copy(NAV.localMatrix(helix,heliy));
		// Updates heli2
		heli2.rotation.z = helico.angles.z-Math.PI/2.0;
		// Rendering
		RC.renderer.render(RC.scene, RC.camera);

		//paleVitesse=helico.vPales;
		run_pales_v(helico.vPales);

		orient_turbine(helico.orient_turbine());

		orient_heli(helico.orient_heli());


		//particle
		par1.animate(0.01,RC.renderer);
		par2.animate(0.01,RC.renderer);

	};

	render();

	function run_pales_v(vitesse){
		for(i=0;i<pales.length;i++){
			pales[i].rotation.y+=vitesse;
		}

	}


	//Q2
	function orient_heli(angle){


		heli2.rotation.z=angle-3.14/2;

	}

	//Q3
	function orient_turbine(angle){

		turbineD.rotation.z=angle;
		turbineG.rotation.z=angle;

	}



}
