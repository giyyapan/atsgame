var Demon = Sprite.sub();
Demon.prototype._init = function (game,name,freshData,screenSize,eventHandler){
	if(!name){
		return false;
	}
	var demonData = game.db.demon.getDataByName(name);
	Demon.parent.call(this,demonData);
	this.price = freshData.info.price||demonData.price||35;
	if(demonData.boss){
		this.boss = true;
	}
	if(freshData.info.finalDemon){
		this.finalDemon = true;
		console.log("im final!");
	}

	this.rad = 3.14;
	this.x = 0;
	this.y = 0;
	this.k = 0;

	this.width = Math.round(
		demonData.picWidth/screenSize.defautCellWidth*screenSize.cellWidth);
	this.height = Math.round(
		demonData.picHeith/screenSize.defautCellWidth*screenSize.cellWidth);

	this.realWidth = Math.round(
		demonData.width/screenSize.defautCellWidth*screenSize.cellWidth);
	this.realHeight = Math.round(
		demonData.height/screenSize.defautCellWidth*screenSize.cellWidth);
	
	this.slow = freshData.info.slow || demonData.slow;
	this.damage = freshData.info.damage || demonData.damage || 1;
	if(freshData.info.scale){
		this.scalex = freshData.info.scale;
		this.scaley = freshData.info.scale;
	}
	if (freshData.info.text){
		this.textBox = new Drawable();
		this.textBox.x = -32;
		this.textBox.y = 50;
		this.textBox.width = 150;
		this.textBox.height = Math.round(this.textBox.width/120*51);
		this.textBox.img = img.demonTextBox;
		this.textBox.rad = -Math.PI;
		this.textBox.text = freshData.info.text;
		this.textBox.hide = false;
		if(freshData.info.finalText){
			this.textBox.finalText = freshData.info.finalText;
		}
		this.textBox.draw = function (context){
			context.drawImage (this.img,0,0,this.width,this.height);
			context.font = "normal 18px MyFont"
			context.fillText(this.text,Math.round(this.width*0.1),Math.round(this.height*0.6));
		}
		this.drawList.textBox = this.textBox;
		if(!freshData.info.textDuration){
			var duration = 60;
		}else{
			var duration = freshData.info.textDuration;
		}
		var self = this;
		eventHandler.registDelayFunc(function (){
			if(!self || self.destroyed){
				self = null;
				return;
			}
			self.textBox.hide = true;
			self = null;
		},duration)
	}
	this.stepTicker = Math.round(this.slow/2);
	this.changeDirTick = Math.round(this.slow/2)
	this.direction = false;
	
	this.life = freshData.demonData.life;
	
	this.nowLife = this.life;
	
	this.lifeBar = new DemonLifeBar(this);
	this.drawList.lifeBar = this.lifeBar;

	this.id = freshData.id;
	this.buffs = new Array();

	//console.log("new demon id:",this.id);
}
Demon.prototype.findTargetCell = function (){
	////TODO////there is a bug about this
	var oldDirection = this.direction;
	var targetStepNum = this.cell.stepNum - 1;
	for (var i = 1; i <= 6; i++){
		var P = "p"+i;
		if(this.cell[P] && this.cell[P].stepNum == targetStepNum){
			this.faceTo(P);
			this.targetCell = this.cell[P];
			this.direction = P;
			if(this.direction == oldDirection){
				return false;
			}else{
				return true;
			}
		}
	}
}
Demon.prototype.faceTo = function (direction){
	switch(direction){
	case "p1" :
		this.rad = Math.PI;
		break;
	case "p2" :
		this.rad = Math.PI/3*4;
		break;
	case "p3" :
		this.rad = Math.PI/3*2;
		break;
	case "p4" :
		this.rad = Math.PI/3*5;
		break;
	case "p5" :
		this.rad = Math.PI/3;
		break;
	case "p6" :
		this.rad = 0;
		break;
	}
}
Demon.prototype.tick = function (eventHandler){
	//console.log(this.id);
	this.nextFrame(eventHandler);
	//delete this.drawList.hurtedMark;
	this.handleAttackEvent(eventHandler);
	if(this.destroyed)
		return;
	this.move(eventHandler);
}
Demon.prototype.move = function (eventHandler){
	if(this.stepTicker == this.changeDirTick){
		var pathChanged = this.findTargetCell(eventHandler);
		this.changeDirTick = Math.round(this.slow/2);
	}
	if(pathChanged){
		this.stepRangeX = (this.targetCell.x - this.cell.x)/this.slow;
		this.stepRangeY = (this.targetCell.y - this.cell.y)/this.slow;
	}
	//console.log(this.stepRangeX,this.stepRangeY,this.x,this.y);
	if(this.stepTicker < this.slow){
		this.x += this.stepRangeX;
		this.y += this.stepRangeY

		this.stepTicker ++;
		return false;
	}

	this.changeCell(eventHandler);
	return true;
}
Demon.prototype.damaged = function (damage,eventHandler){
	//this.drawList.hurtedMark = new Drawable();
	//this.drawList.hurtedMark.draw = function (context){
	//context.fillStyle = "rgba(200,10,10,0.6)";
	//	context.fillRect(-10,-10,20,20);
	//}
	this.nowLife -= damage;
	if(this.nowLife <= 0){
		this.nowLife = 0;
		this.destroy(false,eventHandler);
	}
}
Demon.prototype.handleAttackEvent = function (eventHandler){
	//field based attack events are handled by cell instead of demon
	//field based attack events include  Circle Attack 
	var nowTime = eventHandler.listen("time");
	var attackEvent = eventHandler.listen("attack"+nowTime);
	if(!attackEvent)
		return;
	if(attackEvent.line){
		var targetPoint = {
			x:this.x + this.cell.x,
			y:this.y + this.cell.y
		}
		for (var i = 0; i < attackEvent.line.length; i++){
			var event = attackEvent.line[i];
			var centerPoint = {x:event.x,
							   y:event.y,
							  }
			var relativeTargetPoint =
				Math.rotatePointByRad(centerPoint,targetPoint,event.rad);

			if(relativeTargetPoint.y <= centerPoint.y){
				if(Math.abs(relativeTargetPoint.x - event.x) <= this.realWidth + event.width){
					this.damaged(event.damage,eventHandler);
				}
			}
		}
	}
	if (attackEvent.normal){
		for (var i = 0; i < attackEvent.normal.length; i++){
			var event = attackEvent.normal[i];
			if(event.targetId == this.id)
				this.damaged(event.damage,eventHandler);
		}
	}
}

