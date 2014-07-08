var keystone = require('keystone');

// Add each of our page routes
keystone.pages.router.addPageRoute('patterns', require('./patterns'));
