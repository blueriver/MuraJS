var Mura=require('./core');
/**
 * Creates a new Mura.UI.Collection
 * @name  Mura.UI.Collection
 * @class
 * @extends Mura.UI
 * @memberof  Mura
 */

Mura.UI.Collection=Mura.UI.extend(
/** @lends Mura.UI.Collection.prototype */
{

	layoutInstance:'',

	getLayoutInstance:function(){
		if(this.layoutInstance){
			this.layoutInstance.destroy();
		}
		this.layoutInstance=new Mura.Module[this.context.layout](this.context);
		return this.layoutInstance;
	},

	getCollection:function(){
		this.context.source=this.context.source || '';

		if(typeof this.context.nextn != 'undefined'){
			this.context.itemsperpage=this.context.nextn;
		}

		if(typeof this.context.maxitems == 'undefined'){
			this.context.maxitems=20;
		}

		if(typeof this.context.itemsperpage != 'undefined'){
			this.context.itemsperpage=this.context.maxitems;
		}

		if(this.context.sourcetype=='relatedcontent'){
			if(this.context.source=='custom'){
				if(typeof this.context.items == 'array'){
					this.context.items=this.context.items.join();
				}
				return Mura.get(Mura.apiEndpoint + '/?entityname=content&method=findMany&id=' + this.context.items,{
					itemsperpage:this.context.itemsperpage,
					maxitems:this.context.maxitems
				}).then((response)=>{
					return new Promise(function(resolve,reject) {
							resolve(new Mura.EntityCollection(resp.data,self._requestcontext));
					})
				});
			} else if(this.context.source=='reverse'){
				return Mura.getEntity('content')
					.set({
						'contentid':Mura.contentid,
						'id':Mura.contentid
					}).getRelatedContent('reverse',{
						itemsperpage:this.context.itemsperpage,
						maxitems:this.context.maxitems,
						sortby:this.context.sortby
					})
			} else {
				return Mura.getEntity('content')
					.set({
						'contentid':Mura.contentid,
						'id':Mura.contentid
					}).getRelatedContent(this.context.source,{
						itemsperpage:this.context.itemsperpage,
						maxitems:this.context.maxitems
					})
			}
		} else {
			return Mura.getFeed('content')
					.where()
					.prop('feedid').isEQ(this.context.source)
					.maxItems(this.context.maxitems)
					.itemsPerPage(this.context.itemsperpage)
					.getQuery();
		}
	},

	renderClient:function(){
		if (typeof Mura.Module[this.context.layout] != 'undefined'){
			this.getCollection().then((collection)=>{
				this.context.collection=collection;
				this.getLayoutInstance().renderClient();
			})
		} else {
			this.context.targetEl.innerHTML="This collection has an undefined layout";
		}
		this.trigger('afterRender');
	},

	renderServer:function(){
		if(this.context.html){
			return this.context.html;
		} else if (typeof Mura.Module[this.layout] != 'undefined'){
			return (async ()=>{
				return await (()=>{
					this.context.collection=this.getCollection();
					return this.getLayoutInstance().renderServer();
				})()
			})()
		} else {
			return "This collection has an undefined layout";
		}
	}
});

Mura.DisplayObject.Collection=Mura.UI.Collection;
