var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Design Model
 * ==========
 */

var Design = new keystone.List('Design');

Design.add({
	author: { type: String, required: true },
	imageUrl: { type: String, required: true },
	photoId: { type: Number, required: true },
	link: { type: String, required: true }
});

/*Design.schema.add({
	palette: { type: keystone.mongoose.Schema.Types.Mixed, required: true }
});*/

/**
 * Registration
 */

Design.defaultColumns = 'author, link';
Design.register();
