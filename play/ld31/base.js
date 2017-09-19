var pressed = [];
var entities = [];
var camera = {};
var canvas;
var context;
var mouse = {};
var preventDefault = true;
var freeze;
var TimeObject;
var frameTime;
var gameTime;
var smallCanvas;
var canvasScale;
var glass = {};
var hasWon = false;

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

function InitGame()
{
	/* Add first entities here */
	glass.image = data["gfx/lookingGlass.png"];
	glass.canvas = document.createElement("canvas");
	glass.canvas.width = glass.image.width;
	glass.canvas.height = glass.image.height;
	glass.context = glass.canvas.getContext("2d");
	glass.radius = 125;
	
	InitLevel();
	
	/* Entity positions
	539 395 W !
	599 408 H !
	1133 1296 R !
	623 1698 R !
	606 1825 P !
	2419 2067 P !
	1958 1621 R !
	 1959 1900 R !
	 1968 2122 P !
	  1868 514 R !
	   2012 330 P
	*/
	
	var h = new Hero();
	h.x = 599;
	h.y = 408;
	h.canMove = false;
	h.autoFocus = false;
	AddEntity(h);
	
	var w = new Wizard();
	w.x = 539;
	w.y = 395;
	AddEntity(w);
	
	var r = new Roman();
	r.x = 1133;
	r.y = 1296;
	AddEntity(r);
	
	r = new Roman();
	r.x = 623;
	r.y = 1698;
	AddEntity(r);
	
	var p = new Pickup(0);
	p.x = 606;
	p.y = 1825;
	AddEntity(p);
	
	p = new Pickup(1);
	p.x = 2419;
	p.y = 2067;
	AddEntity(p);
	
	r = new Roman();
	r.x = 1958;
	r.y = 1621;
	AddEntity(r);
	
	r = new Roman();
	r.x = 1959;
	r.y = 1900;
	AddEntity(r);
	
	p = new Pickup(1);
	p.x = 1968;
	p.y = 2122;
	AddEntity(p);
	
	r = new Roman();
	r.x = 1868;
	r.y = 514;
	AddEntity(r);
	
	p = new Pickup(2);
	p.x = 2012;
	p.y = 330;
	AddEntity(p);
	
	var o = new Opening(h);
	AddEntity(o);
	
	/* Do not remove */
	freeze = false;
}

OnMoreData = function()
{
	var ratio = 1;
	if(dataSrcs.length > 0) ratio = (data.length / dataSrcs.length);
	smallContext.fillStyle = "#000000";
	smallContext.fillRect(0, 0, 800, 600);
	smallContext.fillStyle = "#0000FF";
	smallContext.fillRect(100, 275, 600, 25);
	smallContext.fillStyle = "#FF0000";
	smallContext.fillRect(100, 275, 600 * ratio, 25);
	smallContext.fillText(Math.floor(ratio * 100) + "% loaded", 350, 260);
	if(data.length == dataSrcs.length) // Loading finished!
	{
		InitGame();
	}
}

function Start()
{
	canvasScale = 4;
	
	window.addEventListener("keyup", KeyUpEvent);
	window.addEventListener("keydown", KeyDownEvent);
	smallCanvas = document.getElementById("canvas");
	mouse.pressed = [];
	smallCanvas.addEventListener("mousemove", MouseMoveEvent);
	smallCanvas.addEventListener("mousedown", MouseDownEvent);
	smallCanvas.addEventListener("mouseup", MouseUpEvent);
	smallContext = smallCanvas.getContext("2d");
	
	canvas = document.createElement("canvas");
	canvas.width = smallCanvas.width * canvasScale;
	canvas.height = smallCanvas.height * canvasScale;	
	context = canvas.getContext("2d");
	
	camera.x = 0;
	camera.y = 0;
	
	dataSrcs.push("gfx/lookingGlass.png");
	glass.x = 130 * canvasScale;
	glass.y = 130 * canvasScale;
	glass.radius = 125;
	glass.offsetX = 130;
	glass.offsetY = 130;
	glass.FocusOn = function(obj)
	{
		this.x = obj.x;
		this.y = obj.y;
	}
	
	StartLoadingData();
	freeze = true;
	gameTime = 0;
	if(performance) TimeObject = performance;
	else TimeObject = Date;
	frameTime = TimeObject.now();
	window.requestAnimationFrame(DoFrame);
}

