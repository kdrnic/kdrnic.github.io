function Collision(a, b)
{
	if((Math.abs(a.x - b.x) < (a.width + b.width) * 0.5) && (Math.abs(a.y - b.y) < (a.height + b.height) * 0.5)) return true;
	return false;
}

function Parallax(img, spd)
{
	this.image = img;
	this.speed = spd;
}

Parallax.prototype.Draw = ParallaxDraw;

function AvoidSolids()
{
	var colliders = [false, false, false, false];
	for(var i = 0; i < entities.length; i++)
	{
		var other = entities[i];
		if(other == this) continue;
		if(!other.GetBoxesFor) continue;
		var boxes = other.GetBoxesFor(this);
		for(var j = 0; j < boxes.length; j++)
		{
			var box = boxes[j];
			if(box.type != "solid") continue;
			var vX = this.x - box.x, vY = this.y - box.y;
			var halfWidths = (this.width + box.width) * 0.5, halfHeights = (this.height + box.height) * 0.5;
			var oX = halfWidths - Math.abs(vX), oY = halfHeights - Math.abs(vY);
			if((Math.abs(vX) < halfWidths) && (Math.abs(vY) < halfHeights))
			{
				if(oX >= oY)
				{
					if(vY > 0)
					{
						colliders[0] = {box: box, entity: other};
						this.y += oY;
					}
					else
					{
						colliders[1] = {box: box, entity: other};
						this.y -= oY;
					}
				}
				else
				{
					if(vX > 0)
					{
						colliders[2] = {box: box, entity: other};
						this.x += oX;
					}
					else
					{
						colliders[3] = box;
						this.x -= oX;
					}
				}
			}
		}
	}
	return colliders;
}

function ApplyFriction(object, xCoefficient, yCoefficient)
{
	if(!xCoefficient) xCoefficient = 1.0;
	if(!yCoefficient) yCoefficient = 0.0;
	var xFriction = 0;
	var yFriction = 0;
	if((object.colliders[1]) && (object.colliders[1].friction)) xFriction = object.colliders[1].friction;
	if((object.colliders[0]) && (object.colliders[0].friction)) xFriction = object.colliders[0].friction;
	if((object.colliders[2]) && (object.colliders[2].friction)) yFriction = object.colliders[2].friction;
	if((object.colliders[3]) && (object.colliders[3].friction)) yFriction = object.colliders[3].friction;
	xFriction *= xCoefficient;
	yFriction *= yCoefficient;
	xFriction *= Math.abs(object.ySpeed);
	yFriction *= Math.abs(object.xSpeed);
	if(xFriction < Math.abs(object.xSpeed)) object.xSpeed -= (xFriction * object.xSpeed) / Math.abs(object.xSpeed);
	else object.xSpeed = 0;
	if(yFriction < Math.abs(object.ySpeed)) object.ySpeed -= (yFriction * object.ySpeed) / Math.abs(object.ySpeed);
	else object.ySpeed = 0;
}

function PlatformerPhysicsUpdate()
{
	this.ySpeed += gravity;
	if(this.colliders[1])
	{
		this.oldX = this.x;
		this.oldY = this.y;
		if(this.colliders[1].dx) this.x += this.colliders[1].dx;
		if(this.colliders[1].dy) this.y += this.colliders[1].dy;
		AvoidSolids(this);
	}
	ApplyFriction(this);
	this.oldX = this.x;
	this.oldY = this.y;
	this.x += this.xSpeed;
	this.y += this.ySpeed;
	this.colliders = AvoidSolids(this);
	this.xSpeed = this.x - this.oldX;
	this.ySpeed = this.y - this.oldY;
}

function AlwaysReturnTrue(useless)
{
	return true;
}

function CameraFocusOn(obj)
{
	camera.x = obj.x - canvas.width * 0.5;
	camera.y = obj.y - canvas.height * 0.5;
}

function IsVisible(obj)
{
	var box = { x: camera.x, y: camera.y, width: canvas.width, height: canvas.height};
	return Collision(obj, box);
}

