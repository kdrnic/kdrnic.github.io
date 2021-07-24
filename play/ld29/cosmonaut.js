function InitCosmonaut(x, y)
{
	var c = NewObject();
	c.x = x;
	c.y = y;
	c.width = 40;
	c.height = 80;
	c.xSpeed = 0;
	c.ySpeed = 0;
	c.image = data["cosmonautSprite.png"];
	c.frameWidth = 143;
	c.Draw = CosmonautDraw;
	c.Update = CosmonautUpdate;
	c.colliders = [];
	c.offsetY = 29;
	c.offsetX = -33;
	c.frame = 0;
	
	c.hasFlag = true;
	c.hasSeenSoftRock = false;
	c.hasSeenAmmonia = false;
	c.dieOnLanding = false;
	c.lightOn = false;
	c.hasSeenDarkness = false; // DOOOOOOOOM!
	c.hasSeenMaggot = false; // Better than hasSeenFaggot
	c.maggotDistance = 115;
	c.cubeActivated = false;
	c.cubeDistance = 150;
	c.fatalFallingSpeed = Math.ceil(Math.sqrt((2 * 480) / gravity)) * gravity; // t = sqrt((2h) / a); v = at;
	c.jumpSpeed = 5;
	c.walkAccel = 0.5;
	c.walkSpeed = 5;
	c.iAnimSpeed = 6;
	c.iJackhammerSpeed = 5;
	c.flagX = 66;
	c.flagY = -21;
	c.layer = 2;
	c.lightImage = data["light.png"];
	c.deathSound = data["fall.wav"];
	c.jackHammerSound = data["jackhammer.wav"];
	c.jackHammerSound.loop = true;
	c.groundSound = data["ground.wav"];
	c.jumpSound = data["jump.wav"];
	c.jumpSound.volume = 0.0; // Annoying
}

