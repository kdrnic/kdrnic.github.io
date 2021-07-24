dataSrcs.push("audio/opening.ogg");
dataSrcs.push("audio/ingredients.ogg");

function Opening(p)
{
	this.time = 0;
	this.target = p;
}

Opening.prototype.Update = function(dt)
{
	if(this.time == 0)
	{
		glass.x = canvas.width;
		glass.y = canvas.height;
		this.glassSpeedX = (this.target.x - canvas.width) / 19;
		this.glassSpeedY = (this.target.y - canvas.height) / 19;
		this.target.canMove = false;
		this.target.autoFocus = false;
		data["audio/opening.ogg"].play();
	}
	this.time += dt;
	this.glassSpeedX = (this.target.x - glass.x) / (19 - this.time);
	this.glassSpeedY = (this.target.y - glass.y) / (19 - this.time);
	glass.x += this.glassSpeedX * dt;
	glass.y += this.glassSpeedY * dt;
	if(this.time >= 19)
	{
		this.target.canMove = true;
		this.target.autoFocus = true;
		this.alive = false;
		data["audio/ingredients.ogg"].play();
	}
}