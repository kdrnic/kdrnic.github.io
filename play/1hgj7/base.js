var mouse = {};
var keyPressed = [];
var entityConstructors = {};
var entities = [];
var lastFrameTime;
var frameTime = 1000 / 60;
var data = {};
var numData = 0;
var numDataLoaded = 0;
var times = 0;
var keyUps = [];
var keyDowns = [];
var stage = 0;
var speedFactor = 1.0;
var score = 0;
var started = false;
var debugMode = false;
var hiScore = 0;
var transition = 1.0;
var decorations = [];
var stageStart = 0;

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
	audioCtx = new AudioContext();
	
	canvas = document.getElementById("screen");
	context = canvas.getContext("2d");
	
	window.addEventListener("keyup", function (event){
		if(keyPressed[event.keyCode]) keyUps.push(event.keyCode);
		keyPressed[event.keyCode] = false;
		if(!(event.ctrlKey || event.shiftKey)) event.preventDefault();
	});
	window.addEventListener("keydown", function (event){
		if(!keyPressed[event.keyCode]) keyDowns.push(event.keyCode);
		keyPressed[event.keyCode] = true;
		if(!(event.ctrlKey || event.shiftKey)) event.preventDefault();
	});
	
	mouse.pressed = [];
	canvas.addEventListener("mousedown", MouseDownEvent);
	canvas.addEventListener("mouseup", MouseUpEvent);
	
	LoadImage("bomb1.png", ImageLoaded.bind(Bomb.prototype));
	LoadImage("error500.png", ImageLoaded.bind(Error500.prototype));
	LoadImage("br.png", ImageLoaded.bind(Br.prototype));
	LoadImage("cake.png", ImageLoaded.bind(Cake.prototype));
	LoadImage("candle2.png", ImageLoaded.bind(Candle.prototype));
	LoadImage("cash.png", ImageLoaded.bind(Cash.prototype));
	LoadImage("drnick.png", ImageLoaded.bind(Drnick.prototype));
	LoadImage("drnickSad.png", function(i){Drnick.prototype.imageSad = i;});
	LoadImage("explosion.png", ImageLoaded.bind(Explosion.prototype));
	LoadImage("hand.png", ImageLoaded.bind(Hand.prototype));
	LoadImage("heart.png", ImageLoaded.bind(Heart.prototype));
	LoadImage("heartLeft.png", ImageLoaded.bind(HeartLeft.prototype));
	LoadImage("heartRight.png", ImageLoaded.bind(HeartRight.prototype));
	LoadImage("mouth.png", ImageLoaded.bind(Mouth.prototype));
	LoadImage("stoicism.png", ImageLoaded.bind(Stoicism.prototype));
	LoadImage("terrorist.png", ImageLoaded.bind(Terrorist.prototype));
	LoadImage("bg0.jpg");
	LoadImage("bg1.jpg");
	LoadImage("bg2.jpg");
	LoadImage("bg3.jpg");
	LoadImage("confetti1.png");
	LoadImage("confetti2.png");
	LoadImage("confetti3.png");
	LoadImage("flag.png");
	
	window.requestAnimationFrame(Draw);
	lastFrameTime = Timestamp();
	setTimeout(Update, 0.95 * frameTime);
	
	frame = 0;
}

function Restart(){
	entities = [];
	stage = stageStart;
	score = 0;
	speedFactor = 1.0;
	entities.push(player = new Drnick());
	entities.push(new [Error500, Cake, Stage2Spawner, Terrorist][stageStart]());
	times++;
}

function EntityDo(what, param){
	entities.filter(e => typeof e[what] == "function").forEach(function(e){e[what](param);});
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
	if(!started){
		Restart();
		started = true;
	}
	
	transition += 0.025;
	
	var oldStage = stage;
	frame++;
	EntityDo("Update");
	entities = entities.filter(e => !e.dead);
	keyUps.forEach(function(k){EntityDo("OnKeyUp", k);});
	keyDowns.forEach(function(k){EntityDo("OnKeyDown", k);});
	keyUps = [];
	keyDowns = [];
	if(keyPressed[keyCodes["VK_R"]] == 1) Restart();
	hiScore = Math.max(score, hiScore);
	if(oldStage != stage){
		transition = 0.0;
	}
	
	if(((stage == 1) || (stage == 3)) && (frame % 15 == 0)){
		decorations.push({
			x: (Math.random() * 640) - 12.5,
			y: -56,
			image: (stage == 1) ? data["confetti" + (Math.floor(Math.random() * 3) + 1) + ".png"] : data["flag.png"]
		});
	}
	decorations = decorations.filter(c => c.y < 480);
	decorations.forEach(function(c){c.y += 4});
	
	lastFrameTime = Timestamp();
	setTimeout(Update, 0.95 * frameTime);
}

