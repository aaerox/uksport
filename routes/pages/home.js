var keystone = require('keystone'),
	Event = keystone.list('Event');


exports = module.exports = function(req, res) {
	
	var locals = res.locals,
		view = new keystone.View(req, res);

	// Init locals
	locals.data = {
		events: []
	};

	// Retrieve some events
	view.on('init', function (next) {
		var q = Event.model.find().sort('date').limit(10);

		q.exec(function(err, results) {
			locals.data.events = results;
			next(err);
		});
	});

	// Render the view
	view.render('home');
};
