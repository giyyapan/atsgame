var ChallengePage = PageDiv.sub();
ChallengePage.prototype._init = function (screen){
	this.screen = screen;	
	this.game = screen.game;
	this.screenSize = screen.screenSize;
	ChallengePage.parent.call(this,"challengePage",screen,{class:"page"});
	if(this.screenSize.height > this.pageHeight){
		this.defaultTop = (this.screenSize.height - this.pageHeight)/2;
		this.node.style.top = this.defaultTop + "px";
	}
	var self = this;
	
	this.title = new PageElement("h1","challengePageTitle",this,{class:"pageTitle",text:"Challenge"});
	this.title2 = new PageElement("h2","challengePageTitle2",this,{class:"pageTitle_zh",text:"挑 战"});
	
	this.initButtons(this.screenSize);
	this.initStages(this.screenSize);
	this.initRecordWindow(this.screenSize);
	this.initSlide();
}
ChallengePage.prototype.initRecordWindow = function (){
	this.recordWindow = new PageDiv("challengeRecordWindow",this.extraButtonBox);
	this.recordWindow.J.addClass('fadeOut-end');

	this.recordWindow.pageNum = 1;
	
	this.recordWindow.title = new PageElement("h2","challengeRecordWindowTitle"
											  ,this.recordWindow)
	this.recordWindow.recordBox = new PageDiv("challengeRecordWindowRecordBox"
											  ,this.recordWindow);
	this.recordWindow.pageNumViewer = new PageDiv("challengeRecordWindowPageNumViewer"
											,this.recordWindow
											,{text:"1/3页"});

	this.recordWindow.previousPageButton = new PageButton("challengeRecordWindowPreviousButton"
														  ,this.recordWindow);
	this.recordWindow.previousPageButton.J.html('');


	this.recordWindow.nextPageButton = new PageButton("challengeRecordWindowNextButton"
													  ,this.recordWindow);
	this.recordWindow.nextPageButton.J.html('');
	
	this.recordWindow.closeButton = new PageButton("challengeRecordWindowCloseButton"
												   ,this.recordWindow,{text:"关闭",class:"pageButton_center"});
	
	var self = this;
	this.recordWindow.closeButton.node.onmouseup
		= this.recordWindow.closeButton.node.ontouchend = function (){
			audio.play("buttonClick");
			self.recordWindow.J.attr('class','').addClass('fadeOut');
			setTimeout(function (){
				self.recordWindow.J.addClass('fadeOut-end')
			},190);
		};
	this.recordWindow.nextPageButton.node.onmouseup
		= this.recordWindow.nextPageButton.node.ontouchend = function (){
			audio.play("stageClick");
			if (self.recordWindow.pageNum >= 3){
				return;
			}
			self.recordWindow.pageNum ++;
			self.postRecords();
			
			console.log('next page');
		};
	this.recordWindow.previousPageButton.node.onmouseup
		= this.recordWindow.previousPageButton.node.ontouchend = function (){
			audio.play("stageClick");
			if (self.recordWindow.pageNum <= 1){
				return;
			}
			self.recordWindow.pageNum --;
			self.postRecords();

			console.log('prev page');
		}
	this.recordWindow.J.bind("webkitAnimationEnd",function (){
		if (self.recordWindow.J.hasClass('fadeIn')){
			self.recordWindow.J.addClass('fadeIn-end');
			return;
		}
		if (self.recordWindow.J.hasClass('fadeOut')){
			self.recordWindow.J.addClass('fadeOut-end');
			return;
		}
	})
}
ChallengePage.prototype.showChallengeRecords = function (stage){
	//var scores = this.game.user.getChallengeScores(challengeName);
	var stageTitle = stage.storyData.title;
	var challengeName = stage.stageName;
	
	this.recordWindow.recordBox.J.html(' ');
	this.recordWindow.title.J.html(stageTitle);
	
	this.records = this.game.user.getChallengeScores(challengeName);
	//console.log(scoresArray);
	this.recordWindow.pageNum = 1;
	this.postRecords();

	this.recordWindow.J.attr('class','').addClass('fadeIn');
	var self = this;
	setTimeout(function (){
		self.recordWindow.J.addClass('fadeIn-end')
		self = null;
	},190);
}
ChallengePage.prototype.postRecords = function (){
	if (!this.records){
		console.error("no records");
		this.recordWindow.recordBox.J.html('无法获取数据，请检查网络后刷新页面');
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
ChallengePage.prototype.initSlide = function (){
	var self = this;
	this.defaultTop = 0;
	this.pageHeight = 1400;
	this.pageWidth = this.J.width();

	if (!Static.mobileUser){
		this.pageWidth = 1080;
		this.pageHeight = 960;
		$(".challengeStage").css("display","inline-block");
		$(".lockedChallengeStage").css("display","inline-block");
		return;
	}
	
	this.node.ontouchmove = function (e){
		e.preventDefault();
		var touch = e.touches[0];
		if(self.touchStartData){
			var newX = -self.touchStartData.x + touch.pageX;
			var newY = -self.touchStartData.y + touch.pageY;
			if(newX <=0 && -newX + self.screenSize.width <= self.pageWidth){

				self.node.style.left = newX + "px";
			}
			//alert(self.touchStartData.y +" "+touch.pageY+" "+newY);
			if (newY <=self.defaultTop && -newY + self.screenSize.height - self.defaultTop <= self.pageHeight){
				self.node.style.top = newY + "px";
			}
		}
	}
	this.node.ontouchstart =  function (e){
		e.preventDefault();
		var nowLeft = Utils.getNumberWithoutPx(self.node.style.left);
		var nowTop = Utils.getNumberWithoutPx(self.node.style.top)
		var touch = e.touches[0];
		self.touchStartData = {
			x:touch.pageX,
			y:touch.pageY
		};
		if(nowLeft){
			self.touchStartData.x = touch.pageX - nowLeft;
		}
		if(nowTop){
			self.touchStartData.y = touch.pageY - nowTop;
		}
	}
	this.node.ontouchend = function (e){
		e.preventDefault();
		delete self.touchStartData;
	}
	this.node.onmousemove = function (e){
		e.preventDefault();
		if(self.mouseStartData){
			var newX = -self.mouseStartData.x + e.pageX;
			var newY = -self.mouseStartData.y + e.pageY;
			if(newX <=0 && -newX + $(".screen").width() <= self.pageWidth){
				self.node.style.left = newX + "px";
			}
			if (newY <=0 && -newY + $(".screen").height() <= self.pageHeight){
				self.node.style.top = newY + "px";
			}
		}
	}
	this.node.onmousedown = function (e){
		e.preventDefault();
		var nowLeft = Utils.getNumberWithoutPx(self.node.style.left);
		var nowTop = Utils.getNumberWithoutPx(self.node.style.top)
		self.mouseStartData = {
			x:e.pageX,
			y:e.pageY
		};
		if(nowLeft){
			self.mouseStartData.x = e.pageX - nowLeft;
		}
		if(nowTop){
			self.mouseStartData.y = e.pageY - nowTop;
		}
	}
	this.node.onmouseup = function (e){
		e.preventDefault();
		delete self.mouseStartData;
	}
	this.node.onmousewheel = function (e){
		e.preventDefault();
		delete self.mouseStartData;
		var top = self.node.style.top;
		var newTop = (top.slice(0,top.length-2)*1 + e.wheelDeltaY );
		//console.log(newTop);
		if (newTop > 0){
			newTop = 0;
		}
		if (newTop + self.pageHeight < $(".screen").height()){
			newTop = $(".screen").height() - self.pageHeight;
		}
		self.node.style.top = newTop + 'px';
	}
}
ChallengePage.prototype.initStages = function (screenSize){
	this.stageBox = new PageDiv("challengeStageBox",this);
	this.stages = [];
	var self = this;
	var userData = this.game.user.getUserData();
	var stageDatas = this.game.db.challenge.getDataByName("stages");
	for (var i = 0; i < stageDatas.length; i++){
		var data = stageDatas[i];
		if(userData.clearedStageNo >= data.number){
			var newStage = new ChallengeStage(this.game,false,data,this);
			this.stages.push(newStage);
		}//else{
		//	var newStage = new ChallengeStage(true,data,this);
		//}
	}
	console.log(this.stages.length);
	if (this.stages.length == 0){
		console.log("hellow");
		new PageElement("h3","challengePageNoStageHint",this.stageBox,
						{text:"在剧情模式中过关以解锁挑战关卡"});
	}
}
ChallengeStage = PageDiv.sub();
ChallengeStage.prototype._init = function (game,locked,data,page){
	this.game = game;
	this.storyData = this.game.db.story.getDataByName(data.stageName);
	var storyData = this.storyData;
	var stageBox = page.stageBox
	if(!locked){
		ChallengeStage.parent.call(this,data.stageName,stageBox,{class:"challengeStage"})
		this.page = page;

		this.stageName = data.stageName;
		this.pic = new PageElement("img",data.stageName+"Pic",this
								   ,{class:"challengeStagePic",
									 src:storyData.pic.src});
		this.title = new PageElement("p",data.stageName+"title",this
									 ,{class:"challengeStageTitle",text:storyData.title});
		this.text = new PageElement("p",data.stageName+"Text",this
									,{class:"challengeStageText",text:storyData.text});
		this.recordBox = new PageDiv(
			data.stageName+"RecordBox",this,{class:"challenge_recordBox"});

		this.recordBox.hint = new PageElement("h5",data.stageName+"RecordBoxHint",this.recordBox
											  ,{class:"challenge_recordBoxHint",text:"点击查看网络排名"});
		
		var record = this.game.user.getUserData().challengeScore[data.stageName];
		//console.warn(record);
		for (var i = 0; i < 3; i++){
			if(!record[i])
				break;
			var rankBox = new PageDiv(
				data.stageName+"Rankbox"+(i+1),this.recordBox,{class:"challenge_rankBox"});
			rankBox.num = new PageElement("p",rankBox.id+"Num",rankBox,{class:"challengeStageRankNum",text:Utils.getNumberString(i+1)});
			rankBox.score = new PageElement("p",rankBox.id+"Score",rankBox,{class:"challengeStageRankScore",text:record[i].score});
		}
		
		this.enterButton = new PageButton(data.stageName+"EnterButton",this
										  ,{class:"challengeStageEnterButton",
											text:"Enter"});
		var self = this;
		this.enterButton.node.onmouseup
			= this.enterButton.node.ontouchend = function (){
			self.page.screen.startStage(self.stageName);
		}
		this.recordBox.node.onmouseup
			= this.recordBox.node.ontouchend = function (){
				audio.play("stageClick");
				self.page.showChallengeRecords(self);
			}

	}else{
		ChallengeStage.parent.call(this,data.stageName,stageBox,{class:"lockedChallengeStage"});
	}
}
ChallengePage.prototype.initButtons = function (screenSize){
	var self = this;
	this.extraButtonBox = new PageDiv("extraButtonBox",this.screen,{class:"extraButtonBox"});

	this.returnButton = new PageButton("challengeReturnButton",this.extraButtonBox,{class:"returnButton",text:"Return"});
	this.returnButton.node.onmouseup
		= this.returnButton.node.ontouchend = function (){
			audio.play("buttonClick");
			self.screen.showMainMenu();
	};
	this.equipButton = new PageButton("equipButton",this.extraButtonBox,{text:"Equip"});
	this.equipButton.node.onmouseup
		= this.equipButton.node.ontouchend= function (){
			audio.play("buttonClick");
			self.screen.showEquip("challenge");
	}
	this.equipButton.node.style.left = screenSize.width - 192 + "px";
}
ChallengePage.prototype.show = function (){
	this.stageBox.J.hide();	
	if (!Static.mobileUser){
		this.screenDefaultWidth = this.screen.J.width();
		this.extraButtonBox.J.width(this.pageWidth);
		this.equipButton.node.style.left = "";
		this.equipButton.node.style.right = "0";
		
		$("#desktopExtraBoxRight").animate(
			{right:window.innerWidth/2 - this.pageWidth/2 - 300},"fast");
		$("#desktopExtraBoxLeft").animate(
			{left:window.innerWidth/2 - this.pageWidth/2 - 300},"fast");
		
		var self = this;
		this.J.fadeIn("fast");
		this.screen.J.animate(
			{width:this.pageWidth+'px'}
			,"fast"
			,function (){
				self.stageBox.J.fadeIn("fast");
				self = null;
			});
		//this.screen.J.width(this.pageWidth);
		return;
	}
	this.J.fadeIn("fast");
	this.stageBox.J.slideDown("fast");
}
ChallengePage.prototype.hide = function (){
	
	var self = this;
	this.stageBox.J.fadeOut("fast",function (){
		self.screen.J.animate({width:self.screenDefaultWidth+'px'},"fast");
		$("#desktopExtraBoxRight").animate(
			{right:window.innerWidth/2 - 270 - 300},"fast");
		$("#desktopExtraBoxLeft").animate(
			{left:window.innerWidth/2 - 270 - 300},"fast");

		delete self.screenDefaultWidth;
		self.J.fadeOut("fast");
		self = null;
	});
}
