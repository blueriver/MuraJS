
var Mura=require('./core');

/**
* Creates a new Mura.Entity
* @class {class} Mura.Entity
*/

Mura.entities.Content = Mura.Entity.extend(
/** @lends Mura.Entity.prototype */
{
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
                var returnObj = new Mura.EntityCollection(resp.data);
                    returnObj._requestcontext=self._requestcontext;

                if (typeof resolve == 'function') {
                    resolve(returnObj);
                }
            },
            error: reject
        });
    });

  }


});
