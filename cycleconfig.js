module.exports = {
	// When production is disabled minification isn't performed.
	"production": true,

	// Prototyping is used to develop static HTML files before the back-end is
	// deployed. http://localhost:3000 should point to your HTML files in the 
	// root of your project.
	"prototyping": true,
	"prototypes": {
		"root": "./",			// The path to our static HTML files
		"port": 3000,			// The port to run the webserver on
		"livereload": true,		// Whether to use livereload to refresh content
		"templates": ""			// The template engine to use, blank for none.

		// See https://github.com/visionmedia/consolidate.js/#supported-template-engines for supported template engine list.
		// Any template engines need to be installed globally, i.e. 'npm install hamljs -g', 'npm install jade -g'
	},

	// Automatically check out files that are under TFS source control and need to be written to 
	"useTFS": true,

	// Folder paths to relevant assets.
	"css_folder": "assets/css",
	"js_folder": "assets/js",
	"scss_folder": "assets/scss",			// Remove me to disable sass
	"coffee_folder": "assets/coffee",		// Remove me to disable coffeescript
	
	"img_folder": "assets/img",
	//"icon_folder": "assets/img/icons",	// Automatically adds icons in this folder to the stylesheet
	
	// If you want to use ruby sass (albeit slower) for compatibility reasons, then enable this option.
	"use_rubysass": false,

	// Are we using requirejs to build our js output?
	"use_requirejs": true, 

	// The name of the concatenated app file to generate. 
	//'app' will generate app.js and app.min.js in production.
	"script_appfile": "app",
	
	// If you want additional javascript added to your single app file, specify your scripts folder location.
	// Don't make this the same as your js_folder as that's just for output, not working code.
	"javascript_appfolder": "assets/scripts",

	// The path to the sitecore project for syncing changes.
	// If this is removed then no syncing will be performed.
	"sitecore_path" : "C:/Sitecore/HelloWorld/Website",

	// Set to false to avoid using bower altogether. This will speed up cycle a decent amount.
	// Bower will copy all your required .css and .js files into vendor.css and vendor.js.
	// Your bower.json must be present in your project root (the directory you run cycle from).
	"bower_enabled": true,

	// Use this to override cycle if it isn't copying the particular 
	// bower components that you require.
	"bower_files": {
		// Example
		/*"modernizr": {
			files: [ 
				"modernizr.js" 
			]
		}*/
	},

	// Use this to specific bower components which should be included before anything else.
	"bower_priorities": [
		"jquery.js"
	]
};
