
var Mura=require('./core');

/**
* Creates a new Mura.entities.Content
* @name Mura.entities.Content
* @class
* @extends Mura.Entity
* @memberof Mura
* @param  {object} properties Object containing values to set into object
* @return {Mura.Entity}
*/

Mura.entities.Content = Mura.Entity.extend(
/** @lends Mura.entities.Content.prototype */
{
  /**
   * getRelatedContent - Gets related content sets by name
   *
   * @param  {string} relatedContentSetName
   * @param  {object} params
   * @return {Mura.EntityCollection}
   */
  getRelatedContent:function(relatedContentSetName,params){
    return new Promise(function(resolve,
        reject) {

        var query = [];
        var self=this;

        params = params || {};
        params.siteid = get('siteid') || Mura.siteid;

        for (var key in params) {
            if (key != 'entityname' && key != 'filename' && key !=
                'siteid' && key != 'method') {
                query.push(encodeURIComponent(key) + '=' +
                    encodeURIComponent(params[key]));
            }
        }

        self._requestcontext.request({
            type: 'get',
            url: Mura.apiEndpoint +
                '/content/' + get('contentid') + '/' + relatedContentSetName + '?' +
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
