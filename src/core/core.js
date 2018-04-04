
require("babel-polyfill");
require("./polyfill");

/**
 * Creates a new Mura
 * @name Mura
 * @class
 * @global
 */

var Mura=(function(){


  /**
   * login - Logs user into Mura
   *
   * @param  {string} username Username
   * @param  {string} password Password
   * @param  {string} siteid   Siteid
   * @return {Promise}
   * @memberof {class} Mura
   */
  function login(username, password, siteid) {
      return Mura._requestcontext.login(username, password, siteid);
  }


  /**
   * logout - Logs user out
   *
   * @param  {type} siteid Siteid
   * @return {Promise}
   * @memberof {class} Mura
   */
  function logout(siteid) {
      return Mura._requestcontext.logout(siteid);
  }

  function escapeHTML(str) {
      var div = document.createElement('div');
      div.appendChild(document.createTextNode(str));
      return div.innerHTML;
  };

  // UNSAFE with unsafe strings; only use on previously-escaped ones!
  function unescapeHTML(escapedStr) {
      var div = document.createElement('div');
      div.innerHTML = escapedStr;
      var child = div.childNodes[0];
      return child ? child.nodeValue : '';
  };


  var trackingMetadata={};

  /**
   * trackEvent - This is for Mura Experience Platform. It has no use with Mura standard
   *
   * @param  {object} data event data
   * @return {Promise}
   * @memberof {class} Mura
   */
   function trackEvent(eventData) {
     if(typeof Mura.editing != 'undefined' && Mura.editing){
       return new Promise(function(resolve, reject) {
           resolve = resolve || function() {};
           resolve();
       });
     }

     var data={};
     var isMXP=(typeof Mura.MXP != 'undefined');
     var trackingVars = {
       ga:{
        trackingvars:{}
       }
     };
     var gaFound = false;
     var trackingComplete = false;
     var attempt=0;

     data.category = eventData.eventCategory || eventData.category || '';
     data.action = eventData.eventAction || eventData.action || '';
     data.label = eventData.eventLabel || eventData.label || '';
     data.type =  eventData.hitType || eventData.type || 'event';
     data.value =  eventData.eventValue || eventData.value || undefined;

     if (typeof eventData.nonInteraction == 'undefined') {
         data.nonInteraction = false;
     } else {
         data.nonInteraction = eventData.nonInteraction;
     }

     data.contentid = eventData.contentid || Mura.contentid;
     data.objectid = eventData.objectid || '';

     function track() {
         if(!attempt){
             trackingVars.ga.trackingvars.eventCategory = data.category;
             trackingVars.ga.trackingvars.eventAction = data.action;
             trackingVars.ga.trackingvars.nonInteraction = data.nonInteraction;
             trackingVars.ga.trackingvars.hitType = data.type;

             if (typeof data.value != 'undefined' && Mura.isNumeric(
                     data.value)) {
                 trackingVars.ga.trackingvars.eventValue = data.value;
             }

             if (data.label) {
                 trackingVars.ga.trackingvars.eventLabel = data.label;
             } else if(isMXP) {
                 if(typeof trackingVars.object != 'undefined'){
                   trackingVars.ga.trackingvars.eventLabel = trackingVars.object.title;
                 } else {
                   trackingVars.ga.trackingvars.eventLabel = trackingVars.content.title;
                 }

                 data.label=trackingVars.object.title;
             }

             Mura(document).trigger('muraTrackEvent',trackingVars);
             Mura(document).trigger('muraRecordEvent',trackingVars);
         }

         if (typeof ga != 'undefined') {
             if(isMXP){

                 ga('mxpGATracker.send', data.type, trackingVars.ga.trackingvars);
             } else {
                 ga('send', data.type, trackingVars.ga.trackingvars);
             }

             gaFound = true;
             trackingComplete = true;
         }

         attempt++;

         if (!gaFound && attempt <250) {
             setTimeout(track, 1);
         } else {
             trackingComplete = true;
         }

     }

     if(isMXP){

         var trackingID = data.contentid + data.objectid;

         if(typeof trackingMetadata[trackingID] != 'undefined'){
             Mura.deepExtend(trackingVars,trackingMetadata[trackingID]);
             trackingVars.eventData=data;
             track();
         } else {
             Mura.get(mura.apiEndpoint, {
                 method: 'findTrackingProps',
                 siteid: Mura.siteid,
                 contentid: data.contentid,
                 objectid: data.objectid
             }).then(function(response) {
                 Mura.deepExtend(trackingVars,response.data);
                 trackingVars.eventData=data;

                 for(var p in trackingVars.ga.trackingprops){
                     if(trackingVars.ga.trackingprops.hasOwnProperty(p) && p.substring(0,1)=='d' && typeof trackingVars.ga.trackingprops[p] != 'string'){
                         trackingVars.ga.trackingprops[p]=new String(trackingVars.ga[p]);
                     }
                 }

                 trackingMetadata[trackingID]={};
                 Mura.deepExtend(trackingMetadata[trackingID],response.data);
                 track();
             });
         }
     } else {
         track();
     }

     return new Promise(function(resolve, reject) {

         resolve = resolve || function() {};

         function checkComplete() {
             if (trackingComplete) {
                 resolve();
             } else {
                 setTimeout(checkComplete, 1);
             }
         }

         checkComplete();

     });

   }

  /**
  * renderFilename - Returns "Rendered" JSON object of content
  *
  * @param  {type} filename Mura content filename
  * @param  {type} params Object
  * @return {Promise}
  * @memberof {class} Mura
  */
  function renderFilename(filename, params) {
    return Mura._requestcontext.renderFilename(filename, params);
  }

  /**
   * declareEntity - Declare Entity with in service factory
   *
   * @param  {object} entityConfig Entity config object
   * @return {Promise}
   * @memberof {class} Mura
   */
  function declareEntity(entityConfig) {
    return Mura._requestcontext.declareEntity(entityConfig);
  }

  /**
   * undeclareEntity - Deletes entity class from Mura
   *
   * @param  {object} entityName
   * @return {Promise}
   * @memberof {class} Mura
   */
  function undeclareEntity(entityName,deleteSchema) {
		deleteSchema=deleteSchema || false;
    return Mura._requestcontext.undeclareEntity(entityName,deleteSchema);
  }

  /**
   * logout - Logs user out
   *
   * @param  {type} siteid Siteid
   * @return {Promise}
   * @memberof {class} Mura
   */
  function logout(siteid) {
      return Mura._requestcontext.logout(siteid);
  }


  /**
   * getEntity - Returns Mura.Entity instance
   *
   * @param  {string} entityname Entity Name
   * @param  {string} siteid     Siteid
   * @return {Mura.Entity}
   * @memberof {class} Mura
   */
  function getEntity(entityname, siteid) {
      siteid=siteid || Mura.siteid;
      return Mura._requestcontext.getEntity(entityname, siteid);
  }

  /**
   * getFeed - Return new instance of Mura.Feed
   *
   * @param  {type} entityname Entity name
   * @return {Mura.Feed}
   * @memberof {class} Mura
   */
  function getFeed(entityname,siteid) {
    siteid=siteid || Mura.siteid;
    return Mura._requestcontext.getFeed(entityname,siteid);
  }

  /**
   * getCurrentUser - Return Mura.Entity for current user
   *
   * @param  {object} params Load parameters, fields:listoffields
   * @return {Promise}
   * @memberof {class} Mura
   */
  function getCurrentUser(params) {
      return Mura._requestcontext.getCurrentUser(params);
  }

  /**
   * findQuery - Returns Mura.EntityCollection with properties that match params
   *
   * @param  {object} params Object of matching params
   * @return {Promise}
   * @memberof {class} Mura
   */
  function findQuery(params) {
      return Mura._requestcontext.findQuery(params);
  }

  function evalScripts(el) {
      if (typeof el == 'string') {
          el = parseHTML(el);
      }

      var scripts = [];
      var ret = el.childNodes;

      for (var i = 0; ret[i]; i++) {
          if (scripts && nodeName(ret[i], "script") && (!ret[i].type ||
                  ret[i].type.toLowerCase() === "text/javascript")) {
              if (ret[i].src) {
                  scripts.push(ret[i]);
              } else {
                  scripts.push(ret[i].parentNode ? ret[i].parentNode.removeChild(
                      ret[i]) : ret[i]);
              }
          } else if (ret[i].nodeType == 1 || ret[i].nodeType == 9 ||
              ret[i].nodeType == 11) {
              evalScripts(ret[i]);
          }
      }

      for (script in scripts) {
          evalScript(scripts[script]);
      }
  }

  function nodeName(el, name) {
      return el.nodeName && el.nodeName.toUpperCase() === name.toUpperCase();
  }

  function evalScript(el) {
      if (el.src) {
          Mura.loader().load(el.src);
          Mura(el).remove();
      } else {
          var data = (el.text || el.textContent || el.innerHTML || "");

          var head = document.getElementsByTagName("head")[0] ||
              document.documentElement,
              script = document.createElement("script");
          script.type = "text/javascript";
          //script.appendChild( document.createTextNode( data ) );
          script.text = data;
          head.insertBefore(script, head.firstChild);
          head.removeChild(script);

          if (el.parentNode) {
              el.parentNode.removeChild(el);
          }
      }
  }

  function changeElementType(el, to) {
      var newEl = document.createElement(to);

      // Try to copy attributes across
      for (var i = 0, a = el.attributes, n = a.length; i < n; ++i)
          el.setAttribute(a[i].name, a[i].value);

      // Try to move children across
      while (el.hasChildNodes())
          newEl.appendChild(el.firstChild);

      // Replace the old element with the new one
      el.parentNode.replaceChild(newEl, el);

      // Return the new element, for good measure.
      return newEl;
  }

  /*
  Defaults to holdReady is true so that everything
  is queued up until the DOMContentLoaded is fired
  */
  var holdingReady = true;
  var holdingReadyAltered = false;
  var holdingQueueReleased = false;
  var holdingQueue = [];

  /*
  if(typeof jQuery != 'undefined' && typeof jQuery.holdReady != 'undefined'){
      jQuery.holdReady(true);
  }
  */

  /*
  When DOMContentLoaded is fired check to see it the
  holdingReady has been altered by custom code.
  If it hasn't then fire holding functions.
  */
  function initReadyQueue() {
      if (!holdingReadyAltered) {
          /*
          if(typeof jQuery != 'undefined' && typeof jQuery.holdReady != 'undefined'){
              jQuery.holdReady(false);
          }
          */
          releaseReadyQueue();
      }
  };

  function releaseReadyQueue() {
      holdingQueueReleased = true;
      holdingReady = false;

      holdingQueue.forEach(function(fn) {
          readyInternal(fn);
      });

  }

  function holdReady(hold) {
      if (!holdingQueueReleased) {
          holdingReady = hold;
          holdingReadyAltered = true;

          /*
          if(typeof jQuery != 'undefined' && typeof jQuery.holdReady != 'undefined'){
              jQuery.holdReady(hold);
          }
          */

          if (!holdingReady) {
              releaseReadyQueue();
          }
      }
  }

  function ready(fn) {
      if (!holdingQueueReleased) {
          holdingQueue.push(fn);
      } else {
          readyInternal(fn);
      }
  }


  function readyInternal(fn) {
      if(typeof document != 'undefined'){
        if (document.readyState != 'loading') {
            //IE set the readyState to interative too early
            setTimeout(function() {
                fn(Mura);
            }, 1);
        } else {
            document.addEventListener('DOMContentLoaded', function() {
                fn(Mura);
            });
        }
      } else {
        fn(Mura);
      }
  }

  /**
   * get - Make GET request
   *
   * @param  {url} url  URL
   * @param  {object} data Data to send to url
   * @return {Promise}
   * @memberof {class} Mura
   */
  function get(url, data) {
      return Mura._requestcontext.get(url, data);
  }

  /**
   * post - Make POST request
   *
   * @param  {url} url  URL
   * @param  {object} data Data to send to url
   * @return {Promise}
   * @memberof {class} Mura
   */
  function post(url, data) {
      return Mura._requestcontext.post(url, data);
  }

  /**
   * ajax - Make ajax request
   *
   * @param  {object} params
   * @return {Promise}
   * @memberof {class} Mura
   */
  function ajax(params) {
    return Mura._requestcontext.request(params);
  }

  /**
   * getRequestContext - Returns a new Mura.RequestContext;
   *
   * @name getRequestContext
   * @param  {object} request     Siteid
   * @param  {object} response Entity name
   * @return {Mura.RequestContext}   Mura.RequestContext
   * @memberof {class} Mura
   */
  function getRequestContext(request,response) {
    return new Mura.RequestContext(request,response);
  }

  /**
   * getDefaultRequestContext - Returns the default Mura.RequestContext;
   *
   * @name getDefaultRequestContext
   * @return {Mura.RequestContext}   Mura.RequestContext
   * @memberof {class} Mura
   */
  function getDefaultRequestContext() {
    return  Mura._requestcontext;
  }

  /**
   * generateOAuthToken - Generate Outh toke for REST API
   *
   * @param  {string} grant_type  Grant type (Use client_credentials)
   * @param  {type} client_id     Client ID
   * @param  {type} client_secret Secret Key
   * @return {Promise}
   * @memberof {class} Mura
   */
  function generateOAuthToken(grant_type, client_id, client_secret) {
      return new Promise(function(resolve, reject) {
          get(Mura.apiEndpoint.replace('/json/', '/rest/') +
              'oauth?grant_type=' +
              encodeURIComponent(grant_type) +
              '&client_id=' + encodeURIComponent(
                  client_id) + '&client_secret=' +
              encodeURIComponent(client_secret) +
              '&cacheid=' + Math.random()).then(function(
              resp) {
              if (resp.data != 'undefined') {
                  resolve(resp.data);
              } else {

                  if (typeof resp.error != 'undefined' && typeof reject == 'function') {
                      reject(resp);
                  } else {
                      resolve(resp);
                  }
              }
          })
      });
  }

  function each(selector, fn) {
      select(selector).each(fn);
  }

  function on(el, eventName, fn) {
      if (eventName == 'ready') {
          Mura.ready(fn);
      } else {
          if (typeof el.addEventListener == 'function') {
              el.addEventListener(
                  eventName,
                  function(event) {
										if(typeof fn.call == 'undefined'){
											fn(event);
										} else {
											fn.call(el, event);
										}
                  },
                  true
              );
          }
      }
  }

  function trigger(el, eventName, eventDetail) {
      if(typeof document != 'undefined'){
        var bubbles = eventName == "change" ? false : true;

        if (document.createEvent) {

            if(eventDetail && !isEmptyObject(eventDetail)){
                var event = document.createEvent('CustomEvent');
                event.initCustomEvent(eventName, bubbles, true,eventDetail);
            } else {

                var eventClass = "";

                switch (eventName) {
                    case "click":
                    case "mousedown":
                    case "mouseup":
                        eventClass = "MouseEvents";
                        break;

                    case "focus":
                    case "change":
                    case "blur":
                    case "select":
                        eventClass = "HTMLEvents";
                        break;

                    default:
                        eventClass = "Event";
                        break;
                }

                var event = document.createEvent(eventClass);
                event.initEvent(eventName, bubbles, true);
            }

            event.synthetic = true;
            el.dispatchEvent(event);

        } else {
            try {
                document.fireEvent("on" + eventName);
            } catch (e) {
                console.warn(
                    "Event failed to fire due to legacy browser: on" +
                    eventName);
            }
        }
    }
  };

  function off(el, eventName, fn) {
      el.removeEventListener(eventName, fn);
  }

  function parseSelection(selector) {
      if (typeof selector == 'object' && Array.isArray(selector)) {
          var selection = selector;
      } else if (typeof selector == 'string') {
          var selection = nodeListToArray(document.querySelectorAll(
              selector));
      } else {
          if ( (typeof StaticNodeList != 'undefined' && selector instanceof StaticNodeList) ||
              (typeof NodeList != 'undefined' && selector instanceof NodeList) || (typeof HTMLCollection != 'undefined' &&  selector instanceof HTMLCollection)
          ) {
              var selection = nodeListToArray(selector);
          } else {
              var selection = [selector];
          }
      }

      if (typeof selection.length == 'undefined') {
          selection = [];
      }

      return selection;
  }

  function isEmptyObject(obj) {
      return (typeof obj != 'object' || Object.keys(obj).length == 0);
  }

  function filter(selector, fn) {
      return select(parseSelection(selector)).filter(fn);
  }

  function nodeListToArray(nodeList) {
      var arr = [];
      for (var i = nodeList.length; i--; arr.unshift(nodeList[i]));
      return arr;
  }

  function select(selector) {
      return new Mura.DOMSelection(parseSelection(selector),
          selector);
  }

  function parseHTML(str) {
      var tmp = document.implementation.createHTMLDocument();
      tmp.body.innerHTML = str;
      return tmp.body.children;
  };

  function getData(el) {
      var data = {};
      Array.prototype.forEach.call(el.attributes, function(attr) {
          if (/^data-/.test(attr.name)) {
              data[attr.name.substr(5)] = parseString(attr.value);
          }
      });

      return data;
  }

  function getProps(el) {
      var data = {};
      Array.prototype.forEach.call(el.attributes, function(attr) {
          if (/^data-/.test(attr.name)) {
              data[attr.name.substr(5)] = parseString(attr.value);
          }
      });

      return data;
  }


  /**
   * isNumeric - Returns if the value is numeric
   *
   * @name isNumeric
   * @param  {*} val description
   * @return {boolean}
   * @memberof {class} Mura
   */
  function isNumeric(val) {
      return Number(parseFloat(val)) == val;
  }

  /**
  * buildDisplayRegion - Renders display region data returned from Mura.renderFilename()
  *
  * @param  {any} data Region data to build string from
  * @return {string}
  */
  function buildDisplayRegion(data){

    if(typeof data == 'undefined'){
      return '';
    }

    var str = data.header;

    str += data.inherited.header;

    if(data.inherited.items.length){
      for(var i in data.inherited.items){
        str += data.inherited.items[i].header;
        if(typeof data.inherited.items[i].html != 'undefined'){
          str += data.inherited.items[i].html;
        }
        str += data.inherited.items[i].footer;
      }
    }

    str += data.inherited.footer;

    str += data.local.header;

    if(data.local.items.length){
      for(var i in data.local.items){
        str += data.local.items[i].header;
        if(typeof data.local.items[i].html != 'undefined'){
          str += data.local.items[i].html;
        }
        str += data.local.items[i].footer;
      }
    }

    str += data.local.footer;

    str += data.footer;

    return str;
  }

  function parseString(val) {
      if (typeof val == 'string') {
          var lcaseVal = val.toLowerCase();

          if (lcaseVal == 'false') {
              return false;
          } else if (lcaseVal == 'true') {
              return true;
          } else {
              if (!(typeof val == 'string' && val.length == 35) &&
                  isNumeric(val)) {
                  var numVal = parseFloat(val);
                  if (numVal == 0 || !isNaN(1 / numVal)) {
                      return numVal;
                  }
              }

              try {
                  var jsonVal = JSON.parse(val);
                  return jsonVal;
              } catch (e) {
                  return val;
              }

          }
      } else {
          return val;
      }

  }

  function getAttributes(el) {
      var data = {};
      Array.prototype.forEach.call(el.attributes, function(attr) {
          data[attr.name] = attr.value;
      });

      return data;
  }

  /**
   * formToObject - Returns if the value is numeric
   *
   * @name formToObject
   * @param  {form} form Form to serialize
   * @return {object}
   * @memberof {class} Mura
   */
  function formToObject(form) {
      var field, s = {};
      if (typeof form == 'object' && form.nodeName == "FORM") {
          var len = form.elements.length;
          for (i = 0; i < len; i++) {
              field = form.elements[i];
              if (field.name && !field.disabled && field.type !=
                  'file' && field.type != 'reset' && field.type !=
                  'submit' && field.type != 'button') {
                  if (field.type == 'select-multiple') {
                      for (j = form.elements[i].options.length - 1; j >=
                          0; j--) {
                          if (field.options[j].selected)
                              s[s.name] = field.options[j].value;
                      }
                  } else if ((field.type != 'checkbox' && field.type !=
                          'radio') || field.checked) {
                      if (typeof s[field.name] == 'undefined') {
                          s[field.name] = field.value;
                      } else {
                          s[field.name] = s[field.name] + ',' + field
                              .value;
                      }

                  }
              }
          }
      }
      return s;
  }

  //http://youmightnotneedjquery.com/
  /**
   * extend - Extends object one level
   *
   * @name extend
   * @return {object}
   * @memberof {class} Mura
   */
  function extend(out) {
      out = out || {};

      for (var i = 1; i < arguments.length; i++) {
          if (!arguments[i])
              continue;

          for (var key in arguments[i]) {
              if (typeof arguments[i].hasOwnProperty != 'undefined' &&
                  arguments[i].hasOwnProperty(key))
                  out[key] = arguments[i][key];
          }
      }

      return out;
  };

  /**
   * deepExtend - Extends object to full depth
   *
   * @name deepExtend
   * @return {object}
   * @memberof {class} Mura
   */
  function deepExtend(out) {
      out = out || {};

      for (var i = 1; i < arguments.length; i++) {
          var obj = arguments[i];

          if (!obj)
              continue;

          for (var key in obj) {

              if (typeof arguments[i].hasOwnProperty != 'undefined' &&
                  arguments[i].hasOwnProperty(key)) {
                  if (Array.isArray(obj[key])) {
                      out[key] = obj[key].slice(0);
                  } else if (typeof obj[key] === 'object') {
                      out[key] = deepExtend({}, obj[key]);
                  } else {
                      out[key] = obj[key];
                  }
              }
          }
      }

      return out;
  }


  /**
   * createCookie - Creates cookie
   *
   * @name createCookie
   * @param  {string} name  Name
   * @param  {*} value Value
   * @param  {number} days  Days
   * @return {void}
   * @memberof {class} Mura
   */
  function createCookie(name, value, days) {
      if (days) {
          var date = new Date();
          date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
          var expires = "; expires=" + date.toGMTString();
      } else var expires = "";
      document.cookie = name + "=" + value + expires + "; path=/";
  }

  /**
   * readCookie - Reads cookie value
   *
   * @name readCookie
   * @param  {string} name Name
   * @return {*}
   * @memberof {class} Mura
   */
  function readCookie(name) {
      var nameEQ = name + "=";
      var ca = document.cookie.split(';');
      for (var i = 0; i < ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) == ' ') c = c.substring(1, c.length);
          if (c.indexOf(nameEQ) == 0) return unescape(c.substring(
              nameEQ.length, c.length));
      }
      return "";
  }

  /**
   * eraseCookie - Removes cookie value
   *
   * @name eraseCookie
   * @param  {type} name description
   * @return {type}      description
   * @memberof {class} Mura
   */
  function eraseCookie(name) {
      createCookie(name, "", -1);
  }

  function $escape(value) {
      if (typeof encodeURIComponent != 'undefined') {
          return encodeURIComponent(value)
      } else {
          return escape(value).replace(
              new RegExp("\\+", "g"),
              "%2B"
          ).replace(/[\x00-\x1F\x7F-\x9F]/g, "");
      }
  }

  function $unescape(value) {
      return unescape(value);
  }

  //deprecated
  function addLoadEvent(func) {
      var oldonload = onload;
      if (typeof onload != 'function') {
          onload = func;
      } else {
          onload = function() {
              oldonload();
              func();
          }
      }
  }

  function noSpam(user, domain) {
      locationstring = "mailto:" + user + "@" + domain;
      location = locationstring;
  }

  /**
   * isUUID - description
   *
   * @name isUUID
   * @param  {*} value Value
   * @return {boolean}
   * @memberof {class} Mura
   */
  function isUUID(value) {
      if (
          typeof value == 'string' &&
          (
              value.length == 35 && value[8] == '-' && value[13] ==
              '-' && value[18] == '-' || value ==
              '00000000000000000000000000000000001' || value ==
              '00000000000000000000000000000000000' || value ==
              '00000000000000000000000000000000003' || value ==
              '00000000000000000000000000000000005' || value ==
              '00000000000000000000000000000000099'
          )
      ) {
          return true;
      } else {
          return false;
      }
  }

  /**
   * createUUID - Create UUID
   *
   * @name createUUID
   * @return {string}
   * @memberof {class} Mura
   */
  function createUUID() {
      var s = [],
          itoh = '0123456789ABCDEF';

      // Make array of random hex digits. The UUID only has 32 digits in it, but we
      // allocate an extra items to make room for the '-'s we'll be inserting.
      for (var i = 0; i < 35; i++) s[i] = Math.floor(Math.random() *
          0x10);

      // Conform to RFC-4122, section 4.4
      s[14] = 4; // Set 4 high bits of time_high field to version
      s[19] = (s[19] & 0x3) | 0x8; // Specify 2 high bits of clock sequence

      // Convert to hex chars
      for (var i = 0; i < 36; i++) s[i] = itoh[s[i]];

      // Insert '-'s
      s[8] = s[13] = s[18] = '-';

      return s.join('');
  }

  /**
   * setHTMLEditor - Set Html Editor
   *
   * @name setHTMLEditor
   * @param  {dom.element} el Dom Element
   * @return {void}
   * @memberof {class} Mura
   */
  function setHTMLEditor(el) {

      function initEditor() {
          var instance = CKEDITOR.instances[el.getAttribute('id')];
          var conf = {
              height: 200,
              width: '70%'
          };

          extend(conf, Mura(el).data());

          if (instance) {
              instance.destroy();
              CKEDITOR.remove(instance);
          }

          CKEDITOR.replace(el.getAttribute('id'),
              getHTMLEditorConfig(conf), htmlEditorOnComplete);
      }

      function htmlEditorOnComplete(editorInstance) {
          editorInstance.resetDirty();
          var totalIntances = CKEDITOR.instances;
      }

      function getHTMLEditorConfig(customConfig) {
          var attrname = '';
          var htmlEditorConfig = {
              toolbar: 'htmlEditor',
              customConfig: 'config.js.cfm'
          }

          if (typeof(customConfig) == 'object') {
              extend(htmlEditorConfig, customConfig);
          }

          return htmlEditorConfig;
      }

      loader().loadjs(
          Mura.corepath + '/vendor/ckeditor/ckeditor.js',
          function() {
              initEditor();
          }
      );

  }

  var pressed_keys = '';

  var loginCheck = function(key) {

      if (key == 27) {
          pressed_keys = key.toString();

      } else if (key == 76) {
          pressed_keys = pressed_keys + "" + key.toString();
      }

      if (key != 27 && key != 76) {
          pressed_keys = "";
      }

      if (pressed_keys != "") {

          var aux = pressed_keys;
          var lu = '';
          var ru = '';

          if (aux.indexOf('2776') != -1 && location.search.indexOf(
                  "display=login") == -1) {

              if (typeof(Mura.loginURL) != "undefined") {
                  lu = Mura.loginURL;
              } else if (typeof(Mura.loginurl) !=
                  "undefined") {
                  lu = Mura.loginurl;
              } else {
                  lu = "?display=login";
              }

              if (typeof(Mura.returnURL) != "undefined") {
                  ru = Mura.returnURL;
              } else if (typeof(Mura.returnurl) !=
                  "undefined") {
                  ru = Mura.returnURL;
              } else {
                  ru = location.href;
              }
              pressed_keys = "";

              lu = new String(lu);
              if (lu.indexOf('?') != -1) {
                  location.href = lu + "&returnUrl=" +
                      encodeURIComponent(ru);
              } else {
                  location.href = lu + "?returnUrl=" +
                      encodeURIComponent(ru);
              }
          }
      }
  }

  /**
   * isInteger - Returns if the value is an integer
   *
   * @name isInteger
   * @param  {*} Value to check
   * @return {boolean}
   * @memberof {class} Mura
   */
  function isInteger(s) {
      var i;
      for (i = 0; i < s.length; i++) {
          // Check that current character is number.
          var c = s.charAt(i);
          if (((c < "0") || (c > "9"))) return false;
      }
      // All characters are numbers.
      return true;
  }

  function createDate(str) {

      var valueArray = str.split("/");

      var mon = valueArray[0];
      var dt = valueArray[1];
      var yr = valueArray[2];

      var date = new Date(yr, mon - 1, dt);

      if (!isNaN(date.getMonth())) {
          return date;
      } else {
          return new Date();
      }

  }

  function dateToString(date) {
      var mon = date.getMonth() + 1;
      var dt = date.getDate();
      var yr = date.getFullYear();

      if (mon < 10) {
          mon = "0" + mon;
      }
      if (dt < 10) {
          dt = "0" + dt;
      }


      return mon + "/" + dt + "/20" + new String(yr).substring(2, 4);
  }


  function stripCharsInBag(s, bag) {
      var i;
      var returnString = "";
      // Search through string's characters one by one.
      // If character is not in bag, append to returnString.
      for (i = 0; i < s.length; i++) {
          var c = s.charAt(i);
          if (bag.indexOf(c) == -1) returnString += c;
      }
      return returnString;
  }

  function daysInFebruary(year) {
      // February has 29 days in any year evenly divisible by four,
      // EXCEPT for centurial years which are not also divisible by 400.
      return (((year % 4 == 0) && ((!(year % 100 == 0)) || (year %
          400 == 0))) ? 29 : 28);
  }

  function DaysArray(n) {
      for (var i = 1; i <= n; i++) {
          this[i] = 31
          if (i == 4 || i == 6 || i == 9 || i == 11) {
              this[i] = 30
          }
          if (i == 2) {
              this[i] = 29
          }
      }
      return this
  }

  /**
   * isDate - Returns if the value is a data
   *
   * @name isDate
   * @param  {*}  Value to check
   * @return {boolean}
   * @memberof {class} Mura
   */
  function isDate(dtStr, fldName) {
      var daysInMonth = DaysArray(12);
      var dtArray = dtStr.split(Mura.dtCh);

      if (dtArray.length != 3) {
          //alert("The date format for the "+fldName+" field should be : short")
          return false
      }
      var strMonth = dtArray[Mura.dtFormat[0]];
      var strDay = dtArray[Mura.dtFormat[1]];
      var strYear = dtArray[Mura.dtFormat[2]];

      /*
      if(strYear.length == 2){
      	strYear="20" + strYear;
      }
      */
      strYr = strYear;

      if (strDay.charAt(0) == "0" && strDay.length > 1) strDay =
          strDay.substring(1)
      if (strMonth.charAt(0) == "0" && strMonth.length > 1) strMonth =
          strMonth.substring(1)
      for (var i = 1; i <= 3; i++) {
          if (strYr.charAt(0) == "0" && strYr.length > 1) strYr =
              strYr.substring(1)
      }

      month = parseInt(strMonth)
      day = parseInt(strDay)
      year = parseInt(strYr)

      if (month < 1 || month > 12) {
          //alert("Please enter a valid month in the "+fldName+" field")
          return false
      }
      if (day < 1 || day > 31 || (month == 2 && day > daysInFebruary(
              year)) || day > daysInMonth[month]) {
          //alert("Please enter a valid day  in the "+fldName+" field")
          return false
      }
      if (strYear.length != 4 || year == 0 || year < Mura.minYear ||
          year > Mura.maxYear) {
          //alert("Please enter a valid 4 digit year between "+Mura.minYear+" and "+Mura.maxYear +" in the "+fldName+" field")
          return false
      }
      if (isInteger(stripCharsInBag(dtStr, Mura.dtCh)) == false) {
          //alert("Please enter a valid date in the "+fldName+" field")
          return false
      }

      return true;
  }

  /**
   * isEmail - Returns if value is valid email
   *
   * @param  {string} str String to parse for email
   * @return {boolean}
   * @memberof {class} Mura
   */
  function isEmail(cur) {
      var string1 = cur
      if (string1.indexOf("@") == -1 || string1.indexOf(".") == -1) {
          return false;
      } else {
          return true;
      }
  }

  function initShadowBox(el) {
      if(!window){
        return;
      };

      if (Mura(el).find('[data-rel^="shadowbox"],[rel^="shadowbox"]').length) {

          loader().load(
              [
                  Mura.context + '/core/modules/v1/core_assets/css/shadowbox.min.css',
                  Mura.context + '/core/modules/v1/core_assets/js/shadowbox.js'
              ],
              function() {
                  Mura('#shadowbox_overlay,#shadowbox_container').remove();
                  window.Shadowbox.init();
              }
          );
      }
  }

  /**
   * validateForm - Validates Mura form
   *
   * @name validateForm
   * @param  {type} frm          Form element to validate
   * @param  {function} customaction Custom action (optional)
   * @return {boolean}
   * @memberof {class} Mura
   */
  function validateForm(frm, customaction) {

      function getValidationFieldName(theField) {
          if (theField.getAttribute('data-label') != undefined) {
              return theField.getAttribute('data-label');
          } else if (theField.getAttribute('label') != undefined) {
              return theField.getAttribute('label');
          } else {
              return theField.getAttribute('name');
          }
      }

      function getValidationIsRequired(theField) {
          if (theField.getAttribute('data-required') != undefined) {
              return (theField.getAttribute('data-required').toLowerCase() ==
                  'true');
          } else if (theField.getAttribute('required') != undefined) {
              return (theField.getAttribute('required').toLowerCase() ==
                  'true');
          } else {
              return false;
          }
      }

      function getValidationMessage(theField, defaultMessage) {
          if (theField.getAttribute('data-message') != undefined) {
              return theField.getAttribute('data-message');
          } else if (theField.getAttribute('message') != undefined) {
              return theField.getAttribute('message');
          } else {
              return getValidationFieldName(theField).toUpperCase() +
                  defaultMessage;
          }
      }

      function getValidationType(theField) {
          if (theField.getAttribute('data-validate') != undefined) {
              return theField.getAttribute('data-validate').toUpperCase();
          } else if (theField.getAttribute('validate') != undefined) {
              return theField.getAttribute('validate').toUpperCase();
          } else {
              return '';
          }
      }

      function hasValidationMatchField(theField) {
          if (theField.getAttribute('data-matchfield') != undefined &&
              theField.getAttribute('data-matchfield') != '') {
              return true;
          } else if (theField.getAttribute('matchfield') != undefined &&
              theField.getAttribute('matchfield') != '') {
              return true;
          } else {
              return false;
          }
      }

      function getValidationMatchField(theField) {
          if (theField.getAttribute('data-matchfield') != undefined) {
              return theField.getAttribute('data-matchfield');
          } else if (theField.getAttribute('matchfield') != undefined) {
              return theField.getAttribute('matchfield');
          } else {
              return '';
          }
      }

      function hasValidationRegex(theField) {
          if (theField.value != undefined) {
              if (theField.getAttribute('data-regex') != undefined &&
                  theField.getAttribute('data-regex') != '') {
                  return true;
              } else if (theField.getAttribute('regex') != undefined &&
                  theField.getAttribute('regex') != '') {
                  return true;
              }
          } else {
              return false;
          }
      }

      function getValidationRegex(theField) {
          if (theField.getAttribute('data-regex') != undefined) {
              return theField.getAttribute('data-regex');
          } else if (theField.getAttribute('regex') != undefined) {
              return theField.getAttribute('regex');
          } else {
              return '';
          }
      }

      var theForm = frm;
      var errors = "";
      var setFocus = 0;
      var started = false;
      var startAt;
      var firstErrorNode;
      var validationType = '';
      var validations = {
          properties: {}
      };
      var frmInputs = theForm.getElementsByTagName("input");
      var rules = new Array();
      var data = {};
      var $customaction = customaction;

      for (var f = 0; f < frmInputs.length; f++) {
          var theField = frmInputs[f];
          validationType = getValidationType(theField).toUpperCase();

          rules = new Array();

          if (theField.style.display == "") {
              if (getValidationIsRequired(theField)) {
                  rules.push({
                      required: true,
                      message: getValidationMessage(theField,
                          ' is required.')
                  });


              }
              if (validationType != '') {

                  if (validationType == 'EMAIL' && theField.value !=
                      '') {
                      rules.push({
                          dataType: 'EMAIL',
                          message: getValidationMessage(
                              theField,
                              ' must be a valid email address.'
                          )
                      });


                  } else if (validationType == 'NUMERIC' && theField.value !=
                      '') {
                      rules.push({
                          dataType: 'NUMERIC',
                          message: getValidationMessage(
                              theField,
                              ' must be numeric.')
                      });

                  } else if (validationType == 'REGEX' && theField.value !=
                      '' && hasValidationRegex(theField)) {
                      rules.push({
                          regex: getValidationRegex(theField),
                          message: getValidationMessage(
                              theField, ' is not valid.')
                      });

                  } else if (validationType == 'MATCH' &&
                      hasValidationMatchField(theField) && theField.value !=
                      theForm[getValidationMatchField(theField)].value
                  ) {
                      rules.push({
                          eq: theForm[getValidationMatchField(
                              theField)].value,
                          message: getValidationMessage(
                              theField, ' must match' +
                              getValidationMatchField(
                                  theField) + '.')
                      });

                  } else if (validationType == 'DATE' && theField.value !=
                      '') {
                      rules.push({
                          dataType: 'DATE',
                          message: getValidationMessage(
                              theField,
                              ' must be a valid date [MM/DD/YYYY].'
                          )
                      });

                  }
              }

              if (rules.length) {
                  validations.properties[theField.getAttribute('name')] =
                      rules;
                  data[theField.getAttribute('name')] = theField.value;
              }
          }
      }
      var frmTextareas = theForm.getElementsByTagName("textarea");
      for (f = 0; f < frmTextareas.length; f++) {


          theField = frmTextareas[f];
          validationType = getValidationType(theField);

          rules = new Array();

          if (theField.style.display == "" && getValidationIsRequired(
                  theField)) {
              rules.push({
                  required: true,
                  message: getValidationMessage(theField,
                      ' is required.')
              });

          } else if (validationType != '') {
              if (validationType == 'REGEX' && theField.value != '' &&
                  hasValidationRegex(theField)) {
                  rules.push({
                      regex: getValidationRegex(theField),
                      message: getValidationMessage(theField,
                          ' is not valid.')
                  });

              }
          }

          if (rules.length) {
              validations.properties[theField.getAttribute('name')] =
                  rules;
              data[theField.getAttribute('name')] = theField.value;
          }
      }

      var frmSelects = theForm.getElementsByTagName("select");
      for (f = 0; f < frmSelects.length; f++) {
          theField = frmSelects[f];
          validationType = getValidationType(theField);

          rules = new Array();

          if (theField.style.display == "" && getValidationIsRequired(
                  theField)) {
              rules.push({
                  required: true,
                  message: getValidationMessage(theField,
                      ' is required.')
              });
          }

          if (rules.length) {
              validations.properties[theField.getAttribute('name')] =
                  rules;
              data[theField.getAttribute('name')] = theField.value;
          }
      }

      try {
          //alert(JSON.stringify(validations));
          //console.log(data);
          //console.log(validations);
          ajax({
              type: 'post',
              url: Mura.apiEndpoint + '?method=validate',
              data: {
                  data: encodeURIComponent(JSON.stringify(
                      data)),
                  validations: encodeURIComponent(JSON.stringify(
                      validations)),
                  version: 4
              },
              success: function(resp) {

                  data = resp.data;

                  if (Object.keys(data).length === 0) {
                      if (typeof $customaction ==
                          'function') {
                          $customaction(theForm);
                          return false;
                      } else {
                          document.createElement('form').submit.call(theForm);
                      }
                  } else {
                      var msg = '';
                      for (var e in data) {
                          msg = msg + data[e] + '\n';
                      }

                      alert(msg);
                  }
              },
              error: function(resp) {

                  alert(JSON.stringify(resp));
              }

          });
      } catch (err) {
          console.log(err);
      }

      return false;

  }

  function setLowerCaseKeys(obj) {
      for (var key in obj) {
          if (key !== key.toLowerCase()) { // might already be in its lower case version
              obj[key.toLowerCase()] = obj[key] // swap the value to a new lower case key
              delete obj[key] // delete the old key
          }
          if (typeof obj[key.toLowerCase()] == 'object') {
              setLowerCaseKeys(obj[key.toLowerCase()]);
          }
      }

      return (obj);
  }

  function isScrolledIntoView(el) {
      if (!window || window.innerHeight) {
          true;
      }

      try {
          var elemTop = el.getBoundingClientRect().top;
          var elemBottom = el.getBoundingClientRect().bottom;
      } catch (e) {
          return true;
      }

      var isVisible = elemTop < window.innerHeight && elemBottom >= 0;
      return isVisible;

  }

  /**
   * loader - Returns Mura.Loader
   *
   * @name loader
   * @return {Mura.Loader}
   * @memberof {class} Mura
   */
  function loader() {
      return Mura.ljs;
  }


  var layoutmanagertoolbar =
      '<div class="frontEndToolsModal mura"><span class="mura-edit-icon"></span></div>';

  function processMarkup(scope) {

      return new Promise(function(resolve, reject) {
          if (!(scope instanceof Mura.DOMSelection)) {
              scope = select(scope);
          }

          var self = scope;

          function find(selector) {
              return scope.find(selector);
          }

          var processors = [

              function() {
                  find('.mura-object, .mura-async-object')
                      .each(function() {
                          processDisplayObject(this,
                              Mura.queueObjects).then(
                              resolve);
                      });
              },

              function() {
                  find(".htmlEditor").each(function(el) {
                      setHTMLEditor(this);
                  });
              },

              function() {
                  if (find(
                          ".cffp_applied,  .cffp_mm, .cffp_kp"
                      ).length) {
                      var fileref = document.createElement(
                          'script')
                      fileref.setAttribute("type",
                          "text/javascript")
                      fileref.setAttribute("src", Mura
                          .corepath +
                          '/vendor/cfformprotect/js/cffp.js'
                      )

                      document.getElementsByTagName(
                          "head")[0].appendChild(
                          fileref )
                  }
              },

              function() {
                  Mura.reCAPTCHALanguage = Mura.reCAPTCHALanguage ||
                      'en';

                  if (find(".g-recaptcha").length) {
                      var fileref = document.createElement('script')
                      fileref.setAttribute("type","text/javascript");
                      fileref.setAttribute(
                        "src",
                        "https://www.google.com/recaptcha/api.js?onload=Mura.checkForReCaptcha&render=explicit&hl=" +  Mura.reCAPTCHALanguage
                      );

                      document.getElementsByTagName("head")[0].appendChild(fileref);
                  }

                  if (find(".g-recaptcha-container").length) {
                      loader().loadjs(
                          "https://www.google.com/recaptcha/api.js?onload=Mura.checkForReCaptcha&render=explicit&hl=" +
                          Mura.reCAPTCHALanguage,
                          function() {
                              find(
                                  ".g-recaptcha-container"
                              ).each(function(el) {
                                  var self =  el;

                                  Mura.checkForReCaptcha =
                                      function() {
                                          if (
                                              typeof grecaptcha ==
                                              'object' &&
                                              !
                                              self
                                              .innerHTML
                                          ) {

                                              self
                                                  .setAttribute(
                                                      'data-widgetid',
                                                      grecaptcha
                                                      .render(
                                                          self
                                                          .getAttribute(
                                                              'id'
                                                          ), {
                                                              'sitekey': self
                                                                  .getAttribute(
                                                                      'data-sitekey'
                                                                  ),
                                                              'theme': self
                                                                  .getAttribute(
                                                                      'data-theme'
                                                                  ),
                                                              'type': self
                                                                  .getAttribute(
                                                                      'data-type'
                                                                  )
                                                          }
                                                      )
                                                  );
                                          } else {
                                              setTimeout(
                                                      function() {
                                                          Mura.checkForReCaptcha();
                                                      },
                                                      10
                                                  );
                                          }
                                      }

                                  Mura.checkForReCaptcha();

                              });
                          }
                      );

                  }
              },

              function() {
                  if (typeof resizeEditableObject ==
                      'function') {

                      scope.closest('.editableObject').each(
                          function() {
                              resizeEditableObject(
                                  this);
                          });

                      find(".editableObject").each(
                          function() {
                              resizeEditableObject(
                                  this);
                          });

                  }
              },

              function() {

                  if (typeof openFrontEndToolsModal ==
                      'function') {
                      find(".frontEndToolsModal").on(
                          'click',
                          function(event) {
                              event.preventDefault();
                              openFrontEndToolsModal(
                                  this);
                          }
                      );
                  }


                  if (window  && window.MuraInlineEditor && window.MuraInlineEditor
                      .checkforImageCroppers) {
                      find("img").each(function() {
                          window.muraInlineEditor.checkforImageCroppers(
                              this);
                      });

                  }

              },

              function() {
                  initShadowBox(scope.node);
              },

              function() {
                  if (typeof urlparams.Muraadminpreview !=
                      'undefined') {
                      find("a").each(function() {
                          var h = this.getAttribute(
                              'href');
                          if (typeof h ==
                              'string' && h.indexOf(
                                  'muraadminpreview'
                              ) == -1) {
                              h = h + (h.indexOf(
                                      '?') !=
                                  -1 ?
                                  "&muraadminpreview&mobileformat=" +
                                  Mura.mobileformat :
                                  "?muraadminpreview&muraadminpreview&mobileformat=" +
                                  Mura.mobileformat
                              );
                              this.setAttribute(
                                  'href', h);
                          }
                      });
                  }
              }
          ];


          for (var h = 0; h < processors.length; h++) {
              processors[h]();
          }

      });

  }

  function addEventHandler(eventName, fn) {
      if (typeof eventName == 'object') {
          for (var h in eventName) {
              if(eventName.hasOwnProperty(h)){
                on(document, h, eventName[h]);
              }
          }
      } else {
          on(document, eventName, fn);
      }
  }


  function submitForm(frm, obj) {
      frm = (frm.node) ? frm.node : frm;

      if (obj) {
          obj = (obj.node) ? obj : Mura(obj);
      } else {
          obj = Mura(frm).closest('.mura-async-object');
      }

      if (!obj.length) {
          Mura(frm).trigger('formSubmit', formToObject(frm));
          frm.submit();
      }

      if (Mura.formdata  && frm.getAttribute(
              'enctype') == 'multipart/form-data') {

          var data = new FormData(frm);
          var checkdata = setLowerCaseKeys(formToObject(frm));
          var keys = deepExtend(setLowerCaseKeys(obj.data()),
              urlparams, {
                  siteid: Mura.siteid,
                  contentid: Mura.contentid,
                  contenthistid: Mura.contenthistid,
                  nocache: 1
              });

          for (var k in keys) {
              if (!(k in checkdata)) {
                  data.append(k, keys[k]);
              }
          }

          if ('objectparams' in checkdata) {
              data.append('objectparams2', encodeURIComponent(JSON.stringify(
                  obj.data('objectparams'))));
          }

          if ('nocache' in checkdata) {
              data.append('nocache', 1);
          }

          /*
          if(data.object=='container' && data.content){
          	delete data.content;
          }
          */

          var postconfig = {
              url: Mura.apiEndpoint +
                  '?method=processAsyncObject',
              type: 'POST',
              data: data,
              success: function(resp) {
                  handleResponse(obj, resp);
              }
          }

      } else {

          var data = deepExtend(setLowerCaseKeys(obj.data()),
              urlparams, setLowerCaseKeys(formToObject(frm)), {
                  siteid: Mura.siteid,
                  contentid: Mura.contentid,
                  contenthistid: Mura.contenthistid,
                  nocache: 1
              });

          if (data.object == 'container' && data.content) {
              delete data.content;
          }

          if (!('g-recaptcha-response' in data)) {
              var reCaptchaCheck = Mura(frm).find(
                  "#g-recaptcha-response");

              if (reCaptchaCheck.length && typeof reCaptchaCheck.val() !=
                  'undefined') {
                  data['g-recaptcha-response'] = eCaptchaCheck.val();
              }
          }

          if ('objectparams' in data) {
              data['objectparams'] = encodeURIComponent(JSON.stringify(
                  data['objectparams']));
          }

          var postconfig = {
              url: Mura.apiEndpoint +
                  '?method=processAsyncObject',
              type: 'POST',
              data: data,
              success: function(resp) {
                  handleResponse(obj, resp);
              }
          }
      }

      var self = obj.node;
      self.prevInnerHTML = self.innerHTML;
      self.prevData = obj.data();
      self.innerHTML = Mura.preloaderMarkup;

      Mura(frm).trigger('formSubmit', data);

      ajax(postconfig);
  }

  function firstToUpperCase(str) {
      return str.substr(0, 1).toUpperCase() + str.substr(1);
  }

  function resetAsyncObject(el) {
      var self = Mura(el);

      self.removeClass('mura-active');
      self.removeAttr('data-perm');
      self.removeAttr('data-runtime');
      self.removeAttr('draggable');

      if (self.data('object') == 'container') {
          self.find('.mura-object:not([data-object="container"])').html(
              '');
          self.find('.frontEndToolsModal').remove();

          self.find('.mura-object').each(function() {
              var self = Mura(this);
              self.removeClass('mura-active');
              self.removeAttr('data-perm');
              self.removeAttr('data-inited');
              self.removeAttr('data-runtime');
              self.removeAttr('draggable');
          });

          self.find('.mura-object[data-object="container"]').each(
              function() {
                  var self = Mura(this);
                  var content = self.children(
                      'div.mura-object-content');

                  if (content.length) {
                      self.data('content', content.html());
                  }

                  content.html('');
              });

          self.find('.mura-object-meta').html('');
          var content = self.children('div.mura-object-content');

          if (content.length) {
              self.data('content', content.html());
          }
      }

      self.html('');
  }

  function processAsyncObject(el) {
      obj = Mura(el);
      if (obj.data('async') === null) {
          obj.data('async', true);
      }
      return processDisplayObject(obj, false, true);
  }

  function wireUpObject(obj, response, attempt) {

      attempt= attempt || 0;
      attempt++;

      function validateFormAjax(frm) {
          validateForm(frm,
              function(frm) {
                  submitForm(frm, obj);
              }
          );

          return false;

      }

      obj = (obj.node) ? obj : Mura(obj);
      var self = obj.node;

      if (obj.data('class')) {
          var classes = obj.data('class');

          if (typeof classes != 'Array') {
              var classes = classes.split(' ');
          }

          for (var c = 0; c < classes.length; c++) {
              if (!obj.hasClass(classes[c])) {
                  obj.addClass(classes[c]);
              }
          }
      }

      obj.data('inited', true);

      if (obj.data('cssclass')) {
          var classes = obj.data('cssclass');

          if (typeof classes != 'array') {
              var classes = classes.split(' ');
          }

          for (var c = 0; c < classes.length; c++) {
              if (!obj.hasClass(classes[c])) {
                  obj.addClass(classes[c]);
              }
          }
      }

      if (response) {
          if (typeof response == 'string') {
              obj.html(trim(response));
          } else if (typeof response.html == 'string' && response.render !=
              'client') {
              obj.html(trim(response.html));
          } else {
              if (obj.data('object') == 'container') {
                  var context = deepExtend(obj.data(), response);
                  context.targetEl = obj.node;
                  obj.prepend(Mura.templates.meta(context));
              } else {
                  var context = deepExtend(obj.data(), response);
                  var template = obj.data('clienttemplate') || obj.data(
                      'object');
                  var properNameCheck = firstToUpperCase(template);

                  if (typeof Mura.DisplayObject[properNameCheck] !=
                      'undefined') {
                      template = properNameCheck;
                  }

                  if (typeof context.async != 'undefined') {
                      obj.data('async', context.async);
                  }

                  if (typeof context.render != 'undefined') {
                      obj.data('render', context.render);
                  }

                  if (typeof context.rendertemplate != 'undefined') {
                      obj.data('rendertemplate', context.rendertemplate);
                  }

                  if (typeof Mura.DisplayObject[template] !=
                      'undefined') {
                      context.html = '';
                      obj.html(Mura.templates.content(context));
                      obj.prepend(Mura.templates.meta(context));
                      context.targetEl = obj.children(
                          '.mura-object-content').node;
                      Mura.displayObjectInstances[obj.data(
                          'instanceid')] = new Mura.DisplayObject[
                          template](context);
                  } else if (typeof Mura.templates[template] !=
                      'undefined') {
                      context.html = '';
                      obj.html(Mura.templates.content(context));
                      obj.prepend(Mura.templates.meta(context));
                      context.targetEl = obj.children(
                          '.mura-object-content').node;
                      Mura.templates[template](context);
                  } else {
                      if(attempt < 1000){
                          setTimeout(
                              function(){
                                  wireUpObject(obj,response,attempt);
                              },
                              1
                          );
                      } else {
                          console.log('Missing Client Template for:');
                          console.log(obj.data());
                      }
                  }
              }
          }
      } else {
          var context = obj.data();

          if (obj.data('object') == 'container') {
              obj.prepend(Mura.templates.meta(context));
          } else {
              var template = obj.data('clienttemplate') || obj.data(
                  'object');
              var properNameCheck = firstToUpperCase(template);

              if (typeof Mura.DisplayObject[properNameCheck] !=
                  'undefined') {
                  template = properNameCheck;
              }

              if (typeof Mura.DisplayObject[template] == 'function') {
                  context.html = '';
                  obj.html(Mura.templates.content(context));
                  obj.prepend(Mura.templates.meta(context));
                  context.targetEl = obj.children(
                      '.mura-object-content').node;
                  Mura.displayObjectInstances[obj.data('instanceid')] =
                      new Mura.DisplayObject[template](context);
              } else if (typeof Mura.templates[template] !=
                  'undefined') {
                  context.html = '';
                  obj.html(Mura.templates.content(context));
                  obj.prepend(Mura.templates.meta(context));
                  context.targetEl = obj.children(
                      '.mura-object-content').node;
                  Mura.templates[template](context);
              } else {
                  if(attempt < 1000){
                      setTimeout(
                          function(){
                              wireUpObject(obj,response,attempt);
                          },
                          1
                      );
                  } else {
                      console.log('Missing Client Template for:');
                      console.log(obj.data());
                  }

              }
          }
      }

      //obj.hide().show();

      if (Mura.layoutmanager && Mura.editing) {
          if (obj.hasClass('mura-body-object')) {
              obj.children('.frontEndToolsModal').remove();
              obj.prepend(layoutmanagertoolbar);
              MuraInlineEditor.setAnchorSaveChecks(obj.node);

              obj
                  .addClass('mura-active')
                  .hover(
                    Mura.initDraggableObject_hoverin,
                    Mura.initDraggableObject_hoverin
                  );
          } else {
              if (Mura.type == 'Variation') {
                  var objectData = obj.data();
                  if (MuraInlineEditor && (MuraInlineEditor
                          .objectHasConfigurator(obj) || (!Mura.layoutmanager &&
                              MuraInlineEditor.objectHasEditor(
                                  objectParams)))) {
                      obj.children('.frontEndToolsModal').remove();
                      obj.prepend(layoutmanagertoolbar);
                      MuraInlineEditor.setAnchorSaveChecks(obj.node);

                      obj
                          .addClass('mura-active')
                          .hover(
                              Mura.initDraggableObject_hoverin,
                              Mura.initDraggableObject_hoverin
                          );

                      Mura.initDraggableObject(self);
                  }
              } else {
                  var region = Mura(self).closest(
                      ".mura-region-local");
                  if (region && region.length) {
                      if (region.data('perm')) {
                          var objectData = obj.data();

                          if (MuraInlineEditor && (MuraInlineEditor.objectHasConfigurator(obj) || (!Mura.layoutmanager && MuraInlineEditor.objectHasEditor(objectData)))) {
                              obj.children('.frontEndToolsModal').remove();
                              obj.prepend(layoutmanagertoolbar);
                              MuraInlineEditor.setAnchorSaveChecks(obj.node);

                              obj
                                  .addClass('mura-active')
                                  .hover(
                                      function(e) {
                                          //e.stopPropagation();
                                          Mura('.mura-active-target')
                                              .removeClass(
                                                  'mura-active-target'
                                              );
                                          Mura(this).addClass(
                                              'mura-active-target'
                                          );
                                      },
                                      function(e) {
                                          //e.stopPropagation();
                                          Mura(this).removeClass(
                                              'mura-active-target'
                                          );
                                      }
                                  );

                              Mura.initDraggableObject(self);
                          }
                      }
                  }
              }
          }
      }

      obj.hide().show();

      processMarkup(obj.node);

      obj.find('a[href="javascript:history.back();"]').each(function() {
          Mura(this).off("click").on("click", function(e) {
              if (self.prevInnerHTML) {
                  e.preventDefault();
                  wireUpObject(obj, self.prevInnerHTML);

                  if (self.prevData) {
                      for (var p in self.prevData) {
                          select('[name="' + p + '"]')
                              .val(self.prevData[p]);
                      }
                  }
                  self.prevInnerHTML = false;
                  self.prevData = false;
              }
          });
      });


      obj.find('FORM').each(function() {
          var form = Mura(this);
          var self = this;

          if (form.data('async') || !(form.hasData('async') &&
                  !form.data('async')) && !(form.hasData(
                  'autowire') && !form.data('autowire')) && !
              form.attr('action') && !form.attr('onsubmit') &&
              !form.attr('onSubmit')) {
              self.onsubmit = function() {
                  return validateFormAjax(this);
              };
          }
      });

      if (obj.data('nextnid')) {
          obj.find('.mura-next-n a').each(function() {
              Mura(this).on('click', function(e) {
                  e.preventDefault();
                  var a = this.getAttribute('href').split(
                      '?');
                  if (a.length == 2) {
                      location.hash = a[1];
                  }

              });
          })
      }

      obj.trigger('asyncObjectRendered');

  }

  function handleResponse(obj, resp) {

      obj = (obj.node) ? obj : Mura(obj);

      // handle HTML response
      resp = (!resp.data) ? {
          data: resp
      } : resp;

      if (typeof resp.data.redirect != 'undefined') {
          if (resp.data.redirect && resp.data.redirect != location.href) {
              location.href = resp.data.redirect;
          } else {
              location.reload(true);
          }
      } else if (resp.data.apiEndpoint) {
          ajax({
              type: "POST",
              xhrFields: {
                  withCredentials: true
              },
              crossDomain: true,
              url: resp.data.apiEndpoint,
              data: resp.data,
              success: function(data) {
                  if (typeof data == 'string') {
                      wireUpObject(obj, data);
                  } else if (typeof data == 'object' &&
                      'html' in data) {
                      wireUpObject(obj, data.html);
                  } else if (typeof data == 'object' &&
                      'data' in data && 'html' in data.data
                  ) {
                      wireUpObject(obj, data.data.html);
                  } else {
                      wireUpObject(obj, data.data);
                  }
              }
          });
      } else {
          wireUpObject(obj, resp.data);
      }
  }

  function processDisplayObject(el, queue, rerender, resolveFn) {

      var obj = (el.node) ? el : Mura(el);

      if (obj.data('queue') != null) {
          queue = obj.data('queue');

          if(typeof queue == 'string'){
              queue=queue.toLowerCase();
              if(queue=='no' || queue=='false'){
                queue=false;
            } else {
                queue==true;
            }
          }
      }

      el = el.node || el;
      var self = el;
      var rendered = !rerender && !(obj.hasClass('mura-async-object') ||
          obj.data('render') == 'client' || obj.data('async'));

      queue = (queue == null || rendered) ? false : queue;

      if (document.createEvent && queue && !isScrolledIntoView(el)) {
          if (!resolveFn) {
              return new Promise(function(resolve, reject) {

                  resolve = resolve || function() {};

                  setTimeout(
                      function() {
                          processDisplayObject(el, true,
                              false, resolve);
                      }, 10
                  );
              });
          } else {
              setTimeout(
                  function() {
                      var resp = processDisplayObject(el, true,
                          false, resolveFn);
                      if (typeof resp == 'object' && typeof resolveFn ==
                          'function') {
                          resp.then(resolveFn);
                      }
                  }, 10
              );

              return;
          }
      }

      if (!self.getAttribute('data-instanceid')) {
          self.setAttribute('data-instanceid', createUUID());
      }

      //if(obj.data('async')){
      obj.addClass("mura-async-object");
      //}

      if (obj.data('object') == 'container') {

          obj.html(Mura.templates.content(obj.data()));

          obj.find('.mura-object').each(function() {
              this.setAttribute('data-instanceid', createUUID());
          });

      }

      if (rendered) {
          return new Promise(function(resolve, reject) {
              var forms = obj.find('form');

              obj.find('form').each(function() {
                  var form = Mura(this);

                  if (form.data('async') || !(form.hasData(
                          'async') && !form.data(
                          'async')) && !(form.hasData(
                          'autowire') && !form.data(
                          'autowire')) && !form.attr(
                          'action') && !form.attr(
                          'onsubmit') && !form.attr(
                          'onSubmit')) {
                      form.on('submit', function(e) {
                          e.preventDefault();
                          validateForm(this,
                              function(
                                  frm) {
                                  submitForm
                                      (
                                          frm,
                                          obj
                                      );
                              }
                          );

                          return false;
                      });
                  }


              });

              if (typeof resolve == 'function') {
                  resolve(obj);
              }

          });
      }

      return new Promise(function(resolve, reject) {
          var data = deepExtend(setLowerCaseKeys(getData(self)),
              urlparams, {
                  siteid: Mura.siteid,
                  contentid: Mura.contentid,
                  contenthistid: Mura.contenthistid
              });

          delete data.inited;

          if (obj.data('contentid')) {
              data.contentid = self.getAttribute(
                  'data-contentid');
          }

          if (obj.data('contenthistid')) {
              data.contenthistid = self.getAttribute(
                  'data-contenthistid');
          }

          if ('objectparams' in data) {
              data['objectparams'] = encodeURIComponent(JSON.stringify(
                  data['objectparams']));
          }

          delete data.params;

          if (obj.data('object') == 'container') {
              wireUpObject(obj);
              if (typeof resolve == 'function') {
								if(typeof resolve.call == 'undefined'){
                  resolve(obj);
								} else {
									resolve.call(obj.node, obj);
								}
              }
          } else {
              if (!obj.data('async') && obj.data('render') ==
                  'client') {
                  wireUpObject(obj);
                  if (typeof resolve == 'function') {
										if(typeof resolve.call == 'undefined'){
                      resolve(obj);
										} else {
											resolve.call(obj.node, obj);
										}
                  }
              } else {
                  //console.log(data);
                  self.innerHTML = Mura.preloaderMarkup;
                  ajax({
                      url: Mura.apiEndpoint +
                          '?method=processAsyncObject',
                      type: 'get',
                      data: data,
                      success: function(resp) {
                          handleResponse(obj,
                              resp);
                          if (typeof resolve =='function') {
														if(typeof resolve.call == 'undefined'){
															resolve(obj);
														} else {
															resolve.call(obj.node, obj);
														}
                          }
                      }
                  });
              }

          }
      });

  }

  var hashparams = {};
  var urlparams = {};

  function handleHashChange() {

      if(typeof location != 'undefined'){
        var hash = location.hash;
      } else {
        var hash = '';
      }

      if (hash) {
          hash = hash.substring(1);
      }

      if (hash) {
          hashparams = getQueryStringParams(hash);
          if (hashparams.nextnid) {
              Mura('.mura-async-object[data-nextnid="' + hashparams.nextnid +
                  '"]').each(function() {
                  Mura(this).data(hashparams);
                  processAsyncObject(this);
              });
          } else if (hashparams.objectid) {
              Mura('.mura-async-object[data-objectid="' + hashparams.objectid +
                  '"]').each(function() {
                  Mura(this).data(hashparams);
                  processAsyncObject(this);
              });
          }
      }
  }

  /**
   * trim - description
   *
   * @param  {string} str Trims string
   * @return {string}     Trimmed string
   * @memberof {class} Mura
   */
  function trim(str) {
      return str.replace(/^\s+|\s+$/gm, '');
  }


  function extendClass(baseClass, subClass) {
      var muraObject = function() {
          this.init.apply(this, arguments);
      }

      muraObject.prototype = Object.create(baseClass.prototype);
      muraObject.prototype.constructor = muraObject;
      muraObject.prototype.handlers = {};

      muraObject.reopen = function(subClass) {
          Mura.extend(muraObject.prototype, subClass);
      };

      muraObject.reopenClass = function(subClass) {
          Mura.extend(muraObject, subClass);
      };

      muraObject.on = function(eventName, fn) {
          eventName = eventName.toLowerCase();

          if (typeof muraObject.prototype.handlers[eventName] ==
              'undefined') {
              muraObject.prototype.handlers[eventName] = [];
          }

          if (!fn) {
              return muraObject;
          }

          for (var i = 0; i < muraObject.prototype.handlers[
                  eventName].length; i++) {
              if (muraObject.prototype.handlers[eventName][i] ==
                  handler) {
                  return muraObject;
              }
          }


          muraObject.prototype.handlers[eventName].push(fn);
          return muraObject;
      };

      muraObject.off = function(eventName, fn) {
          eventName = eventName.toLowerCase();

          if (typeof muraObject.prototype.handlers[eventName] ==
              'undefined') {
              muraObject.prototype.handlers[eventName] = [];
          }

          if (!fn) {
              muraObject.prototype.handlers[eventName] = [];
              return muraObject;
          }

          for (var i = 0; i < muraObject.prototype.handlers[
                  eventName].length; i++) {
              if (muraObject.prototype.handlers[eventName][i] ==
                  handler) {
                  muraObject.prototype.handlers[eventName].splice(
                      i, 1);
              }
          }
          return muraObject;
      }


      Mura.extend(muraObject.prototype, subClass);

      return muraObject;
  }


  /**
   * getQueryStringParams - Returns object of params in string
   *
   * @name getQueryStringParams
   * @param  {string} queryString Query String
   * @return {object}
   * @memberof {class} Mura
   */
  function getQueryStringParams(queryString) {

      if(typeof location == 'undefined'){
        return {};
      }

      queryString = queryString || location.search;
      var params = {};
      var e,
          a = /\+/g, // Regex for replacing addition symbol with a space
          r = /([^&;=]+)=?([^&;]*)/g,
          d = function(s) {
              return decodeURIComponent(s.replace(a, " "));
          };

      if (queryString.substring(0, 1) == '?') {
          var q = queryString.substring(1);
      } else {
          var q = queryString;
      }


      while (e = r.exec(q))
          params[d(e[1]).toLowerCase()] = d(e[2]);

      return params;
  }

  /**
   * getHREFParams - Returns object of params in string
   *
   * @name getHREFParams
   * @param  {string} href
   * @return {object}
   * @memberof {class} Mura
   */
  function getHREFParams(href) {
      var a = href.split('?');

      if (a.length == 2) {
          return getQueryStringParams(a[1]);
      } else {
          return {};
      }
  }

  function inArray(elem, array, i) {
      var len;
      if (array) {
          if (array.indexOf) {
              return array.indexOf.call(array, elem, i);
          }
          len = array.length;
          i = i ? i < 0 ? Math.max(0, len + i) : i : 0;
          for (; i < len; i++) {
              // Skip accessing in sparse arrays
              if (i in array && array[i] === elem) {
                  return i;
              }
          }
      }
      return -1;
  }

  /**
   * setRequestHeader - Initialiazes feed
   *
   * @name setRequestHeader
   * @param  {string} headerName  Name of header
   * @param  {string} value Header value
   * @return {Mura.RequestContext} Self
   * @memberof {class} Mura
   */
   function setRequestHeader(headerName,value){
     Mura.requestHeaders[headerName]=value;
     return this;
   }

  /**
   * getRequestHeader - Returns a request header value
   *
   * @name getRequestHeader
   * @param  {string} headerName  Name of header
   * @return {string} header Value
   * @memberof {class} Mura
   */
   function getRequestHeader(headerName){
      if(typeof Mura.requestHeaders[headerName] != 'undefined'){
        return Mura.requestHeaders[headerName];
      } else {
        return null;
      }
   }

  /**
   * getRequestHeaders - Returns a request header value
   *
   * @name getRequestHeaders
   * @return {object} All Headers
   * @memberof {class} Mura
   */
   function getRequestHeaders(){
     return Mura.requestHeaders;
   }

  //http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/

  /**
   * hashCode - description
   *
   * @name hashCode
   * @param  {string} s String to hash
   * @return {string}
   * @memberof {class} Mura
   */
  function hashCode(s) {
      var hash = 0,
          strlen = s.length,
          i, c;

      if (strlen === 0) {
          return hash;
      }
      for (i = 0; i < strlen; i++) {
          c = s.charCodeAt(i);
          hash = ((hash << 5) - hash) + c;
          hash = hash & hash; // Convert to 32bit integer
      }
      return (hash >>> 0);
  }

  /**
   * Returns if the current request s running in Node.js
  **/
  function isInNode(){
    return typeof process !== 'undefined' && {}.toString.call(process) === '[object process]' || typeof document =='undefined';
  }

  /**
   * Global Request Headers
  **/
  var requestHeaders={};

  function init(config) {

      if (config.rootpath) {
          config.context = config.rootpath;
      }

      if (config.endpoint) {
          config.context = config.endpoint;
      }

      if (!config.context) {
          config.context = '';
      }

      if (!config.assetpath) {
          config.assetpath = config.context + "/" + config.siteid;
      }

      if (!config.apiEndpoint) {
          config.apiEndpoint = config.context +  '/index.cfm/_api/json/v1/' + config.siteid + '/';
      }

      if (!config.pluginspath) {
          config.pluginspath = config.context + '/plugins';
      }

      if (!config.corepath) {
          config.corepath = config.context + '/core';
      }

      if (!config.jslib) {
          config.jslib = 'jquery';
      }

      if (!config.perm) {
          config.perm = 'none';
      }

      if (typeof config.layoutmanager == 'undefined') {
          config.layoutmanager = false;
      }

      if (typeof config.mobileformat == 'undefined') {
          config.mobileformat = false;
      }

      if (typeof config.queueObjects == 'undefined') {
          config.queueObjects = true;
      }

      if (typeof config.rootdocumentdomain != 'undefined' && config.rootdocumentdomain != '') {
          document.domain = config.rootdocumentdomain;
      }

      if (typeof config.preloaderMarkup == 'undefined') {
          config.preloaderMarkup = '';
      }

			if (typeof config.rb == 'undefined') {
          config.rb={};
      }

			config.formdata=(typeof FormData != 'undefined') ? true : false;

      Mura.editing;

      extend(Mura, config);

      if(Mura.mode.toLowerString=='rest'){
          Mura.apiEndpoint=Mura.apiEndpoint.replace('/json/', '/rest/');
      }

      if(isInNode()
        && typeof Mura.request != 'undefined'
        && typeof Mura.response != 'undefined'){

        Mura._requestcontext=Mura.getRequestContext(Mura.request,Mura.response);
      } else {
        Mura._requestcontext=Mura.getRequestContext();
      }

      Mura(function() {

          if(!isInNode()){

            var hash = location.hash;

            if (hash) {
                hash = hash.substring(1);
            }

            urlparams = setLowerCaseKeys(getQueryStringParams(location.search));

            if (hashparams.nextnid) {
                Mura('.mura-async-object[data-nextnid="' +
                    hashparams.nextnid + '"]').each(
                    function() {
                        Mura(this).data(hashparams);
                    });
            } else if (hashparams.objectid) {
                Mura('.mura-async-object[data-nextnid="' +
                    hashparams.objectid + '"]').each(
                    function() {
                        Mura(this).data(hashparams);
                    });
            }

            if(window){
              Mura(window).on('hashchange', handleHashChange);
            }

            processMarkup(document);

            Mura(document)
                .on("keydown", function(event) {
                    loginCheck(event.which);
                });

            Mura(document).trigger('muraReady');
          }

      });

      readyInternal(initReadyQueue);

      return Mura
  }

  var Mura=extend(
          function(selector, context) {
              if (typeof selector == 'function') {
                  Mura.ready(selector);
                  return this;
              } else {
                  if (typeof context == 'undefined') {
                      return select(selector);
                  } else {
                      return select(context).find(
                          selector);
                  }
              }
          }, {
              generateOAuthToken: generateOAuthToken,
              entities: {},
              submitForm: submitForm,
              escapeHTML: escapeHTML,
              unescapeHTML: unescapeHTML,
              processDisplayObject: processDisplayObject,
              processAsyncObject: processAsyncObject,
              resetAsyncObject: resetAsyncObject,
              setLowerCaseKeys: setLowerCaseKeys,
              noSpam: noSpam,
              addLoadEvent: addLoadEvent,
              loader: loader,
              addEventHandler: addEventHandler,
              trigger: trigger,
              ready: ready,
              on: on,
              off: off,
              extend: extend,
              inArray: inArray,
              isNumeric: isNumeric,
              post: post,
              get: get,
              deepExtend: deepExtend,
              ajax: ajax,
              changeElementType: changeElementType,
              setHTMLEditor: setHTMLEditor,
              each: each,
              parseHTML: parseHTML,
              getData: getData,
              getProps: getProps,
              isEmptyObject: isEmptyObject,
              isScrolledIntoView: isScrolledIntoView,
              evalScripts: evalScripts,
              validateForm: validateForm,
              escape: $escape,
              unescape: $unescape,
              getBean: getEntity,
              getEntity: getEntity,
              getCurrentUser: getCurrentUser,
              renderFilename: renderFilename,
              findQuery: findQuery,
              getFeed: getFeed,
              login: login,
              logout: logout,
              extendClass: extendClass,
              init: init,
              formToObject: formToObject,
              createUUID: createUUID,
              isUUID: isUUID,
              processMarkup: processMarkup,
              getQueryStringParams: getQueryStringParams,
              layoutmanagertoolbar: layoutmanagertoolbar,
              parseString: parseString,
              createCookie: createCookie,
              readCookie: readCookie,
              trim: trim,
              hashCode: hashCode,
              DisplayObject: {},
              displayObjectInstances: {},
              holdReady: holdReady,
              trackEvent: trackEvent,
              recordEvent: trackEvent,
              isInNode: isInNode,
              getRequestContext: getRequestContext,
              getDefaultRequestContext: getDefaultRequestContext,
              requestHeaders:requestHeaders,
              setRequestHeader:setRequestHeader,
              getRequestHeader:getRequestHeaders,
              getRequestHeaders:getRequestHeaders,
              mode: 'json',
              declareEntity:declareEntity,
              undeclareEntity:undeclareEntity,
              buildDisplayRegion:buildDisplayRegion
          }
      );

    return Mura;

})();

module.exports=Mura;
