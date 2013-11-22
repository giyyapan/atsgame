var StageBar = Drawable.sub();
StageBar.prototype._init = function (){
	this.width;
	this.height;
	this.x;
	this.y;
	this.buttons;
}
StageBar.prototype.handleInteractionEvents = function (eventHandler){
	if(!this.buttons) return;
	//handle hover
	var mouse = eventHandler.listen("mouseover");

	if (!Static.mobileUser && mouse){
		var offsetMouse = {
			x:mouse.x - this.x,
			y:mouse.y - this.y
		}
		for (var i = 0; i < this.buttons.length; i++){
			this.buttons[i].handleHover(offsetMouse,eventHandler);
		}
	}
	//handle touch
	var touch = eventHandler.listen("touch");
	if(!touch) return;

	var offsetTouch = {
		x: touch.x - this.x,
		y: touch.y - this.y
	}
	if(offsetTouch.x > this.width
	  || offsetTouch.y > this.height)
		return;
	for (var i = 0; i < this.buttons.length; i++){
		this.buttons[i].ifTouched(offsetTouch,eventHandler);
	}
}
StageBar.prototype.draw = function (context,eventHandler){
	//context.drawImage(this.img,0,0,this.width,this.height);
}
StageBar.prototype.initBg = function (width,height,screenSize,fixByHeight){
	this.bg = new Drawable();
	this.bg.img = this.bgImg;
	if(fixByHeight){
		this.bg.height = this.height;
		//this.bg.height = Math.round(height / screenSize.defautHeight * screenSize.height);
		this.bg.width = Math.round(width / height * this.bg.height);
	}else{
		//this.bg.width = Math.round(width / screenSize.defautWidth * screenSize.width) ;
		this.bg.width = this.width;
		this.bg.height = Math.round(height / width * this.bg.width);
	}
	this.bg.x = Math.round((this.width - this.bg.width) / 2);
	//this.bg.y = (this.height - this.bg.height) / 2;
	this.bg.y = 0;
	//alert(this.bg.width+" "+this.bg.height+" "+this.bg.x+" "+this.bg.y);
	
	this.bg.draw = function (context){
		//console.log("enter");
		context.drawImage(this.img,0,0,this.width,this.height);
	}
	this.drawListBottom.bg = this.bg;
}
