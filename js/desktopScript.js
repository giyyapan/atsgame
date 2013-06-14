var Desktop = {
	soundSwitch:{
		J:$("#soundSwitch"),
		node:$("#soundSwitch")[0]
	},
	helpButton:{
		J:$("#helpButton"),
		node:$("#helpButton")[0]
	},
	shareButton:{
		J:$("#shareButton"),
		node:$("#shareButton")[0]
	},
	aboutButton:{
		J:$("#aboutButton"),
		node:$("#aboutButton")[0]
	},
	shareBox:{
		J:$("#shareBox"),
		node:$("#shareBox")[0],
		show:false,
	},
	extraPage:{
		J:$("#extraPage"),
		node:$("#extraPage")[0]
	},
	extraPageCloseButton:{
		J:$("#extraPageCloseButton"),
		node:$("#extraPageCloseButton")[0]
	},
	helpBox:{
		J:$("#helpBox"),
		node:$("#helpBox")[0]
	},
	aboutBox:{
		J:$("#aboutBox"),
		node:$("#aboutBox")[0]
	},
	hintBox:{
		J:$("#hintBox"),
		node:$("#hintBox")[0],
	}
};
Desktop.initExtraBox = function (){
	this.shareBox.J.hide();
	if(localStorage.dontShowHint){
		this.hintBox.J.hide();
	}
	var self = this;
	this.soundSwitch.node.onmouseup = function (){
		console.log('soundswicth click')
		if (Static.musicOn){
			audio.soundOff();
			Static.musicOn = false;
			self.soundSwitch.J.addClass('switchOff');
		}else{
			Static.musicOn = true;
			audio.soundOn();
			self.soundSwitch.J.removeClass('switchOff');
			audio.play('buttonClick');		
		}
		console.log(Static)
	}
	this.soundSwitch.node.onmousedown = function (){
		audio.play('buttonClick');		
	}
	this.helpButton.node.onmouseup = function (){
		self.helpBox.J.show();
		self.aboutBox.J.hide();
		self.extraPage.J.fadeIn("fast");
	}
	this.helpButton.node.onmousedown = function (){
		audio.play('buttonClick');		
	}

	this.shareButton.node.onmouseup = function (){
		if (self.shareBox.show){
			self.shareBox.J.slideUp('fast');
			self.shareBox.show = false;
		}else{
			self.shareBox.J.slideDown('fast');
			self.shareBox.show = true;
		}
	}
	this.shareButton.node.onmousedown = function (){
		audio.play('buttonClick');		
	}
	this.aboutButton.node.onmouseup = function (){
		self.aboutBox.J.show();
		self.helpBox.J.hide();
		self.extraPage.J.fadeIn("fast");
	}
	this.aboutButton.node.onmousedown = function (){
		audio.play('buttonClick');				
	}
	this.extraPageCloseButton.node.onmouseup = function (){
		self.extraPage.J.fadeOut("fast");
	}
	this.extraPageCloseButton.node.onmousedown =function (){
		audio.play('buttonClick');				
	}
	$("#hintBoxCloseButton")[0].onmouseup = function (){
		audio.play("stageClick");
		localStorage.dontShowHint = true;
		self.hintBox.J.fadeOut("fast");
	}
}