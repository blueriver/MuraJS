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
      res.send("<br/>rendered content:<pre>" + JSON.stringify(content.getAll()) + "</pre>")
    },
    function(error){
      console.log(error);
    }
  );
});

app.get('/content', function (req, res) {

  Mura.getRequestContext(req, res)
    .getFeed('content')
    .getQuery()
    .then(function(items){
        res.send("<br/>content feed:<pre>" + JSON.stringify(items.getAll()) + "</pre>");
  });
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
