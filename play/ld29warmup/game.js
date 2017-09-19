var gameState; // 0 - Main menu 1 - Password screen 2 - Load level 3 - Playing 4 - Death 5 - Credits 6 - Instructions 7 - Loading data 8 - Level screen 9 - Victory screen
var initGameState = false;

function InitGame()
{
	initGameState = true;
	gameState = 7;
}

function ChangeGameState(n)
{
	initGameState = true;
	gameState = n;
}

function UpdateGame()
{
	var oldGameState = gameState;
	switch(gameState)
	{
		case 0:
			if(initGameState) document.getElementById("startMenu").style.display = "block";
			break;
		case 1:
			if(initGameState) document.getElementById("passwordMenu").style.display = "block";
			break;
		case 2:
			if(level == numberOfLevels)
			{
				ChangeGameState(9);
				break;
			}
			freeze = true;
			ClearObjects();
			levels[level].Init();
			ChangeGameState(8);
			break;
		case 3:
			if(initGameState) freeze = false;
			if((!ExistentAndAlive(vikings[0])) && (!ExistentAndAlive(vikings[1])) && (!ExistentAndAlive(vikings[2]))) ChangeGameState(4);
			break;
		case 4:
			if(initGameState) document.getElementById("deathScreen").style.display = "block";
			break;
		case 5:
			if(initGameState) document.getElementById("creditsScreen").style.display = "block";
			break;
		case 6:
			if(initGameState) document.getElementById("instructions").style.display = "block";
			break;
		case 7:
			if(initGameState) StartLoadingData();
			document.getElementById("loadingBar").style.width = "" + ((data.length / dataSrcs.length) * 200) + "px";
			document.getElementById("loadingBar").innerHTML = "" + ((data.length / dataSrcs.length) * 100) + "% loaded";
			if(data.length == dataSrcs.length)
			{
				document.getElementById("loadingScreen").style.display = "none";
				ChangeGameState(0);
			}
			break;
		case 8:
			if(initGameState)
			{
				document.getElementById("levelStartScreen").innerHTML = "<center><h3>Level " + (level + 1) + "</h3><b>Password: " + levels[level].password + "</b><br>Press jump button to start</center>";
				document.getElementById("levelStartScreen").style.display = "block";
			}
			if(keys["keyJump"].state == 1)
			{
				document.getElementById("levelStartScreen").style.display = "none";
				ChangeGameState(3);
			}
			break;
		case 9:
			if(initGameState)
			{
				document.getElementById("victoryScreen").style.display = "block";
			}
			break;
	}
	if(gameState != oldGameState) initGameState = true;
	else initGameState = false;
	preventDefault = (gameState == 3);
	UpdateKeys();
}

function ClickNewGame()
{
	level = 0;
	document.getElementById("startMenu").style.display = "none";
	ChangeGameState(2);
}

function ClickPassword()
{
	document.getElementById("startMenu").style.display = "none";
	ChangeGameState(1);
}

function ClickCredits()
{
	document.getElementById("startMenu").style.display = "none";
	ChangeGameState(5);
}

function ClickReturnCredits()
{
	document.getElementById("creditsScreen").style.display = "none";
	ChangeGameState(0);
}

function ClickReturn()
{
	document.getElementById("passwordMenu").style.display = "none";
	ChangeGameState(0);
}

function TryPassword()
{
	var goodPassword = false;
	var password = document.getElementById("passwordBox").value;
	password = password.toUpperCase();
	for(var i = 0; i < numberOfLevels; i++)
	{
		if(password == levels[i].password)
		{
			level = i;
			goodPassword = true;
		}
	}
	if(!goodPassword)
	{
		alert("Invalid password!");
		document.getElementById("passwordBox").value = "";
	}
	else
	{
		document.getElementById("passwordMenu").style.display = "none";
		ChangeGameState(2);
	}
}

function ClickContinue()
{
	document.getElementById("deathScreen").style.display = "none";
	ChangeGameState(2);
}

function ClickInstructions()
{
	document.getElementById("startMenu").style.display = "none";
	ChangeGameState(6);
}

function ClickReturnInstructions()
{
	document.getElementById("instructions").style.display = "none";
	ChangeGameState(0);
}

function ClickReturnVictory()
{
	document.getElementById("victoryScreen").style.display = "none";
	ChangeGameState(0);
}