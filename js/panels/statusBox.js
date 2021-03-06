var StageStatusBox = StageBar.sub();
StageStatusBox.prototype._init = function (game,stageInfo,screenSize,eventHandler){
	var userData = game.user.getUserData();
	
	this.mena = stageInfo.asset.mena;
	if (userData.setting.getFailReward && userData.clearedStageNo < stageInfo.stageNo){
		if(userData.stageFailureData[stageInfo.stageNo]
		   && userData.stageFailureData[stageInfo.stageNo].mena > 0){
			this.mena += userData.stageFailureData[stageInfo.stageNo].mena;
		}
	}
	
	this.life = stageInfo.life || 10;
	
	this.width = Math.round(screenSize.width/3);
	this.height = Math.round(screenSize.height/(3.3));
	this.bgImg = img.statusBox;
	this.initBg(136,235,screenSize,true);
	this.x = -Math.round(screenSize.height * 0.02);
	this.y = Math.round(screenSize.height - this.height);

	this.lifeTextX = Math.round(50/136 * this.bg.width) + this.bg.x;
	this.lifeTextY = Math.round(190/235 * this.bg.height);
	
	this.menaTextX = this.lifeTextX;
	this.menaTextY = Math.round(221/235 * this.bg.height);

	//55 184
	//55 216
	
	eventHandler.regist("initStatusData",{box:this});
}
StageStatusBox.prototype.draw = function (context){
	//context.fillRect(0,0,this.width,this.height)
	context.fillStyle = "#fff59b";
	context.fillText(this.mena,this.menaTextX,this.menaTextY);
	if(this.life < 0)
		this.life = 0;
	context.fillText(this.life,this.lifeTextX,this.lifeTextY);
}
StageStatusBox.prototype.tick = function (eventHandler){

}
