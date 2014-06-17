/**
 * This script automatically creates a default Admin user when an
 * empty database is used for the first time. You can use this
 * technique to insert data into any List you have defined.
 */

exports.create = {
	PageHome: [
		{
			banner: {
				title: "London 2012",
				subtitle: "Success Stories",
				blurb: "Record investment from UK Sport for the 30th Olympiad, firing UK athletes to gold."
			},
			whatWeDo: {
				title: "What we do",
				copy: "UK Sport is the nation's high performance sports agency responsible for investing over £100 million per year in Britain's best Olympic and Paralympic atheletes."
			}
		}
	]
};

/**
 * The following is the older version of this update script, it is
 * left here for reference as an example of how more complex updates
 * can be structured.
 */
/*
var keystone = require('keystone'),
	async = require('async'),
	User = keystone.list('User');

var admins = [
	{ email: 'user@keystonejs.com', password: 'admin', name: { first: 'Admin', last: 'User' } }
];

function createAdmin(admin, done) {
	
	var newAdmin = new User.model(admin);
	
	newAdmin.isAdmin = true;
	newAdmin.save(function(err) {
		if (err) {
			console.error("Error adding admin " + admin.email + " to the database:");
			console.error(err);
		} else {
			console.log("Added admin " + admin.email + " to the database.");
		}
		done(err);
	});
	
}

exports = module.exports = function(done) {
	async.forEach(admins, createAdmin, done);
};
*/
