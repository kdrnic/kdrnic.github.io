var selectedViking;
var vikings = [];
var noViking = {};
var lastVikingChange = 0;
var other = [[1, 2], [2, 0], [0, 1]];
var levelVikings = 0;
var shieldPlatform;
var shieldXOffset = -48;
var shieldYOffset = -59;

function VikingHit(dmg)
{
	this.health -= dmg;
	if(this.health <= 0)
	{
		this.alive = false;
		InitTombStone(this.x, this.y);
		if(selectedViking == this) selectedViking = noViking;
		vikings[this.type] = noViking;
	}
}

function VikingIsSolidTo(obj)
{
	if((obj.Hit) && (obj.Hit == EnemyHit)) return true;
	return false;
}

function InitViking(x, y, type)
{
	var v = NewObject();
	v.x = x;
	v.y = y;
	v.Draw = SpriteDraw;
	v.xSpeed = 0;
	v.ySpeed = 0;
	v.colliders = [];
	v.oldX = x;
	v.oldY = y;
	v.SelectedVikingUpdate1 = SelectedVikingUpdate1;
	v.SelectedVikingUpdate2 = SelectedVikingUpdate2;
	v.EveryVikingUpdate = EveryVikingUpdate;
	v.Hit = VikingHit;
	v.IsSolidTo = VikingIsSolidTo;
	
	v.width = 40;
	v.height = 134;
	v.frameWidth = 150;
	v.accel = 0.5;
	v.maxSpeed = 4;
	v.jumpSpeed = 8.5;
	v.iAnimSpeed = 6;
	v.health = 100;
	v.abduction = false;
	v.abductionSpeed = 1;
	
	if(type == 0)
	{
		v.Update = SwordVikingUpdate;
		v.image = data["vikingSwordSprite.png"];
		selectedViking = v;
		vikings[0] = v;
		v.type = type;
		
		v.attackCounter = -1;
		v.offsetY = 10;
	}
	if(type == 1)
	{
		v.Update = ShieldVikingUpdate;
		v.image = data["vikingShieldSprite.png"];
		selectedViking = v;
		vikings[1] = v;
		v.type = type;
		
		v.shieldAbove = false;
		v.offsetY = 10;
	}
	if(type == 2)
	{
		v.Update = BowVikingUpdate;
		v.image = data["vikingBowSprite.png"];
		selectedViking = v;
		vikings[2] = v;
		v.type = type;
		
		v.attackCounter = -1;
		v.offsetX = -6;
	}
}

function SelectedVikingUpdate1()
{
	if(this.abduction) return;
	
	if((keys["keyChange"].state == 1) && (lastVikingChange != frame))
	{
		if(vikings[other[this.type][0]]) selectedViking = vikings[other[this.type][0]];
		else if(vikings[other[this.type][1]]) selectedViking = vikings[other[this.type][1]];
		lastVikingChange = frame;
	}
	if((keys["keyJump"].state == 1) && (this.colliders[1]))this.ySpeed = -this.jumpSpeed;
	if(keys["keyLeft"].state) this.xSpeed -= this.accel;
	if(keys["keyRight"].state) this.xSpeed += this.accel;
	if(this.xSpeed < -this.maxSpeed) this.xSpeed = -this.maxSpeed;
	if(this.xSpeed > +this.maxSpeed) this.xSpeed = +this.maxSpeed;
	if(this.ySpeed > maxYSpeed) this.ySpeed = maxYSpeed;
}

function SelectedVikingUpdate2()
{
	if(selectedViking == this) CameraFocusOn(this);
}

function EveryVikingUpdate()
{
	if(this.abduction)
	{
		var dx = this.abductionX - this.x;
		var dy = this.abductionY - this.y;
		var length = Math.sqrt(dx * dx + dy * dy);
		if(length == 0) length = 1.0;
		this.y += dy / length;
		this.x += dx / length;
		this.frame = 3;
		return;
	}
	
	DoPlatformerPhysics(this);
	
	if(this.xSpeed < 0) this.flipH = true;
	if(this.xSpeed > 0) this.flipH = false;
	if(this.colliders[1])
	{
		if(Math.abs(this.xSpeed) > 0)
		{
			this.frame = Math.floor(frame / this.iAnimSpeed) % 4;
			if(this.frame == 3) this.frame = 1;
		}
		else this.frame = 1;
	}
	else
	{
		if(this.ySpeed < 0) this.frame = 3;
		else this.frame = 4;
	}
}