function Draw(){
	context.fillStyle = "#ffffff";
	context.fillRect(0, 0, 640, 480);
	
	if(numDataLoaded != numData){
		context.fillStyle = "#000000";
		context.font = "40px verdana";
		context.fillText("LOADING " + data.length + " of " + numData, 320, 240);
		window.requestAnimationFrame(Draw);
		return;
	}
	
	if(transition < 0.9999){
		context.globalAlpha = 1.0;
		context.drawImage(data["bg" + ((stage - 1 >= 0)? stage - 1 : 3) + ".jpg"], 0, 0);
		context.globalAlpha = transition;
		context.drawImage(data["bg" + stage + ".jpg"], 0, 0);
		context.globalAlpha = 1.0;
	}
	else context.drawImage(data["bg" + stage + ".jpg"], 0, 0);
	decorations.forEach(function(d){
		context.drawImage(d.image, d.x, d.y);
	});
	EntityDo("Draw");
	context.fillStyle = "#000000";
	context.font = "12px verdana";
	var stageStrs = ["drnick has a certain frustration today", "bitslap's birthday", "drnick is selected for paid thing", "an european shooting"];
	context.fillText("SCORE: " + score + " HIGHSCORE: " + hiScore + " STAGE: " + stageStrs[stage], 0, 12);
	
	if(typeof player != "undefined"){
		if(player.sad){
			context.fillStyle = "#ff0000";
			context.font = "30px verdana";
			context.fillText("GAME OVER", 0, 240 - 15);
			context.font = "20px verdana";
			var sadStrs = ["Love will never come", "The years go by but nothing changes", "Why work so hard when life gives you nothing", "The world is full of awful people"];
			context.fillText(((lastSpeedFactor >= 1.5) && (score <= 75 * 2)) ? "That's right, why even try when there's no point" : sadStrs[player.stageSad], 0, 240 + 15);
		}
	}
	
	if(debugMode){
		entities.forEach(function(e){
			context.strokeRect(e.pos.x + e.offset.x, e.pos.y + e.offset.y, e.size.x, e.size.y);
		});
	}
	
	window.requestAnimationFrame(Draw);
}

function EntityCollision(a, b){
	if(a.pos.x + a.offset.x > b.pos.x + b.offset.x + b.size.x) return false;
	if(a.pos.y + a.offset.y > b.pos.y + b.offset.y + b.size.y) return false;
	if(b.pos.x + b.offset.x > a.pos.x + a.offset.x + a.size.x) return false;
	if(b.pos.y + b.offset.y > a.pos.y + a.offset.y + a.size.y) return false;
	return true;
}

function ImgDraw(){
	context.save();
	context.translate(this.pos.x, this.pos.y);
	context.drawImage(this.image, 0 - (this.imgOffset ? this.imgOffset.x : 0), 0 - (this.imgOffset ? this.imgOffset.y : 0));
	context.restore();
}

function RotDraw(){
	context.save();
	context.translate(this.pos.x, this.pos.y);
	context.rotate(this.imgAngle);
	context.drawImage(this.image, 0 - this.imgOffset.x, 0 - this.imgOffset.y);
	context.restore();
}

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
	this.Set(x, y);
}

function Entity(){
	this.pos = new Vector();
	this.size = new Vector();
	this.offset = new Vector();
}

