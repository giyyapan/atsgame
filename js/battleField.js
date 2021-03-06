//BattleField handle events about the battleField
var BattleField = Drawable.sub();
BattleField.prototype._init = function (stageInfo,game,screenSize,eventHandler){
	this.x = (screenSize.width - screenSize.cellWidth * (9-8/4))/2;
	this.y = screenSize.height/12;
	this.rowNum = 9;
	this.lineNum = 9;
	this.screenSize = screenSize;
	this.game = game;
	var fieldData = stageInfo.fieldData;
	var itemNum = 0;
	
	//init flyDemonsArray
	this.flyDemons = {};
	this.flyDemonDrawList = new Drawable();
	this.flyDemonDrawList.drawList = this.flyDemons;
	this.drawStack.push(this.flyDemonDrawList);

	//init Cells
	this.cells = new Array();
	for (var row = 0; row < this.rowNum; row++){
		this.cells[row] = [];
		for (var line = 0; line < this.lineNum; line++){
			this.cells[row][line] = new FieldCell(row,line,this.game,screenSize,fieldData[line][row],this);
			this.drawStack.push(this.cells[row][line]);
 		}
	}
	//console.log(this.cells);
	this.linkCells();

	//init Summoner
	var summonerData = stageInfo.summoner;
	this.summonerCell = this.cells[summonerData.x][summonerData.y].setSummoner(summonerData);

	//init Gate
	for(var i = 0 ;i < stageInfo.demonGate.length ; i++){
		var nowData = stageInfo.demonGate[i];
		var newGate = this.cells[nowData.x][nowData.y].setDemonGate(nowData);
	}
	
	//init cell size info
	this.cellWidth = this.cells[0][0].width;
	this.cellHeight = this.cells[0][0].height;
	this.cellHalfHeight = this.cellHeight/2;
	this.cellQuarterWidth = this.cellWidth/4;
	this.cellQuarterHeight = this.cellHeight/4;
	
	this.getStepData();
}
BattleField.prototype.tick = function (eventHandler){
	//console.log("tick");
	if(!eventHandler.listen ("pause")){
		for(var id in this.flyDemons){
			console.log("flyTick")
			this.flyDemons[id].tick(eventHandler);

		}
	}
	for (var i = 0; i < this.cells.length; i++){
		for (var j = 0; j < this.cells[i].length; j++){
			this.cells[i][j].tick(eventHandler);
		}
	}
}

BattleField.prototype.pathIsClear = function (){
	var self = this;
	var startCell = this.summonerCell;
	var cells = this.cells;

	for (var i = 0; i < cells.length; i++){
		for (var j = 0; j < cells[i].length; j++){
			var nowCell = cells[i][j];
			delete nowCell.testStepNum;
			delete nowCell.closed;
			if(!nowCell.empty||nowCell.tempTower||nowCell.tempElf)
				nowCell.testEmpty = false;
			else{
				nowCell.testEmpty = true;
			}
		}
	}
	
	startCell.testStepNum = 1;
	
	var nextCellArray = new Array();
	nextCellArray.push(startCell);
	var nextArrayPointer = 0;

	while(nextArrayPointer < nextCellArray.length){
		var nowCell = nextCellArray[nextArrayPointer];
		getIn(nowCell);
		nextArrayPointer ++ ;
	}

	return checkPath();
	
	function getIn(cell){
		cell.closed = true;
		
		for (var i = 1; i <= 6; i++){
			var nowPointer = 'p'+i;
			var nextCell = cell[nowPointer];
			if(!nextCell || nextCell.closed || (!nextCell.testEmpty && !nextCell.demonGate)) {
				continue;
			}
			if(!nextCell.testStepNum){
				nextCell.testStepNum = cell.testStepNum + 1;
			}else{
				if(nextCell.testStepNum > cell.testStepNum + 1){
					nextCell.testStepNum = cell.testStepNum + 1;
				}
			}
			
			if(!nextCell.closed)
				nextCell.closed = true;
				nextCellArray.push(nextCell);
		}
	}
	function checkPath(){
		var clear = true;
		for (var i = 0; i < self.rowNum; i++){
			for (var j = 0; j < self.lineNum; j++){
				var nowCell = cells[i][j];
				if(!nowCell.testStepNum && (nowCell.demonGate || nowCell.demons.length > 0 )){
					//console.log(nowCell.testStepNum,nowCell.demonGate,nowCell.demons.length);
					clear = false;
				}
			}
		}
		return clear;
	}
}
BattleField.prototype.enterFlyDemon = function (newDemon){
	this.flyDemons[newDemon.id] = newDemon
}
BattleField.prototype.removeFlyDemon = function (demon){
	delete this.flyDemons[demon.id];
}
BattleField.prototype.getStepData = function (){
	var startCell = this.summonerCell;
	var cells = this.cells;

	for (var i = 0; i < cells.length; i++){
		for (var j = 0; j < cells[i].length; j++){
			var nowCell = cells[i][j];
			delete nowCell.stepNum;
			delete nowCell.closed;
		}
	}
	
 	startCell.stepNum = 1;
	
	var nextCellArray = new Array();
	nextCellArray.push(startCell);
	var nextArrayPointer = 0;

	while(nextArrayPointer < nextCellArray.length){
		var nowCell = nextCellArray[nextArrayPointer];
		getIn(nowCell);
		nextArrayPointer ++ ;
	}
	
	function getIn(cell){
		cell.closed = true;
		
		for (var i = 1; i <= 6; i++){
			var nowPointer = 'p'+i;
			var nextCell = cell[nowPointer];
			if(!nextCell || nextCell.closed || (!nextCell.empty && !nextCell.demonGate)) {
				continue;
			}
			if(!nextCell.stepNum){
				nextCell.stepNum = cell.stepNum + 1;
			}else{
				if(nextCell.stepNum > cell.stepNum + 1){
					nextCell.stepNum = cell.stepNum + 1;
				}
			}
			
			if(!nextCell.closed)
				nextCell.closed = true;
				nextCellArray.push(nextCell);
		}
	}

}

