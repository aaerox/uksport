###--------------------------------------------------- 
		Handles the events listing
---------------------------------------------------###
define "component/event-listing", [], () ->

	class EventListing


		constructor: (element) ->
			new Packery element,
				itemSelector: '.event'
				gutter: 10
