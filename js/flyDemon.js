var FlyDemon = Demon.sub();
FlyDemon.prototype._init = function (game,name,freshData,screenSize,gate,eventHandler){
	//console.log(name);
	FlyDemon.parent.call(this,game,name,freshData,screenSize,eventHandler);
	//console.log(this)
	this.cell = {x:0,y:0,type:"fakeCell"};
	this.fly = true;
	this.x = gate.cell.x;
	this.y = gate.cell.y;
	this.field = gate.cell.field;
	this.summonerHurtDistacnce = 10;
	var lineSpeed = screenSize.cellWidth/this.slow;
	var distance = Math.getDistance(this.field.summonerCell,this);
	this.speedx =lineSpeed / distance * (this.field.summonerCell.x - this.x);
	this.speedy =lineSpeed / distance * (this.field.summonerCell.y - this.y);
	if (this.speedy == 0){
		if (this.speedx > 0){
			this.rad = Math.PI/2;
		}else{
			this.rad = -Math.PI/2;
		}
	}else{
	    this.rad = -this.speedx/this.speedy-Math.PI;
	}
}
FlyDemon.prototype.move = function (eventHandler){
	this.x += this.speedx;
	this.y += this.speedy;
	if(Math.getDistance(this,this.field.summonerCell) <= this.summonerHurtDistacnce){
		this.targetCell = this.field.summonerCell;
		this.destroy(true,eventHandler)
	}
}
FlyDemon.prototype.handleAttackEvent = function (eventHandler){
	//flyDemons handle field based attack events while normal demons don't
	//field based attack events include  Circle Attack
	var nowTime = eventHandler.listen("time");
	var attackEvent = eventHandler.listen("attack"+nowTime);
	if(!attackEvent)
		return;
	if(attackEvent.line){
		var targetPoint = {
			x:this.x,
			y:this.y
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
	if(attackEvent.circle){
		for (var i = 0; i < attackEvent.circle.length; i++){
			var event = attackEvent.circle[i];
			for (var j = 0; j < event.cells.length; j++){
				var targetCell = event.cells[j];
				if(Math.getDistance(this,targetCell) <= (targetCell.width + this.realWidth)*0.8){
					this.damaged(event.damage,eventHandler);
					break;
				}
			}
		}
	}
	if(attackEvent.field){
		for (var i = 0; i < attackEvent.field.length; i++){
			var event = attackEvent.field[i];
			if(Math.getDistance(this,event.cell)<= (event.cell.width + this.realWidth)*0.8){
				this.damaged(event.damage,eventHandler);
			}
		}
	}
}
FlyDemon.prototype.destroy = function (hurted,eventHandler){
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
		//show final demon destroy animation
		this.showFinalDemonDestroyAnimation(eventHandler);
		eventHandler.registDelayFunc(function (){
			destroyedFunc(hurted);
		},50);
	}else{
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
		self.field.removeFlyDemon(self);
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