Demon.prototype.changeCell = function (eventHandler){
	if(!this.targetCell){
		console.error(this);
		this.findTargetCell();
		return;
	}
	if(!this.targetCell.empty && !this.targetCell.summoner && !this.targetCell.demonGate){
		delete this.targetCell;
		this.stepTicker = 0;
		this.stepRangeX *= -8;
		this.stepRangeY *= -8;
		this.changeDirTick = Math.round(this.changeDirTick/8);
		this.rad -= Math.PI;
		return false;
	}
	
	if(this.targetCell.summoner){
		this.destroy(true,eventHandler)
		return true;
	}
	this.x = (this.cell.x - this.targetCell.x)/2;
	this.y = (this.cell.y - this.targetCell.y)/2;
	
	//this.targetCell.addHoverMark(true);
	this.targetCell.enterDemon(this);

	//this.cell.removeHoverMark();
	this.cell.removeDemon(this);
	
	this.cell = this.targetCell;
	delete this.targetCell;
	this.stepTicker = 0;
	return true;}

Demon.prototype.destroy = function (hurted,eventHandler){
	if(this.destroyed) return;
	if(hurted){
		this.targetCell.summoner.hurted(this.damage,eventHandler);
		//demon gives money while hurted
		if(this.boss){
			this.price = 80;
		}
		//self.price = 0;
	}
	this.destroyed = true;
	this.ctxAlpha = 1;
	this.tick = function (){}
	var self = this;
	if(this.finalDemon && !hurted){
		audio.play('bossDead');
		//show final demon destroy animation
		this.showFinalDemonDestroyAnimation(eventHandler);
		eventHandler.registDelayFunc(function (){
			destroyedFunc(hurted);
		},50);
	}else{
		audio.play('demonDead');
		//show normal demon destory animation
		this.showIncomeAnimation(eventHandler);
		eventHandler.registObjectAnimate(self,
										 {ctxAlpha:-0.15},
										 6);
		eventHandler.registDelayFunc(function (){
			destroyedFunc(hurted);
		},6);
	}
	function destroyedFunc(hurted){
		//console.log("a demon destroyed","hurted?",hurted)
		self.cell.removeDemon(self)
		var destroyedDemons = eventHandler.listen("demonDestroyed");
		if(!destroyedDemons){
			eventHandler.regist("demonDestroyed",{num:1,income:self.price});
		}else{
			destroyedDemons.income += self.price;
			destroyedDemons.num ++;
		}
		//console.log(eventHandler.listen("demonDestroyed").num,eventHandler.listen("time"));
		self = null;
		eventHandler = null;
	}
}
Demon.prototype.showFinalDemonDestroyAnimation = function (eventHandler){
	console.log("FinalD.Animation");
	this.finalDestroyMark = new Drawable();
	this.finalDestroyMark.x = this.finalDestroyMark.y
		= this.finalDestroyMark.rad
		= this.finalDestroyMark.k
		= 0,
	this.finalDestroyMark.radius = 800;
	this.finalDestroyMark.ctxAlpha = 0;
	this.finalDestroyMark.img = img.finalDestroyMark;
	this.finalDestroyMark.demon = this;
	this.finalDestroyMark.draw = function (context){
		this.rad+=0.2;
		context.drawImage(this.img,-this.radius,-this.radius,this.radius*2,this.radius*2);
	}
	this.drawListBottom.finalDestroyMark = this.finalDestroyMark;
	
	if(this.textBox){
		if(this.textBox.finalText){
			this.textBox.text = this.textBox.finalText;
		}
		this.textBox.hide = false;
	}

	var tickNum1 = 10;
	var tickNum2 = 35;
	var tickNum3 = 5;
	var self = this;

	eventHandler.objectAnimateTo(self.finalDestroyMark,{
		ctxAlpha:0.35,
		radius:self.cell.width*0.3,
	},tickNum1);
	
	eventHandler.registDelayFunc(function (){
		eventHandler.registObjectAnimate(self,{
			k:3,
		},8)
		eventHandler.objectAnimateTo(self.finalDestroyMark,{
			ctxAlpha:0.7,
			radius:self.cell.width*0.4,
		},tickNum2-10);
	},tickNum1);
	
	eventHandler.registDelayFunc(function (){
		eventHandler.objectAnimateTo(self.finalDestroyMark,{
			ctxAlpha:0,
			radius:800,
		},tickNum3);
		eventHandler.objectAnimateTo(self,{
			ctxAlpha:0,
			width:self.width*3,
			height:self.height*3,
		},tickNum3)
		self.showIncomeAnimation(eventHandler);
	},tickNum1+tickNum2);
	
	eventHandler.registDelayFunc(function (){
		delete self.finalDestroyMark;
		self = null;
		eventHandler = null;
	},tickNum1+tickNum2+tickNum3)
}
Demon.prototype.showIncomeAnimation = function (eventHandler){
	var animateTick = 5;
	var waitTick = 5;
	var startY = this.cell.y + this.y + 10 ;
	var incomeMark = new Drawable();
	incomeMark.width = 18;
	incomeMark.height = 18;
	incomeMark.price = this.price;
	incomeMark.x = this.x +this.cell.x- 70;
	incomeMark.y = startY;

	if (this.price > 40){
		if(this.price > 80){
			incomeMark.scalex = incomeMark.scaley = 1.9;
		}else{
			incomeMark.scalex = incomeMark.scaley = 1.6;
		}
	}else{
		incomeMark.scalex = incomeMark.scaley = 1.4;		
	}
	incomeMark.ctxAlpha = 0;
	incomeMark.img = img.incomeMark;
	//incomeMark.rad = -Math.PI;
	incomeMark.draw = function (context){
		context.drawImage(this.img,0,0,this.width,this.height);
		context.font = "bold 19px MyFont";
		context.fillStyle = "rgba(10,10,10,0.7)";
		context.fillText("+"+this.price,this.width+2,Math.round(this.width*0.8)+1)
		context.fillStyle = "#fff59b"
		context.fillText("+"+this.price,this.width+1,Math.round(this.width*0.8))
	}
	var obj = {
		drawable:incomeMark,
		ticks:animateTick*2 + waitTick,
	}
	var extralDrawables = eventHandler.listen("addExtralDrawables");
	if(extralDrawables){
		extralDrawables.push(obj);
	}else{
		eventHandler.regist("addExtralDrawables",[obj]);
	}
	eventHandler.registObjectAnimate(incomeMark,{
		ctxAlpha:0.2,
		y:-10,
	},animateTick);
	
	eventHandler.registDelayFunc(function (){
		eventHandler.registObjectAnimate(incomeMark,{
			ctxAlpha:-0.2,
		},animateTick-1)
	},animateTick + waitTick);
	
	eventHandler.registDelayFunc(function (){
		incomeMark = null;
		eventHandler = null;
	},animateTick*2 + waitTick);
}
Demon.prototype.draw = function (context,eventHandler){
	if(this.k){
		this.x = Math.sin(this.k) * 5;
	}
	Demon.parent.prototype.draw.call(this,context,eventHandler);
	//context.fillStyle = "rgba(20,20,20,0.3)";
	//context.fillRect(-this.realWidth/2,-this.realHeight/2,this.realWidth,this.realHeight);
}
 
var DemonLifeBar = Drawable.sub();
DemonLifeBar.prototype._init = function (demon){
	this.x = -demon.realWidth/2 - 10;
	this.y = -demon.realHeight/2 - 10;
	this.width = demon.realWidth + 20;
	this.demon = demon;
}
DemonLifeBar.prototype.draw = function (context){
	var lifePercent = this.demon.nowLife / this.demon.life;
	if (lifePercent >= 0.6){
		context.fillStyle = "green";		
	}else{
		if (lifePercent >= 0.3){
			context.fillStyle = "orange";
		}else{
			context.fillStyle = "red";
		}
	}
	context.fillRect(0,0,this.width * lifePercent,3);
}
