var Mura=require('./core');

Mura.Request=Mura.Core.extend(
  /** @lends Mura.Ajax.prototype */
  {

    /**
		 * init - Initialiazes feed
		 *
		 * @param  {object} request     Siteid
		 * @param  {object} response Entity name
		 * @return {Mura.Request}            Self
		 */
		init: function(req, res) {
      this.requestObject=req;
      this.responseObject=res;
      return this;
		},

    /**
    * execute - Make ajax request
    *
    * @param  {object} params
    * @return {Promise}
    * @memberof Mura
    */
    execute: function(params) {

      if (!('type' in params)) {
          params.type = 'GET';
      }

      if (!('success' in params)) {
          params.success = function() {};
      }

      if (!('error' in params)) {
          params.error = function() {};
      }

      if (!('data' in params)) {
          params.data = {};
      }

      if (!('headers' in params)) {
          params.headers = {};
      }

      if(Mura.isInNode()){
        this.nodeRequest(params);
      } else {
        this.browserRequest(params);
      }

    },
    nodeRequest:function(params){

      self=this;

      if(typeof this.requestObject != 'undefined' && typeof this.requestObject.headers['cookie'] != 'undefined'){
        params.headers['Cookie']=this.requestObject.headers['cookie'];
        //console.log('pre cookie');
        //console.log(params.headers['Cookie']);
      }

      //console.log('pre:')
      //console.log(params.headers);
      //console.log(params.headers)

      if (params.type.toLowerCase() == 'post') {

          params.headers['Content-Type']='application/x-www-form-urlencoded; charset=UTF-8';

          Mura._request.post(
            {
              uri: params.url,
              formData: params.data,
              headers: params.headers
            },
            nodeResponseHandler
          );

      } else {
          if (params.url.indexOf('?') == -1) {
              params.url += '?';
          }

          var query = [];

          for (var key in params.data) {
              query.push($escape(key) + '=' + $escape(params.data[key]));
          }

          query = query.join('&');


          Mura._request(
            {
              url: params.url,
              headers:params.headers
            },
            nodeResponseHandler
          );

      }

      function nodeResponseHandler(error, httpResponse, body) {

          if(typeof self.responseObject != 'undefined' && typeof httpResponse.headers['set-cookie'] != 'undefined'){

            var existingCookies=((typeof self.requestObject.headers['cookie'] != 'undefined') ? self.requestObject.headers['cookie'] : '').split("; ");

            var newSetCookies=httpResponse.headers['set-cookie'];

            if(!(newSetCookies instanceof Array)){
              newSetCookies=[newSetCookies];
            }

            self.responseObject.setHeader('Set-Cookie',newSetCookies);

            var cookieMap={};

            for(var c in existingCookies){
              var tempCookie=existingCookies[c].split(" ")[0].split("=");
              cookieMap[tempCookie[0]]=tempCookie[1].split(';')[0];
            }

            for(var c in newSetCookies){
              var tempCookie=newSetCookies[c].split(" ")[0].split("=");
              cookieMap[tempCookie[0]]=tempCookie[1].split(';')[0];
            }

            var cookie='';

            for(var c in cookieMap){
              if(cookieMap.hasOwnProperty(c)){
                if(cookie != ''){
                  cookie=cookie + "; ";
                }
                cookie=cookie + c + "=" + cookieMap[c].split(';')[0]
              }
            }

            self.requestObject.headers['cookie']=cookie;
            //console.log('post:')
            //console.log(self.requestObject.headers['Cookie']);
            //console.log('post cookie');
            //console.log(cookie);

        }

        if (typeof error == 'undefined' || ( httpResponse.statusCode >= 200 && httpResponse.statusCode < 400)) {

            try {
                var data = JSON.parse(body);
            } catch (e) {
                var data = body;
            }

            params.success(data, httpResponse);

        } else if (typeof error == 'undefined') {

            try {
                var data = JSON.parse(body);
            } catch (e) {
                var data = body;
            }

            params.error(data,httpResponse);

        } else {

            params.error(error);

        }

      }
    },
    browserRequest:function(params){
      if (!(typeof FormData != 'undefined' && params.data instanceof FormData)) {
          params.data = Mura.deepExtend({}, params.data);

          for (var p in params.data) {
              if (typeof params.data[p] == 'object') {
                  params.data[p] = JSON.stringify(params.data[p]);
              }
          }
      }

      if (!('xhrFields' in params)) {
          params.xhrFields = {
              withCredentials: true
          };
      }

      if (!('crossDomain' in params)) {
          params.crossDomain = true;
      }

      if (!('async' in params)) {
          params.async = true;
      }

      var req = new XMLHttpRequest();

      if (params.crossDomain) {
          if (!("withCredentials" in req) && typeof XDomainRequest !=
              "undefined" && this.isXDomainRequest(params.url)) {
              // Check if the XMLHttpRequest object has a "withCredentials" property.
              // "withCredentials" only exists on XMLHTTPRequest2 objects.
              // Otherwise, check if XDomainRequest.
              // XDomainRequest only exists in IE, and is IE's way of making CORS requests.

              req = new XDomainRequest();

          }
      }

      req.onreadystatechange = function() {
          if (req.readyState == 4) {
              //IE9 doesn't appear to return the request status
              if (typeof req.status == 'undefined' || (
                      req.status >= 200 && request.status <
                      400)) {

                  try {
                      var data = JSON.parse(req.responseText);
                  } catch (e) {
                      var data = req.responseText;
                  }

                  params.success(data, req);
              } else {
                  params.error(req);
              }
          }
      }

      if (params.type.toLowerCase() == 'post') {
          req.open(params.type.toUpperCase(), params.url, params.async);

          for (var p in params.xhrFields) {
              if (p in request) {
                  request[p] = params.xhrFields[p];
              }
          }

          for (var h in params.headers) {
              req.setRequestHeader(p, params.headers[h]);
          }

          //if(params.data.constructor.name == 'FormData'){
          if (typeof FormData != 'undefined' && params.data instanceof FormData) {
              req.send(params.data);
          } else {
              req.setRequestHeader('Content-Type',
                  'application/x-www-form-urlencoded; charset=UTF-8'
              );
              var query = [];

              for (var key in params.data) {
                  query.push($escape(key) + '=' + $escape(params.data[
                      key]));
              }

              query = query.join('&');

              setTimeout(function() {
                  req.send(query);
              }, 0);
          }
      } else {
          if (params.url.indexOf('?') == -1) {
              params.url += '?';
          }

          var query = [];

          for (var key in params.data) {
              query.push($escape(key) + '=' + $escape(params.data[key]));
          }

          query = query.join('&');

          req.open(params.type.toUpperCase(), params.url + '&' +
              query, params.async);

          for (var p in params.xhrFields) {
              if (p in request) {
                  request[p] = params.xhrFields[p];
              }
          }

          for (var h in params.headers) {
              req.setRequestHeader(p, params.headers[h]);
          }

          setTimeout(function() {
              req.send();
          }, 0);
      }
    },

    isXDomainRequest:function(url) {
        function getHostName(url) {
            var match = url.match(/:\/\/([0-9]?\.)?(.[^/:]+)/i);
            if (match != null && match.length > 2 && typeof match[2] ===
                'string' && match[2].length > 0) {
                return match[2];
            } else {
                return null;
            }
        }


        function getDomain(url) {
            var hostName = getHostName(url);
            var domain = hostName;

            if (hostName != null) {
                var parts = hostName.split('.').reverse();

                if (parts != null && parts.length > 1) {
                    domain = parts[1] + '.' + parts[0];

                    if (hostName.toLowerCase().indexOf('.co.uk') != -1 &&
                        parts.length > 2) {
                        domain = parts[2] + '.' + domain;
                    }
                }
            }

            return domain;
        }

        var requestDomain = getDomain(url);

        return (requestDomain && requestDomain != location.host);

    }

  }
);
