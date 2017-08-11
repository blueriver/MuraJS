
var Mura=require('./core');

/**
 * Creates a new Mura.EntityCollection
 * @name  Mura.Entity.EntityCollection
 * @class
 * @extends Mura.Entity
 * @memberof  Mura
 * @param  {object} properties Object containing values to set into object
 * @return {Mura.EntityCollection} Self
 */

Mura.EntityCollection=Mura.Entity.extend(
  /** @lends Mura.EntityCollection.prototype */
  {

	init:function(properties,requestcontext){
		properties=properties || {};
		this.set(properties);
    this._requestcontext=requestcontext || Mura._requestcontext;

		var self=this;

		if(Array.isArray(self.get('items'))){
			self.set('items',self.get('items').map(function(obj){
				if(Mura.entities[obj.entityname]){
					return new Mura.entities[obj.entityname](obj,self._requestcontext);
				} else {
					return new Mura.Entity(obj,self._requestcontext);
				}
			}));
		}

		return this;
	},

  /**
	 * length - Returns length entity collection
	 *
	 * @return {number}     integer
	 */
	length:function(){
		return this.properties.items.length;
	},

	/**
	 * item - Return entity in collection at index
	 *
	 * @param  {nuymber} idx Index
	 * @return {object}     Mura.Entity
	 */
	item:function(idx){
		return this.properties.items[idx];
	},

	/**
	 * index - Returns index of item in collection
	 *
	 * @param  {object} item Entity instance
	 * @return {number}      Index of entity
	 */
	index:function(item){
		return this.properties.items.indexOf(item);
	},

	/**
	 * getAll - Returns object with of all entities and properties
	 *
	 * @return {object}
	 */
	getAll:function(){
		var self=this;

    if(typeof self.properties.items != 'undefined'){
  		return Mura.extend(
  			{},
  			self.properties,
  			{
  				items:self.properties.items.map(function(obj){
  					return obj.getAll();
  				})
  			}
  		);
    } else if(typeof self.properties.properties != 'undefined'){
  		return Mura.extend(
  			{},
  			self.properties,
  			{
  				properties:self.properties.properties.map(function(obj){
  					return obj.getAll();
  				})
  			}
  		);
    }

	},

	/**
	 * each - Passes each entity in collection through function
	 *
	 * @param  {function} fn Function
	 * @return {object}  Self
	 */
	each:function(fn){
		this.properties.items.forEach( function(item,idx){
			fn.call(item,item,idx);
		});
		return this;
	},

      /**
	 * each - Passes each entity in collection through function
	 *
	 * @param  {function} fn Function
	 * @return {object}  Self
	 */
	forEach:function(fn){
		return this.each(fn);
	},

	/**
	 * sort - Sorts collection
	 *
	 * @param  {function} fn Sorting function
	 * @return {object}   Self
	 */
	sort:function(fn){
		this.properties.items.sort(fn);
          return this;
	},

	/**
	 * filter - Returns new Mura.EntityCollection of entities in collection that pass filter
	 *
	 * @param  {function} fn Filter function
	 * @return {Mura.EntityCollection}
	 */
	filter:function(fn){
          var newProps={};

          for(var p in this.properties){
              if(this.properties.hasOwnProperty(p) && p != 'items' && p != 'links'){
                  newProps[p]=this.properties[p];
              }
          }

		var collection=new Mura.EntityCollection(newProps,this._requestcontext);
		return collection.set('items',this.properties.items.filter( function(item,idx){
			return fn.call(item,item,idx);
		}));
	},

   /**
	 * map - Returns new Array returned from map function
	 *
	 * @param  {function} fn Filter function
	 * @return {Array}
	 */
	map:function(fn){
		return this.properties.items.map( function(item,idx){
			return fn.call(item,item,idx);
		});
	},

   /**
	 * reduce - Returns value from  reduce function
	 *
	 * @param  {function} fn Reduce function
   * @param  {any} initialValue Starting accumulator value
	 * @return {accumulator}
	 */
	reduce:function(fn,initialValue){
     initialValue=initialValue||0;

     return this.properties.items.reduce(
            function(accumulator,item,idx,array){
    				return fn.call(item,accumulator,item,idx,array);
    			},
          initialValue
      );
	}
});
