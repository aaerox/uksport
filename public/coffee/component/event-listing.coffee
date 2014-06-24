###--------------------------------------------------- 
		Handles the events listing
---------------------------------------------------###
define "component/event-listing", ["packery/packery"], (Packery) ->

	class EventListing


		constructor: (element) ->
			new Packery element,
				itemSelector: '.event'
				gutter: 10
