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
	type: { type: Types.Select, options: 'news, event, funding, link', label: 'Type', required: true, initial: true },
	tag: { type: String, label: 'Tag', initial: true }
});

// News event type
Event.add({ heading: 'News', dependsOn: { 'type': 'news' }}, {
	news: {
		text: { type: String, label: "Text", dependsOn: { 'type': 'news' } },
		image: { type: Types.CloudinaryImage, label: "Image", dependsOn: { 'type': 'news' } },
		imagePosition: { type: Types.Select, label: "Image Position", options: 'top, bottom', default: 'bottom', dependsOn: { 'type': 'news' } }
	}
});

// Funding event type
Event.add({ heading: 'Funding', dependsOn: { 'type': 'funding' }}, {
	funding: {
		event: { type: String, label: "Event Name", dependsOn: { 'type': 'funding' } },
		text: { type: String, label: "Text", dependsOn: { 'type': 'funding' } },
		targetNum: { type: Number, label: "Medal Target", dependsOn: { 'type': 'funding' } }
	}
});

/**
 * Registration
 */

Event.defaultColumns = 'type, tag';
Event.register();
