BgFieldManager = Drawable.sub();
BgFieldManager.prototype._init = function (stageInfo,screenSize,eventHandler){
	this.screenSize = screenSize;
	this.stageInfo = stageInfo;
	this.x = (screenSize.width - screenSize.cellWidth * (9-8/4))/2;
	this.y = screenSize.height/12;

	//init fieldCellsBg
	this.fieldCells = new Drawable();
	this.fieldCells.img = img.fields;
	this.fieldCells.width = screenSize.cellWidth * (9 - 8/4);
	this.fieldCells.height = Math.round(screenSize.cellHeight * 9.5);
	this.fieldCells.draw = function (context,eventHandler){
		context.drawImage(this.img,0,0,this.width,this.height);
	}
	this.fieldCells.hide = true;
	this.drawListBottom.fieldCells = this.fieldCells;

	//init fieldUnavailMark
	this.unavailCellMarks = [];
	var fieldData = stageInfo.fieldData;
	this.cellWidth = screenSize.cellWidth;
	this.cellHeight = screenSize.cellHeight;
	this.rowNum = 9;
	this.lineNum = 9;
	
	for (var row = 0; row < this.rowNum; row++){
		for (var line = 0; line < this.lineNum; line++){
			if(fieldData[line][row] == 0){
				var x = row *3/4 * this.cellWidth + this.cellWidth/2;
				var y = line * this.cellHeight + this.cellHeight/2;
				if(row % 2 != 0) y += this.cellWidth/2;
				this.addUnavailCellMark(x,y);
			}
 		}
	}
	this.drawStack = this.unavailCellMarks;
}
BgFieldManager.prototype.addUnavailCellMark = function (x,y){
	var mark = new Drawable();
	if (this.stageInfo.bg == img.bg_grassField
		|| this.stageInfo.bg == img.bg_waterField){
		mark.img = img.unavailCellMark_light;
	}else{
		mark.img = img.unavailCellMark;				
	}
	mark.img = img.unavailCellMark_light;
	//mark.img = img.unavailCellMark;				
	mark.width = this.cellWidth;
	mark.height = this.cellHeight;
	mark.x = x - this.cellHeight/2;
	mark.y = y - this.cellHeight/2
	mark.draw = function (context){
		context.drawImage(this.img,0,0,this.width,this.height);
	}
	this.unavailCellMarks.push(mark);
	//console.error(mark);
}
BgFieldManager.prototype.tick = function (){
	
}
BgFieldManager.prototype.next = function (context,eventHandler){
	if(!eventHandler.listen("bgFresh")){
		return;
	}
	eventHandler.remove("bgFresh");
	if(eventHandler.listen("summon")
	   ||eventHandler.listen("activeElf")
	   ||eventHandler.listen("activeTower")){
		this.fieldCells.hide = false;
	}else{
		this.fieldCells.hide = true;
	}
	context.clearRect(0,0,this.screenSize.width,this.screenSize.height);
	context.save();
	this.onDraw(context,eventHandler);
	context.restore();
}