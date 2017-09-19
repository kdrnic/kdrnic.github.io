function Extend(b, a){
	a.prototype = Object.create(b.prototype);
	a.prototype.constructor = a;
	a.parent = b;
}

function Entity(obj){
	this.x = obj ? obj.x : 0;
	this.y = obj ? obj.y : 0;
	this.xSpeed = this.ySpeed = 0;
	this.width = (obj && obj.width) ? obj.width : 0;
	this.height = (obj && obj.height) ? obj.height : 0;
	this.id = (obj && obj.hasOwnProperty("id")) ? obj.id : 0;
}

function Character(obj){
	Character.parent.call(this, obj);
	this.head = 1;
	this.width = 21;
	this.height = 24;
	this.frame = 0;
	this.walkFrames = this.stillFrames = 0;
}
Extend(Entity, Character);
Character.prototype.physics = {				// Megaman II physics
	gravity: 0x40 / 0x100,
	jumpSpeed: -(0x04 + 0xDF / 0x100),
	maxFallingSpeed: 0x07,
	minDropSpeed: -(0x2 + 0x1F / 0x100),	// If jump is not pressed and ySpeed <= this value,
	dropToSpeed: -(0x1),					// set ySpeed to this
	climbSpeed: 0xC0 / 0x100,				// For ladders
	airSpeed: 0x1 + 0x50 / 0x100,			// I consider this value too low.
	walkSpeed: 0x1 + 0x60 / 0x100,
	accelSpeed: 0x20 / 0x100,
	accelFrames: 7,
	decelSpeed: 0x80 / 0x100,
	decelFrames: 8
};
Character.prototype.CheckFeet = function(){
		for(var x = this.x; x < this.x + this.width; x++){
			var tp = bg.TileProperties(bg.GetTile(Math.floor(x / 8), Math.floor(this.y / 8)));
			if(tp.standon || tp.solid) return true;
		}
		return false;
}
/*
NOTE: I haven't implemented collision for up, left or right, since no such exists in the prototype map yet
x,y is considered to be at bottom left corner, because
obj={x,y,xSpeed,ySpeed,head,width,walkFrames,stillFrames as numbers}
physics=as mm2Physics object above
input={jump,jumpDown,left,right,up,down as booleans}
jumpDown is true when jump was just pressed
*/
Character.prototype.Move = function(input){
	var onGround = false;
	if(this.ySpeed < 0){
		this.y += this.ySpeed;
	}
	if((this.y / 8) % 1 < 0.125){
		if(this.CheckFeet()){
			this.ySpeed = 0.0;
			onGround = true;
		}
	}
	if(this.ySpeed > 0){
		for(var yspd = this.ySpeed; yspd > 0;){
			var dy;
			if((this.y / 8) % 1 >= 0.125) dy = Math.min(8 - (this.y % 8), yspd);
			else{
				if(this.CheckFeet()){
					this.ySpeed = 0.0;
					if(input.left || input.right) this.walkFrames = this.physics.accelFrames;
					else{
						this.stillFrames = this.decelFrames;
						this.walkFrames = 0;
					}
					break;
				}
				dy = Math.min(8, yspd);
			}
			yspd -= dy;
			this.y += dy;
		}
	}
	if(onGround){
		if(input.jumpDown){
			this.ySpeed = this.physics.jumpSpeed;
		}
		if(input.left){
			if(this.head > 0){
				this.head = -1;
				this.walkFrames = 0;
			}
			if(this.walkFrames < 0) this.walkFrames = 0;
			if(this.walkFrames < this.physics.accelFrames){
				this.xSpeed = -this.physics.accelSpeed;
				this.frame = 1;
			}
			else{
				this.frame = 2 + [0,1,2,1][(Math.floor(this.walkFrames / 8) % 4)];
				this.xSpeed = -this.physics.walkSpeed;
			}
			this.walkFrames++;
		}
		else if(input.right){
			if(this.head < 0){
				this.head = 1;
				this.walkFrames = 0;
			}
			if(this.walkFrames < 0) this.walkFrames = 0;
			if(this.walkFrames < this.physics.accelFrames){
				this.xSpeed = this.physics.accelSpeed;
				this.frame = 1;
			}
			else{
				this.frame = 2 + [0,1,2,1][(Math.floor(this.walkFrames / 8) % 4)];
				this.xSpeed = this.physics.walkSpeed;
			}
			this.walkFrames++;
		}
		else{
			if(this.walkFrames >= 0){
				if(this.walkFrames < this.physics.accelFrames) this.stillFrames = this.decelFrames;
				else this.stillFrames = 0;
				this.walkFrames = -1;
			}
			if(this.stillFrames < this.physics.decelFrames) this.xSpeed = (this.head > 0) ? this.physics.decelSpeed : (-this.physics.decelSpeed);
			else this.xSpeed = 0;
			this.stillFrames++;
			this.frame = 0;
		}
	}
	else{
		if((!input.jump) && (this.ySpeed <= this.physics.minDropSpeed)) this.ySpeed = this.physics.dropToSpeed;
		if(input.left){
			this.xSpeed = -this.physics.airSpeed;
			this.head = -1;
		}
		else if(input.right){
			this.xSpeed = this.physics.airSpeed;
			this.head = 1;
		}
		else this.xSpeed = 0;
		this.frame = 9;
	}
	this.x += this.xSpeed;
	this.ySpeed += this.physics.gravity;
	if(this.ySpeed > this.physics.maxFallingSpeed) this.ySpeed = this.physics.maxFallingSpeed;
}
Character.prototype.GetHitBox = function(){
	return {
		x: this.x + 7,
		y: this.y - 4,
		width: 8,
		height: 16
	};
}

