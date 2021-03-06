var StageElfBar = StageBar.sub();
StageElfBar.prototype._init = function (game,userData,screenSize,eventHandler){
	this.game = game;
	this.width = Math.round(screenSize.width * 0.73);
	this.height = Math.round(screenSize.height * 0.16);
	
	this.x = screenSize.width - this.width;
	this.y = screenSize.height - this.height;
	this.buttons;
	this.initButtons(userData,eventHandler);
	
	if(userData.elves.length == 0){
		this.tick = function (){};
		return;
	}
}
StageElfBar.prototype.draw = function (context){
	//context.fillRect(0,0,this.width,this.height);5
}
StageElfBar.prototype.initButtons = function (userData,eventHandler){
	this.buttons = new Array();
	this.drawStack = this.buttons;
	var buttonSpacing = Math.round(this.width/3 - this.height);
	
	//console.log(buttonSpacing,this.width,this.height);
	if(userData.elves.length == 0){
		this.tick = function(){};
		for (var i = 0; i < 3; i++){
			var button = new ElfButton(this.game,"unavail",eventHandler,this.height);
			button.x = i*(button.width + buttonSpacing)
			button.y = this.height - button.height - 16;
			this.buttons.push(button);
		}
		return;
	}
	for (var i = 0; i < userData.elves.length; i++){
		var button = new ElfButton(this.game,userData.elves[i],eventHandler,this.height);
		button.x = i*(button.width + buttonSpacing)
		button.y = 0;
		this.buttons.push(button);
	}
	for (var i = userData.elves.length; i < 3; i++){
		var button = new ElfButton(this.game,"unavail",eventHandler,this.height);
		button.x = i*(button.width + buttonSpacing)
		button.y = this.height - button.height - 16;
		this.buttons.push(button);
	}
}
StageElfBar.prototype.tick = function (eventHandler){
	this.handleInteractionEvents(eventHandler);
}
var ElfActiveBar = StageBar.sub();
ElfActiveBar.prototype._init = function (game,userData,screenSize,eventHandler){
	this.game = game;
	this.width = Math.round(screenSize.width/3*2);
	this.height = Math.round(screenSize.height/14);
	this.x = screenSize.width - this.width;
	this.y = screenSize.height/8*7 - this.height - 50;
	//this.bgImg = img.activeBar;
	this.bgImg = img.activeBar;
	
	//alert("enter");
	this.initBg(438,67,screenSize,true);
	this.bg.x += 28;

	this.initInfoPanel();
	
	this.hide = true;

	if(userData.elves.length == 0){
		this.tick = function (){};
		return;
	}

	this.buttonWidth  = Math.round((this.height + 10) / 0.9);
	this.buttonHeight = Math.round(this.buttonWidth * 89/87);
	this.buttonTextX = Math.round(this.buttonWidth * 34/89);
	this.buttonTextY = Math.round(this.buttonHeight * 80/87);
	this.buttonSpacing = 16;
	this.buttonStartX = Math.round(80/401 * this.width + this.bg.x)
	
	this.initTargetSelectBar();
	this.initButtonDepot(userData,eventHandler);
}
ElfActiveBar.prototype.initInfoPanel = function (){
	this.elfInfoPanel = new ElfInfoPanel(this);
	this.spellInfoPanel = new SpellInfoPanel(this);
	this.drawListBottom.elfInfoPanel = this.elfInfoPanel;
	this.drawListBottom.spellInfoPanel = this.spellInfoPanel;
}

