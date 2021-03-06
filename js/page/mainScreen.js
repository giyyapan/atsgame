var CanvasScreen = Class.sub();
CanvasScreen.prototype._init = function (game){
    this.game = game;
    this.J = $("#canvasScreen");
}
var MainScreen = Class.sub();
MainScreen.prototype._init = function (game){
    this.game = game;
    this.J = $("#mainScreen");
    this.node = this.J[0];
	this.magicCircleShown = false;	
    
    this.magicCircle1 = new PageElement("img","mainScreenMagicCircle1",this);
    this.magicCircle1.node.src = img.mainPageMagicCircle.src;
    this.magicCircle2 = new PageElement("img","mainScreenMagicCircle2",this);
    this.magicCircle2.node.src = img.mainPageMagicCircle.src;
	if(Static.mobileUser){
		$("#mainScreenMagicCircle2")[0].style.bottom = "-460px";			
	}
    
    this.screenSize = game.screenSize;
}
MainScreen.prototype.setNewUserName = function(callback){
	if (!this.mainPage){
		return;
	}
	this.mainPage.setNewUserName(callback);
}
MainScreen.prototype.startStage = function (stageName){
	audio.stop("titleBgm");
	var self = this;
	this.hidePages();
    this.hide(function (){
		console.log(stageName);
		self.game.startStage(stageName);
		//$("#canvasScreen").show();
		self = null;
	});
}
MainScreen.prototype.show = function (){
	audio.play("titleBgm");
    //this.J.show();
	this.showMagicCircle();
    this.J.fadeIn("fast")
}
MainScreen.prototype.hide = function (callback){
    //this.J.hide();
	this.hideMagicCircle();
    this.J.fadeOut("fast",callback)
}
MainScreen.prototype.showMainMenu = function (){
	console.log('show main menu');
    this.show();
	var self = this;
    this.hidePages(function (){
		self.mainPage = new MainPage(self);
		self.mainPage.show();
		self.animateMagicCircle();
		self = null;
	});
}
MainScreen.prototype.showStory = function (storyName){
    this.show();
	var self = this;
    this.hidePages(function (){
		var storyData = this.game.db.story.getDataByName(storyName);
		self.storyPage = new StoryPage(self,storyData);
		self.storyPage.show();
		self = null;
	});
}
MainScreen.prototype.showChallenge = function (){
    this.show();
	var self = this;
    this.hidePages(function (){
		if(Static.iPadUser){
			self.hideMagicCircle();
		}
		self.challengePage = new ChallengePage(self);
		self.challengePage.show();
		self = null;
	});
}
MainScreen.prototype.showSystem = function (){
    this.show();
	var self = this;
    this.hidePages(function (){
		self.systemPage = new SystemPage(self);
		self.systemPage.show();
		self = null;
	});
}
MainScreen.prototype.showMap = function (){
    this.show();
	var self = this;
    this.hidePages(function (){
		self.hideMagicCircle();
		self.mapPage = new MapPage(self);
		self.mapPage.show();
		self = null;
	});
}
MainScreen.prototype.showEquip = function (returnPage){
    this.show();
	var self = this;
    this.hidePages(function (){
		self.equipPage = new EquipPage(self);
		self.equipPage.show(returnPage);
		self = null;
	});
}
MainScreen.prototype.showMagicCircle = function (){
	this.magicCircleShown = true;
	this.magicCircle1.J.show();
    this.magicCircle2.J.show();
}
MainScreen.prototype.animateMagicCircle = function (){
	this.magicCircle1.J.addClass('animate');
	this.magicCircle2.J.addClass('animate');
}
MainScreen.prototype.stopMagicCircle = function (){
	this.magicCircle1.J.removeClass('animate');
	this.magicCircle2.J.removeClass('animate');
}
MainScreen.prototype.pageAnimationTick = function (){
	if (!this.magicCircleShown){
		return;
	}
	this.magicCircle1.deg -= 0.5;
	this.magicCircle2.deg += 0.5;
	if (this.magicCircle1.deg < 360){
		this.magicCircle1.deg += 360;
	}
	if (this.magicCircle2.deg > -360){
		this.magicCircle2.deg -= 360;
	}

	this.magicCircle1.J.css("-webkit-transform","rotate("
							+this.magicCircle1.deg
							+"deg)");
	this.magicCircle1.J.css("-moz-transform","rotate("
							+this.magicCircle1.deg
							+"deg)");
	this.magicCircle2.J.css("-webkit-transform","rotate("
							+this.magicCircle2.deg
							+"deg)");
	this.magicCircle2.J.css("-moz-transform","rotate("
							+this.magicCircle2.deg
							+"deg)");
	var self = this;
	setTimeout(function (){
		self.pageAnimationTick();
	},40);
	return;
	var time = new Date().getTime();
	if (time - this.lastTickTime >=  40){
		this.lastTickTime = time;
		this.magicCircle1.deg += 0.5;
		this.magicCircle2.deg -= 0.5;
		if (this.magicCircle1.deg > 360){
			this.magicCircle1.deg -= 360;
		}
		if (this.magicCircle2.deg < -360){
			this.magicCircle2.deg += 360;
		}

		this.magicCircle1.J.css("-webkit-transform","rotate("
								+this.magicCircle1.deg
								+"deg)");
		this.magicCircle1.J.css("-moz-transform","rotate("
								+this.magicCircle1.deg
								+"deg)");
		this.magicCircle2.J.css("-webkit-transform","rotate("
								+this.magicCircle2.deg
								+"deg)");
		this.magicCircle2.J.css("-moz-transform","rotate("
								+this.magicCircle2.deg
								+"deg)");
	}
	var self = this;
	window.requestAnimationFrame(function (){
		self.pageAnimationTick();
		self = null;
	});
}
MainScreen.prototype.hideMagicCircle = function (){
	this.magicCircleShown = false;
    this.magicCircle1.J.hide();
    this.magicCircle2.J.hide();
}
MainScreen.prototype.hidePages = function (callback){
	if (this.mainPage){
		this.mainPage.hide();
	}
	if (this.mapPage){
		this.mapPage.hide();	
	}
	if (this.challengePage){
		this.challengePage.hide();
	}
	if (this.systemPage){
		this.systemPage.hide();
	}
	if (this.equipPage){
		this.equipPage.hide();
	}
	if (Static.mobileUser){
		//this.stopMagicCircle();
	}
    $(".page").fadeOut("fast");
    $(".extraButtonBox").fadeOut("fast");
	if (typeof callback === 'function'){
		window.setTimeout(function (){
			callback();
		},100);
	}
}
MainScreen.prototype.showWinPage = function (stageName,stageResult){
    console.error("show win  page");
    this.show();
	var self = this;
    this.hidePages(function (){
		self.winPage = new WinPage(stageName,self,stageResult);
		self.winPage.show();
		self = null;
	});
}
MainScreen.prototype.showLosePage = function (stageName,stageResult){
    this.show();
	var self = this;
	this.hidePages(function (){
		self.losepage = new LosePage(stageName,self,stageResult);
		self.losepage.show();
		self = null;
	});
}
MainScreen.prototype.showChallengeResultPage = function (stageName,stageResult){
    this.show();
	var self = this;
    this.hidePages(function (){
		self.challengeResultPage = new ChallengeResultPage(stageName,self,stageResult)
		self.challengeResultPage.show();
		self = null;
	});
}