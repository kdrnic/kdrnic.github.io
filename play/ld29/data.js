var dataSrcs = 
[
	"ammonia.png",
	"ammoniaTop.png",
	"cosmonautSprite.png",
	"flagpole.png",
	"module.png",
	"rock.png",
	"space.png",
	"fireSprite.png",
	"softRock1.png",
	"softRock2.png",
	"softRock3.png",
	"softRock4.png",
	"softRock5.png",
	"dialogBg.png",
	"cosmonautDead.png",
	"brokenModule.png",
	"light.png",
	"darkness.png",
	"darknessTop.png",
	"maggotSpriteGreen.png",
	"maggotSpritePurple.png",
	"cubeSprite.png",
	"cubeShine.png",
	"introBg.png",
	"neptune.png",
	"redAlpha.png",
	"greenAlpha.png",
	"blueAlpha.png",
	"groundControl.ogg",
	"explosion.wav",
	"thruster.ogg",
	"fall.wav",
	"ooh.ogg",
	"jackhammer.wav",
	"ground.wav",
	"jump.wav",
	"earth.png",
	"hammerAndSickle.png",
	"endingThune.ogg",
	"ammoniaBottom.png"
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
		if((extension == ".wav") || (extension == ".ogg"))
		{
			var snd = new Audio();
			snd.shortSrc = dataSrcs[i];
			snd.src = dataSrcs[i];
			snd.load();
			snd.oncanplaythrough = function()
			{
				data[this.shortSrc] = this;
				data.length++;
			}
			snd.addEventListener("ended", function()
			{
				if(this.loop)
				{
					this.currentTime = 0;
					this.play();
				}
			});
		}
	}
}