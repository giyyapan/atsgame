var WaveManager = Class.sub();
WaveManager.prototype._init = function (stageInfo,screenSize,eventHandler){
	this.screenSize = screenSize;
	this.waveIndex = 0;
	this.waveData = stageInfo.waveData;
	this.demonIndex = 0;
	//this.waveDelay = 10;
	this.waveDelay = 50;
	this.waveTicker = this.waveDelay-15;
	this.freshDelay = 40;
	this.freshTicker = 0;
	this.freshedDemon = 0;
	this.destroyedNum = 0
	this.idTimer = 0;
	eventHandler.regist("waveClear");
	if(stageInfo.challenge){
		this.tick = WaveManager.challengeTick;
		this.demonGrow = stageInfo.demonGrow;
		this.nowGrow = 1;
		this.level = 1;
	    eventHandler.regist("waveNum",{now:0,level:this.level,waveNum:this.waveData.length});
	}else{
		this.tick = WaveManager.normalTick;
		eventHandler.regist("waveNum",{now:0,all:this.waveData.length});
	}
}
WaveManager.prototype.showHintMark = function (type,eventHandler){
	var pic;
	switch(type){
	case "clear" :
		audio.play('waveClear');
		pic = img.clearMark;
		break;
	case "nextWave" :
		audio.play('nextWave');
		pic = img.nextWaveMark;
		break;
	case "nextLevel" :
		audio.play('nextWave');
		pic = img.nextLevelMark;
		break;
	case "start" :
		audio.play('nextWave');
		pic = img.startMark;
		break;
	}
	var startX = -100;
	var animateTick = 5;

	var hintMark = new Drawable();
	hintMark.width = 336;
	hintMark.height = 55;
	hintMark.x = startX;
	hintMark.y =  (this.screenSize.height - hintMark.height)/2 - 150;
	hintMark.ctxAlpha = 0;
	hintMark.img = pic;
	hintMark.draw = function (context){
		context.drawImage(this.img,0,0,this.width,this.height);
	}
	
	var centerX = (this.screenSize.width - hintMark.width)/2 + 40;

	var obj = {
		drawable:hintMark,
		ticks:animateTick*2 + 5,
	}
	var extralDrawables = eventHandler.listen("addExtralDrawables");
	if(extralDrawables){
		extralDrawables.push(obj);
	}else{
		eventHandler.regist("addExtralDrawables",[obj]);
	}
	eventHandler.registObjectAnimate(hintMark,{
		ctxAlpha:0.2,
		x:(centerX-startX)/animateTick,
	},animateTick);
	
	eventHandler.registDelayFunc(function (){
		eventHandler.registObjectAnimate(hintMark,{
			ctxAlpha:-0.2,
			x:(centerX-startX + 100)/animateTick,
		},animateTick)
	},animateTick + 5);
	
	eventHandler.registDelayFunc(function (){
		hintMark = null;
	},animateTick*2 + 5);
}
WaveManager.challengeTick = function (eventHandler){
	var destroyedDemons = eventHandler.listen("demonDestroyed")
	if(destroyedDemons){
		this.destroyedNum += destroyedDemons.num;
		//console.log("demondestoryed",this.destroyedNum,"sum:",this.sum);
		eventHandler.remove("demonDestroyed");
	}
	if(eventHandler.listen("pause")){
		return;
	}
	if(this.destroyedNum >= this.sum){
		console.log("waveClear");
		eventHandler.regist("waveClear");
		//this.destroyedNum -= this.sum;
		this.destroyedNum = 0;
		this.showHintMark("clear",eventHandler);
	}
	if(eventHandler.listen("waveClear")){
		if(this.waveTicker < this.waveDelay -1){
			this.waveTicker ++;
			return ;
		}
		this.nowWave = this.waveData[this.waveIndex];
		if(!this.nowWave){
			this.showHintMark("nextLevel",eventHandler);
			//eventHandler.regist("endStage",{cleared:true});
			//console.log("Stage Clear");
			this.nowGrow *= this.demonGrow;
			console.log("Stage Level Up");
			this.freshedDemon = 0;
			this.destroyedNum = 0;
			this.waveIndex = 0;
			this.demonIndex = 0;
			this.level ++;
			eventHandler.listen("waveNum").now = 0;
			eventHandler.listen("waveNum").level = this.level;
			this.nowWave = this.waveData[this.waveIndex];
		}else{
			if(this.waveIndex == 0){
				this.showHintMark("start",eventHandler);
			}else{
				this.showHintMark("nextWave",eventHandler);				
			}
		}
		eventHandler.listen("waveNum").now ++;
		eventHandler.remove("waveClear");
		eventHandler.regist("uiFresh");
		this.idTimer = 0;
		this.waveTicker = 0;		
		this.sum = 0;
		for (var i = 0; i < this.nowWave.length; i++){
				this.sum += this.nowWave[i].num;
		}
	}
	if(this.nowWave){
		if(this.freshedDemon == this.nowWave[this.demonIndex].num){
			this.demonIndex ++;
			this.freshedDemon = 0;

			if(this.demonIndex == this.nowWave.length ){
				delete this.nowWave;
				this.waveIndex ++;
				this.demonIndex = 0;
				return ;
			}
		}
		if (this.freshTicker < this.freshDelay-1){
			this.freshTicker ++;
			return ;
		}
		this.freshTicker = 0;
		var demonData = this.nowWave[this.demonIndex];
		//this demonData is from wave data
		if(!demonData.gate){
			demonData.gate = 1;
		}
		var demonInfo = demonData.info||{};
		var demonRealLife = demonData.life * this.nowGrow;
		var realDemonData = {
			name:demonData.name,
			gate:demonData.gate,
			life:demonRealLife,
			info:demonInfo,
			num:demonData.num,
		}
		eventHandler.regist("freshDemon",{demonData:realDemonData,id:this.idTimer,info:demonInfo});
		//console.log("regist freshdemon id:",this.idTimer);
		this.idTimer ++;
		this.freshedDemon ++;
	}	
}
WaveManager.normalTick = function (eventHandler){
	var destroyedDemons = eventHandler.listen("demonDestroyed")
	if(destroyedDemons){
		this.destroyedNum += destroyedDemons.num;
		//console.log(this.destroyedNum);
		eventHandler.remove("demonDestroyed");
	}
	if(eventHandler.listen("pause")){
		return;
	}
	if(this.destroyedNum >= this.sum){
		console.log("waveClear");
		eventHandler.regist("waveClear");
		//this.destroyedNum -= this.sum;
		this.destroyedNum = 0;
		this.showHintMark("clear",eventHandler);
	}
	if(eventHandler.listen("waveClear")){
		if(this.waveTicker < this.waveDelay -1){
			this.waveTicker ++;
			return ;
		}
		this.nowWave = this.waveData[this.waveIndex];
		if(!this.nowWave){
			eventHandler.regist("endStage",{cleared:true});
			console.log("Stage Clear");
			return;
		}
		if(this.waveIndex == 0){
			this.showHintMark("start",eventHandler);
		}else{
			this.showHintMark("nextWave",eventHandler);			
		}
		eventHandler.listen("waveNum").now ++;
		eventHandler.remove("waveClear");
		eventHandler.regist("uiFresh")
		this.idTimer = 0;
		this.waveTicker = 0;		
		this.sum = 0;
		for (var i = 0; i < this.nowWave.length; i++){
				this.sum += this.nowWave[i].num;
		}
	}
	if(this.nowWave){
		if(this.freshedDemon == this.nowWave[this.demonIndex].num){
			this.demonIndex ++;
			this.freshedDemon = 0;

			if(this.demonIndex == this.nowWave.length ){
				delete this.nowWave;
				this.waveIndex ++;
				this.demonIndex = 0;
				return ;
			}
		}
		if (this.freshTicker < this.freshDelay-1){
			this.freshTicker ++;
			return ;
		}
		this.freshTicker = 0;
		var demonData = this.nowWave[this.demonIndex];
		if(!demonData.gate){
			demonData.gate = 1;
		}
		var demonInfo = demonData.info||{};
		eventHandler.regist("freshDemon",{demonData:demonData,id:this.idTimer,info:demonInfo});
		//console.log("regist freshdemon id:",this.idTimer);
		this.idTimer ++;
		this.freshedDemon ++;
	}
}
