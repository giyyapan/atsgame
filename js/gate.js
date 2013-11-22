var DemonGate = Drawable.sub();
DemonGate.prototype._init = function (game,data,screenSize){
	this.game = game;
	this.gateNum = data.gateNum;
	var gateHeaderData = game.db.battleFieldSprites.getDataByName("demonGateHeader");
	this.header = new Sprite(gateHeaderData);
	this.drawList.header = this.header;
	this.screenSize = screenSize;
	this.x = 0;
	this.y = 0;
	if(data.rad)
		this.rad = data.rad;
}
DemonGate.prototype.tick = function (eventHandler){
	this.header.nextFrame(eventHandler);
	var freshData = eventHandler.listen("freshDemon");
	if(!freshData || freshData.demonData.gate != this.gateNum)
		return false;
	eventHandler.remove("freshDemon");
	//console.log("gate fresh demon id:",freshData.id);

	var demonTypeData = this.game.db.demon.getDataByName(freshData.demonData.name);
	if(freshData.info.fly || (demonTypeData.fly && !freshData.info.noFly)){
		//add a fly demon
		console.log("new flyDemon");
		var newDemon = new FlyDemon(this.game,freshData.demonData.name,freshData,this.screenSize,this,eventHandler);
		this.cell.field.enterFlyDemon(newDemon);
	}else{
		//add a normal demon
		var newDemon = new Demon(this.game,freshData.demonData.name,freshData,this.screenSize,eventHandler);
		newDemon.x = 0;
		newDemon.y = 0;
		this.cell.enterDemon(newDemon);
		newDemon.cell = this.cell;
	}
	this.showFlashLight(eventHandler);
	return true;
}
DemonGate.prototype.showFlashLight= function (eventHandler){
	var flashLight = new Drawable();
	var self = this;
	flashLight.draw = function (context){
		context.fillStyle = "rgba(155,20,20,"+this.alpha+")";
		context.beginPath();
		context.arc(0,0,this.radius,0,Math.PI*2,true);
		context.closePath();
		context.fill();
	}
	flashLight.alpha = 1;
	flashLight.radius = this.header.height;
	var maxRadius = this.header.width * 0.9;
	var radiusIncremental = (maxRadius - flashLight.radius)/5;
	eventHandler.registObjectAnimate(
		flashLight,
		{radius:radiusIncremental,
		 alpha:-0.25,
		},
		5);
	eventHandler.registDelayFunc(function (){
		delete self.header.drawListBottom.flashLight;
		self = null;
	},5);
	this.header.drawListBottom.flashLight = flashLight;
	
}

