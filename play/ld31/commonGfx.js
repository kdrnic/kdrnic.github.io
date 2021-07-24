function BoxDraw()
{
	context.save();
	context.translate(-camera.x, -camera.y);
	context.strokeStyle = "#000000";
	context.strokeRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
	context.restore();
}

function ImageDraw()
{
	context.save();
	context.translate(this.x - camera.x, this.y - camera.y);
	if(this.flipH) context.scale(-1, 1);
	if(this.flipV) context.scale(1, -1);
	if(this.offsetX) context.translate(-this.offsetX, 0);
	if(this.offsetY) context.translate(0, -this.offsetY);
	context.drawImage(this.image, 0 - this.image.width / 2, 0 - this.image.height / 2);
	context.restore();
}

function RotatingDraw()
{
	context.save();
	context.translate(this.x - camera.x, this.y - camera.y);
	context.rotate(frame * this.rotationSpeed);
	context.drawImage(this.image, 0 - this.image.width / 2, 0 - this.image.height / 2);
	context.restore();
}

function SpriteDraw()
{
	context.save();
	context.translate(this.x - camera.x, this.y - camera.y);
	if(this.flipH) context.scale(-1, 1);
	if(this.flipV) context.scale(1, -1);
	if(this.offsetX) context.translate(-this.offsetX, 0);
	if(this.offsetY) context.translate(0, -this.offsetY);
	context.drawImage(this.image, this.frame * this.frameWidth, 0, this.frameWidth, this.image.height, 0 - (this.frameWidth / 2), 0 - (this.image.height / 2), this.frameWidth, this.image.height);
	context.restore();
}

function SpriteDraw2()
{
	this.frame = Math.floor(gameTime / this.iAnimSpeed) % this.animLength;
	SpriteDraw.call(this);
}

function ParallaxDraw(image, speed)
{
	if(!this.speed) this.speed = 1.0;
	var scrollX = camera.x;
	var scrollY = camera.y;
	scrollX += canvas.width * 0.5;
	scrollY += canvas.height * 0.5;
	scrollX *= this.speed;
	scrollY *= this.speed;
	context.save();
	context.translate(-scrollX, -scrollY);
	for(var x = Math.floor(scrollX / this.image.width) * this.image.width; x < Math.ceil((scrollX + canvas.width) / this.image.width) * this.image.width; x += this.image.width)
	{
		for(var y = Math.floor(scrollY / this.image.height) * this.image.height; y < Math.ceil((scrollY + canvas.height) / this.image.height) * this.image.height; y += this.image.height)
		{
			context.drawImage(this.image, x, y);
		}
	}
	context.restore();
}

function TiledDraw()
{
	var x0 = this.x - this.width * 0.5;
	var y0 = this.y - this.height * 0.5;
	if(this.image.width == 0) return;
	if(this.image.height == 0) return;
	context.save();
	context.translate(-camera.x, -camera.y);
	var width = this.width;
	for(var x = x0; x < x0 + this.width; x += this.image.width)
	{
		var height = this.height;
		for(var y = y0; y < y0 + this.height; y += this.image.height)
		{
			context.drawImage(this.image, 0, 0, Math.min(this.image.width, width), Math.min(this.image.height, height), x, y, Math.min(this.image.width, width), Math.min(this.image.height, height));
			height -= Math.min(this.image.height, height);
		}
		width -= Math.min(this.image.width, width);
	}
	context.restore();
}

function TiledDraw2()
{
	var x0 = this.x - this.width * 0.5;
	var y0 = this.y - this.height * 0.5;
	if(this.image.width == 0) return;
	if(this.image.height == 0) return;
	context.save();
	context.translate(-camera.x, -camera.y);
	for(var x = Math.floor(x0 / this.image.width) * this.image.width; x < Math.ceil((x0 + this.width) / this.image.width) * this.image.width; x += this.image.width)
	{
		for(var y = Math.floor(y0 / this.image.height) * this.image.height; y < Math.ceil((y0 + this.height) / this.image.height) * this.image.height; y += this.image.height)
		{
			var _x = x;
			var _y = y;
			var __x = 0;
			var __y = 0;
			if(x0 > _x)
			{
				__x += x0 - _x;
				_x = x0;
			}
			if(y0 > _y)
			{
				__y += y0 - _y;
				_y = y0;
			}
			var _width = this.image.width;
			var _height = this.image.height;			
			if(x0 + this.width < _x + _width)
			{
				_width -= _x + _width - x0 - this.width;
			}
			if(y0 + this.height < _y + _height)
			{
				_height -= _y + _height - y0 - this.height;
			}			
			if(__x < 0) __x = 0;
			if(__y < 0) __y = 0;
			if(_width < 0) _width = 0;
			if(_width > this.image.width) _width = this.image.width;
			if(_height < 0) _height = 0;
			if(_height > this.image.height) _height = this.image.height;
			if(_width == 0) continue;
			if(_height == 0) continue;
			context.drawImage(this.image, __x, __y, _width, _height, _x, _y, _width, _height);
		}
	}
	context.restore();
}

function TileMapDraw()
{
	this.tileSize = 128;
	context.save();
	context.translate(this.x - camera.x, this.y - camera.y);
	for(var c = 0; c < this.tiles.length; c++)
	{
		if(this.x + (c + 1) * this.tileSize < camera.x) continue;
		if(this.x + c * this.tileSize > camera.x + canvas.width) break;
		for(var r = 0; r < this.tiles[c].length; r++)
		{
			if(this.y + (r + 1) * this.tileSize < camera.y) continue;
			if(this.y + r * this.tileSize > camera.y + canvas.height) break;
			if(this.tiles[c][r] < 0) continue;
			context.drawImage(this.tileset[this.tiles[c][r]], c * this.tileSize, r * this.tileSize);
		}
	}
	context.restore();
}