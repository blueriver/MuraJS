# Mura.js

Mura.js is javscript utility to interact with the Mura CMS JSON/REST API

Mura CMS is an open source content management system for CFML, created by [Blue River Interactive Group](http://www.getmura.com). Mura has been designed to be used by marketing departments, web designers and developers.

## Installation

### Browser

```
<script src="https://domain.com/core/vendor/mura.js/dist/mura.min.js"></script>
```

### Babel
Babel is a next generation JavaScript compiler. One of the features is the ability to use ES6/ES2015 modules now, even though browsers do not yet support this feature natively.
```
import Mura from "mura.js";
```

### Browserify/Webpack

There are several ways to use Browserify and Webpack. For more information on using these tools, please refer to the corresponding project's documention. In the script, including jQuery will usually look like this...

```
var Mura = require("mura.js");
```

### AMD (Asynchronous Module Definition)

AMD is a module format built for the browser. For more information, we recommend require.js' documentation.

```
define(["mura.js"], function(Mura) {

});
```


## Example usage:

## In Browser

```
Mura.init(
  {
    siteid:'YOUR_SITEID',
    rootpath:'https://domain.com'
  }
);

Mura(function(Mura){
  Mura.addEventHandler(
    {
      asyncObjectRendered:function(event){
        alert(this.innerHTML);
      }
    }
  );

  Mura('#my-id').addDisplayObject('objectname',{..});

  Mura.login('userame','password')
    .then(function(data){
      alert(data.success);
    });

  Mura.logout())
    .then(function(data){
      alert('you have logged out!');
    });

  Mura.renderFilename('')
    .then(function(item){
      alert(item.get('title'));
    });

  Mura.getEntity('content').loadBy('contentid','00000000000000000000000000000000001')
    .then(function(item){
      alert(item.get('title'));
    });

  Mura.getEntity('content').loadBy('contentid','00000000000000000000000000000000001')
    .then(function(item){
      item.get('kids').then(function(kids){
        alert(kids.get('items').length);
      });
    });

  Mura.getEntity('content').loadBy('contentid','1C2AD93E-E39C-C758-A005942E1399F4D6')
    .then(function(item){
      item.get('parent').then(function(parent){
        alert(parent.get('title'));
      });
    });

  Mura.getEntity('content').
    .set('parentid''1C2AD93E-E39C-C758-A005942E1399F4D6')
    .set('approved',1)
    .set('title','test 5')
    .save()
    .then(function(item){
      alert(item.get('title'));
    });

  Mura.getEntity('content').
    .set(
      {
        parentid:'1C2AD93E-E39C-C758-A005942E1399F4D6',
        approved:1,
        title:'test 5'
      }
    .save()
    .then(
      function(item){
        alert(item.get('title'));
      });

  Mura.getFeed('content')
    .where()
    .prop('title').isEQ('About')
    .andProp('type').isEQ('Page')
    .then(function(collection){
      alert(collection.item(0).get('title'));
    });

});
```

## In Node

### Cookie Based Requests

If you want client cookie support you must use a custom RequestContext
that contains the current executions request and response objects.

```
const express = require('express');
const app = express();
const env = {
    siteid:'default',
    rootpath:'http://localhost:8080'
  };

app.get('/', function (req, res) {
  let Mura=require('mura.js');

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
      res.send("<br/>rendered content:<pre>" + JSON.stringify(content.getAll()) + "</pre>")
    },
    function(error){
      console.log(error);
    }
  );
});

app.get('/content', function (req, res) {

  let Mura=require('mura.js');

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
```

## REST Based Requests

```
const express = require('express')
const app = express()
const env = {
    siteid:'default',
    rootpath:'http://localhost:8080',
    mode:'REST'
  };

app.get('/', function (req, res) {

  let Mura=require('../index');

  Mura.init({
    siteid:'default',
    rootpath:'http://localhost:8080'
    mode:'REST'
  });

  //Per Execution Request Headers
  Mura.setRequestHeader('Authorization','Bearer: ...');

  Mura .renderFilename('about').then(
    function(content){
      res.send("<br/>rendered content:<pre>" + JSON.stringify(content.getAll()) + "</pre>")
    },
    function(error){
      console.log(error);
    }
  );
});
```