ElfActiveBar.prototype.initTargetSelectBar = function (){
	var cancelButton = new CancelButton();
	cancelButton.height = this.buttonHeight;
	cancelButton.width = this.buttonWidth;
	cancelButton.x = this.width-this.buttonWidth - 5;
	cancelButton.y = -10;
	
	var castButton = new CastButton();
	castButton.height = this.buttonHeight;
	castButton.width = this.buttonWidth;
	castButton.x = cancelButton.x - castButton.width - 5;
	castButton.y = -10;

	this.targetSelectButtons = [cancelButton];
	this.undirectionalSpellButtons = [castButton,cancelButton];
}
ElfActiveBar.prototype.initButtonDepot = function (userData,eventHandler){

	this.buttonDepot = {};
	
	for (var elfSub = 0; elfSub < userData.elves.length; elfSub++){
		var elfName = userData.elves[elfSub];
		//console.log(userData.elves.length,elfSub);
		var spells = {};
		var spellsInfo = this.game.db.elf.getDataByName(elfName).spell;
		var userSpellArr = userData.spell[elfName];

		
		var teleportButton = new TeleportButton();
		teleportButton.width = this.buttonWidth;
		teleportButton.height = this.buttonHeight;
		teleportButton.x = this.buttonStartX;
		teleportButton.y = -10;
		teleportButton.textX = this.buttonTextX;
		teleportButton.textY = this.buttonTextY;
		teleportButton.elfName = elfName;

		if(userSpellArr && userSpellArr.length > 0){
			var magicButton = new MagicButton(true);
		}else{
			//console.log("no magic")
			var magicButton = new MagicButton(false);
		}
		magicButton.width = this.buttonWidth;
		magicButton.height = this.buttonHeight;
		magicButton.x = this.buttonWidth + this.buttonSpacing  + this.buttonStartX;
		magicButton.y = -10;
		magicButton.elfName = elfName;

		var levelupButton = new LevelupButton();
		levelupButton.width = this.buttonWidth;
		levelupButton.height = this.buttonHeight;
		levelupButton.x = (this.buttonWidth+this.buttonSpacing)*2 + this.buttonStartX;
		levelupButton.y = -10;
		levelupButton.textX = this.buttonTextX;
		levelupButton.textY = this.buttonTextY;
		levelupButton.elfName = elfName;


		if(userSpellArr){
			for (var spellSub = 0; spellSub < userSpellArr.length; spellSub++){
				var spellName = userSpellArr[spellSub];
				var newButton = new SpellButton(spellsInfo[spellName]);
				newButton.height = this.buttonWidth;
				newButton.width = this.buttonHeight;
				newButton.x = (this.buttonWidth+this.buttonSpacing)*spellSub + 50;
				newButton.y = -10;
				newButton.textX = this.buttonTextX;
				newButton.textY = this.buttonTextY;
				spells[spellsInfo[spellName].name] = newButton;
			}
		}
		this.buttonDepot[elfName] = {};
		this.buttonDepot[elfName].teleportButton = teleportButton;
		this.buttonDepot[elfName].magicButton = magicButton;
		this.buttonDepot[elfName].levelupButton = levelupButton;
		this.buttonDepot[elfName].spells = spells;
	}
	//console.log(this.buttonDepot);
	eventHandler.regist("initElfActiveButton",this.buttonDepot);
}
ElfActiveBar.prototype.tick = function (eventHandler){
	var activeElf = eventHandler.listen("activeElf")
	if(!activeElf){
		delete this.nowActiveElf;
		if(!this.hide){
			this.hide = true;
			eventHandler.regist("uiFresh");
		}
		return;
	}
	if(this.hide){
		this.hide = false;
		eventHandler.regist("uiFresh");
	}else{
		if(this.nowActiveElf && this.nowActiveElf.name != activeElf.name)
			eventHandler.regist("uiFresh");
	}
	this.changeButtons(activeElf,eventHandler);
	this.handleInteractionEvents(eventHandler);
}
ElfActiveBar.prototype.changeButtons = function (activeElf,eventHandler){
	this.nowActiveElf = activeElf;
	this.elfInfoPanel.hide = true;
	this.spellInfoPanel.hide = true;
	var usingSpell = eventHandler.listen("usingSpell")
	if(usingSpell){
		this.type = "spell";
		this.spellInfoPanel.updateSpellData(usingSpell.info,usingSpell.elf);
		if(this.spellInfoPanel.hide){
			this.spellInfoPanel.hide = false;
			eventHandler.regist("uiFresh");
		}
		if(usingSpell.directional == true){
			this.buttons = this.targetSelectButtons;
			this.drawStack = this.buttons;
			return;
		}else{
			this.buttons = this.undirectionalSpellButtons;
			this.drawStack = this.buttons;
			return;
		}
	}
	if(eventHandler.listen("magic")){
		if (this.type == "magic"){
			return;
		}
		//this.elfInfoPanel.hide = false;
		eventHandler.regist("uiFresh");
		var spellButtons = this.buttonDepot[activeElf.name].spells;
		this.buttons = [];
		for(var i in spellButtons){
			this.buttons.push(spellButtons[i]);
		}
		this.drawStack = this.buttons;
		this.type = "magic";
		return;
	}
	if (eventHandler.listen("teleporting")){
		if(this.type == "teleport"){
			return
		}
		this.type = "teleport";
		eventHandler.regist("uiFresh");
		this.buttons = this.targetSelectButtons;
		this.drawStack = this.buttons;
		return;
	}
	if(this.type != "normal"){
		eventHandler.regist("uiFresh");
	}
	this.type = "normal"
	this.elfInfoPanel.hide = false;
	var elfButtons = this.buttonDepot[activeElf.name];
	this.buttons = [elfButtons.teleportButton,
					elfButtons.magicButton,
					elfButtons.levelupButton];
	this.drawStack = this.buttons; 
}
ElfActiveBar.prototype.draw = function (context,eventHandler){
	context.fillStyle = "rgba(100,100,100,0.9)";
	//context.fillRect(0,0,this.width,this.height);
	usingSpellInfo = eventHandler.listen("usingSpell");
	if((usingSpellInfo && usingSpellInfo.directional)|| eventHandler.listen("teleporting")){
		//context.fillStyle = "#fff59b";
		context.fillStyle = "white"
		context.fillText("点击地图格并拖动手指以选择目标",-45,-65);
	}
}
var ElfBarButton = BarButton.sub();
ElfBarButton.prototype._init = function (buttonName,buttonData){
	//console.error(ElfBarButton.prototype);
	if(!buttonName)return;
	//console.error(this,buttonName,buttonData);
	BarButton.call(this,buttonName,buttonData);
}
ElfBarButton.prototype.linkElf = function (elf,eventHandler){
	this.elf = elf;
	this.asset = eventHandler.listen("asset");
}
var ElfButton = ElfBarButton.sub();
ElfButton.prototype._init = function (game,elfName,eventHandler,width){
	if(elfName == "unavail"){
		this.img = img.elfUnavailIcon;
		this.width = width;
		this.height = Math.round(width/1.13);
		this.active = BarButton.lockedButtonActiveFunc;
		this.draw = function (context){
			ElfButton.parent.prototype.draw.call(this,context);	
		};
		return;
	}
	var buttonData = game.db.elf.getDataByName(elfName);
	if(!buttonData){
		console.error("no data of elf:",elfName);
		return false;
	}
	var buttonInfo = eventHandler.listen("initElfButton");
	if (!buttonInfo){
		var buttonInfo = {};
		buttonInfo[elfName] = {elfButton:this};
		eventHandler.regist("initElfButton",buttonInfo);
	}else{
		buttonInfo[elfName] = {elfButton:this};
	}
	ElfButton.parent.call(this,elfName,buttonData);
	
	this.elfSummonCost = 300;
	this.draw = ElfButton.beforeSummonDrawFunc;
	this.width = width;
	this.height = Math.round(width/1.13);
	
	this.energyBar = new Drawable();
	this.energyBar.img = img.elfEnergyBar;
	this.energyBar.width = 	this.energyBar.height =  Math.round(this.width * 0.775);

	this.energyBar.radius = Math.round(this.energyBar.width/2);
	
	//this.energyBar.x = Math.round((this.width - this.energyBar.radius)/2);
	this.energyBar.x = Math.round(this.width/2)-4;
	//console.log(this.energyBar.x);
	this.energyBar.y = this.height - this.energyBar.radius -1 ;
	this.energyBar.draw = ElfButton.energyBarDrawFunc;
	this.energyBar.rad = -0.1;
	this.drawListBottom.energyBar = this.energyBar;
	this.lvTextX = Math.round(this.width * 30/147);
	//34 112
	//147 130
	this.lvTextY = Math.round(this.height * 120/130);

	this.activeMark = new Drawable();
	this.activeMark.x = Math.round(this.width * 69/147);
	this.activeMark.y = Math.round(this.height * 72/130);
	this.activeMark.radius = Math.round(this.width * 93/147/2);
	this.activeMark.elf;
	this.activeMark.draw = ElfButton.activeMarkDrawFunc;

	this.drawListBottom.activeMark = this.activeMark;
	
}
ElfButton.prototype.active = function (eventHandler){
	if(eventHandler.listen("summon"))
		return;
	audio.play('stageClick');
	if(eventHandler.listen("magic")){
		eventHandler.remove("magic");
	}
	console.warn(this.name,"active");
	eventHandler.regist("activeElfButton",{name:this.name});
}
ElfButton.prototype.linkElf = function (elf){
	this.elf = elf;
	this.draw = ElfButton.afterSummonDrawFunc;
	this.activeMark.elf = elf;
}
ElfButton.activeMarkDrawFunc = function (context){
	//console.log("enter");
	if(!this.elf || !this.elf.active)
		return;
	context.fillStyle = "rgba(220,220,220,0.3)";
	context.beginPath();
	context.arc(0,0,this.radius + 10,0,6.29,true);
	context.closePath();
	context.fill();
}
ElfButton.energyBarDrawFunc = function (context){
	context.drawImage(this.img,-this.radius,-this.radius,this.width,this.height);
}

