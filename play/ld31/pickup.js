dataSrcs.push("gfx/strawberry.png");
dataSrcs.push("gfx/acorn.png");
dataSrcs.push("gfx/leaf.png");
dataSrcs.push("audio/pickup.wav");

function Pickup(i)
{
	this.index = i;
	this.x = 0;
	this.y = 0;
	this.width = 32;
	this.height = 32;
	this.image = data[["gfx/strawberry.png", "gfx/acorn.png", "gfx/leaf.png"][i]];
	this.sound = data["audio/pickup.wav"];
}

Pickup.prototype.Draw = ImageDraw;

Pickup.prototype.Update = function()
{
	var es = GetCollidingEntities.call(this, "hitbox");
	for(var i = 0; i < es.length; i++)
	{
		if(es[i] instanceof Hero)
		{
			es[i].pickups[this.index] = true;
			this.alive = false;
			this.sound.play();
			break;
		}
	}
}