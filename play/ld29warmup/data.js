var dataSrcs = 
[
	"volcano.png",
	"vikingSwordSprite.png",
	"vikingShieldSprite.png",
	"vikingBowSprite.png",
	"pterodactyl.png",
	"palmTree.png",
	"jungle.png",
	"grass.png",
	"flyingSaucer.png",
	"caveTexture.png",
	"cavemanSpearSprite.png",
	"cavemanBatSprite.png",
	"tombStone.png",
	"spear.png",
	"arrow.png",
	"spikes.png",
];
var data = {};

function StartLoadingData()
{
	data.length = 0;
	for(var i = 0; i < dataSrcs.length; i++)
	{
		var extension = dataSrcs[i].substr(dataSrcs[i].length - 4, 4);
		if(extension == ".png")
		{
			var img = new Image();
			img.shortSrc = dataSrcs[i];
			img.src = dataSrcs[i];
			img.onload = function()
			{
				data[this.shortSrc] = this;
				data.length++;
			}
		}
	}
}