ElfButton.beforeSummonDrawFunc = function (context,eventHandler){
	if(!this.menaCostPanel){
		this.menaCostPanel = new Drawable();
		this.menaCostPanel.img = img.menaCostPanel;
		this.menaCostPanel.width = Math.round(this.width * 0.6);
		this.menaCostPanel.height =
			Math.round(this.menaCostPanel.width * 24/72);
		this.menaCostPanel.x = this.width * 0.15;
		this.menaCostPanel.y = this.height * 0.75;
		this.menaCostPanel.draw = function (context){
			context.drawImage(this.img,0,0,this.width,this.height)
		}

		this.costTextX =
			this.menaCostPanel.x + this.menaCostPanel.width * 0.35;

		this.costTextY =
			this.menaCostPanel.y + this.menaCostPanel.height * 0.78;
		
	}
	ElfButton.parent.prototype.draw.call(this,context);
	this.menaCostPanel.onDraw(context);
	
	if(eventHandler.listen("asset").mena >= this.elfSummonCost){
		context.fillStyle = "#fff59b";
	}else{
		context.fillStyle = "red";
	}
	context.fillText(this.elfSummonCost,this.costTextX,this.costTextY);
}
ElfButton.afterSummonDrawFunc = function (context,eventHandler){
	eventHandler.regist("bgFresh");
	this.energyBar.rad = (110/57.3)*this.elf.mp/1000 - 0.03;
	//console.log(this.energyBar.rad,this.energyBar.img)
	ElfButton.parent.prototype.draw.call(this,context);
	context.fillStyle = "#05501a";
	context.fillText(this.elf.level,this.lvTextX+2,this.lvTextY+2);
        context.fillStyle = "white";
    context.fillText(this.elf.level,this.lvTextX,this.lvTextY);
}

