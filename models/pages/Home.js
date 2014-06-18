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
}, 'home', true);

Home.add({
	banner: require('../partials/Banner'),
	whatWeDo: {
		title: { type: String, required: true },
		copy: { type: Types.Html, wysiwyg: true, required: true }
	}
});

/*Home.schema.virtual('content.full').get(function() {
	return this.content.extended || this.content.brief;
});*/

//Home.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
Home.register();
