var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * The one and only home page
 * ==========
 */

var Patterns = new keystone.Page('PagePatterns', {
	label: "Patterns",
	path: "patterns",
	autokey: { path: 'slug', from: 'title', unique: true }
}, 'pattern');

Patterns.register();
