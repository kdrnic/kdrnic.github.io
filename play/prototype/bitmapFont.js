function BitmapFont(img, charset, chw, chh, areaY, areaX, areaWidth){
	this.image = img;
	this.charset = charset ? charset : " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~";
	this.charWidth = chw ? chw : 8;
	this.charHeight = chh ? chh : 8;
	this.areaX = areaX ? areaX : 0;
	this.areaY = areaY ? areaY : 0;
	this.areaWidth = areaWidth ? areaWidth : (this.image ? this.image.width : 1);
}

BitmapFont.prototype.WriteLine = function(ctx, text, startX, startY){
	var x = startX;
	var y = startY;
	for(var i = 0; i < text.length; i++){
		if(text[i] == '\n'){
			y += this.charHeight;
			x = startX;
			continue;
		}
		var sourceX = (this.charset.indexOf(text[i]) * this.charWidth);
		var sourceY = Math.floor(sourceX / this.areaWidth) * this.charHeight;
		sourceX %= this.areaWidth;
		sourceX += this.areaX;
		sourceY += this.areaY;
		ctx.drawImage(this.image, sourceX, sourceY, this.charWidth, this.charHeight, x, y, this.charWidth, this.charHeight);
		x += this.charWidth;
	}
}