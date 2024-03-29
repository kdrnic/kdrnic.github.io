//Code highlighting
hljs = require('highlight.js');
fs = require('fs');
//HTML processing
cheerio = require('cheerio');
//RSS feed
var RSS = require('rss');

//To call curl - used by Wayback Machine link archiver
const child_process = require('child_process');

var feed = new RSS({
	title: "kdrnic's page",
	description: "kdrnic's page",
	feed_url: 'https://kdrnic.github.io/rss.xml',
	site_url: 'https://kdrnic.github.io',
	image_url: 'https://kdrnic.github.io/images/kdrnic.png',
	managingEditor: 'kdrnic', webMaster: 'kdrnic', copyright: '2019 kdrnic',
	language: 'en',
});

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
	
	//Add title tag if not present
	if(!$('title')) $('head').prepend('title');
	$('title').text(filetitles[filename]);
	
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
	
	//Perform Wayback Machine archiving of links
	let numToArchive = 0, numArchived = 0;
	$("a").each(function(idx, el){
		let url = $(el).attr("href");
		let archive = $(el).attr('data-archive');
		
		//Only archive links which ask for it
		if(typeof archive === 'undefined') return;
		//Don't rearchive links
		if(archive == "true") return
		//Fail for links without HREF set
		if(!url){
			console.warn("Link without URL asked for Wayback Machine archiving, ignored");
			return;
		}
		
		//Helper to print error message
		let archivingError = function(msg){
			console.warn('Wayback Machine archiving failed: "'+url+'", '+msg.toString());
		}
		
		//Helper to push link to archive URL
		let pushArchiveLink = function(url){
			$(el).after($("<a href='"+url+"'><sup>[archive]</sup></a>"));
			$(el).attr('data-archive', 'true');
		}
		
		//Catch errors in curl-calling and JSON parsing
		try{
			//I use curl because it is easier than getting a synchronous HTTPS request
			//See https://archive.org/help/wayback_api.php
			let curlData = child_process.execSync('curl --silent "https://archive.org/wayback/available?url='+url+'"');
			
			//Parse JSON
			let json = JSON.parse(curlData);
			
			let snapshots = json.archived_snapshots;
			//Check if URL archive is available
			if((!snapshots.hasOwnProperty("closest")) || (!snapshots.closest.available)){
				archivingError("URL archive not available");
			}
			else{
				//Finally create the link to archived version
				pushArchiveLink(snapshots.closest.url);
			}
		}
		catch(err){
			archivingError(err);
		}
	});
	
	//Force target on all links
	$("a").each(function(idx, el){
		if($(el).attr('target')) return;
		$(el).attr('target', '_top');
	});
	
	//Checks for the article index, insert if not present
	if(!$("ul[data-type='pages_index']").length){
		$('body').prepend("<div class='article-index'><ul data-type='pages_index'></ul></div>");
	}
	
	//Text of body but without text of childrens, escaped
	//used by both Twitter cards and RSS feed
	var summary = ($('body').clone().children().remove().end().text().replace(/\n/g, "").substr(0, 140) + "...")
		.replace(/&/g, '&amp;')
		.replace(/>/g, '&gt;')
		.replace(/</g, '&lt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
	
	//src of first image, or just my avatar
	//used by both Twitter cards and RSS feed
	var image = "https://kdrnic.github.io/" + ($('img').length ? $('img').first().attr('src') : 'images/kdrnic.jpg');
	
	//Write index_ page with Twitter card
	WriteIndex_(filename, {
		summary: summary,
		img: image,
		//title of article
		title: filetitles[filename],
	});
	
	//prepare RSS feed
	feed.item({
		title:  filetitles[filename],
		description: summary,
		url: 'https://kdrnic.github.io/index_' + filename,
		author: 'kdrnic',
		date: filedates[filename],
		enclosure: {
			'url': image,
		}
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

//Write RSS XML
fs.writeFileSync("rss.xml", feed.xml({indent: true}));
