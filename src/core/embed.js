var Mura=require('./core');
/**
 * Creates a new Mura.DisplayObject.Embed
 * @name  Mura.DisplayObject.Embed
 * @class
 * @extends Mura.UI
 * @memberof  Mura
 */

Mura.DisplayObject.Embed=Mura.UI.extend(
/** @lends Mura.DisplayObject.Embed.prototype */
{
	render:function(){
		this.context.targetEl.innerHTML=Mura.templates['embed'](this.context);
		this.trigger('afterRender');
	}
});
