var LosePage = PageDiv.sub();
LosePage.prototype._init = function (stageName,screen,stageResult){
	this.game = screen.game;
	var stageData = this.game.db.stage.getDataByName(stageName);
	var userData = this.game.user.getUserData();
	if(typeof userData.highScore[stageData.stageNo] == "undefined"){
		userData.highScore[stageData.stageNo] = -1;
	}
	this.screen = screen;
	LosePage.parent.call(this,"losePage",screen,{class:"page"});
	this.title = new PageElement("img","losePageTitle",this,{src:img.loseTitle.src});
	this.text = new PageElement("p","losePageText",this,{text:"Aria：</br>什么？！我怎么可能会被打败！我不是主角吗！</br></br>Liara:</br>乖啦乖啦～胜败乃兵家常事嘛ω"})
	this.losePig = new PageElement("img","losePic",this,{src:img.losePagePic.src});
	this.failRewardViewer = new PageElement ("p","losePageFailRewardViewer",this);
	
	this.returnButton = new PageButton(
		"losePageReturnButton",this,{text:"Back",class:"pageButton_left"});
	this.retryButton = new PageButton(
		"losePageRetryButton",this,{text:"Retry",class:"pageButton_right"});
	var self = this;
	
	this.retryButton.node.onmouseup
		= this.retryButton.node.ontouchend =function (){
		self.screen.startStage(stageName);
	}
	this.returnButton.node.onmouseup
		= this.returnButton.node.ontouchend= function (){
		self.screen.showMap();
	}
	this.node.ontouchstart
		= this.node.ontouchmove
		= this.node.ontouchend = function (e){
			e.preventDefault();
		}

	this.handleFailueReward(stageData,stageResult);
}

LosePage.prototype.show = function (){
	this.J.show();
}
LosePage.prototype.handleFailueReward = function (stageData,stageResult){
	var userData = this.game.user.getUserData ();
	if (userData.clearedStageNo >= stageData.stageNo
	   || stageResult.clearedWave < 1){
		return;
	}
	var stageNo = stageData.stageNo;
	if (!userData.stageFailureData[stageNo]){
		userData.stageFailureData[stageNo] = {time:0,mena:0};
	}
	var rewardMena = Math.round(0.03*(stageResult.clearedWave)*stageData.asset.mena);
	this.failRewardViewer.J.html("累计失败次数："
								 +userData.stageFailureData[stageData.stageNo].time
								 +"</br>失败奖励法力值："
								 +userData.stageFailureData[stageData.stageNo].mena
								 +"+"
								 +rewardMena);

	userData.stageFailureData[stageNo].time ++;
	userData.stageFailureData[stageNo].mena += rewardMena;

}
