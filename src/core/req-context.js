
var Mura=require('./core');

/**
* Creates a new Mura.RequestContext
* @name	Mura.RequestContext
* @class
* @extends Mura.Core
* @memberof Mura
* @param	{object} request		 Siteid
* @param	{object} response Entity name
* @param	{object} requestHeaders Optional
* @return {Mura.RequestContext} Self
*/

Mura.RequestContext=Mura.Core.extend(
/** @lends Mura.RequestContext.prototype */
{
	init: function(request, response, requestHeaders) {
		this.requestObject=request;
		this.responseObject=response;
		this._request=new Mura.Request(request, response, requestHeaders);
		return this;
	},

	/**
	 * setRequestHeader - Initialiazes feed
	 *
	 * @param	{string} headerName	Name of header
	 * @param	{string} value Header value
	 * @return {Mura.RequestContext}	Self
	 */
	setRequestHeader:function(headerName,value){
		this._request.setRequestHeader(headerName,value);
		return this;
	},

	/**
	 * getRequestHeader - Returns a request header value
	 *
	 * @param	{string} headerName	Name of header
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
	 * @param	{object} params		 Object
	 * @return {Promise}						Self
	 */
	request:function(params){
		return this._request.execute(params);
	},

	/**
	 * renderFilename - Returns "Rendered" JSON object of content
	 *
	 * @param	{type} filename Mura content filename
	 * @param	{type} params Object
	 * @return {Promise}
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
				query.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]));
			}
		}

		return new Promise(function(resolve, reject) {
			self.request({
				async: true,
				type: 'get',
				url: Mura.apiEndpoint + '/content/_path/' + filename + '?' + query.join('&'),
				success: function(resp) {
					if (resp != null && typeof location != 'undefined' && typeof resp.data != 'undefined' && typeof resp.data.redirect != 'undefined' && typeof resp.data.contentid == 'undefined') {
						if (resp.data.redirect && resp.data.redirect != location.href) {
							location.href = resp.data.redirect;
						} else {
							location.reload(true);
						}
					} else {
						var item = new Mura.entities.Content({},self);
						item.set(resp.data);
						resolve(item);
					}
				},
				error: function(resp) {
					if (resp != null && typeof resp.data != 'undefined' && typeof resp.data != 'undefined' && typeof resolve == 'function') {
						var item = new Mura.Entity({},self);
						item.set(resp.data);
						resolve(item);
					} else if (typeof reject == 'function') {
						reject(resp);
					}
				}
			});
		});
	},

	/**
	 * getEntity - Returns Mura.Entity instance
	 *
	 * @param	{string} entityname Entity Name
	 * @param	{string} siteid		 Siteid
	 * @return {Mura.Entity}
	 */
	getEntity:function(entityname, siteid) {
		if (typeof entityname == 'string') {
			var properties = {
				entityname: entityname.substr(0, 1).toUpperCase() + entityname.substr(1)
			};
			properties.siteid = siteid || Mura.siteid;
		} else {
			properties = entityname;
			properties.entityname = properties.entityname || 'Content';
			properties.siteid = properties.siteid || Mura.siteid;
		}

		properties.links={
			permissions:Mura.apiEndpoint + properties.entityname + "/permissions"
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
	 * declareEntity - Declare Entity with in service factory
	 *
	 * @param	{object} entityConfig Entity config object
	 * @return {Promise}
	 */
	declareEntity:function(entityConfig) {
		var self=this;
		if(Mura.mode.toLowerCase() == 'rest'){
			return new Promise(function(resolve, reject) {
				self.request({
					async: true,
					type: 'POST',
					url: Mura.apiEndpoint,
					data:{
						method: 'declareEntity',
						entityConfig: encodeURIComponent(JSON.stringify(entityConfig))
					},
					success: function(resp) {
						if (typeof resolve =='function' && resp != null && typeof resp.data != 'undefined') {
							resolve(resp.data);
						} else if (typeof reject =='function' && resp != null && typeof resp.error != 'undefined') {
							resolve(resp);
						} else if (typeof resolve =='function'){
							resolve(resp);
						}
					}
				});
			});
		} else {
			return new Promise(function(resolve, reject) {
				self.request({
					type: 'POST',
					url: Mura.apiEndpoint + '?method=generateCSRFTokens',
					data: {context: ''},
					success: function(resp) {
						self.request({
							async: true,
							type: 'POST',
							url: Mura.apiEndpoint,
							data:{
								method: 'declareEntity',
								entityConfig: encodeURIComponent(JSON.stringify(entityConfig)),
								'csrf_token': resp.data.csrf_token,
								'csrf_token_expires': resp.data.csrf_token_expires
							},
							success: function(resp) {
								if (typeof resolve =='function' && resp != null && typeof resp.data != 'undefined') {
									resolve(resp.data);
								} else if (typeof reject =='function' && resp != null && typeof resp.error != 'undefined') {
									resolve(resp);
								} else if (typeof resolve =='function'){
									resolve(resp);
								}
							}
						});
					}
				});
			});
		}
	},

	/**
	 * undeclareEntity - Delete entity class from Mura
	 *
	 * @param	{object} entityName
	 * @return {Promise}
	 */
	undeclareEntity:function(entityName,deleteSchema) {
		var self=this;
		deleteSchema=deleteSchema || false;
		if(Mura.mode.toLowerCase() == 'rest'){
			return new Promise(function(resolve, reject) {
				self.request({
					async: true,
					type: 'POST',
					url: Mura.apiEndpoint,
					data:{
						method: 'undeclareEntity',
						entityName: entityName,
						deleteSchema : deleteSchema
					},
					success: function(resp) {
						if (typeof resolve =='function' && resp != null && typeof resp.data != 'undefined') {
							resolve(resp.data);
						} else if (typeof reject =='function' && resp != null && typeof resp.error != 'undefined') {
							resolve(resp);
						} else if (typeof resolve =='function'){
							resolve(resp);
						}
					}
				});
			});
		} else {
			return new Promise(function(resolve, reject) {
				self.request({
					type: 'POST',
					url: Mura.apiEndpoint + '?method=generateCSRFTokens',
					data: {context: ''},
					success: function(resp) {
						self.request({
							async: true,
							type: 'POST',
							url: Mura.apiEndpoint,
							data:{
								method: 'undeclareEntity',
								entityName: entityName,
								deleteSchema : deleteSchema,
								'csrf_token': resp.data.csrf_token,
								'csrf_token_expires': resp.data.csrf_token_expires
							},
							success: function(resp) {
								if (typeof resolve =='function' && resp != null && typeof resp.data != 'undefined') {
									resolve(resp.data);
								} else if (typeof reject =='function' && resp != null && typeof resp.error != 'undefined') {
									resolve(resp);
								} else if (typeof resolve =='function'){
									resolve(resp);
								}
							}
						});
					}
				});
			});
		}
	},

	/**
	 * getFeed - Return new instance of Mura.Feed
	 *
	 * @param	{type} entityname Entity name
	 * @return {Mura.Feed}
	 */
	getFeed:function(entityname,siteid) {
			siteid=siteid || Mura.siteid;
			var feed=new Mura.Feed(siteid, entityname, this);
			return feed;
	},

	/**
	 * getCurrentUser - Return Mura.Entity for current user
	 *
	 * @param	{object} params Load parameters, fields:listoffields
	 * @return {Promise}
	 */
	getCurrentUser:function(params) {
			var self=this;
			params=params || {};
			params.fields=params.fields || '';
			return new Promise(function(resolve, reject) {
				if (Mura.currentUser) {
					resolve(Mura.currentUser);
				} else {
					self.request({
						async: true,
						type: 'get',
						url: Mura.apiEndpoint +
							'findCurrentUser?fields=' + params.fields + '&_cacheid=' +
							Math.random(),
						success: function(resp) {
							if (typeof resolve =='function') {
								Mura.currentUser = self.getEntity('user');
								Mura.currentUser.set(resp.data);
								resolve(Mura.currentUser);
							}
						},
						error: function(resp) {
							if (typeof resolve =='function') {
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
	 * @param	{object} params Object of matching params
	 * @return {Promise}
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
	 * @param	{string} username Username
	 * @param	{string} password Password
	 * @param	{string} siteid	 Siteid
	 * @return {Promise}
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
	* openGate - Open's content gate when using MXP
	*
	* @param	{string} contentid Optional: default's to Mura.contentid
	* @return {Promise}
	* @memberof {class
	*/
	openGate:function(contentid) {
		var self=this;
		contentid=contentid || Mura.contentid;
		if(contentid){
			if(Mura.mode.toLowerCase() == 'rest'){
				return new Promise(function(resolve, reject) {
					self.request({
						async: true,
						type: 'POST',
						url: Mura.apiEndpoint + '/gatedasset/open',
						data:{
							contentid: contentid
						},
						success: function(resp) {
							if (typeof resolve =='function' && typeof resp.data != 'undefined') {
								resolve(resp.data);
							} else if (typeof reject =='function' && typeof resp.error != 'undefined') {
								resolve(resp);
							} else if (typeof resolve =='function'){
								resolve(resp);
							}
						}
					});
				});
			} else {
				return new Promise(function(resolve, reject) {
					self.request({
						type: 'POST',
						url: Mura.apiEndpoint + '?method=generateCSRFTokens',
						data: {context: contentid},
						success: function(resp) {
							self.request({
								async: true,
								type: 'POST',
								url: Mura.apiEndpoint + '/gatedasset/open',
								data:{
									contentid: contentid
								},
								success: function(resp) {
									if (typeof resolve =='function' && typeof resp.data != 'undefined') {
										resolve(resp.data);
									} else if (typeof reject =='function' && typeof resp.error != 'undefined') {
										resolve(resp);
									} else if (typeof resolve =='function'){
										resolve(resp);
									}
								}
							});
						}
					});
				});
			}
		}
	},

	/**
	 * logout - Logs user out
	 *
	 * @param	{type} siteid Siteid
	 * @return {Promise}
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
	 * @param	{url} url	URL
	 * @param	{object} data Data to send to url
	 * @return {Promise}
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
	 * @param	{url} url	URL
	 * @param	{object} data Data to send to url
	 * @return {Promise}
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
