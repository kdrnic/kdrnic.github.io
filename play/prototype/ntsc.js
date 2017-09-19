function NTSC(res){
	res = res ? res : 640;
	this.red = document.createElement("canvas");
	this.red.width = res;
	this.red.height = (res / 4) * 3;
	this.temp = document.createElement("canvas");
	this.temp.width = res;
	this.temp.height = (res / 4) * 3;
	this.blue = document.createElement("canvas");
	this.blue.width = res;
	this.blue.height = (res / 4) * 3;
	this.result = document.createElement("canvas");
	this.result.width = res;
	this.result.height = (res / 4) * 3;
	this.blueC = this.blue.getContext("2d");
	this.redC = this.red.getContext("2d");
	this.resultC = this.result.getContext("2d");
	this.tempC = this.temp.getContext("2d");
}

NTSC.prototype.Render = function(src){
	var dest = this.result;
	var blue = this.blue;
	var red = this.red;
	var destC = this.resultC;
	var blueC = this.blueC;
	var redC = this.redC;
	var temp = this.temp;
	var tempC = this.tempC;
	tempC.globalCompositeOperation = "source-over";
	tempC.fillStyle = "#ff8000";
	tempC.fillRect(0, 0, dest.width, dest.height);
	tempC.globalCompositeOperation = "multiply";
	var pixelAspectRatio = 0.85;
	tempC.drawImage(src, 0, 0, src.width, src.height, 0, 0, dest.width, (dest.width / src.width) * src.height * pixelAspectRatio);
	var steps = 10;
	redC.globalAlpha = 1 / steps;
	for(var i = 0; i < dest.width / 40; i += (dest.width / 40) / steps){
		//redC.globalAlpha -= 1.0 / steps;
		redC.drawImage(temp, i - (dest.width / 40) * 0.5, 0);
	}
	
	tempC.globalCompositeOperation = "source-over";
	tempC.fillStyle = "#0080ff";
	tempC.fillRect(0, 0, dest.width, dest.height);
	tempC.globalCompositeOperation = "multiply";
	tempC.drawImage(src, 0, 0, src.width, src.height, 0, 0, dest.width, (dest.width / src.width) * src.height * pixelAspectRatio);
	blueC.globalAlpha = 1 / steps;
	for(var i = 0; i < dest.width / 40; i += (dest.width / 40) / steps){
		//blueC.globalAlpha -= 1.0 / steps;
		blueC.drawImage(temp, i - (dest.width / 40) * 0.5, 0);
	}
	destC.globalCompositeOperation = "source-over";
	destC.fillStyle = "#000000";
	destC.fillRect(0, 0, dest.width, dest.height);
	var noise = (2.9 / 320) * dest.width;
	var yStep = 2.0;
	for(var i = 0; i < dest.height; i += yStep){
		var r = Math.random();
		destC.drawImage(red, 0, i, dest.width, yStep, (r * r * noise) - noise * 0.5, i, dest.width, yStep);
	}
	destC.globalCompositeOperation = "lighter";
	var displace = (2.5 / 320) * dest.width;
	//var r = Math.random();
	//displace += (r * r * noise);
	for(var i = 0; i < dest.height; i += yStep){
		var r = Math.random();
		destC.drawImage(blue, 0, i, dest.width, yStep, displace + (r * r * noise) - noise * 0.5, i, dest.width, yStep);
	}
	destC.globalCompositeOperation = "luminosity";
	destC.drawImage(src, 0, 0, src.width, src.height, 0, 0, dest.width, (dest.width / src.width) * src.height * pixelAspectRatio);
}