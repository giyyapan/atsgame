var AudioManager = Class.sub();
AudioManager.prototype._init = function (){
	this.source = {
		//tower attack
		laser:"laser",
		hLaser:"hLaser",
		wave:"wave",
		hWave:"hWave",
		sword:"sword",
		hSword:"hSword",
		spell:"spell",
		hSpell:"hSpell",
		//elf spell,
		elfSpell:"elfSpell",
		elfCheer:"elfCheer",
		levelUp:"levelUp",
		mpUp:"mpUp",
		teleport:"teleport",
		//other
		buttonClick:"buttonClick",
		stageClick:"stageClick",
		freshSpring:"freshSpring",
		pause:"pause",
		nextWave:"nextWave",
		waveClear:"waveClear",
		hurt:"hurt",
		//demon
		demonDead:"demonDead",
		bossDead:"bossDead",
		//story sound
		crystalSound:"crystalSound",
		giantSound:"giantSound",
		dragonSound:"dragonSound",
		boom:"boom",
	};
	this.bgmSource = {
		titleBgm:"titleBgm",
		victoryBgm:"victoryBgm",
		battleBgm1:"battleBgm1",
		battleBgm2:"battleBgm2",
		battleBgm3:"battleBgm3",
		finalStageBgm:"finalStageBgm",
		bossBgm:"bossBgm",
	};
	
	this.audios = {};
	var resourceContainerNode = document.getElementById("resourceContainer")
	
	for(var name in this.source){
		this.audios[name] = new GameAudio(name,this.source[name],resourceContainer,false);
	}
	for(var name in this.bgmSource){
		this.audios[name] = new GameAudio(name,this.bgmSource[name],resourceContainer,true);
	}
}
AudioManager.prototype.play = function (audioName){
	if(this.audios[audioName]){
		this.audios[audioName].play();
		//console.log(this.audios[audioName]);
	}else{
		console.error("cannot find audio :"+audioName)
	}
}
AudioManager.prototype.soundOff = function (){
	for(var audioName in this.audios){
		this.audios[audioName].setVolume(0);
	}
}
AudioManager.prototype.soundOn = function (){
	for(var audioName in this.audios){
		this.audios[audioName].setVolume(1);
	}
}
AudioManager.prototype.setVolume = function (audioName,volume){
	if (!Static.musicOn){
		return;
	}
	if(this.audios[audioName]){
		this.audios[audioName].setVolume(volume);
		//console.log(this.audios[audioName])
	}else{
		console.error("cannot find audio :"+audioName)
	}
}
AudioManager.prototype.pause = function (audioName){
	if(this.audios[audioName]){
		this.audios[audioName].pause();
		//console.log(this.audios[audioName])
	}else{
		console.error("cannot find audio :"+audioName)
	}	
}
AudioManager.prototype.stop = function (audioName){
	if(this.audios[audioName]){
		this.audios[audioName].stop();
		//console.log(this.audios[audioName])
	}else{
		console.error("cannot find audio :"+audioName)
	}	
}

AudioManager.prototype.mute = function (){
	for(var name in this.audios){
		this.audios[name].pause();
	}
}
AudioManager.prototype.stopAll = function (){
	for(var name in this.audios){
		this.audios[name].stop();
	}
}

GameAudio = Class.sub();
GameAudio.prototype._init = function (name,sourceName,container,isBgm){
	this.name = name;
	this.sourceName = sourceName;
	this.pathName = '../audio/';
	this.nodes = new Array();
	this.container = container;
	this.isBgm = isBgm;
	if (this.isBgm){
		this.stoped = false;
		this.play = this.bgmPlay;
	}else{
		this.play = this.soundPlay;
	}

	this.addAudioNode();
}
GameAudio.prototype.addAudioNode = function (){
	var	newAudioNode = document.createElement('audio');
	newAudioNode.id = name + (this.nodes.length + 1);
	newAudioNode.preload = "preload";
	if (this.isBgm){
		newAudioNode.loop = "loop";
	}
	this.container.appendChild(newAudioNode);
	this.nodes.push(newAudioNode);	
	
	//init Source
	var oggSource = document.createElement("source");
	oggSource.id = newAudioNode.id + "ogg";
	oggSource.src = this.pathName + this.sourceName + ".ogg";
	newAudioNode.appendChild(oggSource);
}
GameAudio.prototype.soundPlay = function (){
	for (var i = 0; i < this.nodes.length; i++){
		if (this.nodes[i].paused){
			this.nodes[i].play();
			return true;
		}
	}
	this.addAudioNode();
	this.nodes[0].play();
	return false;
}
GameAudio.prototype.bgmPlay = function (){
	this.nodes[0].play();
	this.nodes[0].paused = false;
}
GameAudio.prototype.setVolume = function (volume){
	for (var i = 0; i < this.nodes.length; i++){
		this.nodes[i].volume = volume;
	}
}
GameAudio.prototype.stop = function (){
	for (var i = 0; i < this.nodes.length; i++){
		this.nodes[i].currentTime = 0;
		this.nodes[i].pause();
	}
}
GameAudio.prototype.pause = function (){
	for (var i = 0; i < this.nodes.length; i++){
		this.nodes[i].pause();
	}
}

var audio = new AudioManager();
