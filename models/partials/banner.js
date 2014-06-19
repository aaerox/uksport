var keystone = require('keystone'),
	Types = keystone.Field.Types;
	
// Standard banner configuration
module.exports = exports = function (List) {

	List.add('Banner', {
		banner: {
			title: { type: String, label: "Title" },
			subtitle: { type: String, label: "Subtitle" },
			image: { type: Types.CloudinaryImage, label: "Image" },
			blurb: { type: String, label: "Blurb" }
		}
	});

};
