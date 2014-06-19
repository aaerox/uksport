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

	this.filters = options.filters;
	this._nativeType = keystone.mongoose.Schema.Types.ObjectId;

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

/*page.prototype.addToSchema = function() {

	var field = this,
		schema = this.list.schema;

	this.paths = {
		refList: this.options.refListPath || this._path.append('RefList')
	};

	var def = {
		type: this._nativeType,
		ref: this.options.ref
	};

	schema.path(this.path, def);

	schema.virtual(this.paths.refList).get(function () {
		return keystone.list(field.options.ref);
	});


	this.bindUnderscoreMethods();

};*/

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


/**
 * Whether the field has any filters defined
 *
 * @api public
 */

Object.defineProperty(page.prototype, 'hasFilters', {
	get: function() {
		return (this.filters && _.keys(this.filters).length);
	}
});


/**
 * Adds page filters to a query
 *
 * @api public
 */

page.prototype.addFilters = function(query, item) {

	_.each(this.filters, function(filters, path) {
		if (!utils.isObject(filters)) {
			filters = { equals: filters };
		}
		query.where(path);
		_.each(filters, function(value, method) {
			if ('string' === typeof value && value.substr(0,1) === ':') {
				if (!item) {
					return;
				}
				value = item.get(value.substr(1));
			}
			query[method](value);
		});
	});

};


/*!
 * Export class
 */

exports = module.exports = page;