LoadImage("player.png");
function Player(obj){
	Player.parent.call(this, obj);
	this.gunTemp = 0;
	this.health = 100;
	this.hurtCountdown = 0;
	if(!(data["player.png"] instanceof Array)) data["player.png"] = Img2Imgs(data["player.png"], 39, 32);
}
Extend(Character, Player);
Player.hurtSound = CreateSfxr('{"volume":{"master":0.5,"sound":0.5},"envelope":{"attack":0,"sustain":0.0941090683790326,"punch":0,"decay":0.26974761764078947},"frequency":{"start":0.3571215180214686,"min":0,"slide":-0.3154066938350195,"dslide":0},"vibrato":{"depth":0,"speed":0,"delay":0},"change":{"amount":0,"speed":0},"duty":{"ratio":0.3485278319105903,"sweep":0,"value":0.41111117186637386},"phaser":{"offset":0,"sweep":0},"lowpass":{"cutoff":1,"sweep":0,"resonance":0},"highpass":{"cutoff":0.09207287176747393,"sweep":0},"supersamples":8,"repeatspeed":0,"wavetype":0}');
Player.shootSound = CreateSfxr('{"volume":{"master":0.5,"sound":0.5},"envelope":{"attack":0,"sustain":0.09245108139170495,"punch":0,"decay":0.19106619530800334},"frequency":{"start":0.6658081539938399,"min":0,"slide":-0.4892230735622518,"dslide":0},"vibrato":{"depth":0,"speed":0,"delay":0},"change":{"amount":0,"speed":0},"duty":{"ratio":0,"sweep":0,"value":0.48032840412741207},"phaser":{"offset":0,"sweep":0},"lowpass":{"cutoff":1,"sweep":0,"resonance":0},"highpass":{"cutoff":0.2434192413763701,"sweep":0},"supersamples":8,"repeatspeed":0,"wavetype":3}');
entityConstructors["Player"] = Player;
Player.prototype.Update = function(){
	var input = {
		left: keyPressed[keyCodes.VK_LEFT],
		right: keyPressed[keyCodes.VK_RIGHT],
		up: keyPressed[keyCodes.VK_UP],
		down: keyPressed[keyCodes.VK_DOWN],
		jumpDown: keyDowns[keyCodes.VK_X],
		jump: keyPressed[keyCodes.VK_X]
	};
	
	if(this.hurtCountdown > 0){
		this.hurtCountdown--;
	}
	
	this.Move(input);
	
	scrollX = Math.max(0, this.x - 96);
	
	if(keyDowns[keyCodes.VK_C] && (this.gunTemp <= 0)/* && (this.hurtCountdown <= 0)*/){
		var b = new Bullet();
		b.x = this.x + [-15, 0, 25][this.head + 1];
		b.y = this.y - 19;
		b.xSpeed = 5 * this.head;
		b.ySpeed = 0;
		entities.push(b);
		
		this.gunTemp = 15;
		
		Player.shootSound.play(sfxr.FREQ_44100, audioCtx, gainNodes[5]);
	}
	
	var sax = 0;
	if(this.gunTemp > 0){
		this.gunTemp--;
		var fa = [1, 6, 2, 6, 3, 7, 4, 8, 5, 9, 10, 11, 12, 13];
		this.frame = fa[fa.indexOf(this.frame + 1) + 1] - 1;
		if(this.frame == 5) sax = 4;
	}
	
	if((this.hurtCountdown <= 0) || (Math.floor(this.hurtCountdown / 3) % 2)){
		sprites.push({
			x: this.x - 9 + sax * this.head,
			y: this.y - 26,
			image: data["player.png"][this.frame],
			flipH: this.head < 0
		});
	}
	
	if(xp > level * 75){
		xp = xp % (level * 75);
		level++;
	}
}
Player.prototype.Hit = function(b){
	if(this.hurtCountdown > 0) return;
	this.health -= b.damage;
	Player.hurtSound.play(sfxr.FREQ_44100, audioCtx, gainNodes[5]);
	this.hurtCountdown = 40;
}

