var specHelper = require('./specHelper.js'),
    emailQueue = specHelper.emailQueue;

describe("emailQueue Server", function() {
  it('should queue an email to be sent in one hour.', function() {
    specHelper.withServer(function(r, closeServer){
      r.post("/email", "body=foo&from=bar&to=foo&subject=bar&delayTime=10000", function(err, res, body){
        expect(Number(body)).toEqual(jasmine.any(Number));
        closeServer();
      });
    });
  });

  it('should remove an email from the queue.', function() {
    var delayKey;
    runs(function(){
      specHelper.withServer(function(r, closeServer){
        r.post("/email", "body=foo&from=bar&to=foo&subject=bar&delayTime=10000", function(err, res, body){
          delayKey = body;
          expect(Number(body)).toEqual(jasmine.any(Number));
          closeServer();
        });
      });
    });

    // wait for the server to stop so we can start it again.
    waitsFor(function(){
      return delayKey;
    }, "The delayKey should be set.", 750);

    runs(function(){
      specHelper.withServer(function(r, closeServer){
        r.get("/stop?delayKey=" + delayKey, function(err, res, body){
          expect(res.statusCode).toEqual(200);
          closeServer();
        });
      });
    });
  });
});
