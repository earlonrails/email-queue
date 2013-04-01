var fs             = require('fs'),
    path           = require('path'),
    express        = require('express'),
    emailQueue     = require('./lib/emailQueue'),
    db             = require("mongojs"),
    app            = express(),
    mailConfig = require('./lib/emailQueue/mailConfig.json'),
    mongoConnection;

if (mailConfig.mongo){
  mongoConnection = db.connect(mailConfig.mongo.databaseUrl, mailConfig.mongo.collections);
}

var PUBLIC_DIR = path.dirname(__filename) + '/public',
    SHARED_DIR = path.dirname(__filename) + '/shared';

var port      = process.argv[2] || '8000',
    secure    = process.argv[3] === 'ssl',
    sslOpts   = { key:  fs.readFileSync(SHARED_DIR + '/server.key'),
                cert: fs.readFileSync(SHARED_DIR + '/server.crt')
    },
    protocol  = secure ? 'https' : 'http',
    queue     = [];

var stopByKey = function(key){
  keyFound = false;
  for (var i = 0; i < queue.length; i++){
    var envelope = queue[i];
    if (keyFound) {
      envelope.queueIndex --;
    } else if (envelope.delayKey == key){
      keyFound = true;
      if (queue[envelope.queueIndex].delayObject){
        clearTimeout(queue[envelope.queueIndex].delayObject);
      }
      queue.splice(i, 1);
    }
  }
  return keyFound;
};

app.use(express.bodyParser());
app.set('view engine', 'ejs');

app.post('/email', function(req, res){
  var body        = req.param('body', null),
      from        = req.param('from', null),
      to          = req.param('to', null),
      subject     = req.param('subject', null),
      delayTime   = req.param('delayTime', null),
      currentTimeStamp = new Date(),
      envelope    = { "body" : body,
                      "from" : from,
                      "to" : to,
                      "subject" : subject,
                      "delayTime" : delayTime,
                      "queueIndex" :  queue.length,
                      "delayKey" : (queue.length + currentTimeStamp.valueOf()),
                      "createdAt" : currentTimeStamp.toLocaleString()
                    };

      envelope.delayObject = emailQueue.delay(delayTime, function(){
        if (mailConfig.mongo){
          mongoConnection.emails.save(envelope, function(err, saved) {
            if( err || !saved ) {
              console.log("email not saved");
            } else {
              console.log("email saved");
            }
          });
        }

        emailQueue.mail(envelope);
        stopByKey(envelope.delayKey);
      });
      queue.push(envelope);
  res.send(String(envelope.delayKey));
});

app.get('/stop_by_idx', function(req, res){
  var queueIndex = req.param('queueIndex', null);
  clearTimeout(queue[queueIndex].delayObject);
  queue.splice(queueIndex, 1);
  var updateArray = queue.slice(queueIndex, queue.length)
  for(idx in updateArray){
    var notRemovedElement = updateArray[idx];
    notRemovedElement.queueIndex --;
  }
  res.redirect('/email_list');
});

app.get('/stop', function(req, res){
  var delayKey = req.param('delayKey', null);
  var foundKey = stopByKey(delayKey);
  if (foundKey){
    res.render('success');
  } else {
    res.render('failure');
  }
});

app.get('/email_list', function(req, res){
  if (mailConfig.mongo){
    mongoConnection.emails.find(function(err, docs) {
      res.render('index', { emailList : queue, emailHistory: docs });
    });
  } else {
    res.render('index', { emailList : queue });
  }
});

if (__filename == process.argv[1]) {

  app.listen(Number(port));

  if (!port && !secure) {
    console.log('Usage: node emailQueue.js 8000 ssl # default port and optional security setting');
  }

  console.log('Listening on ' + port + " " + protocol);
} else {
  exports.app = app;
}
