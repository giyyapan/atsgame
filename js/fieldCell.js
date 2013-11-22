var FieldCell = Drawable.sub();
FieldCell.prototype._init = function (row,line,game,screenSize,cellType,battleField){
	this.game = game;
	this.field = battleField;
	this.screenSize = screenSize;
	this.width = screenSize.cellWidth;
	this.height = screenSize.cellHeight;
	this.type  = cellType;
	this.line = line;
	this.row = row;
	this.x = row *3/4 * this.width + this.width/2;
	this.y = line * this.height + this.height/2;
	this.id = this.x+''+this.y;
	if(this.row % 2 != 0) this.y += this.width/2;
	
	if(this.type != 0){
		this.empty = true;
	}else{
		this.empty = false;
		this.tick = function (){}
	}

	this.stepNum = null;
	this.demons = {};
	this.drawList.demons = new Drawable();
	this.drawList.demons.drawList = this.demons;
	
	//add pointers marked as 1-6 to link cells which next to this one
	this.p1 = null;
	this.p2 = null;
	this.p3 = null;
	this.p4 = null;
	this.p5 = null;
	this.p6 = null;
}
FieldCell.prototype.setUnavailMark = function (battleField){
	var mark = new Drawable();
	mark.img = img.unavailFieldMark;
	mark.width = this.width;
	mark.height = this.height;
	mark.x = this.x - this.width/2;
	mark.y = this.y - this.height/2
	mark.draw = function (context){
		context.drawImage(this.img,0,0,this.width,this.height);
	}
	battleField.drawListBottom["unavailCellMark"+this.line + this.row] = mark;
}
FieldCell.prototype.draw = function (context,eventHandler){
	//context.fillRect(0,0,5,5);
	//if(this.stepNum)
	//pcontext.fillText(this.stepNum,0,0);
	return;
}
FieldCell.prototype.getAroundCellsByRange = function (range){
	var aroundCells = new Array();
	var self = this;
	var nextCellArray = new Array();
	nextCellArray.push(this);
	this.searchRange = 0;
	var nextArrayPointer = 0;

	while(nextArrayPointer < nextCellArray.length){
		var nowCell = nextCellArray[nextArrayPointer];

		if(nextArrayPointer != 0){
			aroundCells.push(nowCell);
		}
		getIn(nowCell)
		nextArrayPointer ++;
	}
	clearSearchData();
	return aroundCells;
	
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
FieldCell.prototype.addHoverMark = function (ifAvailable){
	return;
	this.drawList.hoverMark = new Drawable();
	if(ifAvailable){
		this.drawList.hoverMark.draw = function (context){

			context.fillStyle = "rgba(20,200,20,0.3)";
			context.fillRect(-20,-20,40,40);
		}
	}else{
		this.drawList.hoverMark.draw = function (context){
			context.fillStyle = "rgba(200,20,20,0.3)";
			context.fillRect(-20,-20,40,40);
		}
	}
}
FieldCell.prototype.removeHoverMark = function (){
	return;
	if(!this.drawList.hoverMark)
		return false;
	delete this.drawList.hoverMark ;
	return true;
}
FieldCell.prototype.setMagicSpring = function (element){
	if(!element)return;
	this.magicSpring = new MagicSpring(element,this);
	this.magicSpring.rad = 0;
	this.drawListBottom.magicSpring = this.magicSpring;
	return this;
}
FieldCell.prototype.removeMagicSpring = function (){
	delete this.magicSpring;
	delete this.drawListBottom.magicSpring;
}
FieldCell.prototype.setSummoner = function (summonerData){
	this.empty = false;
	this.summoner = new Summoner(this.game,this.screenSize,summonerData);
	this.summoner.cell = this;
	this.drawList.summoner = this.summoner;
	return this;
}
FieldCell.prototype.setDemonGate = function (data,screenSize){
	this.empty = false;
	this.demonGate = new DemonGate(this.game,data,this.screenSize);
	this.demonGate.cell = this;
	this.drawList.demonGate = this.demonGate;
	return this;
}
FieldCell.prototype.summonTower = function (name,info,eventHandler){
	this.tower = new Tower(this.game,name,this,info);
	this.drawList.tower = this.tower;
	this.empty = false;
	var pauseEvent = eventHandler.listen("pause");
	if(pauseEvent) this.tower.summonTime = pauseEvent.time;
}
FieldCell.prototype.summonElf = function (name,info,eventHandler){
	this.elf = new Elf(this.game,name,this,info);
	this.drawList.elf = this.elf;
	this.empty = false;
	var pauseEvent = eventHandler.listen("pause");	
	if(pauseEvent) this.elf.summonTime = pauseEvent.time;
	eventHandler.regist("elfSummoned",{name:this.elf.name,cell:this,elf:this.elf});
}
FieldCell.prototype.addTempElf = function (name,eventHandler){
	this.tempElf = new Elf(this.game,name,this);
	this.tempElf.showRangeCircle(eventHandler);
	this.drawList.tempElf = this.tempElf;
}
FieldCell.prototype.addTempTower = function (name,eventHandler){
	this.tempTower = new Tower(this.game,name,this);
	this.tempTower.showRangeCircle(eventHandler);
	this.drawList.tempTower = this.tempTower;
}
FieldCell.prototype.removeTempTower = function (){
	if(!this.tempTower) return false;
	delete this.tempTower;
	delete this.drawList.tempTower;
	return true;
}
FieldCell.prototype.removeTempElf = function (){
	if(!this.tempElf) return false;
	delete this.tempElf;
	delete this.drawList.tempElf;
	return true;
}
FieldCell.prototype.hasDemon = function (){
	for(var i in this.demons){
		if(this.demons[i])
			return true;
	}
	return false;
}
FieldCell.prototype.ifSummonable = function (){
	if (!this.empty){
		return false;
	}
	for(var i in this.demons){
		if(this.hasDemon())
			return false;
	}
	return true;
}

FieldCell.prototype.tick = function (eventHandler){
	var pause = eventHandler.listen("pause");

		if(this.tower){
			this.tower.tick(eventHandler);
			return;
		}

		if (this.elf){
			this.elf.tick(eventHandler);
			return;
		}
	if(!pause){		
		if(this.summoner){
			this.summoner.tick(eventHandler);
			return;
		}

		if(this.demonGate){
			this.demonGate.tick(eventHandler);
		}

		if(!this.hasDemon())
			return;
		this.handleFieldAttackEvents(eventHandler);
		for(var i in this.demons){
			this.demons[i].tick(eventHandler);
		}
	}
}
FieldCell.prototype.handleFieldAttackEvents = function (eventHandler){
	var nowTime = eventHandler.listen("time");
	var attackEvent = eventHandler.listen("attack"+nowTime);
	if(!attackEvent)
		return;
	if(attackEvent.circle){
		//console.log("listend")
		for (var i = 0; i < attackEvent.circle.length; i++){
			var event = attackEvent.circle[i];
			for (var j = 0; j < event.cells.length; j++){
				var targetCell = event.cells[j];
				if(this.row == targetCell.row
				   && this.line == targetCell.line){
					for(var k in this.demons){
						this.demons[k].damaged(event.damage,eventHandler);
					}
					break;
				}
			}
		}
	}
	if(attackEvent.field){
		for (var i = 0; i < attackEvent.field.length; i++){
			var event = attackEvent.field[i];
			if(event.cell.row == this.row
			   && event.cell.line == this.line){
				for(var j in this.demons){
					this.demons[j].damaged(event.damage,eventHandler);
				}
			}
		}
	}
}
FieldCell.prototype.getDemonIndexByID = function (id){
	var demonIndex = -1;
	var drawStackIndex = -1;
	for (var i = 0; i < this.demons.length; i++){
		if (this.demons[i].id == id){
			demonIndex = i;
			break;
		}
	}
	for (var i = 0; i < this.drawStack.length; i++){
		if (this.drawStack[i].id == id){
			drawStackIndex = i
			break;
		}
	}
	if(demonIndex > -1 &&  drawStackIndex > -1)
		return {demonIndex:demonIndex,drawStackIndex:drawStackIndex};
	console.error("did not deleted ",id,this.demons,this.drawStack);
	return false;
}
FieldCell.prototype.enterDemon = function (newDemon){
	//console.error("enter",this.demons,newDemon.id,this.row,this.line);
	this.demons[newDemon.id] = newDemon;
}
FieldCell.prototype.removeDemon = function (demon){
	//console.error("out",this.demons,demon.id,this.row,this.line);
	//console.log("removed",demon.id)
	delete this.demons[demon.id];
}
FieldCell.prototype.addCircleSpellMark = function (spellInfo,eventHandler){
	var spellMark = new Drawable();
	spellMark.width = this.height * (spellInfo.spellRange * 2 - 1);
	spellMark.height = spellMark.width;
	spellMark.x = this.x;
	spellMark.y = this.y;
	if(spellInfo.type == "attack"){
		spellMark.img = img.circleAttackSpellMark;
	}else{
		//buff
		spellMark.img = img.buffSpellMark;
	}
	
	spellMark.draw = function (context){
		context.drawImage(this.img,-this.width/2,-this.height/2,this.width,this.height);
	}
	eventHandler.regist("spellMark",spellMark);
}
FieldCell.prototype.getDirectionPointerNum = function (targetCell){
		var minRange = 10000;
	var minPointerNum;

	for (var i = 1; i <= 6; i++){
		var nowCell = this["p"+i];
		if(!nowCell)
			continue;
		var distance = Math.getDistance(nowCell,targetCell);
		if(distance < minRange){
			minRange = distance;
			minPointerNum = i;
		}
	}
	return minPointerNum;
}
FieldCell.prototype.addLineSpellMark = function (spellInfo,rad,eventHandler){
	var spellMark = new Drawable();
	spellMark.img = img.lineAttackSpellMark;
	spellMark.width = this.width * 1.5;
	spellMark.height = spellMark.width;
	spellMark.x = this.x;
	spellMark.y = this.y;
	spellMark.rad = rad;
	spellMark.draw = function (context){
		context.drawImage(this.img,-this.width/2,-this.height,this.width,this.height);
	}
	eventHandler.regist("spellMark",spellMark);
}
FieldCell.prototype.removeSpellMark = function (eventHandler){
	eventHandler.remove("spellMark");
}
