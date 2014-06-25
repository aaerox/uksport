var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Event Model
 * ==========
 */

var Event = new keystone.List('Event');

// Main event data
Event.add('Event', {
	name: { type: String, label: 'Name', require: true, initial: true },
	date: { type: Types.Datetime, default: Date.now },
	tag: { type: String, label: 'Tag', initial: true },
	text: { type: String, label: "Text" },
	image: { type: Types.CloudinaryImage, label: "Image" },
	imagePosition: { type: Types.Select, label: "Image Position", options: 'top, bottom', default: 'bottom' },
	location: { type: String, label: 'Event Location' },
	eventDate: { type: String, label: 'Event Date' }
});


/**
 * Registration
 */

Event.defaultColumns = 'tag, date, text';
Event.register();
