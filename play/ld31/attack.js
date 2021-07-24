function Attack()
{
	this.x = 0;
	this.y = 0;
	this.width = 1;
	this.height = 1;
	this.lifeTime = 1;
	this.damage = 1;
	this.targetInstance = Object;
}

Attack.prototype.Update = function(dt)
{
	var es = GetCollidingEntities.call(this, "hitbox");
	for(var i = 0; i < es.length; i++)
	{
		if(es[i] instanceof this.targetInstance)
		{
			if(es[i].Hit)
			{
				es[i].Hit(this.damage);
				this.alive = false;
			}
		}
	}
	this.lifeTime -= dt;
	if(this.lifeTime <= 0) this.alive = false;
}