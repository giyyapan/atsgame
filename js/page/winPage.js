var WinPage = PageDiv.sub();
WinPage.prototype._init = function (stageName,screen,stageResult){
	this.screen = screen;
	this.game = screen.game;
	var storyData = this.game.db.story.getDataByName(stageName);
	WinPage.parent.call(this,"winPage",screen,{class:"page"});
	this.title = new PageElement("img","winPageTitle",this,{src:img.winTitle.src});
	this.stageTitle = new PageElement("h2","winPageStageTitle",this,{text:storyData.title});
	this.summonerPic = new PageElement(
		"img","winPageSummonerPic",this,{src:img.summonerPic.src});
	this.resultBox = new PageDiv("winPageResultBox",this);
	this.rewardViewer = new PageDiv("winPageRewardViewer",this);
	this.retryButton = new PageButton(
		"winPageRetryButton",this,{text:"Retry",class:"pageButton_left"});
	this.continueButton = new PageButton(
		"winPageContinueButton",this,{text:"Continue",class:"pageButton_right"});
	this.handleReward(stageName,stageResult);
	var self = this;
	this.continueButton.node.onmouseup
		= this.continueButton.node.ontouchend= function (){
		self.screen.showMap();
	} ;
	this.retryButton.node.onmouseup
		= this.retryButton.node.ontouchend =  function (){
		self.screen.startStage(stageName);
	}
	this.node.ontouchstart
		= this.node.ontouchmove
		= this.node.ontouchend = function (e){
			e.preventDefault();
		}

}
WinPage.prototype.handleReward = function (stageName,stageResult){
	this.resultBox.score = new PageElement(
		"h3","winPageScore",this.resultBox,{text:"分数 ： "+stageResult.score});
	var time = Utils.changeSecTimeToMin(stageResult.time);
	this.resultBox.time = new PageElement(
		"h3","winPageTime",this.resultBox,{text:"通关时间 ： "+time.min+"分"+time.sec+"秒"});
	this.resultBox.highScore = new PageElement(
		"h3","winPageHighScore",this.resultBox);
	
	if(!stageName) return;
	var score = stageResult.score;
	var stageData = this.game.db.stage.getDataByName(stageName);
	var stageNo = stageData.stageNo;
	var userData = this.game.user.getUserData();
	if(!userData.highScore[stageNo]
	   || score > userData.highScore[stageNo]){
		userData.highScore[stageNo] = score;
	}

	this.resultBox.highScore.J.html("最高分 : "+userData.highScore[stageNo]);
	
	if(userData.clearedStageNo >= stageData.stageNo){
		//if it has been cleared, skip the reward
		console.log("skip","cleared Stage",userData.clearedStageNo,stageData.stageNo);
		this.game.user.updateUserData();
		return;
	}
	userData.clearedStageNo = stageData.stageNo;
	var reward = stageData.reward;
	
	if(!reward
	   || (!reward.tower && !reward.spell && !reward.elf)){
		console.log("no reward");
		this.game.user.updateUserData();
		return;
	}
	this.rewardViewer.title = new PageElement("h2","rewardViewerTitle",this.rewardViewer,{text:"解锁新物件:"});
	this.rewardViewer.elfBox = new PageDiv("rewardViewerElfBox",this.rewardViewer,{text:"精灵:"});
	this.rewardViewer.towerBox = new PageDiv("rewardViewerTowerBox",this.rewardViewer,{text:"守护塔:"});
	this.rewardViewer.spellBox = new PageDiv("rewardViewerSpellBox",this.rewardViewer,{text:"魔法:"});
	this.rewardViewer.challengeBox = new PageDiv("rewardViewerChallengeBox",this.rewardViewer,{text:"解锁新挑战!"});

	this.rewardViewer.elfBox.J.hide();
	this.rewardViewer.towerBox.J.hide();
	this.rewardViewer.spellBox.J.hide();
	this.rewardViewer.challengeBox.J.hide();
	
	var self = this;
	if(reward.elf){
		for (var i = 0; i < reward.elf.length; i++){
			var elfName = reward.elf[i];
			userData.availElves.push(elfName);
			if(userData.elves.length < 3){
				userData.elves.push(elfName);
			}
			var elfData = this.game.db.elf.getDataByName(elfName);
			addNewItem(elfData.intro.name,
					   elfData.buttonPic,
					   this.rewardViewer.elfBox);
			this.rewardViewer.elfBox.J.show();
		}
	}
	if(reward.spell){
		for(var elfName in reward.spell){
			for (var i = 0; i < reward.spell[elfName].length; i++){
				var spellName = reward.spell[elfName][i];
				userData.spell[elfName].push(spellName);
				
				var spellData = this.game.db.elf.getDataByName(elfName).spell[spellName];
				
				addNewItem(spellData.intro.name,
						   spellData.pic,
						   this.rewardViewer.spellBox);
				this.rewardViewer.spellBox.J.show();
			}
		}
	}
	if(reward.tower){
		for (var i = 0; i < reward.tower.length; i++){
			var towerName = reward.tower[i];
			userData.availTowers.push(towerName);
			if(userData.towers.length < 3){
				userData.towers.push(towerName);
			}
			var towerData = this.game.db.tower.getDataByName(towerName);

			addNewItem(towerData.intro.name,
					   towerData.buttonPic,
					   this.rewardViewer.towerBox);
			this.rewardViewer.towerBox.J.show();
		}
	}
	if(reward.challenge){
		this.rewardViewer.challengeBox.J.show();
	}
	this.game.user.updateUserData();

	function addNewItem(name,img,container){
		var itemBox = new PageDiv("rewardItemBox"+name,container,{class:"rewardItemBox"});
		itemBox.img = new PageElement("img","rewardItemImg"+name,itemBox,{class:"rewardItemImg"});
		itemBox.text = new PageElement("p","rewardItemText"+name ,itemBox,{class:"rewardItemText"});
		itemBox.img.node.src = img.src;
		itemBox.text.J.html(name);
	}
}
WinPage.prototype.show = function (){
	this.J.show();
}
