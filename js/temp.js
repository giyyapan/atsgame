var Class = function (){}
Class.sub = function (){
	var parent = this;
	var c = function (){
		parent.call(this);
		if(c.prototype._init){
			c.prototype._init.apply(this,arguments);
		}
	}
	c.parent = this;
	//c.prototype = new c.parent();
	for(var item in c.parent.prototype ){
		if(typeof c.parent.prototype[item] == "function")
			c.prototype[item] = c.parent.prototype[item];
	}
	c.prototype.parent = c.parent;
	c.prototype._class = c;
	c.sub = Class.sub;
	c.extend = Class.extend;
	return c;
}
var Class1 = Class.sub();
Class1.prototype._init = function (){
	this.a = "aaaa"
}
Class1.prototype.a1 = function (){
	console.log(this.a)
}

var Class2 = Class1.sub();
Class2.prototype._init = function (){
	this.parent.call(this);
	this.b = "bbbb"
}
Class2.prototype.b1 = function (){
	console.log(this.b)
}

a = new Class2();
a.a1();
a.b1();
console.log(Class2.prototype)


