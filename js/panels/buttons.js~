var BarButton = Drawable.sub();
BarButton.prototype._init = function (buttonName,buttonData){
	this.name = buttonName;
	this.hover = false;
	this.autoHover = true;
	if (!buttonData){
		return;
	}
	
	if (buttonData.buttonPic){
		this.img = buttonData.buttonPic;
		this.normalImg = buttonData.buttonPic;
	}
	if(buttonData.cost){
		this.cost = buttonData.cost;
	}
}
BarButton.prototype.draw = function (context,eventHandler){
	var width = Math.round(this.width);
	var height = Math.round(this.height);
	/*
	if (this.hover){

		if (this.hoverCircleRadius){
			var radius = this.hoverCi
		}else{
			var radius = width<height?width:height;			
		}
		context.beginPath();
		context.arc(width/2,height/2,radius,0,Math.PI*2);
		context.fillStyle = 'rgba(200,200,200,0.1)';
		context.closePath();
		context.fill();
	}
	*/
	context.drawImage(this.img,0,0,Math.round(this.width),Math.round(this.height));
}
BarButton.prototype.ifTouched = function (offsetTouch,eventHandler){
	if(offsetTouch.x > this.x && offsetTouch.x < this.x + this.width){
		if(offsetTouch.y > this.y && offsetTouch.y < this.y + this.height){
			//console.log (this.name,"touched");
			if(typeof this.active == "function"){
				eventHandler.regist("uiFresh");
				this.active(eventHandler);
			}
			return true;
		}
	}
	return false;
}
BarButton.prototype.handleHover = function (offsetMouse,eventHandler){
	if(offsetMouse.x > this.x && offsetMouse.x < this.x + this.width){
		if(offsetMouse.y > this.y && offsetMouse.y < this.y + this.height){
			//console.log(this.name, 'hover');
			eventHandler.regist("hover");
			if (!this.hover){
				this.hover = true;
				if (this.autoHover){
					this.normalX = this.x;
					this.normalY = this.y;
					this.x = Math.round(this.normalX - this.width * 0.025);
					this.y = Math.round(this.normalY - this.height * 0.025);
					this.scale = 1.05;
				}
				eventHandler.regist("uiFresh");
			}
			return;
		}
	}
	if (this.hover){
		this.hover = false;
		if (this.autoHover){
			this.x = this.normalX;
			this.y = this.normalY;
			this.scale = 1;
		}
		eventHandler.regist("uiFresh");
	}
}
BarButton.prototype.checkCost = function (eventHandler){
	var mena = eventHandler.listen("asset").mena;
	if(this.cost.mena > mena){
		return false;
	}
	return true;
}
BarButton.lockedButtonActiveFunc = function (eventHandler){
	eventHandler.remove("touch");
	eventHandler.regist("clearTouch");
	return;
}
