var Mura=require('./core');
/**
 * Creates a new Mura.UI.Embed
 * @name  Mura.UI.Embed
 * @class
 * @extends Mura.UI
 * @memberof  Mura
 */

Mura.UI.Embed=Mura.UI.extend(
/** @lends Mura.DisplayObject.Embed.prototype */
{
	renderClient:function(){
		this.context.targetEl.innerHTML=Mura.templates['embed'](this.context);
		this.trigger('afterRender');
	},

	renderServer:function(){
		return Mura.templates['embed'](this.context);
	}
});

Mura.DisplayObject.Embed=Mura.UI.Embed;