function SwordVikingUpdate()
{
	if((selectedViking == noViking) && (keys["keyChange"].state == 1) && (lastVikingChange != frame))
	{
		selectedViking = this;
		lastVikingChange = frame;
	}
	if(selectedViking == this)
	{
		this.SelectedVikingUpdate1();
		
		if((keys["keyAction"].state == 1) && (this.attackCounter < 0)) this.attackCounter = (5 * this.iAnimSpeed) - 1;
		if(this.attackCounter >= 0) this.xSpeed = 0;
	}
	
	this.EveryVikingUpdate();
	
	if(this.attackCounter >= 0)
	{
		this.frame = 9 - Math.floor(this.attackCounter / this.iAnimSpeed);
	}
	if(this.attackCounter == Math.floor(((this.iAnimSpeed * 5) - 1) * 0.5)) InitSword(this.x, this.y, !this.flipH);
	this.attackCounter--;
	
	if(selectedViking == this) this.SelectedVikingUpdate2();
}

function ShieldVikingUpdate()
{
	if((selectedViking == noViking) && (keys["keyChange"].state == 1) && (lastVikingChange != frame))
	{
		selectedViking = this;
		lastVikingChange = frame;
	}
	if(selectedViking == this)
	{
		this.SelectedVikingUpdate1();
		
		if(keys["keyAction"].state == 1) this.shieldAbove = !this.shieldAbove;
	}
	
	this.EveryVikingUpdate();
	
	if(this.shieldAbove) this.frame += 5;
	
	if(selectedViking == this) this.SelectedVikingUpdate2();
}

function BowVikingUpdate()
{
	if((selectedViking == noViking) && (keys["keyChange"].state == 1) && (lastVikingChange != frame))
	{
		selectedViking = this;
		lastVikingChange = frame;
	}
	if(selectedViking == this)
	{
		this.SelectedVikingUpdate1();
		
		if((keys["keyAction"].state == 1) && (this.attackCounter < 0)) this.attackCounter = (2 * this.iAnimSpeed) - 1;
		if(this.attackCounter >= 0) this.xSpeed = 0;
	}
	
	this.EveryVikingUpdate();
	
	if(this.attackCounter >= 0)
	{
		this.frame = 6 - Math.floor(this.attackCounter / this.iAnimSpeed);
	}
	if(this.attackCounter == Math.floor(((this.iAnimSpeed * 2) - 1) * 0.5)) InitArrow(this.x, this.y, !this.flipH);
	this.attackCounter--;
	
	if(selectedViking == this) this.SelectedVikingUpdate2();
}

function InitTombStone(x, y)
{
	var t = NewObject();
	t.x = x;
	t.y = y;
	t.width = 94;
	t.height = 125;
	t.xSpeed = 0;
	t.ySpeed = 0;
	t.oldX = x;
	t.oldY = y;
	t.colliders = [];
	t.image = data["tombStone.png"];
	t.Draw = ImageDraw;
	t.Update = PlatformerUpdate;
}

function InitArrow(x, y, gr)
{
	var a = NewObject();
	a.x = x;
	a.y = y;
	a.width = 32;
	a.height = 8;
	a.image = data["arrow.png"];
	a.flipH = !gr;
	if(gr) a.dx = 10;
	else a.dx = -10;
	a.dy = 0;
	a.targetHit = EnemyHit;
	a.Draw = ImageDraw;
	a.Update = ProjectileUpdate;
	a.damage = 50;
}

function InitSword(x, y, gr)
{
	var s = NewObject();
	s.x = x;
	s.y = y;
	s.width = 10;
	s.height = 10;
	s.flipH = !gr;
	if(gr) s.dx = 10;
	else s.dx = -10;
	s.dy = 0;
	s.targetHit = EnemyHit;
	s.Update = ProjectileUpdate;
	s.damage = 100;
	s.frameDeath = frame + 6;
}

function InitShield(x, y)
{
	var s = NewObject();
	s.width = 10;
	s.height = 128;
	s.friction = 0.5;
	s.IsSolidTo = ShieldSolidTo;
	s.Update = ShieldUpdate;
	s.above = false;
	s.x = s.oldX = x + shieldXOffset;
	s.y = s.oldY = y;
}

function ShieldUpdate()
{
	if((!vikings[1]) || (!vikings[1].alive))
	{
		alive = false;
	}
	this.above = vikings[1].shieldAbove;
	this.x = vikings[1].x;
	this.y = vikings[1].y;
	if(this.above)
	{
		this.y += shieldYOffset;
		if(this.oldAbove)
		{
			this.dx = this.x - this.oldX;
			this.dy = this.y - this.oldY;
		}
		else
		{
			this.dx = 0;
			this.dy = 0;
			this.width = 128;
			this.height = 10;
		}
	}
	else
	{
		if(vikings[1].flipH) this.x += shieldXOffset;
		else this.x -= shieldXOffset;
		if(this.oldAbove)
		{
			this.width = 10;
			this.height = 128;
		}
	}
	this.oldX = this.x;
	this.oldY = this.y;
	this.oldAbove = this.above;
}

function ShieldSolidTo(obj)
{
	if(this.above)
	{
		if(obj.oldY)
		{
			return (obj.oldY + obj.height * 0.5 <= this.y - this.height * 0.5);
		}
		return true;
	}
	else
	{
		if((obj.Hit) && (obj.Hit == VikingHit)) return false;
		return true;
	}
}