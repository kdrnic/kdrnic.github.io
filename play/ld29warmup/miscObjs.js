function InitFlyingSaucer(x, y)
{
	var f = NewObject();
	f.x = x;
	f.y = y;
	f._y = y;
	f.image = data["flyingSaucer.png"];
	f.frequency = 0.5;
	f.amplitude = 5;
	f.Draw = ImageDraw;
	f.Update = FlyingSaucerUpdate;
	f.box = {};
	f.box.x = f.x;
	f.box.y = f.y + 675 * 0.25;
	f.box.width = 450 / 2.5;
	f.box.height = 675 * 0.5;
	f.abductionDelay = 300;
	f.abductionCounter = -1;
}

function FlyingSaucerUpdate()
{
	this.y = this._y + this.amplitude * Math.sin(frame * (this.frequency / (2 * Math.PI)));
	if(this.abductionCounter < 0)
	{
		var vikingsBelow = 0;
		if((ExistentAndAlive(vikings[0])) && (Collision(this.box, vikings[0]))) vikingsBelow++;
		if((ExistentAndAlive(vikings[1])) && (Collision(this.box, vikings[1]))) vikingsBelow++;
		if((ExistentAndAlive(vikings[2])) && (Collision(this.box, vikings[2]))) vikingsBelow++;
		if(vikingsBelow == levelVikings)
		{
			if(ExistentAndAlive(vikings[0]))
			{
				vikings[0].abduction = true;
				vikings[0].abductionX = this.x;
				vikings[0].abductionY = this.y;
			}
			if(ExistentAndAlive(vikings[1]))
			{
				vikings[1].abduction = true;
				vikings[1].abductionX = this.x;
				vikings[1].abductionY = this.y;
			}
			if(ExistentAndAlive(vikings[2]))
			{
				vikings[2].abduction = true;
				vikings[2].abductionX = this.x;
				vikings[2].abductionY = this.y;
			}
			this.abductionCounter = this.abductionDelay;
		}
	}
	else
	{
		this.abductionCounter--;
		if(this.abductionCounter == 0)
		{
			level++;
			ChangeGameState(2);
		}
	}
}

function InitSpikes(x, y, w)
{
	var p = NewObject();
	p.x = x;
	p.y = y;
	p.width = w;
	p.height = 65;
	p.Draw = TiledDraw;
	p.image = data["spikes.png"];
	p.Update = SpikesUpdate;
	p.friction = 0.5;
	p.IsSolidTo = SpikesIsSolidTo;
}

function SpikesUpdate()
{
	for(var i = 0; i < numberOfObjects; i++)
	{
		var obj = objects[i];
		if(!obj.alive) continue;
		if(obj == this) continue;
		
		if(Collision(this, obj))
		{
			if(obj.Hit)
			{
				obj.Hit(999); // Note that spikes do not distinguish between ally and foe
			}
		}
	}
}

function SpikesIsSolidTo(obj)
{
	if((obj.Hit) && (obj.Hit == VikingHit)) return false;
	return true;
}

function InitNuker()
{
	var n = NewObject();
	n.x = -999;
	n.y = -999;
	n.width = n.height = 1;
	n.Update = NukerUpdate;
}

function NukerUpdate()
{
	if(keys["keySuicide"].state != 0)
	{
		for(var i = 0; i < numberOfObjects; i++)
		{
			if(!objects[i].alive) continue;
			if(objects[i].Hit) objects[i].Hit(999);
		}
	}
}