function InitAmmonia(x0, y0, x1, y1) // Implemented as x0y0x1y1 to be more practical on the editor
{
	var a = NewObject();
	a.drawX = x0;
	a.drawY = y0;
	a.width = Math.abs(x0 - x1);
	a.height = Math.abs(y0 - y1);
	a.x = (x0 + x1) * 0.5;
	a.y = (y0 + y1) * 0.5;
	a.Draw = FogDraw;
	a.Update = AmmoniaUpdate;
	a.x0 = x0;
	a.cycleFrames = 300;
	a.surfaceTexture = data["ammoniaTop.png"];
	a.belowTexture = data["ammonia.png"];
	a.bottomTexture = data["ammoniaBottom.png"];
	a.layer = 4;
	a.drawX = x0;
	a.drawY = y0;
}

function FogDraw()
{
	DrawTiled(this.surfaceTexture, this.drawX, this.drawY, this.width, this.surfaceTexture.height);
	DrawTiled(this.belowTexture, this.drawX, this.drawY + this.surfaceTexture.height, this.width, this.height - this.surfaceTexture.height - this.bottomTexture.height);
	DrawTiled(this.bottomTexture, this.drawX, this.drawY + this.height - this.bottomTexture.height, this.width, this.bottomTexture.height);
}

function AmmoniaUpdate()
{
	this.drawX = this.x0 + ((frame % this.cycleFrames) / this.cycleFrames) * this.surfaceTexture.width;
}

function InitSpace(x0, y0, x1, y1)
{
	var s = NewObject();
	s.image = data["space.png"];
	s.speed = 0.5;
	s.Draw = ParallaxDraw;
	s.layer = -1;
	if(x0)
	{
		s.speed = Math.min(640 / Math.abs(x0 - x1), 480 / Math.abs(y0 - y1));
	}
}

function InitFlagpole(x, y, flip)
{
	var f = NewObject();
	f.x = x;
	f.y = y;
	f.image = data["flagpole.png"];
	f.Draw = ImageDraw;
	f.flipH = flip;
	f.layer = 3;
}

function InitFlagBlock(x, y, w, h)
{
	var b = NewObject();
	b.x = x;
	b.y = y;
	b.width = w;
	b.height = h;
	b.friction = 0.1;
	b.IsSolidTo = FlagBlockIsSolidTo;
}

function FlagBlockIsSolidTo(obj)
{
	if(obj.Update == CosmonautUpdate)
	{
		return obj.hasFlag;
	}
	return false;
}

function IsDialogActive()
{
	for(var i = 0; i < numberOfObjects; i++)
	{
		if((objects[i].alive) && (objects[i].Update == DialogUpdate)) return true;
	}
	return false;
}

function KillDialog()
{
	for(var i = 0; i < numberOfObjects; i++)
	{
		if((objects[i].alive) && (objects[i].Update == DialogUpdate)) objects[i].alive = false;
	}
	return false;
}

function InitDialog(a, b)
{
	if(IsDialogActive()) return;
	var d = NewObject();
	d.layer = 5;
	d.Draw = DialogDraw;
	d.Update = DialogUpdate;
	d.lines = [a, b];
	d.showLines = ["", ""];
	d.initFrame = frame;
	d.iSpeed = 2;
	d.bg = data["dialogBg.png"];
}

function DialogDraw()
{
	DrawTiled(this.bg, camera.x + 20, camera.y + 360, 600, 100);
	context.fillStyle = "rgb(0, 196, 0)";
	context.font = "15px Courier";
	context.fillText(this.showLines[0], 30, 393 + 7);
	context.fillText(this.showLines[1], 30, 423 + 7);
}

function DialogUpdate()
{
	var passedFrames = frame - this.initFrame;
	var showLength = Math.floor(passedFrames / this.iSpeed);
	var totalLength = this.lines[0].length + this.lines.length[1];
	this.showLines[0] = this.lines[0].substr(0, Math.min(this.lines[0].length, showLength));
	this.showLines[1] = this.lines[1].substr(0, Math.min(this.lines[1].length, Math.max(showLength - this.lines[0].length, 0)));
	if(keys["keyDialog"].state == 1) this.alive = false;
}

function InitCheckpoint(x, y, w, h)
{
	var c = NewObject();
	c.x = x;
	c.y = y;
	c.width = w;
	c.height = h;
	c.Update = CheckpointUpdate;
	c.used = false;
}

function CheckpointUpdate()
{
	for(var i = 0; i < numberOfObjects; i++)
	{
		var obj = objects[i];
		if((obj.alive) && (Collision(obj, this)) && (obj.Update == CosmonautUpdate) && (!this.used))
		{
			SaveCheckpoint();
			this.used = true;
		}
	}
}

