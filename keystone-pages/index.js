var fs = require('fs'),
	PageRouter = require('./pagerouter.js');


var KeystonePages = function () {
	this.keystone = null;
	this.templatePathCache = {};
};


/**
 * Registers page related middleware and event handlers
 */
KeystonePages.prototype.register = function (keystone) {
	this.keystone = keystone;
	this.router = new PageRouter(keystone);

	// Export our classes and types
	this.keystone.Page = this.Page;
	this.keystone.Field.Types.Page = require('./fieldpage');

	// Register our middleware
	this.keystone.pre('routes', this.router.middleware.bind(this.router));

	// Hook the routes function so that we can override CMS routes
	this._routes = this.keystone.routes.bind(this.keystone);
	this.keystone.routes = this.routes.bind(this);

	// Hook the rendering function so that we can use our own CMS templates
	this._render = this.keystone.render.bind(this.keystone);
	this.keystone.render = this.render.bind(this);
};


/**
 * Registers routes used for the keystone CMS
 */
KeystonePages.prototype.routes = function (app) {
	
	// Page creation route
	app.all('/keystone/page-create/', require('./routes/pagecreate'));

	return this._routes(app);
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
