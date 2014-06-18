var keystone = require('keystone'),
	List = keystone.List,
	Types = keystone.Field.Types,
	keystonePages = require('./');
	

var Page = function (key, options, template, singular) {
	// Enforce singular options
	if (singular) {
		options["nocreate"] = options["nodelete"] = true;
	}

	List.prototype.constructor.call(this, key, options);

	// Add standard page values
	this.add({
		page: {
			title: { type: Types.Text, required: true, initial: true },
			path: { type: Types.Text, required: true, initial: true },
			parent: { type: Types.Relationship, ref: 'Page', initial: true },
			templatePath: { type: Types.Text, required: true, hidden: true, default: template }
		}
	});

	keystonePages.registerPage(this);
	
	this.isPage = true;
	this.isSingularPage = singular;

	// We have to reset our constructor to fool keystone
	this.constructor = List;
};

// A page is a limited version of a keystone list
Page.prototype = Object.create(List.prototype);
Page.prototype.constructor = Page;

// Export the class
exports = module.exports = Page;
