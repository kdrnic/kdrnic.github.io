function InitDirt(x, y, width, height)
{
	var p = NewObject();
	p.x = x;
	p.y = y;
	p.width = width;
	p.height = height;
	p.friction = 0.5;
	p.IsSolidTo = AlwaysReturnTrue;
	p.Draw = DirtDraw;
	p.dirtTexture = data["caveTexture.png"];
	p.grassTexture = data["grass.png"];
}

function DirtDraw()
{
	DrawTiled2(this.dirtTexture, this.x - this.width * 0.5, this.y - this.height * 0.5, this.width, this.height);
	DrawTiled(this.grassTexture, this.x - this.width * 0.5, this.y - this.grassTexture.height * 0.5 - this.height * 0.5, this.width, this.grassTexture.height);
}

function InitPterodactyl(x0, y0, x1, y1)
{
	var p = NewObject();
	if(x1 < x0)
	{
		var temp = x1;
		x1 = x0;
		x0 = temp;
		temp = y1;
		y1 = y0;
		y0 = temp;
	}
	p.x = x0;
	p.y = y0;
	p.x0 = x0;
	p.y0 = y0;
	p.x1 = x1;
	p.y1 = y1;
	p.width = 170;
	p.height = 40;
	p.image = data["pterodactyl.png"];
	p.Draw = ImageDraw;
	p.Update = PterodactylUpdate;
	p.speed = 2.5;
	p.dx = x1 - x0; // Note: |dx| must be > 0
	p.dy = y1 - y0;
	var length = Math.sqrt(p.dx * p.dx + p.dy * p.dy);
	p.dx /= length;
	p.dy /= length;
	p.dx *= p.speed;
	p.dy *= p.speed;
	p.IsSolidTo = AlwaysReturnTrue;
	p.friction = 1.0;
}

function PterodactylUpdate()
{
	if(this.dx > 0)
	{
		this.flipH = true;
		this.x = Math.min(this.x1, this.x + this.dx);
		if(this.x == this.x1)
		{
			this.y = this.y1;
			this.dx *= -1;
			this.dy *= -1;
		}
		else this.y += this.dy;
	}
	else
	{
		this.flipH = false;
		this.x = Math.max(this.x0, this.x + this.dx);
		if(this.x == this.x0)
		{
			this.y = this.y0;
			this.dx *= -1;
			this.dy *= -1;
		}
		else this.y += this.dy;
	}
}