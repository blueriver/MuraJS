var Mura=require('./core');

Mura.ServerUtils={};

Mura.ServerUtils.buildDisplayObject=async function(template, params){
	params = Object.assign({},params);
	return (
		async ()=> {
				return (()=> new Promise((resolve,reject)=>{
						resolve(new Mura.DisplayObject[template](params).renderServer())
					}
				)) ().then(str=>str)
		}
	)()
}

Mura.ServerUtils.buildDisplayRegion=async function(data){
	if(typeof data == 'undefined'){
		return '';
	}
	if(Mura.isInNode()){
		if(typeof data.inherited != 'undefined'){
			for(var i in data.inherited.items){
				var template=data.inherited.items[i].clienttemplate || data.inherited.items[i].object;
				var properNameCheck = Mura.firstToUpperCase(template);
				if (typeof Mura.DisplayObject[properNameCheck] != 'undefined') {
					template = properNameCheck;
				}
				if(typeof Mura.DisplayObject[template] != 'undefined') {
					data.inherited.items[i].html=await Mura.ServerUtils.buildDisplayObject(template,data.inherited.items[i])
					if(data.inherited.items[i].html){
						data.inherited.items[i].html= Mura.templates['meta'](data.inherited.items[i]) + Mura.templates['content']({html:data.inherited.items[i].html})
					}

				}
			}
		}
		if(typeof data.local != 'undefined'){
			for(var i in data.local.items){
				var template=data.local.items[i].clienttemplate || data.local.items[i].object;
				var properNameCheck = Mura.firstToUpperCase(template);
				if (typeof Mura.DisplayObject[properNameCheck] != 'undefined') {
					template = properNameCheck;
				}
				if(typeof Mura.DisplayObject[template] != 'undefined') {
					data.local.items[i].html=await Mura.ServerUtils.buildDisplayObject(template,data.local.items[i])
					if(data.local.items[i].html){
						data.local.items[i].html= Mura.templates['meta'](data.local.items[i]) + Mura.templates['content']({html:data.local.items[i].html})
					}

				}
			}
		}
	}
	return await Mura.buildDisplayRegion(data);
}


Mura.entities.Content=Mura.entities.Content.extend({
	renderDisplayRegion:async function(region){
		return await Mura.ServerUtils.buildDisplayRegion(this.get('displayregions')[region])
	}
})
