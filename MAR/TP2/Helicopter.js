if(typeof(ModulesLoader)=="undefined")
{
	throw "ModulesLoaderV2.js is required to load script FlyingVehicle.js" ; 
}
// Loads dependencies and initializes this module
ModulesLoader.requireModules(['threejs/three.min.js', 'Physics.js', 'DebugHelper.js']) ;

/** A vehicule  
 * 
 * @param configuration
 * @returns {FlyingVehicle}
 */
function Helicopter(configuration)
{
	if(!configuration.hasOwnProperty('loader')) { configuration.position = new THREE.Vector3(0.0,0.0,0.0) ; }
	if(!configuration.hasOwnProperty('mass')) { configuration.mass = 50 ; }
	if(!configuration.hasOwnProperty('xLength')) { configuration.xLength = 5 ; }
	if(!configuration.hasOwnProperty('yLength')) { configuration.yLength = 2 ; }
	if(!configuration.hasOwnProperty('zLength')) { configuration.zLength = 2 ; }
	if(!configuration.hasOwnProperty('xAngle')) { configuration.xAngle = 0.0 ; }
	if(!configuration.hasOwnProperty('yAngle')) { configuration.yAngle = 0.0 ; }
	if(!configuration.hasOwnProperty('zAngle')) { configuration.zAngle = 0.0 ; }
	if(!configuration.hasOwnProperty('vPales')) { configuration.vPales = 0.08 ; }
	if(!configuration.hasOwnProperty('Loader')) { configuration.Loader = new ThreeLoadingEnv(); }
	if(!configuration.hasOwnProperty('RC')) { configuration.RC =new ThreeRenderingEnv(); }
	//if(!configuration.hasOwnProperty('acceleration')) { configuration.vPales = 0.08 ; }



	this.position = configuration.position ; //new THREE.Vector3(0.0,0.0,0.0) ;
	this.speed = new THREE.Vector3(0.0,0.0,0.0) ;
	this.acceleration = new THREE.Vector3(0.0,0.0,0.0);
	this.mass = configuration.mass ; //50.0 ;

	this.angles = new THREE.Vector3(configuration.xAngle, configuration.yAngle, configuration.zAngle) ;
	this.angularSpeed = new THREE.Vector3(0.0,0.0,0.0) ;

	this.xLength = configuration.xLength ;
	this.yLength = configuration.yLength  ;
	this.zLength = configuration.zLength  ;
	this.vPales = configuration.vPales  ;
	this.Loader = configuration.loader;
	this.RC=configuration.RC;

	var heli=new THREE.Object3D();
	heli.name="heli";
	heli.position=this.position;
	this.RC.addToScene(heli);
	var helicoCorp = this.Loader.loadMesh('assets/helico','helicoCorp','obj',heli,'border',	0,0,0,'front');
	helicoCorp.name="helicoCorp";
	var turbineD = this.Loader.loadMesh('assets/helico','turbine','obj',	helicoCorp,'border',8.5,-3,2,'front');
	var turbineG = this.Loader.loadMesh('assets/helico','turbine','obj',	helicoCorp,'border',-8.5,-3,2,'front');
	var turbineC = this.Loader.loadMesh('assets/helico','turbine','obj',	helicoCorp,'border',0,0,4,'front');
	turbineC.rotation.x=90*3.14159/180;
	var axeD=this.Loader.loadMesh('assets/helico','axe','obj',turbineD,'border',0,1,0,'front');
	var axeG=this.Loader.loadMesh('assets/helico','axe','obj',turbineG,'border',0,1,0,'front');
	var axeC=this.Loader.loadMesh('assets/helico','axe','obj',turbineC,'border',0,1,0,'front');

	var paleD1=this.Loader.loadMesh('assets/helico','pale2','obj',axeD,'border',0,2,0,'front');
	var paleD2=this.Loader.loadMesh('assets/helico','pale2','obj',axeD,'border',0,2,0,'front');
	paleD2.rotation.y=120*3.14159/180;
	var paleD3=this.Loader.loadMesh('assets/helico','pale2','obj',axeD,'border',0,2,0,'front');
	paleD3.rotation.y=240*3.14159/180;

	var paleG1=this.Loader.loadMesh('assets/helico','pale2','obj',axeG,'border',0,2,0,'front');
	var paleG2=this.Loader.loadMesh('assets/helico','pale2','obj',axeG,'border',0,2,0,'front');
	paleG2.rotation.y=120*3.14159/180;
	var paleG3=this.Loader.loadMesh('assets/helico','pale2','obj',axeG,'border',0,2,0,'front');
	paleG3.rotation.y=240*3.14159/180;

	var paleC1=this.Loader.loadMesh('assets/helico','pale2','obj',axeC,'border',0,2,0,'front');
	var paleC2=this.Loader.loadMesh('assets/helico','pale2','obj',axeC,'border',0,2,0,'front');
	paleC2.rotation.y=120*3.14159/180;
	var paleC3=this.Loader.loadMesh('assets/helico','pale2','obj',axeC,'border',0,2,0,'front');
	paleC3.rotation.y=240*3.14159/180;

	var pales=[paleC1,paleC2,paleC3,paleD1,paleD2,paleD3,paleG1,paleG2,paleG3];





	this.force = new THREE.Vector3(0.0,0.0,0.0) ;
	this.momentum = new THREE.Vector3(0.0,0.0,0.0) ;

	this.turn = false ;

	this.weight = function()
	{
		return this.mass * Physics.G ;
	} ;

	/**
	 *  Resets aplied forces and momentum
	 */
	this.reset = function()
	{
		this.momentum.set(0,0,0) ;
		this.force.set(0,0,0) ;
		this.turn = false ;
	} ;

	/**
	 *  Multiplies the provided momentum by the inverse of the inertia matrix.
	 */
	this.multiplyInverseInertia = function(momentum)
	{
		var a = this.mass*(this.yLength*this.yLength+this.zLength*this.zLength) ;
		var b = this.mass*(this.xLength*this.xLength+this.zLength*this.zLength) ;
		var c = this.mass*(this.xLength*this.xLength+this.yLength*this.yLength) ;
		return new THREE.Vector3(momentum.x/a, momentum.y/b, momentum.z/c) ;
	} ;

	/** Applies the vehicle rotations to the provided vector
	 *
	 */
	this.applyRotations = function(localVector)
	{
		var result = localVector.clone() ;
		result.applyEuler(new THREE.Euler(this.angles.x, this.angles.y, this.angles.z, 'XYZ')) ;
		return result ;
	} ;

	/**
	 *  Applies a force on the object
	 *  @param relativePosition {THREE.Vector3} The position (in local coordinates) of point on which the force
	 *  	   is applied
	 *  @param forceVector {THREE.Vector3} The force vector
	 */
	this.applyForce = function(relativePosition, forceVector)
	{
		var tmp = this.applyRotations(forceVector) ;
		this.force.add(tmp) ;
		var oriented = this.applyRotations(relativePosition) ;
		oriented.cross(tmp) ;
		this.momentum.add(oriented) ;
	} ;

	this.goUp = function(frontRight,frontLeft,rearRight,rearLeft)
	{
		this.applyForce(new THREE.Vector3(this.xLength/2, this.yLength/2, -this.zLength/2), new THREE.Vector3(0,0,frontRight)) ;
		this.applyForce(new THREE.Vector3(this.xLength/2, -this.yLength/2, -this.zLength/2), new THREE.Vector3(0,0,frontLeft)) ;
		this.applyForce(new THREE.Vector3(-this.xLength/2, this.yLength/2, -this.zLength/2), new THREE.Vector3(0,0,rearRight)) ;
		this.applyForce(new THREE.Vector3(-this.xLength/2, -this.yLength/2, -this.zLength/2), new THREE.Vector3(0,0,rearLeft)) ;
	} ;

	this.goFront = function(left, right)
	{
		this.applyForce(new THREE.Vector3(-this.xLength/2, this.yLength/2, 0.0), new THREE.Vector3(right,0,0)) ;
		this.applyForce(new THREE.Vector3(-this.xLength/2, -this.yLength/2, 0.0), new THREE.Vector3(left,0,0)) ;
	} ;

	this.brake = function(strength)
	{
		var force = strength*(this.speed.dot(this.frontDirection())) ;
		this.goFront(-force, -force) ;
	} ;

	this.turnLeft = function(force)
	{
		this.turn = true ;
		this.applyForce(new THREE.Vector3(-this.xLength/2, -this.yLength/2, 0.0), new THREE.Vector3(0,-force,0)) ;
		this.applyForce(new THREE.Vector3(this.xLength/2, this.yLength/2, 0.0), new THREE.Vector3(0,force,0)) ;
	} ;

	this.turnRight = function(force)
	{
		this.turn = true ;
		this.applyForce(new THREE.Vector3(this.xLength/2, -this.yLength/2, 0.0), new THREE.Vector3(0,-force,0)) ;
		this.applyForce(new THREE.Vector3(-this.xLength/2, this.yLength/2, 0.0), new THREE.Vector3(0,force,0)) ;
	} ;

	this.goRight = function(force)
	{
		this.applyForce(new THREE.Vector3(-this.xLength/2, -this.yLength/2, 0.0), new THREE.Vector3(0,-force,0)) ;
		this.applyForce(new THREE.Vector3(this.xLength/2, -this.yLength/2, 0.0), new THREE.Vector3(0,-force,0)) ;
	};

	this.goLeft = function(force)
	{
		this.applyForce(new THREE.Vector3(-this.xLength/2, this.yLength/2, 0.0), new THREE.Vector3(0,force,0)) ;
		this.applyForce(new THREE.Vector3(this.xLength/2, this.yLength/2, 0.0), new THREE.Vector3(0,force,0)) ;
	};

	this.frontDirection = function()
	{
		return this.applyRotations(new THREE.Vector3(1.0,0.0,0.0)) ;
	} ;

	this.rightDirection = function()
	{
		return this.applyRotations(new THREE.Vector3(0.0,1.0,0.0)) ;
	} ;

	this.upDirection = function()
	{
		return this.applyRotations(new THREE.Vector3(0.0,0.0,1.0)) ;
	} ;

	this.stabilizeSkid = function(factor)
	{
		// Stabilization (stops the skid)
		var dot = this.speed.dot(this.rightDirection());
		this.goRight(factor*dot) ; // 1000.0
	} ;

	this.stabilizeTurn = function(factor)
	{
		if(!this.turn)
		{
			this.turnRight(factor*this.angularSpeed.z) ; // 1000.0
		}
	} ;

	this.stopAngularSpeedsXY = function()
	{
		this.angularSpeed.x=0.0 ;
		this.angularSpeed.y=0.0 ;
	} ;

	/** Updates the vehicle based on provided forces.
	 *
	 */
	this.update = function(dt)
	{
		// Forces stabilization around X and Y. (due to some identified instabilities).
		// Adds gravity
		this.force.add(new THREE.Vector3(0,0,-this.weight())) ;
		// Orientation
		var angularAcceleration = this.multiplyInverseInertia(this.momentum) ;
		angularAcceleration.multiplyScalar(dt) ;
		this.angularSpeed.add(angularAcceleration) ;
		var angularSpeed = this.angularSpeed.clone() ;
		angularSpeed.multiplyScalar(dt) ;
		this.angles.add(angularSpeed) ;
		// Position and speed
		result = Physics.eulerIntegration(this.mass, dt, this.position, this.speed, this.force) ;
		this.position = result.position ;
		this.speed = result.speed ;

		var newForce = this.force.clone();
		this.acceleration = newForce.multiplyScalar(1/this.mass);
		// Resets everything
		this.reset() ;
	} ;

	this.runPales=function(){
		//var v=vitesse;
		var norm_v=calcule_norm(this.speed);
		for(i=0;i<pales.length;i++){
			pales[i].rotation.y+=norm_v;
		}

	};


	function calcule_norm(vect){
		var x=vect.x;
		var y=vect.y;
		var res=Math.sqrt(x*x+y*y);
		return res;
	}


	//Q2
	this.orient_heli = function(){

		//heli.rotateOnAxis(vector_v, vitesse);
		var x=this.speed.x;
		var y=this.speed.y;
		var angle=Math.atan2(y,x);
		heli.rotation.z+=angle;
		//run_pales_v(vitesse);
	};


	//Q3
	this.orient_turbine = function (){
		var x=this.acceleration.x;
		var y=this.acceleration.y;
		var angle=Math.atan2(y,x);
		console.log("Angle acc:"+angle+" x,y "+x+" "+y);
		turbineD.rotation.z+=angle;
		turbineG.rotation.z+=angle;
		//var vitesseAcc=vitesse;
		//run_pales(vitesseAcc,0.3);

	};

}