
var Mura=require('./core');

/**
* Creates a new Mura.RequestContext
* @name  Mura.RequestContent
* @extends Mura.Core
* @memberof {class} Mura
*/

Mura.RequestContext=Mura.Core.extend(
/** @lends Mura.RequestContext.prototype */
{

  /**
	 * init - Initialiazes feed
	 *
	 * @param  {object} request     Siteid
	 * @param  {object} response Entity name
	 * @return {Mura.RequestContext}            Self
   * @constructs
	 */
	init: function(request, response, requestHeaders) {
    this.requestObject=request;
    this.reponseObject=response;
    this._request=new Mura.Request(request, response, requestHeaders);
    return this;
	},

  /**
   * setRequestHeader - Initialiazes feed
   *
   * @param  {string} headerName  Name of header
   * @param  {string} value Header value
   * @return {Mura.RequestContext}            Self
   */
  setRequestHeader:function(headerName,value){
    this._request.setRequestHeader(headerName,value);
    return this;
  },

  /**
   * getRequestHeader - Returns a request header value
   *
   * @param  {string} headerName  Name of header
   * @return {string} header Value
   */
  getRequestHeader:function(headerName){
    return this._request.getRequestHeader(headerName);
  },

  /**
   * getRequestHeaders - Returns a request header value
   *
   * @return {object} All Headers
   */
  getRequestHeaders:function(){
    return this._request.getRequestHeaders();
  },

  /**
   * request - Executes a request
   *
   * @param  {object} params     Object
   * @return {Promise}            Self
   */
  request:function(params){
    return this._request.execute(params);
  },

  /**
   * renderFilename - Returns "Rendered" JSON object of content
   *
   * @param  {type} filename Mura content filename
   * @param  {type} params Object
   * @return {Promise}
   * @memberof Mura
   */
  renderFilename:function(filename, params) {

      var query = [];
      var self=this;

      params = params || {};
      params.filename = params.filename || '';
      params.siteid = params.siteid || Mura.siteid;

      for (var key in params) {
          if (key != 'entityname' && key != 'filename' && key !=
              'siteid' && key != 'method') {
              query.push(encodeURIComponent(key) + '=' +
                  encodeURIComponent(params[key]));
          }
      }

      return new Promise(function(resolve, reject) {
          self.request({
              async: true,
              type: 'get',
              url: Mura.apiEndpoint +
                  '/content/_path/' + filename + '?' +
                  query.join('&'),
              success: function(resp) {
                  if (typeof resolve ==
                      'function') {
                      var item = new Mura.Entity({},self);
                      item.set(resp.data);
                      resolve(item);
                  }
              }
            }
          );
      });

  },

  /**
   * getEntity - Returns Mura.Entity instance
   *
   * @param  {string} entityname Entity Name
   * @param  {string} siteid     Siteid
   * @return {Mura.Entity}
   * @memberof Mura
   */
  getEntity:function(entityname, siteid) {
      if (typeof entityname == 'string') {
          var properties = {
              entityname: entityname
          };
          properties.siteid = siteid || Mura.siteid;
      } else {
          properties = entityname;
          properties.entityname = properties.entityname || 'content';
          properties.siteid = properties.siteid || Mura.siteid;
      }

      if (Mura.entities[properties.entityname]) {
          var entity=new Mura.entities[properties.entityname](properties,this);
          return entity;
      } else {
          var entity=new Mura.Entity(properties,this);
          return entity;
      }
  },

  /**
   * getFeed - Return new instance of Mura.Feed
   *
   * @param  {type} entityname Entity name
   * @return {Mura.Feed}
   * @memberof Mura
   */
  getFeed:function(entityname) {
      var feed=new Mura.Feed(Mura.siteid, entityname, this);
      return feed;
  },

  /**
   * getCurrentUser - Return Mura.Entity for current user
   *
   * @param  {object} params Load parameters, fields:listoffields
   * @return {Promise}
   * @memberof Mura
   */
  getCurrentUser:function(params) {
      var self=this;

      params=params || {};
      params.fields=params.fields || '';
      return new Promise(function(resolve, reject) {

          if (Mura.currentUser) {
              return Mura.currentUser;
          } else {
              self.request({
                  async: true,
                  type: 'get',
                  url: Mura.apiEndpoint +
                      'findCurrentUser?fields=' + params.fields + '&_cacheid=' +
                      Math.random(),
                  success: function(resp) {
                      if (typeof resolve ==
                          'function') {
                          Mura.currentUser = self.getEntity('user');
                          Mura.currentUser.set(resp.data);
                          resolve(Mura.currentUser);
                      }
                  },
                  success: function(resp) {
                      if (typeof resolve ==
                          'function') {
                          Mura.currentUser=self.getEntity('user')
                          Mura.currentUser.set( resp.data);
                          resolve(Mura.currentUser);
                      }
                  }
              });
          }
      });
  },

  /**
   * findQuery - Returns Mura.EntityCollection with properties that match params
   *
   * @param  {object} params Object of matching params
   * @return {Promise}
   * @memberof Mura
   */
  findQuery:function(params) {
      var self=this;

      params = params || {};
      params.entityname = params.entityname || 'content';
      params.siteid = params.siteid || Mura.siteid;
      params.method = params.method || 'findQuery';
      params['_cacheid'] == Math.random();

      return new Promise(function(resolve, reject) {

          self.request({
              type: 'get',
              url: Mura.apiEndpoint,
              data: params,
              success: function(resp) {
                  var collection = new Mura.EntityCollection(resp.data,self)

                  if (typeof resolve == 'function') {
                      resolve(collection);
                  }
              },
              error:function(resp){
                console.log(resp);
              }
          });
      });
  },

  /**
   * login - Logs user into Mura
   *
   * @param  {string} username Username
   * @param  {string} password Password
   * @param  {string} siteid   Siteid
   * @return {Promise}
   * @memberof Mura
   */
  login:function(username, password, siteid) {
      siteid = siteid || Mura.siteid;

      var self=this;

      return new Promise(function(resolve, reject) {

          self.request({
              type: 'post',
              url: Mura.apiEndpoint +
                  '?method=generateCSRFTokens',
              data: {
                  siteid: siteid,
                  context: 'login'
              },
              success: function(resp) {
                  self.request({
                      async: true,
                      type: 'post',
                      url: Mura.apiEndpoint,
                      data: {
                          siteid: siteid,
                          username: username,
                          password: password,
                          method: 'login',
                          'csrf_token': resp.data.csrf_token,
                          'csrf_token_expires': resp.data.csrf_token_expires
                      },
                      success: function(resp) {
                          resolve(resp.data);
                      }
                  });
              }
          });

      });

  },

  /**
   * logout - Logs user out
   *
   * @param  {type} siteid Siteid
   * @return {Promise}
   * @memberof Mura
   */
  logout:function(siteid) {
      siteid = siteid || Mura.siteid;

      var self=this;

      return new Promise(function(resolve, reject) {
          self.request({
              async: true,
              type: 'post',
              url: Mura.apiEndpoint,
              data: {
                  siteid: siteid,
                  method: 'logout'
              },
              success: function(resp) {
                  resolve(resp.data);
              }
          });
      });

  },

  /**
   * get - Make GET request
   *
   * @param  {url} url  URL
   * @param  {object} data Data to send to url
   * @return {Promise}
   * @memberof Mura
   */
  get:function(url, data) {
      var self=this;

      data = data || {};
      return new Promise(function(resolve, reject) {
          return self.request({
              type: 'get',
              url: url,
              data: data,
              success: function(resp) {
                  resolve(resp);
              },
              error: function(resp) {
                  reject(resp);
              }
          });
      });

  },

  /**
   * post - Make POST request
   *
   * @param  {url} url  URL
   * @param  {object} data Data to send to url
   * @return {Promise}
   * @memberof Mura
   */
  post:function(url, data) {
      var self=this;

      data = data || {};
      return new Promise(function(resolve, reject) {
          return self.request({
              type: 'post',
              url: url,
              data: data,
              success: function(resp) {
                  resolve(resp);
              },
              error: function(resp) {
                  reject(resp);
              }
          });
      });

  },

  /**
   * Request Headers
  **/
  requestHeaders:{}

});
