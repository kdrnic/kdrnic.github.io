var mouse = {};
var pressed = [];
var entityConstructors = {};
var entities = [];
var tileTypes = [];
var lastFrameTime;
var frameTime = 1000 / 60;
var moneys = [];
var hands = [];
var lifes = 5;
var score = 0;

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
	
	for(var i = 0; i < moneys.length; i++){
		var m = moneys[i];
		if(m.state == 0){
			var dx = m.x - mouse.x;
			var dy = m.y - mouse.y;
			var dist = Math.sqrt(dx * dx + dy * dy);
			if(dist < 44){
				m.state = 1;
			}
		}
	}
	
	for(var i = 0; i < hands.length; i++){
		var h = hands[i];
		if(mouse.x < h.x) continue;
		if(h.x + 837 < mouse.x) continue;
		if(mouse.y < h.y) continue;
		if(h.y + 43 < mouse.y) continue;
		h.forward = false;
		//if(h.hasOwnProperty("m")) delete h.m;
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
	
	AddHand();
	
	imgHandLeft = new Image();
	imgHandLeft.onload = function(){
		imgHandRight = new Image();
		imgHandRight.onload = function(){
			imgRoller = [];
			imgRoller[0] = new Image();
			imgRoller[0].onload = function(){
				imgRoller[1] = new Image();
				imgRoller[1].onload = function(){
					imgRoller[2] = new Image();
					imgRoller[2].onload = function(){
						imgCash = [];
						imgCash[0] = new Image();
						imgCash[0].onload = function(){
							imgCash[1] = new Image();
							imgCash[1].onload = function(){
								window.requestAnimationFrame(Draw);
								lastFrameTime = Timestamp();
								setTimeout(Update, 0.95 * frameTime);
							}
							imgCash[1].src = "cash2.png";
						}
						imgCash[0].src = "cash1.png";
					}
					imgRoller[2].src = "frame3.png";
				}
				imgRoller[1].src = "frame2.png";
			}
			imgRoller[0].src = "frame1.png";
		}
		imgHandRight.src = "hand.png";
	}
	imgHandLeft.src = "hand2.png";
	
	frame = 0;
}

function AddHand(){
	var h = {
		left: (Math.random() < 0.5),
		y: Math.random() * (480 - 60),
		forward: true
	};
	if(h.left){
		h.x = -837;
	}
	else{
		h.x = 640;
	}
	hands.push(h);
}

function Update(){
	var t = Timestamp();
	while(t - lastFrameTime < frameTime){
		t = Timestamp();
	}
	frame++;
	UpdateKeys();
	
	if(frame % 60 == 0){
		var m = {
			x: 320 - 50 + Math.random() * 80,
			y: -44,
			state: 0,
			angle: Math.random() * Math.PI * 2
		};
		moneys.push(m);
	}
	
	if(frame % (60 * 30) == 0) AddHand();
	
	for(var i = 0; i < moneys.length; i++){
		moneys[i].y += 3;
		if(moneys[i].y > 480 + 44){
			if(moneys[i].state == 0){
				lifes--;
			}
			else{
				score++;
			}
			moneys.splice(i, 1);
		}
	}
	
	for(var i = 0; i < hands.length; i++){
		var h = hands[i];
		if(h.left){
			if(h.forward){
				h.x += 5;
				if(h.x + 837 > 320 + 25 + 40){
					h.forward = false;
					for(var j = 0; j < moneys.length; j++){
						if(moneys[j].y + 22 < h.y) continue;
						if(h.y + 43 < moneys[j].y) continue;
						h.m = moneys[j];
						moneys.splice(j, 1);
					}
				}
			}
			else{
				h.x -= 5;
				if(h.x < -837){
					if(h.hasOwnProperty("m")){
						lifes--;
					}
					hands.splice(i, 1);
					AddHand();
				}
			}
		}
		else{
			if(h.forward){
				h.x -= 5;
				if(h.x < 320 - 25 - 40){
					h.forward = false;
					for(var j = 0; j < moneys.length; j++){
						if(moneys[j].y + 44 < h.y) continue;
						if(h.y + 43 < moneys[j].y) continue;
						h.m = moneys[j];
						moneys.splice(j, 1);
					}
				}
			}
			else{
				h.x += 5;
				if(h.x > 640){
					if(h.hasOwnProperty("m")){
						lifes--;
					}
					hands.splice(i, 1);
					AddHand();
				}
			}
		}
	}
	
	lastFrameTime = Timestamp();
	setTimeout(Update, 0.95 * frameTime);
}

function Draw(){
	context.fillStyle = "#ffffff";
	context.fillRect(0, 0, 640, 480);
	
	context.drawImage(imgRoller[Math.floor(frame / 7) % 3], 320 - 50, 0);
	
	for(var i = 0; i < moneys.length; i++){
		var m = moneys[i];
		if(m.state > 1) continue;
		context.save();
		context.translate(m.x, m.y);
		context.rotate(m.angle);
		context.drawImage(imgCash[m.state], 0 - imgCash[m.state].width / 2, 0 - imgCash[m.state].height / 2);
		context.restore();
	}
	
	for(var i = 0; i < hands.length; i++){
		var h = hands[i];
		
		if(h.left){
			context.drawImage(imgHandLeft, h.x, h.y);
		}
		else{
			context.drawImage(imgHandRight, h.x, h.y);
		}
		
		if(h.hasOwnProperty("m")){
			context.save();
			if(!h.left){
				context.translate(h.x, h.y);
			}
			else{
				context.translate(h.x + 837, h.y);
			}
			context.rotate(h.m.angle);
			context.drawImage(imgCash[h.m.state], 0 - imgCash[h.m.state].width / 2, 0 - imgCash[h.m.state].height / 2);
			context.restore();
		}
	}
	
	context.fillStyle = "#000000";
	context.font = "15px verdana"
	context.fillText("Lifes: " + lifes + " Score: $" + score, 100, 100);
	
	if(lifes < 0){
		context.fillStyle = "#000000";
		context.font = "40px verdana"
		context.fillText("GAME OVER" + lifes, 320, 240);
	}
	
	window.requestAnimationFrame(Draw);
}