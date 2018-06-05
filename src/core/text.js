var Mura=require('./core');
/**
 * Creates a new Mura.DisplayObject.Text
 * @name  Mura.DisplayObject.Text
 * @class
 * @extends Mura.UI
 * @memberof  Mura
 */

Mura.DisplayObject.Text=Mura.UI.extend(
/** @lends Mura.DisplayObject.Text.prototype */
{
	render:function(){
		this.context.targetEl.innerHTML=Mura.templates['text'](this.context);
		this.trigger('afterRender');
	}
});
