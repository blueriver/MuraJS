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
	renderClient:function(){
		this.context.targetEl.innerHTML=Mura.templates['text'](this.context);
		this.trigger('afterRender');
	},

	renderServer:function(){
		this.context.sourcetype=this.context.sourcetype || 'custom';

		if(this.context.sourcetype=='custom'){
			return Mura.templates['text'](this.context);
		} else {
			return '';
		}
	}
});