LoadImage("bullet.png");
function Bullet(obj){
	Bullet.parent.call(this, obj);
	this.width = 6;
	this.height = 4;
	this.damage = 10;
}
Extend(Entity, Bullet);
Bullet.prototype.Update = function(){
	this.x += this.xSpeed;
	this.y += this.ySpeed;
	if(this.x + this.width < scrollX) this.dead = true;
	if(this.x > scrollX + 256) this.dead = true;
	if(this.y - this.height > 224) this.dead = true;
	if(this.y < 0) this.dead = true;
	
	sprites.push({
		x: this.x,
		y: this.y,
		image: data["bullet.png"],
		flipH: this.xSpeed < 0
	});
	
	var self = this;
	var ea = entities.filter(e => e.GetHitBox).filter(this.filter ? this.filter : (e => true)).filter(e => BBCollision(e.GetHitBox(), self));
	if(ea.length > 0) this.dead = true;
	ea.forEach((e=>e.Hit(this)))
}

LoadImage("enemy2.png");
function UziEnemy(obj){
	UziEnemy.parent.call(this, obj);
	this.startX = this.x;
	this.gunTemp = 0;
	this.shooting = false;
	this.shotsFired = 0;
	this.pause = 0;
	if(!(data["enemy2.png"] instanceof Array)) data["enemy2.png"] = Img2Imgs(data["enemy2.png"], 39, 32);
}
entityConstructors["UziEnemy"] = UziEnemy;
Extend(Character, UziEnemy);
UziEnemy.prototype.Update = function(){
	if(this.deathCountdown){
		this.frame = 13;
		sprites.push({
			x: this.x - 9,
			y: this.y - 32,
			image: data["enemy2.png"][this.frame],
			flipH: this.head < 0
		});
		this.deathCountdown--;
		if(this.deathCountdown == 0){
			this.dead = true;
		}
		return;
	}
	var input = {
		left: false,
		right: false,
		up: false,
		down: false,
		jumpDown: false,
		jump: false
	};
	var self = this;
	var nearestPlayer = entities.filter((e => e instanceof Player)).sort((e => Math.abs(self.x - e.x)))[0];
	if(nearestPlayer.x > this.x) this.head = 1;
	else this.head = -1;
	
	if(this.shooting == false){
		if((this.x - this.startX) * this.head > 0){
			this.pause--;
			if(this.pause <= 0){
				this.shooting = true;
				this.gunTemp = 0;
				this.shotsFired = 0;
			}
		}
		else input[["left", "", "right"][this.head + 1]] = true;
	}
	else{
		if(this.gunTemp > 0) this.gunTemp--;
		else{
			if(this.shotsFired >= 3){
				this.shooting = false;
				this.pause = 10;
			}
			else{
				this.shotsFired++;
				this.x += this.head * (-1) * 7.5;
				this.gunTemp = 12;
				var b = new Bullet();
				b.x = this.x + [-15, 0, 25][this.head + 1];
				b.y = this.y - 19;
				b.xSpeed = 5 * this.head;
				b.ySpeed = 0;
				entities.push(b);
			}
		}
	}
	
	this.Move(input);
		
	var sax = 0;
	if(this.gunTemp > 0){
		this.gunTemp--;
		var fa = [1, 6, 2, 6, 3, 7, 4, 8, 5, 9, 10, 11, 12, 13];
		this.frame = fa[fa.indexOf(this.frame + 1) + 1] - 1;
		if(this.frame == 5) sax = 4;
	}
	
	sprites.push({
		x: this.x - 9 + sax * this.head,
		y: this.y - 32,
		image: data["enemy2.png"][this.frame],
		flipH: this.head < 0
	});
}
UziEnemy.prototype.Hit = function(){
	if(!this.deathCountdown){
		this.deathCountdown = 30;
		xp += 100;
	}
}