function Drnick(){
	Entity.apply(this);
	
	this.speed = 6;
	this.size.Set(48, 55);
	this.offset.Set(18, 3);
	this.pos.Set(320, 240);
	this.sad = false;
	this.coolDown = 0;
	
	this.Update = function(){
		this.coolDown--;
		var spd = new Vector(0,0);
		if(keyPressed[keyCodes["VK_LEFT"]]) spd.Add(new Vector(-1,0));
		if(keyPressed[keyCodes["VK_RIGHT"]]) spd.Add(new Vector(1,0));
		if(keyPressed[keyCodes["VK_DOWN"]]) spd.Add(new Vector(0,1));
		if(keyPressed[keyCodes["VK_UP"]]) spd.Add(new Vector(0,-1));
		if((spd.Length() != 0)&&(!this.sad)) this.pos.Add(spd.Normalize().Multiply(this.speed));
		this.pos.Clamp((new Vector(this.offset)).Multiply(-1), new Vector(640 - this.size.x - this.offset.x, 480 - this.size.y - this.offset.y));
		
		if(entities.filter((e => e.isEnemy && EntityCollision(this, e)).bind(this)).length > 0){
			if(!this.sad){
				this.sad = true;
				this.image = this.imageSad;
				this.stageSad = stage;
				lastSpeedFactor = speedFactor;
			}
		}
	}
	
	this.OnKeyDown = function(key){
		if((key == keyCodes["VK_SPACE"]) && (!this.sad) && (this.coolDown <= 0)){
			switch(stage){
				case 0:
					var s = new Stoicism();
					s.pos.Set((new Vector(40,0)).Add(this.pos));
					entities.push(s);
					break;
				case 1:
					var m = new Mouth();
					m.pos.Set((new Vector(40,35)).Add(this.pos));
					entities.push(m);
					break;
				case 2:
					break;
				case 3:
					var b = new Br();
					b.pos.Add(this.pos);
					entities.push(b);
					break;
			}
			this.coolDown = 25;
		}
	}
	
	this.Draw = ImgDraw;
}

function Enemy(){
	Entity.apply(this);
	
	this.isEnemy = true;
}

function Error500(){
	Enemy.apply(this);
	this.pos.Set(320 - this.image.width * 0.5, 0 - this.image.height);
	
	this.offset.Set(27, 1);
	this.size.Set(66, 63);
	
	this.counter = 0;
	this.dx = 1 - (Math.round(Math.random()) * 2);
	this.speed = 2.0;
	
	this.Update = function(){
		this.pos.y += this.speed * speedFactor;
		if(this.pos.y >= 0) this.Update = function(){
			this.pos.x += this.dx * this.speed * speedFactor;
			if(this.pos.x < 0) this.dx = 1;
			if(this.pos.x + this.size.x > 640) this.dx = -1;
			
			this.counter += speedFactor;
			
			if(Math.floor(this.counter / 60) - Math.floor((this.counter - speedFactor) / 60) == 1){
				var h = new Heart();
				h.pos.Set(46, 24);
				h.pos.Add(this.pos);
				entities.push(h);
			}
			
			if(this.counter > 600 * speedFactor){
				this.Update = function(){
					this.pos.y -= this.speed * speedFactor;
					if(this.pos.y < 0 - this.image.height){
						this.dead = true;
						stage = 1;
						
						var c = new Cake();
						entities.push(c);
					}
				}
			}
		}
	}
	
	this.Draw = ImgDraw;
}

function Heart(){
	Enemy.apply(this);
	
	this.speed = 4.0;
	
	this.offset.Set(this.image.width * 0.05, this.image.height * 0.05);
	this.size.Set(this.image.width * 0.9, this.image.height * 0.9);
	
	this.Update = function(){
		if(typeof this.yDivide == "undefined"){
			this.yDivide = this.pos.y + 100 + Math.random() * 110;
		}
		
		this.pos.y += this.speed * speedFactor;
		if(this.pos.y > this.yDivide){
			var hL = new HeartLeft();
			var hR = new HeartRight();
			hL.pos.Set(this.pos);
			hR.pos.Set(this.pos);
			entities.push(hL);
			entities.push(hR);
			this.dead = true;
		}
	}
	
	this.Draw = ImgDraw;
}

