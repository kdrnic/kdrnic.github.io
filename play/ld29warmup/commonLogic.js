function Collision(a, b)
{
	if((Math.abs(a.x - b.x) < (a.width + b.width) * 0.5) && (Math.abs(a.y - b.y) < (a.height + b.height) * 0.5)) return true;
	return false;
}

function InitParallax(img, speed)
{
	var obj = NewObject();
	obj.image = img;
	obj.speed = speed;
	obj.Update = false;
	obj.Draw = ParallaxDraw;
}

function AvoidSolids(object)
{
	var colliders = [false, false, false, false];
	for(var i = 0; i < numberOfObjects; i++)
	{
		var other = objects[i];
		if(other == object) continue;
		if(!other.IsSolidTo) continue;
		if(!other.IsSolidTo(object)) continue;
		var vX = object.x - other.x, vY = object.y - other.y;
		var halfWidths = (object.width + other.width) * 0.5, halfHeights = (object.height + other.height) * 0.5;
		var oX = halfWidths - Math.abs(vX), oY = halfHeights - Math.abs(vY);
		if((Math.abs(vX) < halfWidths) && (Math.abs(vY) < halfHeights))
		{
			if(oX >= oY)
			{
				if(vY > 0)
				{
					colliders[0] = other;
					object.y += oY;
				}
				else
				{
					colliders[1] = other;
					object.y -= oY;
				}
			}
			else
			{
				if(vX > 0)
				{
					colliders[2] = other;
					object.x += oX;
				}
				else
				{
					colliders[3] = other;
				object.x -= oX;
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

function DoPlatformerPhysics(object)
{
	object.ySpeed += gravity;
	if(object.colliders[1])
	{
		object.oldX = object.x;
		object.oldY = object.y;
		if(object.colliders[1].dx) object.x += object.colliders[1].dx;
		if(object.colliders[1].dy) object.y += object.colliders[1].dy;
		AvoidSolids(object);
	}
	ApplyFriction(object);
	object.oldX = object.x;
	object.oldY = object.y;
	object.x += object.xSpeed;
	object.y += object.ySpeed;
	object.colliders = AvoidSolids(object);
	object.xSpeed = object.x - object.oldX;
	object.ySpeed = object.y - object.oldY;
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

function PlatformerUpdate()
{
	DoPlatformerPhysics(this);
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

function ProjectileUpdate()
{
	if((this.frameDeath) && (frame == this.frameDeath))
	{
		alive = false;
		return;
	}
	this.x += this.dx;
	this.y += this.dy;
	// Why two loops? So that objects spawned in positions they would die instantly do no harm (PRIMVM NON NOCERE)
	for(var i = 0; i < numberOfObjects; i++)
	{
		var obj = objects[i];
		if(!obj.alive) continue;
		if(obj == this) continue;
		
		if(Collision(this, obj))
		{
			if((obj.IsSolidTo) && (obj.IsSolidTo(this)))
			{
				this.alive = false;
				return;
			}
		}
	}
	for(var i = 0; i < numberOfObjects; i++)
	{
		var obj = objects[i];
		if(!obj.alive) continue;
		if(obj == this) continue;
		
		if(Collision(this, obj))
		{
			if(obj.Hit == this.targetHit)
			{
				obj.Hit(this.damage);
				this.alive = false;
			}
		}
	}
}