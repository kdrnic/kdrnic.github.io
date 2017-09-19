function TiledMap(json)
{
	if(typeof json != "undefined") this.LoadJSON(json);
}

TiledMap.prototype.LoadJSON = function(json)
{
	this.map = JSON.parse(json);
}

TiledMap.prototype.Draw = function()
{
	var m = this.map;
	for(var i = 0; i < m.layers.length; i++)
	{
		var l = m.layers[i];
		if(l.type == "tilelayer")
		{
			for(var x = 0; x < l.width; x++)
			{
				for(var y = 0; y < l.height; y++)
				{
					var tile = l.data[x + y * l.width];
					if(tile == 0) continue;
					var tile_ = -1;
					var tileset = "";
					for(var j = 0; j < m.tilesets.length; j++)
					{
						var t = m.tilesets[j];
						if(tile < t.firstgid) break;
						tile_ = tile - t.firstgid;
						tileset = t;
					}
					if(tile_ < 0)
					{
						console.log("ERROR: Couldn't find tileset for tile " + tile);
						continue;
					}
					var tilesetImage = data[tileset.image];
					var tileC = 0, tileR = 0;
					var tilesetRows = Math.floor(tileset.imageheight / tileset.tileheight);
					tileC = tile_ % tilesetRows;
					tileR = (tile_ - (tile_ % tilesetRows)) / tilesetRows;
					//console.log(tilesetImage, tileC * tileset.tilewidth, tileR * tileset.tileheight, , , l.x + x * m.tilewidth, l.y + y * m.tileheight, m.tilewidth, m.tileheight);
					context.drawImage(tilesetImage, tileC * tileset.tilewidth, tileR * tileset.tileheight, tileset.tilewidth, tileset.tileheight, l.x + x * m.tilewidth, l.y + y * m.tileheight, m.tilewidth, m.tileheight);
				}
			}
		}
	}
}

function TiledMapEntity(json)
{
	this.tm = new TiledMap(json);
	this.x = 0;
	this.y = 0;
	this.width = 0;
	this.height = 0;
}

TiledMapEntity.prototype.Draw = function()
{
	context.save();
	context.translate(this.x, this.y);
	this.tm.Draw();
	context.restore();
}

TiledMapEntity.prototype.GetBoxesFor = function(o)
{
	var boxes = [];
	var l;
	var m = this.tm.map;
	for(var i = 0; i < m.layers.length; i++)
	{
		if(m.layers[i].name == "walls")
		{
			l = m.layers[i];
			break;
		}
	}
	if(typeof l == "undefined") return boxes;
	
	var ox = o.x - this.x;
	var oy = o.y - this.y;
	var sx = Math.max(Math.floor((ox - o.width * 0.5) / m.tilewidth), 0);
	var ex = Math.min(Math.ceil((ox + o.width * 0.5) / m.tilewidth), m.width);
	var sy = Math.max(Math.floor((oy - o.height * 0.5) / m.tileheight), 0);
	var ey = Math.min(Math.ceil((oy + o.height * 0.5) / m.tileheight), m.height);
	
	for(var x = sx; x < ex; x++)
	{
		for(var y = sy; y < ey; y++)
		{
			if(l.data[x + y * m.height] != 0)
			{
				boxes.push
				({
					x: this.x + (x + 0.5) * m.tilewidth,
					y: this.y + (y + 0.5) * m.tileheight,
					width: m.tilewidth,
					height: m.tileheight,
					type: "solid"
				});
			}
		}
	}
	
	return boxes;
}