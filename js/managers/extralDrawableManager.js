var ExtralDrawableManager = Drawable.sub();
ExtralDrawableManager.prototype._init = function (battleField){
	battleField.drawList.extralDrawables = this;
	battleField.drawStack.push(this);
	this.battleField = battleField;
	this.drawList.bullet = new Drawable();
	this.idMaker = 1;
	this.spellMarkRad = 0;
}
ExtralDrawableManager.prototype.tick = function (eventHandler){
	this.handleExtraDrawable(eventHandler);
	this.handleCircles(eventHandler);
	this.handleSpellMarks(eventHandler);
	this.handleBullets(eventHandler);
	this.handleActiveSpellFlash(eventHandler);
}
ExtralDrawableManager.prototype.handleExtraDrawable = function (eventHandler){
	var extralDrawables = eventHandler.listen("addExtralDrawables");
	if(!extralDrawables)
		return;
	//console.log(extralDrawables)
	for(var i=0 ; i < extralDrawables.length ;i ++){
		var item = extralDrawables[i];
		if(!item.ticks || !item.drawable || typeof item.drawable.draw != "function"){
			continue;
		}
		this.drawList[this.idMaker] = item.drawable;
		var id = this.idMaker;
		var self = this;
		eventHandler.registDelayFunc(function (){
			if(!self)
			    return;
		    self.drawList[id] = null;
		    delete self.drawList[id];
		    self = null;
		    id = null;
		},item.ticks-1);
		this.idMaker ++;
	}
	eventHandler.remove("addExtralDrawables");
}
ExtralDrawableManager.prototype.handleActiveSpellFlash = function (eventHandler){
	var activeSpellInfo = eventHandler.listen("spellActive");
	if(activeSpellInfo){
		var self = this;
		var spellInfo = activeSpellInfo.info;
		var elf = activeSpellInfo.elf;
		//animateSpellFlash();
		eventHandler.remove("spellActive");
	}
	function animateSpellFlash(spellInfo){
		var spellFlash = new Drawable();
		spellFlash.draw = function (context){
			context.fillStyle = "rgba("+elf.color+","+this.alpha+")";
			context.beginPath();
			context.arc(0,0,this.radius,0,Math.PI*2,true);
			context.closePath();
			context.fill();
		}
		spellFlash.x = elf.cell.x;
		spellFlash.y = elf.cell.y;
		spellFlash.alpha = 0.7;
		spellFlash.radius = 0;
		var maxRadius = 600;
		var radiusIncremental = maxRadius/5;
		eventHandler.registObjectAnimate(
			spellFlash,
			{radius:radiusIncremental,
			 alpha:-0.15,
			},
			5);
		eventHandler.registDelayFunc(function (){
			delete self.drawList.spellFlash;
			self = null;
		},5);
		self.drawList.spellFlash = spellFlash;
	}
}
ExtralDrawableManager.prototype.handleSpellMarks = function (eventHandler){
	var spellMark = eventHandler.listen("spellMark");
	if (spellMark){
		this.drawList.spellMark = spellMark;
		return;
	}
	delete this.drawList.spellMark;
}
ExtralDrawableManager.prototype.handleCircles = function (eventHandler){
	var magicCircle = eventHandler.listen("magicCircle");
	if(magicCircle){
		magicCircle.nextFrame();
		this.battleField.drawListBottom.magicCircle = magicCircle;
	}else{
		delete this.battleField.drawListBottom.magicCircle;
	}

	var rangeCircle = eventHandler.listen("rangeCircle");
	if(rangeCircle){
		rangeCircle.nextFrame()
		this.battleField.drawListBottom.rangeCircle = rangeCircle;
	}else{
		delete this.battleField.drawListBottom.rangeCircle;		
	}
}
ExtralDrawableManager.prototype.handleBullets = function (eventHandler){
	var time = eventHandler.listen("time");
	var bullets = this.drawList.bullet.drawList;
	var self = this;
	//idmaker
	//handle ended bullets
	var attackEvent = eventHandler.listen("attack"+time);
	if(!attackEvent){
		return;
	}
	if(attackEvent.line){
		for (var i = 0; i < attackEvent.line.length; i++){
			var event = attackEvent.line[i];
			bullets[this.idMaker] = getBullet("line",event);
			this.idMaker++;
		}
	}
	if(attackEvent.circle){
		for (var i = 0; i < attackEvent.circle.length; i++){
			var event = attackEvent.circle[i];
			bullets[this.idMaker] = getBullet("circle",event);
			this.idMaker++;
		}
	}
	if(attackEvent.field){
		for (var i = 0; i < attackEvent.field.length; i++){
			var event = attackEvent.field[i];
			bullets[this.idMaker] = getBullet("field",event);
			this.idMaker++;
		}
	}
	if(attackEvent.normal){
		for (var i = 0; i < attackEvent.normal.length; i++){
			var event = attackEvent.normal[i];
			bullets[this.idMaker] = getBullet("normal",event);
			this.idMaker++;
		}
	}


	function getBullet (type,info){
		var bullet = new Drawable();
		bullet.id = self.idMaker;
		self.idMaker ++;
		
		switch(type){
		case "line" :
			bullet.draw = ExtralDrawableManager.lineBulletDraw;
			bullet.x = info.x;
			bullet.y = info.y;
			bullet.rad = info.rad;
			bullet.lineWidth = info.lineWidth || 3;
			bullet.color = info.color;
			ExtralDrawableManager.lineBulletAnimate.call(bullet,bullets,eventHandler);
			break;
		case "circle" :
			bullet.draw = ExtralDrawableManager.circleBulletDraw;
			bullet.x = info.x;
			bullet.y = info.y;
			bullet.realRadius = info.radius;
			bullet.color = info.color;
			ExtralDrawableManager.circleBulletAnimate.call(bullet,bullets,eventHandler);
			break;
		case "field" :
			bullet.draw = ExtralDrawableManager.fieldBulletDraw;
			bullet.x = info.cell.x;
			bullet.y = info.cell.y;
			bullet.cell = info.cell;
			bullet.color = info.color;
			if (info.bulletImg){
				bullet.img = info.bulletImg
			}
			ExtralDrawableManager.fieldBulletAnimate.call(bullet,bullets,eventHandler);
			break;
		case "normal" :
			bullet.draw = ExtralDrawableManager.normalBulletDraw;
			bullet.x = info.targetX;
			bullet.y = info.targetY;
			bullet.lineWidth = info.lineWidth || 2;
			bullet.rad = info.rad;
			bullet.color = info.color;
			ExtralDrawableManager.normalBulletAnimate.call(bullet,bullets,eventHandler);
			break;
		}

		return bullet;
	}
}
ExtralDrawableManager.lineBulletAnimate = function (bullets,eventHandler){
	this.alpha = 0.3;
	if(!this.color)
		this.color = "200,20,200";

	var self = this;
	eventHandler.registObjectAnimate(
		self,
		{alpha:0.3},
		4);
	eventHandler.registDelayFunc(function (){
		eventHandler.registObjectAnimate(
			self,
			{alpha:-0.3}
			,3);
	},4);
	eventHandler.registDelayFunc(function (){
		delete bullets[self.id];
		self = null;
	},7);
}
ExtralDrawableManager.lineBulletDraw = function (context){
	//console.log("line",this.alpha);
	//context.strokeStyle = "rgba(200,20,200,"+(this.alpha - 0.2) +")";
	context.strokeStyle = "rgba("+ this.color + "," + this.alpha + ")";

	context.beginPath();
	context.arc(0,-30,3,0,Math.PI*2,true);
	context.lineWidth = this.lineWidth + 3;
	context.moveTo(0,-35);
	context.lineTo(0,-1500);
	context.stroke();

	context.fillStyle = "rgba(230,230,230,"+(this.alpha+0.15)+")";
	context.beginPath();
	context.arc(0,-30,3,0,Math.PI*2,true);
	context.fill();

	
	context.strokeStyle = "rgba(230,210,230,"+this.alpha+")";
	context.lineWidth = this.lineWidth;
	context.beginPath();
	context.moveTo(0,-30);
	context.lineTo(0,-1500);
	context.stroke();
}
ExtralDrawableManager.circleBulletAnimate = function (bullets,eventHandler){
	if(!this.color)
		this.color = "255,130,0";
	var self = this;
	this.alpha = 0.7;
	this.radius = 0;
	var maxRadius = Math.round(this.realRadius * 1.2);
	var radiusIncremental = maxRadius/5;
	eventHandler.registObjectAnimate(
		self,
		{radius:radiusIncremental,
		 alpha:-0.15,
		},
		6);
	eventHandler.registDelayFunc(function (){
		delete bullets[self.id];
		self = null
	},5);
}
ExtralDrawableManager.circleBulletDraw = function (context){
	if(this.radius<0)
		return;
	//console.log("circle",this.alpha,this.radius);
	//context.fillStyle = "rgba(255,130,0,"+this.alpha+")";
	context.fillStyle = "rgba("+ this.color + "," + this.alpha + ")";
	context.beginPath();
	context.arc(0,0,this.radius,0,Math.PI*2,true);
	context.closePath();
	context.fill();
}
ExtralDrawableManager.normalBulletAnimate = function (bullets,eventHandler){
	this.alpha = 0.45;
	if(!this.color)
		this.color = "142,212,245";
	this.lineLength = 18;
	this.startX = -70;
	var self = this;
	eventHandler.registObjectAnimate(
		self,
		{alpha:0.25,lineLength:18,startX:25,lineWidth:1.5},
		2);
	eventHandler.registDelayFunc(function (){
		eventHandler.registObjectAnimate(
			self,
			{alpha:-0.15,lineLength:-12,startX:40,lineWidth:-1.5},
			2);
	},2);
	eventHandler.registDelayFunc(function (){
		delete bullets[self.id];
		self = null;
	},4);
}
ExtralDrawableManager.normalBulletDraw = function (context){
	//context.strokeStyle = "rgba(142,212,245," + this.alpha + ")";
	context.strokeStyle = "rgba("+ this.color + "," + this.alpha + ")";
	context.lineWidth = this.lineWidth;
	context.beginPath();
	context.moveTo(this.startX,0-5);
	context.lineTo(this.startX+this.lineLength+5,0);
	
	context.moveTo(this.startX-10,0);
	context.lineTo(this.startX+this.lineLength,0);
	
	context.moveTo(this.startX+10,0);
	context.lineTo(this.startX+this.lineLength,0);

	context.stroke();
}
ExtralDrawableManager.fieldBulletAnimate = function (bullets,eventHandler,bulletImg){
	animateTick1 = 6;
	animateTick2 = 6;
	if (!this.img){
		this.img = img.spellTowerBullet;		
	}
	this.imgRadius = Math.round(this.cell.width * 0.3);
	this.ctxAlpha = 0;
	this.color = "160,200,165";
	this.radius = 10;
	this.alpha = 0.1;
	var self = this;
	eventHandler.registObjectAnimate(
		self,{
			alpha:0.2,
			ctxAlpha:0.25,
			radius:1.5
		},animateTick1);
	eventHandler.registDelayFunc(function (){
		eventHandler.registObjectAnimate(
			self,{
				alpha:-0.2,
				ctxAlpha:-0.25,
				radius:-1.5,
			},animateTick2);
	},animateTick1)

	eventHandler.registDelayFunc(function (){
		delete bullets[self.id];
		self = null;
		eventHandler = null;
	},animateTick1 + animateTick2);
}
ExtralDrawableManager.fieldBulletDraw = function (context){
	if(this.radius < 0 || this.ctxAlpha < 0)
		return;
	
	context.lineWidth = 3;
	context.strokeStyle = "rgba("+ this.color + "," + this.alpha + ")";
	context.beginPath();
	context.arc(0,0,this.radius,0,Math.PI*2,true);
	context.closePath();
	context.stroke();
	
	context.drawImage(this.img,-this.imgRadius,-this.imgRadius,this.imgRadius*2,this.imgRadius*2);

}


