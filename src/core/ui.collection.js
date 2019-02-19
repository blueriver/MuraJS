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
	defaultLayout: "List",

	layoutInstance:'',

	getLayoutInstance:function(){
		if(this.layoutInstance){
			this.layoutInstance.destroy();
		}
		this.layoutInstance=new Mura.Module[this.context.layout](this.context);
		return this.layoutInstance;
	},

	getCollection:function(){
		var self=this;
		if(typeof this.context.feed != 'undefined' && typeof this.context.feed.getQuery != 'undefined'){
			return this.context.feed.getQuery();
		} else {
			this.context.source=this.context.source || '';

			if(typeof this.context.nextn != 'undefined'){
				this.context.itemsperpage=this.context.nextn;
			}

			if(typeof this.context.maxitems == 'undefined'){
				this.context.maxitems=20;
			}

			if(typeof this.context.itemsperpage != 'undefined'){
				this.context.itemsperpage=this.context.nextn;
			}

			if(typeof this.context.expand == 'undefined'){
				this.context.expand='';
			}

			if(typeof this.context.expanddepth == 'undefined'){
				this.context.expanddepth=1;
			}

			if(typeof this.context.fields == 'undefined'){
				this.context.fields='';
			}

			if(typeof this.context.rawcollection != 'undefined'){
				return new Promise(function(resolve,reject){
					resolve(new Mura.EntityCollection(self.context.rawcollection,Mura._requestcontext))
				});
			} else if(this.context.sourcetype=='relatedcontent'){
				if(this.context.source=='custom'){
					if(typeof this.context.items != 'undefined'){
						this.context.items=this.context.items.join();
					}
					return Mura.get(Mura.apiEndpoint + 'content/' + this.context.items + ',_',{
						itemsperpage:this.context.itemsperpage,
						maxitems:this.context.maxitems,
						expand:this.context.expand,
						expanddepth:this.context.expanddepth,
						fields:this.context.fields
					}).then(function(resp){
						return new Mura.EntityCollection(resp.data,Mura._requestcontext);
					});
				} else if(this.context.source=='reverse'){
					return Mura.getEntity('content')
						.set({
							'contentid':Mura.contentid,
							'id':Mura.contentid
						}).getRelatedContent('reverse',{
							itemsperpage:this.context.itemsperpage,
							maxitems:this.context.maxitems,
							sortby:this.context.sortby,
							expand:this.context.expand,
							expanddepth:this.context.expanddepth,
							fields:this.context.fields
						})
				} else {
					return Mura.getEntity('content')
						.set({
							'contentid':Mura.contentid,
							'id':Mura.contentid
						}).getRelatedContent(this.context.source,{
							itemsperpage:this.context.itemsperpage,
							maxitems:this.context.maxitems,
							expand:this.context.expand,
							expanddepth:this.context.expanddepth,
							fields:this.context.fields
						})
				}
			} else if(this.context.sourcetype=='children'){
				return Mura.getFeed('content')
					.where()
					.prop('parentid').isEQ(Mura.contentid)
					.maxItems(100)
					.itemsPerPage(this.context.itemsperpage)
					.expand(this.context.expand)
					.expandDepth(this.context.expanddepth)
					.fields(this.context.fields)
					.getQuery();
			} else {
				return Mura.getFeed('content')
					.where()
					.prop('feedid').isEQ(this.context.source)
					.maxItems(this.context.maxitems)
					.itemsPerPage(this.context.itemsperpage)
					.expand(this.context.expand)
					.expandDepth(this.context.expand)
					.fields(this.context.fields)
					.getQuery();
			}
		}
	},

	renderClient:function(){
		if(typeof Mura.Module[this.context.layout] == 'undefined'){
			this.context.layout=Mura.firstToUpperCase(this.context.layout);
		}
		if(typeof Mura.Module[this.context.layout] == 'undefined'
	 		&& Mura.Module[this.defaultLayout] != 'undefined'){
				this.context.layout=this.defaultLayout;
		}
		var self=this;
		if (typeof Mura.Module[this.context.layout] != 'undefined'){
			this.getCollection().then(function(collection){
				self.context.collection=collection;
				self.getLayoutInstance().renderClient();
			})
		} else {
			this.context.targetEl.innerHTML="This collection has an undefined layout";
		}
		this.trigger('afterRender');
	},

	renderServer:function(){
		//has implementation in ui.serverutils
		return '';
	},

	destroy:function(){
		//has implementation in ui.serverutils
		if(this.layoutInstance){
			this.layoutInstance.destroy();
		}
	}

});

Mura.Module.Collection=Mura.UI.Collection;
