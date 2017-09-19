function InitRock(x, y, w, h)
{
	var r = NewObject();
	r.x = x;
	r.y = y;
	r.width = w;
	r.height = h;
	r.friction = 0.5;
	r.IsSolidTo = AlwaysReturnTrue;
	r.image = data["rock.png"];
	r.Draw = TiledDraw2;
}

function InitRockNoBug(x, y, w, h)
{
	var r = NewObject();
	r.x = x;
	r.y = y;
	r.width = w;
	r.height = h;
	r.friction = 0.5;
	r.IsSolidTo = AlwaysReturnTrue;
	r.image = data["rock.png"];
	r.Draw = TiledDraw;
}

function InitSoftRock(x, y, w, h)
{
	var r = NewObject();
	r.x = x;
	r.y = y;
	r.width = w;
	r.height = h;
	r.friction = 0.75;
	r.IsSolidTo = AlwaysReturnTrue;
	r.images = [data["softRock1.png"], data["softRock2.png"], data["softRock3.png"], data["softRock4.png"], data["softRock5.png"]];
	r.image = r.images[0];
	r.Draw = TiledDraw2;
	r.Hit = SoftRockHit;
	r.health = 100;
	r.layer = 0.5;
}

function SoftRockHit(dmg)
{
	this.health -= dmg;
	if(this.health <= 0)
	{
		this.alive = false;
		return;
	}
	this.image = this.images[5 - Math.ceil(this.health / 20)];
}

function InitMovingRock(x0, y0, x1, y1)
{
	if(x0 > x1)
	{
		var temp;
		temp = x0;
		x0 = x1;
		x1 = temp;
		temp = y0;
		y0 = y1;
		y1 = temp;
	}
	var r = NewObject();
	r.x = x0;
	r.y = y0;
	r.x0 = x0;
	r.y0 = y0;
	r.x1 = x1;
	r.y1 = y1;
	r.dx = x1 - x0;
	r.dy = y1 - y0;
	var length = Math.sqrt(r.dx * r.dx + r.dy * r.dy);
	r.dx /= length;
	r.dy /= length;
	var speed = 3.0;
	r.dx *= speed;
	r.dy *= speed;
	r.width = 150;
	r.height = 65;
	r.friction = 0.5;
	r.IsSolidTo = AlwaysReturnTrue;
	r.image = data["rock.png"];
	r.Draw = TiledDraw;
	r.Update = BackAndForthUpdate;
}