var Elf = Sprite.sub();
Elf.prototype._init = function (game,name,cell,info){
	var elfData = game.db.elf.getDataByName(name);
	this.name = name;
	this.sound = elfData.sound;
	Elf.parent.call(this,elfData,cell.screenSize);
	this.x = 0;
	this.y = 0;
	this.rad = 0;
	this.level = 1;
	this.teleportCost = 50;
	this.teleportCostGrow = 1.2;

	this.hover = false;
	this.hoverMark = img.towerHoverMark;

	this.color = elfData.color;
	
	this.damage = elfData.damage;
	this.range = elfData.range;
	this.buffRange = elfData.buffRange;
	this.attackDelay = elfData.attackDelay;
	this.minAttackDelay = elfData.minAttackDelay;

	this.delayActionFunc = null;
	
	this.realDamage = this.damage;
	this.realRange = this.range;
	this.realAttackDelay = this.attackDelay

	this.type = elfData.attackType;

	if(this.type == "line" || this.type == "field"){
		this.autoRetarget = true;

		if (this.type == "field"){
			this.bulletImg = elfData.bulletImg;
			//console.error(elfData)
		}
	}

	this.element = elfData.element;
	this.grow = elfData.grow;
	this.buffGrow = elfData.buffGrow;
	this.currGrow = 1;
	this.mp = 0;
	//this.mp = 1000;
	this.maxMp = elfData.maxMp;
	this.realMaxMp = elfData.maxMp;
	
	this.levelupCost = elfData.levelupCost;
	this.realLevelupCost = this.levelupCost;
	
	this.magics = elfData.magics;

	this.busy = false;
	this.active = false;
	
	this.cell = cell;
	this.field = this.cell.field;
	var buffData = elfData.buff;
	this.buff = {
		name:this.name,
		elfBuff:true,
	};
	for(var i in buffData){
		this.buff[i] = buffData[i];
	};
	this.setCircles();

	this.getAroundCells();
	this.initAttackFunc(this.type);
}
Elf.prototype.setCircles = function (){
	this.rangeCircle = new Drawable();
	this.rangeCircle.rad = 0;
	this.rangeCircle.attackCircleImg = img.attackRangeCircle;
	this.rangeCircle.buffCircleImg= img.buffRangeCircle;
	this.rangeCircle.elf = this;
	this.rangeCircle.x = this.x + this.cell.x;
	this.rangeCircle.y = this.y + this.cell.y;
	this.rangeCircle.draw = Elf.rangeCircleDrawFunc;
	this.rangeCircle.nextFrame = Elf.rangeCircleNextFrameFunc;

	this.magicCircle = new Drawable();
	this.magicCircle.rad = 0;
	this.magicCircle.elf = this;
	this.magicCircle.img = img.magicRangeCircle;
	this.magicCircle.x = this.x + this.cell.x;
	this.magicCircle.y = this.y + this.cell.y;
	this.magicCircle.draw = Elf.magicCircleDrawFunc;
	this.magicCircle.nextFrame = Elf.magicCircleNextFrameFunc;
}
Elf.prototype.handleCastingBuff = function (eventHandler){
	for (var i = 0; i < this.aroundCells.buff.length; i++){
		var nowCell = this.aroundCells.buff[i]
		if(nowCell.tower)
			nowCell.tower.addBuff(this.buff);
	}
}
Elf.prototype.unsummon = function (eventHandler){
	this.hideRangeCircle(eventHandler);
	delete this.cell.elf;
	delete this.cell.drawList.elf;
	this.cell.empty = true;
}
Elf.prototype.tick = function (eventHandler){
	this.nextFrame(eventHandler);
	this.handleActiveEvent(eventHandler);
	if (!Static.mobileUser){
		this.handleMouseHover();
	}

	if(eventHandler.listen("pause")){
		return;
	}
	if(typeof this.delayActionFunc == "function"){
		this.delayActionFunc();
		this.delayActionFunc = null;
	}
	this.handleTeleportCostFresh(eventHandler);
	this.handleSpringEffect();
	this.handleCastingBuff(eventHandler);
	if(this.busy) return;
	this.handleAttackEvent(eventHandler);
}
Elf.prototype.handleMouseHover = function (){
	if (this.hover){
		var radius = 35;
		if (!this.drawListBottom.hoverMark){
			this.drawListBottom.hoverMark = new Drawable();
			var hoverMark = this.hoverMark;
			this.drawListBottom.hoverMark.draw = function (context){
				context.drawImage(hoverMark,-radius,-radius,radius*2,radius*2);
			}
		}
		this.hover = false;
	}else{
		delete this.drawListBottom.hoverMark;
	}
};
Elf.prototype.handleTeleportCostFresh = function (eventHandler){
	if (eventHandler.listen ("freshSpring")){
		eventHandler.regist ("uiFresh")
		this.teleportCost = 50;
	}
}
Elf.prototype.levelup = function (eventHandler){
	if(this.mp < this.maxMp)
		return false;
	var mena = eventHandler.listen("asset").mena;

	if(mena < this.realLevelupCost)
		return false;
    	this.realLevelupCost = Math.round(this.levelupCost * this.currGrow)
	eventHandler.regist("cost",{mena:this.realLevelupCost});
	audio.play('levelUp');
	this.level++;
	this.mp = 0;
	this.currGrow *= this.grow;
	this.realDamage = Math.round(this.damage * this.currGrow);
	this.realAttackDelay = Math.round(this.attackDelay/Math.pow(this.currGrow,this.level-1));
	console.log (this.realAttackDelay)
	if(this.realAttackDelay < this.minAttackDelay){
		this.realAttackDelay = this.minAttackDelay;
 	}
	//buff level up
	if (this.buff.damage){
		this.buff.damage *= this.buffGrow;
	}
	if (this.buff.speed){
		//console.log("buffspeed levelup",this.grow,this.buff.speed,this.grow*this.buff.speed)
		this.buff.speed *= this.buffGrow;

	}
	this.showLevelupAnimation(eventHandler);
	console.log(this.name,"level UP");
	return true;

}
Elf.prototype.showLevelupAnimation = function (eventHandler){
	var animateTick = 7;
	var waitTick = 6;
	var startY = this.cell.y + this.y + 10 ;
	var levelupMark = new Drawable();
	levelupMark.width = 51;
	levelupMark.height = 30;
	levelupMark.x = this.x +this.cell.x- 30;
	levelupMark.y = startY;
	levelupMark.ctxAlpha = 0;
	levelupMark.img = img.levelupMark;
	levelupMark.draw = function (context){
		context.drawImage(this.img,0,0,this.width,this.height);
	}
	var obj = {
		drawable:levelupMark,
		ticks:animateTick*2 + waitTick,
	}
	var extralDrawables = eventHandler.listen("addExtralDrawables");
	if(extralDrawables){
		extralDrawables.push(obj);
	}else{
		eventHandler.regist("addExtralDrawables",[obj]);
	}
	eventHandler.registObjectAnimate(levelupMark,{
		ctxAlpha:0.2,
		y:-10,
	},animateTick);
	
	eventHandler.registDelayFunc(function (){
		eventHandler.registObjectAnimate(levelupMark,{
			ctxAlpha:-0.2,
		},animateTick)
	},animateTick + waitTick);
	
	eventHandler.registDelayFunc(function (){
		levelupMark = null;
		eventHandler = null;
	},animateTick*2 + waitTick);
}
Elf.prototype.teleportTo = function (targetCell,eventHandler,costMena){
	var self = this;
	if(eventHandler.listen("pause")){
		this.delayActionFunc = teleportFunc;
	}else{
		teleportFunc();
	}
	
	function teleportFunc(){
		audio.play('teleport');
		var costMena = self.teleportCost;
		if(eventHandler.listen("asset").mena < costMena )
			return;
		if(targetCell.hasDemon())
			return;
		targetCell.empty = false;
		self.busy = true;
		var orders = {
			keyFrameFunc:function (){
				teleport();
				self.teleportCost = Math.round(self.teleportCost * self.teleportCostGrow);
				eventHandler.regist("cost",{mena:costMena});
			},
			callback:function (){
				self.changeMove("normal",eventHandler);
				self.busy = false;
				self = null;
				eventHandler = null;
			}
		}
		self.changeMove("attack",eventHandler,orders);
		
		function teleport(){
			targetCell.elf = self;
			targetCell.drawList.elf = self;
			targetCell.empty = false;

			delete self.cell.elf;
			delete self.cell.drawList.elf;
			self.cell.empty = true;

			self.cell = targetCell;
			self.setCircles();
			self.showRangeCircle(eventHandler);
			self.getAroundCells();
			self.cell.field.getStepData();
			
			console.log("teleport!");
		}
	}
}
Elf.prototype.handleSpringEffect = function (){
	if(!this.cell.magicSpring || this.mp >= this.maxMp)
		return;
	var block = this.maxMp/5;
	var mpBlock = Math.floor(this.mp / block);
	if(this.cell.magicSpring.element == this.element){
		this.mp += 1.3;
	}else{
		this.mp += 1;
	}
	if (Math.floor(this.mp / block) > mpBlock){
		audio.play('mpUp');
	}
}

