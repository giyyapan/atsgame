var Static = {
	devSetting:{
		log:true
	},
	musicOn:true,
};
window.requestAnimationFrame = (function(){
    //Check for each browser
    //@paul_irish function
    //Globalises this function to work on any browser as each browser has a different namespace for this
    return  window.requestAnimationFrame       ||  //Chromium
    window.webkitRequestAnimationFrame ||  //Webkit
    window.mozRequestAnimationFrame    || //Mozilla Geko
    window.oRequestAnimationFrame      || //Opera Presto
    window.msRequestAnimationFrame     || //IE Trident?
    function(callback, element){ //Fallback function
        window.setTimeout(callback, 80);               
    }
})();
/*
var sysconsole = console;
console = {
	log:function (){
		if (!Static.devSetting.log){
			return;
		}
		sysconsole.log.apply(sysconsole,arguments);
	},
	warn:function (){
		if (!Static.devSetting.log){
			return;
		}
		sysconsole.warn.apply(sysconsole,arguments);
	},
	error:function (){
		if (!Static.devSetting.log){
			return;
		}
		sysconsole.error.apply(sysconsole,arguments);
	}
}
*/
