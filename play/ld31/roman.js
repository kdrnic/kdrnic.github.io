dataSrcs.push("gfx/romanSprite.png");
dataSrcs.push("audio/stab.wav");

function Enemy()
{
}

Enemy.prototype.Hit = function(dh)
{
	this.health -= dh;
}

Enemy.prototype.GetBoxesFor = SimpleGetBoxes;

function Roman()
{
	this.x = 0;
	this.y = 0;
	this.width = 25;
	this.height = 60;
	this.offsetX = -4;
	this.offsetY = 2;
	this.frameWidth = 76;
	this.frame = 1;
	this.direction = 0; // direction is clock-like
	this.speed = 150;
	this.image = data["gfx/romanSprite.png"];
	this.walkTime = 0;
	this.walkAnimSpeed = 5;
	this.health = 3;
	this.attackTime = -1;
	this.attackAnimSpeed = 15;
	this.oldFrame = 0;
	this.closeV = 72.5;
	this.closeH = 37.5;
	this.closeV_ = 30;
	this.closeH_ = 12.5;
	this.attackDelay = 0.5;
	this.attackFalloff = 0;
	this.minSquareDistance = 260 * 260;
	this.stabSound = data["audio/stab.wav"];
}

Roman.prototype = new Enemy();

Roman.prototype.FindPlayer = function()
{
	for(var i = 0; i < entities.length; i++)
	{
		if(entities[i].alive)
		{
			if(entities[i] instanceof Hero)
			{
				this.player = entities[i];
			}
		}
	}
}

Roman.prototype.Draw = SpriteDraw;

Roman.prototype.Update = function(dt)
{
	if("player" in this)
	{
		if(!this.player.alive) delete this.player;
	}
	if(!("player" in this)) this.FindPlayer();
	if(!("player" in this)) return;
	
	this.walkTime += dt;
	if(this.attackTime >= 0)
	{
		this.walkTime = 0;
	}
	else if((this.x - this.player.x) * (this.x - this.player.x) + (this.y - this.player.y) * (this.y - this.player.y) > this.minSquareDistance)
	{
		this.walkTime = 0;
	}
	else if(this.x - this.player.x > this.closeH_)
	{
		this.x -= this.speed * dt;
		this.direction = 3;
	}
	else if(this.x - this.player.x < 0 - this.closeH_)
	{
		this.x += this.speed * dt;
		this.direction = 1;
	}
	else if(this.y - this.player.y > this.closeV_)
	{
		this.y -= this.speed * dt;
		this.direction = 0;
	}
	else if(this.y - this.player.y < 0 - this.closeV_)
	{
		this.y += this.speed * dt;
		this.direction = 2;
	}
	else this.walkTime = 0;
	AvoidSolids.call(this);
	
	SetFrame.call(this);
	
	this.attackFalloff -= dt;
	if(this.attackTime >= 0)
	{
		this.attackTime += dt;
		if(this.attackTime * this.attackAnimSpeed >= 4) this.attackTime = -1;
	}
	else
	{
		if
		(
			(Math.abs(this.x - this.player.x) < this.closeH) && (Math.abs(this.y - this.player.y) < this.closeV_)
			||
			(Math.abs(this.x - this.player.x) < this.closeH_) && (Math.abs(this.y - this.player.y) < this.closeV)
		)
		{
			if(this.attackFalloff < 0)
			{
				this.attackFalloff = this.attackDelay;
				CreateAttack.call(this, Hero);
				this.stabSound.play();
			}
		}
	}
	
	if(this.health < 0)
	{
		this.alive = false;
	}
}