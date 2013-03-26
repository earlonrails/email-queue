var specHelper = require('./specHelper.js'),
    emailQueue = specHelper.emailQueue;

describe("mailCommand", function() {

  it('should return a valid mutt command.', function() {
    var mutt = emailQueue.mailCommand("mutt")
    expect(mutt("someBody", "someSubject", "you@you.com", "me@me.com"))
      .toEqual("echo 'someBody' | EMAIL='you@you.com' mutt -s 'someSubject' -- 'me@me.com'")
  });

  it('should return a valid mail command.', function() {
    var mail = emailQueue.mailCommand("mail")
    expect(mail("someBody", "someSubject", "you@you.com", "me@me.com"))
      .toEqual("echo 'someBody' | mail -s 'someSubject' 'me@me.com' -f 'you@you.com'")
  });

  it('should return a valid gnu-mail command.', function() {
    var gnuMail = emailQueue.mailCommand("gnu-mail")
    expect(gnuMail("someBody", "someSubject", "you@you.com", "me@me.com"))
      .toEqual("echo 'someBody' | mail -s 'someSubject' -a 'From:you@you.com' 'me@me.com'")
  });

  it('should return an echo of the parameters and log the parameters if no mail client is chosen.', function() {
    var defaultMailClient = emailQueue.mailCommand()
    expect(defaultMailClient("someBody", "someSubject", "you@you.com", "me@me.com"))
      .toEqual("echo 'someBody subject someSubject from you@you.com to me@me.com'")
  });
});
