function EnemyHit(dmg)
{
	this.health -= dmg;
	if(this.health <= 0) this.alive = false;
}

function InitBatCaveman(x, y)
{
	var c = NewObject();
	c.x = x;
	c.y = y;
	c.oldX = x;
	c.oldY = y;
	c.Draw = SpriteDraw;
	c.xSpeed = 0;
	c.ySpeed = 0;
	c.colliders = [];
	c.Hit = EnemyHit;
	
	c.width = 40;
	c.height = 134;
	c.frameWidth = 150;
	c.accel = 0.5;
	c.maxSpeed = 2;
	c.iAnimSpeed = 7;
	c.image = data["cavemanBatSprite.png"];
	c.minAttackDistance = 0.0;
	c.attackCounter = -1;
	c.health = 100;
	c.offsetY = 8;
	c.attackCooldown = 60;
	
	c.Update = BatCavemanUpdate;
}

function BatCavemanUpdate()
{
	var nearestViking;
	if((vikings[0]) && (vikings[0].alive)) nearestViking = vikings[0];
	if((vikings[1]) && (vikings[1].alive) && ((!nearestViking) || (Math.abs(this.x - vikings[1].x) < Math.abs(this.x - nearestViking.x)))) nearestViking = vikings[1];
	if((vikings[2]) && (vikings[2].alive) && ((!nearestViking) || (Math.abs(this.x - vikings[2].x) < Math.abs(this.x - nearestViking.x)))) nearestViking = vikings[2];
	
	if((nearestViking) && (IsVisibleTo(this, nearestViking)))
	{
		if(nearestViking.x < this.x) this.xSpeed -= this.accel;
		if(nearestViking.x > this.x) this.xSpeed += this.accel;
	}
	
	if(this.xSpeed > +this.maxSpeed) this.xSpeed = +this.maxSpeed;
	if(this.xSpeed < -this.maxSpeed) this.xSpeed = -this.maxSpeed;
	
	DoPlatformerPhysics(this);
	
	if(nearestViking)
	{
		if(Math.abs(this.x - nearestViking.x) <= this.minAttackDistance + (this.width + nearestViking.width) * 0.5)
		{
			if(Math.abs(this.y - nearestViking.y) < (this.height + nearestViking.height) * 0.5)
			{
				if(this.attackCounter < -this.attackCooldown) this.attackCounter = (this.iAnimSpeed * 5) - 1;
			}
		}
	}
	
	if(Math.abs(this.xSpeed) > 0)
	{
		this.frame = Math.floor(frame / this.iAnimSpeed) % 4;
		if(this.frame == 3) this.frame = 1;
	}
	else this.frame = 1;
	if(this.attackCounter >= 0) this.frame = 7 - Math.floor(this.attackCounter / this.iAnimSpeed);
	if(this.attackCounter == Math.floor(((this.iAnimSpeed * 5) - 1) * 0.5)) InitBat(this.x, this.y, !this.flipH);
	if(this.xSpeed > 0) this.flipH = false;
	if(this.xSpeed < 0) this.flipH = true;
	this.attackCounter--;
}

function InitSpearCaveman(x0, y, x1)
{
	var c = NewObject();
	if(x1 < x0)
	{
		var temp = x1;
		x1 = x0;
		x0 = temp;
	}
	c.x = x0;
	c.y = y;
	c.oldX = x0;
	c.oldY = y;
	c.x0 = x0;
	c.x1 = x1;
	c.goRight = true;
	c.Draw = SpriteDraw;
	c.xSpeed = 0;
	c.ySpeed = 0;
	c.colliders = [];
	c.Hit = EnemyHit;
	
	c.width = 40;
	c.height = 134;
	c.frameWidth = 175;
	c.accel = 0.5;
	c.maxSpeed = 2;
	c.iAnimSpeed = 7;
	c.image = data["cavemanSpearSprite.png"];
	c.attackCounter = -1;
	c.health = 100;
	c.offsetY = 8;
	c.attackCooldown = 120;
	c.spearY = 32;
	
	c.Update = SpearCavemanUpdate;
}

function SpearCavemanUpdate()
{
	var canHitAViking = false;
	for(var i = 0; i < 3; i++)
	{
		var v;
		if(ExistentAndAlive(vikings[i])) v = vikings[i];
		else continue;
		if((Math.abs(this.y - (this.height * 0.5) + this.spearY - v.y) < v.height * 0.5) && ((v.x - this.x > 0) ^ (this.flipH))) canHitAViking = true;
	}
	
	if((canHitAViking) && (this.attackCounter < -this.attackCooldown)) this.attackCounter = (this.iAnimSpeed * 3) - 1;
	if(this.attackCounter < 0)
	{
		if(this.goRight)
		{
			this.xSpeed += this.accel;
			if(this.x > this.x1) this.goRight = false;
		}
		else
		{
			this.xSpeed -= this.accel;
			if(this.x < this.x0) this.goRight = true;
		}
	}
	if(this.xSpeed > +this.maxSpeed) this.xSpeed = +this.maxSpeed;
	if(this.xSpeed < -this.maxSpeed) this.xSpeed = -this.maxSpeed;
	
	DoPlatformerPhysics(this);
	
	if(Math.abs(this.xSpeed) > 0)
	{
		this.frame = Math.floor(frame / this.iAnimSpeed) % 4;
		if(this.frame == 3) this.frame = 1;
	}
	else this.frame = 1;
	if(this.attackCounter >= 0) this.frame = 5 - Math.floor(this.attackCounter / this.iAnimSpeed);
	if(this.attackCounter == 0)
	{
		InitSpear(this.x, this.y - (this.height * 0.5) + this.spearY, !this.flipH);
	}
	if(this.xSpeed > 0) this.flipH = false;
	if(this.xSpeed < 0) this.flipH = true;
	this.attackCounter--;
}

function InitSpear(x, y, gr)
{
	var s = NewObject();
	s.x = x;
	s.y = y;
	s.width = 90;
	s.height = 8;
	s.image = data["spear.png"];
	s.flipH = !gr;
	if(gr) s.dx = 10;
	else s.dx = -10;
	s.dy = 0;
	s.targetHit = VikingHit;
	s.Draw = ImageDraw;
	s.Update = ProjectileUpdate;
	s.damage = 25;
}

function InitBat(x, y, gr)
{
	var b = NewObject();
	b.x = x;
	b.y = y;
	b.width = 10;
	b.height = 10;
	b.flipH = !gr;
	if(gr) b.dx = 10;
	else b.dx = -10;
	b.dy = 0;
	b.targetHit = VikingHit;
	b.Update = ProjectileUpdate;
	b.damage = 50;
	b.frameDeath = frame + 6;
}