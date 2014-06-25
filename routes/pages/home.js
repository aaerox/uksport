var _ = require('underscore'),
	async = require('async'),
	keystone = require('keystone'),
	Event = keystone.list('Event'),
	News = keystone.list('News'),
	Funding = keystone.list('Funding'),
	Post = keystone.list('Post');


function loadEvents(callback) {
	var q = Event.model.find().sort('-date').limit(10);

	q.exec(function(err, results) {
		callback(err, results);
	});
}

function loadNews(callback) {
	var q = News.model.find().sort('-date').limit(10);

	q.exec(function(err, results) {
		callback(err, results);
	});
}

function loadFunding(callback) {
	var q = Funding.model.find().sort('-date').limit(10);

	q.exec(function(err, results) {
		callback(err, results);
	});
}

function loadBlog(callback) {
	var q = Post.model.find({ 'state': 'published' }).sort('-publishedDate').limit(2).populate('author');

	q.exec(function(err, results) {
		callback(err, results);
	});
}

exports = module.exports = function(req, res) {
	
	var locals = res.locals,
		view = new keystone.View(req, res);

	// Init locals
	locals.data = {
		items: [],
		blogPosts: []
	};

	view.on('init', function (next) {
		// Retrieve all the data we require
		async.parallel({
			events: loadEvents,
			news: loadNews,
			funding: loadFunding,
			blog: loadBlog
		}, function(err, results) {
			
			if (err) {
				return next(err);
			}

			// Create an array of items
			results.events.forEach(function (event) {
				locals.data.items.push({
					type: 'event',
					date: event.date,
					event: event
				});
			});

			results.news.forEach(function (item) {
				locals.data.items.push({
					type: 'news',
					date: item.date,
					news: item
				});
			});

			results.funding.forEach(function (item) {
				locals.data.items.push({
					type: 'funding',
					date: item.date,
					funding: item
				});
			});

			locals.data.items = _.sortBy(locals.data.items, function (item) {
				return -item.date;
			});
			
			locals.data.blogPosts = results.blog;

			next();
		});
	});

	// Render the view
	view.render('home');
};
