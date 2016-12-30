import { Meteor } from 'meteor/meteor';

if (Meteor.isServer) {
  import './server-methods.js';
  import './publish.js';
  import './elastic';
}

import './methods.js';
