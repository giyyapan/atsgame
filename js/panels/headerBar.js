var StageHeaderBar = StageBar.sub();
StageHeaderBar.prototype._init = function (game,stageInfo,screenSize,eventHandler){
	this.width = screenSize.width;
	this.height = Math.round(screenSize.height/9);
	//this.height = 109 * screenSize.height / screenSize.defautHeight;
	//this.width = screenSize.width;
	this.bgImg = img.headerBar;
	this.score = 0;
	eventHandler.regist("initHeaderBar",this);
	this.initBg(722,109,screenSize,true);
	
	this.x = 0;
	this.y = 0;
	this.pauseButton = new PauseButton(this,screenSize,eventHandler);

	this.exitButton = new ExitButton(this,screenSize,eventHandler);

	this.buttons = [this.pauseButton,this.exitButton];
	this.drawStack = this.buttons;
	this.waveNum = {
		now:0,
		all:stageInfo.waveData.length,
	};
	this.textX = Math.round(80/722 * this.width);
	if(this.bg.x > 0)
		this.textX += Math.round(this.bg.x);
	
}
StageHeaderBar.prototype.draw = function (context,eventHandler){

	context.fillStyle = "#fff59b";
	context.fillText("Score  "+this.score,this.width - this.textX - 90,25);
	if(this.waveNum.all){
		context.fillText("Wave  "+this.waveNum.now+"/"+this.waveNum.all,this.textX,25);
	}else{
		context.fillText("Wave  "+this.waveNum.level+"-"+this.waveNum.now+'/'+this.waveNum.waveNum,55,25);
	}
	
	//context.fillStyle = "rgba(20,20,20,0.2)"
	//context.fillRect(0,0,this.width,this.height);
}
StageHeaderBar.prototype.tick = function (eventHandler){
	if(eventHandler.listen("summon")){
		return;
	}
	this.waveNum = eventHandler.listen("waveNum");
	
	if(eventHandler.listen("pause")){
		if(this.exitButton.hide){
			this.exitButton.hide = false;
			eventHandler.regist("uiFresh");
		}
	}else{
		if(!this.exitButton.hide){
			this.exitButton.hide = true;
			eventHandler.regist("uiFresh");
		}
		this.pauseButton.pointer.rad = -Math.PI * 2 * this.pauseButton.pointer.ticker / this.pauseButton.pointer.freshTick;
	}
	this.handleInteractionEvents(eventHandler);
}
var ExitButton = BarButton.sub();
ExitButton.prototype._init = function (headerBar,screenSize,eventHandler){
	ExitButton.parent.call(this,"return");
	this.hide = true;
	this.height = Math.round(headerBar.height/3*2)+10;
	this.width = this.height;
	this.x = 10;
	this.y = 20;
	this.img = img.exitButton;
}
ExitButton.prototype.active = function (eventHandler){
	audio.play('buttonClick');
	if(this.hide)return;
	if(eventHandler.listen("summon") || eventHandler.listen("teleporting")||eventHandler.listen("usingSpell"))
		return;
	eventHandler.regist("exitPushed");
	eventHandler.remove("touch");
	eventHandler.regist("clearTouch");
}

var PauseButton = BarButton.sub();
PauseButton.prototype._init = function (headerBar,screenSize,eventHandler){
	PauseButton.parent.call(this,"pause");
	this.height = headerBar.height;
	this.width = Math.round(this.height/109*129);
	this.autoHover = false;
	this.hoverImg = img.pauseButtonHover;
	this.x = headerBar.width/2 - this.width/2 + 1;
	this.y = 0;
	
	this.pointer = new Drawable();
	this.pointer.img = img.pauseButtonPointer;
	this.pointer.height = Math.round(this.width/2*0.85);
	this.pointer.width = Math.round(this.pointer.height*0.32);
	this.pointer.x = Math.round(this.width/2);
	this.pointer.y = Math.round(this.height/2);
	this.pointer.screenSize = screenSize;
	this.pointer.draw = PauseButton.pointerDrawFunc;
	this.pointer.showFreshSpringAnimation = PauseButton.showFreshSpringAnimationFunc;

	this.drawList.pointer = this.pointer;
	
	eventHandler.regist("initPauseButton",{viewer:this.pointer});
}
PauseButton.prototype.draw = function (context,eventHandler){
	//this.hover = true;
	if (this.hover){
		context.drawImage(this.hoverImg,0,0,this.width,this.height);
	}
	//context.fillRect(0,0,this.width,this.height);
}
PauseButton.prototype.active = function (eventHandler){
	audio.play("buttonClick");
	audio.play("pause");
	var nowTime = eventHandler.listen("time");
	if(eventHandler.listen("pause")){
		eventHandler.regist("clearTouch");
		eventHandler.remove("pause");
		audio.setVolume(eventHandler.listen('battleBgm'),1);
		audio.setVolume('bossBgm',1);
		return;
	}
	audio.setVolume(eventHandler.listen('battleBgm'),0.35);
	audio.setVolume('bossBgm',0.35);
	eventHandler.regist("pause",{time:nowTime});
	eventHandler.regist("clearTouch");
}
PauseButton.showFreshSpringAnimationFunc = function (eventHandler){
	var self = this;
	var freshMark = new Drawable();
	freshMark.x = this.screenSize.width/2;
	freshMark.y = 0;
	freshMark.draw = function (context){
		context.fillStyle = "rgba(255,180,0,"+this.alpha+")";
		context.beginPath();
		context.arc(0,0,this.radius,0,Math.PI*2,true);
		context.closePath();
		context.fill();
	}
	freshMark.alpha = 0.8;
	freshMark.radius = 1;
	var ticks = 8;
	var maxRadius = 1200;
	var radiusIncremental = Math.round(maxRadius/ticks);
	eventHandler.registObjectAnimate(
		freshMark,
		{radius:radiusIncremental,
		 alpha:-0.1,
		},
		ticks-1);
	
	var newDrawable = {
		drawable:freshMark,
		ticks:ticks,
	}
 	var extralDrawables = eventHandler.listen("addExtralDrawables");
	if(!extralDrawables){
		var extralDrawables = [newDrawable];
		eventHandler.regist("addExtralDrawables",extralDrawables);
	}else{
		extralDrawables.push(newDrawable);
	}
    
	eventHandler.registDelayFunc(function (){
	    delete newDrawable.drawable;
	    newDrawable = null;
	    freshMark = null;
	},ticks);
}
PauseButton.pointerDrawFunc = function (context,eventHandler){
	context.drawImage(this.img,-this.width/2,-5,this.width,this.height);
}
