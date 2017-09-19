dataSrcs.push("gfx/wizardSprite.png");
dataSrcs.push("audio/congratulations.ogg");

function Wizard()
{

	this.x = 0;
	this.y = 0;
	this.width = 25;
	this.height = 60;
	this.offsetX = -4;
	this.offsetY = 2;
	this.frameWidth = 76;
	this.frame = 0;
	this.GetBoxesFor = SimplerGetBoxes;
	this.image = data["gfx/wizardSprite.png"];
	this.animTime = 0;
	this.animSpeed = 4;
	this.victory = false;
	this.countdownToDestinty = 8;
}

Wizard.prototype.Draw = SpriteDraw;

Wizard.prototype.Update = function(dt)
{
	this.animTime += dt;
	this.frame = Math.floor(this.animTime * this.animSpeed) % 4;
	if(this.frame == 3) this.frame = 1;
	
	if(this.victory)
	{
		this.countdownToDestinty -= dt;
	}
	else
	{
		for(var i = 0; i < entities.length; i++)
		{
			if(entities[i].alive)
			{
				if(entities[i] instanceof Hero)
				{
					var p = entities[i];
					if((p.x - this.x) * (p.x - this.x) + (p.y - this.y) * (p.y - this.y) <= 115 * 115)
					{
						if(p.pickups[0] && p.pickups[1] && p.pickups[2])
						{
							this.victory = true;
							data["audio/congratulations.ogg"].play();
						}
					}
					break;
				}
			}
		}
	}
	
	if(this.countdownToDestinty < 0) hasWon = true;
}