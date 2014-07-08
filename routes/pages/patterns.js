var _ = require('underscore'),
	async = require('async'),
	keystone = require('keystone'),
	Design = keystone.list('Design');


function loadDesigns(callback) {
	var q = Design.model.find().limit(10);

	q.exec(function(err, results) {
		callback(err, results);
	});
}


exports = module.exports = function(req, res) {
	
	var locals = res.locals,
		view = new keystone.View(req, res);

	view.on('init', function (next) {
		// Retrieve all the data we require
		async.parallel({
			designs: loadDesigns
		}, function(err, results) {
			
			if (err) {
				return next(err);
			}
			
			locals.designs = results.designs;
			locals.useStamps = true;

			next();
		});
	});

	// Render the view
	view.render('patterns');
};
