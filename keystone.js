// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').load();

// Require keystone
var keystone = require('keystone');
var keystonePages = require('./keystone-pages');

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

keystone.init({
	
	'name': 'UK Sport',
	'brand': 'UK Sport',
	
	'static': 'public',
	'favicon': 'public/favicon.ico',
	
	'views': 'templates/views',
	'view engine': 'jade',
	
	'auto update': true,
	
	'session': true,
	'auth': true,
	'user model': 'User',
	'cookie secret': '.,OTT||;Dq@,54W_z`_f)E,;"K0="/t-S~)X!O<-PCO~/ZO2[=m5J&&6X8|3(a4('
	
});

// Load our page functionality
keystonePages.register();

// Load our project's Models
keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js

keystone.set('locals', {
	_: require('underscore'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable
});

// Don't cache jade templates if we're developing
if (process.env.NODE_ENV == "development")
	keystone.set('view cache', false);

// Load your project's Routes

keystone.set('routes', require('./routes'));

// Setup common locals for your emails. The following are required by Keystone's
// default email templates, you may remove them if you're using your own.

// Configure the navigation bar in Keystone's Admin UI

keystone.set('nav', {
	'events': 'events'
});

// Build our page data
keystonePages.router.buildPageIndex(function (err) {
	if (err) {
		console.log('Error building page index:');
		console.log(err);
		return;
	}
});

// Start Keystone to connect to your database and initialise the web server
keystone.start();


