dataSrcs.push("gfx/tileset.png");
dataSrcs.push("level.json");

function InitLevel()
{
	var e = new TiledMapEntity(data["level.json"]);
	AddEntity(e);
}