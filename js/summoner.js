var Summoner = Sprite.sub();
Summoner.prototype._init = function (game,screenSize,summonerInfo){
	if (summonerInfo.rad){
		this.rad = summonerInfo.rad
	};
	var summonerData = game.db.battleFieldSprites.getDataByName("summoner");
	Summoner.parent.call(this,summonerData);
	this.width = Math.round(
		summonerData.width * screenSize.cellWidth/screenSize.defautCellWidth
	);
	this.height = Math.round(
		this.width * summonerData.height / summonerData.width
	);
	console.log(this.width,this.height);
	this.x = 0;
	this.y = 0;
	this.k = 0;
	this.cell;
	this.magicCircle = new Sprite(summonerData.magicCircle);
	this.magicCircle.x = -1;
	this.magicCircle.y = 3;
	this.magicCircle.rad = 0;
	this.drawListBottom.magicCircle = this.magicCircle;

	this.hurtMark = new Drawable();
	this.hurtMark.hide = true;
	this.hurtMark.img = img.summonerHurtMark;
	this.hurtMark.x = Math.round(this.width*0.1);
	this.hurtMark.y = Math.round(-this.height*0.6);
	this.hurtMark.width = Math.round(this.width*0.6);
	this.hurtMark.height = this.hurtMark.width;
	this.hurtMark.k = 0;
	this.hurtMark.draw = function (context){
		//console.log(this.k,Math.sin(this.k)*10);
		context.drawImage(this.img,0,0,this.width,this.height);
	}
	this.drawList.hurtMark = this.hurtMark;
}
Summoner.prototype.draw = function (context,eventHandler){
	this.x = Math.sin(this.k) * 5;
	Summoner.parent.prototype.draw.call(this,context,eventHandler)
	//context.fillStyle="rgba(130,130,20,0.8)";
	//context.fillRect(-20,-20,40,40);
}
Summoner.prototype.tick = function (eventHandler){
	this.nextFrame(eventHandler);
	this.magicCircle.rad += 0.1;
}
Summoner.prototype.hurted = function (damage,eventHandler){
	var hurted = eventHandler.listen("hurted");
	audio.play('hurt');
	if (!hurted){
		eventHandler.regist("hurted",{num:damage});
	}else{
		hurted.num += damage;
	}
	this.hurtMark.hide = false;
	var self = this;
	this.showDamageAnimation(damage,eventHandler);
	eventHandler.registObjectAnimate(this,{
		k:4
	},4);
	eventHandler.registDelayFunc(function (){
		self.x = 0;
		self.k = 0;
	},5)
	eventHandler.registDelayFunc(function (){
		self.hurtMark.hide = true;
		self = null;
		eventHandler = null;
	},10);
}
Summoner.prototype.showDamageAnimation = function (damage,eventHandler){
	var animateTick = 5;
	var waitTick = 6;
	var startY = this.cell.y + this.y + 10 ;
	var damageMark = new Drawable();
	damageMark.width = 18;
	damageMark.height = 15;
	damageMark.price = this.price;
	damageMark.x = this.x +this.cell.x- 10;
	damageMark.y = startY;

	if (damage > 1){
		if (damage > 3){
			damageMark.scalex = damageMark.scaley =  2.3;
		}else{
			damageMark.scalex = damageMark.scaley =  1.8;			
		}
	}else{
		damageMark.scalex = damageMark.scaley =  1.5;
	}
	
	damageMark.ctxAlpha = 0;
	damageMark.img = img.damageMark;
	//damageMark.rad = -Math.PI;
	damageMark.draw = function (context){
		context.drawImage(this.img,0,0,this.width,this.height);
		context.font = "bold 20px MyFont";
		//context.fillStyle = "#fff59b"
		context.fillStyle = "rgba(10,10,10,0.7)";
		context.fillText("－"+damage,this.width+2,Math.round(this.width)*0.8+1)
		context.fillStyle = "#cf0918";
		context.fillText("－"+damage,this.width+1,Math.round(this.width)*0.8)
	}
	var obj = {
		drawable:damageMark,
		ticks:animateTick*2 + waitTick,
	}
	var extralDrawables = eventHandler.listen("addExtralDrawables");
	if(extralDrawables){
		extralDrawables.push(obj);
	}else{
		eventHandler.regist("addExtralDrawables",[obj]);
	}
	eventHandler.registObjectAnimate(damageMark,{
		ctxAlpha:0.2,
		y:+8,
	},animateTick);
	
	eventHandler.registDelayFunc(function (){
		eventHandler.registObjectAnimate(damageMark,{
			ctxAlpha:-0.2,
		},animateTick-1)
	},animateTick + waitTick);
	
	eventHandler.registDelayFunc(function (){
		damageMark = null;
		eventHandler = null;
	},animateTick*2 + waitTick);
}