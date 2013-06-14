//*************************
//Aria the Summoner
//*************************
var Game = Class.sub();
Game.prototype._init = function (){
	this.stageStarted = false;
}
Game.prototype.start = function (){
	this.initUserData();
	//alert(navigator.userAgent);
	if(navigator.userAgent.indexOf("Android") > -1 ){
		Static.androidUser = true;
	}
	if(navigator.userAgent.indexOf("iPad") > -1){
		Static.iPadUser = true;
	}
	this.screenSize={
		width:window.innerWidth,
		height:window.innerHeight,
		defautWidth:540,
		defautHeight:960,
		defautCellWidth:73,
		cellWidth:73,
	}
	this.screenSize.cellWidth = Math.floor(this.screenSize.cellWidth);
	this.mainScreen = new MainScreen(this);
	this.canvasScreen = new CanvasScreen(this);
	this.handleScreenSize();
	//this.mainScreen.showMap();
	//this.addGlobleLisener();
	this.mainScreen.showMainMenu();
	//this.mainScreen.showWinPage("testStage",{cleared:true,
	//										 score:100,
	//										 time:300
	//										});
	//this.mainScreen.showEquip();
	//this.mainScreen.showLosePage("testStage",{cleared:true,
	//										  score:100,
	//										 time:300
	//										});
	//this.mainScreen.showWinPage(null,{time:1000,score:3000});
	
	//$("#canvasScreen").show();
	//this.startStage("challengeStage1");
}
Game.prototype.initUserData = function (){
	//Static.newUserData();
	if(Static.getUserData() == false){
		console.log("new user data");
		Static.newUserData();
	}
	console.log(Static.userData);
	//Static.getUserData().availTowers = ["normalTower","laserTower","waveTower"];
	//Static.getUserData().spell.wind = ["blast","sway"];
	
	//Static.getUserData().availTowers.push("heavyLaserTower","heavySpellTower");
	//delete Static.getUserData().shownStory;
	//Static.getUserData().availTowers = ["normalTower","laserTower","waveTower","spellTower","heavyNormalTower","heavyWaveTower","heavyLaserTower"],
	//Static.getUserData().clearedStageNo = 100;
	//Static.updateUserData();
}
Game.prototype.startStage = function (stageName){
	this.handleScreenSize();
	this.stage = new Stage(stageName,this);
	console.log("startStage");
	//console.log("screenSize:"this.stage.screenSize);
	this.stage.start();
}
Game.prototype.endStage = function (stageName,stageResult){
	var stageData = db.stage.getDataByName(stageName);
	this.canvasScreen.J.hide();
	var userData = Static.getUserData();
	if(stageResult.exit){
		userData.continueStage = stageName;
		userData.highScore[stageData.stageNo] = -1;
		Static.updateUserData();
		this.mainScreen.showMainMenu();
		return;
	}
	var stageInfo = db.stage.getDataByName(stageName);
	if(stageName.challenge){
		this.mainScreen.showChallengeResult(stageName,stageResult);
		delete userData.continueStage;
		delete userData.shownStory;
		Static.updateUserData();
		return;
	}
	if(stageResult.cleared){
		this.mainScreen.showWinPage(stageName,stageResult);
		delete userData.continueStage;
		delete userData.shownStory;
	}else{
		userData.continueStage = stageName;
		userData.highScore[stageData.stageNo] = -1;
		this.mainScreen.showLosePage(stageName);
	}
	Static.updateUserData();
}
Game.prototype.addGlobleLisener = function (){
	$(".page")[0].ontouchstart = function (e){
		e.preventDefault();
	};
	$(".page")[0].ontouchmove,function (e){
		e.preventDefault();
	};
	$(".page")[0].ontouchend,function (e){
		e.preventDefault();
	};
}
Game.prototype.handleScreenSize = function(){

	$("body").width(this.screenSize.width);
	$("body").height(this.screenSize.height);
	//Static.androidUser = true;
	if(Static.androidUser || Static.iPadUser){
		$(".screen").width(this.screenSize.width);
		$(".screen").height(this.screenSize.height);
		$("#canvas")[0].width = this.screenSize.width;
		$("#canvas")[0].height = this.screenSize.height;
		$("#uiCanvas")[0].width = this.screenSize.width;
		$("#uiCanvas")[0].height = this.screenSize.height;
		$("#bgCanvas")[0].width = this.screenSize.width;
		$("#bgCanvas")[0].height = this.screenSize.height;

		if(this.screenSize.width / this.screenSize.height <= this.screenSize.defautWidth/this.screenSize.defautHeight){
			this.screenSize.cellWidth = this.screenSize.width/(9 - 8/4) - 3;
		}else{
			this.screenSize.cellWidth = this.screenSize.height * (1- 1/20 - 1/8 - 1/11)/9 + 1;
		}

	}else{
		//this.screenSize.width = this.screenSize.defautWidth;
		//this.screenSize.height = this.screenSize.defautHeight;
		this.screenSize.width = 540;
		this.screenSize.height = 960;
		//this.mainScreen.J.css({overflow:"scroll"});
	}
	this.screenSize.cellHeight = this.screenSize.cellWidth * 0.866;
}