Elf.prototype.handleActiveEvent = function (eventHandler){
	var activeElfData = eventHandler.listen("activeElf")
	if(activeElfData && activeElfData.name == this.name){
		this.active = true;
		this.showRangeCircle(eventHandler);
		return;
	}
	this.active = false;
	this.hideRangeCircle(eventHandler);
}
Elf.prototype.handleAttackEvent = function (eventHandler){
	if(this.autoRetarget
	   || !this.target
	   ||  this.target.destroyed
	   || !this.targetInRange()
	  ){
		//line attack elf find new target every tick
		this.target = this.getTarget();
	}
	if (!this.target){
		this.attackTiker = this.realAttackDelay;
		return;
	}
	if(!this.moving && this.type != "circle"){
		this.rad = this.getTargetRad(this.target);
	}
	if(this.attackTiker < this.realAttackDelay){
		this.attackTiker ++;
		return
	}
	this.attackTiker = 0;
	this.activeAttack(eventHandler);
}
Elf.prototype.activeAttack = function (eventHandler){
	//var time = eventHandler.listen("time");
	this.moving = true;
	var self = this;
	//console.log("attack");
	var orders = {
		keyFrameFunc:function (){
			audio.play(self.sound);
			var activeTime = eventHandler.listen("time")*1 + 1;
			var attackEvent = eventHandler.listen("attack"+activeTime);
			if(!attackEvent){
				attackEvent = {
					endTime:activeTime
				};
				eventHandler.regist("attack"+activeTime,attackEvent);
			}
			self.attack(attackEvent);
		},
		callback:function (){
			//console.log("callback");
			self.moving = false;
			self.changeMove("normal",eventHandler);
			self = null;
			eventHandler = null;
		},
	};
	this.changeMove("attack",eventHandler,orders);
	//this.attack(attackEvent);
}
Elf.prototype.ifCellInRange = function (targetCell,range){
	var self = this;
	var nextCellArray = new Array();
	nextCellArray.push(self.cell);
	self.cell.searchRange = 0;
	var nextArrayPointer = 0;

	while(nextArrayPointer < nextCellArray.length){
		var nowCell = nextCellArray[nextArrayPointer];
		if(nowCell.row == targetCell.row
		   && nowCell.line == targetCell.line){
			clearSearchData();
			return true;
		}
		getIn(nowCell)
		nextArrayPointer ++;
	}
	clearSearchData();
	self = null;
	return false;
	
	function getIn(cell){
		cell.searched = true;
		for (var i = 6; i >= 1 ; i--){
			var nowPointer = 'p'+i;
			var nextCell = cell[nowPointer];
			if(!nextCell || nextCell.searched){
				continue;
			}
			if(!nextCell.searched && cell.searchRange < range){
				nextCell.searched = true;
				nextCell.searchRange = cell.searchRange + 1;
				nextCellArray.push(nextCell);
			}
		}
	}
	function clearSearchData(){
		for (var i = 0; i < nextCellArray.length; i++){
			delete nextCellArray[i].searched;
			delete nextCellArray[i].searchRange;
		}
	}	
}
Elf.prototype.getAroundCells = function (){
	this.aroundCells = {
		attack:[],
		buff:[],
	};
	var maxRange = Math.getMaxFromArray([this.realRange,this.buffRange]);
	this.attackDistance = (this.realRange+0.1)*this.cell.width;
	var self = this;
	var nextCellArray = new Array();
	nextCellArray.push(self.cell);
	self.cell.searchRange = 0;
	var nextArrayPointer = 0;

	while(nextArrayPointer < nextCellArray.length){
		var nowCell = nextCellArray[nextArrayPointer];

		if(nextArrayPointer != 0){
			if (nowCell.searchRange <= self.range){
				self.aroundCells.attack.push(nowCell);
			}
			if (nowCell.searchRange <= self.buffRange){
				self.aroundCells.buff.push(nowCell);
			}
		}
		getIn(nowCell)
		nextArrayPointer ++;
	}
	clearSearchData();
	self = null;
	
	function getIn(cell){
		cell.searched = true;
		for (var i = 6; i >= 1 ; i--){
			var nowPointer = 'p'+i;
			var nextCell = cell[nowPointer];
			if(!nextCell || nextCell.searched){
				continue;
			}
			if(!nextCell.searched && cell.searchRange < maxRange){
				nextCell.searched = true;
				nextCell.searchRange = cell.searchRange + 1;
				nextCellArray.push(nextCell);
			}
		}
	}
	function clearSearchData(){
		for (var i = 0; i < nextCellArray.length; i++){
			delete nextCellArray[i].searched;
			delete nextCellArray[i].searchRange;
		}
	}
}
Elf.prototype.targetInRange = function (){
	if (this.target.fly){
		if(Math.getDistance({x:this.x + this.cell.x , y:this.y+this.cell.y}
							,{x:this.target.x,y:this.target.y}
						   ) <= this.attackDistance){
			return true;
		}
	}else{
		for (var i = 0; i < this.aroundCells.attack.length; i++){
			var nowCell=this.aroundCells.attack[i];
			if(nowCell.row == this.target.cell.row
			   && nowCell.line == this.target.cell.line)
				return true;
		}
	}
	return false;
}
Elf.prototype.getTargetRad = function (target){
	if(typeof target.row != "undefined"){
		//target is a cell
		var targetX = target.x;
		var targetY = target.y;
	}else{
		if (target.fly){
			var targetX = target.x;
			var targetY = target.y;
		}else{
			var targetX = target.cell.x + target.x;
			var targetY = target.cell.y + target.y;
		}
	}
	var k = -(targetX - this.cell.x) / (targetY - this.cell.y);
	if(targetY >= this.cell.y){
		return rad = Math.atan(k) - Math.PI;
	}else{
		return rad = Math.atan(k)
	}
}
Elf.prototype.initAttackFunc = function (type){
	switch(type){
	case "line" :
		this.attack = Elf.lineAttackFunc;
		break;
	case "circle" :
		this.attack = Elf.circleAttackFunc;
		break;
	case  "normal":
		this.attack = Elf.normalAttackFunc;
		break;
	case "field" :
		this.attack = Elf.fieldAttackFunc;
		break;
	}
}
Elf.prototype.getTarget = function (){
	for(var id in this.field.flyDemons){
		var flyDemon = this.field.flyDemons[id];
		if(Math.getDistance({x:this.x + this.cell.x , y:this.y+this.cell.y}
							,{x:flyDemon.x,y:flyDemon.y}
						   ) <= this.attackDistance){
			return flyDemon;
		}
	}
	for (var i = 0; i < this.aroundCells.attack.length; i++){
		var nowCell = this.aroundCells.attack[i];
		for(var i in nowCell.demons){
			return nowCell.demons[i];
		}
	}
	return false;
}

