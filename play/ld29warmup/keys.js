var keys = {};
var keyConfig =
[
	"keyLeft", 37, "Move left",
	"keyRight", 39, "Move right",
	"keyJump", 65, "Jump",
	"keyChange", 68, "Change character",
	"keyAction", 83, "Attack with sword/Use shield/Shoot arrow",
	"keySuicide", 82, "Suicide and restart the level"
];

function UpdateKeys()
{
	for(var i = 0; i < keyConfig.length; i += 3)
	{
		var key = keys[keyConfig[i]];
		var _pressed = pressed[keyConfig[i + 1]];
		if(key)
		{
			if(_pressed)
			{
				if(key.state == 0) key.state = 1;
				else if(key.state == 1) key.state = 2;
			}
			else key.state = 0;
		}
		else
		{
			keys[keyConfig[i]] = {};
			key = keys[keyConfig[i]];
			key.state = 0;
		}
	}
}