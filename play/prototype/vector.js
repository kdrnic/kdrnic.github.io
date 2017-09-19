function Vector(x, y, z){
	this.x = 0;
	this.y = 0;
	this.Length = function(){
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
	this.Multiply = function(factor){
		this.x *= factor;
		this.y *= factor;
		return this;
	}
	this.Normalize = function(){
		this.Multiply(1 / this.Length());
		return this;
	}
	this.Add = function(x){
		this.x += x.x;
		this.y += x.y;
		return this;
	}
	this.Sub = function(x){
		this.x -= x.x;
		this.y -= x.y;
		return this;
	}
	this.Set = function(x, y){
		if(x instanceof Vector){
			this.x = x.x;
			this.y = x.y;
		}
		if(typeof x == "number"){
			this.x = x;
			this.y = y;
		}
		return this;
	}
	this.Clamp = function(min, max){
		this.x = Math.max(min.x, this.x);
		this.y = Math.max(min.y, this.y);
		this.x = Math.min(max.x, this.x);
		this.y = Math.min(max.y, this.y);
		return this;
	}
	this.Dot = function(v){
		return this.x * v.x + this.y * v.y;
	}
	this.Rotate = function(a){
		this.x = this.x * Math.cos(a) - this.y * Math.sin(a);
		this.y = this.x * Math.sin(a) + this.y * Math.cos(a);
		return this;
	}
	this.Set(x, y);
}