var ElfEventManager = Class.sub();
ElfEventManager.prototype._init = function (game,battleField,eventHandler){
	var userData = game.user.getUserData();
	this.battleField = battleField;
	this.elvesStatus = {};
	this.initElvesStatus(userData,eventHandler);
	this.spells = new Array();
	this.elfSummonCost = 300;
}
ElfEventManager.prototype.initElvesStatus = function (userData,eventHandler){
	if(!userData.elves) return;
	var elfButtons = eventHandler.listen("initElfButton");
	var elfActiveButtons = eventHandler.listen("initElfActiveButton");
	
	for (var i = 0; i < userData.elves.length; i++){
		var elfName =userData.elves[i];
		var elfStatus = {
			summoned:false,
			elf:null,
		}
		this.elvesStatus[elfName] = elfStatus;

		if(elfButtons){
			elfStatus.elfButton = elfButtons[elfName].elfButton;
		}
		if(elfActiveButtons){
			elfStatus.activeButtons = elfActiveButtons[elfName];
			//console.log(elfStatus.activeButtons);
		}
		console.log("init elfStatus",this.elvesStatus,elfName);
	}
	eventHandler.remove("initElfButton");
	eventHandler.remove("initElfActiveButton");
}
ElfEventManager.prototype.tick =function (eventHandler){
	this.handleActiveEvent(eventHandler);
	this.handleActiveSpell(eventHandler);
	var activeElfData = eventHandler.listen("activeElf");
	if(!activeElfData)
		return;
	if(activeElfData.elf.busy){
		return;
	}
	this.handleLevelupEvent(activeElfData,eventHandler);
	this.handleTeleportEvent(activeElfData,eventHandler);
	this.handleSpellEvent(activeElfData,eventHandler);
}
ElfEventManager.prototype.handleActiveSpell = function (eventHandler){
	var spellActive = eventHandler.listen("spellActive");
	if(!spellActive)
		return;
	var elf = spellActive.elf;
	var spellInfo = spellActive.info;
	var targetCell = spellActive.targetCell;
	var nowTime = eventHandler.listen("time");
	//add casting mark
	var elfCastingMark = new Drawable();
	elfCastingMark.img = img.elfCastingMark;
	elfCastingMark.radius = 40;
	elfCastingMark.ctxAlpha = 0.7;
	elfCastingMark.x = elfCastingMark.y = 0;
	elfCastingMark.rad = 0;
	elfCastingMark.draw = function (context){
		context.drawImage(this.img,-this.radius,-this.radius,this.radius*2,this.radius*2);
		this.rad += 0.2;
	}
	elf.drawListBottom.elfCastingMark = elfCastingMark;
	
	if(spellInfo.type == "attack"){
		if(!spellInfo.elfBuff){
			eventHandler.registDelayFunc(function (){
				//remove elfCastingMark
				delete elf.drawListBottom.elfCastingMark;
				elf = null;
			},(spellInfo.repeat-1)*spellInfo.repeatDelay)
			
		}
		var spellSound = spellInfo.sound;
		for (var i = 0; i < spellInfo.repeat;i++ ){
			eventHandler.registDelayFunc(function (){
				if (spellSound){
					audio.play('spellSound');
				}else{
					audio.play('elfSpell');					
				}
			},i * spellInfo.repeatDelay);
		}

		
		var attack = {
			damage:spellInfo.damage * Math.pow(spellInfo.grow,elf.level-1),
		}
		if (spellInfo.attackType == "circle"){
			attack.x = targetCell.x;
			attack.y = targetCell.y;
			attack.color = elf.color;
			attack.radius = (spellInfo.spellRange-1) * targetCell.width;
			attack.cells = targetCell.getAroundCellsByRange(spellInfo.spellRange-1);
			attack.cells.push(targetCell);
			var attackType = "circle";
		}else{
			//type is line
			attack.x = elf.cell.x;
			attack.y = elf.cell.y;
			attack.color = elf.color;
			attack.rad = elf.rad;
			attack.lineWidth = spellInfo.lineWidth || 6;
			attack.width = spellInfo.width;
			var attackType = "line";
			console.log("regist line")
		}
		//regist attack event
		for (var repeatNum = 0; repeatNum < spellInfo.repeat; repeatNum ++){
			var activeTime = nowTime + repeatNum * spellInfo.repeatDelay;
			var attackEvent = eventHandler.listen("attack"+activeTime);
			if(!attackEvent){
				attackEvent = {
					endTime:activeTime,
				};
				eventHandler.regist("attack"+activeTime,attackEvent);
			}
			if(!attackEvent[attackType]){
				attackEvent[attackType] = new Array();
				attackEvent[attackType].push(attack);
			}
			//console.log(repeatNum);
		}
		if(spellInfo.elfBuff){
			//handle elf buff
			var oldRange = elf.range;
			var buff = spellInfo.elfBuff;
	
			if(buff.damage){
				elf.realDamage = Math.round(elf.realDamage * buff.damage);
			}
			if (buff.speed){
				elf.realAttackDelay = Math.round(elf.realAttackDelay / buff.speed);
				if(elf.realAttackDelay < elf.minAttackDelay)
					elf.realAttackDelay = elf.minAttackDelay;
			}
			if(buff.range){
				elf.range += buff.range;
			}
			eventHandler.registDelayFunc(function (){
				elf.realDamage = elf.damage * elf.currGrow;
				elf.realAttackDelay = Math.floor(elf.attackDelay/Math.pow(elf.currGrow,elf.level-1));
				if(elf.realAttackDelay < elf.minAttackDelay){
					elf.realAttackDelay = elf.minAttackDelay;
				}
				elf.range = oldRange;
				//remove casting mark
				delete elf.drawListBottom.elfCastingMark;
				elf = null;
			},buff.duration)
		}
	}else{
		//spell is buff
		eventHandler.registDelayFunc(function (){
			//remove elfCastingMark
			delete elf.drawListBottom.elfCastingMark;
			elf = null;
		},spellInfo.duration);
		
		var buffCells = targetCell.getAroundCellsByRange(spellInfo.spellRange-1);
		var buff = {
			name:spellInfo.name,
			duration:spellInfo.duration,
			startTime:nowTime,
		};
		if(spellInfo.buffDamage){
			buff.damage = spellInfo.buffDamage * Math.pow(spellInfo.grow,elf.level-1);
		}
		if(spellInfo.buffSpeed){
			buff.speed = spellInfo.buffSpeed * Math.pow(spellInfo.grow,elf.level-1);
		}
		if(spellInfo.buffRange){
			buff.range = spellInfo.buffRange;
		}
		for (var i = 0; i < buffCells.length; i++){
			var nowBuff = buffCells[i];
			if (nowBuff.tower){
				nowBuff.tower.addBuff(buff)
			}
		}
	}
	eventHandler.delayRemove("spellActive");
	//extral drawable use this event too
}
ElfEventManager.prototype.castSpell = function (activeElfData,spellInfo,targetCell,eventHandler){
	var elf = activeElfData.elf;
	elf.castSpell(spellInfo,targetCell,eventHandler);
	eventHandler.remove("magicCircle");
}

