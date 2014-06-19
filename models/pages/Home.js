var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Home Page Model
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
		title: { type: String, required: true, label: 'Title' },
		copy: { type: Types.Html, wysiwyg: true, required: true, label: 'Copy' }
	}
});

/*Home.schema.virtual('content.full').get(function() {
	return this.content.extended || this.content.brief;
});*/

//Home.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
Home.register();
