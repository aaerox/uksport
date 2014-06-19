var keystone = require('keystone'),
	Types = keystone.Field.Types;
	
// Standard banner configuration
module.exports = exports = function (List) {

	List.add('Banner', {
		banner: {
			title: { type: String, required: true, label: "Title" },
			subtitle: { type: String, required: true, label: "Subtitle" },
			image: { type: Types.CloudinaryImage, required: true, label: "Image" },
			blurb: { type: String, require: false, label: "Blurb" }
		}
	});

};
