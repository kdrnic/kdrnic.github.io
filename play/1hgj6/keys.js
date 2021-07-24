// Key states: 0 - not pressed, 1 - just pressed, 2 - kept pressed
var keys = {};
var keyConfig =
[
	"keyLeft", 37, "Move left",
	"keyRight", 39, "Move right",
	"keyUp", 38, "Move up",
	"keyDown", 40, "Move down",
	"keyFocus", 67, "Toggle looking glass following the player",
	"keyUse", 90, "Punch",
	"keyDrop", 88, "Punch",
	"keyRestart", 82, "Punch"
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