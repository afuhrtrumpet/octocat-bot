var config = {
	channels: ["#muhbottest"],
	server: "irc.freenode.net",
	botName: "octocat"
};

var irc = require("irc");
var http = require("http");

var base_url = "http://api.github.com/search/repositories?q=

var bot = new irc.Client(config.server, config.botName, {
	channels: config.channels
});

bot.addListener("message", function(from, to, text, message) {
	console.log("Message was " + text);
	if (text.substring(0, 3) == ".gh") {
		var repo = text.substring(4);
		var url = base_url + urlencode(repo);
		http.get(url, function(res) {
			var body = '';

			res.on('data', function(chunk) {
				body += chunk;
			}); 

			res.on('end', function() {
				var json = JSON.parse(body);
				var message = json.items[1].html_url;
				bot.say(config.channels[0], message);
			});
		}
	}
});
