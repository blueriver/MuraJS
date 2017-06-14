const express = require('express')
const app = express()
const Mura=require('../index');

Mura.init({
  siteid:'default',
  rootpath:'http://localhost:8080'
});

app.get('/', function (req, res) {

  Mura.getRequestContext(req, res).renderFilename('about').then(
    function(content){
      res.send("<br/>content:" + content.get('body'))
    },
    function(error){
      console.log(error);
    }
  );
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')


})
