function select_handler (sb) {

	var brand_select = document.getElementById("brand-select");
	var hotel_select = document.getElementById("hotel-select");
	var hotel_options = hotel_select.getElementsByTagName("option");

	function INIT () {
		sb.addEvent(brand_select, "change", toggle_hotel_visibility)
	}

	function toggle_hotel_visibility (d) {
		var brand = brand_select.options[brand_select.selectedIndex].value;
		var brand_hyphenated = brand.replace(' ', '-');
		
		var i;
		var l = hotel_options.length;

		if (brand == "0") {
			for (i=1; i<l; i++) {
				utility.addClass(hotel_options[i], "active")
			}
			return;
		};

		for (i=1; i<l; i++) {
			var hotel = hotel_options[i];
			if (utility.containsClass(hotel, brand_hyphenated)) {
				utility.addClass(hotel_options[i], "active")
			} else {
				utility.removeClass(hotel_options[i], "active")
			}
			
		}

	}
	
	function DESTROY () {
		sb.unlisten(this.moduleID)
		notify = null;
	}

	return {
        init : INIT,
        destroy : DESTROY
    };
}