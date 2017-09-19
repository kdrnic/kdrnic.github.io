var mouse = {};
var pressed = [];
var entityConstructors = {};
var entities = [];
var lastFrameTime;
var frameTime = 1000 / 60;
var data = {};
var numData = 0;
var numDataLoaded = 0;
var messages = [];
var achievements = {};
var times = 0;
var camera = {x: 0, y: 0};
var numLaps = 3;

function Timestamp(){
  return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}

function MouseUpEvent(event){
	mouse.pressed[event.button] = false;
}

function MouseDownEvent(event){
	mouse.pressed[event.button] = true;
	
	var rect = canvas.getBoundingClientRect();
	mouse.x = ((event.clientX - rect.left) / rect.width) * canvas.width;
	mouse.y = ((event.clientY - rect.top) / rect.height) * canvas.height;
}

function LoadText(f, c){
	var msg = new XMLHttpRequest();
	msg.open("GET", f, true);
	msg.onreadystatechange = function(event){
		if(msg.readyState === 4){  
			if(msg.status === 200){
				data[f] = msg.responseText;
				numDataLoaded++;
				if(typeof c == "function") c(msg.responseText);
			}
			else{  
				console.log(msg.statusText);
			}  
		}
	}
	try{
		msg.send();
		numData++;
	}
	catch(e){
		console.log(e.message);
	}
}

function LoadImage(f, c){
	var img = new Image();
	img.onload = function(){
		data[f] = img;
		numDataLoaded++;
		if(typeof c == "function") c(img);
	}
	img.src = f;
	numData++;
}

function ImageLoaded(i){
	this.image = i;
}

function InitMap(jsonObj){
	var tileLayer = null, objLayer = null;
	for(var i = 0; i < jsonObj.layers.length; i++){
		if(jsonObj.layers[i].type == "tilelayer") tileLayer = jsonObj.layers[i];
		if(jsonObj.layers[i].type == "objectgroup") objLayer = jsonObj.layers[i];
	}
	if(tileLayer){
		map = [];
		tileTypes = {};
		for(var x = 0; x < tileLayer.width; x++){
			map[x] = [];
			for(var y = 0; y < tileLayer.height; y++){
				map[x][y] = tileLayer.data[x + y * tileLayer.width] - 1;
			}
		}
		for(var t in jsonObj.tilesets[0].tileproperties){
			tileTypes[t] = jsonObj.tilesets[0].tileproperties[t];
			tileTypes[t].collision = tileTypes[t].collision | 0;
		}
	}
	if(objLayer){
		for(var i = 0; i < objLayer.objects.length; i++){
			if(!entityConstructors.hasOwnProperty(objLayer.objects[i].type)) continue;
			var e = new entityConstructors[objLayer.objects[i].type](objLayer.objects[i]);
			entities.push(e);
		}
	}
}

function Start(){
	if(("" + window.location).indexOf("improvedPhysics") > 10) window.fixedPhysics = true;
	canvas = document.getElementById("screen");
	context = canvas.getContext("2d");
	
	window.addEventListener("keyup", function (event){
		pressed[event.keyCode] = false;
		event.preventDefault();
	});
	window.addEventListener("keydown", function (event){
		pressed[event.keyCode] = true;
	});
	
	mouse.pressed = [];
	canvas.addEventListener("mousedown", MouseDownEvent);
	canvas.addEventListener("mouseup", MouseUpEvent);
	
	LoadImage("carGreen.png", ImageLoaded.bind(GreenCar.prototype));
	LoadImage("carYellow.png", ImageLoaded.bind(YellowCar.prototype));
	LoadImage("carPurple.png", ImageLoaded.bind(PurpleCar.prototype));
	LoadImage("carRed.png", ImageLoaded.bind(RedCar.prototype));
	LoadImage("track.png");
	
	Restart();
	
	window.requestAnimationFrame(Draw);
	lastFrameTime = Timestamp();
	setTimeout(Update, 0.95 * frameTime);
	
	frame = 0;
}