function IsVisibleTo(obj, obj2)
{
	if((Math.abs(obj.x - obj2.x) < (canvas.width + obj.width + obj2.width) * 0.5) && (Math.abs(obj.y - obj2.y) < (canvas.height + obj.height + obj2.height) * 0.5)) return true;
	return false;
}

function ExistentAndAlive(obj)
{
	if(!obj) return false;
	if(!obj.alive) return false;
	return true;
}

function BackAndForthUpdate()
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

function SimpleGetBoxes(o)
{
	return [{type: "solid", x: this.x, y: this.y, width: this.width, height: this.height}, {type: "hitbox", x: this.x, y: this.y, width: this.width, height: this.height}];
}

function SimplerGetBoxes(o)
{
	return [{type: "solid", x: this.x, y: this.y, width: this.width, height: this.height}];
}

function GetCollidingBoxes(type)
{
	var boxes = [];
	for(var i = 0; i < entities.length; i++)
	{
		var other = entities[i];
		if(other == this) continue;
		if(!other.GetBoxesFor) continue;
		var boxes = other.GetBoxesFor(this);
		for(var j = 0; j < boxes.length; j++)
		{
			var box = boxes[j];
			if((typeof type == "undefined") ? false : (type != box.type)) continue;
			var vX = this.x - box.x, vY = this.y - box.y;
			var halfWidths = (this.width + box.width) * 0.5, halfHeights = (this.height + box.height) * 0.5;
			var oX = halfWidths - Math.abs(vX), oY = halfHeights - Math.abs(vY);
			if((Math.abs(vX) < halfWidths) && (Math.abs(vY) < halfHeights))
			{
				boxes.push({box: box, entity: other});
			}
		}
	}
	return boxes;
}

function GetCollidingEntities(type)
{
	var es = [];
	for(var i = 0; i < entities.length; i++)
	{
		var other = entities[i];
		if(other == this) continue;
		if(!other.GetBoxesFor) continue;
		var boxes = other.GetBoxesFor(this);
		for(var j = 0; j < boxes.length; j++)
		{
			var box = boxes[j];
			if((typeof type == "undefined") ? false : (type != box.type)) continue;
			var vX = this.x - box.x, vY = this.y - box.y;
			var halfWidths = (this.width + box.width) * 0.5, halfHeights = (this.height + box.height) * 0.5;
			var oX = halfWidths - Math.abs(vX), oY = halfHeights - Math.abs(vY);
			if((Math.abs(vX) < halfWidths) && (Math.abs(vY) < halfHeights))
			{
				es.push(other);
				break;
			}
		}
	}
	return es;
}

function SetFrame()
{
	this.oldFrame = this.frame;
	this.frame = 1;
	if(this.walkTime != 0)
	{
		this.frame = Math.floor(this.walkTime * this.walkAnimSpeed) % 4;
		if(this.frame == 3) this.frame = 1;
	}
	if(this.attackTime >= 0)
	{
		this.frame = 3 + (Math.floor(this.attackTime * this.attackAnimSpeed) % 4);
	}
	this.flipH = false;
	if(this.direction == 3) this.flipH = true;
	if(this.direction == 2) this.frame += 7;
	if(this.direction == 0) this.frame += 14;
}

function CreateAttack(i)
{
	this.attackTime = 0;
	var a = new Attack();
	a.width = 25;
	a.height = 25;
	a.lifeTime = 4 / this.attackAnimSpeed;
	a.targetInstance = i;
	if(this.direction == 0)
	{
		a.x = this.x;
		a.y = this.y - 12.5 - this.height * 0.5;
	}
	if(this.direction == 1)
	{
		a.x = this.x + this.width * 0.5 + 12.5;
		a.y = this.y;
	}
	if(this.direction == 2)
	{
		a.x = this.x;
		a.y = this.y + 12.5 + this.height * 0.5;
	}
	if(this.direction == 3)
	{
		a.x = this.x - this.width * 0.5 - 12.5;
		a.y = this.y;
	}
	AddEntity(a);
}