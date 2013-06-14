var Drawable = Class.sub();
Drawable.prototype._init = function (){
	this.drawStack = new Array();
	this.drawList = {};
	this.drawListBottom = {};
	//alert(this.drawRate)
}
Drawable.prototype.onDraw = function (context,eventHandler){
	if(this.hide){
		return;	
	}
	context.save();
	if(typeof this.ctxAlpha != "undefined")
		context.globalAlpha = this.ctxAlpha;
	if(typeof this.x != "undefined" && typeof this.y != "undefined")
		context.translate(Math.round(this.x),Math.round(this.y))
	if(typeof this.rad != "undefined")
		context.rotate(this.rad);
	if(typeof this.scale != "undefined" || (typeof this.scalex != "undefined" && typeof this.scaley != "undefined")){
		if(this.scale)
			this.scalex = this.scaley = this.scale;
		context.scale(this.scalex,this.scaley);
	}
	

	for(var i in this.drawListBottom){
		if(typeof this.drawListBottom[i].onDraw != "function")
			return;
		this.drawListBottom[i].onDraw(context,eventHandler);
	}
	
	this.draw(context,eventHandler);
	
	if (this.drawStack.length != 0){
		for (var i = this.drawStack.length -1 ; i >= 0; i--){
			if(typeof this.drawStack[i].onDraw != "function"){
				console.warn("a wrang object is in the drawStack");
				return;
			}
			this.drawStack[i].onDraw(context,eventHandler);
		}
	}

	for(var i in this.drawList){
		if(typeof this.drawList[i].onDraw != "function")
			return;
		this.drawList[i].onDraw(context,eventHandler);
	}

	context.restore();
}
Drawable.prototype.draw = function (context,events){}

var Sprite = Drawable.sub();
Sprite.prototype._init = function (data,screenSize){
	if(!data){
		return;
	}
	if(Static.setting && Static.setting.frameRate == 40){
		this.drawRate = 2;
	}else{
		this.drawRate = 1;
	}
	if(data.drawRate) this.drawRate *= data.drawRate;
	this.map = data.map;
	if(screenSize){
		var k = screenSize.cellWidth/screenSize.defautCellWidth;
		this.width = (data.picWidth||data.width||40) * k;
		this.height = (data.picWidth||data.height||50) * k;
	}else{
		this.width = data.picWidth||data.width||40;
		this.height = data.picWidth||data.height||50;
	}
	this.spriteWidth = data.spriteWidth;
	this.spriteHeight = data.spriteHeight;
	this.movements = data.movements;

	if(this.movements.normal){
		this.nowMove = this.movements.normal;
	}
	this.frameTicker = 0;
	this.spriteTicker = 0;

	this.keyEvent = null;
}
Sprite.prototype.nextFrame = function (eventHandler){
	if(eventHandler.listen("pause")){
		return;
	}
	if(this.frameTicker < this.drawRate){
		this.frameTicker ++;
		return;
	}
	if(this.spriteTicker < this.nowMove.num - 1 ){
		this.spriteTicker ++;
	}else{
		this.spriteTicker = 0;
	}
	this.frameTicker = 0;
}

Sprite.prototype.changeMove = function (newMove,eventHandler,orders){
/*	if(!this.movements[newMove]){
		console.warn("no such movement!",this,newMove);
		return;
	}
*/
	this.spriteTicker = 0;
	this.frameTicker = 0;
	this.nowMove = this.movements[newMove];

	if(!orders) return;
	if(this.nowMove.keyFrame && typeof orders.keyFrameFunc == "function"){
		eventHandler.registDelayFunc(orders.keyFrameFunc
									 ,(this.drawRate+1) * this.nowMove.keyFrame);
	}
	if(this.nowMove.callback && typeof orders.callback == "function"){
		eventHandler.registDelayFunc(orders.callback
									,(this.drawRate+1) * this.nowMove.num);
	}

}
Sprite.prototype.draw = function (context){
	var srcX = (this.nowMove.row + this.spriteTicker )* this.spriteWidth;
	var srcY = this.nowMove.line * this.spriteHeight;
	//		console.log(self.map,srcX,srcY,this.spriteWidth,this.spriteHeight,.width,self.height);
	
	context.drawImage(this.map
					  ,srcX , srcY , this.spriteWidth , this.spriteHeight
					  ,- this.width/2 , - this.height/2 , this.width , this.height);
}

