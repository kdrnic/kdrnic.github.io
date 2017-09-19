Utils = {};

Utils.WriteText = function(context, text, x, y, width, height, font){
	var lineLength = width / font.charWidth;
	var row;
	for(row = 0; row < text.length / lineLength; row++){
		font.WriteLine(context, text.substr(row * lineLength, lineLength), x, y + row * font.charHeight);
		if(!((row * font.charHeight) <= height)) return false;
	}
	return true;
}