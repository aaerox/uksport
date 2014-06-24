###--------------------------------------------------- 
		Our app entrypoint which crawls the DOM for components
---------------------------------------------------###
define [], () ->

	# Search the DOM for all required components
	components = $('*[data-component]')

	# Load the component for each
	components.each () ->
		component = $(this).attr('data-component')
		require [component], (compClass) =>
			this.component = new compClass(this)
