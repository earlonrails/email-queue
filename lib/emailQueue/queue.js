var Queue = function(){};
Object.defineProperty(Queue.prototype, "stopByKey", {
  value: function(key) {
    keyFound = false;
    var envelope = this[key];
    if (envelope){
      keyFound = true;
      clearTimeout(envelope.delayObject);
      delete this[key];
    }
    return keyFound;
  },
  enumerable: false
});
exports.Queue = Queue;