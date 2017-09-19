function InitEnding()
{
	var e = NewObject();
	e.background = data["introBg.png"];
	e.earth = data["earth.png"];
	e.hammerAndSickle = data["hammerAndSickle.png"];
	e.Draw = EndingDraw;
	e.Update = EndingUpdate;
	e.time = 0;
	e.earthY = 240;
	e.hsY = 240;
	e.movementCounter = 0;
	e.movementTime = 60 * 6;
	e.dialogCounter = 0;
	e.endingThune = data["endingThune.ogg"];
}

function EndingDraw()
{
	context.drawImage(this.background, 0, 0);
	context.save();
	context.translate(320, this.hsY);
	context.drawImage(this.hammerAndSickle, 0 - this.hammerAndSickle.width * 0.5, 0 - this.hammerAndSickle.height * 0.5);
	context.restore();
	context.save();
	context.translate(320, this.earthY);
	context.drawImage(this.earth, 0 - this.earth.width * 0.5, 0 - this.earth.height * 0.5);
	context.restore();
}

function EndingUpdate()
{
	if(this.time == 0) this.endingThune.play();
	var t = this.movementCounter / this.movementTime;
	this.earthY = 240 +  (t * t * (3 - 2 * t)) * 240;
	this.hsY = 240 + (240 - this.earthY) * 0.5;
	if(this.movementCounter < this.movementTime) this.movementCounter++;
	if(this.movementCounter >= this.movementTime)
	{
		if(!IsDialogActive())
		{
			if(this.dialogCounter == 0)
			{
				InitDialog("I teach you the superman.", "Man is something to be surpassed.");
				this.dialogCounter++;
			}
			else if(this.dialogCounter == 1)
			{
				InitDialog("What have ye done to surpass man?", "             --- Thus spoke Zarathustra");
				this.dialogCounter++;
			}
			else if(this.dialogCounter == 2)
			{
				level = 3;
				ChangeGameState(2);
			}
		}
	}
	this.time++;
}