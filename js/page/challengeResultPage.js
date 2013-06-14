var ChallengeResultPage = PageDiv.sub();
ChallengeResultPage.prototype._init = function (stageName,screen,stageResult){
	this.screen = screen;
	this.game = screen.game;
	ChallengeResultPage.parent.call(this,"challengeResultPage",screen,{class:"page"});
	this.title = new PageElement("img","challengeResultPageTitle",this,{src:img.challengeResultTitle.src});
	this.resultBox = new PageDiv("challengeResultPageResultBox",this);
	this.retryButton = new PageButton(
		"challengeResultPageRetryButton",this,{text:"Retry",class:"pageButton_left"});
	this.continueButton = new PageButton(
		"challengeResultPageContinueButton",this,{text:"Continue",class:"pageButton_right"});

	var self = this;
	this.continueButton.node.onmouseup
		= this.retryButton.node.ontouchend= function (){
			self.game.user.updateUserData();				
			self.screen.showChallenge();
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
	this.handleResult(stageName,stageResult);
}

ChallengeResultPage.prototype.handleResult = function (stageName,stageResult){
	var storyData = this.game.db.story.getDataByName(stageName);
	var userData = this.game.user.getUserData();
	this.resultBox.stageTitle = new PageElement(
		"h2","challengeResultStageTitle",this.resultBox,{text:storyData.title});
	this.resultBox.stagePic = new PageElement(
		"img","challengeResultStagePic",this.resultBox,{src:storyData.pic.src});
	
	this.resultBox.score = new PageElement(
		"h3","challengeResultScore",this.resultBox,{text:"您的分数 ： "+stageResult.score});
	var time = Utils.changeSecTimeToMin(stageResult.time);
	this.resultBox.time = new PageElement(
		"h3","challengeResultTime",this.resultBox,{text:"通关时间 ： "+time.min+"分"+time.sec+"秒"});
	
	this.resultBox.userNameBox = new PageDiv("challengeResultUserNameBox",this.resultBox);
	
	this.resultBox.userNameBox.title = new PageElement("h3","challengeResultUserNameTitle",this.resultBox.userNameBox,{text:"你的名字 ： "});

	this.resultBox.userNameBox.userName = new PageElement("p","challengeResultUserName",this.resultBox.userNameBox,{text:userData.userName});

	this.resultBox.nowRank = new PageElement(
		"h3","challengeResultRank",this.resultBox,{text:"本次排名 ： 获取中..."});

	this.initRecordWindow();
	
	if(!stageName) return;
	var score = stageResult.score;
	var stageData = this.game.db.stage.getDataByName(stageName);
	var stageNo = stageData.stageNo;
	this.record = userData.challengeScore[stageName];
	this.rankIndex = -1;

	this.newRecord = {
		score:score,
		time:stageResult.time
	};
	if(this.record.length == 0){
		this.rankIndex = 0;
		this.record.push(this.newRecord);
	}else{
		for (var i = 0; i < this.record.length; i++){
			if(score > this.record[i].score){
				this.record.splice(i,0,this.newRecord);
				this.rankIndex = i;
				if(this.record.length > 10){
					this.record.splice(10,this.record.length-1);
				}
				break;
			}
			if(score == this.record[i].score
			   && stageResult.time <= this.record[i].time){
				this.record.splice(i,0,this.newRecord);
				this.rankIndex = i;
				if(this.record.length < 10){
					this.record.splice(10,this.record.length-1);
				}
				break;
			}
		}
		if(this.rankIndex == -1 && this.record.length < 10){
			this.rankIndex = this.record.push(this.newRecord)-1;
		}
	}
	
	this.showChallengeRecords(stageName,stageResult);
}
ChallengeResultPage.prototype.initRecordWindow = function (){
	this.recordWindow = new PageDiv("challengeRecordWindow",this.resultBox,{class:"challengeResultPage"});
	
	this.recordWindow.pageNum = 1;
	
	this.recordWindow.recordBox = new PageDiv("challengeRecordWindowRecordBox"
											  ,this.recordWindow);
	this.recordWindow.pageNumViewer = new PageDiv("challengeRecordWindowPageNumViewer"
											,this.recordWindow
											,{text:"1/3页"});

	this.recordWindow.previousPageButton = new PageButton("challengeRecordWindowPreviousButton"
														  ,this.recordWindow,{class:"challengeResultPage"});

	this.recordWindow.previousPageButton.J.html('');
	this.recordWindow.nextPageButton = new PageButton("challengeRecordWindowNextButton"
													  ,this.recordWindow,{class:"challengeResultPage"});
	this.recordWindow.nextPageButton.J.html('');

	var self = this;
	this.recordWindow.nextPageButton.node.onmouseup
		= this.recordWindow.nextPageButton.node.ontouchend = function (){
			if (self.recordWindow.pageNum >= 3){
				return;
			}
			self.recordWindow.pageNum ++;
			self.postRecords();
			
			console.log('next page');
		};
	this.recordWindow.previousPageButton.node.onmouseup
		= this.recordWindow.previousPageButton.node.ontouchend = function (){
			if (self.recordWindow.pageNum <= 1){
				return;
			}
			self.recordWindow.pageNum --;
			self.postRecords();

			console.log('prev page');
		}
}
ChallengeResultPage.prototype.showChallengeRecords = function (stageName,stageResult){
	this.recordWindow.recordBox.J.html("同步数据中，请稍候...");
	
	this.game.user.lastChallengeData = {
		score:stageResult.score,
		time:stageResult.time,
		challengeName:stageName
	};
	
	this.game.user.uploadChallengeScore();
	//console.log(this.game.user.lastChallengeData);
	if (this.game.user.lastChallengeData.scoreRank){
		this.resultBox.nowRank.J.html('本次排名 ： '+this.game.user.lastChallengeData.scoreRank)
	}
	this.records = this.game.user.getChallengeScores(stageName);
	this.recordWindow.pageNum = 1;
	this.postRecords();
}
ChallengeResultPage.prototype.postRecords = function (){
	if (!this.records){
		console.error("no records");
		this.recordWindow.recordBox.J.html('无法获取数据，请检查网络后刷新页面');
		this.resultBox.nowRank.J.html('本次排名获取失败');
		return;
	}
	var pageNum = this.recordWindow.pageNum;
	this.recordWindow.recordBox.J.html('');
	this.recordWindow.pageNumViewer.J.html(pageNum+"/3页");
	
	if (pageNum == 1){
		this.recordWindow.previousPageButton.J.addClass('unavail');
	}
	if (pageNum == 3){
		this.recordWindow.nextPageButton.J.addClass('unavail');
	}
	var startNum = (pageNum-1)*10 + 1;
	var endNum = startNum + 9;
	var headerRankBox = new  PageDiv(
		"challengeRankBoxHeader",this.recordWindow.recordBox,
		{class:"challengeResult_rankBox"});
	headerRankBox.num = new PageElement("p",headerRankBox.id+"Num",headerRankBox,{class:"challengeResultRankNum",text:"名次"});
	headerRankBox.name = new PageElement("p",headerRankBox.id+"Name",headerRankBox,{class:"challengeResultRankName",text:"玩家"});

	headerRankBox.score = new PageElement("p",headerRankBox.id+"Score",headerRankBox,{class:"challengeResultRankScore",text:"分数"});
	headerRankBox.time = new PageElement("p",headerRankBox.id+"Time",headerRankBox,{class:"challengeResultRankTime",text:"时间"});

	for (var i = startNum-1; i < endNum; i++){
		var rankBox = new PageDiv(
			"challengeRankBox"+(i+1),this.recordWindow.recordBox,
			{class:"challengeResult_rankBox"});

		if(this.records[i].username == this.game.user.getUserData().userName){
			rankBox.J.addClass("challengeResult_playerRankBox");
		}
		rankBox.num = new PageElement("p",rankBox.id+"Num",rankBox,{class:"challengeResultRankNum",text:Utils.getNumberString(i+1)});
		rankBox.name = new PageElement("p",rankBox.id+"Name",rankBox,{class:"challengeResultRankName",text:this.records[i].username});
		rankBox.score = new PageElement("p",rankBox.id+"Score",rankBox,{class:"challengeResultRankScore",text:this.records[i].score});
		var time = Utils.changeSecTimeToMin(this.records[i].time);
		if (time){
			rankBox.time = new PageElement("p",rankBox.id+"Time",rankBox,{class:"challengeResultRankTime",text:time.min+"分"+time.sec+"秒"});
		}else{
			rankBox.time = new PageElement("p",rankBox.id+"Time",rankBox,{class:"challengeResultRankTime",text:"---"});
		}
	}
}
ChallengeResultPage.prototype.show = function (){
	this.J.show();
}
