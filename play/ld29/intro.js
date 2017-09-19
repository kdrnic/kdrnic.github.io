function InitIntro()
{
	var i = NewObject();
	i.background = data["introBg.png"];
	i.planet = data["neptune.png"];
	i.planetScale = 0.00001;
	i.planetScaleSpeed = 0.0004;
	i.Draw = IntroDraw;
	i.Update = IntroUpdate;
	i.time = 0;
	i.groundControl = data["groundControl.ogg"];
}

function IntroDraw()
{
	context.drawImage(this.background, 0, 0);
	context.save();
	context.translate(320, 240);
	context.scale(this.planetScale, this.planetScale);
	context.drawImage(this.planet, 0 - this.planet.width * 0.5, 0 - this.planet.height * 0.5);
	context.restore();
}

function IntroUpdate()
{
	if(this.time == 0) this.groundControl.play();
	this.planetScale = this.planetScaleSpeed * (this.time + 1);
	
	if(this.time == 0) // 0s
	{
		KillDialog();
		InitDialog("<Ground control to major Tomashevsky>", "<Ground control to major Tomashevsky>");
	}
	if(this.time == 270) // 4.5s
	{
		KillDialog();
		InitDialog("<Check radio power and frequency stability>", "<Retrieving your trajectory information>");
	}
	if(this.time == 660)
	{
		KillDialog();
		InitDialog("<Our computers will recalculate the differential equations>", "<Correct trajectory coordinates for vector 25 61 43>");
	}
	if(this.time == 1050)
	{
		KillDialog();
		InitDialog("<You are approaching the outer layers of Neptune>", "<Turbulence is expected due to atmospheric conditions>");
	}
	if(this.time == 1440)
	{
		KillDialog();
		InitDialog("(Radio signal fading)", "");
	}
	if(this.time == 1920)
	{
		KillDialog();
		InitDialog("Oh no! I have lost contact with ground control!", "A magnetic field is blocking the communications channel!");
	}
	if(this.time == 2310)
	{
		KillDialog();
		InitDialog("Without ground control's computers, I have no choice", "but to descend into this planet.");
	}
	
	if((this.time >= 60 * 59) || ((this.time >= 2310) && (!IsDialogActive())) || (keys["keySkip"].state == 1))
	{
		this.groundControl.pause();
		this.groundControl.currentTime = 0;
		level = 1;
		ChangeGameState(2);
	}
	this.time++;
}