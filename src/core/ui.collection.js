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
	renderClient:function(){
		this.context.targetEl.innerHTML=this.context.html;
		this.trigger('afterRender');
	},

	renderServer:function(){
		this.context.html=this.html || '';
		return this.context.html;
	}
});

Mura.DisplayObject.Collection=Mura.UI.Collection;
