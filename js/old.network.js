var Network = {}
if (!Static){
    var Static = {};
	// will be overwirte by Static.js
}
Network.testLink = function (callbackFuncs){
	if (typeof callbackFuncs.success !== 'function'){
		console.error("testLink success callback undefined");
		return false;
	}
	//Network.showMessage("测试连接..",true);
	$.ajax({
		url:"/server/testlink.php",
		timeout:3000,
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
	Network.showMessage("同步数据..",true);
	$.ajax({
		url:"/server/getUserData.php",
		timeout:3000,
		async:isAsync,
		cache:false,
		data:{
			uuid:localStorage.uuid,
		},
		success:function (data,textStatus){
			try{
				res = JSON.parse(data);
			}catch(e){
				console.error("error!",data);
				return;
			}
			if (res.succeed == true||res.succeed === 'true'){
				//Network.showMessage("同步成功");
				console.log(res);
				if (!Static.userData || res.updateTime > localStorage.dataUpdateTime){
					Network.showMessage("使用服务器档案");
					Static.userData = res.dataJStr;
					localStorage.userData = JSON.stringify(Static.userData);
				}else{
					Network.showMessage("上传当前档案到服务器");
					Static.updateUserData(true);
				}
				if (typeof callback === 'function'){
					callback();
				}
			}else{
				Network.showMessage("同步失败,使用本地档案进行游戏");
				console.error(res);
				Network.useLocalData();
			}
		},
		error:function (XMLHttpRequest,textStatus,errorThrow){
			Network.showMessage("同步失败，使用本地档案进行游戏");
			console.error(errorThrow);
			Network.useLocalData();
		}
	});
}
Network.updateUserData = function (isAsync,callback){
	if (!Static.userData){
		console.error("no data when update");
		return;
	}
	Network.showMessage("数据上传中..",true)
	var nowTime = new Date().getTime();
	$.ajax({
		url:"/server/updateUserData.php",
		timeout:3000,
		async:true,
		cache:false,
		data:{
			uuid:localStorage.uuid,
			updateTime:nowTime,
			dataJStr:localStorage.userData,
		},
		success:function (data,textStatus){
			try{
				res = JSON.parse(data);
			}catch(e){
				console.error("error!",data);
				return;
			}
			if (res.succeed == true||res.succeed === 'true'){
				Network.showMessage("数据已上传,请刷新其他设备上的页面以同步");
				localStorage.dataUpdateTime = nowTime;
				if (typeof callback === 'function'){
					callback();
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
Network.regist = function (username,password,callback){
	Static.userData.userName = username;
	console.log(JSON.stringify(Static.userData));
	var encodedPassword = password?calcMD5(password):"";
	$.ajax({
		url:"/server/regist.php",
		timeout:3000,
		async:false,
		cache:false,
		data:{
			username:username,
			dataJStr:JSON.stringify(Static.userData),
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
				if (Static.userData.clearedStageNo > -1){
					Static.userData.userName = username;
					Network.showMessage("检测到游戏数据，上传到服务器");
				}
				Static.updateUserData(true);
				if (typeof callback === 'function'){
					callback();
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
		url:"/server/login.php",
		timeout:3000,
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
				Static.getUserData(true);
				
				Network.showMessage("欢迎回来，"+Static.userData.userName);
				if (typeof callback === 'function'){
					callback();
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
	console.warn("show network message:",message);
	var self = this;
	var old = this.messageBox.J.html();
	this.messageBox.J.html(old+'<br/>'+message);
	this.messageBox.J.slideDown("fast");
	this.lastMessageTime = new Date().getTime();
	setTimeout(function (){
		var nowTime = new Date().getTime();
		if (nowTime - self.lastMessageTime > 1900){
			self.messageBox.J.slideUp("fast",function (){
				self.messageBox.J.html('');
			});
		}
	},2000);
}
Network.useLocalData = function (){
	if (localStorage.userData == 'undefined'){
		Static.newUserData();
		console.error("localStorage.userData undefined!!");
	}else{
		try{
			Static.userData = JSON.parse(localStorage.userData);
		}catch(e){
			Static.newUserData();
		}
	}
	localStorage.dataUpdateTime = new Date().getTime();
}
