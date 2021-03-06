var PanelManager = Drawable.sub();
PanelManager.prototype._init = function(game,stageInfo,screenSize,eventHandler){
	var userData = game.user.getUserData();
	this.screenSize = screenSize;
	this.towerBar = new StageTowerBar(game,userData,screenSize);
	this.towerActiveBar = new TowerActiveBar(game,screenSize);
	
	this.elfBar = new StageElfBar(game,userData,screenSize,eventHandler);
	this.elfActiveBar = new ElfActiveBar(game,userData,screenSize,eventHandler);
	
	this.statusBox = new StageStatusBox(game,stageInfo,screenSize,eventHandler);
	this.headerBar = new StageHeaderBar(game,stageInfo,screenSize,eventHandler);
	this.panels = [
		this.elfBar,
		this.elfActiveBar,
		this.towerBar,
		this.towerActiveBar,
		this.statusBox,
		this.headerBar
	];
	this.drawStack = this.panels;
	this.initPauseMark();
}
PanelManager.prototype.tick = function (eventHandler){
	for (var i = 0; i < this.panels.length; i++){
		if(this.panels[i].tick)
			this.panels[i].tick(eventHandler);
	}
}
PanelManager.prototype.next = function (context,eventHandler,autoFresh){
	if(!eventHandler.listen("uiFresh")){
		if(autoFresh || this.forceFresh){
			if(eventHandler.listen("pause"))
				return;
			context.clearRect(0,0,this.screenSize.width,this.screenSize.height);
			context.save();
			this.onDraw(context,eventHandler);
			//console.log("uiFresh")
			context.restore();
		}
		return;
	}
	if(eventHandler.listen("pause")){
		this.pauseMark.hide = false;
	}else{
		this.pauseMark.hide = true;
	}
	eventHandler.remove("uiFresh");
	//console.log("uiFresh")
	context.clearRect(0,0,this.screenSize.width,this.screenSize.height);
	context.save();
	this.onDraw(context,eventHandler);
	context.restore();

}
PanelManager.prototype.showStartingAnimation = function (eventHandler){
	var self = this;
	var tickNum = 5;
	this.headerBar.y -= this.headerBar.height;
	this.statusBox.y += this.statusBox.height;
	this.towerBar.y += this.statusBox.height;
	this.elfBar.y += this.statusBox.height;

	this.forceFresh = true;
	eventHandler.registObjectAnimate(this.headerBar,{y:Math.round(this.headerBar.height/tickNum)},tickNum);
	eventHandler.registObjectAnimate(this.statusBox,{y:-Math.round(this.statusBox.height/tickNum)},tickNum);
	eventHandler.registObjectAnimate(this.towerBar,{y:-Math.round(this.statusBox.height/tickNum)},tickNum);
	eventHandler.registObjectAnimate(this.elfBar,{y:-Math.round(this.statusBox.height/tickNum)},tickNum);

	eventHandler.registDelayFunc(function (){
		delete self.forceFresh;
		self = null;
	},tickNum);
}
PanelManager.prototype.initPauseMark = function (){
	var screenSize = this.screenSize;
	this.pauseMark = new Drawable();
	this.pauseMark.textX = Math.round(this.screenSize.width - 180);
	this.pauseMark.textY = Math.round(this.screenSize.height/8*6 - 30);
	this.pauseMark.hide = false;
	this.pauseMark.img = img.magicRangeCircle;
	this.pauseMark.radius = 20*screenSize.cellWidth;
	this.pauseMark.draw = function (context){
		//context.drawImage(this.img,screenSize.width/2 - this.radius,screenSize.height/3-this.radius-100,this.radius*2,this.radius*2)
		context.fillStyle = "rgba(255,190,100,0.1)";
		context.fillRect(0,0,screenSize.width,screenSize.height);

		context.fillStyle = "black";
		context.font = "normal 55px MyFont";
		//console.log(this.textX,this.textY)
		context.fillText("Paused",this.textX,this.textY);
	}
	this.drawListBottom.pauseMark = this.pauseMark;
}
