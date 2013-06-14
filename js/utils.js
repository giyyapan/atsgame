var Class = function (){};
Class.extend = function (){
	for (var i = 0; i < arguments.length; i++){
		var toExtend = arguments[i];
		for(var item in toExtend.prototype){
			if(item == "_init")continue;
			this.prototype[item] = toExtend.prototype[item];
		}
	}
	return this;
}
Class.sub = function (){
	var parent = this;
	var c = function (){
		parent.call(this);
		if(c.prototype._init){
			c.prototype._init.apply(this,arguments);
		}
	}
	c.parent = this;
	for(var item in c.parent.prototype ){
		if(typeof c.parent.prototype[item] == "function")
			c.prototype[item] = c.parent.prototype[item];
	}
	//c.prototype = new c.parent();
	//c.prototype.parent = c.parent;
	c.prototype._class = c;
	c.sub = Class.sub;
	c.extend = Class.extend;
	return c;
}

var EventHandler = Class.sub();
EventHandler.prototype._init = function (startTick){
	this.events = new Object();
	this.delayFuncs = new Object();
	this.animateObjects = new Object();
	this.delayRemoveObjects = new Object();
	this.ticker = startTick || 1;
	this.idMaker = 1;
}
EventHandler.prototype.tick = function (stageTicker){
	var pause = this.listen("pause");
	this.ticker = stageTicker;
 	this.removeEndedEvents();
	this.handleDelayFuncs();
	if(!pause){
		//Object Animation is NOT tick based,
		//so this method need to be disabled when game Paused
		this.handleObjectAnimate();
	}
}
EventHandler.prototype.resetTicker = function (reviseTickNum){
	//delayFuncs
	//reviseTickNum += 1;
	for(var i in this.delayFuncs){
		if (this.delayFuncs[i].activeTick == reviseTickNum){
			this.delayFuncs[i].activeTick = 1;
		}else{
			this.delayFuncs[i].activeTick -= reviseTickNum;
		}
		console.log("delay ActiveTick",this.delayFuncs[i].activeTick,this.delayFuncs[i]);
	}
	//objectAnimate
	for(var name in this.animateObjects){
		if (this.animateObjects[name].startTick == raeviseTickNum){
			this.animateObjects[name].startTick = 1;
		}else{
			this.animateObjects[name].startTick -= reviseTickNum;
			console.log("animateEndTick",this.animateObjects[name].startTick + this.animateObjects[name].tickNum,this.animateObjects[name])
		}
	}
}
EventHandler.prototype.countEvents = function (){
	var timer = 0;
	for(var event in this.events){
		timer ++;
	}
	return timer;
}
EventHandler.prototype.handleDelayFuncs = function (){
	var n = 0;
	for (var i in this.delayFuncs){
		n ++;
		if(this.delayFuncs[i].activeTick <= this.ticker - 1){
			this.delayFuncs[i].func();
			delete this.delayFuncs[i];
			//console.log(this.delayFuncs);
		}
	}
	//console.log("count delay event",n);
}
EventHandler.prototype.listen = function (target){
	return this.events[target];
}
EventHandler.prototype.regist = function (name,object){
	if(!object) object = true;
	this.events[name] = object;
	
}
EventHandler.prototype.remove = function (target){
	if(this.events[target]){
		delete this.events[target];
		return true;
	}
	return false;
}
EventHandler.prototype.removeEndedEvents = function (){
	var removed = false
	for(var i in this.events){
		if(!this.events[i].endTime)
			continue;
		if(this.events[i].endTime <= this.ticker){
			delete this.events[i];
			removed = true;
		}
	}
	//for (var name in this.delayRemoveObjects){
	//if(this.remove(this.delayRemoveObjects[name]))
	//		removed = true;
	//}
	//this.delayRemoveObjects = new Object();;
	return removed;
}
EventHandler.prototype.delayRemove = function (target){
	var self = this;
	this.registDelayFunc(function (){
		self.remove(target);
	},0);
	//this.delayRemoveObjects[this.idMaker] = target;
	//this.idMaker++;
}
EventHandler.prototype.registDelayFunc = function (func,delayTick){
	if(typeof func != "function" || typeof delayTick == "undefined"){
		console.error("no enough arguments!!",func);
		return;
	}
	this.delayFuncs[this.idMaker] = {func:func,activeTick:this.ticker+delayTick};
	this.idMaker++;
}
EventHandler.prototype.registObjectAnimate = function (target,animationInfo,tickNum){
	this.animateObjects[this.idMaker] = {
		target:target,
		animationInfo:animationInfo,
		startTick:this.ticker,
		tickNum:tickNum - 1,
	}
	this.idMaker++;
}
EventHandler.prototype.objectAnimateTo = function (target,animationInfo,tickNum){
	var newAnimationInfo = {};
	for(var name in animationInfo){
		if(typeof target[name] != "undefined"){
			var derta = (animationInfo[name] - target[name])/tickNum
			newAnimationInfo[name] = derta;
		}
	}
	console.log(newAnimationInfo);
	this.registObjectAnimate(target,newAnimationInfo,tickNum);
}
EventHandler.prototype.handleObjectAnimate = function (){
	for(var name in this.animateObjects){
		var nowObj = this.animateObjects[name];
		var target = nowObj.target;
		for(var item in nowObj.animationInfo){
			if(typeof target[item] != "undefined"){
				if(typeof nowObj.animationInfo[item] == "function"){
					target[item]+= nowObj.animationInfo[item]();
				}else{
					target[item]+= nowObj.animationInfo[item];
				}
			}
		}
		if(nowObj.startTick + nowObj.tickNum <= this.ticker){
			this.animateObjects[name].target = null;
			this.animateObjects[name].animationInfo = null;
			delete this.animateObjects[name];
		}
	}
}