function Restart(){
	entities = [];
	
	var c = new PurpleCar();
	c.x = 3777;
	c.y = 314;
	entities.push(c);
	
	c = new RedCar();
	c.x = 3777 + 200;
	c.y = 314;
	entities.push(c);
	
	c = new YellowCar();
	c.x = 3777;
	c.y = 314 + 150;
	entities.push(c);
	
	c = new GreenCar();
	c.x = 3777 + 200;
	c.y = 314 + 150;
	entities.push(c);
	
	var b1 = {
		x:0,
		y:0,
		width:1180,
		height:3000,
		progress: 1,
	};
	
	c = new InnerCircle();
	c.x = 348 + 1000;
	c.y = 472 + 1000;
	c.radius = 1000;
	c.box = b1;
	c.invert = false;
	entities.push(c);
	
	c = new OuterCircle();
	c.x = 112 + 2418 * 0.5;
	c.y = 270 + 2418 * 0.5;
	c.radius = 2418 * 0.5;
	c.box = b1;
	entities.push(c);
	
	var b2 = {
		x:7105,
		y:0,
		width:1300,
		height:3000,
		progress: 5
	};
	
	c = new InnerCircle();
	c.x = 5996 + 1000;
	c.y = 484 + 1000;
	c.radius = 1000;
	c.box = b2;
	c.invert = false;
	entities.push(c);
	
	c = new OuterCircle();
	c.x = 5832 + 2418 * 0.5;
	c.y = 259 + 2418 * 0.5;
	c.radius = 2418 * 0.5;
	c.box = b2;
	entities.push(c);
	
	var b3 = {
		x:3040,
		y:1200,
		width:2540,
		height:2224,
		progress: 3
	};
	
	c = new InnerCircle();
	c.x = 3180 + 2286 * 0.5;
	c.y = 1557 + 2286 * 0.5;
	c.radius = 2286 * 0.5;
	c.box = b3;
	c.invert = true;
	entities.push(c);
	
	c = new OuterCircle();
	c.x = 2972 + 2715 * 0.5;
	c.y = 1327 + 2715 * 0.5;
	c.radius = 2715 * 0.5;
	c.box = b3;
	entities.push(c);
	
	var b4 = {
		x: b1.x + b1.width,
		y: 0,
		width: b2.x - b1.x - b1.width,
		height: b3.y,
		progress: 0
	};
	
	c = new InnerCircle();
	c.x = 8360 * 0.5;
	c.y = -999999;
	c.radius = 258 + 999999;
	c.box = b4;
	c.invert = true;
	entities.push(c);
	
	c = new OuterCircle();
	c.x = 8360 * 0.5;
	c.y = -999999;
	c.radius = 450 + 999999 + 50;
	c.box = b4;
	entities.push(c);
	
	var b5 = {
		x: b4.x,
		y: b3.y,
		width: b3.x - b4.x,
		height: 9999,
		progress: 2
	};
	
	c = new InnerCircle();
	c.x = 8360 * 0.5;
	c.y = -999999;
	c.radius = 999999 + 2465;
	c.box = b5;
	c.invert = false;
	entities.push(c);
	
	c = new OuterCircle();
	c.x = 8360 * 0.5;
	c.y = -999999;
	c.radius = 999999 + 2675;
	c.box = b5;
	entities.push(c);
	
	var b6 = {
		x: b3.x + b3.width,
		y: b3.y,
		width: b2.x - b3.x - b3.width,
		height: 9999,
		progress: 4
	};
	
	c = new InnerCircle();
	c.x = 8360 * 0.5;
	c.y = -999999;
	c.radius = 999999 + 2465;
	c.box = b6;
	c.invert = false;
	entities.push(c);
	
	c = new OuterCircle();
	c.x = 8360 * 0.5;
	c.y = -999999;
	c.radius = 999999 + 2675;
	c.box = b6;
	entities.push(c);
	
	var b7 = {
		x: 2878,
		y: 2577,
		width: 2909,
		height: 329
	};
	
	c = new OuterCircle();
	c.x = 8360 * 0.5;
	c.y = -999999;
	c.radius = 999999 + 2675;
	c.box = b7;
	entities.push(c);
	
	var b8 = {
		x: 5030,
		y: 2521,
		width: 757,
		height: 385
	};
	
	c = new InnerCircle();
	c.x = 8360 * 0.5;
	c.y = -999999;
	c.radius = 999999 + 2465;
	c.box = b8;
	c.invert = false;
	c.ignoreCollision = true;
	entities.push(c);
	
	entities.push(new LapBox(3728, 247, 100, 270));
	
	times++;
}

function EntityDo(what){
	for(var i = 0; i < entities.length; i++){
		if(!entities[i].alive) continue;
		if(entities[i].hasOwnProperty(what)) entities[i][what]();
	}
}

function GetAchievement(ach){
	if(achievements[ach]) return;
	achievements[ach] = true;
	messages.push(480);
	var elem = document.getElementById("achievement" + ach);
	elem.src = "achievement" + ach + ".png";
}

