var Network = {}
Network.testLink = function (callbackFuncs){
    if (typeof callbackFuncs.success !== 'function'){
	console.error("testLink success callback undefined");
	return false;
    }
    //Network.showMessage("测试连接..",true);
    $.ajax({
	url:"./server/testlink.php",
	timeout:5000,
	async:false,
	cache:false,
	success:function (data,textStatus){
	    //Network.showMessage("连接成功！");
	    if (data === 'true'){
		callbackFuncs.success();
	    }else{
		alert(data);
	    }
	},
	error:function (XMLHttpRequest,textStatus,errorThrow){
	    //Network.showMessage("连接失败,进行离线游戏");
	    if (typeof callbackFuncs.fail === 'function'){
		callbackFuncs.fail(errorThrow);
	    }
	}
    })
}
Network.getUserData = function (isAsync,callback){
    var isAsync = false;
    Network.showMessage("获取数据..",true);
    $.ajax({
	url:"./server/getUserData.php",
	timeout:5000,
	async:isAsync,
	cache:false,
	data:{
	    uuid:localStorage.uuid,
	},
	success:function (data,textStatus){
	    try{
		res = JSON.parse(data);
	    }catch(e){
		console.error(e);
		console.error(data);
		return;
	    }
	    if (res.succeed == true||res.succeed === 'true'){
		//Network.showMessage("获取成功！");
		if (typeof callback === 'function'){
		    try{
			callback(res);						
		    }catch(e){
			console.error(e);
		    }
		}
	    }else{
		Network.showMessage("同步失败，请在有网络连接后刷新");
		console.error(res);
	    }
	},
	error:function (XMLHttpRequest,textStatus,errorThrow){
	    Network.showMessage("同步失败，请在有网络连接后刷新");
	    console.error(errorThrow);
	}
    });
}
Network.getChallengeScores = function (challengeName,callback){
    Network.showMessage("获取数据..",true);
    $.ajax({
	url:"./server/getChallengeScores.php",
	timeout:5000,
	async:false,
	cache:false,
	data:{
	    challengeName:challengeName,
	},
	success:function (data,textStatus){
	    try{
		res = JSON.parse(data);
	    }catch(e){
		console.error(e,data);
		return;
	    }
	    if (res.succeed == true||res.succeed === 'true'){
		Network.showMessage("获取成功！");
		if (typeof callback === 'function'){
		    try{
			callback(res);						
		    }catch(e){
			console.error(e);
		    }
		}
	    }else{
		Network.showMessage("同步失败，请在有网络连接后刷新");
		console.error(res);
	    }
	},
	error:function (XMLHttpRequest,textStatus,errorThrow){
	    Network.showMessage("同步失败，请在有网络连接后刷新");
	    console.error(errorThrow);
	}
    });
}
Network.uploadChallengeScore = function (challengeName,username,score,dataValue,time,uploadKey,callback){
    var uploadTime = uploadKey.time;
    Network.showMessage("上传挑战分数..",true)
    $.ajax({
	url:"./server/uploadChallengeScore.php",
	timeout:5000,
	async:false,
	cache:false,
	data:{
	    challengeName:challengeName,
	    username:username,
	    score:score,
	    time:time,
	    uploadTime:uploadTime,
	    dataValue:dataValue,
	},
	success:function (data,textStatus){
	    try{
		res = JSON.parse(data);
	    }catch(e){
		console.error("error!",data);
		return;
	    }
	    if (res.succeed == true||res.succeed === 'true'){
		//Network.showMessage("分数已经上传");
		if (typeof callback === 'function'){
		    try{
			callback(res);						
		    }catch(e){
			console.error(e);
		    }
		}
	    }else{
		Network.showMessage("上传失败");
		console.error(res);
	    }
	},
	error:function (XMLHttpRequest,textStatus,errorThrow){
	    Network.showMessage("上传失败，将在网络可用时上传");
	}
    });
}
Network.updateUserData = function (dataJStr,dataValue,encodeKey,silent,callback){
    var time = encodeKey.time;
    if (!silent){
	//Network.showMessage("数据上传中..",true)		
    }
    $.ajax({
	url:"./server/updateUserData.php",
	timeout:5000,
	async:true,
	cache:false,
	data:{
	    uuid:localStorage.uuid,
	    updateTime:time,
	    dataJStr:dataJStr,
	    dataValue:dataValue,
	},
	success:function (data,textStatus){
	    try{
		res = JSON.parse(data);
	    }catch(e){
		console.error("error!",data);
		return;
	    }
	    if (res.succeed == true||res.succeed === 'true'){
		if (!silent){
		    Network.showMessage("数据已上传,请刷新其他设备上的页面以同步");					
		}
		localStorage.dataUpdateTime = time;
		if (typeof callback === 'function'){
		    try{
			callback(res);						
		    }catch(e){
			console.error(e);
		    }
		}
	    }else{
		if (res.errType == 'cheat'){
		    //alert('咳咳..我建议你还是不要作弊为好～ 重置游戏吧骚年!')
		}
		if (!silent){
		    Network.showMessage("上传失败，请检查网络连接");
		}
		console.error(res);
	    }
	},
	error:function (XMLHttpRequest,textStatus,errorThrow){
	    if (!silent){
		Network.showMessage("上传失败，请检查网络连接");	
	    }
	}
    });
    /*
    $.ajax({
	url:"./server/testUpdateUserData.php",
	timeout:5000,
	async:true,
	cache:false,
	data:{
	    uuid:localStorage.uuid,
	    updateTime:time,
	    dataJStr:dataJStr,
	    dataValue:dataValue,
	},
	success:function (data,textStatus){
	    try{
		res = JSON.parse(data);
	    }catch(e){
		console.error("error!",data);
		return;
	    }
	    if (res.succeed == true||res.succeed === 'true'){
		if (!silent){
		    Network.showMessage("数据已上传,请刷新其他设备上的页面以同步");					
		}
		localStorage.dataUpdateTime = time;
		if (typeof callback === 'function'){
		    try{
			callback(res);						
		    }catch(e){
			console.error(e);
		    }
		}
	    }else{
		if (res.errType == 'cheat'){
		    //alert('咳咳..我建议你还是不要作弊为好～ 重置游戏吧骚年!')
		}
		if (!silent){
		    Network.showMessage("上传失败，请检查网络连接");
		}
		console.error(res);
	    }
	},
	error:function (XMLHttpRequest,textStatus,errorThrow){
	    if (!silent){
		Network.showMessage("上传失败，请检查网络连接");	
	    }
	}
    });*/
}
Network.regist = function (username,password,dataJStr,callback){
    var encodedPassword = password?calcMD5(password):"";
    $.ajax({
	url:"./server/regist.php",
	timeout:5000,
	async:false,
	cache:false,
	data:{
	    username:username,
	    dataJStr:dataJStr,
	    password:encodedPassword,
	},
	success:function (data,textStatus){
	    try{
		res = JSON.parse(data);
	    }catch(e){
		console.error("error!",data);
		return;
	    }
	    if (res.succeed == true||res.succeed === 'true'){
		console.log(res);
		Network.showMessage("注册成功！");
		localStorage.uuid = res.uuid;
		if (typeof callback === 'function'){
		    try{
			callback(res);						
		    }catch(e){
			console.error(e);
		    }
		}

	    }else{
		switch(res.errNum){
		case '001' :
		    $("#loginBoxHint").html("用户名被占用，换一个吧");
		    $("#loginBoxHint").addClass('loginBoxError');
		    break;
		}
		console.error(res);
	    }
	},
	error:function (XMLHttpRequest,textStatus,errorThrow){
	    Network.showMessage("网络错误！首次进入游戏必须有网路环境！");
	}
    });
}
Network.login = function (username,password,callback){
    var encodedPassword = password?calcMD5(password):"";
    console.log(encodedPassword);
    $.ajax({
	url:"./server/login.php",
	timeout:5000,
	async:false,
	cache:false,
	data:{
	    username:username,
	    password:encodedPassword,
	},
	success:function (data,textStatus){
	    try{
		res = JSON.parse(data);
	    }catch(e){
		console.error("error!",data);
		return;
	    }
	    if (res.succeed == true||res.succeed === 'true'){
		Network.showMessage("登录成功!你可以在System界面切换帐号");
		localStorage.uuid = res.uuid;
		localStorage.dataUpdateTime = 1;
		if (typeof callback === 'function'){
		    try{
			callback(res);						
		    }catch(e){
			console.error(e);
		    }
		}
	    }else{
		Network.showMessage("登录失败");
		switch(res.errNum){
		case '001' :
		    $("#loginBoxHint").html("没有这个用户");
		    $("#loginBoxHint").addClass('loginBoxError');
		    break;
		case '002' :
		    $("#loginBoxHint").html("密码错误");
		    $("#loginBoxHint").addClass('loginBoxError');
		    break;
		}
		console.error(res);
	    }
	},
	error:function (XMLHttpRequest,textStatus,errorThrow){
	    Network.showMessage("网络错误!");
	}
    });
}
Network.showMessage = function (message,isProcessing){
    if (!this.messageBox){
	this.messageBox = {
	    J:$('#networkMessageBox'),
	    node:$('#networkMessageBox')[0],
	};
    }
    console.log("show network message:",message);
    var self = this;
    var old = this.messageBox.J.html();
    this.messageBox.J.html(old+'<br/>'+message);
    this.messageBox.J.slideDown("fast");
    this.lastMessageTime = new Date().getTime();
    setTimeout(function (){
	var nowTime = new Date().getTime();
	if (nowTime - self.lastMessageTime > 1450){
	    self.messageBox.J.slideUp("fast",function (){
		self.messageBox.J.html('');
	    });
	}
    },1500);
}
