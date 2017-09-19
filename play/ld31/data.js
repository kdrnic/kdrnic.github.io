// Array of strings containing the URLs for each data to be preloaded
var dataSrcs = [];
var data = {};

function StartLoadingData()
{
	data.length = 0;
	for(var i = 0; i < dataSrcs.length; i++)
	{
		var extension = dataSrcs[i].substr(dataSrcs[i].lastIndexOf(".") + 1);
		if((extension == "png") || (extension == "jpg") || (extension == "bmp") || (extension == "gif"))
		{
			var img = new Image();
			img.shortSrc = dataSrcs[i];
			data[this.shortSrc] = img;
			img.onload = function()
			{
				data[this.shortSrc] = this;
				data.length++;
				if(typeof OnMoreData != undefined) OnMoreData();
			}
			img.src = dataSrcs[i];
		}
		if((extension == "wav") || (extension == "ogg"))
		{
			var snd = new Audio();
			snd.shortSrc = dataSrcs[i];
			snd.preload = "auto";
			data[this.shortSrc] = snd;
			snd.addEventListener("canplaythrough", function()
			{
				data[this.shortSrc] = this;
				data.length++;
				if(typeof OnMoreData != undefined) OnMoreData();
			});
			snd.src = dataSrcs[i];
			snd.load();
		}
		if(extension == "json")
		{
			var request = new XMLHttpRequest();
			request.open('GET', dataSrcs[i], true);
			request.overrideMimeType('text/plain; charset=x-user-defined');
			request.shortSrc = dataSrcs[i];
			request.onreadystatechange = function()
			{
				if((this.readyState == 4) && (this.status == 200))
				{
					data[this.shortSrc] = this.responseText;
					data.length++;
					if(typeof OnMoreData != undefined) OnMoreData();
				}
				console.log("AJAX: " + this.shortSrc + " " + this.readyState + "," + this.status);
			}
			request.send(null);
		}
	}
}