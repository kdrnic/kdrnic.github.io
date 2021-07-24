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
			var e = new entityConstructors[objLayer.objects[i].type]();
			e.Init(objLayer.objects[i]);
			entities.push(e);
		}
	}
}

function Start(){
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
	
	LoadImage("background.png");
	LoadImage("dynamite.png");
	LoadImage("dynamite1.png");
	LoadImage("dynamite2.png");
	LoadImage("citizen.png", ImageLoaded.bind(Citizen.prototype));
	LoadImage("guy.png", ImageLoaded.bind(Guy.prototype));
	LoadImage("matches.png", ImageLoaded.bind(Matches.prototype));
	LoadImage("parliament.png", ImageLoaded.bind(Parliament.prototype));
	LoadImage("explosion.png", ImageLoaded.bind(Explosion.prototype));
	
	Restart();
	
	window.requestAnimationFrame(Draw);
	lastFrameTime = Timestamp();
	setTimeout(Update, 0.95 * frameTime);
	
	frame = 0;
}

function Restart(){
	entities = [];
	entities.push(new Citizen());
	entities.push(new Citizen());
	entities.push(new Citizen());
	entities.push(new Guy());
	entities.push(new Dynamite());
	entities.push(new Matches());
	entities.push(new Parliament());
	times++;
	if(times > 8) GetAchievement("eight");
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
	
	var numDead = 0;
	for(var i = 0; i < entities.length; i++){
		if(entities[i] instanceof Citizen){
			if(entities[i].alive == false){
				numDead++;
			}
		}
	}
	if(numDead > 1) GetAchievement("genocide");
	
	lastFrameTime = Timestamp();
	setTimeout(Update, 0.95 * frameTime);
}

function Draw(){
	context.fillStyle = "#ffffff";
	context.fillRect(0, 0, 640, 480);
	
	if(numDataLoaded != numData){
		context.fillStyle = "#000000";
		context.font = "40px verdana"
		context.fillText("LOADING " + data.length + " of " + numData, 320, 240);
		window.requestAnimationFrame(Draw);
		return;
	}
	
	context.drawImage(data["background.png"], 0, 0);
	EntityDo("Draw");
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

function Explosion(){
	this.alive = true;
	this.life = 60;
	this.w = 64;
	this.h = 64;
	
	this.Draw = function (){
		context.save();
		context.translate(this.x, this.y);
		context.rotate(Math.random() * Math.PI * 2);
		context.drawImage(this.image, 0 - this.image.width / 2, 0 - this.image.height / 2);
		context.restore();
	}
	
	this.Update = function (){
		this.life--;
		if(this.life < 0) this.alive = false;
		for(var i = 0; i < entities.length; i++){
			if(!entities[i].alive) continue;
			if(Collision(this, entities[i])){
				if(entities[i].hasOwnProperty("Explode")) entities[i].Explode();
			}
		}
	}
}

function ImgDraw(){
	context.save();
	context.translate(this.x, this.y);
	context.drawImage(this.image, 0 - this.image.width / 2, 0 - this.image.height / 2);
	context.restore();
}

function Parliament(){
	this.w = 151;
	this.h = 130;
	this.alive = true;
		this.x = Math.random() * 640;
	this.y = Math.random() * 480;
	this.Draw = ImgDraw;
	this.Explode = function(){
		this.alive = false;
		GetAchievement("5thofnovember");
	}
}

function Citizen(){
	this.w = 52;
	this.h = 78;
	this.alive = true;
	this.Draw = ImgDraw;
	this.x = Math.random() * 640;
	this.y = Math.random() * 480;
	if(Math.random() < 0.5){
		this.dx = 1 - (Math.round(Math.random()) * 2);
		this.dy = 0;
	}
	else{
		this.dy = 1 - (Math.round(Math.random()) * 2);
		this.dx = 0;
	}
	this.Update = function(){
		this.x +=  this.dx;
		this.y += this.dy;
		if(this.x > 640) this.dx = -1;
		if(this.y > 480) this.dy = -1;
		if(this.x < 0) this.dx = 1;
		if(this.y < 0) this.dy = 1;
	}
	this.Explode = function(){
		GetAchievement("bomberman");
		this.alive = false;
	}
}

function Guy(){
	this.w = 59;
	this.h = 93;
	this.alive = true;
	this.Draw = ImgDraw;
	this.x = Math.random() * 640;
	this.y = Math.random() * 480;
	this.dynamite = false;
	this.matches = false;
	this.Update = function(){
		var dx = 0;
		var dy = 0;
		if(keys["keyLeft"].state) dx = -2;
		if(keys["keyRight"].state) dx = 2;
		if(keys["keyUp"].state) dy = -2;
		if(keys["keyDown"].state) dy = 2;
		if(this.x > 640) dx = -1;
		if(this.y > 480) dy = -1;
		if(this.x < 0) dx = 1;
		if(this.y < 0) dy = 1;
		this.x += dx;
		this.y += dy;
		if(this.dynamite) this.dynamite.x += dx;
		if(this.dynamite) this.dynamite.y += dy;
		if(keys["keyUse"].state){
			if(this.matches){
				if(this.dynamite){
					this.dynamite.set = true;
					this.matches = false;
				}
			}
		}
		if(keys["keyDrop"].state == 1){
			if(this.dynamite){
				this.dynamite = false;
			}
			else{
				for(var i = 0; i < entities.length; i++){
					if(!entities[i].alive) continue;
					if(Collision(this, entities[i])){
						if(entities[i] instanceof Dynamite) this.dynamite = entities[i];
						if(entities[i] instanceof Matches){
							this.matches = true;
							entities[i].alive = false;
						}
					}
				}
			}
			if(!this.matches){
				for(var i = 0; i < entities.length; i++){
					if(!entities[i].alive) continue;
					if(Collision(this, entities[i])){
						if(entities[i] instanceof Matches){
							this.matches = true;
							entities[i].alive = false;
						}
					}
				}
			}
		}
	}
	
	this.Explode = function(){
		GetAchievement("suicide");
		this.alive = false;
	}
}

function Dynamite(){
	this.w = 54;
	this.h = 52;
	this.alive = true;
	this.set = false;
	this.life = 90;
		this.x = Math.random() * 640;
	this.y = Math.random() * 480;
	this.Draw = function(){
		context.save();
		context.translate(this.x, this.y);
		img = data["dynamite.png"];
		if(this.set) img = data[["dynamite1.png", "dynamite2.png"][Math.round(Math.random())]];
		context.drawImage(img, 0 - img.width / 2, 0 - img.height / 2);
		context.restore();
	}
	this.Update = function(){
		if(this.set) this.life--;
		if(this.life < 0){
			this.alive = false;
			var expl = new Explosion();
			expl.x = this.x;
			expl.y = this.y;
			entities.push(expl);
		}
	}
}

function Matches(){
	this.alive = true;
	this.Draw = ImgDraw;
	this.w = 38;
	this.h = 33;
	
	this.x = Math.random() * 640;
	this.y = Math.random() * 480;
}