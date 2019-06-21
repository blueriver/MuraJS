
var Mura=require('./core');

/**
 * Creates a new Mura.DOMSelection
 * @name	Mura.DOMSelection
 * @class
 * @param	{object} properties Object containing values to set into object
 * @return {Mura.DOMSelection}
 * @extends Mura.Core
 * @memberof Mura
 */

 /**
	* @ignore
	*/

Mura.DOMSelection = Mura.Core.extend(
	/** @lends Mura.DOMSelection.prototype */
	{

		init: function(selection, origSelector) {
			this.selection = selection;
			this.origSelector = origSelector;

			if (this.selection.length && this.selection[0]) {
				this.parentNode = this.selection[0].parentNode;
				this.childNodes = this.selection[0].childNodes;
				this.node = selection[0];
				this.length = this.selection.length;
			} else {
				this.parentNode = null;
				this.childNodes = null;
				this.node = null;
				this.length = 0;
			}

			if(typeof Mura.supportPassive == 'undefined'){
				Mura.supportsPassive = false;
				try {
					var opts = Object.defineProperty({}, 'passive', {
						get: function() {
						  Mura.supportsPassive = true;
						}
					});
					window.addEventListener("testPassive", null, opts);
					window.removeEventListener("testPassive", null, opts);
				} catch (e) {}
			}
		},

	/**
	 * get - Deprecated: Returns element at index of selection, use item()
	 *
	 * @param	{number} index Index of selection
	 * @return {*}
	 */
	get: function(index) {
		if(typeof index != 'undefined'){
			return this.selection[index];
		} else {
			return this.selection;
		}
	},

	/**
	 * select - Returns new Mura.DomSelection
	 *
	 * @param	{string} selector Selector
	 * @return {object}
	 */
	select: function(selector) {
		return Mura(selector);
	},

	/**
	 * each - Runs function against each item in selection
	 *
	 * @param	{function} fn Method
	 * @return {Mura.DOMSelection} Self
	 */
	each: function(fn) {
		this.selection.forEach(function(el, idx, array) {
			if(typeof fn.call == 'undefined'){
				fn(el, idx, array);
			} else {
				fn.call(el, el, idx, array);
			}
		});
		return this;
	},

	/**
	 * each - Runs function against each item in selection
	 *
	 * @param	{function} fn Method
	 * @return {Mura.DOMSelection} Self
	 */
	forEach: function(fn) {
		this.selection.forEach(function(el, idx, array) {
			if(typeof fn.call == 'undefined'){
				fn(el, idx, array);
			} else {
				fn.call(el, el, idx, array);
			}
		});
		return this;
	},

	/**
	 * filter - Creates a new Mura.DomSelection instance contains selection values that pass filter function by returning true
	 *
	 * @param	{function} fn Filter function
	 * @return {object}		New Mura.DOMSelection
	 */
	filter: function(fn) {
		return Mura(this.selection.filter(function(el,idx, array) {
			if(typeof fn.call == 'undefined'){
				return fn(el, idx,array);
			} else {
				return fn.call(el, el, idx,array);
			}
		}));
	},

	/**
	 * map - Creates a new Mura.DomSelection instance contains selection values that are returned by Map function
	 *
	 * @param	{function} fn Map function
	 * @return {object}		New Mura.DOMSelection
	 */
	map: function(fn) {
		return Mura(this.selection.map(function(el, idx, array) {
			if(typeof fn.call == 'undefined'){
				return fn(el, idx, array);
			} else {
				return fn.call(el, el, idx, array);
			}
		}));
	},

	/**
	 * reduce - Returns value from	reduce function
	 *
	 * @param	{function} fn Reduce function
	 * @param	{any} initialValue Starting accumulator value
	 * @return {accumulator}
	 */
	reduce: function(fn, initialValue) {
		initialValue = initialValue || 0;
		return this.selection.reduce(
			function(accumulator, item, idx, array) {
				if(typeof fn.call == 'undefined'){
					return fn(accumulator,item, idx, array);
				} else {
					return fn.call(item, accumulator,item, idx, array);
				}
			},
			initialValue
		);
	},

	/**
	 * isNumeric - Returns if value is numeric
	 *
	 * @param	{*} val Value
	 * @return {type}		 description
	 */
	isNumeric: function(val) {
		if (typeof val != 'undefined') {
			return isNumeric(val);
		}
		return isNumeric(this.selection[0]);
	},

	/**
	 * processMarkup - Process Markup of selected dom elements
	 *
	 * @return {Promise}
	 */
	processMarkup: function() {
		var self = this;
		return new Promise(function(resolve, reject) {
			self.each(function(el) {
				Mura.processMarkup(el);
			});
		});
	},

	/**
	 * addEventHandler - Add event event handling object
	 *
	 * @param	{string} selector	Selector (optional: for use with delegated events)
	 * @param	{object} handler				description
	 * @return {Mura.DOMSelection} Self
	 */
	addEventHandler:function(selector, handler){
		if (typeof handler == 'undefined') {
			handler = selector;
			selector = '';
		}
		for (var h in handler) {
			if(eventName.hasOwnProperty(h)){
				if(typeof selector == 'string' && selector){
					on(h, selector, handler[h]);
				} else {
					on(h,handler[h]);
				}
			}
		}
		return this;
	},

	/**
	 * on - Add event handling method
	 *
	 * @param	{string} eventName Event name
	 * @param	{string} selector	Selector (optional: for use with delegated events)
	 * @param	{function} fn				description
	 * @return {Mura.DOMSelection} Self
	 */
	on: function(eventName, selector, fn, EventListenerOptions) {
		if(typeof EventListenerOptions == 'undefined'){
			if(typeof fn != 'undefined' && typeof fn != 'function'){
				EventListenerOptions=fn;
			} else {
				EventListenerOptions=true;
			}
		}
		if (typeof selector == 'function') {
			fn = selector;
			selector = '';
		}
		if (eventName == 'ready') {
			if (document.readyState != 'loading') {
				var self = this;
				setTimeout(
					function() {
						self.each(function() {
							if (selector) {
								Mura(this).find(
									selector
								).each(
									function() {
										if(typeof fn.call =='undefined'){
											fn(this);
										} else {
											fn.call(this,this);
										}
								});
							} else {
								if(typeof fn.call =='undefined'){
									fn(this);
								} else {
									fn.call(this,this);
								}
							}
						});
					},
					1
				);
				return this;
			} else {
				eventName = 'DOMContentLoaded';
			}
		}

		this.each(function() {
				if (typeof this.addEventListener ==
						'function') {
						var self = this;
						this.addEventListener(
								eventName,
								function(event) {
									if (selector) {
										if (Mura(event.target).is(selector)) {
											if(typeof fn.call == 'undefined'){
												return fn(event);
											} else {
												return fn.call(event.target,event);
											}
										}
									} else {
										if(typeof fn.call == 'undefined'){
											return fn(event);
										} else {
											return fn.call(self,event);
										}
									}
								},
								EventListenerOptions
						);
				}
		});
		return this;
	},

	/**
	 * hover - Adds hovering events to selected dom elements
	 *
	 * @param	{function} handlerIn	In method
	 * @param	{function} handlerOut Out method
	 * @return {object}						Self
	 */
	hover: function(handlerIn, handlerOut, EventListenerOptions) {
		if(typeof EventListenerOptions =='undefined' || EventListenerOptions == null){
			EventListenerOptions= Mura.supportsPassive ? { passive: true } : false;
		}
		this.on('mouseover', handlerIn, EventListenerOptions);
		this.on('mouseout', handlerOut, EventListenerOptions);
		this.on('touchstart', handlerIn, EventListenerOptions);
		this.on('touchend', handlerOut, EventListenerOptions);
		return this;
	},

	/**
	 * click - Adds onClick event handler to selection
	 *
	 * @param	{function} fn Handler function
	 * @return {Mura.DOMSelection} Self
	 */
	click: function(fn) {
		this.on('click', fn);
		return this;
	},

	/**
	 * change - Adds onChange event handler to selection
	 *
	 * @param	{function} fn Handler function
	 * @return {Mura.DOMSelection} Self
	 */
	change: function(fn) {
		this.on('change', fn);
		return this;
	},

	/**
	 * submit - Adds onSubmit event handler to selection
	 *
	 * @param	{function} fn Handler function
	 * @return {Mura.DOMSelection} Self
	 */
	submit: function(fn) {
		if (fn) {
			this.on('submit', fn);
		} else {
			this.each(function(el) {
				if (typeof el.submit == 'function') {
					Mura.submitForm(el);
				}
			});
		}
		return this;
	},

	/**
	 * ready - Adds onReady event handler to selection
	 *
	 * @param	{function} fn Handler function
	 * @return {Mura.DOMSelection} Self
	 */
	ready: function(fn) {
		this.on('ready', fn);
		return this;
	},

	/**
	 * off - Removes event handler from selection
	 *
	 * @param	{string} eventName Event name
	 * @param	{function} fn			Function to remove	(optional)
	 * @return {Mura.DOMSelection} Self
	 */
	off: function(eventName, fn) {
		this.each(function(el, idx, array) {
			if (typeof eventName != 'undefined') {
				if (typeof fn != 'undefined') {
					el.removeEventListener(eventName, fn);
				} else {
					el[eventName] = null;
				}
			} else {
				if (typeof el.parentElement !=
					'undefined' && el.parentElement &&
					typeof el.parentElement.replaceChild !=
					'undefined') {
					var elClone = el.cloneNode(true);
					el.parentElement.replaceChild(elClone, el);
					array[idx] = elClone;
				} else {
					console.log("Mura: Can not remove all handlers from element without a parent node")
				}
			}
		});
		return this;
	},

	/**
	 * unbind - Removes event handler from selection
	 *
	 * @param	{string} eventName Event name
	 * @param	{function} fn			Function to remove	(optional)
	 * @return {Mura.DOMSelection} Self
	 */
	unbind: function(eventName, fn) {
		this.off(eventName, fn);
		return this;
	},

	/**
	 * bind - Add event handling method
	 *
	 * @param	{string} eventName Event name
	 * @param	{string} selector	Selector (optional: for use with delegated events)
	 * @param	{function} fn				description
	 * @return {Mura.DOMSelection}					 Self
	 */
	bind: function(eventName, fn) {
		this.on(eventName, fn);
		return this;
	},

	/**
	 * trigger - Triggers event on selection
	 *
	 * @param	{string} eventName	 Event name
	 * @param	{object} eventDetail Event properties
	 * @return {Mura.DOMSelection}						 Self
	 */
	trigger: function(eventName, eventDetail) {
		eventDetails = eventDetail || {};
		this.each(function(el) {
			Mura.trigger(el, eventName,eventDetail);
		});
		return this;
	},

	/**
	 * parent - Return new Mura.DOMSelection of the first elements parent
	 *
	 * @return {Mura.DOMSelection}
	 */
	parent: function() {
		if (!this.selection.length) {
			return this;
		}
		return Mura(this.selection[0].parentNode);
	},

	/**
	 * children - Returns new Mura.DOMSelection or the first elements children
	 *
	 * @param	{string} selector Filter (optional)
	 * @return {Mura.DOMSelection}
	 */
	children: function(selector) {
		if (!this.selection.length) {
			return this;
		}
		if (this.selection[0].hasChildNodes()) {
			var children = Mura(this.selection[0].childNodes);
			if (typeof selector == 'string') {
				var filterFn = function() {
					return (this.nodeType === 1 || this.nodeType === 11 ||this.nodeType === 9) &&	this.matchesSelector(selector);
				};
			} else {
				var filterFn = function() {
					return this.nodeType === 1 ||	this.nodeType === 11 ||	this.nodeType === 9;
				};
			}
			return children.filter(filterFn);
		} else {
			return Mura([]);
		}
	},


	/**
	 * find - Returns new Mura.DOMSelection matching items under the first selection
	 *
	 * @param	{string} selector Selector
	 * @return {Mura.DOMSelection}
	 */
	find: function(selector) {
		if (this.selection.length && this.selection[0]) {
			var removeId = false;
			if (this.selection[0].nodeType == '1' ||
				this.selection[0].nodeType == '11') {
				var result = this.selection[0].querySelectorAll(selector);
			} else if (this.selection[0].nodeType =='9') {
				var result = document.querySelectorAll(selector);
			} else {
				var result = [];
			}
			return Mura(result);
		} else {
				return Mura([]);
		}
	},

	/**
	 * first - Returns first item in selection
	 *
	 * @return {*}
	 */
	first: function() {
		if (this.selection.length) {
			return Mura(this.selection[0]);
		} else {
			return Mura([]);
		}
	},

	/**
	 * last - Returns last item in selection
	 *
	 * @return {*}
	 */
	last: function() {
		if (this.selection.length) {
			return Mura(this.selection[this.selection.length - 1]);
		} else {
			return Mura([]);
		}
	},

	/**
	 * selector - Returns css selector for first item in selection
	 *
	 * @return {string}
	 */
	selector: function() {
		var pathes = [];
		var path, node = Mura(this.selection[0]);
		while (node.length) {
			var realNode = node.get(0),
				name = realNode.localName;
			if (!name) {
				break;
			}
			if (!node.data('hastempid') && node.attr('id') && node.attr('id') != 'mura-variation-el') {
				name = '#' + node.attr('id');
				path = name + (path ? ' > ' + path : '');
				break;
			} else {
				name = name.toLowerCase();
				var parent = node.parent();
				var sameTagSiblings = parent.children(name);
				if (sameTagSiblings.length > 1) {
					var allSiblings = parent.children();
					var index = allSiblings.index(realNode) + 1;
					if (index > 0) {name += ':nth-child(' + index + ')';}
				}
				path = name + (path ? ' > ' + path : '');
				node = parent;
			}
		}
		pathes.push(path);
		return pathes.join(',');
	},

	/**
	 * siblings - Returns new Mura.DOMSelection of first item's siblings
	 *
	 * @param	{string} selector Selector to filter siblings (optional)
	 * @return {Mura.DOMSelection}
	 */
	siblings: function(selector) {
		if (!this.selection.length) {
			return this;
		}
		var el = this.selection[0];
		if (el.hasChildNodes()) {
			var silbings = Mura(this.selection[0].childNodes);
			if (typeof selector == 'string') {
				var filterFn = function() {
					return (this.nodeType === 1 |	this.nodeType === 11 || this.nodeType === 9) && this.matchesSelector(selector);
				};
			} else {
				var filterFn = function() {
					return this.nodeType === 1 ||	this.nodeType === 11 ||	this.nodeType === 9;
				};
			}
			return silbings.filter(filterFn);
		} else {
			return Mura([]);
		}
	},

	/**
	 * item - Returns item at selected index
	 *
	 * @param	{number} idx Index to return
	 * @return {*}
	 */
	item: function(idx) {
		return this.selection[idx];
	},

	/**
	 * index - Returns the index of element
	 *
	 * @param	{*} el Element to return index of
	 * @return {*}
	 */
	index: function(el) {
		return this.selection.indexOf(el);
	},

	/**
	 * indexOf - Returns the index of element
	 *
	 * @param	{*} el Element to return index of
	 * @return {*}
	 */
	indexOf: function(el) {
		return this.selection.indexOf(el);
	},

	/**
	 * closest - Returns new Mura.DOMSelection of closest parent matching selector
	 *
	 * @param	{string} selector Selector
	 * @return {Mura.DOMSelection}
	 */
	closest: function(selector) {
		if (!this.selection.length) {
			return null;
		}
		var el = this.selection[0];
		for (var parent = el; parent !== null && parent.matchesSelector && !parent.matchesSelector(selector); parent = el.parentElement) {
			el = parent;
		};
		if (parent) {
			return Mura(parent)
		} else {
			return Mura([]);
		}
	},

	/**
	 * append - Appends element to items in selection
	 *
	 * @param	{*} el Element to append
	 * @return {Mura.DOMSelection} Self
	 */
	append: function(el) {
		this.each(function() {
			if (typeof el == 'string') {
				this.insertAdjacentHTML('beforeend', el);
			} else {
				this.appendChild(el);
			}
		});
		return this;
	},

	/**
	 * appendDisplayObject - Appends display object to selected items
	 *
	 * @param	{object} data Display objectparams (including object='objectkey')
	 * @return {Promise}
	 */
	appendDisplayObject: function(data) {
		var self = this;
		delete data.method;
		return new Promise(function(resolve, reject) {
			self.each(function() {
				var el = document.createElement('div');
				el.setAttribute('class','mura-object');
				for (var a in data) {
					el.setAttribute('data-' + a,data[a]);
				}
				if (typeof data.async == 'undefined') {
					el.setAttribute('data-async',true);
				}
				if (typeof data.render == 'undefined') {
					el.setAttribute('data-render','server');
				}
				el.setAttribute('data-instanceid',Mura.createUUID());
				var self=this;
				function watcher(){
					if(Mura.markupInitted){
						Mura(self).append(el);
						Mura.processDisplayObject(el,true,true).then(resolve, reject);
					} else {
						setTimeout(watcher);
					}
				}
				watcher();
			});
		});
	},

	/**
	 * prependDisplayObject - Prepends display object to selected items
	 *
	 * @param	{object} data Display objectparams (including object='objectkey')
	 * @return {Promise}
	 */
	prependDisplayObject: function(data) {
		var self = this;
		delete data.method;
		return new Promise(function(resolve, reject) {
			self.each(function() {
				var el = document.createElement('div');
				el.setAttribute('class','mura-object');
				for (var a in data) {
					el.setAttribute('data-' + a,data[a]);
				}
				if (typeof data.async == 'undefined') {
					el.setAttribute('data-async',true);
				}
				if (typeof data.render == 'undefined') {
					el.setAttribute('data-render','server');
				}
				el.setAttribute('data-instanceid',Mura.createUUID());
				var self=this;
				function watcher(){
					if(Mura.markupInitted){
						Mura(self).append(el);
						Mura.processDisplayObject(el,true,true).then(resolve, reject);
					} else {
						setTimeout(watcher);
					}
				}
				watcher();
			});
		});
	},

	/**
	 * processDisplayObject - Handles processing of display object params to selection
	 *
	 * @param	{object} data Display object params
	 * @return {Promise}
	 */
	processDisplayObject: function(data) {
		var self = this;
		delete data.method;
		return new Promise(function(resolve, reject) {
			self.each(function() {
				Mura.processDisplayObject(
					this,true,true).then(
					resolve, reject
				);
			});
		});
	},

	/**
	 * prepend - Prepends element to items in selection
	 *
	 * @param	{*} el Element to append
	 * @return {Mura.DOMSelection} Self
	 */
	prepend: function(el) {
		this.each(function() {
			if (typeof el == 'string') {
				this.insertAdjacentHTML('afterbegin', el);
			} else {
				this.insertBefore(el, this.firstChild);
			}
		});
		return this;
	},

	/**
	 * before - Inserts element before items in selection
	 *
	 * @param	{*} el Element to append
	 * @return {Mura.DOMSelection} Self
	 */
	before: function(el) {
		this.each(function() {
			if (typeof el == 'string') {
				this.insertAdjacentHTML('beforebegin', el);
			} else {
				this.parent.insertBefore(el,this);
			}
		});
		return this;
	},

	/**
	 * after - Inserts element after items in selection
	 *
	 * @param	{*} el Element to append
	 * @return {Mura.DOMSelection} Self
	 */
	after: function(el) {
		this.each(function() {
			if (typeof el == 'string') {
				this.insertAdjacentHTML('afterend', el);
			} else {
				this.parent.insertBefore(el,this.parent.firstChild);
			}
		});
		return this;
	},

	/**
	 * hide - Hides elements in selection
	 *
	 * @return {object}	Self
	 */
	hide: function() {
		this.each(function(el) {
			el.style.display = 'none';
		});
		return this;
	},

	/**
	 * show - Shows elements in selection
	 *
	 * @return {object}	Self
	 */
	show: function() {
		this.each(function(el) {
			el.style.display = '';
		});
		return this;
	},

	/**
	 * repaint - repaints elements in selection
	 *
	 * @return {object}	Self
	 */
	redraw: function() {
		this.each(function(el) {
			var elm = Mura(el);
			setTimeout(
				function() {
					elm.show();
				},
				1
			);
		});
		return this;
	},

	/**
	 * remove - Removes elements in selection
	 *
	 * @return {object}	Self
	 */
	remove: function() {
		this.each(function(el) {
			el.parentNode.removeChild(el);
		});
		return this;
	},

	/**
	 * addClass - Adds class to elements in selection
	 *
	 * @param	{string} className Name of class
	 * @return {Mura.DOMSelection} Self
	 */
	addClass: function(className) {
		if (className.length) {
			this.each(function(el) {
				if (el.classList) {
					el.classList.add(className);
				} else {
					el.className += ' ' + className;
				}
			});
		}
		return this;
	},

	/**
	 * hasClass - Returns if the first element in selection has class
	 *
	 * @param	{string} className Class name
	 * @return {Mura.DOMSelection} Self
	 */
	hasClass: function(className) {
			return this.is("." + className);
	},

	/**
	 * removeClass - Removes class from elements in selection
	 *
	 * @param	{string} className Class name
	 * @return {Mura.DOMSelection} Self
	 */
	removeClass: function(className) {
		this.each(function(el) {
			if (el.classList) {
				el.classList.remove(className);
			} else if (el.className) {
				el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
			}
		});
		return this;
	},

	/**
	 * toggleClass - Toggles class on elements in selection
	 *
	 * @param	{string} className Class name
	 * @return {Mura.DOMSelection} Self
	 */
	toggleClass: function(className) {
		this.each(function(el) {
			if (el.classList) {
				el.classList.toggle(className);
			} else {
				var classes = el.className.split(' ');
				var existingIndex = classes.indexOf(className);

				if (existingIndex >= 0)
					classes.splice(existingIndex, 1);
				else
					classes.push(className);

				el.className = classes.join(' ');
			}
		});
		return this;
	},

	/**
	 * empty - Removes content from elements in selection
	 *
	 * @return {object}	Self
	 */
	empty: function() {
		this.each(function(el) {
			el.innerHTML = '';
		});
		return this;
	},

	/**
	 * evalScripts - Evaluates script tags in selection elements
	 *
	 * @return {object}	Self
	 */
	evalScripts: function() {
		if (!this.selection.length) {
			return this;
		}
		this.each(function(el) {
			Mura.evalScripts(el);
		});
		return this;
	},

	/**
	 * html - Returns or sets HTML of elements in selection
	 *
	 * @param	{string} htmlString description
	 * @return {object}						Self
	 */
	html: function(htmlString) {
		if (typeof htmlString != 'undefined') {
			this.each(function(el) {
				el.innerHTML = htmlString;
				Mura.evalScripts(el);
			});
			return this;
		} else {
			if (!this.selection.length) {
				return '';
			}
			return this.selection[0].innerHTML;
		}
	},

	/**
	 * css - Sets css value for elements in selection
	 *
	 * @param	{string} ruleName Css rule name
	 * @param	{string} value		Rule value
	 * @return {object}					Self
	 */
	css: function(ruleName, value) {
		if (!this.selection.length) {
			return this;
		}
		if (typeof ruleName == 'undefined' && typeof value == 'undefined') {
			try {
				return getComputedStyle(this.selection[0]);
			} catch (e) {
				console.log(e)
				return {};
			}
		} else if (typeof ruleName == 'object') {
			this.each(function(el) {
				try {
					for (var p in ruleName) {
						el.style[p] = ruleName[p];
					}
				} catch (e) {console.log(e)}
			});
		} else if (typeof value != 'undefined') {
			this.each(function(el) {
				try {
					el.style[ruleName] = value;
				} catch (e) {console.log(e)}
			});
			return this;
		} else {
			try {
				return getComputedStyle(this.selection[	0])[ruleName];
			} catch (e) {console.log(e)}
		}
	},

	/**
	 * calculateDisplayObjectStyles - Looks at data attrs and sets appropriate styles
	 *
	 * @return {object}	Self
	 */
	 calculateDisplayObjectStyles: function(windowResponse) {

 		this.each(function(el) {
			var obj=Mura(el);
			var breakpoints=['mura-xs','mura-sm','mura-md','mura-lg'];
			var objBreakpoint='mura-sm';
			for(var b=0;b<breakpoints.length;b++){
				if(obj.is('.' + breakpoints[b])){
					objBreakpoint=breakpoints[b];
					break;
				}
			}
			var fullsize=breakpoints.indexOf('mura-' + Mura.getBreakpoint()) >= breakpoints.indexOf(objBreakpoint);

			Mura.windowResponsiveModules=Mura.windowResponsiveModules||{};
			Mura.windowResponsiveModules[obj.data('instanceid')]=false;

 			obj = (obj.node) ? obj : Mura(obj);
 			var self = obj.node;
 			if (obj.data('class')) {
 				var classes = obj.data('class');
 				if (typeof classes != 'Array') {
 					var classes = classes.split(' ');
 				}
 				for (var c = 0; c < classes.length; c++) {
 					if (!obj.hasClass(classes[c])) {
 						obj.addClass(classes[c]);
 					}
 				}
 			}
 			if (obj.data('cssclass')) {
 				var classes = obj.data('cssclass');
 				if (typeof classes != 'array') {
 					var classes = classes.split(' ');
 				}
 				for (var c = 0; c < classes.length; c++) {
 					if (!obj.hasClass(classes[c])) {
 						obj.addClass(classes[c]);
 					}
 				}
 			}
 			if(obj.data('cssid')){
 				obj.attr('id',obj.data('cssid'));
 			} else {
 				obj.removeAttr('id');
 			}

			var styleSupport=obj.data('stylesupport');
			var objectstyles=false;
			if(styleSupport && styleSupport.objectstyles){
				objectstyles=styleSupport.objectstyles;
			}

 			if(styleSupport && objectstyles){
 				obj.removeAttr('style');
				if(!fullsize){
					delete objectstyles.margin;
					delete objectstyles.marginLeft;
					delete objectstyles.marginRight;
					delete objectstyles.marginTop;
					delete objectstyles.marginBottom;
				}
 				obj.css(objectstyles);
				if(!fullsize || (fullsize && !(
					obj.css('marginTop')=='0px'
					&& obj.css('marginBottom')=='0px'
					&& obj.css('marginLeft')=='0px'
					&& obj.css('marginRight')=='0px'
				))){
					Mura.windowResponsiveModules[obj.data('instanceid')]=true;
				}
 			}

			if(!windowResponse){
				var sheet=Mura.getStyleSheet('mura-styles-' + obj.data('instanceid'));

				while (sheet.cssRules.length) {
					sheet.deleteRule(0);
				}

				var selector='div.mura-object[data-instanceid="' + obj.data('instanceid') + '"]';

				if(styleSupport && objectstyles){
					if (objectstyles && typeof objectstyles.backgroundColor != 'undefined' && objectstyles.backgroundColor
						&& typeof objectstyles.backgroundImage != 'undefined' && objectstyles.backgroundImage) {
						var style =selector + '::before{content: ""; position: absolute;	top: 0; right: 0;left: 0;bottom:0; background:' + objectstyles.backgroundColor + '}';
						sheet.insertRule(
							style,
							sheet.cssRules.length
						);
						sheet.insertRule(
							selector + ' > * {position:relative;}',
							sheet.cssRules.length
						);
		 			}
					if(objectstyles && objectstyles.color){
						var style=selector + ', ' + selector + ' label, ' + selector + ' p, ' + selector + ' h1, ' + selector + ' h2, ' + selector + ' h3, ' + selector + ' h4, ' + selector + ' h5, ' + selector + ' h6, ' +selector + ' a:link, ' + selector + ' a:visited, '  + selector + ' a:hover, ' + selector + ' a:active { color:' + objectstyles.color + ';} ';
						sheet.insertRule(
							style,
							sheet.cssRules.length
						);
						sheet.insertRule(
							selector + ' * {color:inherit}',
							sheet.cssRules.length
						);
					}
				}

				if(styleSupport && styleSupport.css){
					var styles=styleSupport.css.split('}');
					if(Array.isArray(styles) && styles.length){
						styles.forEach(function(style){
							var styleParts=style.split("{");
							if(styleParts.length > 1){
								var selectors=styleParts[0].split(',');
								selectors.forEach(function(subSelector){
									try{
										var subStyle=selector + ' ' + subSelector.replace(/\$self/g,'') + '{' + styleParts[1] + '}';
										sheet.insertRule(
											subStyle,
											sheet.cssRules.length
										);
										if(Mura.editing){
											console.log('Applying dynamic styles:' + subStyle);
										}
									} catch(e){
										if(Mura.editing){
											console.log('Error applying dynamic styles:' + subStyle);
											console.log(e);
										}
									}
								});
							}
						});
					}
				}
			}

 			if(obj.data('metacssclass') || obj.data('metacssid') || (styleSupport && styleSupport.metastyles) ){
 				var metaWrapper=obj.children('.mura-object-meta-wrapper');
				if(metaWrapper.length){
					var meta=metaWrapper.children('.mura-object-meta');
					if(meta.length){
						var metastyles={};
						if(styleSupport && styleSupport.metastyles){
							metastyles=styleSupport.metastyles;
						}

						if(!windowResponse){
							var selector='div.mura-object[data-instanceid="' + obj.data('instanceid') + '"] .mura-object-meta';

							if (metastyles && typeof metastyles.backgroundColor != 'undefined' && metastyles.backgroundColor
								&& typeof metastyles.backgroundImage != 'undefined' && metastyles.backgroundImage) {
								var style =selector + '::before{content: ""; position: absolute;	top: 0; right: 0;left: 0;bottom:0; background:' + metastyles.backgroundColor + '}';
								sheet.insertRule(
									style,
									sheet.cssRules.length
								);
								sheet.insertRule(
									selector + ' > * {position:relative;}',
									sheet.cssRules.length
								);
				 			}
							if(metastyles && metastyles.color){

								var style = selector + ', ' + selector + ' label, ' + selector + ' p, ' + selector + ' h1, ' + selector + ' h2, ' + selector + ' h3, ' + selector + ' h4, ' + selector + ' h5, ' + selector + ' h6, ' +selector + ' a:link, ' + selector + ' a:visited, '  + selector + ' a:hover, ' + selector + ' a:active { color:' + metastyles.color + ';} ';
								sheet.insertRule(
									style,
									sheet.cssRules.length
								);
								sheet.insertRule(
									selector + ' * {color:inherit}',
									sheet.cssRules.length
								);
							}
						}

						if(obj.data('metacssid')){
			 				meta.attr('id',obj.data('metacssid'));
			 			}
			 			if(obj.data('metacssclass')){
			 			 obj.data('metacssclass').split(' ').forEach(function(c){
			 				 if (!meta.hasClass(c)) {
			 					 meta.addClass(c);
			 				 }
			 			 })
			 			}

						if(metastyles){
							meta.removeAttr('style');
							meta.css(metastyles);
						}

						if(obj.is('.mura-object-label-left, .mura-object-label-right')){
							var left=meta.css('marginLeft');
							var right=meta.css('marginRight')
							if(!(left=='0px' && right=='0px') && left.charAt(0) != "-" && right.charAt(0) != "-"){
								meta.css('width','calc(50% - (' + left + ' + ' + right + '))');
							}
						}
					}
				}
			}

			var contentstyles={};
			if(styleSupport && styleSupport.contentstyles){
				contentstyles=styleSupport.contentstyles;
			}

			var selector='div.mura-object[data-instanceid="' + obj.data('instanceid') + '"] .mura-object-content';

			if (!windowResponse && contentstyles && typeof contentstyles.backgroundColor != 'undefined' && contentstyles.backgroundColor
				&& typeof contentstyles.backgroundImage != 'undefined' && contentstyles.backgroundImage) {
				var style =selector + '::before{content: ""; position: absolute;	top: 0; right: 0;left: 0;bottom:0; background:' + contentstyles.backgroundColor + '}';
				sheet.insertRule(
					style,
					sheet.cssRules.length
				);
				sheet.insertRule(
					selector + ' > * {position:relative;}',
					sheet.cssRules.length
				);
			}

			if(!windowResponse && contentstyles && contentstyles.color){
				var style=	selector + ', ' + selector + ' label, ' + selector + ' p, ' + selector + ' h1, ' + selector + ' h2, ' + selector + ' h3, ' + selector + ' h4, ' + selector + ' h5, ' + selector + ' h6, ' +selector + ' a:link, ' + selector + ' a:visited, '  + selector + ' a:hover, ' + selector + ' a:active { color:' + contentstyles.color + ';} ';
				sheet.insertRule(
					style,
					sheet.cssRules.length
				);
				sheet.insertRule(
					selector + ' * {color:inherit}',
					sheet.cssRules.length
				);
			}

 			if(obj.data('contentcssclass') || obj.data('contentcssid') ||  contentstyles){
 				var content=obj.children('.mura-object-content').first();

	 			if(obj.data('contentcssid')){
	 				content.attr('id',obj.data('contentcssid'));
	 			}
	 			if(obj.data('contentcssclass')){
	 				obj.data('contentcssclass').split(' ').forEach(function(c){
	 					if (!content.hasClass(c)) {
	 					 		content.addClass(c);
	 					}
	 				 })
	 			}

				if(contentstyles){
					content.removeAttr('style');
					content.css(contentstyles);
				}

				if(obj.is('.mura-object-label-left, .mura-object-label-right')){
					var left=content.css('marginLeft');
					var right=content.css('marginRight')
					if(!(left=='0px' && right=='0px') && left.charAt(0) != "-" && right.charAt(0) != "-"){
						if(fullsize){
							content.css('width','calc(50% - (' + left + ' + ' + right + '))');
						}
						Mura.windowResponsiveModules[obj.data('instanceid')]=true;
					}
				}
			}

			var width='100%';
			var adjust=false;


			if(obj.is('.mura-one')){
				width='8.33%';adjust=true;
			} else if(obj.is('.mura-two')){
				width='16.66%';adjust=true;
			} else if(obj.is('.mura-three')){
				width='25%';adjust=true;
			} else if(obj.is('.mura-four')){
				width='33.33%';adjust=true;
			} else if(obj.is('.mura-five')){
				width='41.66%';adjust=true;
			} else if(obj.is('.mura-six')){
				width='50%';adjust=true;
			} else if(obj.is('.mura-seven')){
				width='58.33';adjust=true;
			} else if(obj.is('.mura-eigth')){
				width='66.66%';adjust=true;
			} else if(obj.is('.mura-nine')){
				width='75%';adjust=true;
			} else if(obj.is('.mura-ten')){
				width='83.33%';adjust=true;
			} else if(obj.is('.mura-eleven')){
				width='91.66%';adjust=true;
			} else if(obj.is('.mura-twelve')){
				width='100%';adjust=true;
			} else if(obj.is('.mura-one-third')){
				width='33.33%';adjust=true;
			} else if(obj.is('.mura-two-thirds')){
				width='66.66%';adjust=true;
			} else if(obj.is('.mura-one-half')){
				width='50%';adjust=true;
			}

			if(adjust){
				var left=obj.css('marginLeft');
				var right=obj.css('marginRight')

				if(!obj.is('.mura-center') && !(left=='0px' && right=='0px') && !(left=='auto' || right=='auto') && left.charAt(0) != "-" && right.charAt(0) != "-"){
					if(fullsize){
						obj.css('width','calc(' + width + ' - (' + left + ' + ' + right + '))');
					}
					Mura.windowResponsiveModules[obj.data('instanceid')]=true;
				}
			}

			if(obj.css('paddingTop').replace(/[^0-9]/g,'') != '0' || obj.css('paddingLeft').replace(/[^0-9]/g,'') != '0'){
				obj.addClass('mura-object-pin-tools');
			} else {
				obj.removeClass('mura-object-pin-tools');
			}

 		});

 		return this;
 	},

	/**
	 * text - Gets or sets the text content of each element in the selection
	 *
	 * @param	{string} textString Text string
	 * @return {object}						Self
	 */
	text: function(textString) {
		if (typeof textString == 'undefined') {
			this.each(function(el) {
				el.textContent = textString;
			});
			return this;
		} else {
			return this.selection[0].textContent;
		}
	},

	/**
	 * is - Returns if the first element in the select matches the selector
	 *
	 * @param	{string} selector description
	 * @return {boolean}
	 */
	is: function(selector) {
		if (!this.selection.length) {
			return false;
		}
		try {
			if (typeof this.selection[0] !== "undefined") {
			 	return this.selection[0].matchesSelector && this.selection[0].matchesSelector(selector);
			} else {
				return false;
			}
		} catch(e){
			return false;
		}
	},

	/**
	 * hasAttr - Returns is the first element in the selection has an attribute
	 *
	 * @param	{string} attributeName description
	 * @return {boolean}
	 */
	hasAttr: function(attributeName) {
		if (!this.selection.length) {
			return false;
		}
		return typeof this.selection[0].hasAttribute ==
			'function' && this.selection[0].hasAttribute(
					attributeName);
	},

	/**
	 * hasData - Returns if the first element in the selection has data attribute
	 *
	 * @param	{sting} attributeName Data atttribute name
	 * @return {boolean}
	 */
	hasData: function(attributeName) {
		if (!this.selection.length) {
			return false;
		}
		return this.hasAttr('data-' + attributeName);
	},


	/**
	 * offsetParent - Returns first element in selection's offsetParent
	 *
	 * @return {object}	offsetParent
	 */
	offsetParent: function() {
		if (!this.selection.length) {
			return this;
		}
		var el = this.selection[0];
		return el.offsetParent || el;
	},

	/**
	 * outerHeight - Returns first element in selection's outerHeight
	 *
	 * @param	{boolean} withMargin Whether to include margin
	 * @return {number}
	 */
	outerHeight: function(withMargin) {
		if (!this.selection.length) {
			return this;
		}
		if (typeof withMargin == 'undefined') {
			function outerHeight(el) {
				var height = el.offsetHeight;
				var style = getComputedStyle(el);
				height += parseInt(style.marginTop) + parseInt(style.marginBottom);
				return height;
			}
			return outerHeight(this.selection[0]);
		} else {
			return this.selection[0].offsetHeight;
		}
	},

	/**
	 * height - Returns height of first element in selection or set height for elements in selection
	 *
	 * @param	{number} height	Height (option)
	 * @return {object}				Self
	 */
	height: function(height) {
		if (!this.selection.length) {
			return this;
		}
		if (typeof width != 'undefined') {
			if (!isNaN(height)) {
					height += 'px';
			}
			this.css('height', height);
			return this;
		}
		var el = this.selection[0];
		//var type=el.constructor.name.toLowerCase();
		if (typeof window !='undefined' && typeof window.document != 'undefined' && el === window) {
			return innerHeight
		} else if (el === document) {
			var body = document.body;
			var html = document.documentElement;
			return Math.max(body.scrollHeight, body.offsetHeight,
				html.clientHeight, html.scrollHeight,
				html.offsetHeight)
		}
		var styles = getComputedStyle(el);
		var margin = parseFloat(styles['marginTop']) + parseFloat(styles['marginBottom']);
		return Math.ceil(el.offsetHeight + margin);
	},

	/**
	 * width - Returns width of first element in selection or set width for elements in selection
	 *
	 * @param	{number} width Width (optional)
	 * @return {object}			 Self
	 */
	width: function(width) {
		if (!this.selection.length) {
			return this;
		}
		if (typeof width != 'undefined') {
			if (!isNaN(width)) {
				width += 'px';
			}
			this.css('width', width);
			return this;
		}
		var el = this.selection[0];
		//var type=el.constructor.name.toLowerCase();
		if (typeof window !='undefined' && typeof window.document != 'undefined' && el === window) {
			return innerWidth
		} else if (el === document) {
			var body = document.body;
			var html = document.documentElement;
		return Math.max(body.scrollWidth, body.offsetWidth,
				html.clientWidth, html.scrolWidth,
				html.offsetWidth)
		}
		return getComputedStyle(el).width;
	},

	/**
	 * width - Returns outerWidth of first element in selection
	 *
	 * @return {number}
	 */
	outerWidth: function() {
		if (!this.selection.length) {
			return 0;
		}
		var el = this.selection[0];
		var width = el.offsetWidth;
		var style = getComputedStyle(el);

		width += parseInt(style.marginLeft) + parseInt(style.marginRight);
		return width;
	},

	/**
	 * scrollTop - Returns the scrollTop of the current document
	 *
	 * @return {object}
	 */
	scrollTop: function() {
		if (!this.selection.length) {
			return 0;
		}
		var el = this.selection[0];
		if(typeof el.scrollTop != 'undefined'){
			el.scrollTop;
		} else {
			return	window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
		}
	},

	/**
	 * offset - Returns offset of first element in selection
	 *
	 * @return {object}
	 */
	offset: function() {
		if (!this.selection.length) {
			return this;
		}
		var box = this.selection[0].getBoundingClientRect();
		return {
			top: box.top + (pageYOffset || document.scrollTop) -
					(document.clientTop || 0),
			left: box.left + (pageXOffset || document.scrollLeft) -
					(document.clientLeft || 0)
		};
	},

	/**
	 * removeAttr - Removes attribute from elements in selection
	 *
	 * @param	{string} attributeName Attribute name
	 * @return {object}							 Self
	 */
	removeAttr: function(attributeName) {
		if (!this.selection.length) {
				return this;
		}
		this.each(function(el) {
			if (el && typeof el.removeAttribute == 'function') {
				el.removeAttribute(attributeName);
			}
		});
		return this;
	},

	/**
	 * changeElementType - Changes element type of elements in selection
	 *
	 * @param	{string} type Element type to change to
	 * @return {Mura.DOMSelection} Self
	 */
	changeElementType: function(type) {
		if (!this.selection.length) {
			return this;
		}
		this.each(function(el) {
			Mura.changeElementType(el, type)
		});
		return this;
	},

	/**
	 * val - Set the value of elements in selection
	 *
	 * @param	{*} value Value
	 * @return {Mura.DOMSelection} Self
	 */
	val: function(value) {
		if (!this.selection.length) {
			return this;
		}
		if (typeof value != 'undefined') {
			this.each(function(el) {
				if (el.tagName == 'radio') {
					if (el.value == value) {
						el.checked = true;
					} else {
						el.checked = false;
					}
				} else {
					el.value = value;
				}
			});
			return this;
		} else {
			if (Object.prototype.hasOwnProperty.call(this.selection[0], 'value') ||
				typeof this.selection[0].value != 'undefined') {
				return this.selection[0].value;
			} else {
				return '';
			}
		}
	},

	/**
	 * attr - Returns attribute value of first element in selection or set attribute value for elements in selection
	 *
	 * @param	{string} attributeName Attribute name
	 * @param	{*} value				 Value (optional)
	 * @return {Mura.DOMSelection} Self
	 */
	attr: function(attributeName, value) {
		if (!this.selection.length) {
			return this;
		}
		if (typeof value == 'undefined' && typeof attributeName =='undefined') {
			return Mura.getAttributes(this.selection[0]);
		} else if (typeof attributeName == 'object') {
			this.each(function(el) {
				if (el.setAttribute) {
					for (var p in attributeName) {
						el.setAttribute(p,attributeName[p]);
					}
				}
			});
			return this;
		} else if (typeof value != 'undefined') {
			this.each(function(el) {
				if (el.setAttribute) {
					el.setAttribute(attributeName,value);
				}
			});
			return this;
		} else {
			if (this.selection[0] && this.selection[0].getAttribute) {
				return this.selection[0].getAttribute(attributeName);
			} else {
				return undefined;
			}

		}
	},

	/**
	 * data - Returns data attribute value of first element in selection or set data attribute value for elements in selection
	 *
	 * @param	{string} attributeName Attribute name
	 * @param	{*} value				 Value (optional)
	 * @return {Mura.DOMSelection} Self
	 */
	data: function(attributeName, value) {
		if (!this.selection.length) {
			return this;
		}
		if (typeof value == 'undefined' && typeof attributeName == 'undefined') {
			return Mura.getData(this.selection[0]);
		} else if (typeof attributeName == 'object') {
			this.each(function(el) {
				for (var p in attributeName) {
					el.setAttribute("data-" + p,attributeName[p]);
				}
			});
			return this;
		} else if (typeof value != 'undefined') {
			this.each(function(el) {
				el.setAttribute("data-" + attributeName, value);
			});
			return this;
		} else if (this.selection[0] && this.selection[	0].getAttribute) {
			return Mura.parseString(this.selection[0].getAttribute("data-" + attributeName));
		} else {
			return undefined;
		}
	},

	/**
	 * prop - Returns attribute value of first element in selection or set attribute value for elements in selection
	 *
	 * @param	{string} attributeName Attribute name
	 * @param	{*} value				 Value (optional)
	 * @return {Mura.DOMSelection} Self
	 */
	prop: function(attributeName, value) {
			if (!this.selection.length) {
				return this;
			}
			if (typeof value == 'undefined' && typeof attributeName == 'undefined') {
				return Mura.getProps(this.selection[0]);
			} else if (typeof attributeName == 'object') {
				this.each(function(el) {
					for (var p in attributeName) {
						el.setAttribute(p,attributeName[p]);
					}
				});
				return this;
			} else if (typeof value != 'undefined') {
				this.each(function(el) {
					el.setAttribute(attributeName,value);
				});
				return this;
			} else {
				return Mura.parseString(this.selection[0].getAttribute(attributeName));
			}
	},

	/**
	 * fadeOut - Fades out elements in selection
	 *
	 * @return {Mura.DOMSelection} Self
	 */
	fadeOut: function() {
		this.each(function(el) {
			el.style.opacity = 1;
			(function fade() {
				if ((el.style.opacity -= .1) < 	0) {
					el.style.opacity=0;
					el.style.display = "none";
				} else {
					requestAnimationFrame(fade);
				}
			})();
		});
		return this;
	},

	/**
	 * fadeIn - Fade in elements in selection
	 *
	 * @param	{string} display Display value
	 * @return {Mura.DOMSelection} Self
	 */
	fadeIn: function(display) {
			this.each(function(el) {
				el.style.opacity = 0;
				el.style.display = display ||	"block";
				(function fade() {
					var val = parseFloat(el.style.opacity);
					if (!((val += .1) > 1)) {
						el.style.opacity = val;
						requestAnimationFrame(fade);
					}
				})();
			});
			return this;
	},

	/**
	 * toggle - Toggles display object elements in selection
	 *
	 * @return {Mura.DOMSelection} Self
	 */
	toggle: function() {
		this.each(function(el) {
			if (typeof el.style.display ==
				'undefined' || el.style.display ==
				'') {
				el.style.display = 'none';
			} else {
				el.style.display = '';
			}
		});
		return this;
	},
	/**
	 * slideToggle - Place holder
	 *
	 * @return {Mura.DOMSelection} Self
	 */
	slideToggle: function() {
		this.each(function(el) {
			if (typeof el.style.display ==
				'undefined' || el.style.display ==
				'') {
				el.style.display = 'none';
			} else {
				el.style.display = '';
			}
		});
		return this;
	},

	/**
	 * focus - sets focus of the first select element
	 *
	 * @return {self}
	 */
	focus: function() {
		if (!this.selection.length) {
			return this;
		}
		this.selection[0].focus();
		return this;
	},

	/**
	 * renderEditableAttr- Returns a string with editable attriute markup markup.
	 *
	 * @param	{object} params Keys: name, type, required, validation, message, label
	 * @return {self}
	 */
	makeEditableAttr:function(params){
		if (!this.selection.length) {
			return this;
		}
		var value=this.selection[0].innerHTML;
		params=params || {};
		if(!params.name){
			return this;
		}
		params.type=params.type || "text";
		if(typeof params.required == 'undefined'){
			params.required=false;
		}
		if(typeof params.validation == 'undefined'){
			params.validation='';
		}
		if(typeof params.message == 'undefined'){
			params.message='';
		}
		if(typeof params.label == 'undefined'){
			params.label=params.name;
		}
		var outerClass="mura-editable mura-inactive";
		var innerClass="mura-inactive mura-editable-attribute";
		if(params.type=="htmlEditor"){
			outerClass += " mura-region mura-region-loose";
			innerClass += " mura-region-local";
		} else {
			outerClass += " inline";
			innerClass += " inline";
		}
		var innerClass="mura-inactive mura-editable-attribute";
		/*
		<div class="mura-editable mura-inactive inline">
		<label class="mura-editable-label" style="">TITLE</label>
		<div contenteditable="false" id="mura-editable-attribute-title" class="mura-inactive mura-editable-attribute inline" data-attribute="title" data-type="text" data-required="false" data-message="" data-label="title">About</div>
		</div>

		<div class="mura-region mura-region-loose mura-editable mura-inactive">
		<label class="mura-editable-label" style="">BODY</label>
		<div contenteditable="false" id="mura-editable-attribute-body" class="mura-region-local mura-inactive mura-editable-attribute" data-attribute="body" data-type="htmlEditor" data-required="false" data-message="" data-label="body" data-loose="true" data-perm="true" data-inited="false"></div>
		</div>
		*/
		var markup='<div class="' + outerClass + '">';
		markup +='<label class="mura-editable-label" style="display:none">' + params.label.toUpperCase() + '</label>';
		markup +='<div contenteditable="false" id="mura-editable-attribute-' + params.name +' class="' + innerClass + '" ';
		markup += ' data-attribute="' + params.name + '" ';
		markup += ' data-type="' + params.type + '" ';
		markup += ' data-required="' + params.required + '" ';
		markup += ' data-message="' + params.message + '" ';
		markup += ' data-label="' + params.label + '"';
		if(params.type == 'htmlEditor'){
			markup += ' data-loose="true" data-perm="true" data-inited="false"';
		}
		markup += '>' + value + '</div></div>';
		this.selection[0].innerHTML=markup;
		Mura.evalScripts(this.selection[0]);
		return this;
	},

	/**
	* processDisplayRegion - Renders and processes the display region data returned from Mura.renderFilename()
	*
	* @param	{any} data Region data to render
	* @return {Promise}
	*/
	processDisplayRegion:function(data,label){
		if (typeof data == 'undefined' || !this.selection.length) {
				return this.processMarkup();
		}
		this.html(Mura.buildDisplayRegion(data));
		if(label != 'undefined'){
			this.find('label.mura-editable-label').html('DISPLAY REGION : ' + data.label);
		}
		return this.processMarkup();
	},

	/**
	 * appendDisplayObject - Appends display object to selected items
	 *
	 * @param	{object} data Display objectparams (including object='objectkey')
	 * @return {Promise}
	 */
	dspObject:function(data){
		return this.appendDisplayObject(data);
	}
});
