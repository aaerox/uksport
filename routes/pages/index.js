var keystone = require('keystone');

// Add each of our page routes
keystone.pages.router.addPageRoute('home', require('./home'));
keystone.pages.router.addPageRoute('standard', require('./standard'));
