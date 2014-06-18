var keystone = require('keystone'),
	Types = keystone.Field.Types;
	
// Standard banner configuration
module.exports = exports =  {
	title: { type: String, required: true },
	subtitle: { type: String, required: true },
	image: { type: Types.CloudinaryImage, required: true },
	blurb: { type: String, require: false }
};