Elf.prototype.showRangeCircle = function (eventHandler){
	eventHandler.regist("rangeCircle",this.rangeCircle);
}
Elf.prototype.showMagicCircle = function (spellInfo,eventHandler){
	if(!spellInfo.castRange){
		//return;
		if(spellInfo.spellRange){
			this.magicCircle.castRange = spellInfo.spellRange - 1;
		}else{
			this.magicCircle.castRange = 15;
		}
	}else{
		this.magicCircle.castRange = spellInfo.castRange;			
	}
	eventHandler.regist("magicCircle",this.magicCircle)
}
Elf.prototype.hideMagicCircle = function (eventHandler){
	eventHandler.remove("magicCircle");
}
Elf.prototype.hideRangeCircle = function (eventHandler){
	var rangeCircleData = eventHandler.listen("rangeCircle")
	if(rangeCircleData
	   && rangeCircleData.x == this.rangeCircle.x
	   && rangeCircleData.y == this.rangeCircle.y
	  ){
		eventHandler.remove("rangeCircle");
	}
}
Elf.prototype.castSpell = function (spellInfo,targetCell,eventHandler){
	var self = this;
	if(eventHandler.listen("pause")){
		this.delayActionFunc = castSpellFunc;
	}else{
		castSpellFunc();
	}
	function castSpellFunc(){
		if (spellInfo.type == "attack"){
			audio.play('elfSpell');
		}else{
			audio.play('elfCheer');
		}
		var costMena = spellInfo.cost.mena;
		var costMp = spellInfo.cost.mp;
		if(eventHandler.listen("asset").mena < costMena )
			return;
		self.mp -= spellInfo.cost.mp;
		eventHandler.regist("cost",{mena:costMena});
		self.rad = self.getTargetRad(targetCell);
		self.busy = true;
		self.showCastAnimation(spellInfo,targetCell,eventHandler);
		var orders = {
			keyFrameFunc:function (){
				eventHandler.regist("spellActive",
									{info:spellInfo,
									 elf:self,
									 targetCell:targetCell,
									});
			},
			callback:function (){
				self.busy = false;
				self.changeMove("normal",eventHandler);
				self = null;
				spellInfo= null;
				eventHandler = null;
			},
		};
		self.changeMove(spellInfo.movement,eventHandler,orders);
		eventHandler.remove("spellMark");
	}
}
Elf.prototype.showCastAnimation = function (spellInfo,targetCell,eventHandler){
	var animateTick1 = 7;
	var animateTick2 = 5;
	var castMark = new Drawable();
	var realRadius = 350;
	castMark.radius = 120;
	castMark.x = this.x + this.cell.x;
	castMark.y = this.y + this.cell.y;
	castMark.rad = 0;
	castMark.ctxAlpha = 0;
	castMark.img = img.castMark;
	castMark.draw = function (context){
		context.drawImage(this.img,-this.radius,-this.radius,this.radius*2,this.radius*2);
	}
	var obj = {
		drawable:castMark,
		ticks:animateTick1+animateTick2 + 3,
	}
	var extralDrawables = eventHandler.listen("addExtralDrawables");
	if(extralDrawables){
		extralDrawables.push(obj);
	}else{
		eventHandler.regist("addExtralDrawables",[obj]);
	}
	eventHandler.registObjectAnimate(castMark,{
		ctxAlpha:0.15,
		rad:0.1,
	},animateTick1);
	
	eventHandler.registDelayFunc(function (){
		eventHandler.registObjectAnimate(castMark,{
			ctxAlpha:-0.2,
			radius:Math.round(realRadius/animateTick2),
			rad:0.15,
		},animateTick2)
	},animateTick1 + 3);
	
	eventHandler.registDelayFunc(function (){
		castMark = null;
		eventHandler = null;
	},animateTick1 + animateTick2 + 3);
	
	if(spellInfo.directional && spellInfo.attackType == "circle"){
		
	}
}
Elf.lineAttackFunc = function (attackEvent){
	if(!attackEvent.line){
		attackEvent.line = new Array();
	}
	var attack = {
		x:this.cell.x,
		y:this.cell.y,
		color:this.color,
		width:1,
		rad:this.rad,
		damage:this.realDamage
	}
	//console.log(attack.elfX,attack.elfY);
	attackEvent.line.push(attack);
}
Elf.normalAttackFunc = function (attackEvent){
	if(!this.target)
		return;
	if (!attackEvent.normal){
		attackEvent.normal = new Array();
	}
	if(this.target.fly){
		var attack = {
			targetId:this.target.id,
			targetX:this.target.x,
			targetY:this.target.y,
			color:this.color,
			rad:this.rad,
			damage:this.realDamage
		}
	}else{
		var attack = {
			targetId:this.target.id,
			targetX:this.target.cell.x + this.target.x,
			targetY:this.target.cell.y + this.target.y,
			color:this.color,
			rad:this.rad,
			damage:this.realDamage
		}
	}
	attackEvent.normal.push(attack);
}
Elf.fieldAttackFunc = function (attackEvent){
	if(!this.target)
		return;
	if(!attackEvent.field){
		attackEvent.field = new Array();
	}
	if (this.target.fly){
		var targetOffsetPosition = {
			x:this.target.x,
			y:this.target.y,
		}
		var targetCell = this.field.getHoverCell(targetOffsetPosition);
	}else{
		var targetCell = this.target.cell;
	}
	var attack = {
		cell:targetCell,
		damage:this.realDamage,
		color:this.color,
		bulletImg:this.bulletImg,
	}
	attackEvent.field.push(attack);
}
Elf.circleAttackFunc = function (attackEvent){
	//this is a field based attack event
	if(!attackEvent.circle){
		attackEvent.circle = new Array();
	}
	var attack = {
		cells:new Array(),
		radius:(this.realRange+0.1) * this.cell.width,
		x:this.cell.x,
		color:this.color,
		y:this.cell.y,
		damage:this.realDamage,
	}
	for (var i = 0; i < this.aroundCells.attack.length; i++){
		attack.cells.push(this.aroundCells.attack[i]);
	}
	attackEvent.circle.push(attack);
}
Elf.rangeCircleNextFrameFunc = function (){
	this.rad -= 0.03;
}
Elf.rangeCircleDrawFunc = function (context,eventHandler){
	var self = this;
	var buffCircleRadius = this.elf.buffRange * this.elf.cell.width * 1.1;
	var attackCircleRadius = this.elf.range * this.elf.cell.width * 1.1;
	if(buffCircleRadius > attackCircleRadius){
		drawBuffCircle();
		drawAttackCircle();
	}else{
		drawAttackCircle();
		drawBuffCircle();
	}
	self = null;

	function drawAttackCircle(){
		
		context.drawImage(self.attackCircleImg
						  ,-attackCircleRadius,-attackCircleRadius
						  ,attackCircleRadius * 2,attackCircleRadius * 2);
	}
	function drawBuffCircle(){
		context.save();
		context.rotate(-self.rad*2);
		context.drawImage(self.buffCircleImg
						  ,-buffCircleRadius,-buffCircleRadius
						  ,buffCircleRadius * 2,buffCircleRadius * 2);
		context.restore();
		
	}
}
Elf.magicCircleNextFrameFunc = function (){
	this.magicCircleRadius = (this.castRange) * this.elf.cell.width;	
}
Elf.magicCircleDrawFunc = function (context,eventHandler){
	if(!this.magicCircleRadius){
		this.magicCircleRadius = (this.castRange) * this.elf.cell.width;	
	}
	context.drawImage(this.img
					  ,-this.magicCircleRadius,-this.magicCircleRadius
					  ,this.magicCircleRadius * 2,this.magicCircleRadius*2);
	
}