function Update(){
	var t = Timestamp();
	while(t - lastFrameTime < frameTime){
		t = Timestamp();
	}
	if(numDataLoaded != numData){
		lastFrameTime = Timestamp();
		setTimeout(Update, 0.95 * frameTime);
		return;
	}
	
	frame++;
	UpdateKeys();
	EntityDo("Update");
	for(var i = 0; i < messages.length; i++) messages[i]-=3;
	if(keys["keyRestart"].state == 1) Restart();
	
	lastFrameTime = Timestamp();
	setTimeout(Update, 0.95 * frameTime);
}

function Draw(){
	context.fillStyle = "#ffffff";
	context.fillRect(0, 0, 640, 480);
	
	if(numDataLoaded != numData){
		context.fillStyle = "#000000";
		context.font = "40px verdana"
		context.fillText("LOADING " + numDataLoaded + " of " + numData, 0, 240);
		window.requestAnimationFrame(Draw);
		return;
	}
	
	context.save();
	context.translate(-camera.x, -camera.y);
	context.drawImage(data["track.png"], 0, 0);
	EntityDo("Draw");
	context.restore();
	
	for(var i = 0; i < messages.length; i++){
		context.fillStyle = "#ff0000";
		context.font = "40px verdana"
		context.fillText("ACHIEVEMENT UNLOCKED!!!!!!!!!!!", 0, messages[i]);
	}
	
	window.requestAnimationFrame(Draw);
}

function Collision(a, b){
	if(Math.abs(a.x - b.x) > (a.w + b.w) * 0.5) return false;
	if(Math.abs(a.y - b.y) > (a.h + b.h) * 0.5) return false;
	return true;
}

