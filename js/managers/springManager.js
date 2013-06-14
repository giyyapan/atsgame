var MagicSpringManager = Class.sub();
MagicSpringManager.prototype._init = function (game,stageInfo,field,eventHandler){
	this.elves = game.user.getUserData().elves;
	this.cells = field.cells;
	var viewerData = eventHandler.listen("initPauseButton");
	if(this.elves.length == 0){
		this.elves = ["water","earth","thunder"];
	}
	if(!stageInfo.springNum){
		this.tick = function(){};
		return;
	}
	if(!viewerData){
		console.error("init viewer failed",eventHandler);
	}
	this.viewer = viewerData.viewer;
	eventHandler.remove("initPauseButton");
	
	this.freshTick = 100;
	this.freshTick = 1200;
	
	this.viewer.ticker = this.freshTick;
	this.viewer.freshTick = this.freshTick;

	this.springCells = new Array();
	
	this.springNum = stageInfo.springNum;
	if(stageInfo.defaultElfNum && this.elves.length <= stageInfo.defaultElfNum){
		this.springData = stageInfo.magicSpring;
	}

	this.randomMaxFailTime = 5;


	this.freshSpring();
}
MagicSpringManager.prototype.tick = function (eventHandler){
	//handle spring fresh events
	if (eventHandler.listen("pause")){
		return;
	}
	if(this.viewer.ticker == 0){
		eventHandler.regist("freshSpring")
		this.freshSpring();
		this.viewer.ticker = this.freshTick;
		this.viewer.showFreshSpringAnimation(eventHandler);
		console.log("fresh spring")
		return;
	}else{
		eventHandler.remove("freshSpring");
	}
	for (var i = 0; i < this.springCells.length; i++){
		var nowSpring = this.springCells[i].magicSpring;
		if (nowSpring.rad < Math.PI * 2){
			nowSpring.rad += 0.04;
		}else{
			nowSpring.rad = 0;
		}
		nowSpring.ctxAlpha = Math.abs(Math.cos(nowSpring.rad))+0.15;
		if(nowSpring.ctxAlpha < 0.55)
			nowSpring.ctxAlpha = 0.55;
	}
	this.viewer.ticker --;
}
MagicSpringManager.prototype.freshSpring = function (){
	audio.play('freshSpring');
	for (var i = 0; i < this.springCells.length; i++){
		this.springCells[i].removeMagicSpring();
	}
	this.springCells = new Array();
	
	var timer = 0;
	for(var i in this.springData){
		var nowSpring =  this.springData[i];
		//console.log(nowSpring);
		this.springCells.push(
			this.cells[nowSpring.x][nowSpring.y].setMagicSpring(nowSpring.element)
		);
		timer ++;
	}
	var failTime = 0;
	while(timer < this.springNum){
		if(failTime >= this.randomMaxFailTime){
			failTime = 0;
			timer ++;
			continue;
		}
		var nowSpring = this.randomSpring();
		if(nowSpring){
			if(!this.cells[nowSpring.x] || !this.cells[nowSpring.x][nowSpring.y]){
				failTime ++;
				continue;
			}

			var nowCell = this.cells[nowSpring.x][nowSpring.y];
			if(nowCell.summoner||nowCell.demonGate||!nowCell.type){
				failTime ++;
				continue;
			}
			this.springCells.push(nowCell.setMagicSpring(nowSpring.element));
			timer ++;
		}else{
			//console.log("enter");
			failTime ++;
		}
	}
}
MagicSpringManager.prototype.randomSpring = function (){
	var springData = {};
	var random = Math.random();
	

	var x = Math.floor(Math.random() * 10);
	if(x >= 9) x -= Math.floor(Math.random() * 10);
	
	var y = Math.floor(Math.random() * 10);
	if(y >= 9) y -= Math.floor(Math.random() * 10);

	//console.log("random:",x,y);
	for (var i = 0; i < this.springCells.length; i++){
		var nowCell = this.springCells[i];
		if(nowCell.row == x && nowCell.line == y)
			return false;
	}
	springData.x = x;
	springData.y = y;
	

	switch(this.elves.length){
	case 1 :
		springData.element = this.elves[0];
		break;
	case 2 :
		if (random < 0.5){
			springData.element = this.elves[0];
		}else{
			springData.element = this.elves[1];			
		}
		break;
	case 3 :
		if (random < 0.33){
			springData.element = this.elves[0];
		}else if (random < 0.66){
			springData.element = this.elves[1];
		}else{
			springData.element = this.elves[2];
		}
		break;
	}
	return springData;
}
