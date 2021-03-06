var fs = require('fs');
var rcsDir = '/home/giyya/server/game/test.story';
fs.readFile(rcsDir,'utf-8',function(err,text){
	if(err) throw err;
	parseStory(text);
});
function ifObjectEmpty(object){
	for(var name in object){
		return false;
	}
	return true;
}
function parseStory(text){
	var storyOutput = {};
	var stageObjects = text.split("\n\n");
	var nowStageObj;
	var nowWaveStoryArr;
	for (var i = 0; i < stageObjects.length; i++){
		var objEvents = stageObjects[i].split("\n");
		for (var j = 0; j < objEvents.length; j++){
			var nowItme = objEvents[j];
			if(nowItme.indexOf("/")==0) continue;
			if(nowItme.indexOf('#') == 0){
				var stageName = nowItme.slice(1,nowItme.length);
				storyOutput[stageName] = {};
				nowStageObj = storyOutput[stageName];
				continue;
			}
			if(nowItme.indexOf("*")==0){
				var waveName = nowItme.slice(1,nowItme.length);
				console.log(waveName);
				if(waveName != "clear")
					waveName *= 1;
				nowStageObj[waveName] = [];
				nowWaveStoryArr = nowStageObj[waveName];
				continue;
			}
			var textStartIndex = nowItme.indexOf("：");
			if(textStartIndex == -1){
				textStartIndex = nowItme.indexOf(":");
			}
			if(textStartIndex > -1){
				var text = nowItme.slice(textStartIndex+1,nowItme.length);
				var chara = nowItme.slice(0,textStartIndex);
				nowWaveStoryArr.push({
					chara:chara,
					text:text,
				});
			}else{
				nowWaveStoryArr.push({
					text:nowItme,
				});
			}
		}
	}
	for(var i in storyOutput){
		console.log("---------------------"),
		console.log(i);
		console.log("");
		var nowStageStory = storyOutput[i];
		for(var j in nowStageStory){
			//console.log();
			//console.log(j);
			console.log(j+":"+JSON.stringify(nowStageStory[j])+",");
		}
		console.log("");
		console.log("---------------------")
	}
	
	//var newText = JSON.stringify(storyOutput);
	//console.log(newText);
	//console.log(storyOutput);
}