ElfEventManager.prototype.handleSpellEvent = function(activeElfData,eventHandler){

	var pushedSpell = eventHandler.listen("spellPushed");
	if(pushedSpell){
		if(pushedSpell.info.directional == false){
			eventHandler.regist("usingSpell",{elf:activeElfData.elf,started:false,info:pushedSpell.info,directional:false});
		}else{
			eventHandler.regist("usingSpell",{elf:activeElfData.elf,started:false,info:pushedSpell.info,directional:true});
		}
		eventHandler.remove("spellPushed");
		return;
	}
	var elf = activeElfData.elf;
	
	var usingSpell = eventHandler.listen("usingSpell");
	if(!usingSpell){
		elf.cell.removeSpellMark(eventHandler);
		elf.hideMagicCircle(eventHandler);
		return;
	}
	
	elf.showMagicCircle(usingSpell.info,eventHandler);
	elf.hideRangeCircle(eventHandler);
	
	if(usingSpell.directional == false){
		//only circle type can be undirectional
		//includeing circle attack and buff
		elf.cell.addCircleSpellMark(usingSpell.info,eventHandler);
		if(eventHandler.listen("castPushed")){
			this.castSpell(activeElfData,usingSpell.info,elf.cell,eventHandler);
			eventHandler.remove("castPushed");
			eventHandler.remove("usingSpell");
		}
		return;
	}
	
	var touch = eventHandler.listen("touch");
 	if(touch){
		var offsetTouch = {
			x : touch.x - this.battleField.x,
			y : touch.y - this.battleField.y
		}
	}

	var spellCellData = eventHandler.listen("spellCellData");
	var field = this.battleField;	
	
	if(!offsetTouch){
		eventHandler.remove("spellCircle");
		//finger out
		
		if(!spellCellData){
			if(usingSpell.started == false)
				return;
			eventHandler.remove("teleporting");
			return;
		}
		var hoveredCell = spellCellData.hoveredCell;
		
		if(spellCellData.ifAvailable == true){
			//active
			audio.play('stageClick');
			var target = hoveredCell;
			this.castSpell(activeElfData,usingSpell.info,target,eventHandler);
		}
		hoveredCell.removeSpellMark(eventHandler);
		eventHandler.remove("spellCellData");
		eventHandler.remove("usingSpell");
		field.getStepData();
		return;
	}
	usingSpell.started = true;
	var hoverCell = this.battleField.getHoverCell(offsetTouch);
	if(hoverCell){
		if(spellCellData){
			spellCellData.hoveredCell.removeSpellMark(eventHandler);
		}
		if(usingSpell.info.type == "attack"){
			if(usingSpell.info.attackType == "circle"){
				if(elf.ifCellInRange(hoverCell,usingSpell.info.castRange) == true){
					//console.log("enter");
					hoverCell.addCircleSpellMark(usingSpell.info,eventHandler);
					eventHandler.regist("spellCellData",{hoveredCell:hoverCell , ifAvailable:true});
					return;
				}
			}else{
				//line
				elf.cell.addLineSpellMark(usingSpell.info,elf.getTargetRad(hoverCell),eventHandler);
				eventHandler.regist("spellCellData",{hoveredCell:hoverCell,ifAvailable:true});
				return;
			}
		}else{
			//buff
			if(elf.ifCellInRange(hoverCell,usingSpell.info.castRange) == true){
				hoverCell.addCircleSpellMark(usingSpell.info,eventHandler);
				eventHandler.regist("spellCellData",{hoveredCell:hoverCell , ifAvailable:true});
				return;
			}
		}
		eventHandler.regist("spellCellData",{hoveredCell:hoverCell , ifAvailable:false});
	}else{
		//not hover
		if(spellCellData){
			spellCellData.hoveredCell.removeSpellMark(eventHandler);
			eventHandler.remove("spellCellData");
		}
	}
}
ElfEventManager.prototype.handleLevelupEvent = function (activeElfData,eventHandler){
	var levelupData = eventHandler.listen("levelupPushed");
	if(!levelupData)
		return;
	eventHandler.remove("levelupPushed");
	activeElfData.elf.levelup(eventHandler);
}
ElfEventManager.prototype.handleTeleportEvent = function (activeElfData,eventHandler){
	if(eventHandler.listen("teleportPushed")){
		eventHandler.regist("teleporting",{started:false});
		eventHandler.remove("teleportPushed");
		return;
	}

	var teleporting = eventHandler.listen("teleporting");
	if(!teleporting)
		return;

	var touch = eventHandler.listen("touch");
 	if(touch){
		var offsetTouch = {
			x : touch.x - this.battleField.x,
			y : touch.y - this.battleField.y
		}
	}

	var teleportCellData = eventHandler.listen("teleportCellData");
	var field = this.battleField;	
	
	if(!offsetTouch){
		eventHandler.remove("rangeCircle");
		//finger out
		if(!teleportCellData){
			if(teleporting.started == false)
				return;
			eventHandler.remove("teleporting");
			return;
		}
		var hoveredCell = teleportCellData.hoveredCell;
		
		if(teleportCellData.ifAvailable == true){
			audio.play('stageClick');
			var elf = activeElfData.elf;
			var pauseEvent = eventHandler.listen("pause");
			if(pauseEvent && elf.summonTime && elf.summonTime == pauseEvent.time){
				elf.teleportTo(hoveredCell,eventHandler,false);
			}else{
				elf.teleportTo(hoveredCell,eventHandler,true);
			}
		}
		hoveredCell.removeHoverMark();
		hoveredCell.removeTempElf();
		eventHandler.remove("teleportCellData");
		eventHandler.remove("teleporting");
		eventHandler.remove("activeElf");
		field.getStepData();
		return;
	}
	teleporting.started = true;
	var hoverCell = this.battleField.getHoverCell(offsetTouch,true);
	if(hoverCell){
		if(teleportCellData){
			teleportCellData.hoveredCell.removeHoverMark();
			teleportCellData.hoveredCell.removeTempElf();
		}

		if(hoverCell.ifSummonable() == true){
			hoverCell.addTempElf(activeElfData.name,eventHandler);
			//let the old cell being empty
			activeElfData.elf.cell.empty = true;
			if(field.pathIsClear()){
				activeElfData.elf.cell.empty = false;
				hoverCell.addHoverMark(true);
				eventHandler.regist("teleportCellData",{hoveredCell:hoverCell,ifAvailable:true});
				return;
			}
			activeElfData.elf.cell.empty = false;
		}
		hoverCell.addHoverMark(false);
		eventHandler.regist("teleportCellData",{hoveredCell:hoverCell , ifAvailable:false});
	}else{
		if(teleportCellData){
			teleportCellData.hoveredCell.removeTempElf();
			teleportCellData.hoveredCell.removeHoverMark();
			eventHandler.remove("teleportCellData");
		}
	}
}
ElfEventManager.prototype.handleActiveEvent = function(eventHandler){
	var summonedElfData = eventHandler.listen("elfSummoned");
	if(summonedElfData){
		var newElfStatus = this.elvesStatus[summonedElfData.name]
		newElfStatus.summoned = true;
		newElfStatus.elf = summonedElfData.elf;
		newElfStatus.elfButton.linkElf(summonedElfData.elf,eventHandler);
		var elfButtons = newElfStatus.activeButtons;
		for(var buttonName in elfButtons ){
			if(buttonName == "spells"){
				continue;
			}
			var newButton = elfButtons[buttonName];
			//console.log(newButton,buttonName);
			newButton.linkElf(summonedElfData.elf,eventHandler);
		}
		console.log(newElfStatus)
		for(var spellName in elfButtons.spells){
			var newButton = elfButtons.spells[spellName];
			newButton.linkElf(summonedElfData.elf,eventHandler);
		}
		eventHandler.remove("elfSummoned");
		return;
	}
	var activeElfButton = eventHandler.listen("activeElfButton");
	if(!activeElfButton)
		return;
	
	var elfStatus = this.elvesStatus[activeElfButton.name];
	if(!elfStatus){
		console.error("no ",activeElfButton.name," in manager");
		return;
	}
	if(elfStatus.summoned == false){
		if(this.checkCost(eventHandler)){
			eventHandler.regist("summon",{name:activeElfButton.name,cost:{mena:this.elfSummonCost},type:"elf"});

		}else{
			eventHandler.remove("touch");
			eventHandler.regist("clearTouch");
		}
		eventHandler.remove("activeElfButton");
	}else{
		eventHandler.regist("activeElf"
							,{name:activeElfButton.name,
							  elf:this.elvesStatus[activeElfButton.name].elf
							 });
		eventHandler.remove("touch");
		eventHandler.regist("clearTouch");
		eventHandler.remove("activeElfButton");
	}
}
ElfEventManager.prototype.checkCost = function (eventHandler){
	var mena = eventHandler.listen("asset").mena;
	if(mena >= 300)
		return true;
	else
		return false;
}
