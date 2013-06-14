//Class DB is in Utils
var MainDataBase = Class.sub();
MainDataBase.prototype._init = function (){
	this.battleFieldSprites = new DB();
	this.battleFieldSprites.data = {
		summoner:{
			map:img.summonerMap,
			spriteWidth:125,
			spriteHeight:150,
			width:100,
			height:120,
			drawRate:1,
			movements:{
				normal:{
					line:0,
					row:0,
					num:9,
					
				},
			},
			magicCircle:{
				map:img.summonerMap,
				spriteWidth:125,
				spriteHeight:150,
				drawRate:1,
				width:75,
				height:90,
				movements:{
					normal:{
						line:0,
						row:9,
						num:1,
					},
				},
			}
		},
		demonGateHeader:{
			map:img.demonGateMap,
			spriteWidth:150,
			spriteHeight:75,
			width:120,
			height:60,
			drawRate:1,
			movements:{
				normal:{
					line:0,
					row:0,
					num:5,
				},
			}
		},
	};
	this.challenge = new DB();
	this.challenge.data = {
		stages:[
			{stageName:"waterChallenge",
			 number:2,
			},
			{stageName:"fireChallenge",
			 number:5,
			},
			{stageName:"windChallenge",
			 number:8,
			},
			{stageName:"earthChallenge",
			 number:11,
			},
			{stageName:"thunderChallenge",
			 number:14,
			},
			{stageName:"finalChallenge",
			 number:15,
			}
		],
	}
	this.map = new DB();
	this.map.data = {
		points:[
			{stageName:"waterStage1",
			 number:1,
			 x:344,
			 y:265,
			},
			{stageName:"waterStage2",
			 number:2,
			 x:439,
			 y:287,
			},
			{stageName:"waterStage3",
			 number:3,
			 x:527,
			 y:277,
			},
			{stageName:"fireStage1",
			 number:4,
			 x:417,
			 y:572,
			},
			{stageName:"fireStage2",
			 number:5,
			 x:314,
			 y:576,
			},
			{stageName:"fireStage3",
			 number:6,
			 x:240,
			 y:626,
			},
			{stageName:"windStage1",
			 number:7,
			 x:614,
			 y:795,
			},
			{stageName:"windStage2",
			 number:8,
			 x:750,
			 y:798,
			},
			{stageName:"windStage3",
			 number:9,
			 x:803,
			 y:616,
			},
			{stageName:"earthStage1",
			 number:10,
			 x:843,
			 y:546,
			},
			{stageName:"earthStage2",
			 number:11,
			 x:753,
			 y:485,
			},
			{stageName:"earthStage3",
			 number:12,
			 x:700,
			 y:424,
			},
			{stageName:"thunderStage1",
			 number:13,
			 x:784,
			 y:328,
			},
			{stageName:"thunderStage2",
			 number:14,
			 x:809,
			 y:256,
			},
			{stageName:"thunderStage3",
			 number:15,
			 x:708,
			 y:245,
			},
			{stageName:"finalStage",
			 number:16,
			 x:130,
			 y:150,
			},
			/*{stageName:"testStage",
			  number:"test",
			  x:100,
			  y:100,
			  },
			*/
		]
	}
	this.chara = new DB;
	this.chara.data = {
		Aria:img.summonerPic,
		Liara:img.waterElfPic,
		Tania:img.fireElfPic,
		Charlotte:img.windElfPic,
		Shannon:img.thunderElfPic,
		Eli:img.earthElfPic,
		Thunder:img.thunderBossPic,
		Master:img.finalBossPic,
		Carlo:img.windBossPic,
		Crystal:img.waterBossPic,
		Dragon:img.fireBossPic,
		StoneGiant:img.earthBossPic,
		sys:null,
		waterCrystal:null,
		fireDragon:null,
		stoneGiant:null,
		windLord:null,
		thunderSpirit:null,
	}
	this.stage = new DB_stage();
	this.story = new DB_story();
	this.elf = new DB_elf();
	this.demon = new DB_demon();
	this.tower = new DB_tower();
}