BattleField.prototype.linkCells = function (){
	for (var i = 0; i < this.rowNum; i++){
		if(i % 2 == 0){
			for (var j = 0; j < this.lineNum; j++){
				if(this.cells[i][j-1]){
					this.cells[i][j].p6 = this.cells[i][j-1];
				}
				if(this.cells[i-1] && this.cells[i-1][j-1]){
					this.cells[i][j].p4 = this.cells[i-1][j-1];
				}
				if(this.cells[i-1] && this.cells[i-1][j]){
					this.cells[i][j].p2 = this.cells[i-1][j]
				}
				if (this.cells[i][j+1]){
					this.cells[i][j].p1 = this.cells[i][j+1];
				}
				if (this.cells[i+1] && this.cells[i+1][j]){
					this.cells[i][j].p3 = this.cells[i+1][j];
				}
				if (this.cells[i+1] && this.cells[i+1][j-1]){
					this.cells[i][j].p5 = this.cells[i+1][j-1];
				}
			}
		}else{
			for (var j = 0; j < this.lineNum; j++){
				if(this.cells[i][j-1]){
					this.cells[i][j].p6 = this.cells[i][j-1];
				}
				if(this.cells[i-1] && this.cells[i-1][j]){
					this.cells[i][j].p4 = this.cells[i-1][j];
				}
				if(this.cells[i-1] && this.cells[i-1][j+1]){
					this.cells[i][j].p2 = this.cells[i-1][j+1]
				}
				if (this.cells[i][j+1]){
					this.cells[i][j].p1 = this.cells[i][j+1];
				}
				if (this.cells[i+1] && this.cells[i+1][j+1]){
					this.cells[i][j].p3 = this.cells[i+1][j+1];
				}
				if (this.cells[i+1] && this.cells[i+1][j]){
					this.cells[i][j].p5 = this.cells[i+1][j];
				}
			}
		}
	}
}
BattleField.prototype.getHoverCell = function (offsetTouch,deflect){
	var field = this;
	
	var deflectedY = 0;
	if(deflect)
		var deflectedY = Static.mobileUser ? -field.cellHeight : 0;

	var offsetY = offsetTouch.y + deflectedY;
	var row = -1;
	
	var quarterRow = Math.floor(offsetTouch.x / field.cellQuarterWidth);
	
	if(quarterRow % 3 == 0){
		var rowR = Math.floor(quarterRow / 3);
		var rowL = rowR - 1;
	}else{
		var row = Math.floor(quarterRow/3);
	}
	if(row > -1){
		if(row % 2 != 0){
			//ji
			var line = Math.floor((offsetY - field.cellHalfHeight) / field.cellHeight);
		}else{
			//ou
			var line = Math.floor((offsetY)/ field.cellHeight);
		}
	}else{
		var quarterLine = Math.floor(offsetY/ field.cellQuarterHeight);
		if(rowL % 2 != 0){
			//L ji
			if(quarterLine % 4 == 1 || quarterLine % 4 == 2){
				//console.log("L ji R")
				var line = Math.floor(quarterLine / 4);
				var row = rowR;
			}else{
				//console.log("L ji L")
				var line = Math.floor((quarterLine-1) / 4);
				var row = rowL;
			}
		}else{
			//L ou
			if(quarterLine % 4 == 1 || quarterLine % 4 == 2){
				//console.log("L ou L")
				var line = Math.floor(quarterLine / 4);
				var row = rowL;
			}else{
				//console.log("L ou R")
				var line = Math.floor((quarterLine-1) / 4);
				var row = rowR;
			}
		}
	}
	//console.log(row,line,rowL,rowR);
	if(field.cells[row] && field.cells[row][line]){
		return field.cells[row][line];
	}
}