function Car() {
	this.progress = 0;
	this.frameProgress = 0;
	this.laps = 0;
	this.x = 0;
	this.y = 0;
	this.speedX = 0;
	this.speedY = 0;
	this.angle = 0;
	this.radius = 40;
	this.accel = 0.3;
	this._accel = 0.3;
	this.friction = 0.05;
	this.isCar = true;
	this.alive = true;
	
	this.Draw = function() {
		context.drawImage(this.image, this.angle * 100, 0, 100, 100, this.x - 50, this.y - 50, 100, 100);
		context.strokeStyle = "#FF00FF";
		if(window.debugMode) StrokeCircle(this.x, this.y, this.radius);
		
		context.fillStyle = "#ffffff";
		context.font = "20px verdana"
		context.fillText(this.laps.toString(10) + "/" + numLaps.toString(10), this.x - 25, this.y - 50);
	}
	
	this.Drive = function() {
		var circle = null;
		for(var i = 0; i < entities.length; i++) {
			var other = entities[i];
			if(!other.alive) continue;
			if(!(other instanceof InnerCircle)) continue;
			
			if(this.x + this.radius < other.box.x) continue;		
			if(this.x - this.radius > other.box.x + other.box.width) continue;
			if(this.y + this.radius < other.box.y) continue;
			if(this.y - this.radius > other.box.y + other.box.height) continue;
			
			circle = other;
			//break;
		}
		
		if(circle === null) return;
		
		function Angle(cx, cy, ex, ey) {
			var dy = ey - cy;
			var dx = ex - cx;
			var theta = Math.atan2(dy, dx); // range (-PI, PI]
			theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
			if (theta < 0) theta = 360 + theta; // range [0, 360)
			return theta;
		}
		
		var angle = Angle(this.x, this.y, circle.x, circle.y);
		if(circle.invert) angle = (angle + 180) % 360;
		//angle *= 57.2957795;
		
		if(angle < 22.5) this.angle = 3;
		else if(angle < 22.5 + 45) this.angle = 2;
		else if(angle < 22.5 + 45 + 45) this.angle = 1;
		else if(angle < 22.5 + 45 + 45 + 45) this.angle = 0;
		else if(angle < 22.5 + 45 + 45 + 45 + 45) this.angle = 7;
		else if(angle < 22.5 + 45 + 45 + 45 + 45 + 45) this.angle = 6;
		else if(angle < 22.5 + 45 + 45 + 45 + 45 + 45 + 45) this.angle = 5;
		else if(angle < 22.5 + 45 + 45 + 45 + 45 + 45 + 45 + 45) this.angle = 4;
		else this.angle = 3;
		
		this.circ = circle;
		this.circAngle = angle;
	}
	
	this.GetVelocity = function() {
		return Math.sqrt(Math.pow(this.speedX, 2) + Math.pow(this.speedY, 2));
	}
	
	this.FixedSolveCollision = function(other){
		var inverted = other instanceof OuterCircle;
		var carCol = other.isCar;
		var toOtherX = other.x - this.x;
		var toOtherY = other.y - this.y;
		if(inverted){
			toOtherX *= -1;
			toOtherY *= -1;
		}
		var toDist = Math.sqrt(toOtherX * toOtherX + toOtherY * toOtherY);
		var toNormFactor = 1 / toDist;
		toOtherX *= toNormFactor;
		toOtherY *= toNormFactor;
		var moveDist = toDist - this.radius - other.radius;
		if(inverted) moveDist = other.radius - this.radius - toDist;
		if(!carCol){
			this.x += toOtherX * moveDist;
			this.y += toOtherY * moveDist;
		}
		else {
			other.x -= toOtherX * moveDist * 0.5;
			other.y -= toOtherY * moveDist * 0.5;
		}
		var toDotProd = (this.speedX * toOtherX + this.speedY * toOtherY);
		if(toDotProd > 0){
			var toSpeedX =  toDotProd * toOtherX;
			var toSpeedY = toDotProd * toOtherY;
			var offSpeedX = this.speedX - toSpeedX;
			var offSpeedY = this.speedY - toSpeedY;
			this.speedX = offSpeedX - toSpeedX;
			this.speedY = offSpeedY - toSpeedY;
		}
	}
	
	this.Update = function() {
		this.Drive();
		switch(this.angle) {
			case 0:
				this.speedX -= this.accel * Math.sqrt(0.5);
				this.speedY -= this.accel * Math.sqrt(0.5);
				break;
			case 1:
				this.speedX -= this.accel;
				break;
			case 2:
				this.speedX -= this.accel * Math.sqrt(0.5);
				this.speedY += this.accel * Math.sqrt(0.5);
				break;
			case 3:
				this.speedY += this.accel;
				break;
			case 4:
				this.speedX += this.accel * Math.sqrt(0.5);
				this.speedY += this.accel * Math.sqrt(0.5);
				break;
			case 5:
				this.speedX += this.accel;
				break;
			case 6:
				this.speedX += this.accel * Math.sqrt(0.5);
				this.speedY -= this.accel * Math.sqrt(0.5);
				break;
			case 7:
				this.speedY -= this.accel;
				break;
		}
		this.speedX -= this.speedX * this.friction;
		this.speedY -= this.speedY * this.friction;
		
		this.x += this.speedX;
		this.y += this.speedY;
		
		for(var i = 0; i < entities.length; i++) {
			var other = entities[i];
			if(!other.alive) continue;
			if(!other.isCar) continue;
			if(other == this) continue;
			var dx = other.x - this.x;
			var dy = other.y - this.y;
			if(dx * dx + dy * dy > Math.pow(this.radius + other.radius, 2)) continue;
			
			if(window.fixedPhysics){
				this.FixedSolveCollision(other);
			}
			else {
			var midX = this.x + dx * (this.radius / (this.radius + other.radius));
			var midY = this.y + dx * (this.radius / (this.radius + other.radius));
			var vel = this.GetVelocity() + other.GetVelocity();
			vel *= 0.5;
			this.speedX = this.x - midX;
			this.speedY = this.y - midY;
			var normFactor = 1 / this.GetVelocity();
			this.speedX *= normFactor;
			this.speedY *= normFactor;
			this.speedX *= vel;
			this.speedY *= vel;
			}
		}
		
		for(var i = 0; i < entities.length; i++) {
			var other = entities[i];
			if(!other.alive) continue;
			if(!(other instanceof InnerCircle)) continue;
			
			//console.log("Inner circle found");
			
			if(this.x + this.radius < other.box.x) continue;		
			if(this.x - this.radius > other.box.x + other.box.width) continue;
			if(this.y + this.radius < other.box.y) continue;
			if(this.y - this.radius > other.box.y + other.box.height) continue;
			
			//console.log("Inner circle box collides");
			
			var dx = other.x - this.x;
			var dy = other.y - this.y;
			if(dx * dx + dy * dy > Math.pow(this.radius + other.radius, 2)) continue;
			
			//console.log("Inner circle radius collides");
			
			//this.circ = other;
			
			if(other.ignoreCollision) continue;
			
			
			
			if(window.fixedPhysics){
				this.FixedSolveCollision(other);
			}
			else{
			var vel = this.GetVelocity();
			this.speedX = this.x - other.x;
			this.speedY = this.y - other.y;
			var normFactor = 1 / this.GetVelocity();
			this.speedX *= normFactor;
			this.speedY *= normFactor;
			this.speedX *= vel;
			this.speedY *= vel;
			}
		}
		
		for(var i = 0; i < entities.length; i++) {
			var other = entities[i];
			if(!other.alive) continue;
			if(!(other instanceof OuterCircle)) continue;
			
			if(this.x + this.radius < other.box.x) continue;
			if(this.x - this.radius > other.box.x + other.box.width) continue;
			if(this.y + this.radius < other.box.y) continue;
			if(this.y - this.radius > other.box.y + other.box.height) continue;
			
			var dx = other.x - this.x;
			var dy = other.y - this.y;
			if(dx * dx + dy * dy < Math.pow(other.radius - this.radius, 2)) continue;
			
			if(window.fixedPhysics){
				this.FixedSolveCollision(other);
			}
			else {
			var vel = this.GetVelocity();
			this.speedX = other.x - this.x;
			this.speedY = other.y - this.y;
			var normFactor = 1 / this.GetVelocity();
			this.speedX *= normFactor;
			this.speedY *= normFactor;
			this.speedX *= vel;
			this.speedY *= vel;
			}
		}
	}
}

