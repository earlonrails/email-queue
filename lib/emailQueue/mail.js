var util          = require('util'),
    child_process = require('child_process'),
    exec          = child_process.exec,
    mailConfig    = require('./mailConfig.json'),
    mailCommand   = require('./mailCommand');

var mail = function(message){
  var body      = message.body,
      from      = message.from,
      to        = message.to,
      subject   = message.subject,
      mailer    = mailCommand.mailCommand(mailConfig.mailFunction);

  exec(mailer(body, subject, from, to), function(error, stdout, stderr){
    util.print('stdout: ' + stdout);
    util.print('stderr: ' + stderr);
  });
};

exports.mail = mail;