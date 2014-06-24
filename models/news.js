var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * News Model
 * ==========
 */

var News = new keystone.List('News');

// Main event data
News.add('News', {
	name: { type: String, label: 'Name', require: true, initial: true },
	date: { type: Types.Datetime, default: Date.now },
	tag: { type: String, label: 'Tag', initial: true },
	text: { type: String, label: "Text" },
	image: { type: Types.CloudinaryImage, label: "Image" },
	imagePosition: { type: Types.Select, label: "Image Position", options: 'top, bottom', default: 'bottom' }
});


/**
 * Registration
 */

News.defaultColumns = 'tag, date, text';
News.register();
