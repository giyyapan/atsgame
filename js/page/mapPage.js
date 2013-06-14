var MapPage = PageDiv.sub();
MapPage.prototype._init = function (screen){
	this.screen = screen;
	this.game = screen.game;
	this.screenSize = screen.screenSize;
	MapPage.parent.call(this,"mapPage",screen,{class:"page"});
	var self = this;
	
	this.title = new PageElement("h1","mapTitle",this,{text:"Land Of Miracle"});
	this.title = new PageElement("h1","mapTitle2",this,{text:"关卡选择"});
	
	this.initButtons(this.screenSize);
	//console.log(screen,screen.screenSize)
	this.initPopupWindow(this.screenSize);
	this.points = new Array();
	var userData = this.game.user.getUserData();
	var mapPointsData = this.game.db.map.getDataByName("points");
	for(var i = 0 ; i < mapPointsData.length ; i++){
		var pointData = mapPointsData[i];
		
		if(i <= userData.clearedStageNo){
			var newPointButton = new MapPoint(pointData,this,"cleared");
		}else{
			if(i == userData.clearedStageNo + 1){
				var newPointButton = new MapPoint(pointData,this,"next");
			}else{
				var newPointButton = new MapPoint(pointData,this,"locked");
			}
		}
		this.points.push(newPointButton);
	}
	this.initSlide();
	var self = this;

}
MapPage.prototype.initSlide = function (){
	this.defaultTop = 0;
	this.pageWidth = 1080;
	this.pageHeight = 960;
	
	if (!Static.mobileUser){
		return;
	}

	var self = this;	
	if(this.screenSize.height > this.pageHeight){
		this.defaultTop = (this.screenSize.height - this.pageHeight)/2;
		this.node.style.top = this.defaultTop + "px";
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
		//e.preventDefault();
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
		//var touch = e.touches[0];
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
}
MapPage.prototype.initButtons = function (screenSize){
	var self = this;
	this.extraButtonBox = new PageDiv("extraButtonBox",this.screen,{class:"extraButtonBox"});
	this.returnButton = new PageButton("mapReturnButton",this.extraButtonBox,{class:"returnButton",text:"Return"});

	this.returnButton.node.onmouseup
		= this.returnButton.node.ontouchend = function (){
			audio.play("buttonClick");
			self.screen.showMainMenu()
	};

	this.equipButton = new PageButton("equipButton",this.extraButtonBox,{text:"Equip"});
	this.equipButton.node.onmouseup
		= this.equipButton.node.ontouchend = function (){
			audio.play("buttonClick");
		self.screen.showEquip("map");
	}
	this.equipButton.node.style.left = screenSize.width - 192 + "px"
}
MapPage.prototype.initPopupWindow = function (screenSize){
	this.popupWindow = new PageDiv("mapPopupWindow",this.extraButtonBox);
	this.popupWindow.J.hide();
	
	var popupLeft = (screenSize.width - this.popupWindow.J.width())/2;
	
	this.popupWindow.node.style.left = popupLeft+"px";
	
	this.popupWindow.header = new PageDiv("mapPopupWindowHeader",this.popupWindow);
	this.popupWindow.title = new PageElement("h2","mapPopupWindowTitle"
							,this.popupWindow)

	this.popupWindow.storyViewer = new PageDiv("mapPopupWindowStoryViewer"
								   ,this.popupWindow);
	this.popupWindow.storyViewer.J.css("margin-top","10px");

	var userData = this.game.user.getUserData ();
	this.popupWindow.menaViewer = new PageElement ("p","mapPopupWindowFailMenaViewer",this.popupWindow)
	this.popupWindow.failRewardViewer = new PageElement ("p","mapPopupWindowFailRewardViewer",this.popupWindow)
	this.popupWindow.failRewardViewer.J.hide();
	this.popupWindow.highScore = new PageElement ("p","mapPopupWindowHighScore",this.popupWindow)
	this.popupWindow.highScore.J.hide();
	
	this.popupWindow.cancelButton = new PageButton("mapPopupWindowCancelButton"
									   ,this.popupWindow,{text:"Cancel"});
	this.popupWindow.enterButton = new PageButton("mapPopupWindowEnterButton"
									  ,this.popupWindow,{text:"Enter"});

	this.popupWindow.continueButton = new PageButton("mapPopupWindowContinueButton"
													 ,this.popupWindow
													,{text:"Continue"});
	this.popupWindow.continueButton.J.hide();
	this.stageName;
	var self = this;
	this.popupWindow.cancelButton.node.onmouseup
		= this.popupWindow.cancelButton.node.ontouchend = function (){
			audio.play("buttonClick");
			//self.popupWindow.J.slideUp("fast");
			self.popupWindow.J.attr('class','').addClass('slideUp');
			setTimeout(function (){
				self.popupWindow.J.hide();
			},180)
		};
	this.popupWindow.enterButton.node.onmouseup
		= this.popupWindow.enterButton.node.ontouchend = function (){
			audio.play("buttonClick");
			if(self.popupWindow.stageName)
				self.screen.startStage(self.popupWindow.stageName);
		};
	this.popupWindow.continueButton.node.onmouseup
		= this.popupWindow.continueButton.node.ontouchend = function (){
			audio.play("buttonClick");
			self.popupWindow.J.attr('class','').addClass('slideUp');
			setTimeout(function (){
				self.popupWindow.J.hide();
				self.popupWindow.continueButton.J.hide();
				self.popupWindow.cancelButton.J.show();
				self.popupWindow.enterButton.J.show();
			},180);
		}
	this.popupWindow.J.bind("webkitAnimationEnd",function (){
		if (self.popupWindow.J.hasClass('slideDown')){
			self.popupWindow.J.addClass('slideDown-end');
			return;
		}
		if (self.popupWindow.J.hasClass('slideUp')){
			self.popupWindow.J.addClass('slideUp-end');
			return;
		}
	})
}
MapPage.prototype.mapPointActive = function (stageName){
	var self = this;
	self.popupWindow.J.attr('class','').addClass('slideUp');
	setTimeout(function (){
		self.popupWindow.J.hide();
		self.popupWindow.stageName = stageName;
		var userData = self.game.user.getUserData ();
		var storyData = self.game.db.story.getDataByName(stageName);
		var stageInfo = self.game.db.stage.getDataByName (stageName)
		if(storyData){
			self.popupWindow.title.J.html(storyData.title);
			self.popupWindow.storyViewer.J.html(storyData.text);
		}
		self.popupWindow.menaViewer.J.html("初始法力值："+stageInfo.asset.mena);
		if (userData.clearedStageNo < stageInfo.stageNo){
			self.popupWindow.highScore.J.hide();
			self.popupWindow.failRewardViewer.J.show();
			if (!userData.stageFailureData[stageInfo.stageNo]){
				userData.stageFailureData[stageInfo.stageNo] = {mena:0,time:0};
			}
			if(userData.setting.getFailReward){
				var rewardText = "失败次数："
					+userData.stageFailureData[stageInfo.stageNo].time
					+ "</br>失败奖励法力值："
					+userData.stageFailureData[stageInfo.stageNo].mena;
			}else{
				var rewardText = "失败次数："
					+userData.stageFailureData[stageInfo.stageNo].time
					+ "</br>失败奖励法力值："
					+userData.stageFailureData[stageInfo.stageNo].mena
					+"</br><span>-根据用户设置,此奖励不会生效-</span>";
			}	
			self.popupWindow.failRewardViewer.J.html(rewardText);
		}else{
			self.popupWindow.failRewardViewer.J.hide();
			self.popupWindow.highScore.J.show();
			self.popupWindow.highScore.J.html("最高分:"+userData.highScore[stageInfo.stageNo]);
		}

		//self.popupWindow.J.slideDown("fast");
		self.popupWindow.J.show();
		self.popupWindow.J.attr('class','').addClass('slideDown');

		self = null;
	},180);
}

MapPage.prototype.show = function (){
	//this.J.show();
	if (!Static.mobileUser){
		this.screenDefaultWidth = this.screen.J.width();
		this.extraButtonBox.J.width(this.pageWidth);
		this.equipButton.node.style.left = "";
		this.equipButton.node.style.right = "0";
		this.popupWindow.node.style.left = (this.pageWidth - this.popupWindow.J.width())/2 + 'px';
		//$('body').width(this.pageWidth);

		$("#desktopExtraBoxRight").animate(
			{right:window.innerWidth/2 - this.pageWidth/2 - 300},"fast");
		$("#desktopExtraBoxLeft").animate(
			{left:window.innerWidth/2 - this.pageWidth/2 - 300},"fast");

		
		var self = this;
		this.J.fadeIn("fast");
		this.screen.J.animate({
			width:this.pageWidth+'px'
		},"fast",function (){
			self.handlePopupStory();
			self = null;
		});
		//this.screen.J.width(this.pageWidth);
		return;
	}
	this.J.fadeIn("fast");
	this.handlePopupStory();
}
MapPage.prototype.handlePopupStory = function (){
	var userData = this.game.user.getUserData();
	var clearedStageNo = userData.clearedStageNo;
	console.log(clearedStageNo);
	console.warn(this.game.db);
	var popupStoryData = this.game.db.story.getDataByName("popupStory");
	if(!popupStoryData[clearedStageNo]
	  || typeof userData.highScore[clearedStageNo + 1] != "undefined"){
		return;
	}
	var nowStory = popupStoryData[clearedStageNo];
	this.popupWindow.cancelButton.J.hide();
	this.popupWindow.enterButton.J.hide();
	this.popupWindow.continueButton.J.show();
	if(nowStory.title)
		this.popupWindow.title.J.html(title);
	this.popupWindow.storyViewer.J.html(nowStory.text);
	this.popupWindow.J.show();
	this.popupWindow.J.attr('class','').addClass('slideDown');
	//this.popupWindow.J.slideDown("fast");
	if(clearedStageNo == 15){
		clearedStageNo = 100;
	}
}
MapPage.prototype.hide = function (){
	//this.J.hide();
	var self = this;

	this.J.fadeOut("fast",function (){
		$("#desktopExtraBoxRight").animate(
			{right:window.innerWidth/2 - 270 - 300},"fast");

		$("#desktopExtraBoxLeft").animate(
			{left:window.innerWidth/2 - 270 - 300},"fast");


		self.screen.J.animate({width:self.screenDefaultWidth+'px'},"fast");

		delete self.screenDefaultWidth;
		self = null;
	});

}
var MapPoint = PageButton.sub();
MapPoint.prototype._init = function (pointData,mapPage,type){
	
	this.stageName = pointData.stageName;
	this.mapPage = mapPage;
	var info = {};
	info.class = "mapPoint_"+type;
	var stageNumber = pointData.number;
	info.text = stageNumber;

	MapPoint.parent.call(this,this.stageName,mapPage,info);
	
	//console.log(pointData.x,pointData.y,this.J.width()/2,this.J.height()/2);
	this.J.css(
		{left:pointData.x - this.J.width()/2
		 ,top:pointData.y - this.J.height()/2
		});
	
	var self = this;
	if(Static.mobileUser){
		//alert("lala");
		if(type != "locked"){
			this.node.ontouchend = function (e){
				e.preventDefault();
				self.J.removeClass(self.className+"-active");
				MapPoint.activeFunc.call(self);
			}
		}else{
			this.node.ontouchend = function (e){
				e.preventDefault();
				self.J.removeClass(self.className+"-active");
			}
		}
		this.node.ontouchstart = function (e){
			audio.play("buttonClick");
			e.preventDefault();
			self.J.addClass(self.className+"-active");			
		}
	}else{
		if (type != "locked"){
			this.node.onmouseup  = function (){

				self.J.removeClass(self.className+"-active");
				MapPoint.activeFunc.call(self);
			}
		}
		this.node.onmousedown = function (){
			audio.play("buttonClick");
			self.J.addClass(self.className+"-active");			
		}
	}
}
MapPoint.activeFunc = function (){
	//alert("enter");
	this.mapPage.mapPointActive(this.stageName);
}
