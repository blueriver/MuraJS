var Mura=require('./core');
/**
 * Creates a new Mura.UI.Text
 * @name  Mura.UI.Image
 * @class
 * @extends Mura.UI
 * @memberof  Mura
 */

Mura.UI.Image=Mura.UI.extend(
/** @lends Mura.DisplayObject.Image.prototype */
{
	renderClient:function(){
		Mura(this.context.targetEl).html(Mura.templates['image'](this.context));
		this.trigger('afterRender');
	},

	renderServer:function(){
		return Mura.templates['image'](this.context);
	
	}
});

Mura.DisplayObject.Image=Mura.UI.Image;
