var DB_story = DB.sub();
DB_story.prototype._init = function (){
	this.data = {
		popupStory:{
			"-1":{
				text:"大陆历2300年，奇迹大陆发生了一次原因未知的魔法震荡，各地受到严重的破坏。以最近百年内兴起的以新兴能源——源石为核心的魔导科技也因为这次震荡全部失去了效用，建立在魔导科技之上的人类社会陷入瘫痪，大陆一片混乱。同时，随着震动的发生，在奇迹大陆的西北角出现了被强大结界包围的神秘浮空城</br></br>就在人们纷纷一边猜测震动的原因以及与浮空城的关系，一边慌乱的寻找源石的替代品时，有一位隐居多年的大陆守护者，传送中的魔法师，察觉到了此次事件非同一般，决定进入浮空城一探究竟。</br>但是，浮空城的结界过于强大，即使是这个传说中的法师也无法独自破除，所以她决定找到曾经的战友，沉睡在奇迹大陆各地的元素精灵们，并借助他们的力量。</br>这个法师名叫Aria（艾莉娅），Aria the Summoner（召唤师艾莉娅）。",
			},
			0:{
				text:"(恭喜你成功通过了第一关，现在你获得了一个“精灵”！精灵是强大的战力，它们不仅自身具有强大的，可以成长实力，还可以强化周围的守护塔，甚至可以在关键的时候施放威力强大的元素魔法！</br>关于精灵的使用说明会在下一关的关卡中进行说明</br>此外，你也可以点击地图界面右上角的equip按钮进入装备界面确认已经解锁的精灵和守护塔</br>同样,随着游戏的进行会有更多的要素可以解锁,请加油通关吧!)"
			},
			1:{
				text:"(随着力量的增强，你的精灵解锁了第一个魔法，使用方法会在下一关的关卡中介绍。</br>同样，你可以在equip界面中查看魔法的信息)"
			},
			5:{
				text:"Aria已经找回了她的两个伙伴，现在正准备前往微风森林。</br></br>(好吧,其实我在想,如果你在用手机玩召唤师,你是不是到现在还不知道这个地图是可以左右拖动的？)"
			},
			14:{
				text:"Aria找到了所有曾经与她一道作战的精灵，借助他们的力量打开了奇迹大陆西北边的神秘浮空城的结界。现在，旅程即将走向终点，Aria将迎来最后的，也是最大到挑战...(？)",
			},
			15:{
				text:"Aria和精灵们的旅程到这里就告一段落了，我们对所有看到这段话的玩家表示祝贺和感谢～(咳咳，希望你别觉得最后一关太变态了~)<br /><br />之后呢，你可以在挑战模式中打出更高的分数，还可以回去杀一下那些没死的史莱姆～或者在System中重置剧情重新体验<br /><br />最后再次感谢通关的玩家～这里是联创团队!<br /><br />以后也请支持我们哟~(如果有以后的话_(:3」∠)_</br>"
			}
			
		},
		testStage:{
			title:"test",
			text:"this is a test stage",
			instage:{
				/*	0:[
					{
					chara:"sys",
					text:"some text",
					},
					{
					chara:"Thunder",
					text:"some text",
					},
					{
					chara:"Aria",
					text:"some text",
					},
					{
					chara:"Tania",
					text:"some text",
					},
					
					{
					chara:"Master",
					text:"some text",
					},
					{
					chara:"Carlo",
					text:"some text",
					},
					{
					chara:"Crystal",
					text:"some text",
					},
					{
					chara:"Dragon",
					text:"some text",
					},
					{
					chara:"StoneGiant",
					text:"some text",
					},
					],*/
				clear:[
					{
						text:"cleared!",
					}
				],
			}
		},
		waterChallenge:{
			title:"暴食之试炼",
			text:"兰湖深处不时传来的躁动,正是暴食的恶魔对夺走它食物者的憎恨",
			pic:img.waterBossPic,
		},
		fireChallenge:{
			title:"懒惰之试炼",
			text:"巨龙昏睡在赤峰之巅,用无尽的懈怠污染着人们,往日霸主的气势荡然无存",
			pic:img.fireBossPic,
		},
		windChallenge:{
			title:"色欲之试炼",
			text:"过分强烈的爱意带不来幸福,只能让人疯狂,给人绝望",
			pic:img.windBossPic,
		},
		earthChallenge:{
			title:"愤怒之试炼",
			text:"大地精灵燃烧的愤怒能给他带来正义的力量,但也足够摧毁一切美好",
			pic:img.earthBossPic,
		},
		thunderChallenge:{
			title:"傲慢之试炼",
			text:"在那万雷之源,强大的精灵俯视者脚下的众生.傲慢是拥有智慧者最大的敌人",
			pic:img.thunderBossPic,
		},
		finalChallenge:{
			title:"嫉妒与贪婪之试炼",
			text:"浮空城深处彷徨着的影子从何而来,为何而怨,又将去向何方?",
			pic:img.finalBossPic,
		},
		waterStage1:{
			title:"大陆的明珠",
			text:"兰湖是奇迹大陆最大的内陆湖，有大陆的明珠的美誉。同时这里也是水精灵Liara的结界,旅程的第一站",
			instage:{
				0:[{"chara":"Aria","text":"什么，连这里也被恶魔侵扰了么！看来想找到她还真得费一番功夫呢..（扶额）"},{"chara":"sys","text":"---亲爱的玩家，欢迎来到魔法的世界---</br>我知道你很讨厌教程，但是召唤师的系统确实有些复杂，还请你稍微<span>耐心一点</span>吧～<br /><br />(◍•ᴗ•◍)"}],
				1:[{"chara":"sys","text":"如你所见，召唤师艾莉娅是一个<span>塔防游戏</span><br /><br />将<span>屏幕下方</span>的守护塔<span>拖放</span>到场上来抵御敌人的进攻。敌人出完了你还没挂你就胜利了。"},{"chara":"sys","text":"不同守护塔具有不同的特性,也有不同的<span>价格</span>(图标上的数字)<br /><br />第一种塔能发出强力的<span>单体攻击</span>。<br/>第二种塔则可以攻击<span>一条直线</span>上的所有单位。<br /><br />配合着使用可以达到最好的效果。<br /><br />当前可用的<span>金钱</span>在屏幕<span>左下角</span>"},{"chara":"sys","text":"点击并<span>拖动</span>屏幕下方的塔图标可以把塔放到场上。<br /><br />这一关的诀窍是<span>让第二种塔攻击到尽量多的敌人</span><br /><br />PS:<span>点击</span>已经召唤出来的召唤塔可以看到更多信息"}],
				2:[{"chara":"sys","text":"恭喜你抵挡住了第一波进攻!<br />现在让我们来接触一下<span>暂停</span>的功能<br />这个功能<span>非常重要</span>!"},{"chara":"sys","text":"点击<span>屏幕上方带指针的圆盘</span>可以令游戏暂停<br />暂停状态下你<span>依然可以</span>进行各种操作。<br /><br />另外，暂停的状态下<span>右上角</span>会出现退出关卡的按键，点击它就可以退回到主菜单或者重新开始关卡"}],
				clear:[{"chara":"Aria","text":"啧，这些恶魔真是比以前的敌人还要恶心..烦死..要不是现在的年轻人被什么魔导技术娇惯得一个能打的都没有，哪里轮的到我这传说中老家伙来再次拯救世界啊...（叹）"},{"text":"（原本平静得湖面忽然荡起了波纹，纯净的元素能量在空气中跃动）","sound":"teleport"},{"chara":"Liara","text":"诶，我说怎么感觉到恶魔的气息都被封印了，原来是你啊～好久不见，召唤师大人别来无恙呀～（笑）"},{"text":"（伴随着悦耳的嗓音，水精灵出从湖水中缓缓升起）"},{"chara":"Aria","text":"寒暄就免了吧。"},{"chara":"Aria","text":"（召唤师摆了摆手，一点惊讶的样子也没有)"},{"chara":"Aria","text":"现在的局势你也看到了，我不能放着不管。水精灵，我这次来是想请你帮忙的，助我一臂之力吧。"},{"chara":"Liara","text":"哎呀哎呀，艾酱什么时候这么客气了～？人家都不好意思了～"},{"chara":"Liara","text":"（Liara作出一脸害羞的表情）"},{"chara":"Liara","text":"帮忙好说，但是实不相瞒，因为元素震荡的影响的我的能量也流失的差不多了，现在它们散落到这片兰湖的各个角落，被地脉吸收进去了。"},{"chara":"Aria","text":"什么？比预想的还要糟糕呢...这次的危机看来非同一般呢，有我能做的么？"},{"chara":"Liara","text":"当然～ 只要你陪我一起到那些地方，帮我封印那里的恶魔，我自然可以安心得去把我的能量取回来吃饱饱的，本来就是我的东西，没理由会拿不回来的吧～？（笑）"},{"chara":"Aria","text":"恩，那么事不宜迟，我们出发吧！"},{"chara":"Liara","text":"遵命～召唤师大人～～～"},{"chara":"Liara","text":"（Liara蹦蹦跳跳得跟了上去）"}],   
			},
		},
		waterStage2:{
			title:"兰湖深处",
			text:"为了找回水精灵Liara失散的能量，召唤师和她的精灵不得不深入兰湖的深处。",
			instage:{
				0:[{"chara":"Liara","text":"就是这里了，Aria大人～ 这里的水下可以嗅到水元素的气息。"},{"chara":"Aria","text":"那么，我只要把这些恶魔都封印了就万事大吉了吧？"},{"chara":"Liara","text":"(Liara笑嘻嘻得点了点头)"}],
				1:[{"chara":"sys","text":"好了，亲爱的玩家，让我们学习一下<span>精灵</span>的操作方法吧～"},{"chara":"sys","text":"与守护塔相同，用<span>拖动</span>的方法可以将精灵召唤出来<br /><br />精灵身旁有<span>两个</span>表示范围的魔法阵，其中绿色的小圈表示<span>攻击的范围</span>，白色的大圈则表示为周围塔提供<span>强化的范围</span>。<br /><br />点击场上的精灵或者<span>下方的头像</span>都可以打开精灵的指令菜单，赶紧试试吧"},],
				2:[{"chara":"sys","text":"你应该注意到场地中间有一个蓝色的发光魔法阵，它是充满了水属性能量的<span>地脉</span>。<br /><br />处于地脉上的精灵可以获得元素能量，这些能量用于精灵的<span>升级和施放魔法</span>。<br /><br />如果你的精灵没有在这个法阵上，那么请把她<span>传送</span>过去<br /><br />PS:精灵相关的指令可以在暂停的时候下达，但是只有取消了暂停他们才会执行这个指令。"}],
				3:[{"chara":"sys","text":"如果你的精灵一直在地脉上，那么她应该已经有不少元素能量了（元素能量显示在精灵图标下方的槽中）<br /><br />等到能量积满，精灵的升级的按钮中的文字会变成黄色，点击按钮可以对精灵进行<span>升级</span>。"},{"text":"精灵升级了以后能力会有全面的提高，对周围守护塔的加成作用也会强化！"}],

				
				clear:[{"text":"(湖中一阵波动，散发出无数细小的光点，水精灵将它们吸入体内，一脸幸福的表情)","sound":"levelUp"},{"chara":"Liara","text":"饱了哟～艾酱～～"},{"chara":"Liara","text":"（水精灵一脸笑容，夸张地向召唤师招手）"},{"chara":"Aria","text":"噢，能量强了不少嘛！好，看到你这么靠谱我也好像有信心啦！那么再去找其它的地脉吧。"},{"chara":"Liara","text":"哟，召唤师大人今天还真是干劲满满啊～"},{"chara":"Aria","text":"不过在这之前果然还是要先好好“睡一觉”呢～哈哈哈哈"},{"chara":"Liara","text":"......嘛～就当我啥也没说好了～"}],
			},
		},
		waterStage3:{
			title:"纯水之核",
			text:"Aria和Liara几乎搜遍了整个兰湖，但是依然无法找到其他地脉。就在这时，水精灵感受到了巨大的能量波动...",
			instage:{
				0:[{"chara":"Liara","text":"这里有些不寻常，刚才明明感觉到了我剩下的能量全都在这里，但是走近了却什么也看不到.."},{"chara":"Liara","text":"（水精灵一反平时笑嘻嘻的表情，脸上写满了担忧）"},{"chara":"Aria","text":"这么说来确实是这样，就连最普通的水中所蕴涵的元素也几乎感受不到。就像是被什么东西吸收得一干二净了..."},{"text":"（怪物们察觉到了气息，纷纷聚拢过来）"},{"chara":"Aria","text":"啊啊啊，烦死了！不管这么多了，先解决这些不长进的废物再说!"}],
				1:[{"chara":"sys","text":"你的水精灵学会了第一个<span>魔法</span>，点击精灵选单的<span>魔法图标</span>来使用。魔法按钮上的<span>绿色框</span>代表所要消耗的<span>能量值</span>，一个小格对应精灵能量槽的一个小格。"},{"chara":"sys","text":"魔法分为辅助类和攻击类<br /><span>辅助类</span>用于强化守护塔，<span>攻击类</span>则是直接伤害。<br /><br />魔法的施放方式又有非指向型和指向型。现在你的魔法只有<span>非指向型</span>，即只能作用于<span>精灵周围</span><br /><br /><span>选中精灵</span>后点击<span>魔法按钮</span>后再点击屏幕右下方的<span>施放按钮</span>就就可以施放了。"},{"chara":"sys","text":"魔法按钮（包括精灵的其他指令按钮）下方的<span>数字</span>在不同情况下有不同的颜色：<br />呈现<span>黄色</span>时表示可以施放<br /><br />呈现<span>红色</span>时表示当前金钱不够<br /><br />呈现<span>灰色</span>时则表示精灵积累的能量不够。<br /><br /> 赶快试试吧"}],
				
				5:[{"text":"（水面忽然剧烈波动起来，随之而来的是高频震动发出的刺耳噪音）","stopAllSound":true,"sound":"crystalSound"},{"chara":"Aria","text":"搞什么鬼！Liara，这是什么声音？"},{"chara":"Aria","text":"(召唤师痛苦得捂住耳朵，但是噪音依然毫无障碍得钻进她的大脑)"},{"chara":"Liara","text":"(水精灵一脸凝重，身上迸发出强烈的光芒)"},{"text":"（受到水精灵的影响，噪音越发强烈）","sound":"crystalSound"},{"chara":"Aria","text":"你搞什么啊！快停下！要死了啊喂！"},{"chara":"Liara","text":"再坚持一下，召唤师！"},{"chara":"Liara","text":"（水精灵的语调给人一种不容置疑的压力）"},{"chara":"Aria","text":".....（咬牙）"},{"chara":"Aria","text":"........（还没好么！真心要跪了啊喂！！）","sound":"crystalSound"},{"text":"（震动戛然而止，水面出现了一个巨大的漩涡）"},{"chara":"Liara","text":"哼，终于肯露脸了么？"},{"text":"（回应着水精灵的质问，漩涡中浮起一个巨大的结晶状物体）"},{"chara":"Crystal","text":"........我饿","sound":"crystalSound"},{"chara":"Liara","text":"偷吃别人的能量成长的家伙，还真是贪得无厌呢"},{"chara":"Liara","text":"（水精灵冷冷地看着巨大的水晶）"},{"chara":"Crystal","text":"........我要吃！！！","sound":"crystalSound"},{"chara":"Aria","text":"啧啧，看来是没的谈了。Liara，别跟这货废话，你的东西，你只管拿回来就是！","sound":"bossBgm"},{"chara":"sys","text":"这是你的第一次<span>boss战</span>，我只有一点要说：被boss碰到会<span>扣掉所有生命值</span>，所以，拦住它！"}],
				clear:[{"chara":"Crystal","text":"啊啊啊啊啊啊！","sound":"crystalSound"},{"text":"（水结晶炸裂开来，强烈的能量倾泻而出，纷纷回归Liara的体内）","sound":"boom"},{"chara":"Liara","text":"（水精灵闭着眼睛，微微仰着头，水一般的长发在能量流中舞蹈）","sound":"levelUp"},{"chara":"Aria","text":"（召唤师静静地看着她，接受这原始能量的洗礼）"},{"chara":"Aria","text":"就是因为这样，我才一直追寻这元素的光辉啊....（召唤师喃喃道）"},{"text":"（许久，水精灵睁开眼睛）"},{"chara":"Liara","text":"胜利完成任务～召唤师大人快奖励我吃的～！（水精灵恢复了笑嘻嘻的表情）"},{"chara":"Aria","text":"恩，GoodJob!(摸头)"}],
			},
		},
		fireStage1:{
			title:"熔岩，焦土，史莱姆",
			text:"下一站是奇迹大陆唯一的活火山，火精灵Tania的结界——赤峰。（啊？你问标题上的史莱姆？我也不知道怎么回事）",
			instage:{
				0:[{"chara":"Aria","text":"这破地方为什么到现在还是这么热！当时我明明发誓永远都不再来了的！（召唤师一边贴在水精灵身上降温，一边发着牢骚）"},{"chara":"Liara","text":"嘛～（水精灵摸摸召唤师的脑袋，还是一脸笑容）"},{"chara":"Aria","text":"Tania这货也是的，非要整天宅在岩浆里面，也不出来活动活动..不然的话没准就让我撞个正着，省的爬这破山了..我这一把老骨头啊.."},{"chara":"Aria","text":"不过爬山还算好的，就怕有恶魔出来惹事，像那些史莱姆啊神马的，明明就是炮灰，还每次冲这么快！不知道粘液沾到身上很难洗的啊....."},{"text":"（话说到一半，一只史莱姆从岩石后面探出脑袋）"},{"chara":"Liara","text":"噗～被听到了！！呵呵呵呵呵（水精灵噗哧一声笑了起来）"},{"chara":"Aria","text":"哎呀我去！你们这帮没骨头的家伙还真是有骨气啊！这不是逼我收了你们么！（Aria掏出法杖）"},{"chara":"Liara","text":"（水精灵捂着肚子蹲在一边，肩膀抽动着）"},{"chara":"Aria","text":"喂你要笑到什么时候啊，打架啦！"}],
				clear:[{"chara":"Aria","text":"都说了粘液很难洗的啦喂！再说这种地方哪里有水洗衣服啊！（召唤师敲扁最后一直史莱姆，又发起了牢骚）"},{"chara":"Liara","text":"从来到这里以后你就很活跃嘛～召唤师大人～"},{"chara":"Aria","text":"对了！你是水精灵来的啊！快弄点水出来帮我冲一下！"},{"chara":"Liara","text":"啊拉~不要～黏黏的多带感啊～再说冲掉了史莱姆们会伤心的哟～（水精灵一边说一边跑远了）"},{"chara":"Aria","text":"你！你还跑？闹哪样啊喂！Liara大姐这样很热的啊喂！（召唤师看来有些摸不着头脑，只好追了上去）"},{"text":"（两人越跑越远，终于消失<s>在被打扁的史莱姆的视线中</s>）"}],
			}
		},
		
		fireStage2:{
			title:"赤色彗星",
			text:"赤峰之巅，却奇怪地感受不到原本的热量。",
			instage:{
				0:[{"chara":"Aria","text":"诶，怎么会这么凉快？这里的温泉旅游业怎么办_(:3J<)_Tania不能不管事啊~"},{"chara":"Liara","text":"不知道呢~上次战争后她就一直宅家里没聊过天，说不准是家里蹲到转性子了？"},{"text":"（火山口内传来气急败坏的骂声和一声低吼）"},{"chara":"Aria","text":"Tania？龙？！Liara我们快进去看看！"},{"chara":"Liara","text":"好嘞~"},{"text":"（恶魔出现，阻断了道路）"},{"chara":"Aria","text":"非得在这时候出现么？真是气死我老人家了！去死啊啊啊！！！（像掏刀子一样恶狠狠地掏出法杖）"}],
				1:[{"chara":"sys","text":"细心的玩家，也许你已经注意到了屏幕上方的<span>指针</span>是<span>会旋转</span>的。<br /><br />这个指针是<span>地脉刷新</span>的指示器。<br /><br />当指针旋转一周，地脉就会刷新一次。"},{"chara":"sys","text":"虽然有些关卡中有的地脉位置是<span>固定不变</span>的<br /><br />但是如果遇到<span>随机地脉</span>，要注意使用精灵的<span>传送</span>能力移动到新的地脉以吸收能量。<br /><br />另外，地脉的<span>颜色</span>和<span>精灵的属性</span>是对应的<br />只有传送到<span>属性相同</span>的地脉，才能以最快的速度吸收能量."}],
				3:[{"chara":"Aria","text":"Li,Liara!刚才飞过去的那个红色的东西是什么!?。"},{"chara":"Liara","text":"红色...有角...三倍速...好像在哪里听过?"}],
				clear:[{"chara":"Aria","text":"好嘛，这地方好不容易这么凉快，打了一架又全身黏糊糊的了，Liara快给我洗一洗。（苦恼）"},{"chara":"Liara","text":"唉哟~我们的当务之急是去看看Tania怎么了嘛，没那个时间哦~（坏笑）"},{"chara":"Aria","text":"你！（气得说不出话）"}],
			}
		},
		
		fireStage3:{
			title:"熔火之心",
			text:"循声来到火山口的两人看到令人讶异的景象",
			instage:{
				0:[{"text":"（一只巨龙卧着，堵住了岩浆的流溢）"},{"chara":"Tania","text":"蠢龙臭龙！快给我起来！（无力地踢着龙的身体）","sound":"teleport"},{"chara":"Liara","text":"哟，Tania~怪不得这么凉呢，原来是家被人占了？宅不了了？没力气了~？"},{"chara":"Tania","text":"我现在火气大得很别来惹我！！！（作势欲踢）"},{"chara":"Aria","text":"我说你们两个别打情骂俏了……先把这些家伙解决了再说好吧？"},{"chara":"Tania","text":"你们上吧！我是没劲了...（趴"}],
				1:[{"chara":"sys","text":"这次的难度相对前面几关有比较大幅度的增加<br /><br />不过如果你足够细心,可以发现 <span>某些地脉是不会变换位置的</span>,如果好好利用这些固定的地脉,你一定可以通过的~"}],
				6:[{"chara":"Dragon","text":"……不想动，好累！！！","sound":"dragonSound"},{"text":"（被吵醒的龙一口火焰向众人喷来）"},{"chara":"Aria","text":"所以说起床气大的人真难伺候啊……（捂脸）"},{"chara":"Liara","text":"那就把它彻底打醒咯~","sound":"bossBgm"},{"chara":"Tania","text":"替我算上一刀！（怒发冲冠）"}],
				clear:[{"chara":"Aria","text":"（二人把龙给赶离了火山口）","sound":"boom"},{"chara":"Aria","text":"Tania酱~龙已经赶走了，你好好泡个岩浆澡，然后就给咱卖力去吧~"},{"chara":"Tania","text":"所谓刚出狼穴，又入虎口么……我不要出远门TAT"},{"chara":"Liara","text":"你这宅女，活该嫁不出去（斜眼）"}],
			},
		},
		
		windStage1:{
			title:"深翠围城",
			text:"踏上征程的三人，来到了风精灵的结界——微风森林的边境",
			instage:{
				0:[{"text":"（雾里有一个小小的身影）","sound":"teleport"},{"chara":"Aria","text":"Charlotte？真巧，能在外沿碰到你。要不要陪我再去拯救一次世界~？"},{"chara":"Charlotte","text":"对、对不起，我大概是没办法跟你们一起去的了。（哭丧着脸）"},{"chara":"Tania","text":"你怎么了？一脸要哭的样子啊。"},{"chara":"Charlotte","text":"Carlo这些天着了魔似的，在森林边境设下结界不让我出去，还总对我……"},{"chara":"Charlotte","text":"（脸突然红了起来）"},{"chara":"Liara","text":"Carlo？那个男性风精灵？诶嘿嘿，有意思哦~（坏笑着捏了捏Charlotte红透了的脸颊）"},{"text":"（雾中现出重重黑影）"},{"chara":"Charlotte","text":"（吓得动弹不得）"},{"chara":"Liara","text":"女孩子的话题，丑八怪少偷听！"}],
				1:[{chara:"sys",text:"在微风森林的关卡你会有<span>丰厚的初始金钱</span>,足够布下相对复杂的阵型<br /><br />但是相对的,怪物的<span>血量</span>也会有<span>较大提升</span>.请好好体会其间的差异吧~"}],
				clear:[{"text":"（雾的深处传来一阵男子的笑声）"},{"chara":"Carlo","text":"不速之客呵，想要抢走我的Charlotte么！那就追上我，战胜我，不然你们永远出不去的！"},{"chara":"Aria","text":"要是这小子不这么丧心病狂，我倒愿意促成一桩好事啊……"},{"chara":"Liara","text":"可惜现在只能……"},{"chara":"Tania","text":"打他丫的！"},{"chara":"Aria","text":"Charlotte酱哟，有我们在，不用怕他的~"},{"chara":"Charlotte","text":"我、我怕你们……"}],
			},

		},
		
		windStage2:{
			title:"密林深处",
			text:"一路追寻着Carlo的足迹，Aria一行在密林中迷路了",
			instage:{
				0:[{"chara":"Tania","text":"我说……什么时候开始我们周围全都是树了呢！"},{"chara":"Liara","text":"有点不对劲啊，有些树好矮……"},{"chara":"Aria","text":"（用手摸了摸低矮的树木）"},{"chara":"Aria","text":"这手感……史莱姆！！！（脸色发青）"}],
				3:[{"chara":"Aria","text":"喂喂，这么大只史莱姆是什么意思啊！（跪）"},{"chara":"Liara","text":"据说远古时期的生物都是巨型的哟~这可是值钱的古董呢~"},{"chara":"Charlotte","text":"有道理！（认真脸）我记得书上是有写过在500年前的十二王时期曾经..(翻书找"},{"chara":"Aria","text":"喂不要查这种奇怪的东西啊!还有钱什么的要多少有多少快把这货吹飞掉啊！！！"}],
				clear:[{"chara":"Aria","text":"为什么还有这么多！恶心死了！（闭着眼双手乱挥）"},{"chara":"Charlotte","text":"诶诶Aria我们抓一只好不好?这可是珍贵的古董!(扯衣角"},{"chara":"Tania","text":"别、别过来啊！炎雨！！！"},{"text":"（杀出一条路的众人继续朝着森林中心跑去，消失<删除线>在被烧焦的史莱姆的视线中</删除线>）"}],
			},

		},
		
		windStage3:{
			title:"爱与新生",
			text:"召唤师和她的精灵们终于追上了Carlo，来到森林的中心",
			instage:{
				0:[{"chara":"Aria","text":"跑不掉了吧你！敢用史莱姆堵我的路！大家伙儿揍他！"},{"chara":"Carlo","text":"哈哈哈，跑？我只不过是要让你们在这生命树下，见证我对Charlotte的爱，见证融合与新生！"}],
				5:[{"chara":"Carlo","text":"可恶！为什么要阻拦我的真爱！?</br>死!你们统统给我死!!","sound":"bossBgm"},{"chara":"Charlotte","text":"Carlo!不要!(含泪)"},{"chara":"Aria","text":"(将Charlotte护在身后)"}],
				clear:[{"chara":"Carlo","text":"为什么呢，Charlotte，为什么不愿同我结合、得到新生？！","sound":"titleBgm"},{"chara":"Aria","text":"Carlo，你为何不明白，真正的新生是灵魂的融合，执着于肉体的你早已迷失了方向啊。"},{"chara":"Liara","text":"对啊对啊，像我跟艾酱这样才是真爱嘛~"},{"chara":"Aria","text":"少说两句会死啊你（给了Liara一个爆栗）"},{"chara":"Carlo","text":"原来是这样么……哈，那就让我将最后的生命托付于你吧，Charlotte！"},{"text":"（Carlo连同森林边界的雾墙化为绿色的光，涌进Charlotte的体内）","sound":"levelUp"},{"chara":"Charlotte","text":"Carlo……（落泪）"},{"chara":"Aria","text":"Charlotte酱，不要伤心了。理解了你的他，想必在你身体里获得新生了吧。"},{"chara":"Aria","text":"（紧紧抱住Charlotte）"},{"chara":"Charlotte","text":"(感受着体内新的鼓动,风精灵默默点了点头)"}],
			},
		},
		
		earthStage1:{
			title:"东土躁动",
			text:"为了寻求土精灵的帮助，Aria来到了通向玄武洞窟的必经之站——黑土平原",
			instage:{
				0:[{"chara":"Aria","text":"真是荒芜的土地，怪不得一路上城里的人都迁走了呢……连Eli的祝福都失效了么？"},{"chara":"Charlotte","text":"躁动的气息……Eli不会出了什么事吧"},{"chara":"Tania","text":"安心吧，Eli的武艺可是比我还强呢~倒是我们得先解决这些杂鱼啊"}],
				1:[{"chara":"sys","text":"注意，这块区域的空气中充斥这莫名的躁动,恶魔们都变得疯狂了起来，<span>速度</span>以及<span>伤害</span>都得到了<span>加强</span>！<br /><br />但是疯狂让他们破绽百出，所以<span>生命值要比一般的怪物少</span>"}],
				5:[{"chara":"Tania","text":"喂喂这怪物的数量，要说是Eli手下的漏网之鱼也未免太多了吧！"},{"chara":"Charlotte","text":"所以Eli真的是出了什么事吧（哭"}],
				clear:[{"chara":"Aria","text":"到底是什么情况……这些炮灰还真是不要命的冲啊，被打到一下可真痛（揉着肩膀）"},{"chara":"Liara","text":"艾酱~来我帮你检查检查哈~（被Aria推开）"}],
			},
		},
		
		earthStage2:{
			title:"深窟凶兽",
			text:"走到玄武洞窟路口的众人，看到了从未设想过的场景……",
			instage:{
				0:[{"text":"（Aria嗅了嗅空气中浓厚的元素气味）"},{"chara":"Aria","text":"这是Eli的元素波动没错，可是为什么这么暴躁……"},{"chara":"Charlotte","text":"呜,希望Eli别出什么事情才好..."},{"chara":"Tania","text":"小心，又有东西来了！"}],
				6:[{"text":"（一只强壮的魔兽从洞窟内走出）"},{"chara":"StoneGiant","text":"......."},{"chara":"Charlette","text":"!!E..Eli?(目瞪口呆"},{"chara":"Tania","text":"喂不是吧!?"},{"chara":"Aria","text":"！！这确实是Eli的味道……可是为什么你变成了这幅模样！"},{"chara":"StoneGiant","text":"吼——！","sound":"giantSound"},{"chara":"Aria","text":"啧，只能先把你打趴下了吗！"}],
				clear:[{"chara":"StoneGiant","text":"（异化的Eli迅捷的逃回洞窟）","sound":"giantSound"},{"chara":"Charlotte","text":"呜呜Eli这是怎么了..书上一定有什么线索的..(拼命翻书找"},{"chara":"Liara","text":"我可不认识这样的Eli，不把你变回来我决不罢休！"},{"chara":"Tania","text":"跟我切磋武技的Eli……可不是这样只会用蛮力的野兽啊！"}],
			},
		},
		
		earthStage3:{
			title:"玄武之里",
			text:"众人来到了洞窟最深处，Eli退无可退",
			instage:{
				0:[{"chara":"Aria","text":"说好的正义的伙伴Eli呢？老娘非把你打醒不可！！！"},{"chara":"Tania","text":"就是就是,搞得姐姐我这么麻烦!"}],
				6:[{"chara":"Tania","text":"跟小喽啰的过家家游戏也玩腻了，正主儿该出来了吧！","stopAllSound":true},{"chara":"StoneGiant","text":"吼——！！！","sound":"giantSound"},{"chara":"Charlotte","text":"快醒来啊Eli!你..你再这样我..我也要射你了!"},{"chara":"Aria","text":"吃我有情破颜拳！","sound":"bossBgm"}],
				clear:[{"text":"（Eli恢复了原来的模样）","sound":"elfSpell"},{"chara":"Charlotte","text":"Eli是我们啊!你不认识我们了么!"},{"chara":"Eli","text":"啊..Char..Charlotte..我这是……（一脸茫然）"},{"chara":"Aria","text":"有情破颜拳！（狠狠敲了Eli的脑袋）"},{"chara":"Tania","text":"快给我说到底是怎么回事不然我砍了你哦！（拧住Eli的耳朵）"},{"chara":"Eli","text":"啊啊我想起来了……是Shannon那家伙！那天他说我的正义感太廉价，带我去看了人类城市中的丑恶,一想到我守护的都是写这样自私又无情的家伙,我就气不打一处来,结果一怒之下把土地的赐福取消了，自己也变成那副鬼模样……"},{"chara":"Tania","text":"Eli……纵使人类有种种不好,可是愤怒与暴力是带不来正义的啊。"},{"chara":"Charlotte","text":"原,原来是怪Shannon..?可是为什么Shannon要这么做呢？"},{"chara":"Aria","text":"谁知道呢……"},{"chara":"Aria","text":"不过我也正好要去找他，当面去问他吧。走！去弧光山脉！"}],
			},
		},
		
		thunderStage1:{
			title:"闪光的史莱姆",
			text:'在类精灵的结界——弧光山脉脚下，Aria碰到了也许比浮空城更"大"的挑战……',
			instage:{
				
				0:[{"chara":"Aria","text":"诶~弧光山脉有金矿吗？我以前怎么没听说过啊。"},{"chara":"Charlotte","text":"金矿……好像是不会动的吧？（翻书）"},{"chara":"Tania","text":"那是史莱姆呢。"},{"chara":"Aria","text":"诶？啊！！！"}],
				4:[{"chara":"Aria","text":"这搞毛啊！为什么史莱姆有这个体型！比之前的还要大啊！又是远古生物么！（抓狂）"},{"chara":"Liara","text":"据说魔导辐射会造成生物变异呢~就是相当于Aria你弄出来的哟~（坏笑）"},{"chara":"Charlotte","text":"诶诶!!Aria桑原来这么厉害!(眼睛放光)"},{"chara":"Aria","text":"_(:3J<)_求别说"}],
				clear:[{"chara":"Aria","text":"为什么史莱姆可以这么强……一定有人搞鬼对吧！！一定的！！！"},{"chara":"Charlotte","text":"难道史莱姆就是传说中的神兽么？我记得书上有写过在1200年前的混沌时代曾经..（一脸认真）"},{"chara":"Liara","text":"啊拉好可爱！～（捂脸）"},{"chara":"Tania","text":"离萝莉远点，你这百合女（拖走Liara）"},{"chara":"Eli","text":"这金色真是让人想到一个讨厌的家伙啊……"},{"text":"（众人继续前进，终于消失<删除线>在陷落地裂的史莱姆的视线中</删除线>）"}],
			},
		},
		
		thunderStage2:{
			title:"智者的试炼",
			text:"想要质问智者Shannon的Aria一行，终于来到了弧光山脉",
			instage:{
				0:[{"text":"（一道电光闪过，魔法师出现在众人面前）"},{"chara":"Shannon","text":"很好很好，各位能来到这里实在是给了我一个惊喜啊。"},{"chara":"Eli","text":"你这只会玩诡计的家伙，有种别跑跟我正面对决！"},{"chara":"Shannon","text":"有意思，那么Eli哟，打败我的仆从吧~就算你赢哦"},{"chara":"Eli","text":"戏弄我的账，给我还清吧！"}],
				1:[{"chara":"sys","text":"这一关是智者Shannon对你下的挑战。在这一关里，你有<span>几乎无限</span>的金钱，同时你也要对抗异常强大的怪物。<br /><br />如果你过不去，试试换种思路～"}],
				clear:[{"chara":"Shannon","text":"了不起，我输了"},{"chara":"Eli","text":"还敢再狂么你这家伙！"},{"chara":"Shannon","text":"呵，你这蛮牛还是一样的笨啊……Aria，我还是跟你说吧"},{"text":"（Aria止住了要发火的Eli）"},{"chara":"Aria","text":"你究竟是为了什么呢，我们的智者Shannon？"},{"chara":"Shannon","text":"是为了打败我的“傲慢”，削弱那个我的“傲慢”所具现的怪物。来吧，跟我走，去夺回我的力量，然后跟你们一起战斗。"},{"chara":"Eli","text":"（小声嘀咕）这家伙到底说的啥呢……"}],
			},
		},
		
		thunderStage3:{
			title:"雷霆崖上的弧光",
			text:"弧光山脉最险的悬崖上，电闪雷鸣……",
			instage:{
				0:[{"chara":"Aria","text":"啊呀呀，这雷打的……这一带的魔导通讯器完全用不了了呢。"},{"chara":"Liara","text":"这样下去翼东国会亏死的呢……","stopAllSound":true},{"chara":"Tania","text":"恩恩,翼东跪了的话莲瞳国可就赚大发了~"},{"chara":"Charlotte","text":"诶!会亏死么好可怜!Aria我们快救救它!(认真"},{"chara":"Aria","text":"好了，玩笑一会再开，我们快到了"},{"chara":"Charlotte","text":"什么！是开玩笑的么！Σ( ° △ °|||)"},{"chara":"Shannon","text":"就是它了，那个阴暗的我(指向山顶)"},{"chara":"Eli","text":"真是讨厌的气味，比现在这个你还讨厌得多啊……看我拆了它！","sound":"bossBgm"}],
				2:[{"chara":"Thunder","text":"就这种程度么？（雷之精华被打散后重新聚了起来，力量比刚才更强了）"},{"chara":"Aria","text":"切，就是嘴硬，跟Shannon这货一个德行.."},{"chara":"Liara","text":"（噗"}],
				3:[{"chara":"Thunder","text":"哼，你们是无法打败我的！（它再次聚了起来，又增强了）"},{"chara":"Tania","text":"诶有完没完啊！就不能老实点躺尸么！？"},{"chara":"Liara","text":"（噗"}],
				4:[{"chara":"Thunder","text":"我是不会输的！！（雷指精华身上爆发出强光，一分为二）"},{"chara":"Eli","text":"除了魔力以外比Shannon这货都弱得多的家伙也敢说自己不会输么！"},{"chara":"Charlotte","text":"诶!一只..两只..怎么多了一个!?(揉眼睛"},{"chara":"Liara","text":"（噗"}],
				clear:[{"chara":"Thunder","text":"不！怎么可能！！"},{"chara":"Thunder","text":"（傲慢的具象消失在一阵电光中，化为能量流回Shannon的身体）"},{"chara":"Shannon","text":"夺回这力量之后，我会不会再次变得傲慢呢……"},{"chara":"Charlotte","text":"Shannon是好人,一定不会的~ ω"},{"chara":"Eli","text":"不管怎么样，都结束了吧"},{"chara":"Aria","text":"不，现在才是真正的开始，走，把所有的力量解放，让我们这群老家伙再拯救一次世界吧！"},{"chara":"Liara","text":"嗯嗯~奴家无论哪里都和你一起去哟~ v"},{"chara":"Tania","text":"嘛,难得出门一次..就当减肥啦.."},{"chara":"Charlotte","text":"我,我也会帮忙的!(握拳)对吧Carlo?~"},{"chara":"Eli","text":"我刚犯下如此大错,现在正是赎罪的时候!"},{"chara":"Shannon","text":"哈哈哈哈,见各位信心满满,我再担心倒显得多余啦!"},{"chara":"Shannon","text":"那么事不宜迟,召唤师,结下破界之阵吧!"}],
			},
		},
		
		finalStage:{
			title:"终曲？浮空城",
			text:"旅途的终点……？",
			instage:{
				0:[{"text":"（与怪异的外表形成巨大的反差，浮空城内部刻满了古老的文字）","sound":"finalStageBgm"},{"chara":"Aria","text":"这是……？"},{"chara":"Shannon","text":"罪人们的庭院。"},{"chara":"Eli","text":"那是什么东西？你这家伙能不能说明白点。"},{"chara":"Charlotte","text":"这是突然消失的前古文明的遗迹哦。"},{"chara":"Shannon","text":"全部的事情，大概都是这东西搞的鬼吧。"},{"text":"（城内的王座上显现出一个怪异的身形）"},{"chara":"Master","text":"哦？居然还有人认得这文字么。"},{"chara":"Master","text":"（打量众人）难怪，原来是精灵。可是为什么你们要和这人类联手呢？"},{"chara":"Aria","text":"当然是为了打倒你这罪魁祸首！"},{"chara":"Master","text":"罪魁祸首么……人类，你可没资格说这话啊！"},{"chara":"Tania","text":"哎呀哎呀~看来是说不通咯~"},{"chara":"Eli","text":"休想再迷惑我！"}],
				3:[{"chara":"Crystal","text":"..我饿..我饿..我饿...","sound":"crystalSound"},{"chara":"Liara","text":"为什么还会出现这个水晶？！而且力量更强了！"},{"chara":"Master","text":"哈哈哈，有没有想到些什么呢，“勇者们”哟！"}],
				4:[{"chara":"Dragon","text":"吼!!!","sound":"dragonSound"},{"chara":"Tania","text":"我去!你这死龙还来讨打!?"},{"chara":"Aria","text":"揍它丫的!"}],
				5:[{"chara":"Carlo","text":".....(冷冷得盯着Charlotte)"},{"chara":"Charlotte","text":"Car..Carlo?你..你不是..?怎..怎么..?(快要哭出来"},{"chara":"Shannon","text":"(伸手拦住)别慌,好好看清楚"},{"chara":"Charlotte","text":"你!你不是Carlo!Carlo和我在一起!你到底是谁!为什么变成他的样子!"},{"chara":"Master","text":"哈~那么他到底是谁呢?"}],
				6:[{"chara":"StoneGiant","text":"正...义....","sound":"giantSound"},{"chara":"Eli","text":"什么!你是?..我?...不对!你是什么!竟然说正义?到底是怎么回事?"},{"chara":"Tania","text":"(拍肩)你还没看出来这只不过是Boss都出场一遍么..."},{"chara":"Liara","text":"(噗)不可以说出来呀Tania酱!~"},{"chara":"Master","text":"(什么..无意间打破了次元壁么..真是可怕的女人..."},{"chara":"sys","text":"亲爱的玩家,刚才你们什么也没看见</br>嗯,什么也没看见!"}],
				7:[{"chara":"Thunder","text":".....","sound":"teleport"},{"chara":"Eli","text":"啊!果然出现了!"},{"chara":"Liara","text":"(喂!"},{"chara":"Shannon","text":"...真是不堪回首的记忆呢(扶额"}],
				8:[{"chara":"Shannon","text":"原来是这样…暴食，懒惰，色欲，暴怒，傲慢…罪人们的庭院…是你让这些罪具现化的？","stopAllSound":true},{"chara":"Master","text":"我？雷之精灵哟，人类世界的肮脏，你不是带着那边的土之精灵一同欣赏了么？"},{"chara":"Aria","text":"别废话了，你这嫉妒新世界的老古董！带着你的怨念滚回废墟里吧！","sound":"bossBgm"}],
				clear:[{"chara":"Aria","text":"为什么，什么都没变化？","stopAllSound":true},{"chara":"Mater","text":"你真的认为一切都结束了么？你为何忘记了贪婪的罪？"},{"chara":"Aria","text":"！什么意思！？"},{"chara":"Master","text":"你真的不明白么，人类？永无止境的欲望才是让人类文明一次一次轮回悲剧的因啊。"},{"chara":"Aria","text":"我……我不承认……","sound":"titleBgm"},{"chara":"Master","text":"为什么说得这么没有底气？想必你也看到了这因为技术变得孱弱不堪的世界了吧？"},{"chara":"Master","text":"打倒我，然后掌控这王庭。可是，你真的要结束这难得宁静的大陆么？"},{"chara":"Aria","text":"......"},],
			},
		},		
	};
}