function HeartLeft(){
	Enemy.apply(this);
	
	this.speed = 4.0;
	
	this.offset.Set(this.image.width * 0.05, this.image.height * 0.05);
	this.size.Set(34 * 0.9, this.image.height * 0.9);
	
	this.Update = function(){
		this.pos.Add((new Vector(-1, 1)).Normalize().Multiply(this.speed * speedFactor));
		if(this.pos.y > 480){
			this.dead = true;
		}
	}
	
	this.Draw = ImgDraw;
}

function HeartRight(){
	Enemy.apply(this);
	
	this.speed = 4.0;
	
	this.offset.Set(this.image.width * 0.05 + 34, this.image.height * 0.05);
	this.size.Set(34 * 0.7, this.image.height * 0.9);
	
	this.Update = function(){
		this.pos.Add((new Vector(1, 1)).Normalize().Multiply(this.speed * speedFactor));
		if(this.pos.y > 480){
			this.dead = true;
		}
	}
	
	this.Draw = ImgDraw;
}

function Cake(){
	Enemy.apply(this);
	this.offset.Set(this.image.width * 0.05, this.image.height * 0.05);
	this.size.Set(this.image.width * 0.9, this.image.height * 0.9);
	this.pos.Set(640, 240 - this.image.height * 0.5);
	
	this.amplitude = 0.75;
	this.fof = Math.PI * 0.3;
	this.speed = 1.5;
	this.dy = 1 - (Math.round(Math.random()) * 2);
	
	this.candles = 0;
	
	this.counter = 0;
	
	this.phase = Math.random() * Math.PI * 2;
	
	this.Update = function(){
		this.pos.x -= this.speed * speedFactor;
		if(this.pos.x + this.image.width + this.amplitude <= 640) this.Update = function(){
			this.pos.y += this.dy * this.speed * speedFactor;
			if(this.pos.y < 0) this.dy = 1;
			if(this.pos.y + this.image.height > 480) this.dy = -1;
			this.pos.x += Math.sin((frame / 10) * speedFactor) * this.amplitude;
			
			this.counter += speedFactor;
			
			if(Math.floor(this.counter / 20) - Math.floor((this.counter - speedFactor) / 20) == 1){
				var c = new Candle();
				c.pos.Set(this.image.width * 0.5, 1);
				c.pos.Add(this.pos);
				c.vel.Set(Math.cos(Math.PI + Math.sin(this.counter + this.phase) * this.fof) * 5 * speedFactor, Math.sin(Math.PI + Math.sin(this.counter + this.phase) * this.fof) * 5 * speedFactor);
				entities.push(c);
				this.candles++;
			}
			
			if(this.candles >= 32){
				this.Update = function(){
					this.pos.x += this.speed * speedFactor;
					if(this.pos.x > 640){
						this.dead = true;
						stage = 2;
						
						var s = new Stage2Spawner();
						entities.push(s);
					}
				}
			}
		}
	}
	
	this.Draw = ImgDraw;
}

screenBox = {
	pos: new Vector(0, 0),
	size: new Vector(640, 480),
	offset: new Vector(0, 0)
};

function Candle(){
	Enemy.apply(this);
	this.vel = new Vector();
	
	this.imgOffset = new Vector(this.image.width * 0.5, this.image.height * 0.5);
	this.imgAngle = 0;
	this.size.Set(this.image.width * 0.9, this.image.width * 0.9);
	this.offset.Set(0 - this.image.width * 0.9 * 0.5, 0 - this.image.width * 0.9 * 0.5);
	
	this.Update = function(){
		this.pos.Add(this.vel);
		if(!EntityCollision(this, screenBox)){
			this.dead = true;
		}
		this.imgAngle += speedFactor * 0.1;
	}
	
	this.Draw = RotDraw;
}

function Stoicism(){
	Entity.apply(this);
	
	this.size.Set(this.image.width, this.image.height);
	
	this.Update = function(){
		this.pos.y -= 4;
		
		if(!EntityCollision(this, screenBox)){
			this.dead = true;
		}
		
		if(entities.filter((e => (e instanceof Error500) && EntityCollision(this, e)).bind(this)).length > 0){
			this.dead = true;
			if(!player.sad) score += 100;
		}
	}
	
	this.Draw = ImgDraw;
}