var TeleportButton = ElfBarButton.sub();
TeleportButton.prototype._init = function (){
	TeleportButton.parent.call(this,"teleport",{buttonPic:img.teleportButton});
}
TeleportButton.prototype.active = function (eventHandler){
	//elfManager listen this
	if(this.asset.mena >= this.elf.teleportCost){
		audio.play('stageClick');
		eventHandler.regist("teleportPushed");
	}
	eventHandler.regist("clearTouch");
	eventHandler.remove("touch");
	//console.log("teleport pushed");
}
TeleportButton.prototype.draw = function (context){
	TeleportButton.parent.prototype.draw.call(this,context);
	if(this.asset.mena >= this.elf.teleportCost){
		context.fillStyle = "#fff59b"
	}else{
		context.fillStyle = "red";
	}
	context.fillText(this.elf.teleportCost,this.textX,this.textY);
}
var MagicButton = ElfBarButton.sub();
MagicButton.prototype._init = function (hasSpell){
	if(!hasSpell){
		MagicButton.parent.call(this,"magic",{buttonPic:img.magicButton_locked});
		this.active = BarButton.lockedButtonActiveFunc;
		return;
	}
	MagicButton.parent.call(this,"magic",{buttonPic:img.magicButton});
	
}
MagicButton.prototype.active = function (eventHandler){
	audio.play('stageClick');
	//elfActiveBar listen this
	eventHandler.regist("magic");
	eventHandler.remove("touch");
	eventHandler.regist("clearTouch")
	//console.log("magic pushed");
}

