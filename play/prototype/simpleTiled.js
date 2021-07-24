function SimpleTiled(json){
	this.json = json;
	if(this.json) this.Init();
}

SimpleTiled.prototype.Init = function(){
	this.tiles = this.json.layers.filter(l => (l.type == "tilelayer"))[0];
	this.objects = this.json.layers.filter(l => (l.type == "objectgroup"))[0];
	this.tileset = this.json.tilesets[0];
}

SimpleTiled.prototype.GetTile = function(x, y){
	return this.tiles.data[x + y * this.tiles.width] - this.tileset.firstgid;
}

SimpleTiled.prototype.Draw = function(context, tilesetImage, col, row, cols, rows){
	col = col || 0;
	row = row || 0;
	cols = cols ? cols : this.tiles.width;
	rows = rows ? rows : this.tiles.height;
	var lastCol = col + cols;
	var lastRow = row + rows;
	var col_ = col;
	for(; row < lastRow; row++){
		for(col = col_; col < lastCol; col++){
			var tile_ = this.tiles.data[col + row * this.tiles.width] - 1;
			var tileC = 0, tileR = 0;
			var tilesetRows = Math.floor(this.tileset.imageheight / this.tileset.tileheight);
			tileC = tile_ % tilesetRows;
			tileR = (tile_ - (tile_ % tilesetRows)) / tilesetRows;
			context.drawImage(tilesetImage, tileC * this.json.tilewidth, tileR * this.json.tileheight, this.tileset.tilewidth, this.tileset.tileheight, col * 8, row * 8, this.tileset.tilewidth, this.tileset.tileheight);
		}
	}
}

/*
context.drawImage(
	tilesetImage,
	tileC * this.json.tilewidth,
	tileR * this.json.tileheight,
	this.tileset.tilewidth,
	this.tileset.tileheight,
	x,
	y,
	this.tileset.tilewidth,
	this.tileset.tileheight
	)
*/

SimpleTiled.prototype.TileProperties = function(t){
	var p = this.tileset.tileproperties[t];
	if(!p) p = {};
	return p;
}

SimpleTiled.prototype.InitEntities = function(entityConstructors, entities){
	this.objects.objects.forEach(function(obj){
		if(!entityConstructors.hasOwnProperty(obj.type)) return;
		var e = new entityConstructors[obj.type](obj);
		entities.push(e);
	});
}

SimpleMap = SimpleTiled;
delete SimpleTiled;