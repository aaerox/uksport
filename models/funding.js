var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Funding Model
 * ==========
 */

var Funding = new keystone.List('Funding');

// Main event data
Funding.add('Funding', {
	name: { type: String, label: 'Name', require: true, initial: true },
	date: { type: Types.Datetime, default: Date.now },
	fundingTarget: { type: String, label: 'Funding Target' },
	tag: { type: String, label: 'Tag', initial: true },
	cost: { type: String, label: "Cost" },
	medalTarget: { type: Number, label: "Medal Targets" }
});


/**
 * Registration
 */

Funding.defaultColumns = 'tag, date, text';
Funding.register();
