
var Mura=require('./core');

/**
* Creates a new Mura.entities.Content
* @name Mura.entities.Content
* @class
* @extends Mura.Entity
* @memberof Mura
* @param	{object} properties Object containing values to set into object
* @return {Mura.Entity}
*/

Mura.entities.Content = Mura.Entity.extend(
/** @lends Mura.entities.Content.prototype */
{
	/**
	 * hasParent - Returns true if content has a parent.
	 *
	 * @return {boolean}
	 */
	hasParent:function(){
		var parentid=this.get('parentid');
		if(!parentid || ['00000000000000000000000000000000END','00000000000000000000000000000000003','00000000000000000000000000000000004','00000000000000000000000000000000099'].find(function(value){return value===parentid})){
			return false;
		} else {
			return true;
		}
	},

	/**
	 * renderDisplayRegion - Returns a string with display region markup.
	 *
	 * @return {string}
	 */
	renderDisplayRegion:function(region){
		return Mura.buildDisplayRegion(this.get('displayregions')[region])
	},

	/**
	 * dspRegion - Appends a display region to a element.
	 *
	 * @return {self}
	 */
	dspRegion:function(selector,region,label){
		if(Mura.isNumeric(region) && region <= this.get('displayregionnames').length){
			region=this.get('displayregionnames')[region-1];
		}
		Mura(selector).processDisplayRegion(this.get('displayregions')[region],label);
		return this;
	},

	/**
	 * getRelatedContent - Gets related content sets by name
	 *
	 * @param	{string} relatedContentSetName
	 * @param	{object} params
	 * @return {Mura.EntityCollection}
	 */
	getRelatedContent:function(relatedContentSetName,params){
		var self=this;

		relatedContentSetName=relatedContentSetName || '';
		
		return new Promise(function(resolve,reject) {
			var query = [];
			params = params || {};
			params.siteid = self.get('siteid') || Mura.siteid;
			for (var key in params) {
				if (key != 'entityname' && key != 'filename' && key != 'siteid' && key != 'method') {
					query.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]));
				}
			}
			self._requestcontext.request({
				type: 'get',
				url: Mura.apiEndpoint +
					'/content/' + self.get('contentid') + '/relatedcontent/' + relatedContentSetName + '?' +
					query.join('&'),
				params: params,
				success: function(resp) {
					var returnObj = new Mura.EntityCollection(resp.data,self._requestcontext);

					if (typeof resolve == 'function') {
						resolve(returnObj);
					}
				},
				error: reject
			});
		});
	}
});
