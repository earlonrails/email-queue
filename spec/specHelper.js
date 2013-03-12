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