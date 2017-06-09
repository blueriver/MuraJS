
var Mura=require('core/core');

/**
 * Creates a new Mura.Cache
 * @class {class} Mura.Cache
 */

Mura.Cache=Mura.Core.extend(
  /** @lends Mura.Cache.prototype */
  {

	/**
	 * init - Initialiazes cache
	 *
	 * @return {void}
	 */
	init:function(){
		this.cache={};
	},

  /**
   * getKey - Returns Key value associated with key Name
   *
   * @param  {string} keyName Key Name
   * @return {*}         Key Value
   */
  getKey:function(keyName){
      return Mura.hashCode(keyName);
  },

  /**
   * get - Returns the value associated with key name
   *
   * @param  {string} keyName  description
   * @param  {*} keyValue Default Value
   * @return {*}
   */
  get:function(keyName,keyValue){
    var key=this.getKey(keyName);

		if(typeof this.cache[key] != 'undefined'){
			return this.cache[key].keyValue;
		} else if (typeof keyValue != 'undefined') {
			this.set(keyName,keyValue,key);
			return this.cache[key].keyValue;
		} else {
			return;
		}
	},

	/**
	 * set - Sets and returns key value
	 *
	 * @param  {string} keyName  Key Name
	 * @param  {*} keyValue Key Value
	 * @param  {string} key      Key
	 * @return {*}
	 */
	set:function(keyName,keyValue,key){
      key=key || this.getKey(keyName);
	    this.cache[key]={name:keyName,value:keyValue};
		return keyValue;
	},

	/**
	 * has - Returns if the key name has a value in the cache
	 *
	 * @param  {string} keyName Key Name
	 * @return {boolean}
	 */
	has:function(keyName){
		return typeof this.cache[getKey(keyName)] != 'undefined';
	},

	/**
	 * getAll - Returns object containing all key and key values
	 *
	 * @return {object}
	 */
	  getAll:function(){
		return this.cache;
	},

  /**
   * purgeAll - Purges all key/value pairs from cache
   *
   * @return {object}  Self
   */
  purgeAll:function(){
      this.cache={};
		return this;
	},

  /**
   * purge - Purges specific key name from cache
   *
   * @param  {string} keyName Key Name
   * @return {object}         Self
   */
  purge:function(keyName){
      var key=this.getKey(keyName)
      if( typeof this.cache[key] != 'undefined')
      delete this.cache[key];
		return this;
	}

});

Mura.datacache=new Mura.Cache();
