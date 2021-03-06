var img = {};
(function (){
	var source = {
		//mainPage element
		map:"../img/mainScreenUI/map.gif",
		button_left:"../img/mainScreenUI/button_left.png",
		button_right:"../img/mainScreenUI/button_right.png",
		button_center:"../img/mainScreenUI/button_center.png",
		mapPointCleared:"../img/mainScreenUI/mapPoint_cleared.png",
		mapPointCleared_active:"../img/mainScreenUI/mapPoint_cleared-active.png",
		mapPointLocked:"../img/mainScreenUI/mapPoint_locked.png",
		mapPointLocked_active:"../img/mainScreenUI/mapPoint_locked-active.png",
		mapPointNext:"../img/mainScreenUI/mapPoint_next.png",
		mapPointNext_active:"../img/mainScreenUI/mapPoint_next-active.png",
		mapHeader:"../img/mainScreenUI/mapHeader.png",
		texture:"../img/mainScreenUI/texture.png",
		magicCircle:"../img/mainScreenUI/magicCircle.png",
		mainPageMagicCircle:"../img/mainScreenUI/magicCircle2.png",
		elfEquipedMark:"../img/mainScreenUI/elfEquipedMark.png",
		towerEquipedMark:"../img/mainScreenUI/towerEquipedMark.png",
		losePagePic:"../img/mainScreenUI/losePagePic.gif",
		winTitle:"../img/mainScreenUI/winTitle.gif",
		loseTitle:"../img/mainScreenUI/loseTitle.gif",
		challengeResultTitle:"../img/mainScreenUI/challengeResultTitle.gif",
		//UI
		bg_grassField:"../img/battleFieldUI/bg_grassField.jpg",
		bg_waterField:"../img/battleFieldUI/bg_waterField.jpg",
		bg_fireField:"../img/battleFieldUI/bg_fireField.jpg",
		bg_stoneField:"../img/battleFieldUI/bg_stoneField.jpg",
		bg_thunderField:"../img/battleFieldUI/bg_thunderField.jpg",
		bg_finalField:"../img/battleFieldUI/bg_finalField.jpg",
		headerBar:"../img/battleFieldUI/headerBar.png",
		pauseButtonHover:"../img/battleFieldUI/pauseButtonHover.png",
		pauseButtonPointer:"../img/battleFieldUI/pauseButtonPointer.png",
		menaCostPanel:"../img/battleFieldUI/menaCostPanel.png",
		exitButton:"../img/battleFieldUI/exitButton.png",
		infoPanel:"../img/battleFieldUI/infoPanel.png",
		elfInfoPanel:"../img/battleFieldUI/elfInfoPanel.png",
		cancelButton:"../img/battleFieldUI/cancelButton.png",
		castButton:"../img/battleFieldUI/castButton.png",
		fields:"../img/battleFieldUI/fields.png",
		unavailCellMark:"../img/battleFieldUI/unavailCellMark.png",
		unavailCellMark_light:"../img/battleFieldUI/unavailCellMark_light.png",
		activeBar:"../img/battleFieldUI/activeBar.png",
		statusBox:"../img/battleFieldUI/statusBox.png",
		elfUnavailIcon:"../img/elf/elfUnavailIcon.png",
		elfEnergyBar:"../img/elf/elfEnergyBar.png",
		towerHoverMark:"../img/battleFieldUI/towerHoverMark.png",
		//hint mark
		startMark:"../img/battleFieldUI/startMark.png",
		nextWaveMark:"../img/battleFieldUI/nextWaveMark.png",
		nextLevelMark:"../img/battleFieldUI/nextLevelMark.png",
		clearMark:"../img/battleFieldUI/clearMark.png",
		//spell mark
		attackRangeCircle:"../img/battleFieldUI/attackRangeCircle.png",
		buffRangeCircle:"../img/battleFieldUI/buffRangeCircle.png",
		magicRangeCircle:"../img/battleFieldUI/magicRangeCircle.png",
		normalBuffMark:"../img/battleFieldUI/normalBuffMark.png",
		spellBuffMark:"../img/battleFieldUI/spellBuffMark.png",
		circleAttackSpellMark:"../img/battleFieldUI/circleAttackSpellMark.png",
		lineAttackSpellMark:"../img/battleFieldUI/lineAttackSpellMark.png",
		buffSpellMark:"../img/battleFieldUI/buffSpellMark.png",
		castMark:"../img/battleFieldUI/castMark.png",
		levelupMark:"../img/battleFieldUI/levelupMark.png",
		elfCastingMark:"../img/battleFieldUI/elfCastingMark.png",
		//elves
		elfMap:"../img/elf/elfMap.gif",
		//elf buttons
		waterElfButton:"../img/elf/waterElfButton.png",
		fireElfButton:"../img/elf/fireElfButton.png",
		windElfButton:"../img/elf/windElfButton.png",
		earthElfButton:"../img/elf/earthElfButton.png",
		thunderElfButton:"../img/elf/thunderElfButton.png",
		waterElfPic:"../img/elf/waterElfPic.png",
		fireElfPic:"../img/elf/fireElfPic.png",
		windElfPic:"../img/elf/windElfPic.png",
		earthElfPic:"../img/elf/earthElfPic.png",
		thunderElfPic:"../img/elf/thunderElfPic.png",
		//summoner
		summonerPic:"../img/battleFieldUI/summonerPic.png",
		summonerHurtMark:"../img/battleFieldUI/summonerHurtMark.png",
		summonerMap:"../img/battleFieldUI/summonerMap.png",
		damageMark:"../img/battleFieldUI/damageMark.png",
		//demons
		demonGateMap:"../img/demon/demonGateMap.gif",
		demonMap:"../img/demon/demonMap.gif",
		demonTextBox:"../img/demon/demonTextBox.png",
		finalDestroyMark:"../img/demon/finalDestroyMark.png",
		incomeMark:"../img/demon/incomeMark.png",
		thunderBossPic:"../img/demon/thunderBossPic.gif",
		waterBossPic:"../img/demon/waterBossPic.gif",
		fireBossPic:"../img/demon/fireBossPic.gif",
		earthBossPic:"../img/demon/earthBossPic.gif",
		windBossPic:"../img/demon/windBossPic.gif",
		finalBossPic:"../img/demon/finalBossPic.gif",
		//elf active buttons
		magicButton:"../img/battleFieldUI/magicButton.png",
		magicButton_locked:"../img/battleFieldUI/magicButton_locked.png",
		teleportButton:"../img/battleFieldUI/teleportButton.png",
		levelupButton:"../img/battleFieldUI/levelupButton.png",
		//towers
		normalTower:"../img/tower/normalTower.png",
		waveTower:"../img/tower/waveTower.png",
		laserTower:"../img/tower/laserTower.png",
		spellTower:"../img/tower/spellTower.png",
		heavyNormalTower:"../img/tower/heavyNormalTower.png",
		heavyWaveTower:"../img/tower/heavyWaveTower.png",
		heavyLaserTower:"../img/tower/heavyLaserTower.png",
		heavySpellTower:"../img/tower/heavySpellTower.png",
		//tower buttons
		normalTowerButton:"../img/tower/normalTowerButton.png",
		waveTowerButton:"../img/tower/waveTowerButton.png",
		laserTowerButton:"../img/tower/laserTowerButton.png",
		spellTowerButton:"../img/tower/spellTowerButton.png",
		heavyNormalTowerButton:"../img/tower/heavyNormalTowerButton.png",
		heavyWaveTowerButton:"../img/tower/heavyWaveTowerButton.png",
		heavyLaserTowerButton:"../img/tower/heavyLaserTowerButton.png",
		heavySpellTowerButton:"../img/tower/heavySpellTowerButton.png",
		// tower active buttons
		unsummonButton:"../img/battleFieldUI/unsummonButton.png",
		fireSpring:"../img/battleFieldUI/fireSpring.png",
		earthSpring:"../img/battleFieldUI/earthSpring.png",
		waterSpring:"../img/battleFieldUI/waterSpring.png",
		windSpring:"../img/battleFieldUI/windSpring.png",
		thunderSpring:"../img/battleFieldUI/thunderSpring.png",
		//tower bullet 
		spellTowerBullet:"../img/tower/spellTowerBullet.png",
		thunderElfBullet:"../img/elf/thunderElfBullet.png",
		//demons
		torrentButton:"../img/elf/torrentButton.png",
		rainButton:"../img/elf/rainButton.png",
		giftButton:"../img/elf/giftButton.png",
		//springs
		sacrificeButton:"../img/elf/sacrificeButton.png",
		fireRainButton:"../img/elf/fireRainButton.png",
		hellFireButton:"../img/elf/hellFireButton.png",
		//spells
		blastButton:"../img/elf/blastButton.png",
		swayButton:"../img/elf/swayButton.png",
		strikeButton:"../img/elf/strikeButton.png",

		nourishButton:"../img/elf/nourishButton.png",
		ravinesButton:"../img/elf/ravinesButton.png",
		impactButton:"../img/elf/impactButton.png",

		lightningButton:"../img/elf/lightningButton.png",
		trailButton:"../img/elf/trailButton.png",
		radianceButton:"../img/elf/radianceButton.png",
		//desktopUI
		dtCloseButton:"../img/desktopUI/closeButton.png",
		dtCloseButtonActive:"../img/desktopUI/closeButton-active.png",
		dtHelpButton:"../img/desktopUI/help.png",
		dtHelpButtonActive:"../img/desktopUI/help-active.png",
		dtShareButton:"../img/desktopUI/share.png",
		dtShareButtonActive:"../img/desktopUI/share-active.png",
		dtSoundOffButton:"../img/desktopUI/soundOff.png",
		dtSoundOffButtonActive:"../img/desktopUI/soundOff-active.png",
		dtSoundOnButton:"../img/desktopUI/soundOn.png",
		dtSoundOnButtonActive:"../img/desktopUI/soundOn-active.png",
		dtUniqueLogoButton:"../img/desktopUI/uniqueLogo.png",
		dtUniqueLogoButtonActive:"../img/desktopUI/uniqueLogo-active.png",
		dtWeiboLogoButton:"../img/desktopUI/weibo_logo.png",
		dtRenrenLogoButton:"../img/desktopUI/renren_logo.png",
		dtTwitterLogoButton:"../img/desktopUI/twitter_logo.png",
	};
	/*
	for(var name in source){
		console.log(source[name]);
	}
	return;
	*/
	var resourceContainerNode = document.getElementById("resourceContainer");
	var imgSum = 0;
	for(var i in source){
		imgSum ++;
	}
	var loadedImgNum = 0;
	for(var name in source){
		img[name] = new Image();
		img[name].src = source[name];
		var newImgNode = document.createElement("img");
		newImgNode.id = name;
		newImgNode.src = source[name];
		newImgNode.onload = function (){
			loadedImgNum ++;
			var nowPercent = " "+Math.round(loadedImgNum/imgSum*100)+"%";
			$("#loadedPercent").html(nowPercent);
		}
		resourceContainerNode.appendChild(newImgNode);
	}
})()
