var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * The one and only home page
 * ==========
 */

var Home = new keystone.Page('PageHome', {
	label: "Home",
	path: "home",
	autokey: { path: 'slug', from: 'title', unique: true }
}, 'home');

require('../partials/Banner')(Home);

Home.add('What We Do', {
	whatWeDo: {
		title: { type: String, label: 'Title' },
		copy: { type: Types.Html, wysiwyg: true, label: 'Copy' }
	}
});

Home.register();
