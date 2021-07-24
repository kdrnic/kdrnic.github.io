function InitCube(x, y) // Psycho cube!
{
	var c = NewObject();
	c.x = x;
	c.y = y;
	c.y0 = y;
	c.width = 140;
	c.height = 140;
	c.frame = 0;
	c.frameWidth = 140;
	c.image = data["cubeSprite.png"];
	c.shine = {};
	c.shine.x = x;
	c.shine.y = y;
	c.shine.image = data["cubeShine.png"];
	c.shine.rotationSpeed = 13;
	c.Draw = CubeDraw;
	c.Update = CubeUpdate;
	c.layer = 3;
	c.iAnimSpeed = 6;
	c.iRotationSpeed;
	c.amplitude = 45;
	c.frequency = 0.5;
	c.active = false;
	c.trembling = 0;
	c.dialogCounter = 0;
	c.throwUpCounter = 0;
	c.sound = data["ooh.ogg"];
	c.sound.loop = true;
}

function CubeDraw()
{
	DrawRotating(this.shine);
	DrawSprite(this);
}

function CubeUpdate()
{
	this.frame = Math.floor(frame / this.iAnimSpeed) % 18;
	this.y = this.y0 + Math.sin((frame / 60) * 2 * Math.PI * this.frequency) * this.amplitude * 0.5;
	this.shine.y = this.y;
	if(this.active)
	{
		CameraFocusOn(this);
		camera.x += (Math.random() * this.trembling) - (this.trembling * 0.5);
		camera.y += (Math.random() * this.trembling) - (this.trembling * 0.5);
		if(!IsDialogActive())
		{
			if(this.dialogCounter == 0)
			{
				InitDialog("What's this?",  "It has an ethereal, magical shape!");
				this.dialogCounter++;
				this.trembling += 5;
				InitFlashingEffect("red", 20);
				this.sound.volume = 0.33;
				this.sound.play();
			}
			else if(this.dialogCounter == 1)
			{
				InitDialog("It's... an object... of immense power...",  "I can feel it...");
				this.dialogCounter++;
				this.trembling += 10;
				InitFlashingEffect("green", 20);
				this.sound.volume = 0.66;
			}
			else if(this.dialogCounter == 2)
			{
				InitDialog("SUCH WISDOM! ENTERING MY MIND!",  "UNLIMITED... POWER!"); // Yes yes this is inspired by Indiana Jones and the Kingdom of the Crystal Skull
				this.dialogCounter++;
				this.trembling += 15; // Just to make sure the player throws up
				InitFlashingEffect("blue", 20);
				this.sound.volume = 1.0;
			}
			else if(this.dialogCounter == 3) this.throwUpCounter++;
		}
		if(this.throwUpCounter >= 180)
		{
			this.sound.pause();
			level = 2;
			ChangeGameState(2);
		}
	}
}

function InitFlashingEffect(color, period)
{
	var f = NewObject();
	f.period = period;
	if(color == "red") f.image = data["redAlpha.png"];
	if(color == "green") f.image = data["greenAlpha.png"];
	if(color == "blue") f.image = data["blueAlpha.png"];
	f.Draw = FlashingEffectDraw;
	f.random = Math.floor(Math.random() * 1000);
	f.duration = 4;
}

function FlashingEffectDraw()
{
	if(Math.floor((frame + this.random) / this.duration) % this.period == 0) DrawTiled(this.image, camera.x, camera.y, canvas.width, canvas.height);
}