function Mouth(){
	Entity.apply(this);
	
	this.size.Set(this.image.width, this.image.height);
	
	this.Update = function(){
		this.pos.x += 4;
		
		if(!EntityCollision(this, screenBox)){
			this.dead = true;
		}
		
		if(entities.filter((e => (e instanceof Cake) && EntityCollision(this, e)).bind(this)).length > 0){
			this.dead = true;
			if(!player.sad) score += 50;
		}
	}
	
	this.Draw = ImgDraw;
}

function Br(){
	Entity.apply(this);
	
	this.size.Set(this.image.width, this.image.height);
	
	this.Update = function(){
		this.pos.x += 4;
		
		if(!EntityCollision(this, screenBox)){
			this.dead = true;
		}
		
		if(entities.filter((e => (e instanceof Terrorist) && EntityCollision(this, e)).bind(this)).length > 0){
			this.dead = true;
			if(!player.sad) score += 25;
		}
	}
	
	this.Draw = ImgDraw;
}

function Cash(){
	Entity.apply(this);
	
	this.imgOffset = new Vector(this.image.width * 0.5, this.image.height * 0.5);
	this.imgAngle = 0;
	this.size.Set(this.image.width * 0.5, this.image.width * 0.5);
	this.offset.Set(0 - this.image.width * 0.25, 0 - this.image.height * 0.25);
	
	this.pos.Set(320, 240);
	var ang = Math.random() * Math.PI * 2;
	this.vel = new Vector(Math.cos(ang) * 3.5, Math.sin(ang) * 3.5);
	this.pos.Add((new Vector(this.vel)).Multiply(0 - this.pos.Length() - this.size.Length()));
	
	this.inScreen = false;
	
	this.Update = function(){
		this.pos.Add(this.vel);
		
		this.imgAngle += 0.1;
		
		if(EntityCollision(this, screenBox)){
			this.inScreen = true;
		}
		else if(this.inScreen){
			this.dead = true;
		}
		
		
		if(entities.filter((e => (e instanceof Drnick) && EntityCollision(this, e)).bind(this)).length > 0){
			this.dead = true;
			if(!player.sad) score += 75;
		}
	}
	
	this.Draw = RotDraw;
}

function Hand(){
	Enemy.apply(this);
	
	var angle = Math.random() * Math.PI * 2;
	this.imgOffset = new Vector(787, 28);
	this.imgAngle = angle;
	this.vel = new Vector(Math.cos(angle), Math.sin(angle)).Multiply(3.75 * speedFactor);
	
	this.size.Set(35, 35);
	this.offset.Set(this.size).Multiply(-0.5);
	
	this.pos.Set(320, 240);
	this.counter = 0;
	while(EntityCollision(this, screenBox)){
		this.pos.Sub(this.vel);
		this.counter++;
	}
	//console.log(new Vector(this.offset).Add(this.pos));
	
	this.Update = function(){
		this.pos.Add(this.vel);
		this.counter--;
		if(this.counter == 0) this.vel.Multiply(-1);
		if(this.counter < 0){
			if(!EntityCollision(screenBox, this)){
				this.dead = true;
			}
		}
	}
	
	this.Draw = RotDraw;
}

function Stage2Spawner(){
	Entity.apply(this);
	
	this.life = 0;
	this.counter = 0;
	
	this.Update = function(){
		this.counter += speedFactor;
		
		if(this.life < 5 * 60){
			if(Math.floor(this.counter / 45) - Math.floor((this.counter - speedFactor) / 45) == 1){
				var c = new Cash();
				entities.push(c);
			}
		}
		
		if(Math.floor(this.counter / 60) - Math.floor((this.counter - speedFactor) / 60) == 1){
			var h = new Hand();
			entities.push(h);
		}
		
		this.life++;
		if(this.life > 10 * 60){
			this.dead = true;
			stage = 3;
			var t = new Terrorist();
			entities.push(t);
		}
	}
}

