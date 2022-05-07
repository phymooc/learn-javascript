let pubsub = {};

(function(myObject) {
  // Storage for topics that can be broadcasted or listened to
  // topics is a list of topic
  // each topic is a list of subscribers { token, callback }
  // data structure: { topic1: [{ token, callback }, ...], topic2: [...], ... }
  let topics = {};

  // a topic identifier
  let subUid = -1;

  // Publish or broadcast events of interest
  // with a specific topic name and arguments
  // such as the data to pass along
  myObject.publish = function(topic, args) {
    if (!topics[topic]) {
      return false;
    }

    let subscribers = topics[topic];
    let len = subscribers ? subscribers.length : 0;

    while (len--) {
      subscribers[len].func(topic, args);
    }

    return this;
  }

  myObject.subscribe = function(topic, func) {
    if (!topics[topic]) {
      topics[topic] = [];
    }

    let token = (++subUid).toString();
    topics[topic].push({
      token: token,
      func: func
    });

    return token;
  }

  myObject.unsubscribe = function(token) {
    for (let m in topics) {
      if (topics[m]) {
        for (let i = 0, j = topics[m].length; i < j; i++) {
          if (topics[m][i].token === token) {
            topics[m].splice(i, 1);
            return token;
          }
        }
      }
    }

    return this;
  }
})(pubsub);


// message handler, used as callback
let messageLogger = function(topic, data) {
  console.log('Logging: ' + topic + ': ' + data);
}

let subscription1 = pubsub.subscribe('topic1', messageLogger);
let subscription2 = pubsub.subscribe('topic2', messageLogger);
let subscription3 = pubsub.subscribe('topic1', messageLogger);
pubsub.publish('topic1', 'hello world1');
pubsub.publish('topic2', 'hello world2');

pubsub.publish('topic2', ['test', 'a', 'b']);
pubsub.publish('topic2', {test: 'test', a: 'a', b: 'b'});

pubsub.unsubscribe(subscription2);
pubsub.publish('topic2', ['test', 'a', 'b']);
