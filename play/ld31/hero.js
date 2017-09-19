dataSrcs.push("gfx/heroSprite.png");
dataSrcs.push("audio/punch.wav");

function Hero()
{
	this.x = 0;
	this.y = 0;
	this.width = 25;
	this.height = 60;
	this.offsetX = -4;
	this.offsetY = 2;
	this.frameWidth = 76;
	this.frame = 1;
	this.GetBoxesFor = SimpleGetBoxes;
	this.direction = 0; // direction is clock-like
	this.speed = 200;
	this.image = data["gfx/heroSprite.png"];
	this.autoFocus = true;
	this.walkTime = 0;
	this.walkAnimSpeed = 6;
	this.health = 5;
	this.attackTime = -1;
	this.attackAnimSpeed = 15;
	this.oldFrame = 0;
	this.pickups = [false, false, false];
	this.canMove = true;
	this.punchSound = data["audio/punch.wav"];
}

Hero.prototype.Draw = function()
{
	//BoxDraw.call(this);
	SpriteDraw.call(this);
}

Hero.prototype.Hit = function(dh)
{
	this.health -= dh;
}

Hero.prototype.Update = function(dt)
{
	if(!("respawnPosition" in this))
	{
		this.respawnPosition = {x: this.x, y: this.y};
	}
	this.walkTime += dt;
	if(this.attackTime >= 0)
	{
		this.walkTime = 0;
	}
	else if(!this.canMove)
	{
		this.walkTime = 0;
	}
	else if(keys["keyLeft"].state)
	{
		this.x -= this.speed * dt;
		this.direction = 3;
	}
	else if(keys["keyRight"].state)
	{
		this.x += this.speed * dt;
		this.direction = 1;
	}
	else if(keys["keyUp"].state)
	{
		this.y -= this.speed * dt;
		this.direction = 0;
	}
	else if(keys["keyDown"].state)
	{
		this.y += this.speed * dt;
		this.direction = 2;
	}
	else this.walkTime = 0;
	AvoidSolids.call(this);
	
	SetFrame.call(this);
	
	if(this.attackTime >= 0)
	{
		this.attackTime += dt;
		if(this.attackTime * this.attackAnimSpeed >= 4) this.attackTime = -1;
	}
	else
	{
		if(keys["keyAttack"].state == 1)
		{
			CreateAttack.call(this, Enemy);
			this.punchSound.play();
		}
	}
	
	//if(keys["keyFocus"].state == 1) this.autoFocus = !this.autoFocus;
	if(this.autoFocus) glass.FocusOn(this);	
	
	if(this.health <= 0)
	{
		var p = new Hero();
		p.x = this.respawnPosition.x;
		p.y = this.respawnPosition.y;
		p.pickups = this.pickups;
		AddEntity(p);
		glass.FocusOn(p);
		this.alive = false;
	}
}