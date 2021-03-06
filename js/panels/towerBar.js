var StageTowerBar = StageBar.sub();
StageTowerBar.prototype._init = function (game,userData,screenSize){
	this.game = game;
	this.width = Math.round(screenSize.width/3*2);
	this.height = Math.round(screenSize.height/14);
	this.x = screenSize.width - this.width;
	this.y = screenSize.height/8*7 - this.height - 50;
	
	//alert("enter");
	this.bgImg = img.activeBar;
	this.initBg(438,67,screenSize,true);
	this.bg.x += 28;
	
	this.buttonStartX = Math.round(80/401 * this.width + this.bg.x);
	this.buttons;
	this.initButtons(userData);
}
StageTowerBar.prototype.draw = function (context){
	context.fillStyle = "rgba(100,100,100,0.9)";
}
StageTowerBar.prototype.initButtons = function (userData){
	this.buttons = new Array();
	this.drawStack = this.buttons;
	
	for (var i = 0; i < userData.towers.length; i++){
		var button = new TowerButton(this.game,userData.towers[i]);
		button.width = this.height + 10;
		button.height = Math.round(button.width / 0.9);
		button.x = this.buttonStartX + i*(button.width+25);
		button.y = -10;
		button.centerX = Math.round(button.width/2);
		button.centerY = Math.round(button.height*38/87);
		button.textX = Math.round(button.width * 0.35);
		button.textY = button.height - 6;
		button.hoverTextX = Math.round(button.textX + button.width*0.05);
		button.hoverTextY = Math.round(button.textY + button.width*0.05);
		
		this.buttons.push(button);
	}
}
StageTowerBar.prototype.tick = function (eventHandler){
	var summon = eventHandler.listen("summon");
	if(eventHandler.listen("activeTower")
	   ||eventHandler.listen("activeElf")
	  ){
		if(!this.hide){
			this.hide = true;
			eventHandler.regist("uiFresh");
		}
		return;
	}
	if(this.hide){
		this.hide = false;
		eventHandler.regist("uiFresh");
	}
	this.handleInteractionEvents(eventHandler);
}

var TowerActiveBar = StageBar.sub();
TowerActiveBar.prototype._init = function (game,screenSize){
	this.width = Math.round(screenSize.width/3*2);
	this.height = Math.round(screenSize.height/14);
	this.bgImg = img.activeBar;
	this.initBg(438,67,screenSize,true);
	this.x = screenSize.width - this.width;
	this.bg.x += 28;
	this.y = screenSize.height/8*7 - this.height - 50;
	this.hide = true;
	
	this.buttonWidth  = Math.round((this.height + 10) / 0.9);
	this.buttonHeight = Math.round(this.buttonWidth * 85/89);


	var unsummonButton = new UnsummonButton(game);
	unsummonButton.width = this.buttonWidth;
	unsummonButton.height = this.buttonHeight;
	unsummonButton.x = this.width - unsummonButton.width - 5;
	unsummonButton.y = -10;

	this.infoPanel = new TowerInfoPanel(this);
	this.drawList.infoPanel = this.infoPanel;
	
	this.buttons = [unsummonButton];

	this.drawStack = this.buttons;
}
TowerActiveBar.prototype.tick = function (eventHandler){
	if(!eventHandler.listen("activeTower")){
		if(!this.hide){
			this.hide = true;
			eventHandler.regist("uiFresh");
		}
		return;
	}
	if(this.hide){
		this.hide = false;
		eventHandler.regist("uiFresh");
	}
	this.handleInteractionEvents(eventHandler);
}


var TowerButton = BarButton.sub();
TowerButton.prototype._init = function (game,towerName){
	console.log(towerName);
	var buttonData = game.db.tower.getDataByName(towerName);
	TowerButton.parent.call(this,towerName,buttonData);
}
TowerButton.prototype.active = function (eventHandler){
	if(eventHandler.listen("summon")) return;
	if(this.checkCost(eventHandler)){
		audio.play('stageClick');
		eventHandler.regist("summon",{name:this.name,cost:this.cost,type:"tower"});
		console.warn(this.name,"active");
	}
}
TowerButton.prototype.draw = function (context,eventHandler){
	var summon = eventHandler.listen("summon")
	if(summon && summon.name == this.name){
		context.fillStyle = "rgba(220,220,220,0.4)";
		context.beginPath();
		context.arc(this.centerX,this.centerY,this.centerX + 10,0,6.29,true);
		context.closePath();
		context.fill();
	}
	TowerButton.parent.prototype.draw.call(this,context);
	
	if(this.cost.mena <= eventHandler.listen("asset").mena){
		context.fillStyle = "#fff59b";
	}else{
		context.fillStyle = "red";
	}
	context.fillText(this.cost.mena,this.textX,this.textY);
}

var UnsummonButton = BarButton.sub();
UnsummonButton.prototype._init = function (game){
	this.game = game;
	UnsummonButton.parent.call(this,"unsummon",{buttonPic:img.unsummonButton});
}
UnsummonButton.prototype.active = function (eventHandler){
	var activeTowerData = eventHandler.listen("activeTower");
	var tower = activeTowerData.tower;
	var towerCost = this.game.db.tower.getDataByName(tower.name).cost.mena;
	var pauseEvent = eventHandler.listen("pause");
	if(pauseEvent && tower.summonTime && tower.summonTime == pauseEvent.time){
		var unsummonIncome = towerCost * -1;
	}else{
		var unsummonIncome = towerCost * -0.5;		
	}
	audio.play('stageClick');
	eventHandler.regist("clearTouch");
	eventHandler.remove("touch");
	eventHandler.regist("unsummon",{activeTowerData:activeTowerData,cost:unsummonIncome});
	
//	activeTowerData.tower.unsummon(eventHandler);
//	eventHandler.regist("cost",{mena:unsummonIncome});
//	eventHandler.remove("activeTower");
}

var TowerInfoPanel = Drawable.sub();
TowerInfoPanel.prototype._init = function (towerActiveBar){
	console.log("init");
	this.height = towerActiveBar.height;
	this.width = Math.round(this.height/67*133);
	this.x = Math.round(towerActiveBar.width * 0.12);
	this.y = 0;
	this.textStartX=Math.round(this.width*0.1);
	this.textStartY=Math.round(this.height*0.4);
	
	this.img = img.infoPanel;
	this.damageData;
	this.attackDelayData;
}

TowerInfoPanel.prototype.draw = function (context,eventHandler){
	var activeTowerData = eventHandler.listen("activeTower");
	if(activeTowerData){
		var tower = activeTowerData.tower;
		this.damageData = Utils.sliceNumberAfterDot(tower.realDamage,1);
		this.attackDelayData = Utils.sliceNumberAfterDot(tower.realAttackDelay,1);

	}
	context.drawImage(this.img,0,0,this.width,this.height);
	context.fillStyle = "#fff59b";
	context.fillText("伤害 : "+this.damageData,this.textStartX,this.textStartY);
	context.fillText("攻击间隔 : "+this.attackDelayData,this.textStartX,this.textStartY + 20);
}

