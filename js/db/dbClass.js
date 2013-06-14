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
