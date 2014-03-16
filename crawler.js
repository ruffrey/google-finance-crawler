var colors = require('colors'),
	fs = require('fs'),

	Stock = require('./stockParser'),
	url = require('url'),
	URLS = [],
	StockData = [];

	hostOnly = "www.google.com",
	pathOnly = "/finance",
	initialPage = "https://www.google.com/finance",

	Crawler = require("crawler").Crawler,

	c = new Crawler({

		maxConnections: 2,

		userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.152 Safari/537.36",

		// This will be called for each crawled page
		callback: function(error, result, $) {
			if(error)
			{
				console.log('ERROR'.red, error);
				return;
			}


			if(result.body && $)
			{
				// the meat
				var stock = Stock($);
				StockData.push(stock);

				// Write the stock data to a file
				writeResults(StockData);

				console.log('\n', result.options.uri, JSON.stringify(stock, null, 2) );

				var $a = $("a");
				var validLinks = [];

				// crawl the links on this page
			    $a.each(function(index, a) {
			    	
			    	if(a.href.indexOf("javascript:") != -1)
			    	{
			    		// console.log('  js link'.yellow.bold, a.href.yellow);
			    		return;
			    	}

			    	var beenHereBefore = URLS.indexOf(a.href) != -1,
			    		reqUrl = url.parse(a.href),
			    		isRightDomain = reqUrl.hostname == hostOnly && reqUrl.pathname == pathOnly;

			    	if(beenHereBefore){
			    		//console.log('  ', a.href.grey);
			    		return;
			    	}

			    	if(isRightDomain) {
			    		//console.log('  ', a.href.green);
						URLS.push(a.href);
			    		validLinks.push(a.href);
			    	}
			    	
			    });
			    c.queue(validLinks);
				console.log('  ', validLinks.length, '/', $a.length, 'valid links on this page');
				console.log('  ', 'total queued or visited:', URLS.length);
				console.log('  ', 'captured stocks:', StockData.length);

			} 
		   	else{
		   		console.log('  response issue'.red);
		   	}
		},
		onDrain: function(){
			console.log('Queue drained'.green);
		}
	});

// Queue just one URL, with default callback
c.queue(initialPage);

function writeResults(obj){
	fs.writeFileSync(__dirname+'/output/stocks.json', JSON.stringify(obj, null, 2) );
}

// Queue a list of URLs
// c.queue(["http://jamendo.com/","http://tedxparis.com"]);


// Queue URLs with custom callbacks & parameters
// c.queue([{
// 	uri: "http://parishackers.org/",
// 	jQuery: false,


// 	// The global callback won't be called
// 	callback: function(error,result) {
// 	    console.log("Grabbed",result.body.length,"bytes");
// 	}
// }]);


// Queue some HTML code directly without grabbing (mostly for tests)
// c.queue([{
// 	"html":"<p>This is a <strong>test</strong></p>"
// }]);