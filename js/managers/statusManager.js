var StatusManager = Class.sub();
StatusManager.prototype._init = function (eventHandler,stage){
	var statusData = eventHandler.listen("initStatusData");
	this.box = statusData.box;
	eventHandler.remove("initStatusData");
	
	var headerBar = eventHandler.listen("initHeaderBar");
	this.headerBar = headerBar;
	eventHandler.remove("initHeaderBar");
	
	this.ticker = 0;
	eventHandler.regist("asset",this.box);
}
StatusManager.prototype.tick = function (eventHandler){
	var cost = eventHandler.listen("cost");
	var hurted = eventHandler.listen("hurted");
	var demonDestroyed = eventHandler.listen("demonDestroyed");

	this.handleScoreEvents(eventHandler,cost,hurted,demonDestroyed);
	this.handleCostEvents(eventHandler,cost);
	
	this.handleHurtedEvents(eventHandler,hurted);
	this.handleIncomeEvents(eventHandler,demonDestroyed);

	if(hurted){
		eventHandler.regist("uiFresh");
		eventHandler.remove("hurted");			
	}
	if(cost){
		eventHandler.regist("uiFresh");
		eventHandler.remove("cost");
	}
	if(demonDestroyed){
		eventHandler.regist("uiFresh");
	}
}
StatusManager.prototype.handleScoreEvents = function (eventHandler,cost,hurted,demonDestroyed){
	if(cost){
		this.headerBar.score -= Math.round(cost.mena * 0.2);
	}
	if(hurted){
		this.headerBar.score -= hurted.num * 150;
	}
	if(demonDestroyed){
		//score : basic score(100) + demon price score
		var hurtedNum = hurted?hurted.num:0;
		this.headerBar.score += ((demonDestroyed.num - hurtedNum) * 100
								 + demonDestroyed.income);
	}
	if(this.headerBar.score  < 0){
		this.headerBar.score = 0;
	}
}
StatusManager.prototype.handleIncomeEvents= function (eventHandler,demonDestroyed){
	if(demonDestroyed){
		this.box.mena += demonDestroyed.income;
	}
}
StatusManager.prototype.handleHurtedEvents = function (eventHandler,hurted){
	if(hurted){
		this.box.life -= hurted.num;
		if(this.box.life <= 0){
			eventHandler.regist("endStage",{cleared:false});
		}
	}
}
StatusManager.prototype.handleCostEvents = function (eventHandler,cost){
	if(!cost) return;
	this.box.mena -= cost.mena
}

