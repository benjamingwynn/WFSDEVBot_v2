var Util = require("util");
var Bot = require("./lib/irc");

var WFSDEVBot = function(profile) {
	Bot.call(this, profile);
	this.set_log_level(this.LOG_ALL);
	this.set_trigger("!"); // Exclamation
};

Util.inherits(WFSDEVBot, Bot);

WFSDEVBot.prototype.init = function() {
	Bot.prototype.init.call(this);
	
	this.register_command("ping", this.ping);
	this.register_command("powerdown", this.powerdown);
	this.register_command("cookie", this.cookie);
	this.register_command("stfu", this.stfu);
	this.register_command("logout", this.stfu);
	this.register_listener (/\bhi\b/i, this.greeting);
	this.register_listener (/\bhello\b/i, this.greeting);
	this.register_listener (/\bhey\b/i, this.greeting);
	this.register_listener (/\bhai\b/i, this.greeting);
	this.register_listener ( /\b(sense 4|miui|robotomod)\b/i, this.eta);
};

// # Ping-Pong :D

WFSDEVBot.prototype.ping = function(cx, text) {
	cx.channel.send_reply (cx.sender, "Pong!");
};

// # Testing Cookie

WFSDEVBot.prototype.cookie = function(cx, text) {
	cx.channel.send_reply (cx.sender, "Your test worked. Have a cookie!");
};

// # Grettings

WFSDEVBot.prototype.greeting = function(cx, text) {
	cx.channel.send_reply (cx.sender, "Hi, welcome to #wfsdev! How can we help ya?");
        if (cx.sender.name === "benjamingwynn") { cx.channel.send_reply (cx.sender, "Hi, master."); }
};

// # ETA

WFSDEVBot.prototype.eta = function(cx, text, projectname) {
// is eta in the text?
if (!text.match (/\beta\b/i)) return;
// this normallizes it, so it is readable
projectname = projectname.toLowerCase();
// tells you how long it'll be
var etas = { "sense 4": "not avalible, the project has been suspended until we contact a developer who is a pro at porting ARMv7 to v6, or HTC randomally release their source code for Sense 4",  "miui": "soon. We are just squashing the final bugs.",  "robotomod": "<2 months" };
// send it :D
cx.channel.send ("The ETA for " + projectname + " is " + etas[projectname]);
};

// # Powerdown

WFSDEVBot.prototype.powerdown = function(cx, text) {
if (cx.sender.name === "benjamingwynn") {
        cx.client.disconnect();
	process.exit();
} else {
	cx.channel.send_reply (cx.sender, "Only benjamingwynn may do this command.");
};
};

// # STFU

WFSDEVBot.prototype.stfu = function(cx, text) {
if (cx.sender.name === "benjamingwynn") {
	cx.channel.send_reply (cx.sender, "Will logout for aprox. 20 seconds.");
        cx.client.disconnect();
} else {
	cx.channel.send_reply (cx.sender, "Only benjamingwynn may do this command.");
};
};

var profile = [{
	host: "irc.freenode.net",
	port: 6667,
	nick: "WFSDEVBot_v2",
	password: "",
	user: "WFSDEVBot_v2",
	real: "WFSDEV Teams IRC bot (version 2.0)",
	channels: ["#wfsdev"]
}];

(new WFSDEVBot(profile)).init();
