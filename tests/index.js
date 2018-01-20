const express = require('express')
const app = express()
const env = {
    siteid:'default',
    rootpath:'http://localhost:8080'
  }

app.get('/', function (req, res) {
  let Mura=require('../index');

  Mura.init(Mura.extend(
    {
      request:req,
      response:res
    },
    env
    )
  );

  Mura.renderFilename('about').then(
    function(content){
      let str="<br/>rendered content:<pre>" + JSON.stringify(content.getAll()) + "</pre>";

      res.send(str);
    },
    function(error){
      console.log(error);
    }
  );
});

app.get('/content', function (req, res) {

  let Mura=require('../index');

  Mura.init(Mura.extend(
    {
      request:req,
      response:res
    },
    env
    )
  );

  Mura.getFeed('content')
    .getQuery()
    .then(function(items){
        res.send("<br/>content feed:<pre>" + JSON.stringify(items.getAll()) + "</pre>");
  });
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
