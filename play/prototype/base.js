var mouse = {};
var keyPressed = {};
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
var debugMode = false;
var started = false;
var sprites = [];
var scrollX = 0;
var scrollY = 0;
var gameStarted = false;
var ntscOn = false;
var score = 0;
var level = 1;
var xp = 0;
var paused = false;

function Img2Imgs(img, w, h){
	var c = document.createElement("canvas");
	c.width = w;
	c.height = h;
	var ctx = c.getContext("2d");
	var imgs = [];
	for(var y = 0; y < (img.height / h) >> 0; y++){
		for(var x = 0; x < (img.width / w) >> 0; x++){
			ctx.clearRect (0, 0, c.width, c.height);
			ctx.drawImage(img, x * w, y * h, w, h, 0, 0, w, h);
			var i = new Image();
			i.src = c.toDataURL();
			imgs.push(i);
		}
	}
	return imgs;
}

function ImageToTransparent(img, colour){
	colour = colour ? colour : bgColour;
	var tmp = document.createElement("canvas");
	tmp.width = img.width;
	tmp.height = img.height;
	var tmpC = tmp.getContext("2d");
	tmpC.drawImage(img, 0, 0);
	var tmpD = tmpC.getImageData(0, 0, img.width, img.height);
	for(var i = 0; i < tmpD.data.length; i += 4){
		var r = tmpD.data[i];
		var g = tmpD.data[i + 1];
		var b = tmpD.data[i + 2];
		if(r == colour.r && g == colour.g && b == colour.b) tmpD.data[i + 3] = 0;
	}
	tmpC.putImageData(tmpD, 0, 0);
	return tmp;
}

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
		numData++;
		msg.send();
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

function Start(){
	audioCtx = new AudioContext();
	gainNodes = [];
	for(var i = 1; i <= 10; i++){
		var gn = audioCtx.createGain();
		gn.gain.value = i / 10;
		gainNodes[i - 1] = gn;
		gainNodes[i - 1].connect(audioCtx.destination);
	}
	
	canvas = document.getElementById("screen");
	context = canvas.getContext("2d");
	
	window.addEventListener("keyup", function (event){
		if(keyPressed[event.keyCode]) keyUps[event.keyCode] = true;
		keyPressed[event.keyCode] = false;
		if(!(event.ctrlKey || event.shiftKey)) event.preventDefault();
	});
	window.addEventListener("keydown", function (event){
		if(!keyPressed[event.keyCode]) keyDowns[event.keyCode] = true;
		keyPressed[event.keyCode] = true;
		if(!(event.ctrlKey || event.shiftKey)) event.preventDefault();
	});
	
	mouse.pressed = [];
	canvas.addEventListener("mousedown", MouseDownEvent);
	canvas.addEventListener("mouseup", MouseUpEvent);
	
	LoadImage("player2.png");
	LoadImage("fonts.png");
	LoadText("level1.json");
	LoadImage("tileset1.png");
	
	window.requestAnimationFrame(Draw);
	lastFrameTime = Timestamp();
	setTimeout(Update, 0.95 * frameTime);
	
	ntsc = new NTSC(320);
	ntsc.result.style.width = 640;
	ntsc.result.style.width = 480;
	
	frame = 0;
	fillStyle = "sdfjhsdiufhdsiuf";
}

function EntityDo(what, param){
	entities.filter(e => typeof e[what] == "function").forEach(function(e){e[what](param);});
}

function InitGame(){
	bg = new SimpleMap(JSON.parse(data["level1.json"]));
	bg.InitEntities(entityConstructors, entities);
	bgColour = {
		r: 0xB5,
		g: 0xDF,
		b: 0xE4
	};
	gameStarted = true;
	tileset = ImageToTransparent(data["tileset1.png"]);
	font = new BitmapFont(data["fonts.png"], null, 8, 8, 0, 0, 16 * 8);
	levelTheme = document.getElementById("levelTheme");
	levelTheme.play();
	currentTheme = levelTheme;
	bossTheme = document.getElementById("bossTheme");
	victoryTheme = document.getElementById("victoryTheme");
}

function CreateSfxr(json){
	var s = new sfxr.Sound();
	var json_ = JSON.parse(json);
	for(var i in json_) {
		s[i] = json_[i];
	}
	return s;
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
	else{
		if(!gameStarted) InitGame();
	}
	
	if(!paused){
		frame++;
		sprites = [];
		EntityDo("Update");
		entities = entities.filter(e => !e.dead);
	}
	if(keyDowns[keyCodes.VK_S]){
		if(paused) currentTheme.play();
		else currentTheme.pause();
		paused = !paused;
	}
	keyUps = {};
	keyDowns = {};
	
	lastFrameTime = Timestamp();
	setTimeout(Update, 0.95 * frameTime);
}

function DrawSprite(spr){
	halfW = Math.floor(spr.image.width / 2);
	halfH = Math.floor(spr.image.height / 2);
	context.save();
	context.translate(Math.floor(spr.x) + halfW, Math.floor(spr.y) + halfH);
	context.scale(spr.flipH ? -1 : 1, spr.flipV ? -1 : 1);
	context.rotate(spr.angle | 0);
	context.drawImage(spr.image, 0 - halfW, 0 - halfH);
	context.restore();
}

function SetFillStyle(c){
	var tmp = "#" + c.r.toString(16) + c.g.toString(16) + c.b.toString(16);
	if(fillStyle != tmp){
		context.fillStyle = tmp;
		fillStyle = tmp;
	}
}

function Draw(){
	if(numDataLoaded != numData){
		context.fillStyle = "#000000";
		context.clearRect(0, 0, 256, 224);
		context.font = "40px verdana";
		context.fillText("LOADING " + data.length + " of " + numData, 320, 240);
		window.requestAnimationFrame(Draw);
		return;
	}
	if(!gameStarted){
		window.requestAnimationFrame(Draw);
		return;
	}
	
	SetFillStyle(bgColour);
	context.fillRect(0, 0, 256, 224);
	context.save();
	context.translate(-Math.floor(scrollX), -Math.floor(scrollY));
	sprites.filter(s=>s.behind).forEach(DrawSprite);
	if(bg){
		bg.Draw(context, tileset, Math.floor(scrollX / 8), Math.floor(scrollY / 8), 33, 28);
	}
	sprites.filter(s=>!(s.behind)).forEach(DrawSprite);
	context.restore();
	
	var health = entities.filter((e => e instanceof Player))[0].health;
	font.WriteLine(context, "TIME: " + (Math.floor(frame / (60 * 60)) % 60).toString(10) + ":" + ((Math.floor(frame / 60) % 60) < 10 ? "0" : "") + (Math.floor(frame / 60) % 60).toString(10) + "\nHEALTH: " + health + "%\nLVL " + ["","I","II","III","IV","V"][level] + "\nXP: " + xp, 4, 4);
	
	if(ntscOn){
		ntsc.Render(canvas);
	}
	
	window.requestAnimationFrame(Draw);
}

function BBCollision(a, b){
	return !((a.x > b.x + b.width) || (b.x > a.x + a.width) || (a.y < b.y - b.height) || (b.y < a.y - a.height));
}

function SwitchNTSC(){
	var c = document.getElementById("canvasContainer");
	var on = c.contains(ntsc.result);
	c.removeChild(on ? ntsc.result : canvas);
	c.appendChild(on ? canvas : ntsc.result);
	ntscOn = !ntscOn;
}