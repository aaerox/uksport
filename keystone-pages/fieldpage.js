/*!
 * Module dependencies.
 */

var _ = require('underscore'),
	keystone = require('keystone'),
	util = require('util'),
	utils = require('keystone-utils'),
	super_ = require('keystone/lib/field');

/**
 * Page FieldType Constructor
 * @extends Field
 * @api public
 */

function page(list, path, options) {
	// TODO: implement filtering, hard-coded as disabled for now
	options.nofilter = true;

	options.templateDir = __dirname + '/templates/fields/page/';

	page.super_.call(this, list, path, options);

}

/*!
 * Inherit from Field
 */

util.inherits(page, super_);


/**
 * Registers the field on the List's Mongoose Schema.
 *
 * @api public
 */

page.prototype.addToSchema = function() {

	var schema = this.list.schema;

	var paths = this.paths = {
		ref: this._path.append('.ref'),
		refType: this._path.append('.refType')
	};

	schema.nested[this.path] = true;
	schema.add({
		ref: keystone.mongoose.Schema.Types.ObjectId,
		refType: String
	}, this.path + '.');

	schema.virtual('isValid').get(function () {
		return this.ref !== undefined;
	});

	this.bindUnderscoreMethods();
};

/**
 * Validates that a value for this field has been provided in a data object
 *
 * @api public
 */

page.prototype.validateInput = function(data, required, item) {

	if (!required) return true;
	if (!(this.path in data) && item && item.get(this.path)) return true;

	if ('string' === typeof data[this.path]) {
		return (data[this.path].trim()) ? true : false;
	} else {
		return (data[this.path]) ? true : false;
	}

};


/**
 * Updates the value for this field in the item from a data object.
 * Only updates the value if it has changed.
 * Treats an empty string as a null value.
 *
 * @api public
 */

page.prototype.updateItem = function(item, data) {

	if (!(this.path in data)) {
		return;
	}

	if (item.populated(this.path)) {
		throw new Error('fieldTypes.page.updateItem() Error - You cannot update populated pages.');
	}

	if (data[this.path]) {
		if (data[this.path] !== item.get(this.path)) {
			item.set(this.path, data[this.path]);
		}
	} else if (item.get(this.path)) {
		item.set(this.path, null);
	}
};


/**
 * Returns true if the page configuration is valid
 *
 * @api public
 */

Object.defineProperty(page.prototype, 'isValid', {
	get: function() {
		return true;//keystone.list(this.options.ref) ? true : false;
	}
});


/*!
 * Export class
 */

exports = module.exports = page;
