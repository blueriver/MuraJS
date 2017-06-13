module.exports = require('./src/index');

if(module.exports.isInNode()){
  module.exports.request=require('request');;
}
