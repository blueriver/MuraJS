const React=require('react')
const ReactDOM=require('react-dom')
var Mura=require('mura.js');
const ReactDOMServer = require('react-dom/server');

require('./ui.react')
require('./ui.serverutils')

/**
 * Creates a new Mura.UI.ReactServer
 * @name  Mura.UI.ReactServer
 * @class
 * @extends Mura.UI.React
 * @memberof  Mura
 */

Mura.UI.ReactServer=Mura.UI.React.extend(
/** @lends Mura.UI.ReactServer.prototype */
{
	renderServer:function(){
		return ReactDOMServer.renderToString(React.createElement(this.component, this.context))
	},

	hydrate:function(){
		this.context.suppressHydrationWarning=true
		ReactDOM.hydrate(
			React.createElement(this.component, this.context),
			this.context.targetEl,
			()=>{this.trigger('afterRender')}
		)
	}
});
