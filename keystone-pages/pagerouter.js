var fs = require('fs'),
	async = require('async');


var PageRouter = function (keystone) {
	this.keystone = keystone;

	this.pageTypes = [];

	this.pageIdMap = null;
	this.pagePathTree = null;
};


/**
 * Handles page related server requests
 */
PageRouter.prototype.middleware = function (req, res, next) {
	
	// Attempt to match it to a page
	var components = req.path.split('/');
	var subTree = this.pagePathTree;
	var node;

	for (var i=1; i < components.length; ++i) {
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

	// Did we match a page?
	if (node !== null) {
		res.locals.page = node.page;

		var view = new this.keystone.View(req, res);

		// TODO: Verify templatePath

		view.render(node.page.page.templatePath);
	}
	else
		next();
};


/**
 * Registers a type of page with keystone
 */
PageRouter.prototype.registerPageType = function (pageType) {
	
	// Listen for page events
	pageType.schema.post('init', function (doc) {
		console.log('%s has been initialized from the db', doc._id);
	});

	pageType.schema.post('validate', function (doc) {
		console.log('%s has been validated (but not saved yet)', doc._id);
	});

	pageType.schema.post('save', function (doc) {
		console.log('%s has been saved', doc._id);
	});

	pageType.schema.post('remove', function (doc) {
		console.log('%s has been removed', doc._id);
	});

	// Add it to our list of page types
	this.pageTypes.push(pageType);
};


/**
 * Adds a page's route to the routing index
 */
PageRouter.prototype.buildPageIndex = function (done) {

	// Build a list of all pages from all page types
	var self = this;

	async.map(this.pageTypes, function (pageType, callback) {

		// Find all pages of this type
		pageType.model.find({}, function (err, typePages) {
			if (err)
				callback(err);
			else
				callback(null, typePages);
		});

	}, function(err, pageTypes) {

		if (err)
			return done(err);

		// Build an ID map from our pages
		pageIdMap = {};
		
		pageTypes.forEach(function (pages) {
			pages.forEach(function (page) {
				pageIdMap[page.id] = page;
			});
		});

		// Build a path tree from our pages
		function resolvePage(page) {
			// Is it a child page?
			var path = [];

			if (page.page.parent) {
				var parent = pageIdMap[page.page.parent];
				if (!parent)
					done("Unable to resolve page parent '" + page.page.parent + "'.");

				// Only root pages may have the blank route
				if (page.page.path === '/')
					done("Only root pages may have a blank path.");

				path.concat(resolvePage(parent));
				path.push({ path: page.page.path.toLowerCase(), page: page });
			}
			else {
				// Root page?
				if (page.page.path === '/')
					path.push({ path: '', page: page });
				else
					path.push({ path: page.page.path.toLowerCase(), page: page });
			}

			// Add the path to the tree
			var subTree = pagePathTree;

			path.forEach(function (node) {
				if (!(node.path in subTree)) {
					subTree[node.path] = {
						page: node.page,
						tree: {}
					};
				}

				subTree = subTree[node.path].tree;
			});
		}

		pagePathTree = {};

		pageTypes.forEach(function (pages) {
			pages.forEach(resolvePage);
		});

		// All good!
		self.pageIdMap = pageIdMap;
		self.pagePathTree = pagePathTree;
		done();
	});
};


/**
 * Adds a page's route to the routing index
 */
PageRouter.prototype.addPageRoute = function (page) {
	
};


/**
 * Registers routes used for the keystone CMS
 */
PageRouter.prototype.routes = function (app) {
	
};


// Export our class
module.exports = exports = PageRouter;
