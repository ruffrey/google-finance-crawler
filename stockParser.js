/**
 *
 * @returns {Object} stock
 */
function stockParser($) {
	var stock = {
		title: "",
		name: "",
		market: "",
		symbol: "",
		quote: "",
		change: {
			amount: "",
			percent: ""
		}
	};

	stock.title = $('title').text().split(' - ')[0];
	stock.name = $('div.appbar-snippet-primary span').text();

	var marketAndNameText = $('div.appbar-snippet-secondary').text();
	if(marketAndNameText.indexOf(')') != -1)
	{
		var marketAndName = marketAndNameText
				.split('(')[1]
				.split(')')[0]
				.split(':');

		stock.market = marketAndName[0];
		stock.symbol = marketAndName[1];
	}
	var $changeElements = $('#price-panel .id-price-change span span');
	if($changeElements.length)
	{
		stock.change.amount = $($changeElements[0]).text();
		stock.change.percent = $($changeElements[1]).text().split('(')[1].split(')')[0].split('%')[0];
	}

	stock.quote = $('#price-panel span.pr span').text();
	return stock;
}

exports = module.exports = stockParser;