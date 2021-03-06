var EquipPage = PageDiv.sub();
EquipPage.prototype._init = function (screen){
	this.changed = false;
	this.game = screen.game;
	this.returnPage = "map"
	EquipPage.parent.call(this,"equipPage",screen,{class:"page"});
	this.screen = screen;
	this.screenSize = screen.screenSize;
	
	this.initSlide();

	this.elves = {};
	this.towers = {};
	this.activeTowers = {num:0};
	this.activeElves = {num:0};
	this.availElvesBox = new PageDiv("availElvesBox",this);
	this.availTowersBox = new PageDiv("availTowersBox",this);
	
	this.infoBox = new PageDiv("equipInfoBox",this);
	this.infoBox.button = new PageButton("equipInfoBoxButton",this.infoBox);
	this.infoBox.text = new PageElement("p","equipInfoText",this.infoBox);
	this.infoBox.magicBox = new PageDiv("equipMagicBox",this.infoBox);

	this.infoBox.J.hide();
	
	this.extraButtonBox = new PageDiv("extraButtonBox",this.screen,{class:"extraButtonBox"});
	this.returnButton = new PageButton("equipPageReturnButton",this.extraButtonBox,{text:"Return"});
	var self = this;
	this.returnButton.node.ontouchend
		= this.returnButton.node.onmouseup
		= function (){
			audio.play("buttonClick");
		self.registEquip();
		//self.game.user.updateUserData(true);
		if(self.returnPage == "map"){
			screen.showMap();
		}else{
			screen.showChallenge();
		}
	}
	
	var userData = this.game.user.getUserData();
	for (var i = 0; i < userData.availTowers.length; i++){
		var towerName = userData.availTowers[i];
		this.activeTowers[towerName] = false;
		var towerIcon = new PageDiv(towerName+"Icon",this.availTowersBox,
									{class:"equipPageTowerIcon"});
		towerIcon.name = towerName;
		this.initTowerIcon(towerIcon);
		this.towers[towerName] = towerIcon;
		
	}
	for (var i = 0; i < userData.availElves.length; i++){
		var elfName = userData.availElves[i];
		this.activeElves[elfName] = false;
		var elfIcon = new PageDiv(elfName+"Icon",this.availElvesBox,
								  {class:"equipPageElfIcon"});
		elfIcon.name = elfName;
		this.initElfIcon(elfIcon);
		this.elves[elfName] = elfIcon;
	}
	for (var i = 0; i < userData.towers.length; i++){
		var towerName = userData.towers[i];
		this.activeTowers[towerName] = true;
		this.activeTowers.num++;
		this.towers[towerName].equipedMark.J.show();
	}
	for (var i = 0; i < userData.elves.length; i++){
		var elfName = userData.elves[i];
		this.activeElves[elfName] = true;;
		this.activeElves.num++;
		this.elves[elfName].equipedMark.J.show();
	}
	//console.log(this.activeElves,this.activeTowers);

}
EquipPage.prototype.initSlide = function (){
	var self = this;
	this.defaultTop = 0;
	this.pageHeight = 960;
	this.pageWidth = this.J.width();
	
	this.node.ontouchmove = function (e){
		e.preventDefault();
		var touch = e.touches[0];
		if(self.touchStartData){
			var newX = -self.touchStartData.x + touch.pageX;
			var newY = -self.touchStartData.y + touch.pageY;
			if(newX <=0 && -newX + self.screenSize.width <= self.pageWidth){

				//self.node.style.left = newX + "px";
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
		//e.preventDefault();
		delete self.touchStartData;
	}
	this.node.onmousemove = function (e){
		//e.preventDefault();
		if(self.mouseStartData){
			var newX = -self.mouseStartData.x + e.pageX;
			var newY = -self.mouseStartData.y + e.pageY;
			if(newX <=0 && -newX + $(".screen").width() <= self.pageWidth){
				//self.node.style.left = newX + "px";
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
EquipPage.prototype.registEquip = function (){
	var elves = [];
	for(var name in this.activeElves){
		if(name == "num")
			continue;
		if(this.activeElves[name])
			elves.push(name);
	}
	var towers = [];
	for(var name in this.activeTowers){
		if(name == "num")
			continue;
		
		if(this.activeTowers[name] == true)
			towers.push(name);
	}
	var userData = this.game.user.getUserData();
	userData.elves = elves;
	userData.towers = towers;
	if (this.changed){
		this.game.user.updateUserData();		
	}
	console.log(userData);
}
EquipPage.prototype.show = function (returnPage){
	//this.J.show();
	this.returnPage = returnPage;
	this.J.fadeIn("fast");
}
EquipPage.prototype.initTowerIcon = function (towerIcon){
	var towerData = this.game.db.tower.getDataByName(towerIcon.name);	
	towerIcon.img = new PageElement("img",towerIcon.name+"Img",
									towerIcon,
									{class:"equipPageTowerImg"});
	towerIcon.img.node.src = towerData.buttonPic.src;
	towerIcon.costText = new PageElement("p",towerIcon.name+"cost",
										 towerIcon,
										 {class:"equipPageTowerCost",
										  text:towerData.cost.mena});
	towerIcon.equipedMark = new PageElement("img",towerIcon.name+"equipedMark",
											towerIcon,
											{class:"equipPageTowerEquipedMark"});
	towerIcon.equipedMark.node.src = img.towerEquipedMark.src;
	towerIcon.equipedMark.J.hide();
	
	var self = this;
	towerIcon.node.ontouchend
		= towerIcon.node.onmouseup
		= function (){
		audio.play("buttonClick");
		self.showTowerInfo(towerIcon);
	};
}
EquipPage.prototype.initElfIcon = function (elfIcon){
	var elfData = this.game.db.elf.getDataByName(elfIcon.name);
	elfIcon.img = new PageElement("img",elfIcon.name+"Img",
								  elfIcon,
								  {class:"equipPageElfImg"});
	elfIcon.img.node.src = elfData.buttonPic.src;
	elfIcon.equipedMark = new PageElement("img",elfIcon.name+"equipedMark",
										  elfIcon,
										  {class:"equipPageElfEquipedMark"});
	elfIcon.equipedMark.node.src = img.elfEquipedMark.src;
	
	elfIcon.equipedMark.J.hide();
	var self = this;
	elfIcon.node.ontouchend
		= elfIcon.node.onmouseup= function (){
		audio.play("buttonClick");
		self.showElfInfo(elfIcon);
	};
}
EquipPage.prototype.showTowerInfo = function (towerIcon){
	this.infoBox.J.hide();
	this.infoBox.magicBox.J.hide();
	var towerData = this.game.db.tower.getDataByName(towerIcon.name);
	var text = towerData.intro.name + "</br>"
		+ towerData.intro.text + "</br>"
		+"基础攻击 : "+ towerData.damage + "</br>"
		+"攻击间隔 : "+towerData.attackDelay + "</br>"
		+"最小攻击间隔 : "+towerData.minAttackDelay + "</br>"
		+"锁定距离 : "+towerData.range;

	this.infoBox.text.J.html(text);

	if(this.activeTowers[towerIcon.name]){
		this.setInfoBoxButton("equiped");
		towerIcon.equipedMark.J.show();
	}else{
		if(this.activeTowers.num >= 3){
			this.setInfoBoxButton("unavail");
			towerIcon.equipedMark.J.hide();
		}else{
			this.setInfoBoxButton("unequiped");
			towerIcon.equipedMark.J.hide();
		}
	}
	var self = this;
	this.infoBox.button.node.onclick = function (){
		audio.play("buttonClick");
		self.changed = true;
		self.equipTower(towerIcon);
	}
	this.infoBox.J.slideDown("fast");
	
}
EquipPage.prototype.showElfInfo = function (elfIcon){
	this.infoBox.J.hide();
	this.infoBox.magicBox.J.html("");
	var elfData = this.game.db.elf.getDataByName(elfIcon.name);
	var userData = this.game.user.getUserData();
	var text = elfData.intro.name + "</br>"
		+ elfData.intro.text + "</br>"
		+"精灵属性:</br>"
		+"基础攻击 : "+ elfData.damage + " ; "
		+"攻击间隔 : "+elfData.attackDelay + " ; "
		+"锁定距离 : "+elfData.range + " ; "
		+"升级成长 : "+elfData.grow+"</br>"
		+"辅助能力:</br>";
	if(elfData.buff.damage)
		text += "伤害倍率 : "+ elfData.buff.damage+" ; ";
	if(elfData.buff.speed)
		text += "速度倍率 : "+ elfData.buff.speed+" ; ";
	if(elfData.buff.range)
		text += "范围提升 : " + elfData.buff.range+" ; ";
	this.infoBox.text.J.html(text);
	var availSpellData = userData.spell[elfIcon.name];
	if(availSpellData && availSpellData.length > 0){
		for(var i = 0 ; i < availSpellData.length ; i++){
			var spellName = availSpellData[i];
			var spellData = elfData.spell[spellName];
			var spellBox = new PageDiv("equipInfoSpellBox"+spellName,this.infoBox.magicBox,{class:"equipSpellBox"});
			var spellIcon = new PageElement("img","spellIcon"+spellName,spellBox,{class:"equipSpellIcon"});
			spellIcon.text = new PageElement("p","spellIconCost"+spellName,spellBox,{class:"spellIconCost",text:spellData.cost.mena});
			
			spellIcon.J[0].src = spellData.pic.src;

			
			var spellIntroText = spellData.intro.name + "</br>"
				+spellData.intro.text + "</br>";
			if(spellData.type == "attack"){
				if(spellData.attackType == "circle"){
					spellIntroText += "基础伤害 : "
						+ spellData.damage + " x " + spellData.repeat + " ; "
						+ "作用范围 : " + spellData.spellRange + " ; "
						+ "升级成长 : " + spellData.grow + " ; ";
					if(spellData.directional == true){
						spellIntroText += "施放距离 : "+spellData.castRange + "</br>";
					}
				}else{
					//line
					spellIntroText += "基础伤害 : "
						+ spellData.damage + " x " + spellData.repeat + " ; "
						+ "升级成长 : " + spellData.grow + " ; ";
				}
			}else{
				if(spellData.buffDamage){
					spellIntroText +="伤害倍率 : "
						+spellData.buffDamage + " ; ";
				}
				if(spellData.buffSpeed){
					spellIntroText +="速度倍率 : "
						+spellData.buffSpeed+" ; ";
				}
				if(spellData.buffRange){
					spellIntroText +="范围提升 : "
						+ spellData.buffRange+" ; ";
				}
				
			}
			var spellIntro = new PageElement("p","equipSpellIntro"+spellName,spellBox,{class:"equipSpellIntro",text:spellIntroText});
		}
		this.infoBox.magicBox.J.show();
	}
	
	if(this.activeElves[elfIcon.name]){
		elfIcon.equipedMark.J.show();
		this.setInfoBoxButton("equiped");
	}else{
		if(this.activeElves.num >= 3){
			elfIcon.equipedMark.J.hide();
			this.setInfoBoxButton("unavail");
		}else{
			elfIcon.equipedMark.J.hide();
			this.setInfoBoxButton("unequiped");
		}
	}
	var self = this;
	this.infoBox.button.node.onmouseup
		= this.infoBox.button.node.ontouchend
		=  function (){
			audio.play('buttonClick');
			self.changed = true;
			self.equipElf(elfIcon);
	}

	this.infoBox.J.slideDown("fast");
}
EquipPage.prototype.setInfoBoxButton = function (type){
	switch(type){
	case "equiped" :
		this.infoBox.button.J.html("已装备");
		this.infoBox.button.J.addClass("equipedEquipButton");
		break;
	case "unequiped" :
		this.infoBox.button.J.removeClass("equipedEquipButton");
		this.infoBox.button.J.html("未装备");
		break;
	case "unavail" :
		this.infoBox.button.J.removeClass("equipedEquipButton");
		this.infoBox.button.J.html("装备已满");
		break;
	}
}
EquipPage.prototype.equipElf = function (elfIcon){
	var elfName = elfIcon.name;
	console.log(elfIcon.name)
	if(this.activeElves[elfName] == true){
		this.activeElves[elfName] = false;
		this.activeElves.num --;
		elfIcon.equipedMark.J.hide();
		this.setInfoBoxButton("unequiped");
		return;
	}
	if(this.activeElves.num >= 3){
		return false;
	}else{
		this.activeElves[elfName] = true;
		this.activeElves.num ++;
		elfIcon.equipedMark.J.show();
		this.setInfoBoxButton("equiped");
	}
}
EquipPage.prototype.equipTower = function (towerIcon){
	var towerName = towerIcon.name;
	if(this.activeTowers[towerName] == true){
		this.activeTowers[towerName] = false;
		this.activeTowers.num --;
		towerIcon.equipedMark.J.hide();
		this.setInfoBoxButton("unequiped");
		return;
	}
	if(this.activeTowers.num >= 3){
		return false;
	}else{
		this.activeTowers[towerName] = true;
		this.activeTowers.num ++;
		towerIcon.equipedMark.J.show();
		this.setInfoBoxButton("equiped");
	}
}
EquipPage.prototype.hide = function (){
	this.J.fadeOut("fast");
}