function GreenCar() {
	Car.apply(this);
}

function RedCar() {
	Car.apply(this);
}

function PurpleCar() {
	Car.apply(this);
	this.Drive = function() {
		camera.x = this.x - 320;
		camera.y = this.y - 240;
		if(keys["keyLeft"].state == 1) this.angle = (this.angle + 1) % 8;
		if(keys["keyRight"].state == 1) this.angle = (this.angle + 7) % 8;
		
		this.accel = (keys["keyUp"].state > 0) * this._accel;
		
		if(keys["keyUse"].state) (new Car()).Drive.apply(this);
	}
}

function YellowCar() {
	Car.apply(this);
}

StrokeCircle = function(x, y, r) {
	context.beginPath();
	context.arc(x,y,r,0,2*Math.PI);
	context.closePath();
	context.stroke();
}

function CircleDraw() {
	if(window.debugMode) {
		context.strokeStyle = "#0000ff";
		context.strokeRect(this.box.x, this.box.y, this.box.width, this.box.height);
		context.strokeStyle = "#ff0000";
		StrokeCircle(this.x, this.y, this.radius);
	}
}

function InnerCircle(x, y, r, b) {
	this.x = x;
	this.y = y;
	this.radius = r;
	this.box = b;
	this.alive = true;
	
	this.Draw = CircleDraw;
	
	this.Update = function() {
		if(!this.box.hasOwnProperty("progress")) return;
		for(var i = 0; i < entities.length; i++) {
			if(!entities[i].alive) continue;
			if(!entities[i].isCar) continue;
			
			if(entities[i].x + entities[i].radius < this.box.x) continue;
			if(entities[i].x - entities[i].radius > this.box.x + this.box.width) continue;
			if(entities[i].y + entities[i].radius < this.box.y) continue;
			if(entities[i].y - entities[i].radius > this.box.y + this.box.height) continue;
			
			if(entities[i].progress - this.box.progress == -1) entities[i].progress = this.box.progress;
		}
	}
}

function OuterCircle(x, y, r, b) {
	this.x = x;
	this.y = y;
	this.radius = r;
	this.box = b;
	this.alive = true;
	
	this.Draw = CircleDraw;
}

function LapBox(x,y,w,h) {
	this.alive = true;
	this.x = x;
	this.y = y;
	this.width = w;
	this.height = h;
	
	this.Draw = function() {
		context.strokeStyle = "#ffffff";
		if(window.debugMode) context.strokeRect(this.x, this.y, this.width, this.height);
	}
	
	this.Update = function() {
		for(var i = 0; i < entities.length; i++) {
			if(!entities[i].alive) continue;
			if(!entities[i].isCar) continue;
			
			if(entities[i].x + entities[i].radius < this.x) continue;
			if(entities[i].x - entities[i].radius > this.x + this.width) continue;
			if(entities[i].y + entities[i].radius < this.y) continue;
			if(entities[i].y - entities[i].radius > this.y + this.height) continue;
			
			if(entities[i].progress == 5) {
				entities[i].laps++;
				entities[i].progress = 0;
				entities[i].frameProgress = frame;
				
				if(entities[i].laps >= numLaps){
					if(entities[i].hasOwnProperty("Finish")) entities[i].Finish();
				}
			}
		}
	}
}