function Terrorist(){
	Enemy.apply(this);
	this.offset.Set(this.image.width * 0.05, this.image.height * 0.05);
	this.size.Set(this.image.width * 0.9, this.image.height * 0.9);
	this.speed = 3;
	this.bombSpeed = 4;
	
	switch(Math.floor(Math.random() * 4)){
		case 0:
			this.pos.Set(0 - this.image.width, (Math.random() * (480 + this.image.height * 2)) - this.image.height);
			break;
		case 1:
			this.pos.Set(640, (Math.random() * (480 + this.image.height * 2)) - this.image.height);
			break;
		case 2:
			this.pos.Set((Math.random() * (640 + this.image.width * 2)) - this.image.width, 0 - this.image.height);
			break;
		case 3:
			this.pos.Set((Math.random() * (640 + this.image.width * 2)) - this.image.width, 480);
			break;
	}
	
	this.goTo = new Vector();
	this.RandomGoTo = function(){
		this.goTo.Set(Math.random() * (640 - this.image.width), Math.random() * (480 - this.image.height));
	}
	this.ThinkMove = function(){
		this.vel = (new Vector(this.goTo)).Sub(this.pos);
		this.vel.Add(new Vector(0.0001, 0.0001));
		this.counter = this.vel.Length() / (this.speed * speedFactor);
		this.vel.Normalize().Multiply(this.speed * speedFactor);
	}
	
	this.RandomGoTo();
	this.ThinkMove();
	
	this.bombCounter = 0;
	
	this.life = 0;
	this.Update = function(){
		this.life++;
		this.counter--;
		this.pos.Add(this.vel);
		if(this.counter < 0){
			if(this.life < 10 * 60){
				this.RandomGoTo();
				this.ThinkMove();
			}
			if(this.life > 10 * 60){
				this.dead = true;
				stage = 0;
				var b = new Error500();
				entities.push(b);
				
				speedFactor += 0.25;
			}
		}
		if(this.life == 10 * 60){
			switch(Math.floor(Math.random() * 4)){
				case 0:
					this.goTo.Set(0 - this.image.width, (Math.random() * (480 + this.image.height * 2)) - this.image.height);
					break;
				case 1:
					this.goTo.Set(640, (Math.random() * (480 + this.image.height * 2)) - this.image.height);
					break;
				case 2:
					this.goTo.Set((Math.random() * (640 + this.image.width * 2)) - this.image.width, 0 - this.image.height);
					break;
				case 3:
					this.goTo.Set((Math.random() * (640 + this.image.width * 2)) - this.image.width, 480);
					break;
			}
			this.ThinkMove();
		}
		this.bombCounter += speedFactor;
		if(Math.floor(this.bombCounter / 45) - Math.floor((this.bombCounter - speedFactor) / 45) == 1){
			var b = new Bomb();
			b.pos.Set(this.size).Multiply(0.5).Add(this.pos);
			b.vel.Set(player.size).Multiply(0.5).Add(player.pos).Add(player.offset).Sub(b.pos);
			b.life = b.vel.Length() / (this.bombSpeed * speedFactor);
			b.vel.Normalize().Multiply(this.bombSpeed * speedFactor);
			entities.push(b);
		}
	}
	
	this.Draw = ImgDraw;
}

function Bomb(){
	Enemy.apply(this);
	this.vel = new Vector();
	
	this.size.Set(40, 40);
	this.offset.Set(this.size).Multiply(-0.5);
	this.imgOffset = new Vector(25, 41);
	this.imgAngle = 0;
	
	this.Update = function(){
		this.pos.Add(this.vel);
		this.life--;
		if(this.life < 0){
			this.dead = true;
			var e = new Explosion();
			e.pos.Set(this.pos);
			entities.push(e);
		}
		this.imgAngle += 0.15 * speedFactor;
	}
	
	this.Draw = RotDraw;
}

function Explosion(){
	Enemy.apply(this);
	this.size.Set(this.image.width, this.image.height);
	this.imgOffset = new Vector(this.size).Multiply(0.5);
	this.imgAngle = 0;
	this.size.Multiply(0.8);
	this.offset.Set(this.size).Multiply(-0.5);
	this.life = 45;
	
	this.Update = function(){
		this.life--;
		if(this.life < 0){
			this.dead = true;
		}
		this.imgAngle = Math.random() * Math.PI * 2;
	}
	
	this.Draw = RotDraw;
}