var LevelupButton = ElfBarButton.sub();
LevelupButton.prototype._init = function (eventHandler){
	LevelupButton.parent.call(this,"levelup",{buttonPic:img.levelupButton});
}
LevelupButton.prototype.active = function (eventHandler){
	//elfManger listen this
	if(this.elf.mp >= this.elf.maxMp){
		audio.play('stageClick');
		eventHandler.regist("levelupPushed");
	}
	eventHandler.remove("touch");
	eventHandler.regist("clearTouch");
}
LevelupButton.prototype.draw = function (context,eventHandler){
	LevelupButton.parent.prototype.draw.call(this,context,eventHandler);
	//if(!this.asset) return;
	if(this.elf.mp >= this.elf.maxMp){
		if(this.asset.mena >= this.elf.realLevelupCost){
			context.fillStyle = "#fff59b"
		}else{
			context.fillStyle = "red";			
		}
	}else{
		context.fillStyle = "rbga(140,140,140,1)";
	}
	context.fillText(this.elf.realLevelupCost,this.textX,this.textY);
}
var SpellButton = ElfBarButton.sub();
SpellButton.prototype._init = function (spellInfo){
	SpellButton.parent.call(this,spellInfo.name,{buttonPic:spellInfo.pic,cost:spellInfo.cost});
	this.name = spellInfo.name;
	this.spellInfo = spellInfo;
}

SpellButton.prototype.active = function (eventHandler){
	//elfManger listen this
	if(this.elf.mp >= this.cost.mp
	   && this.asset.mena >= this.cost.mena){
		audio.play('stageClick');
		eventHandler.regist("spellPushed",{info:this.spellInfo});
	}
	eventHandler.remove("touch");
	eventHandler.regist("clearTouch");
}
SpellButton.prototype.draw = function (context){
	SpellButton.parent.prototype.draw.call(this,context);
	if(this.elf.mp >= this.cost.mp){
		if(this.asset.mena >= this.cost.mena){
			context.fillStyle = "#fff59b"
		}else{
			context.fillStyle = "red";			
		}
	}else{
		context.fillStyle = "rbga(140,140,140,1)";
	}
	context.fillText(this.cost.mena,this.textX,this.textY);
}
var CancelButton = ElfBarButton.sub();
CancelButton.prototype._init = function (){
	CancelButton.parent.call(this,"cancel",{buttonPic:img.cancelButton});
}
CancelButton.prototype.active = function (eventHandler){
	//elfManager listen this
	audio.play('stageClick');
	eventHandler.remove("usingSpell");
	eventHandler.remove("teleporting");
	
	eventHandler.regist("clearTouch");
	eventHandler.remove("touch");
}
var CastButton = ElfBarButton.sub();
CastButton.prototype._init = function (){
	CastButton.parent.call(this,"cancel",{buttonPic:img.castButton});
}
CastButton.prototype.active = function (eventHandler){
	audio.play('stageClick');
	eventHandler.regist("castPushed");
	eventHandler.remove("touch");
	eventHandler.regist("clearTouch");
}