Math.getDistance = function(A,B){
	if(!A.x || !B.x) return false;
	return Math.sqrt((A.x - B.x)*(A.x - B.x) + (A.y - B.y)*(A.y - B.y));
}
Math.getMaxFromArray = function (arr){
	if(arr instanceof Array){
		var max = arr[0];
		for (var i = 1; i < arr.length; i++){
			if(arr[i]>max)
				max = arr[i];
		}
		return max;
	}
	return false;
}
Math.rotatePointByRad = function (center,target,rad){
	var x = (target.x-center.x)*Math.cos(rad) + (target.y-center.y)*Math.sin(rad) + center.x;
	var y = -(target.x-center.x)*Math.sin(rad) + (target.y-center.y)*Math.cos(rad) + center.y;
	return {x:x,y:y};
}

var Utils = {};
Utils.getNumberWithoutPx = function (string){
	var number = string.slice(0,string.length-2);
	if(number){
		return number*1;
	}
	return false;
}
Utils.sliceNumberAfterDot = function (number,lengthAfterDot){
	if(!lengthAfterDot) lengthAfterDot = 1;
	number = number+"";
	var dotIndex = number.indexOf(".");
	if(dotIndex < 0)
		return number;
	return number.slice(0,lengthAfterDot + dotIndex + 1);
	
}
Utils.changeSecTimeToMin = function (time){
	var min = Math.floor(time/60);
	var sec = time - min * 60;
	if ((min == 0 || min) && (sec == 0 || sec)){
		return {min:min,sec:sec};		
	}else{
		return false;
	}
}
Utils.getNumberString = function (number){
	var s;
	switch(number){
	case 1 :
		s = '1st';
		break;
	case 2 :
		s = '2nd'
		break;
	case 3 :
		s = '3rd'
		break;
	default:
		s = number+'th';
	}
	return s;
}
var DB = Class.sub();
DB.prototype._init = function (){
	this.data = {};
}
DB.prototype.copyDataByName = function (dataName,target){
	if(typeof this.data[dataName] == "undefined"){
		console.error("cannot find data ",dataName,this);
		return false;
	}
	for(var i in this.data[dataName]){
		if(target[i]) console.warn(target,"has already got",i,"and it is",target[i]);
		target[i] = this.data[dataName][i];
	}
}
DB.prototype.getDataByName = function (dataName){
	if(!this.data[dataName]){
		console.error("cannot find data name:",dataName);
		return;
	}
	return this.data[dataName];
}
