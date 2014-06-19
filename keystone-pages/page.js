var keystone = require('keystone'),
	List = keystone.List,
	Types = keystone.Field.Types,
	keystonePages = require('./');
	

var Page = function (key, options, template) {

	List.prototype.constructor.call(this, key, options);

	// Add standard page values
	this.add('Page', {
		page: {
			title: { type: Types.Text, required: true, initial: true, label: 'Title' },
			path: { type: Types.Text, required: true, initial: true, label: 'Path' },
			parent: { type: Types.Page, initial: true, label: 'Parent' },
			templatePath: { type: Types.Text, required: true, hidden: true, default: template }
		}
	});

	keystonePages.router.registerPageType(this);
	
	this.isPage = true;

	// We have to reset our constructor to fool keystone
	this.constructor = List;
};

// A page is a limited version of a keystone list
Page.prototype = Object.create(List.prototype);
Page.prototype.constructor = Page;

// Export the class
exports = module.exports = Page;