LoadImage("bird.png");
function Hawk(){
}

LoadImage("enemy4.png");
function HawkerEnemy(){
}
entityConstructors["HawkerEnemy"] = HawkerEnemy;

LoadImage("enemy3.png");
function BomberEnemy(obj){
	BomberEnemy.parent.call(this, obj);
	this.triggered = false;
	this.damage = 50;
	this.counter = 0;
	if(!(data["enemy3.png"] instanceof Array)) data["enemy3.png"] = Img2Imgs(data["enemy3.png"], 35, 38);
}
entityConstructors["BomberEnemy"] = BomberEnemy;
BomberEnemy.explosionSound = CreateSfxr('{"volume":{"master":0.5,"sound":0.5},"envelope":{"attack":0,"sustain":0.35308309589509046,"punch":0.4437482897491746,"decay":0.28466391750083575},"frequency":{"start":0.13878830759539296,"min":0,"slide":0,"dslide":0},"vibrato":{"depth":0.6913376718839922,"speed":0.2795265902041917,"delay":0},"change":{"amount":0,"speed":0},"duty":{"ratio":0,"sweep":0},"phaser":{"offset":-0.04284320572161654,"sweep":-0.15743174862438433},"lowpass":{"cutoff":1,"sweep":0,"resonance":0},"highpass":{"cutoff":0,"sweep":0},"supersamples":8,"repeatspeed":0,"wavetype":3}');
Extend(Character, BomberEnemy);
BomberEnemy.prototype.Update = function(){
	this.counter++;
	if(this.hasOwnProperty("exploding")){
		if(this.exploding == 0){
			if(BomberEnemy.explosionSound){
				BomberEnemy.explosionSound.play(sfxr.FREQ_44100, audioCtx, gainNodes[7]);
			}
		}
		this.frame = 14 + Math.floor(this.exploding / 5);
		if(this.frame > 21){
			this.dead = true;
			return;
		}
		sprites.push({
			x: this.x - 9,
			y: this.y - 32,
			image: data["enemy3.png"][this.frame],
			flipH: this.head < 0
		});
		if(this.frame <= 18){
			var self = this;
			var ea = entities.filter(e => (e.GetHitBox) && (e != self)).filter(e => BBCollision(e.GetHitBox(), self)).forEach((e=>e.Hit(this)));
		}
		this.exploding++;
		return;
	}
	var input = {
		left: false,
		right: false,
		up: false,
		down: false,
		jumpDown: false,
		jump: false
	};
	var self = this;
	var nearestPlayer = entities.filter((e => e instanceof Player)).sort((e => Math.abs(self.x - e.x)))[0];
	if(this.counter % 10 == 0){
		if(nearestPlayer.x > this.x) this.head = 1;
		else this.head = -1;
	}
	
	if(this.triggered){
		input[["left", "", "right"][this.head + 1]] = true;
		
		var obj = this;
		var x = obj.x + [0, 0, this.width - 1][this.head + 1];
		var tp = bg.TileProperties(bg.GetTile(Math.floor(x / 8), Math.floor(obj.y / 8)));
		input.jumpDown = input.jump = !(tp.standon || tp.solid);
		
		var self = this;
		var ea = entities.filter(e => (e.GetHitBox) && (e != self)).filter(e => BBCollision(e.GetHitBox(), self)).filter((e=>e instanceof Player));
		if(ea.length > 0) this.exploding = 1;
	}
	else{
		if(Math.abs(this.x - nearestPlayer.x) < 128 + nearestPlayer.width + this.width) this.triggered = true;
	}
	this.Move(input);
	
	sprites.push({
		x: this.x - 9,
		y: this.y - 32,
		image: data["enemy3.png"][this.frame],
		flipH: this.head < 0
	});
}
BomberEnemy.prototype.Hit = function(){
	if(!this.exploding){
		this.exploding = 0;
		xp += 75;
	}
}

