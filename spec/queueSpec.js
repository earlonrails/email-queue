var specHelper = require('./specHelper.js'),
    Queue = specHelper.emailQueue.Queue;

describe("queue", function() {
  it('should queue up two emails.', function() {
    queue = new Queue();
    currentTimeStamp = new Date();
    emailOne = {
      "body" : "some text",
      "from" : "someGuy@someHost.com",
      "to" : "someGal@someHost.com",
      "subject" : "a subject",
      "delayTime" : "10000",
      "delayKey" : (Object.keys(queue) + currentTimeStamp.valueOf()),
      "createdAt" : currentTimeStamp.toLocaleString()
    };
    queue[emailOne.delayKey] = emailOne;
    currentTimeStampTwo = new Date();
    emailTwo = {
      "body" : "some text",
      "from" : "someGuy@someHost.com",
      "to" : "someGal@someHost.com",
      "subject" : "a subject",
      "delayTime" : "10000",
      "delayKey" : (Object.keys(queue) + currentTimeStampTwo.valueOf()),
      "createdAt" : currentTimeStampTwo.toLocaleString()
    };
    queue[emailTwo.delayKey] = emailTwo;
    expect(Object.keys(queue).length).toEqual(2);
  });

  it('should stop a few emails by their key.', function() {
    queue = new Queue();
    currentTimeStamp = new Date();
    emailOne = {
      "body" : "some text",
      "from" : "someGuy@someHost.com",
      "to" : "someGal@someHost.com",
      "subject" : "a subject",
      "delayTime" : "10000",
      "delayKey" : (Object.keys(queue) + currentTimeStamp.valueOf()),
      "createdAt" : currentTimeStamp.toLocaleString()
    };
    queue[emailOne.delayKey] = emailOne;
    queue.stopByKey(emailOne.delayKey);
    expect(Object.keys(queue).length).toEqual(0);
  });
});
