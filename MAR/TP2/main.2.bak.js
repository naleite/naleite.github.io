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
			                              "FlyingVehicle.js","Helicopter.js"]) ;
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
	
	// car Position
	var CARx = -220; 
	var CARy = 0 ; 
	var CARz = 0 ;
	var CARtheta = 0 ; 
	// car speed
	var dt = 0.05; 
	var dx = 1.0;

	// Creates the vehicle (handled by physics)
	var vehicle = new FlyingVehicle(
			{
				position: new THREE.Vector3(CARx, CARy, CARz),
				zAngle : CARtheta+Math.PI/2.0
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
		
	//	Car
	// car Translation
	var car0 = new THREE.Object3D(); 
	car0.name = 'car0'; 
	RC.addToScene(car0); 
	// initial POS
	car0.position.x = CARx;
	car0.position.y = CARy;
	car0.position.z = CARz;
	// car Rotation floor slope follow
	var car1 = new THREE.Object3D(); 
	car1.name = 'car1';
	car0.add(car1);
	// car vertical rotation
	var car2 = new THREE.Object3D(); 
	car2.name = 'car2';
	car1.add(car2);
	car2.rotation.z = CARtheta ;
	// the car itself 
	// simple method to load an object
	var car3 = Loader.load({filename: 'assets/car_Zup_01.obj', node: car2, name: 'car3'}) ;
	car3.position.z= +0.25 ;
	// attach the scene camera to car

	var camera0=RC.camera;
	car3.add(camera0) ;
	RC.camera.position.x = 0.0 ;
	RC.camera.position.z = 10.0 ;
	RC.camera.position.y = -25.0 ;
	RC.camera.rotation.x = 85.0*3.14159/180.0 ;
		
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
	NAV.setPos(CARx,CARy,CARz);
	NAV.initActive();



	//add heli
	var heli=new THREE.Object3D();
	heli.name="heli";

	//heli.position=heli_ph.position.clone();
	RC.addToScene(heli);

	//var helicoCorp = Loader.load({filename: 'assets/helico/helicoCorp.obj', node: heli, name: 'helicoCorp'});//
	var helicoCorp = Loader.loadMesh('assets/helico','helicoCorp','obj',heli,'decors',	0,0,0,'front');
	helicoCorp.name="helicoCorp";
	var turbineD = Loader.loadMesh('assets/helico','turbine','obj',	helicoCorp,'decors',8.5,-3,2,'front');
	var turbineG = Loader.loadMesh('assets/helico','turbine','obj',	helicoCorp,'decors',-8.5,-3,2,'front');
	var turbineC = Loader.loadMesh('assets/helico','turbine','obj',	helicoCorp,'decors',0,0,4,'front');
	turbineC.rotation.x=90*3.14159/180;
	var axeD=Loader.loadMesh('assets/helico','axe','obj',turbineD,'decors',0,1,0,'front');
	var axeG=Loader.loadMesh('assets/helico','axe','obj',turbineG,'decors',0,1,0,'front');
	var axeC=Loader.loadMesh('assets/helico','axe','obj',turbineC,'decors',0,1,0,'front');

	var paleD1=Loader.loadMesh('assets/helico','pale2','obj',axeD,'decors',0,2,0,'front');
	var paleD2=Loader.loadMesh('assets/helico','pale2','obj',axeD,'decors',0,2,0,'front');
	paleD2.rotation.y=120*3.14159/180;
	var paleD3=Loader.loadMesh('assets/helico','pale2','obj',axeD,'decors',0,2,0,'front');
	paleD3.rotation.y=240*3.14159/180;

	var paleG1=Loader.loadMesh('assets/helico','pale2','obj',axeG,'decors',0,2,0,'front');
	var paleG2=Loader.loadMesh('assets/helico','pale2','obj',axeG,'decors',0,2,0,'front');
	paleG2.rotation.y=120*3.14159/180;
	var paleG3=Loader.loadMesh('assets/helico','pale2','obj',axeG,'decors',0,2,0,'front');
	paleG3.rotation.y=240*3.14159/180;

	var paleC1=Loader.loadMesh('assets/helico','pale2','obj',axeC,'decors',0,2,0,'front');
	var paleC2=Loader.loadMesh('assets/helico','pale2','obj',axeC,'decors',0,2,0,'front');
	paleC2.rotation.y=120*3.14159/180;
	var paleC3=Loader.loadMesh('assets/helico','pale2','obj',axeC,'decors',0,2,0,'front');
	paleC3.rotation.y=240*3.14159/180;

	var pales=[paleC1,paleC2,paleC3,paleD1,paleD2,paleD3,paleG1,paleG2,paleG3];

	var heli_ph=new Helicopter({

		position:new THREE.Vector3(-220,0,5),
		pales:pales,
		turbineD:turbineD,
		turbineG:turbineG

	});
	heli.position.x=heli_ph.position.x;
	heli.position.y=heli_ph.position.y;
	heli.position.z=heli_ph.position.z;
	//cameras fixes
	var cameras=[]
	//ajouter des cameras fixes
	/*var camera1=new THREE.PerspectiveCamera(45, 1, 1, 10000);
	camera1.position.x=-260;
	camera1.position.z=50;
	camera1.position.y=300;
	camera1.rotation.x=-90.0*3.14159/180.0
	camera1.rotation.z=180.0*3.14159/180.0
	camera1.rotation.y=-15.0*3.14159/180.0
	cameras[cameras.length]=camera1;*/

	function addCamera(px,py,pz){
		var camera=new THREE.PerspectiveCamera(90, 1, 1, 10000);
		camera.position.x=px;
		camera.position.y=py;
		camera.position.z=pz;
		//camera.rotation.x=rx*3.14159/180.0;
		//camera.rotation.y=ry*3.14159/180.0;
		//camera.rotation.z=rz*3.14159/180.0;
		cameras[cameras.length]=camera;
	}

	/*addCamera(-260,300,100,-80,-15,180);//camera a p3
	addCamera(80,240,100,0,80,90);//camera a p7
	addCamera(80,0,150,75,0,0)//camera a p10
	addCamera(240,-260,150,80,20,0);//camera a p16
	addCamera(80,-40,150,0,0,0);//camera a p21
	addCamera(-140,-280,150,0,0,0);//camera a p27*/

	addCamera(-260,300,100);//camera a p3
	addCamera(80,240,100);//camera a p7
	addCamera(80,0,150)//camera a p10
	addCamera(240,-260,150);//camera a p16
	addCamera(80,-40,150);//camera a p21
	addCamera(-140,-280,150);//camera a p27

	var cameramode=0;
	function changemode(){
		if (cameramode==0){
			cameramode=1;
		}
		else if(cameramode==1){
			cameramode=0;
		}
	}

	function activeCamera(i){
		if(i==-1){
			RC.camera=camera0;
			car3.add(RC.camera);
		}
		else {
			cameras[i].up=new THREE.Vector3(0,0,1);
			cameras[i].lookAt(car0.position);
			RC.camera = cameras[i];

			//console.log("Camera active: " + i + " " + cameras[i])
		}
	}

	function choisirCamera(){
		var activeNAV=NAV.findActive(car0.position.x,car0.position.y);
		//console.log(activeNAV);
		var nb=parseInt(activeNAV)+1;
		//console.log("nb="+nb);
		switch (nb){
			case 1:
			case 2:
			case 3:
			case 29:
			case 30:
				activeCamera(0);
				//cameras[0].up=new THREE.Vector3(0,0,1);
				//cameras[0].lookAt(car0.position);
				//console.log("camera choisir: 0");
				break;
			case 4:
			case 5:
			case 6:
			case 7:
				activeCamera(1);
				//cameras[1].up=new THREE.Vector3(0,0,1);
				//cameras[1].lookAt(car0.position);
				//console.log("camera choisir: 1");
				break;

			case 8:
			case 9:
			case 10:
			case 11:
				activeCamera(2);
				//cameras[2].up=new THREE.Vector3(0,0,1);
				//cameras[2].lookAt(car0.position);
				break;
			case 12:
			case 13:
			case 14:
			case 15:
			case 16:
			case 17:
			case 18:
				activeCamera(3);
				//cameras[3].up=new THREE.Vector3(0,0,1);
				//cameras[3].lookAt(car0.position);
				break;
			case 19:
			case 20:
			case 21:
			case 22:
			case 23:
				activeCamera(4);
				break;
			case 24:
			case 25:
			case 26:
			case 27:
			case 28:
				activeCamera(5);
				break;
			default :
				activeCamera(-1);break;

		}
	}
	//camera fixes fin


	//Timer begins
	var clockGlobal=new THREE.Clock();
	clockGlobal.stop();

	var text_timer = document.createElement('div');
	text_timer.style.position = 'absolute';
//text2.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
	text_timer.style.width = 200;
	text_timer.style.height = 50;
	//text_timer.style.backgroundColor = "blue";
	//text_timer.innerHTML = clock.getElapsedTime();
	text_timer.style.top = 20 + 'px';
	text_timer.style.left = 20 + 'px';
	document.body.appendChild(text_timer);

	function toXYCoords (pos) {
		var vector = projector.projectVector(pos.clone(), RC.camera);
		vector.x = (vector.x + 1)/2 * window.innerWidth;
		vector.y = -(vector.y - 1)/2 * window.innerHeight;
		return vector;
	}

	var laps=0;
	var clock;
	function isLapFinish(){

		if(car0.position.x>=-260 &&car0.position.x<=-180 &&
		car0.position.y>=130 && car0.position.y<133){
			if(laps==0){
				clock=new THREE.Clock();
				clockGlobal.start();
				clock.start();
				laps++;
			}
			else{
				if(clock.getElapsedTime()>1){
					laps++;
					return true;
				}
				else{
					return false;
				}


			}
			console.log(clockGlobal.getElapsedTime().toFixed(2));

		}
		else return false;

	}

	var bestTime=100000;
	function getBestTime(time){
		if(time<bestTime){
			bestTime=time;
		}
	}
	//clock.start();

	//var bestlap=bestTime;
	var finishTimera=0;
	function doFinish(time){
			finishtime=clock.getElapsedTime().toFixed(2);
			//finishtime=time;
			clock.stop();
			getBestTime(finishtime);
			//clock.stop();
			if (bestTime < 100000) {
				finishTOshow = "<br />Last Lap: " + finishtime + "s" + "<br />Best Lap: " + bestTime + "s";
			}
			else {
				finishTOshow = "<br />Last Lap: " + finishtime + "s" + "<br />Best Lap: " + "s";
			}

			clock = new THREE.Clock();
			clock.start();



	}

	// DEBUG
	//NAV.debug();
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

	indexCamera=0;
	function handleKeys() {

		if (currentlyPressedKeys[67]) // (C) debug
		{
			// debug scene
			//RC.scene.traverse(function(o){
			//	console.log('object:'+o.name+'>'+o.id+'::'+o.type);
			//});
			console.log("active NAV:"+NAV.findActive(car0.position.x,car0.position.y));
			console.log("Car x: "+car0.position.x +" y: "+car0.position.y);

		}				
		if (currentlyPressedKeys[68]) // (D) Right
		{
			vehicle.turnRight(1000) ;
		}
		if (currentlyPressedKeys[81]) // (Q) Left 
		{		
			vehicle.turnLeft(1000) ;
		}
		if (currentlyPressedKeys[90]) // (Z) Up
		{
			vehicle.goFront(1200, 1200) ;

		}
		if (currentlyPressedKeys[83]) // (S) Down 
		{
			vehicle.brake(100) ;
		}

		/*if (currentlyPressedKeys[80]) // (P) Changer le camera
		{

			activeCamera(indexCamera % cameras.length);
			indexCamera++;
			console.log("index:"+indexCamera);
			console.log("active NAV:"+NAV.findActive(car0.position.x,car0.position.y))

		}*/
		if (currentlyPressedKeys[79]) // (O) Changer le camera
		{
			text_timer.innerHTML = "Time: "+clock.getElapsedTime();
		}

		if (currentlyPressedKeys[80]) // (R) Changer le camera
		{
			//console.log("R presse");
			//RC.camera=cameras[cameras.length-1];
			changemode();
			//console.log("camera mode:"+cameramode)


		}

	}


	//	window resize
	function  onWindowResize() {RC.onWindowResize(window.innerWidth,window.innerHeight);}


	function getTimePass(){
		return clock.getElapsedTime();
	}
	var finishTOshow="";
	function render() { 
		requestAnimationFrame( render );
		handleKeys();

		text_timer.innerHTML = "<h3>Lap: "+laps+"</h3>Time: "+"0s"+finishTOshow;
		if(laps!=0){
			text_timer.innerHTML = "<h3>Lap: "+laps+"</h3>Time: "+clockGlobal.getElapsedTime().toFixed(2)+"s"+finishTOshow;
		}

		if(isLapFinish()){
			doFinish();
		}

		// Vehicle stabilization 
		vehicle.stabilizeSkid(50) ; 
		vehicle.stabilizeTurn(1000) ;
		var oldPosition = vehicle.position.clone() ;
		vehicle.update(1.0/60) ;
		var newPosition = vehicle.position.clone() ;
		newPosition.sub(oldPosition) ;
		// NAV
		NAV.move(newPosition.x, newPosition.y, 150,10) ;
		// car0
		car0.position.set(NAV.x, NAV.y, NAV.z) ;
		// Updates the vehicle
		vehicle.position.x = NAV.x ;
		vehicle.position.y = NAV.Y ;
		// Updates car1
		car1.matrixAutoUpdate = false;		
		car1.matrix.copy(NAV.localMatrix(CARx,CARy));
		// Updates car2
		car2.rotation.z = vehicle.angles.z-Math.PI/2.0 ;
		// Rendering
		RC.renderer.render(RC.scene, RC.camera);
		//choisirCamera();
		//handleKeyPress();
		if(cameramode==0){
			activeCamera(-1);
		}
		else if(cameramode==1){
			choisirCamera();
		}




	};

	render(); 
}