LoadImage("boss1.png");
function BossTruck(obj){
	BossTruck.parent.call(this, obj);
	this.health = 15;
	this.blinkCountdown = 0;
	this.aimDirection = 0;
	this.gunTemp = 0;
	this.shotsFired = 0;
	this.firePause = 0;
	this.defeated = false;
	this.direction = 1;
	this.movePause = 0;
	this.moveDuration = 30;
	if(!(data["boss1.png"] instanceof Array)) data["boss1.png"] = Img2Imgs(data["boss1.png"], 105, 42);
}
Extend(Entity, BossTruck);
BossTruck.prototype.Update = function(){
	if(this.defeated){
		if(currentTheme != victoryTheme){
			currentTheme.pause();
			currentTheme = victoryTheme;
			currentTheme.play();
		}
		sprites.push({
			x: this.x - 21,
			y: this.y - 42,
			image: data["boss1.png"][2],
			behind: true
		});
		return;
	}
	if(this.blinkCountdown > 0) this.blinkCountdown--;
	
	if(this.movePause > 0){
		this.movePause--;
		if(this.movePause == 0){
			this.moveDuration = 30;
		}
	}
	if(this.moveDuration > 0){
		this.moveDuration--;
		if(this.moveDuration == 0){
			this.direction *= -1;
			this.movePause = 15;
		}
		this.x += this.direction;
	}
	
	if(this.firePause > 0) this.firePause--;
	else{
		if(this.gunTemp > 0) this.gunTemp--;
		else{
			var b = new Bullet();
			b.x = this.x + 40;
			b.y = this.y - 28;
			var fieldOfFire = 0.5;
			b.xSpeed = [-5 * Math.cos(fieldOfFire * 0.5), -5, -5 * Math.cos(fieldOfFire * 0.5)][this.aimDirection];
			b.ySpeed = [-5 * Math.sin(fieldOfFire * 0.5), 0, 5 * Math.sin(fieldOfFire * 0.5)][this.aimDirection];
			var self = this;
			b.filter = (e => (e != self));
			entities.push(b);
			this.gunTemp = 6;
			this.shotsFired++;
			if(this.shotsFired >= 3){
				this.shotsFired = 0;
				this.gunTemp = 0;
				this.firePause = 20;
				this.aimDirection = (this.aimDirection + 1) % 3;
			}
		}
	}
	
	var nearestPlayer = entities.filter((e => e instanceof Player)).sort((e => Math.abs(self.x - e.x)))[0];
	if(Math.abs(this.x - nearestPlayer.x) < 256){
		if(currentTheme != bossTheme){
			currentTheme.pause();
			currentTheme = bossTheme;
			currentTheme.play();
		}
	}
	
	sprites.push({
			x: this.x - 21,
			y: this.y - 42,
			image: data["boss1.png"][(this.blinkCountdown > 0) | 0],
			behind: true
	});
}
entityConstructors["BossTruck"] = BossTruck;
BossTruck.prototype.GetHitBox = function(){
	return {
		x: this.x + 15,
		y: this.y - 6,
		width: 24,
		height: 26
	};
}
BossTruck.prototype.Hit = function(other){
	var actualHitBox = {
		x: this.x + 15,
		y: this.y - 24,
		width: 24,
		height: 10
	};
	if(BBCollision(other, actualHitBox)){
		this.health--;
		if(this.health <= 0) this.defeated = true;
		else{
			this.blinkCountdown = 5;
		}
	}
}