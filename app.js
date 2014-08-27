var config  = require("./config");
var package = require("./package");

var log     = require("custom-logger").config({ format: "%timestamp% %padding%[%event%]%message%" });
var request = require("request");
var express = require("express");
var app     = express();

log.debug().config({ 'color': 'blue' });

var makeUrl = function(req) {
	return "http://" + req.header.host + req.url;
};

// preprocessing
app.use(function(req, res, next) {

	if (req.method == "POST") {
		log.debug("request to " + req.path);
		log.info("query: " + req.query);
	}
	
	next();
});

// default/fallback behavior
app.use(function(req, res) {
	var method = req.method.toLowerCase();
	var url = req.url;//makeUrl(req);
	log.info(url);
	var siteReq = request[method](url);
	var pipe = req.pipe(siteReq);
	pipe.pipe(res);	
});

app.listen(config.server.port);
log.info(package.name + " v" + package.version + " running on port " + config.server.port);
