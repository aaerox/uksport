var fs = require('fs');


var KeystonePages = function () {
	this.keystone = null;
	this.templatePathCache = {};

	this.pages = {};
};


/**
 * Handles page related server requests
 */
KeystonePages.prototype.middleware = function (req, res, next) {
	// Dealing with lists?
	if (req.params && req.params.list) {
		// Is it actually a page?
		var page = this.pages[req.params.list];

		// Find the page we're using
		page.model.findOne({}, function (err, singlePage) {
			if (err)
				return next(err);

			// Redirect to the edit page
			res.redirect('/keystone/' + page.path + '/' + page.id);
		});
	}
	else {
		next();
	}
};


/**
 * Registers page related middleware and event handlers
 */
KeystonePages.prototype.register = function (keystone) {
	this.keystone = keystone;
	this.keystone.pages = {};

	// Export our classes
	this.keystone.Page = this.Page;

	// Register our middleware
	this.keystone.pre('routes', this.middleware);

	// Hook the rendering function so that we can use our own CMS templates
	var self = this;
	this._render = this.keystone.render.bind(this.keystone);

	this.keystone.render = function (req, res, view, ext) {
		return self.render(req, res, view, ext);
	};
};


/**
 * Registers a type of page with keystone
 */
KeystonePages.prototype.registerPage = function (page) {
	// Add it to our list of pages
	this.pages[page.path] = page;
};


/**
 * Registers page related middleware and event handlers
 */
KeystonePages.prototype.render = function (req, res, view, ext) {
	// Do we have a path replacement for this view?
	var path = this.templatePathCache[view];

	if (path === undefined) {
		// Attempt to resolve it to one of our templates
		if (fs.existsSync(__dirname + '/templates/views/' + view + '.jade'))
			path = this.templatePathCache[view] = '../../../../keystone-pages/templates/views/' + view;
		else 
			path = null;
	}

	return this._render(req, res, path === null ? view : path, ext);
};


/**
 * The exports object is an instance of KeystonePages.
 */
var keystonePages = module.exports = exports = new KeystonePages();

// Expose classes
keystonePages.Page = require('./page');
