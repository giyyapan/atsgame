var User = Class.sub();
User.prototype._init = function (game){
	this.userData;
}
User.prototype.getUserData = function (){
	if (this.userData){
		return this.userData;
	}
	if (!localStorage.uuid){
		return false;
	}
	var self = this;
	Network.getUserData(false,function (res){
		self.userData = res.dataJStr;
		self.userData.userName = res.username;
		Static.setting = self.userData.setting;
		self = null;
	});
	return this.userData;
}
User.prototype.updateUserData = function (){
	var dataJStr = JSON.stringify(this.userData);
	Network.updateUserData(dataJStr,this.encodeUserData(),this.encodeKey.time);
}
User.prototype.newClearData = function (){
    this.userData = {
		//all clear version
		userName:"Aria",
		difficaulty:1,
		clearedStageNo:14,
		availElves:["water","fire","wind","earth","thunder"],
		elves:["water","fire","wind"],
		availTowers:["normalTower","laserTower","waveTower","spellTower","heavyNormalTower","heavyLaserTower","heavyWaveTower","heavySpellTower"],
		towers:["normalTower","laserTower","waveTower"],
		spell:{
			water:["rain","torrent","gift"],
			fire:["sacrifice","fireRain","hellFire"],
			wind:["blast","sway","strike"],
			thunder:["lightning","trial","radiance"],
			earth:["nourish","ravines","impact"],
		},
		stageFailureData:{2:{mena:300,time:5},3:{mena:200,time:3}},
		challengeScore:{
			waterChallenge:[{name:"Giyya",score:5000,time:6340},{name:"Giyya",score:3000,time:400},{name:"Giyya",score:2000,time:400}],
			fireChallenge:[{name:"Giyya",score:55300,time:400},{name:"Giyya",score:3000,time:400},{name:"Giyya",score:1000,time:400}],
			windChallenge:[{name:"Giyya",score:3000,time:400},{name:"Giyya",score:200,time:400},{name:"Giyya",score:100,time:400}],
			earthChallenge:[{name:"Giyya",score:3000,time:400},{name:"Giyya",score:30000,time:400}],
			thunderChallenge:[],
			finalChallenge:[],
		},
		sumScore:0,
		highScore:[],
		setting:{
			frameRate:70,
			skipClearedStory:false,
			getFailReward:true,
		}
    }
}
User.prototype.newUserData = function (){
    this.userData = {
		//default version
		userName:"Aria",
		clearedStageNo:-1,
		stageFailureData:{},
		difficaulty:1,
		availElves:[],
		elves:[],
		availTowers:["normalTower","laserTower"],
		towers:["normalTower","laserTower"],
		spell:{
			water:[],
			fire:[],
			wind:[],
			thunder:[],
			earth:[],
		},
		challengeScore:{
			waterChallenge:[],
			fireChallenge:[],
			windChallenge:[],
			earthChallenge:[],
			thunderChallenge:[],
			finalChallenge:[],
		},
		sumScore:0,
		highScore:[],
		setting:{
			frameRate:70,
			skipClearedStory:true,
			getFailReward:true,
		}
    }
    //this.newClearData();
	Static.setting = this.userData.setting;
}
User.prototype.encodeUserData = function (){
	this.encodeKey = {time:new Date().getTime()};
	a = 'anqwer';
	b = 'iiopw';
	c = '2212';
	d = '122';
	e = 'vbnm';
	f = a.substring(2,10) + b.substring(1,1);

	decodeKey = 22112;
	dataJStr = calcMD5;
	sum = 0;
	for (i = 0; i < a.length; i++){
		sum += a.charCodeAt(i);
	}
	sum.toString(2);
	sum ^= decodeKey;
	
	g = a.slice(3,5) + f;
	h = f + c.slice(0,3);
	i = (h + g).substring(0,7);
	j = i.slice(0,4)+e+i.slice(4,9)+d.slice(0,d.length-1);
	
	key = this.encodeKey.key
		= calcMD5(this.encodeKey.time + j);
	/*j = 'qwervbnm22112'
	  http://www.jb51.net/tools/eval/
	 */
	
	out = calcMD5(JSON.stringify(this.getUserData())+''+key);
	return out;
}
User.prototype.encodeChallengeScoreData = function (challengeName,username,score){
		this.challengeUploadData = {time:new Date().getTime()};
	a = 'anqwer';
	b = 'iiopw';
	c = '2212';
	d = '122';
	e = 'vbnm';
	f = a.substring(2,10) + b.substring(1,1);

	decodeKey = 22112;
	dataJStr = calcMD5;
	sum = 0;
	for (i = 0; i < a.length; i++){
		sum += a.charCodeAt(i);
	}
	sum.toString(2);
	sum ^= decodeKey;
	
	g = a.slice(3,5) + f;
	h = f + c.slice(0,3);
	i = (h + g).substring(0,7);
	j = i.slice(0,4)+e+i.slice(4,9)+d.slice(0,d.length-1);
	
	key = this.encodeKey.key
		= calcMD5(this.encodeKey.time + j);
	
	out = calcMD5(challengeName+''+username+''+score+''+key);

	/*j = 'qwervbnm22112'
	  http://www.jb51.net/tools/eval/
	 */

	return out;
}