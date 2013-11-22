//SummonManager handle events about :
//* Summoning tower and elves
//* Hover a tower
//* Hover a elf
//* Mouse over a tower (for desktop users

var SummonManager = Class.sub();
SummonManager.prototype._init = function (battleField){
	this.battleField = battleField;
	this.cells = battleField.cells;
}
SummonManager.prototype.tick = function (eventHandler){
	if(eventHandler.listen("teleporting") || eventHandler.listen("usingSpell")){
		return;
	}
	if (!Static.mobileUser){
		this.handleMouseOverObject(eventHandler);		
	}
	var touch = eventHandler.listen("touch");
	if(touch){
		var offsetTouch = {
			x : touch.x - this.battleField.x,
			y : touch.y - this.battleField.y
		}
		if(Static.androidUser){
			offsetTouch.y -= 30;
		}
	}
	var summon = eventHandler.listen("summon");
	if(summon){
		eventHandler.regist("bgFresh");
		this.handleSummon(eventHandler,offsetTouch,summon);
		return;
	}
	this.handleHover(eventHandler,offsetTouch);
	var unsummon = eventHandler.listen("unsummon");
	if(unsummon){
		this.handleUnsummon(eventHandler,unsummon);
	}
}
SummonManager.prototype.handleMouseOverObject = function (eventHandler){
	var mouse = eventHandler.listen("mouseover");
	if (!mouse){
		return;
	}
	var offsetMouse = {
		x:mouse.x - this.battleField.x,
		y:mouse.y - this.battleField.y
	}
	var mouseoverCell = this.battleField.getHoverCell(offsetMouse)
	if (mouseoverCell){
		if (mouseoverCell.tower){
			mouseoverCell.tower.hover = true;
			eventHandler.regist('hover');
		}
		if (mouseoverCell.elf){
			mouseoverCell.elf.hover = true;
			eventHandler.regist('hover');
		}
	}
}
SummonManager.prototype.handleUnsummon = function (eventHandler,unsummon){
	unsummon.activeTowerData.tower.unsummon(eventHandler);
	this.battleField.getStepData();
	eventHandler.regist("cost",{mena:unsummon.cost});
	eventHandler.remove("activeTower");
	eventHandler.remove("unsummon");
}
SummonManager.prototype.handleHover = function (eventHandler,offsetTouch){
	if (!offsetTouch){
		return
	}
	var lastHover = eventHandler.listen("activeTower") || eventHandler.listen("activeElf");
		
	var isFresh = false;
	isFresh = eventHandler.remove("activeTower") || isFresh;
	isFresh = eventHandler.remove("activeElf") || isFresh;
	isFresh = eventHandler.remove("magic")|| isFresh;


	
	if(isFresh){
		eventHandler.regist("uiFresh");
		eventHandler.regist("bgFresh");
	}
	var hoverCell = this.battleField.getHoverCell(offsetTouch,false);
	if(hoverCell){
		if(hoverCell.tower){
			if (!lastHover || lastHover.elf || (lastHover.tower.cell.id != hoverCell.id)){
				audio.play('stageClick');
			}
			eventHandler.regist("activeTower",{tower:hoverCell.tower});
			eventHandler.regist("bgFresh");
			return;
		}
		if(hoverCell.elf){
			if (!lastHover || lastHover.tower || (lastHover.elf.cell.id != hoverCell.id)){
				audio.play('stageClick');
			}
			eventHandler.regist("activeElf",{name:hoverCell.elf.name,elf:hoverCell.elf});
			eventHandler.regist("bgFresh");
			return;
		}
	}
}
SummonManager.prototype.handleSummon = function (eventHandler,offsetTouch,summon){
	var summoningTower = (summon.type == "tower")?true:false;
	var summonCellData = eventHandler.listen("summonCellData");
	
	var field = this.battleField;
	
	if(!offsetTouch){
		//finger out
		eventHandler.regist("uiFresh");
		eventHandler.remove("rangeCircle");
		if(!summonCellData){
			eventHandler.remove("summon");
			eventHandler.regist("bgFresh");
			return;
		}
		var hoveredCell = summonCellData.hoveredCell;
		
		if(summonCellData.ifAvailable == true){
			if(hoveredCell.ifSummonable() == false){
				return;
			}
			if(summoningTower){
				audio.play('stageClick');
				hoveredCell.summonTower(summon.name,summon.info,eventHandler);
			}else{
				audio.play('stageClick');
				hoveredCell.summonElf(summon.name,summon.info,eventHandler);
			}
			eventHandler.regist("cost",summon.cost);
		}
		hoveredCell.removeHoverMark();
		if (summoningTower){
			hoveredCell.removeTempTower();				
		}else{
			hoveredCell.removeTempElf();
		}
		eventHandler.remove("summonCellData");
		eventHandler.remove("summon");
		eventHandler.regist("bgFresh");
		field.getStepData();
		return;
	}
	var hoverCell = this.battleField.getHoverCell(offsetTouch,true);
	if(hoverCell){
		if(summonCellData){
			summonCellData.hoveredCell.removeHoverMark();
			if (summoningTower){
				summonCellData.hoveredCell.removeTempTower();
			}else{
				summonCellData.hoveredCell.removeTempElf();
			}
		}

		if(hoverCell.ifSummonable() == true){
			if (summoningTower){
				hoverCell.addTempTower(summon.name,eventHandler);				
			}else{
				hoverCell.addTempElf(summon.name,eventHandler);
			}
			
			if(field.pathIsClear()){
				hoverCell.addHoverMark(true);
				eventHandler.regist("summonCellData",{hoveredCell:hoverCell , ifAvailable:true});
				return;
			}
			
		}
		eventHandler.remove("rangeCircle");
		hoverCell.addHoverMark(false);
		eventHandler.regist("summonCellData",{hoveredCell:hoverCell , ifAvailable:false});
	}else{
		eventHandler.remove("rangeCircle")
		if(summonCellData){
			if (summoningTower){
				summonCellData.hoveredCell.removeTempTower();	
			}else{
				summonCellData.hoveredCell.removeTempElf();
			}
			summonCellData.hoveredCell.removeHoverMark();
			eventHandler.remove("summonCellData");
		}
	}
}