function NewEntity()
{
	for(var i = 0; i < entities.length; i++)
	{
		if(!entities[i].alive)
		{
			entities[i] = {};
			entities[i].alive = true;
			return entities[i];
		}
	}
	entities[entities.length] = {};
	entities[entities.length - 1].alive = true;
	return entities[entities.length - 1];
}

function AddEntity(e)
{
	e.alive = true;
	for(var i = 0; i < entities.length; i++)
	{
		if(!entities[i].alive)
		{
			entities[i] = e;
			return;
		}
	}
	entities[entities.length] = e;
}

function RemoveDeadEntities()
{
	entities = entities.filter(function(e){return e.alive});
}

function ClearEntities()
{
	entities = [];
}

function DoFrame()
{
	var newFrameTime = TimeObject.now();
	var dt = newFrameTime - frameTime;
	frameTime = newFrameTime;
	dt /= 1000;
	if(!freeze) gameTime += dt;
	Update(dt);
	Draw();
	window.requestAnimationFrame(DoFrame);
}

function Update(dt)
{
	UpdateKeys();
	if(!freeze) UpdateEntities(dt);
}

function UpdateEntities(dt)
{
	for(var i = 0; i < entities.length; i++)
	{
		var entity = entities[i];
		if(!entity.alive) continue;
		if(entity.Update) entity.Update(dt);
	}
	RemoveDeadEntities()
}

function Draw()
{
	DrawEntities();
	DrawBigCanvas();
	DrawLookingGlass();
	if(hasWon)
	{
		smallContext.fillStyle = "#FFFFFF";
		smallContext.font = "18px arial";
		smallContext.fillText("Congratulations! You have helped the druid to make his useful potion!", 44, 240);
	}
}

function DrawBigCanvas()
{
	smallContext.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, smallCanvas.width, smallCanvas.height);
}

function DrawLookingGlass()
{
	glass.x = Math.floor(glass.x);
	glass.y = Math.floor(glass.y);
	if(!("context" in glass)) return;
	var ctx = glass.context;
	ctx.clearRect(0, 0, glass.canvas.width, glass.canvas.height);
	ctx.fillStyle = "#FFFFFF";
	ctx.beginPath();
	ctx.arc(glass.offsetX, glass.offsetY, glass.radius, 0, 2 * Math.PI);
	ctx.closePath();
	ctx.fill();
	ctx.globalCompositeOperation = "source-in";
	
	var rx = glass.x - glass.offsetX;
	var ry = glass.y - glass.offsetY;
	var rw = glass.canvas.width;
	var rh = glass.canvas.height;
	var rdx = 0;
	var rdy = 0;
	if(rx < 0)
	{
		rw -= rx;
		rdx -= rx;
		rx = 0;
	}
	if(ry < 0)
	{
		rh -= ry;
		rdy -= ry;
		ry = 0;
	}
	
	ctx.drawImage
	(
		canvas,
		rx,
		ry,
		rw,
		rh,
		rdx,
		rdy,
		rw,
		rh
	);
	ctx.globalCompositeOperation = "source-over";
	ctx.drawImage(glass.image, 0, 0);
	smallContext.drawImage(glass.canvas, (glass.x / canvasScale) - glass.offsetX, (glass.y / canvasScale) - glass.offsetY);
}

function CompareLayers(a, b)
{
	var layerA = 0, layerB = 0;
	if(a.layer) layerA = a.layer;
	if(b.layer) layerB = b.layer;
	if(b.zSorting)
	{
		if((a.y) && (a.height))
		{
			var aY = a.y + a.height * 0.5;
			if(a.offsetY) aY += a.offsetY;
			if(aY < b.y + b.zHeight * 0.5) layerB = b.zBottomLayer;
			else layerB = b.zTopLayer;
		}
	}
	if(a.zSorting)
	{
		if((b.y) && (b.height))
		{
			var bY = b.y + b.height * 0.5;
			if(b.offsetY) bY += b.offsetY;
			if(bY < a.y + a.zHeight * 0.5) layerA = A.zBottomLayer;
			else layerA = a.zTopLayer;
		}
	}
	return layerA - layerB;
}

function DrawEntities()
{
	for(var i = 0; i < entities.length; i++)
	{
		var object = entities[i];
		if(!object.alive) continue;
		if(object.Draw) object.Draw();
	}
}