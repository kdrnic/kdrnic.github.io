function InitModule(x, y)
{
	var m = NewObject();
	m.x = x;
	m.y = y;
	m.ySpeed = 0;
	m.xSpeed = 0;
	m.width = 120;
	m.height = 170;
	m.image = data["module.png"];
	m.Draw = ModuleDraw;
	m.Update = ModuleUpdate;
	m.colliders = [];
	m.offsetY = 8;
	m.layer = 1;
	
	m.yThrust = 0.2;
	m.xThrust = 0.1;
	m.landed = false;
	m.dialogs = 0;
	m.maxDeceleration = 2;
	m.landingSpot = false;
	m.explosionSound = data["explosion.wav"];
	m.thrusterSound = data["thruster.ogg"];
	m.thrusterSound.loop = true;
	
	m.particles = [];
	m.particlePeriod = 5;
	m.iParticleAnimSpeed = 10;
	m.currentParticle = 0;
	m.numberOfParticles = Math.ceil((5 * m.iParticleAnimSpeed * 2) / m.particlePeriod);
	m.particleX = 25;
	m.particleY = m.height * 0.5;
	m.particleSpeed = 5;
	for(var i = 0; i < m.numberOfParticles; i++) m.particles[i] = {x: 0, y: 0, frame: 4, image: data["fireSprite.png"], xSpeed: 0, ySpeed: 0, frameWidth: 70};
}

function ModuleDraw()
{
	for(var i = 0; i < this.numberOfParticles; i++)
	{
		var p = this.particles[i];
		DrawSprite(p);
	}
	DrawImage(this);
}

function ModuleUpdate()
{
	if(!this.landingSpot)
	{
		for(var i = 0; i < numberOfObjects; i++)
		{
			var obj = objects[i];
			if(obj.maxModuleDistance)
			{
				this.landingSpot = obj;
				break;
			}
		}
	}
	else
	{
		var lsdx = this.landingSpot.x - this.x; // LSD coordinates??? LOOLOLOLOLOLOLO
		var lsdy = this.landingSpot.y - this.y;
		if(lsdx * lsdx + lsdy * lsdy > this.landingSpot.maxModuleDistance * this.landingSpot.maxModuleDistance)
		{
			deathMessage = "You have ventured too far from the landing spot and you ran out of fuel.";
			ChangeGameState(4);
		}
	}
	
	for(var i = 0; i < this.numberOfParticles; i++)
	{
		var p = this.particles[i];
		p.x += p.xSpeed;
		p.y += p.ySpeed;
		if((frame % this.iParticleAnimSpeed == 0) && (p.frame < 4)) p.frame++;
	}
	
	if((!this.landed) && (this.dialogs == 0))
	{
		if(keys["keyLeft"].state != 0) this.xSpeed -= this.xThrust;
		if(keys["keyRight"].state != 0) this.xSpeed += this.xThrust;
		if(keys["keyUp"].state != 0)
		{
			this.ySpeed -= this.yThrust;
			if(frame % this.particlePeriod == 0)
			{
				var p;
				p = this.particles[this.currentParticle];
				p.x = this.x + this.particleX;
				p.y = this.y + this.particleY;
				p.ySpeed = this.ySpeed + this.particleSpeed;
				p.xSpeed = this.xSpeed;
				p.frame = 0;
				this.currentParticle++;
				if(this.currentParticle == this.numberOfParticles) this.currentParticle = 0;
				p = this.particles[this.currentParticle];
				p.x = this.x - this.particleX;
				p.y = this.y + this.particleY;
				p.ySpeed = this.ySpeed + this.particleSpeed;
				p.xSpeed = this.xSpeed;
				p.frame = 0;
				this.currentParticle++;
				if(this.currentParticle == this.numberOfParticles) this.currentParticle = 0;
			}
			if(keys["keyUp"].state == 1) this.thrusterSound.play();
		}
	}
	if(keys["keyUp"].state == 0) this.thrusterSound.pause();
	
	var oldYSpeed = this.ySpeed, oldXSpeed = this.xSpeed;
	DoPlatformerPhysics(this);
	
	if((Math.abs(oldYSpeed - this.ySpeed) > this.maxDeceleration) || (Math.abs(oldXSpeed - this.xSpeed) > this.maxDeceleration))
	{
		var excess = (Math.max(Math.abs(oldYSpeed - this.ySpeed), (Math.abs(oldXSpeed - this.xSpeed) > this.maxDeceleration)) - this.maxDeceleration) / this.maxDeceleration;
		excess *= 10000;
		excess = Math.ceil(excess);
		excess /= 100;
		deathMessage = "You exceeded the max deceleration by " + excess  + "% damaging your landing vehicle.";
		this.thrusterSound.pause();
		this.explosionSound.play();
		this.alive = false;
		InitBrokenModule(this.x, this.y);
	}
	else if((this.colliders[1]) && (!this.landed) && (this.alive) && (this.ySpeed < this.maxDeceleration))
	{
		if((this.dialogs == 0) && (!IsDialogActive()))
		{
			this.thrusterSound.pause();
			InitDialog("Computer readings indicate the source of the magnetic field", "lies below.");
			this.dialogs++;
		}
		if((this.dialogs == 1) && (!IsDialogActive()))
		{
			InitDialog("If I find where it comes from, I might be able to disable it,", "in which case the communications will be restored.");
			this.dialogs++;
		}
		if((this.dialogs == 2) && (!IsDialogActive()))
		{
			this.landed = true;
			InitCosmonaut(this.x, this.y);
		}
	}
	
	if(!this.landed) CameraFocusOn(this);
}

function InitBrokenModule(x, y)
{
	var b = NewObject();
	b.x = x;
	b.y = y;
	b.width = 120;
	b.height = 170;
	b.colliders = [];
	b.xSpeed = 0;
	b.ySpeed = 0;
	b.offsetY = 8;
	b.image = data["brokenModule.png"];
	b.Update = DeadBodyUpdate;
	b.Draw = ImageDraw;
	b.deathFrame = frame + 60;
}