var ElfInfoPanel = Drawable.sub();
ElfInfoPanel.prototype._init = function (elfActiveBar){
	this.height = elfActiveBar.height;
	this.width = Math.round(this.height/55*263);
	
	this.x = Math.round(elfActiveBar.width * 0.12);
	this.y = -this.height;
	this.textStartX=Math.round(this.width*0.1);
	this.textStartY=Math.round(this.height*0.4);

	this.img = img.elfInfoPanel;
	this.damageData;
	this.attackDelayData;
	this.buffDamageData;
	this.buffAttackDelayData;
}

ElfInfoPanel.prototype.draw = function (context,eventHandler){
	var activeElfData = eventHandler.listen("activeElf");
	if(activeElfData){
		var elf = activeElfData.elf;
		this.damageData = Utils.sliceNumberAfterDot(elf.realDamage,1);
		this.attackDelayData = Utils.sliceNumberAfterDot(elf.realAttackDelay,1);
		this.buffDamageData = Utils.sliceNumberAfterDot(elf.buff.damage,1);
		this.buffSpeedData = Utils.sliceNumberAfterDot(elf.buff.speed,1);
	}
	context.drawImage(this.img,0,0,this.width,this.height);
	context.fillStyle = "#fff59b";
	context.fillText("伤害 : "+this.damageData,this.textStartX,this.textStartY);
	context.fillText("攻击间隔 : "+this.attackDelayData,this.textStartX,this.textStartY+20);
	context.fillStyle = "#dddddd";
	context.fillText("伤害倍率 : "+ this.buffDamageData,this.textStartX + 120,this.textStartY);
	context.fillText("攻速倍率 : "+this.buffSpeedData,this.textStartX + 120,this.textStartY + 20);
}

var SpellInfoPanel = Drawable.sub();
SpellInfoPanel.prototype._init = function (spellActiveBar){
	this.height = spellActiveBar.height;
	this.width = Math.round(this.height/55*263);
	this.x = 33;
	this.y = 0;
	
	this.img = img.elfInfoPanel;
	this.damageData;
	this.attackDelayData;
	this.buffDamageData;
	this.buffAttackDelayData;
}

SpellInfoPanel.prototype.draw = function (context,eventHandler){
	var spellInfo = this.info;
	var elf = this.elf;
	var firstTextX = 20;
	var firstTextY = 30;
	var secondTextX = 20;
	var secondTextY = 50;
	context.drawImage(this.img,0,0,this.width,this.height);
	if(spellInfo.type == "attack"){
		context.fillStyle = "#fff59b";
		var realSpellDamage = spellInfo.damage
			* Math.pow(spellInfo.grow,elf.level-1);
		
		var damage = Utils.sliceNumberAfterDot(realSpellDamage)
			+ " x " + spellInfo.repeat;
		context.fillText("伤害 : "+damage,firstTextX,firstTextY);

		if(spellInfo.attackType == "circle"){
			if(spellInfo.directional == false){
				context.fillText("在周围施放",secondTextX,secondTextY);
			}else{
				context.fillText("目标可选",secondTextX,secondTextY)
			}
		}else{
			context.fillText("直线攻击",secondTextX,secondTextY)
		}
	}else{
		//buff
		context.fillStyle = "#dddddd";
		var text = "";
		if(spellInfo.buffDamage){
			var realBuffDamage = spellInfo.buffDamage
				* Math.pow(spellInfo.grow,elf.level);
			text += "伤害:x"+Utils.sliceNumberAfterDot(realBuffDamage);
		}
		if(spellInfo.buffSpeed){
			var realBuffSpeed = spellInfo.buffSpeed
				* Math.pow(spellInfo.grow,elf.level);
			text += "攻速:x"+Utils.sliceNumberAfterDot(spellInfo.buffSpeed);
		}
		if(spellInfo.buffRange){
			text += "范围:+"+Utils.sliceNumberAfterDot(spellInfo.buffRange);
		}
		context.fillText(text,firstTextX,firstTextY);
		if(spellInfo.directional == false){
			context.fillText("在周围施放",secondTextX,secondTextY);
		}else{
			context.fillText("目标可选",secondTextX,secondTextY)
		}
	}
}
SpellInfoPanel.prototype.updateSpellData = function (spellInfo,elf){
	this.info = spellInfo;
	this.elf = elf;
}
