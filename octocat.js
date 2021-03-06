var config = {
	channels: ["#chezjj"],
	server: "irc.freenode.net",
	botName: "octocat"
};

var irc = require("irc");
var http = require("http");
var request = require("request");

var base_url = "https://api.github.com/search/repositories?q="

var bot = new irc.Client(config.server, config.botName, {
	channels: config.channels
});

bot.addListener("message", function(from, to, text, message) {
	console.log("Message was " + text);
	if (text.substring(0, 3) == ".gh") {
		var repo = text.substring(4);
		console.log(repo);
		var url = base_url; 
		url = url.concat(encodeURIComponent(repo));
		console.log(url);
		request({
			url: url,
			json: true,
			headers: {
				'User-Agent': 'Octocat-Bot by afuhrtrumpet'
			}
		}, function(error, response, body) {
			if (!error && response.statusCode == 200) {
				var json = body;
				if (json.items.length > 0) {
					var message = json.items[0].html_url;
					bot.say(to, message);
				} else {
					bot.say(to, "No repos found.");
				}
			}
			else if (error) {
				console.log(error);
			} else {
				console.log(response.statusCode);
			}
		});
	}
});
