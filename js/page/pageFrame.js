var PageElement  = Class.sub();
var PageElement = Class.sub();
PageElement.prototype._init = function(type,id,container,info){
	if(!id)return;
	if(typeof type != "string"){
		console.error("PageFrame Error! type is not string!",type)
		return;
	}
	if(typeof id != "string"){
		console.error("PageFrame Error! id is not string!",id)
		return;
	}

	if($("#"+id)){
		$("#"+id).remove();
		//console.log("remove id "+id );
	}
	var htmlText = "<"+type;
	htmlText += " id='"+id+"'";
	if(info && info.class) htmlText += " class='"+info.class+"'";
	if(type == "img" || type == "input"){
		if(info && info.src)
			htmlText+= ('src="' + info.src + '"');
		if(info && info.type)
			htmlText+= ('type="' + info.type + '"');
		if(info && info.value)
			htmlText+= ('value="' + info.value + '"');

		htmlText += "/>";
	}else{
		htmlText += ">";
		if(info && info.text) htmlText += info.text;
		htmlText += "</"+type+">";
		
	}
	//console.log("new eleent : "+id);
	if(container){
		//console.log(container.J)
		if(!container.J){
			console.error("PageFrame Error! container is not a PageElement!",container)
			return;
		}
		container.J.append(htmlText);
	}else{
		$("body").append(htmlText);
	}
	this.id = id;
	this.container = container;
	this.J = $("#"+id);
	this.node = this.J[0];

	if(info && info.z) this.J.css("z-index",info.z);
}
var PageDiv = PageElement.sub();
PageDiv.prototype._init = function (id,container,info){
	PageDiv.parent.call(this,"div",id,container,info);
}
var PageButton = PageElement.sub();
PageButton.prototype._init = function (id,container,info){
	if (!info || !info.text){
		if (!info){
			info = {};
		}
		info.text = id;
	}
	PageButton.parent.call(this,"button",id,container,info);
	if(info && info.class){
		this.className = info.class;
	}
}
