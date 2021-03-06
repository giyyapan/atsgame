var Tower = Sprite.sub();
Tower.prototype._init = function (game,name,cell,info){
	var towerData = game.db.tower.getDataByName(name);
	this.name = name;
	this.sound = towerData.sound;
	Tower.parent.call(this,towerData,cell.screenSize);
	this.x = 0;
	this.y = 0;
	this.rad = 0;
	this.busy = false;

	this.hover = false;
	this.hoverMark = img.towerHoverMark;

	this.damage = towerData.damage;
	this.range = towerData.range;
	this.aroundCellRange;
	this.attackDelay = towerData.attackDelay;
	this.minAttackDelay = towerData.minAttackDelay||5;
	this.attackTiker = this.attackDelay;
	
	this.realDamage = this.damage;
	this.realAttackDelay = this.attackDelay;
	this.type = towerData.type;
	if(this.type == "line" || this.type == "field"){
		this.autoRetarget = true;
	}
	if(this.type == "field")
		this.faceTo = Tower.fieldTowerFaceToFunc;
	this.cell = cell;
	this.field = this.cell.field;
	this.buffs = {};

	this.initExtraDrawable();
	this.getAroundCells(this.range);
	this.initAttackFunc(this.type)
}
Tower.prototype.draw = function (context){
	if (this.hover){
		var radius = 35;
		context.drawImage(this.hoverMark,-radius,-radius,radius*2,radius*2);
		this.hover = false;
	}
	context.drawImage(this.map
					  ,-this.width/2,-this.height/2
					  ,this.width,this.height);
}
Tower.prototype.initExtraDrawable = function (){
	
	this.rangeCircle = new Drawable();
	this.rangeCircle.img = img.attackRangeCircle;
	this.rangeCircle.tower = this;
	this.rangeCircle.rad = 0;
	this.rangeCircle.x = this.x + this.cell.x;
	this.rangeCircle.y = this.y + this.cell.y;
	this.rangeCircle.draw = Tower.rangeCircleDrawFunc;
	this.rangeCircle.nextFrame = Tower.rangeCircleNextFrameFunc;

	//normalBuffMark
	this.buffMark = new Drawable();
	this.buffMark.img = img.normalBuffMark;

	this.buffMark.radius = Math.round(this.cell.width/2 * 0.8)
	this.buffMark.width = this.buffMark.radius * 2;
	this.buffMark.height = this.buffMark.width;
		
	this.buffMark.tower = this;
	this.buffMark.draw = Tower.buffMarkDrawFunc;

	//spellBuffMark
	this.spellBuffMark = new Drawable();
	this.spellBuffMark.img = img.spellBuffMark;

	this.spellBuffMark.radius = Math.round(this.cell.width/2)
	this.spellBuffMark.width = this.spellBuffMark.radius * 2;
	this.spellBuffMark.height = this.spellBuffMark.width;
		
	this.spellBuffMark.tower = this;
	this.spellBuffMark.draw = Tower.buffMarkDrawFunc;
}
Tower.prototype.unsummon = function (eventHandler){
	this.hideRangeCircle(eventHandler)
	delete this.cell.tower;
	delete this.cell.drawList.tower;
	this.cell.empty = true;
}
Tower.prototype.tick = function (eventHandler){
	this.handleActiveEvent(eventHandler);
	if(eventHandler.listen("pause")){
		return;
	}
	this.handleBuffs(eventHandler);
	this.handleAttackEvent(eventHandler);
}
Tower.prototype.handleActiveEvent = function (eventHandler){
	var activeTowerData = eventHandler.listen("activeTower")
	if(activeTowerData && activeTowerData.tower == this){
		this.showRangeCircle(eventHandler);
		return;
	}
	this.hideRangeCircle(eventHandler);
}
Tower.prototype.handleAttackEvent = function (eventHandler){
	if(this.busy)
		return;
	if(this.autoRetarget
	   ||!this.target
	   || this.target.destroyed
	   || !this.targetInRange()
	   ){
		//line attack tower find new target every tick
		this.target = this.getTarget();
	}

	if (!this.target){
		this.attackTiker = this.realAttackDelay;
		return;
	}
	this.faceTo(this.target);
	if(this.attackTiker < this.realAttackDelay){
		this.attackTiker ++;
		return
	}
	this.attackTiker = 0;
	var activeTime = eventHandler.listen("time")*1 + 1;
	var attackEvent = eventHandler.listen("attack"+activeTime);
	if(!attackEvent){
		attackEvent = {
			endTime:activeTime
		};
		eventHandler.regist("attack"+activeTime,attackEvent);
	}
	audio.play(this.sound);
	this.attack(attackEvent);
}
Tower.prototype.getAroundCells = function (range){
	this.aroundCells = this.cell.getAroundCellsByRange(range);
	this.aroundCellRange = range;
	this.attackDistance = (range+0.1)*this.cell.width;
}
Tower.prototype.targetInRange = function (){
	if (this.target.fly){
		var distance = Math.getDistance(
			{x:this.x + this.cell.x , y:this.y+this.cell.y}
			,this.target);
		if(distance <= this.attackDistance){
			return true;
		}
	}else{
		for (var i = 0; i < this.aroundCells.length; i++){
			var nowCell=this.aroundCells[i];
			if(nowCell.row == this.target.cell.row
			   && nowCell.line == this.target.cell.line)
				return true;
		}
	}
	return false;
}
Tower.prototype.faceTo = function (target){
	if (target.fly){
		var targetX = target.x;
		var targetY = target.y;
	}else{
		var targetX = target.cell.x + target.x;
		var targetY = target.cell.y + target.y;
	}
	var k = -(targetX - this.cell.x) / (targetY - this.cell.y);
	if(targetY >= this.cell.y){
		this.rad = Math.atan(k) - Math.PI;
	}else{
		this.rad = Math.atan(k)
	}
}
Tower.fieldTowerFaceToFunc = function (target){
	if (target.fly){
		var targetX = target.x;
		var targetY = target.y;
	}else{
		var targetX = target.cell.x;
		var targetY = target.cell.y;
	}
	var k = -(targetX - this.cell.x) / (targetY - this.cell.y);
	if(targetY >= this.cell.y){
		this.rad = Math.atan(k) - Math.PI;
	}else{
		this.rad = Math.atan(k)
	}
}
Tower.prototype.initAttackFunc = function (type){
	switch(type){
	case "line" :
		this.attack = Tower.lineAttackFunc;
		break;
	case "circle" :
		this.attack = Tower.circleAttackFunc;
		break;
	case  "normal":
		this.attack = Tower.normalAttackFunc;
		break;
	case "field" :
		this.attack = Tower.fieldAttackFunc;
		break;
	}
}
Tower.prototype.getTarget = function (){
	for(var id in this.field.flyDemons){
		var flyDemon = this.field.flyDemons[id];
		var distance = Math.getDistance({x:this.x + this.cell.x , y:this.y+this.cell.y}
										,flyDemon)
		if(distance <= this.attackDistance){
			return flyDemon;
		}
	}
	for (var i = 0; i < this.aroundCells.length; i++){
		var nowCell = this.aroundCells[i];
		for(var i in nowCell.demons){
			return nowCell.demons[i];
		}
	}
	return false;
}
Tower.prototype.showRangeCircle = function (eventHandler){
	eventHandler.regist("rangeCircle",this.rangeCircle);
}
Tower.prototype.hideRangeCircle = function (eventHandler){
	var rangeCircleData = eventHandler.listen("rangeCircle")
	if(rangeCircleData
	   && rangeCircleData.x == this.rangeCircle.x
	   && rangeCircleData.y == this.rangeCircle.y){
		eventHandler.remove("rangeCircle");
	}
}
Tower.prototype.handleBuffs = function (eventHandler){
	var spellBuff = false;
	this.realDamage = this.damage;
	this.realAttackDelay = this.attackDelay;
	this.realRange = this.range;
	var sumBuffSpeed = 1;

	delete this.drawListBottom.buffMark;
	
	var nowTime = eventHandler.listen("time");
	for(var name in this.buffs){
		var nowBuff = this.buffs[name];
		if(nowBuff.duration){
			//is a spell
			spellBuff = true;
			if(nowBuff.duration + nowBuff.startTime <= nowTime){
				delete this.buffs[name];
				continue;
			}
		}
		if(nowBuff.damage){
			this.realDamage += this.damage * (nowBuff.damage - 1);
		}
		if(nowBuff.speed){
			sumBuffSpeed += (nowBuff.speed-1);
		}
		if(nowBuff.range){
			this.realRange += nowBuff.range;
		}

		
		if(spellBuff){
			this.drawListBottom.buffMark = this.spellBuffMark;
			this.spellBuffMark.rad -= 0.3;
		}else{
			this.drawListBottom.buffMark = this.buffMark;
		}
		if(nowBuff.elfBuff){
			delete this.buffs[name];
		}
	}
	
	this.realAttackDelay = Math.floor(this.attackDelay/sumBuffSpeed);
	if(this.realAttackDelay < this.minAttackDelay)
		this.realAttackDelay = this.minAttackDelay;

	this.realRange = Math.floor(this.realRange)
	if(this.realRange != this.aroundCellRange)
		this.getAroundCells(this.realRange);
}
Tower.prototype.addBuff = function (buffData){
	this.buffs[buffData.name] = buffData;
}
Tower.lineAttackFunc = function (attackEvent){
	if(!attackEvent.line){
		attackEvent.line = new Array();
	}
	var attack = {
		x:this.cell.x,
		y:this.cell.y,
		width:3,
		rad:this.rad,
		damage:this.realDamage
	}
	attackEvent.line.push(attack);
}
Tower.normalAttackFunc = function (attackEvent){
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
			rad:this.rad,
			damage:this.damage
		}
	}else{
		var attack = {
			targetId:this.target.id,
			targetX:this.target.cell.x + this.target.x,
			targetY:this.target.cell.y + this.target.y,
			rad:this.rad,
			damage:this.damage
		}		
	}
	attackEvent.normal.push(attack);
}
Tower.fieldAttackFunc = function (attackEvent){
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
	}
	attackEvent.field.push(attack);
}
Tower.circleAttackFunc = function (attackEvent){
	//this is a field based attack event
	if(!attackEvent.circle){
		attackEvent.circle = new Array();
	}
	var attack = {
		cells:new Array(),
		radius:(this.realRange+0.1) * this.cell.width,
		x:this.x + this.cell.x,
		y:this.y + this.cell.y,
		damage:this.damage,
	}
	for (var i = 0; i < this.aroundCells.length; i++){
		attack.cells.push(this.aroundCells[i]);
		//this.aroundCells[i].addHoverMark(true);
	}
	attackEvent.circle.push(attack);
}
Tower.rangeCircleNextFrameFunc = function (){
	this.rad -= 0.03;	
}
Tower.rangeCircleDrawFunc = function (context){
	var circleRadius = this.tower.aroundCellRange * this.tower.cell.width * 1.1;
	context.drawImage(this.img,-circleRadius,-circleRadius
					  ,circleRadius * 2,circleRadius * 2);
}

Tower.buffMarkDrawFunc = function (context){
	context.drawImage(this.img,-this.radius,-this.radius,this.width,this.height);
}
