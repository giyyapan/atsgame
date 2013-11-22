var MainPage = PageDiv.sub();
MainPage.prototype._init = function (screen){
	MainPage.parent.call(this,"mainPage",screen,{class:"page"});
	this.screen = screen;
	this.game = screen.game;
	var	userData = this.game.user.getUserData();

	this.title = new PageElement("h1","mainTitle",this,{text:"Tower Defense"});
	this.title2 = new PageElement("h2","mainTitle2",this,{text:"Aria the Summoner"});
	this.title2 = new PageElement("h3","mainTitle3",this,{text:"召唤师艾莉娅"});
	this.buttonList = new PageDiv("mainButtonList",this,{class:"buttonList"});

	this.node.ontouchstart
		= this.node.ontouchmove
		= this.node.ontouchend = function (e){
		e.preventDefault();
		}

	var self = this;
	if(typeof userData.continueStage != "undefined"){
		this.continueButton = new PageButton("continueButton",this.buttonList,{text:"Continue"});
		this.continueButton.node.onmouseup = this.continueButton.node.ontouchend = function (){
			self.screen.startStage(userData.continueStage);
		}
	}
	this.startButton = new PageButton("startButton",this.buttonList,{text:"Start"});
	this.challengeButton = new PageButton("chalengeButton",this.buttonList,{text:"Challenge"});
	//this.chalengeButton.J.hide();
	
	this.systemButton = new PageButton("systemButton",this.buttonList,{text:"System"});

	this.changeNameWindow = new PageDiv("challengeResultChangeNameWindow",this,{class:"normalPopupWindow"});
	this.changeNameWindow.title = new PageElement("h3","changeNameWindowTitle",this.changeNameWindow,{text:"请输入新的名字"});
	this.changeNameWindow.input = new PageElement("input","changeNameWindowInput",this.changeNameWindow,{type:"text"});
	this.changeNameWindow.cancelButton = new PageButton("changeNameWindowCancleButton",this.changeNameWindow,{class:"pageButton_left",text:"取消"});
	this.changeNameWindow.agreeButton = new PageButton("changeNameWindowAgreeButton",this.changeNameWindow,{class:"pageButton_right",text:"确认"});
	this.changeNameWindow.J.hide();

	this.startButton.node.onmouseup
		= this.startButton.node.ontouchend = function (){
			audio.play("buttonClick");
			self.screen.showMap();
	}
	this.systemButton.node.onmouseup
		= this.systemButton.node.ontouchend =  function (){
			audio.play("buttonClick");
		self.screen.showSystem();
	}
	this.challengeButton.node.onmouseup
		= this.challengeButton.node.ontouchend = function (){
			audio.play("buttonClick");
		self.screen.showChallenge();
		//self.screen.startStage("challengeStage1");
	}
	this.changeNameWindow.cancelButton.node.onmouseup
		= this.changeNameWindow.cancelButton.node.ontouchend =  function (){
			audio.play("buttonClick");
			self.changeNameWindow.input.node.value = "";
			self.changeNameWindow.J.fadeOut("fast");
		}
	this.changeNameWindow.agreeButton.node.onmouseup
		= this.changeNameWindow.agreeButton.node.ontouchend =  function (){
			audio.play("buttonClick");
			var newName = self.changeNameWindow.input.node.value;
			//self.changeUserName(self.changeNameWindow.input.node.value);
			self.changeNameWindow.title.node.innerHtml = "提交中...";
			this.game.user.setNewUserName(newName,function (){
				self.changeNameWindow.J.fadeOut("fast");				
			})
		}

}
MainPage.prototype.setNewUserName = function (){
	self.changeNameWindow.J.fadeIn("fast");	
};
MainPage.prototype.show = function (){
	var self = this;
	this.buttonList.J.hide();
	this.J.fadeIn("fast")
	this.buttonList.J.slideDown("fast");
}
MainPage.prototype.hide = function (){
	//this.buttonList.J.slideUp();
	//this.J.hide();
	this.J.fadeOut("fast");
}
