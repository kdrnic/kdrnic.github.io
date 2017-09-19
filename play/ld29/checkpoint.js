var checkpoint = {exists: false};

function FunctionName(fun)
{
	var ret = fun.toString();
	ret = ret.substr('function '.length);
	ret = ret.substr(0, ret.indexOf('('));
	return ret;
}

function DataSave(key, value)
{
	for(var i = 0; i < dataSrcs.length; i++)
	{
		if(value == data[dataSrcs[i]])
		{
			return {_____src: dataSrcs[i]};
		}
	}
	if(typeof value == "function") return {_____functionName: FunctionName(value)};
	return value;
}

function DataLoad(key, value)
{
	if(typeof value._____src != "undefined") return data[value._____src];
	if(typeof value._____functionName != "undefined") return eval(value._____functionName);
	return value;
}

function SaveCheckpoint()
{
	checkpoint.objectsJSON = JSON.stringify(objects, DataSave);
	checkpoint.numberOfObjects = numberOfObjects;
	checkpoint.frame = frame;
	checkpoint.exists = true;
	checkpoint.level = level;
	CheckpointToCookies();
}

function ClearCheckpoint()
{
	checkpoint.objectsJSON = "";
	checkpoint.frame = 0;
	checkpoint.numberOfObjects = 0;
	checkpoint.level = 0;
	checkpoint.exists = false;
	SetCookie("checkpoint", "", -1);
}

function LoadCheckpoint()
{
	objects = JSON.parse(checkpoint.objectsJSON, DataLoad);
	frame = checkpoint.frame;
	level = checkpoint.level;
	numberOfObjects = checkpoint.numberOfObjects;
}

function CheckpointFromCookies()
{
	//var c = GetCookie("checkpoint");
	var c = "";
	if(c == "") checkpoint.exists = false;
	else
	{
		checkpoint = JSON.parse(c);
		checkpoint.exists = true;
	}
}

function CheckpointToCookies()
{
	var checkpointJSON = JSON.stringify(checkpoint); // Yo dawg! I herd u like JSON so we put a JSON in your JSON so u can parse while u parse
	console.log("checkpointJSON.length:" + checkpointJSON.length);
	//SetCookie("checkpoint", checkpointJSON, 30);
}

function SetCookie(name, value, exDays)
{
	var d = new Date();
	d.setTime(d.getTime() + (exDays * 24 * 60 * 60 * 1000));
	var expires = "expires=" + d.toGMTString();
	document.cookie = name + "=" + value + "; " + expires;
}

function GetCookie(_name)
{
	var name = _name + "=";
	var ca = document.cookie.split(';');
	for(var i = 0; i < ca.length; i++)
	{
		var c = ca[i].trim();
		if(c.indexOf(name) == 0) return c.substring(name.length, c.length);
	}
	return "";
}