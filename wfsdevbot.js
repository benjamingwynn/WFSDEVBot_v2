var fs = require("fs");
var Util = require("util");
var url = require("url");
var util = require("util");
var http = require("http");
var https = require('https');
var path = require("path");
var querystring = require('querystring');

var Bot = require("./lib/irc");
var Client = require("./lib/irc/client");

var Sol = require("./lib/sol");
var Sandbox = require("./lib/sandbox");
var FactoidServer = require("./lib/factoidserv");
var FeelingLucky = require("./lib/feelinglucky");

var Shared = require("./shared");


var WFSDEVBot = function(profile) {
	Bot.call(this, profile);
	this.set_log_level(this.LOG_ALL);
	this.set_trigger("!"); // Exclamation
};

Util.inherits(WFSDEVBot, Bot);

WFSDEVBot.prototype.init = function() {
	Bot.prototype.init.call(this);
	
	this.register_command("powerdown", this.powerdown);
	this.register_command("cookie", this.cookie);
	this.register_command("stfu", this.stfu);
	this.register_command("logout", this.stfu);
	this.register_command("projects", this.projects);
	this.register_listener (/\bhi\b/i, this.greeting);
	this.register_listener (/\bhello\b/i, this.greeting);
	this.register_listener (/\bhey\b/i, this.greeting);
	this.register_listener (/\bhai\b/i, this.greeting);
	this.register_listener (/(sense 4|miui|robotomod)/i, this.eta);
	this.register_listener (/\bwhat is\b/i, Shared.google);
	this.register_listener (/\bwho is\b/i, Shared.google);
	this.register_command("topic", this.disabledcmd);
	this.register_command("github", this.github);
	this.register_command("pastebin", this.pastebin);
	this.register_command("about", this.about);
	this.register_command("didyouknow", this.didyouknow);
};

// # Pastebin

WFSDEVBot.prototype.pastebin = function(cx, text) {
	cx.channel.send_reply (cx.channel, "Please do not paste directly into the IRC - use pastebin.com instead.");
};

// # Did you know

WFSDEVBot.prototype.didyouknow = function(cx, text) {

//random text
var r_text = new Array ();
r_text[0] = "benjamingwynn plays minecraft";
r_text[1] = "dudeman1996 plays minecraft";
r_text[2] = "We have a website at wfsdev.net23.net";
r_text[3] = "You can email benjamingwynn on behalf of the team at benjamin@gwynn.tk";
r_text[4] = "Our old, disused IRC channel is #wfsdevteam";
r_text[5] = "Our current website was built using wordpress";
r_text[6] = "jill_has_a_hat is a sp@m bot";
r_text[7] = "There is a new ROM comming soon from WFSDEV that isn't sense 4.";
r_text[8] = "You can type !about for information about the bot";
r_text[9] = "There are 12 of these random things";
r_text[10] = "I doubt anybody uses these commands";
r_text[11] = "You can type !google to Google something";
r_text[12] = "You can type !github and then somebodys username to display information about them on GitHub";
//match random numbers
var i = Math.random();
//change it so its usable
i = 7 * i;
i = Math.floor(i);
//round the number to 0 decimal place
var i = Math.floor(7*Math.random())
//end of randomize - output is "(r_text[i])"
//
//output to channel
cx.channel.send (r_text[i]);
};

// # About

WFSDEVBot.prototype.about = function(cx, text) {
	cx.channel.send_reply (cx.sender, "WFSDEVBot v2 | Programmed by Benjamin Gwynn with help from eboy | All work is on github at http://kan.gd/1n0i");
};

// # Disabled command

WFSDEVBot.prototype.disabledcmd = function(cx, text) {
	cx.channel.send_reply (cx.sender, "This command was disabled, sorry :)");
};

// # Testing Cookie

WFSDEVBot.prototype.cookie = function(cx, text) {
	cx.channel.send_reply (cx.sender, "Your test worked. Have a cookie!");
};

// # Grettings

WFSDEVBot.prototype.greeting = function(cx, text) {
	cx.channel.send_reply (cx.sender, "Hi, welcome to #wfsdev - Please feel free to ask any questions?");
};

// # ETA

WFSDEVBot.prototype.eta = function(cx, text, projectname) {
// is eta in the text?
if (!text.match (/\beta\b/i)) return
// this normallizes it, so it is readable
projectname = projectname.toLowerCase();
// tells you how long it'll be
var etas = { "sense 4": "not avalible, the project has been suspended until we contact a developer who is a pro at porting ARMv7 to v6, or HTC randomally release their source code for Sense 4",  
"miui": "now! We have released MIUIv4 and it is able to download here: http://kan.gd/1n08",  
"robotomod": "<2 months" };
// send it :D
cx.channel.send ("The ETA for " + projectname + " is " + etas[projectname]);
};

// # Powerdown

WFSDEVBot.prototype.powerdown = function(cx, text) {
if (cx.sender.name === "benjamingwynn") {
        cx.client.disconnect("WFSDEVbot has been shut down");
	process.exit();
} else {
	cx.channel.send_reply (cx.sender, "Only benjamingwynn may do this command.");
};
};

// # STFU
WFSDEVBot.prototype.stfu = function(cx, text) {

if (cx.sender.name === "benjamingwynn") {
cx.channel.send_reply (cx.sender, "Will logout for aprox. 20 seconds.");
cx.client.disconnect ("Will logout for aprox. 20 seconds");

} else {

cx.channel.send_reply (cx.sender, "You are not permitted to do this command - only benjamingwynn or dudeman1996 may do this command.");
};};

// # Projects

WFSDEVBot.prototype.projects = function(cx, text) {
	cx.channel.send_reply (cx.sender, "Our current projects are as follows:");
	cx.channel.send_reply (cx.sender, "Robotomod, Sense 4 and MIUIv4.");
};

// # WIP GitHub

WFSDEVBot.prototype.github = function(cx, username) {

	var options = {
		host: "api.github.com",
		path: "/users/" + username
	};

	https.get (options, function(res) {
		var json = "";
		res.on ("data", function(data) { json += data; });
		res.on ("end", function() {
			var data = JSON.parse (json);
			var reply = [];

			if (data.name)  reply.push (data.name);
			if (data.email) reply.push ("<"+data.email+">");
			if (data.html_url) reply.push ("| "+data.html_url+" |");
			if (data.blog)  reply.push (data.blog);
			if (data.location) reply.push ("("+data.location+")");

			if (data.created_at) {
				var d = new Date(data.created_at);
				var str = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][d.getMonth()] + " " + (d.getDate()+1) + ", " + d.getFullYear();
				reply.push ("- Member since: "+str);
			}

			if (data.public_repos) reply.push ("- " + data.public_repos + " public repo" + (data.public_repos-1?"s":""));

			cx.channel.send_reply (cx.intent, reply.join(" "));
		});
	}); 

};

// # Information

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
