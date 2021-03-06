var DB_tower = DB.sub();
DB_tower.prototype._init = function (){
	this.data = {
		normalTower:{
			cost:{
				mena:160
			},
			intro:{
				name:"斩击者",
				text:"用斩击对单体目标造成较高伤害的守护塔"
			},
			buttonPic:img.normalTowerButton,
			map:img.normalTower,
			sound:"sword",
			type:"normal",
			width:59,
			height:47,
			damage:2.5,
			range:1,
			attackDelay:25,
			minAttackDelay:3,
			spriteWidth:59,
			spriteHeight:47,
			movements:{
				normal:{
					line:0,
					row:0,
					num:1
				}
			}
		},
		laserTower:{
			buttonPic:img.laserTowerButton,
			cost:{
				mena:200
			},
			intro:{
				name:"聚焦者",
				text:"发射雷射同时攻击一条直线上的敌人的守护塔"
			},
			map:img.laserTower,
			sound:"laser",
			damage:2,
			attackDelay:35,
			minAttackDelay:8,
			range:1,
			width:46,
			height:64,
			type:"line",
			spriteWidth:46,
			spriteHeight:64,
			movements:{
				normal:{
					line:0,
					row:0,
					num:1
				}
			}
		},
		waveTower:{
			buttonPic:img.waveTowerButton,
			width:59,
			height:59,
			cost:{
				mena:220
			},
			intro:{
				name:"震荡者",
				text:"发射震荡波同时对周围所有敌人造成伤害的守护塔"
			},
			map:img.waveTower,
			sound:"wave",
			type:"circle",
			damage:2,
			range:1,
			attackDelay:30,
			minAttackDelay:8,
			spriteWidth:60,
			spriteHeight:51,
			movements:{
				normal:{
					line:0,
					row:0,
					num:1
				}
			}
		},
		spellTower:{
			buttonPic:img.spellTowerButton,
			width:59,
			height:59,
			cost:{
				mena:200
			},
			intro:{
				name:"施咒者",
				text:"使用咒术攻击一个地图格中的所有敌人的守护塔"
			},
			map:img.spellTower,
			sound:"spell",
			type:"field",
			damage:1.2,
			range:2,
			attackDelay:25,
			minAttackDelay:7,
			spriteWidth:52,
			spriteHeight:59,
			movements:{
				normal:{
					line:0,
					row:0,
					num:1
				}
			}
		},
		heavyLaserTower:{
			buttonPic:img.heavyLaserTowerButton,
			cost:{
				mena:240
			},
			intro:{
				name:"凝视者",
				text:"直线攻击型守护塔发射比聚焦者更强大的镭射，有更远的射程，但攻击速度较慢，消耗也更大",
			},

			map:img.heavyLaserTower,
			sound:"hLaser",
			damage:2.2,
			range:2,
			width:47,
			height:56,
			attackDelay:40,
			minAttackDelay:12,
			type:"line",
			spriteWidth:46,
			spriteHeight:64,
			movements:{
				normal:{
					line:0,
					row:0,
					num:1
				}
			}

		},
		heavyWaveTower:{
			buttonPic:img.heavyWaveTowerButton,
			width:59,
			height:59,
			intro:{
				name:"冲击者",
				text:"波纹攻击型守护塔，能以更高的频率发射波纹，但也增加了消耗",
			},
			cost:{
				mena:250
			},
			map:img.heavyWaveTower,
			sound:"hWave",
			type:"circle",
			damage:2,
			range:1,
			attackDelay:25,
			minAttackDelay:8,
			spriteWidth:59,
			spriteHeight:59,
			movements:{
				normal:{
					line:0,
					row:0,
					num:1
				}
			}

		},
		heavyNormalTower:{
			cost:{
				mena:220
			},
			intro:{
				name:"撕裂者",
				text:"斩击型守护塔，有比斩击者更高的伤害，但是消耗更大"
			},

			buttonPic:img.heavyNormalTowerButton,
			map:img.heavyNormalTower,
			sound:"hSword",
			type:"normal",
			width:59,
			height:47,
			damage:3,
			range:1,
			attackDelay:25,
			minAttackDelay:3,
			spriteWidth:59,
			spriteHeight:47,
			movements:{
				normal:{
					line:0,
					row:0,
					num:1
				}
			}
		},
		heavySpellTower:{
			buttonPic:img.heavySpellTowerButton,
			map:img.heavySpellTower,
			sound:"hSpell",
			width:64,
			height:50,
			cost:{
				mena:280
			},
			intro:{
				name:"吟唱者",
				text:"咒术攻击型守护塔，有比施咒者更高的攻击，但是消耗更大"
			},
			type:"field",
			damage:1.8,
			range:2,
			attackDelay:25,
			minAttackDelay:7,
			spriteWidth:52,
			spriteHeight:59,
			movements:{
				normal:{
					line:0,
					row:0,
					num:1
				}
			}

		},		
	};
}
