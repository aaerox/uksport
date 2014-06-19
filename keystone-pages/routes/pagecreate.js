var keystone = require('keystone');

exports = module.exports = function(req, res) {

	// Find the list type
	keystone.render(req, res, 'pageCreate', {
	});

};