function InitDarkness(x0, y0, x1, y1)
{
	var d = NewObject();
	d.drawX = x0;
	d.drawY = y0;
	d.width = Math.abs(x0 - x1);
	d.height = Math.abs(y0 - y1);
	d.x = (x0 + x1) * 0.5;
	d.y = (y0 + y1) * 0.5;
	d.Draw = FogDraw;
	d.surfaceTexture = data["darknessTop.png"];
	d.belowTexture = data["darkness.png"];
	d.bottomTexture = data["darkness.png"];
	d.layer = 4;
	d.isDarkness = true; // EEEVULZ
	d.drawX = x0;
	d.drawY = y0;
}

function InitMaggotType1(x0, y, x1) // Goes back and forth between x0 and x1, runs in light's direction if present
{
	var m = NewObject();
	m.x0 = x0;
	m.y = y;
	m.x1 = x1;
	m.width = 26;
	m.height = 10;
	m.xSpeed = 0;
	m.image = data["maggotSpriteGreen.png"];
	m.frameWidth = 40;
	m.speed = 2.5;
	m.minDistance = 250;
	m.iAnimSpeed = 7;
	m.goRight = (Math.random() < 0.5);
	if(this.goRight) m.x = x0;
	else m.x = x1;
	m.isMaggot = true;
	m.Draw = SpriteDraw;
	m.Update = MaggotType1Update;
	m.colliders = [];
	m.layer = 2;
	m.offsetY = 12;
}

function InitMaggotType2(x, y) // Walks in a random direction until hitting a wall, then change direction, runs in light's direction if present
{
	var m = NewObject();
	m.x = x;
	m.y = y;
	m.width = 26;
	m.height = 10;
	m.xSpeed = 0;
	m.image = data["maggotSpriteGreen.png"];
	m.frameWidth = 40;
	m.speed = 2.5;
	m.minDistance = 250;
	m.iAnimSpeed = 7;
	m.goRight = (Math.random() < 0.5);
	m.isMaggot = true;
	m.Draw = SpriteDraw;
	m.Update = MaggotType2Update;
	m.colliders = [];
	m.layer = 2;
	m.offsetY = 12;
}

function InitMaggotType3(x, y) // Sits still, runs away from light
{
	var m = NewObject();
	m.x = x;
	m.y = y;
	m.width = 26;
	m.height = 10;
	m.xSpeed = 0;
	m.image = data["maggotSpritePurple.png"];
	m.frameWidth = 40;
	m.speed = 2.5;
	m.minDistance = 250;
	m.iAnimSpeed = 7;
	m.isMaggot = true;
	m.Draw = SpriteDraw;
	m.Update = MaggotType3Update;
	m.colliders = [];
	m.layer = 2;
	m.offsetY = 12;
}

function MaggotType1Update()
{
	for(var i = 0; i < numberOfObjects; i++)
	{
		var obj = objects[i];
		if(obj.lightOn)
		{
			var dx = this.x - obj.x;
			var dy = this.y - obj.y;
			if(dx * dx + dy * dy < this.minDistance * this.minDistance)
			{
				if(dx > 0) this.goRight = false;
				else this.goRight = true;
			}
		}
	}
	if((this.goRight) &&  (this.x > this.x1)) this.goRight = false;
	if((!this.goRight) && (this.x < this.x0)) this.goRight = true;
	if(this.goRight) this.xSpeed = +this.speed;
	else this.xSpeed = -this.speed;
	DoPlatformerPhysics(this);
	if(this.xSpeed != 0) this.frame = Math.floor(frame / this.iAnimSpeed) % 3;
	else this.frame = 0;
}

function MaggotType2Update()
{
	for(var i = 0; i < numberOfObjects; i++)
	{
		var obj = objects[i];
		if(obj.lightOn)
		{
			var dx = this.x - obj.x;
			var dy = this.y - obj.y;
			if(dx * dx + dy * dy < this.minDistance * this.minDistance)
			{
				if(dx > 0) this.goRight = false;
				else this.goRight = true;
			}
		}
	}
	if(this.goRight) this.xSpeed = +this.speed;
	else this.xSpeed = -this.speed;
	DoPlatformerPhysics(this);
	if(this.colliders[3]) this.goRight = false;
	if(this.colliders[2]) this.goRight = true;
	if(this.xSpeed != 0) this.frame = Math.floor(frame / this.iAnimSpeed) % 3;
	else this.frame = 0;
}

function MaggotType3Update()
{
	this.xSpeed = 0;
	for(var i = 0; i < numberOfObjects; i++)
	{
		var obj = objects[i];
		if(obj.lightOn)
		{
			var dx = this.x - obj.x;
			var dy = this.y - obj.y;
			if(dx * dx + dy * dy < this.minDistance * this.minDistance)
			{
				if(dx > 0) this.xSpeed = +this.speed;
				else this.xSpeed = -this.speed;
			}
		}
	}
	DoPlatformerPhysics(this);
	if(this.xSpeed != 0)	this.frame = Math.floor(frame / this.iAnimSpeed) % 3;
	else this.frame = 0;
}

function InitLandingSpot(x0, y0, x1, y1)
{
	var l = NewObject();
	l.x = x0;
	l.y = y0;
	l.maxModuleDistance = Math.sqrt((x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1));
}