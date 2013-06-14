var MagicSpring = Drawable.sub();
MagicSpring.prototype._init = function (element,cell){
	this.element = element;
	this.cell = cell;
	this.width = Math.round(cell.width*0.85);
	this.height = this.width;
	//console.log(this);
	switch(element){
	case "fire" :
		this.img = img.fireSpring;
		break;
	case "water" :
		this.img = img.waterSpring;
		break;
	case "wind" :
		this.img = img.windSpring;
		break;
	case "earth" :
		this.img = img.earthSpring;
		break;
	case  "thunder":
		this.img = img.thunderSpring;
		break;
	}
}
MagicSpring.prototype.draw = function (context){
	context.drawImage(this.img,-this.width/2,-this.height/2,this.width,this.height);
}

