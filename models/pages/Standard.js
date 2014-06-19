var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * A default standard content page
 * ==========
 */

var Standard = new keystone.Page('PageStandard', {
	label: "Standard",
	path: "standard",
	autokey: { path: 'slug', from: 'title', unique: true }
}, 'standard');

require('../partials/Banner')(Standard);

Standard.add('Content', {
	body: {
		subtitle: { type: String, label: 'Subtitle' },
		text: { type: Types.Html, wysiwyg: true, label: 'text' }
	}
});

Standard.register();
