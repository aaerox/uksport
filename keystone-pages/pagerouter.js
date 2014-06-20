var _ = require('underscore'),
	fs = require('fs'),
	async = require('async'),
	keystone = require('keystone');


var PageRouter = function () {
	this.pageTypes = [];

	this.pageIdMap = null;
	this.pageTypeMap = null;
	this.pagePathTree = null;

	this.sitemap = null;

	this.routeMap = {};
};


/**
 * Handles page related server requests
 */
PageRouter.prototype.middleware = function (req, res, next) {
	
	// Attempt to match it to a page
	var components = req.path.split('/');

	// Are we in the CMS page editor?
	if (components[1].toLowerCase() == "keystone") {
		// Need to be authed
		if (!req.user || !req.user.canAccessKeystone) {
			next();
		}
		else {
			// Page editor?
			if (components.length > 2 && components[2].toLowerCase() == "page") {
				var relativeComponents = components.slice(3);
				relativeComponents.unshift("");

				var node = this.pathToTreeNode(relativeComponents);

				// Did we match a page?
				if (node !== null) {
					keystone.pages.renderPageEditor(node, req, res);
				}
				else {
					req.flash('error', 'Page ' + components.slice(3).join('/') + ' could not be found.');
					res.redirect('/keystone/');
				}
			}
			else
				next();
		}
	}
	else {
		var node = this.pathToTreeNode(components);

		// Did we match a page?
		if (node !== null) {
			// Standard page locals
			res.locals.page = node.page;
			res.locals.sitemap = this.sitemap;

			// Find our page route
			var route = this.routeMap[node.page.page.templatePath];
			if (!route)
				next("Unable to find page route.");
			else
				route(req, res);
		}
		else
			next();
	}
};


/**
 * Resolves an array of path components to a page tree node
 */
PageRouter.prototype.pathToTreeNode = function (components) {
	// Attempt to match it to a page
	var subTree = this.pagePathTree;
	var node = null;

	for (var i=0; i < components.length; ++i) {
		// Skip blank components (unless it's the first)
		if (components[i] === "" && i != 0)
			continue;

		node = null;

		for (var n in subTree) {
			if (n === components[i].toLowerCase()) {
				node = subTree[n];
				break;
			}
		}

		if (node === null) 
			break;

		subTree = node.tree;
	}

	return node;
};


/**
 * Registers a type of page with keystone
 */
PageRouter.prototype.registerPageType = function (pageType) {
	
	// Listen for page events
	var self = this;

	pageType.schema.post('init', function (doc) {
		console.log('%s has been initialized from the db', doc._id);
	});

	pageType.schema.post('validate', function (doc) {
		console.log('%s has been validated (but not saved yet)', doc._id);
	});

	pageType.schema.post('save', function (doc) {
		console.log('%s has been saved', doc._id);

		// Rebuild the index
		self.buildPageIndex();
	});

	pageType.schema.post('remove', function (doc) {
		console.log('%s has been removed', doc._id);

		// Rebuild the index
		self.buildPageIndex();
	});

	// Add it to our list of page types
	this.pageTypes.push(pageType);
};


/**
 * Builds page map structures based on the current database state
 */
PageRouter.prototype.buildPageIndex = function (done) {

	done = done || function (){};

	// Build a list of all pages from all page types
	var self = this;

	async.map(this.pageTypes, function (pageType, callback) {

		// Find all pages of this type
		pageType.model.find({}, function (err, typePages) {
			if (err)
				callback(err);
			else
				callback(null, { type: pageType, pages: typePages });
		});

	}, function(err, map) {

		if (err)
			return done(err);

		// Build ID and type maps from our pages
		pageIdMap = {};
		pageTypeMap = {};
		
		map.forEach(function (type) {
			type.pages.forEach(function (page) {
				pageIdMap[page.id] = page;
				pageTypeMap[page.id] = type.type;
			});
		});

		// Build a path tree from our pages
		function resolvePage(page) {
			// Attempt to resolve the type
			if (!(page.id in pageTypeMap)) {
				done("Unable to resolve page type for '" + page.id + "'");
				return;
			}

			var type = pageTypeMap[page.id];

			// Is it a child page?
			var path = [];

			if (page.page.parent.ref) {
				var parent = pageIdMap[page.page.parent.ref.toHexString()];
				if (!parent)
					done("Unable to resolve page parent '" + page.page.parent.ref.toHexString() + "'.");

				// Only root pages may have the blank route
				if (page.page.path === '/')
					done("Only root pages may have a blank path.");

				path = path.concat(resolvePage(parent));
				path.push({ path: page.page.path.toLowerCase(), page: page, type: type });
			}
			else {
				// Root page
				var rootPath = page.page.path;

				if (rootPath === "" || rootPath === "/")
					path.push({ path: "", page: page, type: type });
				else
					done("Invalid root page path '" + rootPath + "'.")
			}

			// Add the path to the tree
			var subTree = pagePathTree;

			path.forEach(function (node) {
				if (!(node.path in subTree)) {
					subTree[node.path] = {
						page: node.page,
						type: node.type,
						tree: {}
					};
				}

				subTree = subTree[node.path].tree;
			});

			return path;
		}

		pagePathTree = {};

		map.forEach(function (type) {
			type.pages.forEach(resolvePage);
		});

		// Populate our path tree with parents
		function setParent(node, parent) {
			node.parent = parent;

			for (var path in node.tree) {
				setParent(node.tree[path], node);
			}
		}

		if ("" in pagePathTree)
			setParent(pagePathTree[""], null);

		// All good!
		self.pageIdMap = pageIdMap;
		self.pageTypeMap = pageTypeMap;
		self.pagePathTree = pagePathTree;

		// Quickly build our sitemap
		self.buildSitemap();

		done();
	});
};


/**
 * Constructs a sitemap based on the current page structures
 */
PageRouter.prototype.buildSitemap = function () {

	function getPage(page, path) {
		// Determine our path
		var nodePath = page.page.page.path;
		if (nodePath.lastIndexOf('/', 0) !== 0 && path !== "/")
			nodePath = "/" + nodePath;

		var path = path + nodePath;

		// Build our list of children
		var children = [];

		for (var key in page.tree) {
			children.push(getPage(page.tree[key], path));
		}

		return {
			title: page.page.page.title,
			nav: page.page.page.isNav,
			path: path,
			children: children
		};
	}

	if ("" in pagePathTree)
		this.sitemap = getPage(pagePathTree[""], "")
	else
		this.sitemap = {};
};

/**
 * Adds a page's route to the routing index
 */
PageRouter.prototype.addPageRoute = function (name, route) {
	// Save it to our list
	if (name in this.routeMap)
		console.error("Route " + name + " already in map.");
	else
		this.routeMap[name] = route;
};


/**
 * Registers our router middleware
 */
PageRouter.prototype.register = function () {
	// Register our middleware
	keystone.pre('routes', this.middleware.bind(this));
};


// Export our class
module.exports = exports = PageRouter;
