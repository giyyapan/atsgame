window.onload = function(){
	//return;
	var game = new Game();
	console.log("start");
	$("#waitPage").fadeOut(null,function(){
		$("#waitPage").hide();
		game.start();
	});
}
