// using mongojs in your config will write to your database during testing
// checking for a file, if none then put a fixture type file in place.
var fs         = require('fs'),
    configFile = fs.existsSync("./lib/emailQueue/mailConfig.json");
if (!configFile){
  fs.writeFileSync("./lib/emailQueue/mailConfig.json", '{ "mailFunction" : "mail" }');
}

var emailQueue = require('../lib/emailQueue'),
    request = require('request');

function Requester(){}

Requester.prototype.get = function(path, callback){
  request("http://localhost:5500" + path, callback);
};

Requester.prototype.post = function(path, body, callback){
  request.post({url: "http://localhost:5500" + path, body: body}, callback);
};

exports.withServer = function(callback){
  asyncSpecWait();
  var app = require("../app.js").app,
  server;
  var stopServer = function(){
    server.close();
    asyncSpecDone();
  }

  server = app.listen(5500);
  callback(new Requester, stopServer);
}

exports.emailQueue = emailQueue