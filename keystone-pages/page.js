var keystonePages = require('./'),
	List = require('keystone').List;

var Page = function (key, options) {
	List.prototype.constructor.call(this, key, options);

	keystonePages.registerPage(this);
	
	// We have to reset our constructor to fool keystone
	this.constructor = List;
};

// A page is a limited version of a keystone list
Page.prototype = Object.create(List.prototype);
Page.prototype.constructor = Page;

// Export the class
exports = module.exports = Page;
