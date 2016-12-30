import MongoDriver from 'mongodb';
import { client, MONGO_URL } from './eventbus';
import { queue } from './eventbus';

const enqueueTask = function (id, type, collection, index) {
  const task = {
    id,
    type,
    collection,
    index,
  };
  queue.enqueue('rules', task, (err, job) => {});
};

export const applyRules = (collection, index) => {
  const cursor = collection.find({});
  cursor.observeChanges({
    added: function (id) {
      enqueueTask(id, 'added', collection._name, index);
    },
    changed: function (id) {
      enqueueTask(id, 'changed', collection._name, index);
    },
    removed: function (id) {
      enqueueTask(id, 'removed', collection._name, index);
    },
  });
};

applyRules(Events, 'event');

const worker = client.worker(['eventsqueue']);

worker.register({
  rules: function (params, callback) {
    try {
      processParams(params);
      callback(null, params);
    } catch (err) {
      callback(err);
    }
  }
});

worker.start();

function processParams(params) {
  switch(params.type) {
    case 'added':
      added(params.id, params.collection, params.index);
      break;
    case 'removed': 
      removed(params.id, params.collection, params.index);
      break;
    default:
      break;
  }

}

// Worker APP
function added(id, collection, index) {}

function removed(id, collection, index) {}
