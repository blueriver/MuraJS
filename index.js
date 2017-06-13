module.exports = require('./src/index');

if(module.exports.isInNode()){
  module.exports._request=require('request');;
}
