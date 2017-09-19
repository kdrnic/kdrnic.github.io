function AddExpanders(){
	var heightTest = true;
	var listOfClasses = ["content-block"];
	
	for(var j = 0; j < listOfClasses.length; j++){
		var cs = document.getElementsByClassName(listOfClasses[j]);
		for(var i = 0; i < cs.length; i++){
			var c = cs[i];
			if(heightTest){
				if(c.clientHeight <= parseInt(getComputedStyle(c, null).minHeight.split("px")[0])) continue;
			}
			
			var d = document.createElement("div");
			d.className = "expander";
			var a = document.createElement("a");
			a.appendChild(document.createTextNode("\u25BC"));
			d.appendChild(a);
			c.appendChild(d);
			c.style.height = "0";
		}
	}
}

document.addEventListener('DOMContentLoaded', AddExpanders, false);