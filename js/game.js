//*************************
//Aria the Summoner
//*************************
//here is a test
var Game = Class.sub();
Game.prototype._init = function (){
    this.stageStarted = false;
		this.user = new User(this);
		this.db = new MainDataBase();
}
Game.prototype.start = function (){
    //alert(navigator.userAgent);
    if(navigator.userAgent.indexOf("Android") > -1 ){
				Static.androidUser = true;
				Static.mobileUser = true;
    }
    if(navigator.userAgent.indexOf("iPad") > -1){
				Static.iPadUser = true;
				Static.mobileUser = true;
    }
		if (!Static.mobileUser){
				$(".screen").css("top","30px");
				$(".screen").css("margin-bottom","40px");
				Desktop.initExtraBox();
				$(".desktopExtraBox").show();
		}else{

				audio.play = function(){};
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
    //this.mainScreen.showChallenge();
		this.initUserData();
    this.mainScreen.showMainMenu();
    /*
      this.mainScreen.showWinPage("waterField3",{cleared:true,
      score:10000,
      time:200,
      });
    */
    //this.mainScreen.showEquip();
    //this.mainScreen.showChallengeResultPage("waterChallenge",{cleared:true,
    //										  score:200,
    //										 time:400
    //										});
    //this.mainScreen.showWinPage(null,{time:1000,score:3000});
    
    //$("#canvasScreen").show();
    //this.startStage("testStage");
}
Game.prototype.initUserData = function (){
		//this.user.newClearData();
		//console.log(this.user.getUserData());
		var self = this
    if (!this.user.getUserData(true,null)){
				//show new user login page
				$("#waitPage").fadeOut(null,function (){
						self.user.newUserData();
						localStorage.dataUpdateTime = 1;
						self.showLoginPage();
				})
		}else{
				$("#waitPage").fadeOut(null,function (){
						Network.showMessage("欢迎回来，"+self.user.getUserData().userName);
				})
		}
}
Game.prototype.startStage = function (stageName){
    this.handleScreenSize();
    this.user.getUserData().continueStage = stageName;
    this.user.updateUserData(true);
    this.stage = new Stage(stageName,this);
    console.log("startStage");
    //console.log("screenSize:"this.stage.screenSize);
    this.stage.start();
}
Game.prototype.restartStage = function (stageName){
    this.canvasScreen.J.hide();
    this.startStage(stageName);
}
Game.prototype.endStage = function (stageName,stageResult){
    var stageData = this.db.stage.getDataByName(stageName);
		var self = this;
    this.canvasScreen.J.fadeOut('slow',function (){
				var userData = self.user.getUserData();
				if(stageResult.exit){
						//exit stage
						userData.highScore[stageData.stageNo] = -1;
						self.user.updateUserData(true);
						if(stageData.challenge){
								self.mainScreen.showChallenge();
						}else{
								self.mainScreen.showMap();
						}
						return;
				}
				var stageInfo = self.db.stage.getDataByName(stageName);
				if(stageData.challenge){
						//challenge resault
						self.mainScreen.showChallengeResultPage(stageName,stageResult);
						delete userData.continueStage;
						delete userData.shownStory;
						self.user.updateUserData(true);
						return;
				}
				if(stageResult.cleared){
						//story stage clear
						//Win Page will update userdata
						self.mainScreen.showWinPage(stageName,stageResult);
						delete userData.continueStage;
						delete userData.shownStory;
						return;
				}else{
						//story stage fail
						self.user.updateUserData(true);
						userData.continueStage = stageName;
						self.mainScreen.showLosePage(stageName,stageResult);
				}
		});
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

		$("#desktopExtraBoxRight").css('right',this.screenSize.width/2 - 270 - 300);	
		$("#desktopExtraBoxLeft").css('left',this.screenSize.width/2 - 270 - 300);

		// $("#desktopExtraBoxLeft").css('left',350);
		// $("#desktopExtraBoxRight").css('right',350);
    //Static.androidUser = true;
    if(Static.androidUser || Static.iPadUser){
				$("body").width(this.screenSize.width);
				$("body").height(this.screenSize.height);
				$(".screen").width(this.screenSize.width);
				$(".screen").height(this.screenSize.height);
				$("#canvas")[0].width = this.screenSize.width;
				$("#canvas")[0].height = this.screenSize.height;
				$("#uiCanvas")[0].width = this.screenSize.width;
				$("#uiCanvas")[0].height = this.screenSize.height;
				$("#bgCanvas")[0].width = this.screenSize.width;
				$("#bgCanvas")[0].height = this.screenSize.height;
				$("#networkMessageBox")[0].width = this.screenSize.width;

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
Game.prototype.showLoginPage = function (){
		var loginPage = {
				J:$("#loginPage"),
				node:$("#loginPage")[0]
		};
		var loginBox = {
				J:$("#loginBox"),
				node:$("#loginBox")[0],
		}
		loginBox.J.width($("#mainScreen").width()*0.85);

		if (localStorage.uuid){
				showLoginHint("当前用户："+this.user.getUserData().userName);
		}
		var self = this;
		$("#loginCancelButton")[0].ontouchend
				= $("#loginCancelButton")[0].onmouseup = function ()
		{
				audio.play("buttonClick");
				showLoginHint("抱歉，你得先登录～",true);
				//Network.showMessage("抱歉，你得先登录～");
		}
		$("#registButton")[0].ontouchend
				= $("#registButton")[0].onmouseup = function ()
		{
				audio.play("buttonClick");
				var username = $("#usernameInput").val();
				var password = $("#passwordInput").val();
				if (!username){
						showLoginHint("请输入用户名",true);
						return;
				}
				if (username.length > 30){
						showLoginHint("用户名太长了",true);
						return;
				}
				if (password && password.length > 30){
						showLoginHint("密码太长了",true);
						return;
				}
				showLoginHint("请稍等..",false,true);
				if (self.user.userData){
						self.user.userData.userName = username;
				}
				if (!localStorage.uuid){
						var dataJStr = JSON.stringify(self.user.userData);			
				}else{
						var dataJStr = JSON.stringify(self.user.newUserData());
				}
				Network.regist(username,password,dataJStr,function (){
						delete localStorage.dontShowHint;
						if (self.user.userData.clearedStageNo > -1){
								Network.showMessage("检测到游戏数据，上传到服务器");
						}
						self.user.updateUserData(true);

						$("#loginPage").fadeOut("fast");
						self.mainScreen.showMainMenu();
						//self = null;
				});
		}
		$("#loginButton")[0].ontouchend
				= $("#loginButton")[0].onmouseup = function ()
		{
				audio.play("buttonClick");
				var username = $("#usernameInput").val();
				var password = $("#passwordInput").val();
				if (!username){
						showLoginHint("请输入用户名",true);
						return;
				}
				if (username.length > 30){
						showLoginHint("用户名太长了",true);
						return;
				}
				if (password && password.length > 30){
						showLoginHint("密码太长了",true);
						return;
				}
				showLoginHint("请稍等..",false);
				Network.login(username,password,function (){
						localStorage.dontShowHint = false;
						delete localStorage.dontShowHint;
						self.user.getUserData(true)
						
						Network.showMessage("欢迎回来，"+self.user.getUserData().userName);
						$("#loginPage").fadeOut("fast");
						self.mainScreen.showMainMenu();
						self = null;
				});
		}
		function showLoginHint(message,isAlert,isProcessing){
				if (isAlert){
						$("#loginBoxHint").addClass('loginBoxError');				
				}else{
						$("#loginBoxHint").removeClass('loginBoxError');
				}
				$("#loginBoxHint").html(message);
		}
		loginPage.J.fadeIn("fast");
}
