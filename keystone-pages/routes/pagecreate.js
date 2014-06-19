var keystone = require('keystone');

function renderAddForm(req, res, pageType) {
	keystone.render(req, res, 'pageCreate', {
		list: pageType,
		parent: req.body.parent,
		pageType: req.body.pageType,
		parentType: req.body.parentType,
		submitted: req.body || {}
	});
}

exports = module.exports = function(req, res) {

	if (!req.body.pageType) {
		req.flash('error', 'Invalid request.');
		return res.redirect('/keystone/');
	}

	// Attempt to resolve the page and parent types
	var pageType = keystone.list(req.body.pageType);
	if (!pageType || !pageType.isPage) {
		req.flash('error', 'Invalid page type "' + req.body.pageType + '".');
		return res.redirect('/keystone/');
	}

	var parentType = keystone.list(req.body.parentType);
	if (!parentType || !parentType.isPage) {
		req.flash('error', 'Invalid page type "' + req.body.parentType + '".');
		return res.redirect('/keystone/');
	}

	parentType.model.findById(req.body.parent).exec(function(err, parent) {
		
		if (!parent) {
			req.flash('error', 'Parent page could not be found.');
			return res.redirect('/keystone/');
		}

		switch (req.body.action) {
			case 'add':
			{	
				// Just render the correct page create form
				renderAddForm(req, res, pageType);
				break;
			}

			case 'create':
			{
				// Attempt to create the page
				var newPage = new pageType.model();

				newPage.page.parent.ref = parent.id;
				newPage.page.parent.refType = parentType.key;

				var updateHandler = newPage.getUpdateHandler(req);

				updateHandler.process(req.body, {
					flashErrors: true,
					logErrors: true,
					fields: pageType.initialFields
				}, function(err) {
					if (err) {
						renderAddForm(req, res, pageType);
						return;
					}

					req.flash('success', 'New ' + pageType.singular + ' ' + pageType.getDocumentName(newPage) + ' created.');
					return res.redirect('/keystone/' + pageType.path + '/' + newPage.id);
				});

				break;
			}
		}
	});
};
