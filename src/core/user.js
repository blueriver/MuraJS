
var Mura=require('./core');

/**
* Creates a new Mura.entities.User
* @name Mura.entities.User
* @class
* @extends Mura.Entity
* @memberof Mura
* @param	{object} properties Object containing values to set into object
* @return {Mura.Entity}
*/

Mura.entities.User = Mura.Entity.extend(
/** @lends Mura.entities.User.prototype */
{
	/**
	 * isInGroup - Returns if the CURRENT USER is in a group
	 *
	 * @param	{string} group	Name of group
	 * @param	{boolean} isPublic	If you want to check public or private (system) groups
	 * @return {boolean}
	 */
	isInGroup:function(group,siteid,isPublic){
		siteid=siteid || Mura.siteid;
		var a=this.get('memberships');
		if(!Array.isArray(a)){
			console.log('Method design for use with currentuser() only');
			return false;
		}
		if(typeof isPublic !='undefined'){
			return a.indexOf(group + ";" + siteid + ";" + isPublic) >= 0;
		} else {
			return a.indexOf(group + ";" + siteid + ";0") >= 0 || a.indexOf(group + ";" + siteid + ";1") >= 0;
		}
	},

	/**
	 * isSuperUser - Returns if the CURRENT USER is a super user
	 *
	 * @return {boolean}
	 */
	isSuperUser:function(){
		var a=this.get('memberships');
		if(!Array.isArray(a)){
			console.log('Method design for use with currentuser() only');
			return false;
		}
		return a.indexOf('S2') >= 0;
	},

	/**
	 * isAdminUser - Returns if the CURRENT USER is a admin user
	 *
	 * @return {boolean}
	 */
	isAdminUser:function(siteid){
		siteid=siteid || Mura.siteid;
		var a=this.get('memberships');
		if(!Array.isArray(a)){
			console.log('Method design for use with currentuser() only');
			return false;
		}
		return (this.isSuperUser() || a.indexOf("Admin;" + siteid + ";0") >= 0);
	},

	/**
	 * isSystemUser - Returns if the CURRENT USER is a system/adminstrative user
	 *
	 * @return {boolean}
	 */
	isSystemUser:function(siteid){
		siteid=siteid || Mura.siteid;
		var a=this.get('memberships');
		if(!Array.isArray(a)){
			console.log('Method design for use with currentuser() only');
			return false;
		}
		return (this.isAdminUser() || a.indexOf("S2IsPrivate;" + siteid ) >= 0);
	},

	/**
	 * isLoggedIn - Returns if the CURRENT USER is logged in
	 *
	 * @return {boolean}
	 */
	isLoggedIn:function(){
		var a=this.get('isloggedin');
		if(a===''){
			return false;
		} else {
			return a;
		}
	}
});
