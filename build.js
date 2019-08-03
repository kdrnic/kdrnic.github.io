//Code highlighting
hljs = require('highlight.js');
fs = require('fs');
//HTML processing
cheerio = require('cheerio');

//Name of code highlighter style sheet
var hlcss = "hlstyles/default.css";

var filenames = fs.readdirSync("./");

//Keep article titles
var filetitles = {};
//Keep article creation dates
var filedates = {};

//Skip processing those files

//Skips certain files
var skip_filenames = /^(index|latest|(index_.+))\.html/;

//When ordering filenames, those files are last (must include those which will have indices of articles)
var last_filenames = [];

//Sort files
filenames.sort(function(a, b){
	var priority_a = 0;
	var priority_b = 0;
	priority_a += last_filenames.includes(a);
	priority_b += last_filenames.includes(b);
	return priority_a - priority_b;
});

//Configure highlighter
hljs.configure({
	//4-width tab
	tabReplace: "    ",
	//Use <br> tag
	useBR: false,
	//List of possible autodetectable languages,
	//to lower false positives
	languages: [
		"c",
		"bash",
		"dos",
		"html",
		"javascript",
		"makefile",
	],
});

function DoPass(func){
	for(var fn of filenames){
		if(skip_filenames.test(fn)) continue;
		//Process only HTML files
		if(!/\.html$/.test(fn)) continue;
		try{
			var filetext = fs.readFileSync(fn);
			
			//JQuery like API
			var $ = cheerio.load(filetext);
			
			//Process file
			func(fn, $);
			
			//Overwrite file
			fs.writeFileSync(fn, $.html());
		}
		catch(e){
			console.log("Failed for file " + fn, e);
		}
	}
}

//Create index_.html based superframe page for this article
//card is twitter-card stuff https://developer.twitter.com/en/docs/tweets/optimize-with-cards/guides/getting-started.html
function WriteIndex_(filename, card){
	var filetext = fs.readFileSync("index.html");
	var $ = cheerio.load(filetext);
	
	//Replace 'latest.html' with the article name
	$('iframe').first().attr('src', filename);
	
	//Twitter metas
	$('head').append(`
<meta name="twitter:card" content="summary" />
<meta name="twitter:creator" content="@kdrnic" />
<meta property="og:title" content="${card.title}" />
<meta property="og:description" content="${card.summary}" />
<meta property="og:image" content="${card.img}" />
	`);
	
	//Write file
	fs.writeFileSync("index_" + filename, $.html());
}

//First pass - most processing
DoPass(function(filename, $){
	//Always have <head> tag
	if(!$('head')) $('html').prepend('head');
	//Creation/publishing date in YYYY MM DD format
	if(!$('head').attr('data-created')) $('head').attr('data-created', (new Date().toISOString()));
	filedates[filename] = $('head').attr('data-created');
	//Modification date
	if(!$('head').attr('data-modified')) $('head').attr('data-modified', (new Date(fs.statSync(filename).mtime).toISOString()));
	//Avoid stupid charset error message
	if(!$("meta[charset='UTF8']").length) $('head').append("<meta charset='UTF8'>");
	//If this is an article it must have a title
	if($('body').attr('data-title')) filetitles[filename] = $('body').attr('data-title');
	
	//Process code tags
	$("code").each(function(idx, el){
		var lang = $(el).attr('class');
		var code = $(el).text();
		var hled;
		
		//If attribute data-hled is set, it has been highlighted already
		if($(el).attr('data-hled')){
			return;
		}
		$(el).attr('data-hled', 'true');
		
		//Keep non-highlighted code in an invisible div for convenience of the writer
		$(el).after($("<div style='display: none;'></div>").text(code));
		
		//Autodetects lang if not specified (works poorly)
		if(lang){
			hled = hljs.highlight(lang, code, true);
		}
		else{
			hled = hljs.highlightAuto(code, true);
			$(el).attr('class', hled.language);
		}
		//Clears the content...
		$(el).text("");
		//...then writes back the highlighted code
		$(el).append(hljs.fixMarkup(hled.value));
	});
	
	//Check for the code highlighter style sheet
	if(!$("link[href='" + hlcss + "']").length){
		var found = false;
		$("link").each(function(idx, el){
			if(/^hlstyles\//.test($(el).attr('href'))){
				found = el;
			}
		});
		//If not found, insert
		if(!found){
			$('head').append("<link rel='stylesheet' href='" + hlcss + "'>");
		}
		//If found, makes sure it is the currently used
		else{
			$(found).attr('href', hlcss);
		}
	}
	
	//Checks for the main styling sheet
	if(!$("link[href='motherfucker.css']").length){
		$('head').append("<link rel='stylesheet' href='motherfucker.css'>");
	}
	
	//Force target on all links
	$("a").each(function(idx, el){
		if($(el).attr('target')) return;
		$(el).attr('target', '_top');
	});
	
	//Checks for the article index, insert if not present
	if(!$("ul[data-type='pages_index']").length){
		$('body').prepend("<div class='article-index'><ul data-type='pages_index'></ul></div>");
	}
	
	WriteIndex_(filename, {
		//Text of body but without text of childrens, escaped
		summary: ($('body').clone().children().remove().end().text().replace(/\n/g, "").substr(0, 140) + "...")
			.replace(/&/g, '&amp;')
			.replace(/>/g, '&gt;')
			.replace(/</g, '&lt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&apos;'),
		//src of first image, or just my avatar
		img: "https://kdrnic.github.io/" + ($('img').length ? $('img').first().attr('src') : 'images/kdrnic.jpg'),
		//title of article
		title: filetitles[filename],
	});
});

//Second pass - add articles' index
DoPass(function(filename, $){
	//Creates indices of articles
	$("ul[data-type='pages_index']").each(function(idx, el){
		var codes = [];
		$(el).text("");
		
		for(var page in filetitles){
			var title = filetitles[page];
			//This regex turns "Game:" into the videogame emoji
			title = title.replace(/^Game:/, "&#x1F3AE;");
			//This regex turns into a more clearer YYYY MM DD HH mm SS format
			var date = filedates[page].replace(/T/, ' ').replace(/\..+/, '');
			//This regex removes the seconds
			date = date.replace(/:\d\d$/, '');
			//This regex removes the beginning of the year
			date = date.replace(/^20/, "'");
			//This regex changes - to /
			date = date.replace(/-/g, "/");
			
			codes.push("<li><span>"+date+"   </span><a target='_top' href='index_"+page+"'>"+title+"</a></li>");
		}
		
		//This will sort by date first, title second
		//We want descending order
		codes.sort(function(b, a){
			return ('' + a).localeCompare(b);
		});
		
		$(el).append(codes.join(""));
	});
});

//Copy newest page to latest.html
var filedates_arr = [];
for(var page in filedates){
	filedates_arr.push(filedates[page] + " " + page);
}
filedates_arr.sort(function(b, a){
	return ('' + a).localeCompare(b);
});
var latest = filedates_arr[0];
latest = latest.substr(latest.indexOf(' ')+1);
fs.writeFileSync("latest.html", fs.readFileSync(latest));
