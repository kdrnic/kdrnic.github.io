var data = [];

function GetImage(src)
{
	if(!data[src])
	{
		data[src] = new Image();
		data[src].src = src;
	}
	return data[src];
}

function GetAudio(src)
{
	var audio = new Audio(src);
	return audio;
}

function DrawBox(obj)
{
	context.save();
	context.translate(-camera.x, -camera.y);
	context.strokeStyle = "#000000";
	context.strokeRect(obj.x - obj.width / 2, obj.y - obj.height / 2, obj.width, obj.height);
	context.restore();
}

function BoxDraw()
{
	DrawBox(this);
}

function DrawImage(obj)
{
	context.save();
	context.translate(obj.x - camera.x, obj.y - camera.y);
	if(obj.flipH) context.scale(-1, 1);
	if(obj.flipV) context.scale(1, -1);
	if(obj.offsetX) context.translate(-obj.offsetX, 0);
	if(obj.offsetY) context.translate(0, -obj.offsetY);
	context.drawImage(obj.image, 0 - obj.image.width / 2, 0 - obj.image.height / 2);
	context.restore();
}

function ImageDraw()
{
	DrawImage(this);
}

function DrawRotating(obj)
{
	context.save();
	context.translate(obj.x - camera.x, obj.y - camera.y);
	context.rotate(frame * obj.rotationSpeed);
	context.drawImage(obj.image, 0 - obj.image.width / 2, 0 - obj.image.height / 2);
	context.restore();
}

function RotatingDraw()
{
	DrawRotating(this);
}

function DrawSprite(obj)
{
	context.save();
	context.translate(obj.x - camera.x, obj.y - camera.y);
	if(obj.flipH) context.scale(-1, 1);
	if(obj.flipV) context.scale(1, -1);
	if(obj.offsetX) context.translate(-obj.offsetX, 0);
	if(obj.offsetY) context.translate(0, -obj.offsetY);
	context.drawImage(obj.image, obj.frame * obj.frameWidth, 0, obj.frameWidth, obj.image.height, 0 - (obj.frameWidth / 2), 0 - (obj.image.height / 2), obj.frameWidth, obj.image.height);
	context.restore();
}

function SpriteDraw()
{
	DrawSprite(this);
}

function DrawParallax(image, speed)
{
	if(!speed) speed = 1.0;
	var scrollX = camera.x;
	var scrollY = camera.y;
	scrollX += canvas.width * 0.5;
	scrollY += canvas.height * 0.5;
	scrollX *= speed;
	scrollY *= speed;
	context.save();
	context.translate(-scrollX, -scrollY);
	for(var x = Math.floor(scrollX / image.width) * image.width; x < Math.ceil((scrollX + canvas.width) / image.width) * image.width; x += image.width)
	{
		for(var y = Math.floor(scrollY / image.height) * image.height; y < Math.ceil((scrollY + canvas.height) / image.height) * image.height; y += image.height)
		{
			context.drawImage(image, x, y);
		}
	}
	context.restore();
}

function ParallaxDraw()
{
	DrawParallax(this.image, this.speed);
}

function DrawTiled(image, x0, y0, _width, _height)
{
	if(image.width == 0) return;
	if(image.height == 0) return;
	context.save();
	context.translate(-camera.x, -camera.y);
	var width = _width;
	for(var x = x0; x < x0 + _width; x += image.width)
	{
		var height = _height;
		for(var y = y0; y < y0 + _height; y += image.height)
		{
			context.drawImage(image, 0, 0, Math.min(image.width, width), Math.min(image.height, height), x, y, Math.min(image.width, width), Math.min(image.height, height));
			height -= Math.min(image.height, height);
		}
		width -= Math.min(image.width, width);
	}
	context.restore();
}

function TiledDraw()
{
	DrawTiled(this.image, this.x - this.width * 0.5, this.y - this.height * 0.5, this.width, this.height);
}

function DrawTiled2(image, x0, y0, width, height)
{
	if(image.width == 0) return;
	if(image.height == 0) return;
	context.save();
	context.translate(-camera.x, -camera.y);
	for(var x = Math.floor(x0 / image.width) * image.width; x < Math.ceil((x0 + width) / image.width) * image.width; x += image.width)
	{
		for(var y = Math.floor(y0 / image.height) * image.height; y < Math.ceil((y0 + height) / image.height) * image.height; y += image.height)
		{
			var _x = x;	// where to draw on screen
			var _y = y; // where to draw on screen
			var __x = 0; // x on image from where blitting starts
			var __y = 0; // y on image from where blitting starts
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
			var _width = image.width;
			var _height = image.height;
			if(x0 + width < _x + _width)
			{
				_width -= _x + _width - x0 - width;
			}
			if(x0 + width < _x + _width)
			{
				_width -= _x + _width - x0 - width;
			}
			if(__x < 0) __x = 0; // Added on 28/04 to correct Firefox bug
			if(__y < 0) __y = 0; // Added on 28/04 to correct Firefox bug
			if(_width < 0) _width = 0; // Added on 28/04 to correct Firefox bug
			if(_width > image.width) _width = image.width; // Added on 28/04 to correct Firefox bug
			if(_height < 0) _height = 0; // Added on 28/04 to correct Firefox bug
			if(_height > image.height) _height = image.height; // Added on 28/04 to correct Firefox bug
			if(_width == 0) continue; // Added on 28/04 to correct Firefox bug
			if(_height == 0) continue; // Added on 28/04 to correct Firefox bug
			context.drawImage(image, __x, __y, _width, _height, _x, _y, _width, _height);
		}
	}
	context.restore();
}

function TiledDraw2()
{
	DrawTiled2(this.image, this.x - this.width * 0.5, this.y - this.height * 0.5, this.width, this.height);
}