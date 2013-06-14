var SystemPage = PageDiv.sub();
SystemPage.prototype._init = function (screen){
	SystemPage.parent.call(this,"systemPage",screen,{class:"page"});
	this.title = new PageElement("h1","systemPageTitle",this,{class:"pageTitle",text:"System"});
	this.title2 = new PageElement("h2","systemPageTitle2",this,{class:"pageTitle_zh",text:"系统设置"});
	this.screen = screen;
	this.game = screen.game;
	this.returnButton = new PageButton("systemPageReturnButton",this,{text:"Return"});
	
	this.skipStorySwitch = new PageDiv("skipStorySwitchBox",this,{class:"systemSwitchBox"});
	this.skipStorySwitch.title = new PageElement("h3","skipStorySwitchTitle",this.skipStorySwitch,{text:"剧情"});
	this.skipStorySwitch.intro = new PageElement("p","skipStorySwitchIntro",this.skipStorySwitch,{text:"选择是否跳过已经胜利的关卡的剧情"});
	this.skipStoryButton = new PageButton("skipStoryButton",this.skipStorySwitch,{class:"switchButton",text:"跳过"});
	this.notSkipStoryButton = new PageButton("notSkipStoryButton",this.skipStorySwitch,{class:"switchButton",text:"不跳过"})
	
	this.getFailRewardSwitch = new PageDiv("getFailRewardSwitchBox",this,{class:"systemSwitchBox"});
	this.getFailRewardSwitch.title = new PageElement("h3","getFailRewardSwitchTitle",this.getFailRewardSwitch,{text:"失败奖励"});
	this.getFailRewardSwitch.intro = new PageElement("p","getFailRewardSwitchIntro",this.getFailRewardSwitch,{text:"是否在剧情模式失败时得到额外的魔力值奖励?</br><span>(喜欢挑战的朋友可以关闭这个)</span>"});
	this.getFailRewardButton = new PageButton("getFailRewardButton",this.getFailRewardSwitch,{class:"switchButton",text:"开启"});
	this.notGetFailRewardButton = new PageButton("notGetFailRewardButton",this.getFailRewardSwitch,{class:"switchButton",text:"关闭"});

	this.resetButton = new PageButton("resetButton",this,{text:"重置游戏"});
	this.changeUserButton = new PageButton("changeUserButton",this,{text:"切换用户"});

	
	this.resetPopupWindow = new PageDiv("resetPopupWindow",this,{class:"normalPopupWindow"});
	this.resetPopupWindow.J.hide();
	this.resetPopupWindow.title = new PageElement("h2","resetWindowTitle",this.resetPopupWindow,{text:"确定要重置游戏么?"});
	this.resetPopupWindow.text = new PageElement("p","resetWindowText",this.resetPopupWindow,{text:"!!注意!!</br>剧情,关卡分数,解锁物件会被重置!</br>挑战模式数据将会保留"});
	this.resetPopupWindow.agreeButton = new PageButton("resetWindowAgreeButton",this.resetPopupWindow,{class:"resetWindowButton",text:"重置",class:"pageButton_left"});
	this.resetPopupWindow.cancelButton = new PageButton("resetWindowCancelButton",this.resetPopupWindow,{class:"resetWindowButton",text:"算了",class:"pageButton_right"});

	this.aboutBox = new PageDiv("aboutBox",this);
	this.aboutBox.title = new PageElement("h3","aboutBoxTitle",this.aboutBox,{text:"关于"});
	this.aboutBox.text = new PageElement("p","aboutBoxText",this.aboutBox,{text:"Program : 潘潘</br>Design : 龙妹</br>剧情&测试协力 : 大暗月</br>Unique Studio @ 超元气魔法小队"})

	var userData = this.game.user.getUserData();

	if(userData.setting.skipClearedStory){
		this.skipStoryButton.J.addClass("switchOn");
	}else{
		this.notSkipStoryButton.J.addClass("switchOn");
	}
	if(userData.setting.getFailReward){
		this.getFailRewardButton.J.addClass("switchOn");
	}else{
		this.notGetFailRewardButton.J.addClass("switchOn");
	}


	var self = this;		
	this.returnButton.node.onmouseup
		= this.returnButton.node.ontouchend = function (){
			audio.play("buttonClick");
			screen.showMainMenu();
		}
	
	this.skipStoryButton.node.onmouseup
		= this.skipStoryButton.node.ontouchend= function (){
			audio.play("stageClick");
			self.notSkipStoryButton.J.removeClass("switchOn");
			self.skipStoryButton.J.addClass("switchOn");
			userData.setting.skipClearedStory = true;
			self.game.user.updateUserData();
		};
	this.notSkipStoryButton.node.onmouseup
		= this.notSkipStoryButton.node.ontouchend = function (){
			audio.play("stageClick");
			self.skipStoryButton.J.removeClass("switchOn");
			self.notSkipStoryButton.J.addClass("switchOn");
			userData.setting.skipClearedStory = false;
			self.game.user.updateUserData();
		};
	
	this.getFailRewardButton.node.onmouseup
		= this.getFailRewardButton.node.ontouchend= function (){
			audio.play("stageClick");
			self.notGetFailRewardButton.J.removeClass("switchOn");
			self.getFailRewardButton.J.addClass("switchOn");
			userData.setting.getFailReward = true;
			self.game.user.updateUserData();
		};
	this.notGetFailRewardButton.node.onmouseup
		= this.notGetFailRewardButton.node.ontouchend = function (){
			audio.play("stageClick");
			self.getFailRewardButton.J.removeClass("switchOn");
			self.notGetFailRewardButton.J.addClass("switchOn");
			userData.setting.getFailReward = false;
			self.game.user.updateUserData();
		};

	this.resetButton.node.onmouseup
		=this.resetButton.node.ontouchend = function ()
	{
		audio.play("buttonClick");
		self.resetPopupWindow.J.fadeIn();
	}
	this.resetPopupWindow.agreeButton.node.onmouseup
		= this.resetPopupWindow.agreeButton.node.ontouchend = function ()
	{
		audio.play("buttonClick");
		delete localStorage.dontShowHint;
		self.game.user.newUserData();
		self.resetPopupWindow.J.fadeOut();
		self.screen.showMainMenu();
		Network.showMessage("游戏数据已经重置，现在刷新页面可以取消重置状态");
	}
	this.resetPopupWindow.cancelButton.node.onmouseup
		= this.resetPopupWindow.cancelButton.node.ontouchend = function ()
	{
		audio.play("buttonClick");
		self.resetPopupWindow.J.fadeOut();
	}
	this.changeUserButton.node.onmouseup
		=this.changeUserButton.node.ontouchend = function ()
	{
		audio.play("buttonClick");
		self.screen.game.showLoginPage();
		$("#loginCancelButton")[0].ontouchend
			= $("#loginCancelButton")[0].onmouseup = function ()
		{
			audio.play("buttonClick");
			$("#loginPage").fadeOut("fast");
		}
	}
	
	this.node.ontouchstart
		= this.node.ontouchmove
		= this.node.ontouchend = function (e){
			e.preventDefault();
		}

}
SystemPage.prototype.show = function (){
	this.skipStorySwitch.J.show();
	this.J.fadeIn("fast");
}
SystemPage.prototype.showChangeUserWindow = function (){

	$("#loginCancelButton")[0].ontouchend
		= $("#loginCancelButton")[0].onmouseup = function ()
	{
		audio.play("buttonClick");
		loginPage.J.fadeOut("fast");
	}
}

SystemPage.prototype.hide = function (){
	this.J.fadeOut('fast');
}