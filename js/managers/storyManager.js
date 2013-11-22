var StoryManager = Class.sub();
StoryManager.prototype._init = function (game,stageName,screenSize,eventHandler){
	this.game = game;
	var stageData = game.db.stage.getDataByName(stageName)
	var userData = game.user.getUserData();
	if(userData.clearedStageNo > stageData.stageNo){
		console.log(userData.clearedStageNo);
		console.log("cleared! skipStory")
		if(userData.setting.skipClearedStory){
			this.tick = function (){}
			return;
		}
	}
	this.box = {
		J:$("#canvasStoryBox"),
		node:document.getElementById("canvasStoryBox"),
	}
	this.textArea = {
		J:$("#canvasStoryText"),
		node:document.getElementById("canvasStoryText"),
	}
	this.charaPic = {
		J:$("#canvasStoryCharaPic"),
		node:document.getElementById("canvasStoryCharaPic"),
	}

	//this.charaPic.node.width = 147;
	//this.charaPic.node.height = 130;
	this.continueHint = new PageElement("p","canvasStoryContinueHint",this.box,{text:"[点击以继续]"})
	
	if(userData.shownStory >= 0 && userData.setting.skipClearedStory){
		this.shownStory = userData.shownStory;
	}else{
		this.shownStory = -1;
	}
	this.onClearStory = false;
	this.storyTimer = 0;
	this.textTimer = -1;
	this.storyShown = false;
	
	if(! this.game.db.story.getDataByName(stageName)){
		this.tick = function (){};
		return;
	}


	this.storyData = this.game.db.story.getDataByName(stageName).instage;
	if(!this.storyData){
		this.tick = function (){};
		return;
	}
	var self = this;
	this.box.node.ontouchend
		= this.box.node.onmouseup
		= function (e){
			audio.play("stageClick");
			e.preventDefault();
			self.nextStoryText(eventHandler);		
		}
	this.box.node.ontouchmove = function (e){
		e.preventDefault();
	}
	this.box.node.ontouchstart = function (e){
		e.preventDefault();
	}
}
StoryManager.prototype.tick = function (eventHandler){
	var nowWave = eventHandler.listen("waveNum").now;
	if(this.storyShown){
		eventHandler.remove("touch");
		eventHandler.regist("clearTouch");
	}
	if(nowWave == this.storyTimer){
		if(this.storyData[nowWave]){
			if(this.storyTimer > this.shownStory){
				this.shownStory = this.storyTimer;
				this.game.user.getUserData().shownStory = this.shownStory;
				//this.game.user.updateUserData();

				this.box.J.fadeIn("fast");
				var nowTime = eventHandler.listen("time");
				eventHandler.regist("pause",{time:nowTime});
				audio.setVolume(eventHandler.listen('battleBgm'),0.35);
				audio.setVolume('bossBgm',0.35);
				this.nowStory = this.storyData[nowWave];
				this.textTimer = -1;
				this.nextStoryText(eventHandler);
			}
		}
		this.storyTimer++;
	}
	var endStageResult = eventHandler.listen("endStage")
	if(endStageResult && endStageResult.cleared){
		if(!this.storyData.clear)
			return;
		if(this.onClearStory){
			return;
		}
		eventHandler.remove("touch");
		eventHandler.regist("clearTouch");
		this.onClearStory = true;
		this.box.J.fadeIn("fast");
		var nowTime = eventHandler.listen("time");
		eventHandler.regist("pause",{time:nowTime});
		this.nowStory = this.storyData.clear;
		audio.stopAll();
		audio.play('victoryBgm');
		this.textTimer = -1;
		this.nextStoryText(eventHandler);
	}
}
StoryManager.prototype.nextStoryText = function (eventHandler){
	this.storyShown = true;
	this.textTimer ++;
	this.charaPic.J.hide();
	var story = this.nowStory[this.textTimer];
	if(story){
		if (story.stopAllSound){
			audio.stopAll();
		}
		if (story.sound){
			if (story.sound.indexOf('Bgm')>-1){
				audio.stopAll();
			}
			audio.play(story.sound);
			audio.setVolume(story.sound,1);
		}
		var text = story.text;
		
		if(story.chara == "sys"){
			this.textArea.J.addClass("tutorialText");
		}else{
			this.textArea.J.removeClass("tutorialText")
			if(story.chara){
			var picImage = this.game.db.chara.getDataByName(story.chara);
				if(picImage){
					this.charaPic.node.src = picImage.src;
					if(story.chara == "Aria"){
						this.charaPic.J.addClass("summonerPic");
					}else{
						this.charaPic.J.removeClass("summonerPic");
					}
					this.charaPic.J.show()
				}
				text = story.chara + ":</br>" + story.text;
			}
		}
		this.textArea.J.html(text);
	}else{
		audio.setVolume(eventHandler.listen('battleBgm'),1);
		audio.setVolume('bossBgm',1);
		this.box.J.fadeOut("fast");
		this.storyShown = false;
		eventHandler.remove("pause");
	}
}




