var _ = require('underscore'),
	fs = require('fs'),
	async = require('async'),
	PageRouter = require('./pagerouter.js'),
	keystone = require('keystone');


var KeystonePages = function () {
	this.templatePathCache = {};
};


/**
 * Registers page related middleware and event handlers
 */
KeystonePages.prototype.register = function () {
	keystone.pages = this;

	this.router = new PageRouter();

	// Export our classes and types
	keystone.Page = this.Page;
	keystone.Field.Types.Page = require('./fieldpage');

	// Hook the routes function so that we can override CMS routes
	this._routes = keystone.routes.bind(keystone);
	keystone.routes = this.routes.bind(this);

	// Hook the rendering function so that we can use our own CMS templates
	this._render = keystone.render.bind(keystone);
	keystone.render = this.render.bind(this);
};


/**
 * Registers routes used for the keystone CMS and pages
 */
KeystonePages.prototype.routes = function (app) {
	
	// Page creation route
	app.all('/keystone/page-create/', keystone.session.keystoneAuth, require('./routes/pagecreate'));

	return this._routes(app);
};


/**
 * Registers page related middleware and event handlers
 */
KeystonePages.prototype.render = function (req, res, view, ext) {
	// Always have access to the sitemap
	ext.sitemap = this.router.sitemap; 

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
 * Renders the CMS page editor view for a specified page node
 */
KeystonePages.prototype.renderPageEditor = function (node, req, res) {
	var item = node.page;
	var list = node.type;

	if (!item) {
		req.flash('error', 'Page could not be edited.');
		return res.redirect('/keystone/');
	}
	
	var viewLocals = {
		validationErrors: {},
		pageTypes: this.router.pageTypes
	};
	
	
	function getPath(node) {
		var path = node.parent === null ? "" : getPath(node.parent);
		var nodePath = node.page.page.path;

		if (nodePath.lastIndexOf('/', 0) !== 0 && path !== "/")
			nodePath = "/" + nodePath;

		return path + nodePath;
	}

	// Build our page path drilldown
	var pagePath = [];
	var pathNode = node.parent;

	while (pathNode) {
		pagePath.unshift({
			href: '/keystone/page' + getPath(pathNode),
			title: pathNode.page.page.title
		});

		pathNode = pathNode.parent;
	}

	viewLocals.pagePath = pagePath;

	// Build our page child list
	var pageChildren = [];

	for (var path in node.tree) {
		var child = node.tree[path];

		pageChildren.push({
			href: '/keystone/page' + getPath(child),
			title: child.page.page.title
		});
	};

	viewLocals.pageChildren = pageChildren;

	// Render our view safely
	var renderView = function() {
		
		var	loadFormFieldTemplates = function(cb){
			var onlyFields = function(item) { return item.type === 'field'; };
			var compile = function(item, callback) { item.field.compile('form',callback); };
			async.eachSeries(list.uiElements.filter(onlyFields), compile , cb);
		};
		
		
		/** Render View */
		
		async.parallel([
			loadFormFieldTemplates
		], function(err) {
			
			// TODO: Handle err
			
			keystone.render(req, res, 'page', _.extend(viewLocals, {
				section: keystone.nav.by.list[list.key] || {},
				title: 'Keystone: ' + list.singular + ': ' + list.getDocumentName(item),
				page: 'item',
				list: list,
				item: item
			}));
			
		});
	};
	
	if (req.method === 'POST' && req.body.action === 'updateItem' && !list.get('noedit')) {
		
		if (!keystone.security.csrf.validate(req)) {
			req.flash('error', 'There was a problem with your request, please try again.');
			return renderView();
		}
		
		item.getUpdateHandler(req).process(req.body, { flashErrors: true, logErrors: true }, function(err) {
			if (err) {
				return renderView();
			}

			req.flash('success', 'Your changes have been saved.');
			return res.redirect(req.path);
		});
		
	} else {
		renderView();
	}
};


/**
 * The exports object is an instance of KeystonePages.
 */
var keystonePages = module.exports = exports = new KeystonePages();

// Expose classes
keystonePages.Page = require('./page');
