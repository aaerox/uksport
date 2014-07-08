module.exports = {
	// When production is disabled minification isn't performed.
	"production": true,
	"prototyping": false,

	// Automatically check out files that are under TFS source control and need to be written to 
	"useTFS": false,

	// Folder paths to relevant assets.
	"css_folder": "public/css",
	"js_folder": "public/js",
	"scss_folder": "public/scss",			// Remove me to disable sass
	"coffee_folder": "public/coffee",		// Remove me to disable coffeescript
	
	"img_folder": "public/img",
	//"icon_folder": "public/img/icons",	// Automatically adds icons in this folder to the stylesheet
	
	// If you want to use ruby sass (albeit slower) for compatibility reasons, then enable this option.
	"use_rubysass": true,

	// Are we using requirejs to build our js output?
	"use_requirejs": true, 

	// The name of the concatenated app file to generate. 
	//'app' will generate app.js and app.min.js in production.
	"script_appfile": "app",
	
	// If you want additional javascript added to your single app file, specify your scripts folder location.
	// Don't make this the same as your js_folder as that's just for output, not working code.
	"javascript_appfolder": "public/scripts",

	// Set to false to avoid using bower altogether. This will speed up cycle a decent amount.
	// Bower will copy all your required .css and .js files into vendor.css and vendor.js.
	// Your bower.json must be present in your project root (the directory you run cycle from).
	"bower_enabled": true,

	// Use this to override cycle if it isn't copying the particular 
	// bower components that you require.
	"bower_files": {
		// Example
		/*"packery": {
			files: [ 
				"dist/packery.pkgd.js" 
			]
		}*/
	},

	// Use this to specific bower components which should be included before anything else.
	"bower_priorities": [
		"requirejs.js",
		"jquery.js"
	]
};
