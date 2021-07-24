var numberOfLevels = 2;
var levels = [];

levels[0] = {};
levels[0].Init = function()
{
	vikings = [];
	levelVikings = 3;
	InitParallax(data["volcano.png"], 0.15);
	InitParallax(data["jungle.png"], 0.1798);
	InitDirt(12, 321, 321, 123);
	InitPterodactyl(12 + 321 * 0.5 + 90, 321, 12 + 321 * 0.5 + 90 + 500, 321);
	InitDirt(12 + 321 * 0.5 + 90 + 500 + 500, 321, 1000, 200);
	InitPterodactyl(12 + 321 * 0.5 + 90 + 500 + 500 + 500 + 90, 321, 2410, 321 + 480);
	InitDirt(3000, 800, 1000, 200);
	InitDirt(3500, 840, 500, 160);
	InitShield(50, 0);
	InitViking(50, 0, 1); // Shield viking must be the first added so the shield is drawn behind the other vikings
	InitViking(0, 0, 0);
	InitViking(100, 0, 2);
	InitBatCaveman(12 + 321 * 0.5 + 90 + 500 + 500, 0);
	InitSpearCaveman(2600, 600, 3400);
	InitFlyingSaucer(3500, 800 - 300);
	InitSpikes(3000, 1000, 7000);
	InitNuker();
}
levels[0].password = "UANAQNND";

levels[1] = {};
levels[1].Init = function()
{
	vikings = [];
	levelVikings = 1;
	InitParallax(data["volcano.png"], 0.05);
	InitParallax(data["jungle.png"], 0.1);
	InitDirt(50, 300, 300, 100);
	InitPterodactyl(300, 300, 600, 600);
	InitDirt(800, 600, 200, 100);
	InitViking(0, 0, 0);
	InitFlyingSaucer(800, 300);
	InitSpikes(800, 1500, 32000);
	InitNuker();
}
levels[1].password = "YNEWQEJT";