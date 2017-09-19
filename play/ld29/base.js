var pressed = [];
var objects = [];
var numberOfObjects;
var camera = {};
var canvas;
var context;
var frame;
var mouse = {};
var preventDefault = false;
var freeze;

function KeyDownEvent(event)
{
	pressed[event.keyCode] = true;
	if((!event.shiftKey) && (!event.ctrlKey) && (!event.altKey) && (!event.metaKey) && (preventDefault)) event.preventDefault();
}

function KeyUpEvent(event)
{
	pressed[event.keyCode] = false;
}

function MouseMoveEvent(event)
{
	mouse.x = event.x - canvas.offsetLeft;
	mouse.y = event.y - canvas.offsetTop;
}

function MouseUpEvent(event)
{
	mouse.pressed[event.button] = false;
}

function MouseDownEvent(event)
{
	mouse.pressed[event.button] = true;
}

function Start()
{
	window.addEventListener("keyup", KeyUpEvent);
	window.addEventListener("keydown", KeyDownEvent);
	canvas = document.getElementById("canvas");
	mouse.pressed = [];
	canvas.addEventListener("mousemove", MouseMoveEvent);
	canvas.addEventListener("mousedown", MouseDownEvent);
	canvas.addEventListener("mouseup", MouseUpEvent);
	context = canvas.getContext("2d");
	frame = 0;
	camera.x = 0;
	camera.y = 0;
	numberOfObjects = 0;
	setTimeout("DoFrame()", 1000.0 / 60.0);
	freeze = false;
}

function NewObject()
{
	for(var i = 0; i < numberOfObjects; i++)
	{
		if(!objects[i].alive)
		{
			objects[i] = {};
			objects[i].alive = true;
			return objects[i];
		}
	}
	var obj = {alive: true};
	objects.push(obj);
	numberOfObjects = objects.length;
	return obj;
}

function ClearObjects()
{
	for(var i = 0; i < numberOfObjects; i++)
	{
		objects[i] = {};
	}
	objects.length = 0;
	numberOfObjects = 0;
}

function DoFrame()
{
	Update();
	Draw();
	if(!freeze) frame++;
	setTimeout("DoFrame()", 1000.0 / 60.0);
}

function Update()
{
	if(!freeze) UpdateObjects();
	if(typeof UpdateGame != "undefined") UpdateGame();
}

function UpdateObjects()
{
	for(var i = 0; i < numberOfObjects; i++)
	{
		var object = objects[i];
		if(!object.alive) continue;
		if(object.Update) object.Update();
	}
}

function Draw()
{
	context.fillStyle = "#FFFFFF";
	context.fillRect(0, 0, canvas.width, canvas.height);
	DrawObjects();
}

function CompareLayers(a, b)
{
	var layerA = 0, layerB = 0;
	if(a.layer) layerA = a.layer;
	if(b.layer) layerB = b.layer;
	return layerA - layerB;
}

function DrawObjects()
{
	objects.sort(CompareLayers);
	for(var i = 0; i < numberOfObjects; i++)
	{
		var object = objects[i];
		if(!object.alive) continue;
		if(object.Draw) object.Draw();
	}
}