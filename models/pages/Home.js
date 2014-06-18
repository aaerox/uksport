var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Home Page Model
 * ==========
 */

var Home = new keystone.Page('PageHome', {
	label: "Home",
	path: "pages-home",
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true }
});

Home.add({
	banner: {
		title: { type: String, required: true },
		subtitle: { type: String, required: true },
		image: { type: Types.CloudinaryImage, required: true },
		blurb: { type: String, require: false }
	},
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