function CosmonautUpdate()
{
	var isJackhammering = false;
	
	if((keys["keyJump"].state == 1) && (this.colliders[1]))
	{
		this.ySpeed -= this.jumpSpeed;
		this.jumpSound.play();
	}
	if(keys["keyLeft"].state != 0) this.xSpeed -= this.walkAccel;
	if(keys["keyRight"].state != 0) this.xSpeed += this.walkAccel;
	if(this.xSpeed < -this.walkSpeed) this.xSpeed = -this.walkSpeed;
	if(this.xSpeed > +this.walkSpeed) this.xSpeed = +this.walkSpeed;
	
	if((keys["keyAction"].state == 1) && (this.hasFlag) && (this.colliders[1]))
	{
		if(this.flipH) InitFlagpole(this.x - this.flagX, this.y + this.flagY, true);
		else InitFlagpole(this.x + this.flagX, this.y + this.flagY, false);
		this.hasFlag = false;
	}
	isJackhammering = false;
	if((this.colliders[1]) && (this.colliders[1].Hit == SoftRockHit))
	{
		if(keys["keyAction"].state != 0)
		{
			InitJackhammer(this.x, this.y);
			isJackhammering = true;
			if(keys["keyAction"].state == 1) this.jackHammerSound.play();
		}
		if(!this.hasSeenSoftRock)
		{
			if(!IsDialogActive())
			{
				InitDialog("This rock is softer than the others in this planet.", "I can break through it with my jackhammer. (Press action to use)");
				this.hasSeenSoftRock = true;
			}
		}
	}
	if(!isJackhammering) this.jackHammerSound.pause();
	var wasFlying = (!this.colliders[1]);
	
	DoPlatformerPhysics(this);
	
	if((this.colliders[1]) && (wasFlying)) this.groundSound.play();
	if(!this.cubeActivated) CameraFocusOn(this);
	if(((this.colliders[2]) && (this.colliders[2].IsSolidTo == FlagBlockIsSolidTo)) || ((this.colliders[3]) && (this.colliders[3].IsSolidTo == FlagBlockIsSolidTo)))
	{
		InitDialog("Perhaps you should mark the landing site", "with the glorious banner of the motherland before proceeding.");
	}
	if(this.ySpeed > this.fatalFallingSpeed) this.dieOnLanding = true;
	if((this.colliders[1]) && (this.dieOnLanding))
	{
		deathMessage = "You fell from too high, damaging your space suit, without which surviving on this lonely planet is impossible.";
		this.alive = false;
		this.deathSound.play();
		this.jackHammerSound.pause();
		InitCosmonautBody(this.x, this.y);
	}
	for(var i = 0; i < numberOfObjects; i++)
	{
		var obj = objects[i];
		if(!obj.alive) continue;
		if(Collision(this, obj))
		{
			if((!this.hasSeenAmmonia) && (obj.Update == AmmoniaUpdate))
			{
				if(!IsDialogActive())
				{
					InitDialog("To further investigate the mysteries of this planet, I must", "descend below the surface of this dangerous ocean of ammonia.");
					this.hasSeenAmmonia = true;
					break;
				}
			}
			if(obj.isDarkness)
			{
				if((!this.hasSeenDarkness) && (!IsDialogActive()))
				{
					InitDialog("Who knows what evils lurk in the darkness?", "(Press action to activate space suit illumination)");
					this.hasSeenDarkness = true;
				}
				if(keys["keyAction"].state == 1) this.lightOn = !this.lightOn;
			}
			if(obj.isMaggot)
			{
				this.deathSound.play();
				this.jackHammerSound.pause();
				deathMessage = "Your space suit was ruptured by the monsters' acids, and your body succumbed to their venom's infection.";
				this.alive = false;
				InitCosmonautBody(this.x, this.y);
			}
		}
		if((obj.isMaggot) && (!this.hasSeenMaggot))
		{
			var mdx = obj.x - this.x;
			var mdy = obj.y - this.y;
			if(mdx * mdx + mdy * mdy < this.maggotDistance * this.maggotDistance)
			{
				if(!IsDialogActive())
				{
					InitDialog("What was that? Some sort of monster?", "How can life prevail in such a desolate place?");
					this.hasSeenMaggot = true;
				}
			}
		}
		if(obj.Update == CubeUpdate)
		{
			var mdx = obj.x - this.x;
			var mdy = obj.y - this.y;
			if(mdx * mdx + mdy * mdy < this.cubeDistance * this.cubeDistance)
			{
				obj.active = true;
			}
		}
	}
	
	if(this.xSpeed != 0)
	{
		this.frame = Math.floor(frame / this.iAnimSpeed) % 4;
		if(this.frame == 3) this.frame = 1;
	}
	else this.frame = 1;
	if(this.hasFlag) this.frame += 3;
	if(isJackhammering) this.frame = 6 + (Math.floor(frame / this.iJackhammerSpeed) % 2);
	if(this.xSpeed > 0) this.flipH = false;
	if(this.xSpeed < 0) this.flipH = true;
	if(this.flipH) this.frame += 8;
}

function CosmonautDraw()
{
	if(this.lightOn) DrawImage({x: this.x, y: this.y, image: this.lightImage});
	DrawSprite(this);
}

function InitJackhammer(x, y)
{
	var j = NewObject();
	j.x = x;
	j.y = y;
	j.width = 10;
	j.height = 10;
	j.Update = ProjectileUpdate;
	
	j.dx = 0;
	j.dy = 10;
	j.targetHit = SoftRockHit;
	j.damage = 2;
}

function InitCosmonautBody(x, y)
{
	var b = NewObject();
	b.x = x;
	b.y = y;
	b.width = 115;
	b.height = 67;
	b.colliders = [];
	b.xSpeed = 0;
	b.ySpeed = 0;
	b.image = data["cosmonautDead.png"];
	b.Update = DeadBodyUpdate;
	b.Draw = ImageDraw;
	b.deathFrame = frame + 60;
}