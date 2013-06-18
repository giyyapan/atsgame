var User = Class.sub();
User.prototype._init = function (game){
    this.userData;
    var self = this;
    window.whosYourDaddy = function(userName){
				self.newClearData();
				if(userName){
						self.userData.userName = userName;
				}
				self.updateUserData();
				console.error('you found this AHh~? Have a nice trip :P')
    }

}
User.prototype.getUserData = function (forceSync,callback){
		var forceSync = true
		if (!forceSync && this.userData){
				return this.userData;
		}
		if (!localStorage.uuid){
				return false;
		}
		var self = this;
		//sync network request
		Network.getUserData(false,function (res){
				self.userData = res.dataJStr;
				self.userData.userName = res.username;
				Static.setting = self.userData.setting;
				self = null;
				if (typeof callback === 'function'){
						callback();
				}
		});
		return this.userData;
}
User.prototype.updateUserData = function (silent){
		if (!this.userData){
				console.error("no userData when update!");
				return;
		}
		var dataJStr = JSON.stringify(this.userData);
		Network.updateUserData(dataJStr,this.encodeUserData(dataJStr),this.encodeKey,silent);
}
User.prototype.getChallengeScores = function (challengeName){
		var scoresArray = null;
		Network.getChallengeScores(challengeName,function (res){
				scoresArray = res.scoresArray;
				//console.log('enter1');
		});
		//console.log('enter2');
		if (scoresArray.length < 30){
				for (var i = scoresArray.length - 1; i < 30; i++){
						scoresArray.push({username:"---",score:"---",time:'---'});
				}
		}
		return scoresArray;
}
User.prototype.uploadChallengeScore = function (){
		//not a async func
		var data = this.lastChallengeData;
		var username = this.getUserData().userName;
		var value = this.encodeChallengeScoreData(data.challengeName,username,data.score);

		var self = this;
		Network.uploadChallengeScore(data.challengeName,username,data.score,value,data.time,this.challengeUploadKey,function (res){
				self.lastChallengeData.scoreRank = res.number;
		});
		self = null;
}

User.prototype.newClearData = function (){
    if(this.userData && this.userData.challengeScore){
				var tempChallengeScore = this.userData.challengeScore;
    }
    if(this.userData){
				var tempUsername = this.userData.userName;
    }
    this.userData = {
				//all clear version
				userName:"Aria",
				clearedStageNo:15,
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
						skipClearedStory:false,
						getFailReward:true,
				}
    }
    if(tempChallengeScore){
				//this.userData.challengeScore = tempChallengeScore;
    }
    if(tempUsername){
				this.userData.userName = tempUsername;
    }
}

User.prototype.newUserData = function (){
    this.userData = {
				//default version
				userName:null,
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
		return this.userData;
}
User.prototype.encodeUserData = function (dataJStr){
    this.encodeKey = {time:new Date().getTime()};
    a = 'anqwer';
    b = 'iiopw';
    c = '2212';
    d = '122';
    e = 'vbnm';
    f = a.substring(2,10) + b.substring(1,1);

    decodeKey = 22112;
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

    out = calcMD5(key+dataJStr);
    //console.log(dataJStr+''+key)    
    return out;
}
User.prototype.encodeChallengeScoreData = function (challengeName,username,score){
		this.challengeUploadKey = {time:new Date().getTime()};
		a = 'anqwer';
		b = 'iiopw';
		c = '2212';
		d = '122';
		e = 'vbnm';
		f = a.substring(2,10) + b.substring(1,1);

		decodeKey = 22112;
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
		
		key = this.challengeUploadKey.key
				= calcMD5(this.challengeUploadKey.time + j);
		
		out = calcMD5(challengeName+''+username+''+score+''+key);
		
		return out;
}
