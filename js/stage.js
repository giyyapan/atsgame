var Stage = Drawable.sub();
Stage.prototype._init = function (stageName,game){
	this.game = game;
	var stageInfo = this.game.db.stage.getDataByName(stageName);

	this.tickDelay = this.game.user.getUserData().setting.frameRate;
	//this.tickDelay = 300;
	this.tickDelay = 55;
	this.tickPerSec = 1000/this.tickDelay;
	this.secTick = 1;
	//alert(this.tickDelay);
	console.log(stageName);
	
	this.stageName = stageName;
	this.screen = {
		J:$("#canvasScreen"),
		node:document.getElementById("canvasScreen"),
	}
	this.screenSize = game.screenSize;
	this.fontSize = Math.round(this.screenSize.height/this.screenSize.defautHeight * 21) + 'px',
	this.canvas = {
		J:$("#canvas"),
		node:document.getElementById("canvas"),
	}
	this.bgCanvas = {
		J:$("#bgcanvas"),
		node:document.getElementById("bgCanvas"),
	}
	this.uiCanvas = {
		J:$("#uiCanvas"),
		node:document.getElementById("uiCanvas"),
	}
	this.canvas.J.hide();
	this.bgCanvas.J.hide();
	this.uiCanvas.J.hide();
	this.width = this.canvas.node.width;
	this.height = this.canvas.node.height;
	
	this.context = this.canvas.node.getContext("2d");
	this.bgContext = this.bgCanvas.node.getContext("2d");
	this.uiContext = this.uiCanvas.node.getContext("2d");

	this.context.clearRect(0,0,this.width,this.height);
	this.bgContext.clearRect(0,0,this.width,this.height);
	this.uiContext.clearRect(0,0,this.width,this.height);

	this.initBackground(stageInfo.bg);
	this.ticker = 1;
	
	this.eventHandler = new EventHandler(this.ticker);
	this.field  = new BattleField(stageInfo,this.game,this.screenSize,this.eventHandler);
	this.initManagers(stageInfo,this.screenSize,stageName);
	this.initDrawStack();

	this.initExitBox(this.screenSize,this.eventHandler);
	
	this.enableMouse = true;
	
	this.mouse = {x:0,y:0,pushed:false};
	this.touch = {x:0,y:0,pushed:false};
	var self = this;
	
	this.uiCanvas.node.onmousemove = function (e){
	    self.mouse.x = e.pageX - self.screen.node.offsetLeft;
	    self.mouse.y = e.pageY - self.screen.node.offsetTop;
	    //self.mouse.x = e.offsetX;
	//	self.mouse.y = e.offsetY;
	};
	this.uiCanvas.node.onmouseover = function (e){
		self.mouse.enter = true;
		//console.log('mouse enter');
	}
	this.uiCanvas.node.onmouseout = function (e){
		self.mouse.enter = false;
		//console.log('mouse out');
	}
	this.uiCanvas.node.onmousedown = function (e){
		self.mouse.pushed = true;
	};
	this.uiCanvas.node.onmouseup = function (e){
		self.mouse.pushed = false;
	};
	this.drawList.tickTime = new Drawable();
	this.drawList.tickTime.draw = function (context){
		return;
		context.fillStyle = "black";
		//context.fillText(Math.round(1000/self.tickTime),80,100);
		context.fillText(self.drawTime,80,100);
		context.fillText(self.tickTime,80,150);
	}
	this.uiCanvas.node.ontouchmove = function (e){
		e.preventDefault();
		var touch = e.touches[0];
		self.touch.x = touch.pageX - self.canvas.node.offsetLeft;
		self.touch.y = touch.pageY - self.canvas.node.offsetTop;
		//self.touch.x = touch.offsetX;
		//self.touch.y = touch.offsetY;
	}
	
	this.uiCanvas.node.ontouchstart = function (e){
		e.preventDefault();
		self.touch.pushed = true;
		var touch = e.touches[0];
		self.touch.x = touch.pageX - self.canvas.node.offsetLeft;
		self.touch.y = touch.pageY - self.canvas.node.offsetTop;
		//self.touch.x = touch.offsetX;
		//self.touch.y = touch.offsetY;
	}
	this.uiCanvas.node.ontouchend = function (e){
		e.preventDefault();
		self.touch.pushed = false;
		self.touch.x = e.pageX - self.canvas.node.offsetLeft;
		self.touch.y = e.pageY - self.canvas.node.offsetTop;
		//self.touch.x = touch.offsetX;
		//self.touch.y = touch.offsetY;
	}
}
Stage.prototype.initExitBox = function (screenSize,eventHandler){
	var self = this;
	this.exitBox = {
		J:$("#canvasExitBox"),
		node:document.getElementById("canvasExitBox"),
	}
	this.exitBox.J.hide();
	this.exitBox.node.ontouchstart = function (e){
		e.preventDefault();
	}
	this.exitBox.node.ontouchmove = function (e){
		e.preventDefault();
	}
	
	document.getElementById("exitBoxRestartButton").ontouchend
		= document.getElementById("exitBoxRestartButton").onmouseup
		= function (){
		    audio.stopAll()
			audio.play("buttonClick");
			eventHandler.regist("restartStage",{exit:true});
			eventHandler = null;
	}
	document.getElementById("exitBoxExitButton").ontouchend
		= document.getElementById("exitBoxExitButton").onmouseup
		= function (){
			audio.play("buttonClick");
			//self.exitBox.J.fadeOut();
			eventHandler.regist("endStage",{exit:true});
			eventHandler = null;
	}
	document.getElementById("exitBoxCancelButton").ontouchstart
		= document.getElementById("exitBoxCancelButton").onmousedown
		= function (){
			audio.play("buttonClick");
			eventHandler.remove("exitPushed");
			self.exitBox.J.fadeOut("fast");
	}
}
Stage.prototype.initManagers = function (stageInfo,screenSize,stageName){
	
	this.panelManager = new PanelManager(this.game,stageInfo,screenSize,this.eventHandler);
	this.bgFieldManager = new BgFieldManager(stageInfo,screenSize,this.eventHandler);
	this.waveManager = new WaveManager(stageInfo,screenSize,this.eventHandler);
	this.magicSpringManager = new MagicSpringManager(this.game,stageInfo,this.field,this.eventHandler);
	this.summonManager = new SummonManager(this.field);
	this.extralDrawableManager = new ExtralDrawableManager(this.field);
	this.statusManager = new StatusManager(this.eventHandler,this);
	this.elfEventManager = new ElfEventManager(this.game,this.field,this.eventHandler);
	this.storyManager = new StoryManager(this.game,stageName,screenSize,this.eventHandler);

}
Stage.prototype.initDrawStack = function (){
	//panelManager & bgFieldManager is on other Layer
	this.drawStack = [this.field];
}
Stage.prototype.start = function (){
	var battleBgm = 'battleBgm'+Math.floor(Math.random()/0.33+1);
	audio.play(battleBgm);
	audio.setVolume(battleBgm,1);
	setTimeout(function (){
		$("#desktopExtraBoxRight").css(
			{right:window.innerWidth/2 - 270 - 300});
		$("#desktopExtraBoxLeft").css(
			{left:window.innerWidth/2 - 270 - 300});
	},200);
	this.eventHandler.regist('battleBgm',battleBgm);
	var self = this;
	this.gameStartTime = new Date().getTime();
	this.eventHandler.regist("uiFresh");
	this.panelManager.showStartingAnimation(this.eventHandler);
	this.eventHandler.regist("bgFresh");
	
	this.screen.J.show();
	this.canvas.J.show();
	this.bgCanvas.J.show();
	this.uiCanvas.J.show();
	
	window.requestAnimationFrame(function (){
		self.lastTickTime = self.gameStartTime;
		self.next();
		self = null;
	});
	//console.log(Static);
	
}
Stage.prototype.loadImages = function (callback){
	callback();
}
Stage.prototype.next = function (){
	//alert ("enterNext1");
	if(this.ended){
		console.log("end");
		return;
	}
	var time = new Date().getTime();
	if(time - this.lastTickTime >= this.tickDelay){
		this.secTick ++;
		this.lastTickTime = time;
		this.tick();
		this.tickTime = new Date().getTime() - time;
		
		if(this.secTick >= this.tickPerSec){
			this.uiContext.font = 'normal '+this.fontSize+' MyFont';	
			this.panelManager.next(this.uiContext,this.eventHandler,true);
			this.secTick = 0;
		}else{
			this.uiContext.font = 'normal '+this.fontSize+' MyFont';
			this.panelManager.next(this.uiContext,this.eventHandler,false);
		}
		this.bgFieldManager.next(this.bgContext,this.eventHandler);
		
		this.context.font = 'normal '+this.fontSize+' MyFont';	
		this.context.clearRect(0,0,this.width,this.height);
		this.context.save();
		this.onDraw(this.context,this.eventHandler);
		this.context.restore();
		this.drawTime = new Date().getTime() - time;

		//change cursor
		if (this.eventHandler.listen('hover')){
			this.uiCanvas.J.css('cursor','pointer');
			this.eventHandler.remove('hover');
		}else{
			this.uiCanvas.J.css('cursor','');
		}
	}
	var self = this;
	window.requestAnimationFrame(function (){
		self.next();
		self = null;
	});
}
Stage.prototype.tick = function (){
	//console.log(this.eventHandler.countEvents());
	//alert("tick1");
	this.eventHandler.regist("time",this.ticker);
	this.handleInteractionEvents(this.eventHandler);

	this.storyManager.tick(this.eventHandler);
	//story manager active before endstage

	this.handleStageEvents(this.eventHandler);

	this.panelManager.tick(this.eventHandler);
	this.statusManager.tick(this.eventHandler);
	this.waveManager.tick(this.eventHandler);
	this.elfEventManager.tick(this.eventHandler);
	this.summonManager.tick(this.eventHandler);
	this.extralDrawableManager.tick(this.eventHandler);
	this.magicSpringManager.tick(this.eventHandler);

	this.field.tick(this.eventHandler)
	this.eventHandler.tick(this.ticker);

	if(!this.eventHandler.listen("pause")){
//		if(this.ticker == 30){
//			this.ticker = 1;
//			this.eventHandler.resetTicker(30)
			//console.log("log");
//		}else{
			this.ticker ++;
//		}
	}
//	console.log(this.ticker);
}
Stage.prototype.handleStageEvents = function (eventHandler){
	var exitPushed = eventHandler.listen("exitPushed");
	if(exitPushed){
		//exit pushed
		//eventHandler.remove("exitPushed");
		this.exitBox.J.fadeIn("fast");
		this.eventHandler.remove("touch");
	}
	var endStageResult = eventHandler.listen("endStage");
	var restartStage = eventHandler.listen ("restartStage");
	if(endStageResult){

		//end stage
		if(eventHandler.listen("stageEnded"))
			return;

		if(endStageResult.exit){
			audio.stopAll();
			this.ended = true;
			eventHandler.regist("stageEnded");
			this.context.clearRect(0,0,this.width,this.height);
			this.uiContext.clearRect(0,0,this.width,this.height);
			this.bgContext.clearRect(0,0,this.width,this.height);
			this.onDraw = function(){};

			this.game.endStage(this.stageName,endStageResult);
			return;
		}
		if(eventHandler.listen("pause")){
			return;
		}
		audio.stopAll();
		var userData = this.game.user.getUserData();
		endStageResult.time = Math.round((new Date().getTime() - this.gameStartTime)/1000);
		endStageResult.score = this.panelManager.headerBar.score;
		waveData = eventHandler.listen ("waveNum");
		endStageResult.clearedWave = waveData.now - 1;
		if (waveData.level){
			endStageResult.level = waveData.level;
		}else{
			endStageResult.allWave = waveData.all;
		}
		endStageResult.life = this.panelManager.statusBox.life;
		endStageResult.mena = this.panelManager.statusBox.mena;
		endStageResult.elves = new Array();
		for (var i = 0; i < userData.elves; i++){
			endStageResult.elves.push(userData.elves[i]);
		}
		endStageResult.towers = new Array();
		for (var i = 0; i < userData.towers; i++){
			endStageResult.towers.push(userData.towers[i]);
		}

		eventHandler.regist("stageEnded");
		console.log("Stage Ended!");
		this.ended = true;
		this.context.clearRect(0,0,this.width,this.height);
		this.uiContext.clearRect(0,0,this.width,this.height);
		this.bgContext.clearRect(0,0,this.width,this.height);

		this.game.endStage(this.stageName,endStageResult);
		this.onDraw = function(){};

		console.log(this.stageName);
		return;
	}
	if(restartStage){
		//restart stage
		if(eventHandler.listen("stageEnded"))
			return;
		this.ended = true;
		this.context.clearRect(0,0,this.width,this.height);
		this.uiContext.clearRect(0,0,this.width,this.height);
		this.bgContext.clearRect(0,0,this.width,this.height);
		this.game.restartStage(this.stageName);
		eventHandler.regist("stageEnded");
		console.log("Stage Restarted!");
	}
}
Stage.prototype.initBackground = function (img){
	var background = document.getElementById("canvasBackground");
	background.src = img.src;
	background.width = this.width;
	background.height = this.height;
	background.onmousedown = function (e){
		e.preventDefault();
	}
}
Stage.prototype.draw = function (context){
	//context.drawImage(this.img,0,0,this.width,this.height);
}

Stage.prototype.handleInteractionEvents = function (eventHandler){
	if(eventHandler.listen("clearTouch")){
		eventHandler.remove("clearTouch");
		this.touch.pushed = false;
		this.mouse.pushed = false;
	}
	if (this.mouse.enter){
		var mouse = {
			x:this.mouse.x,
			y:this.mouse.y
		}
		eventHandler.regist("mouseover",mouse);
	}
	if(this.mouse.pushed){
		var touch = {
			x:this.mouse.x,
			y:this.mouse.y
		}
		//console.log(touch.x,touch.y);
		eventHandler.regist("touch",touch);
		return;
	}
	if(this.touch.pushed){
		eventHandler.regist("touch",this.touch);
		return;
	}
	eventHandler.remove("touch");
}

