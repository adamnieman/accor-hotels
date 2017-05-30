var index = {

}

index.conversion_lookup = {
	mass: [
		{unit: "g", m: 1000},
		{unit: "kg", m: 1},
		{unit: "t", m: 0.001},
	],
	length: [
		{unit: "mm", m: 1000},
		{unit: "cm", m: 100},
		{unit: "m", m: 1},
		{unit: "km", m: 0.001},
	],
	volume: [
		{unit: "cm<sup>3</sup>", m: 1000000},
		{unit: "m<sup>3</sup>", m: 1},
		{unit: "km<sup>3</sup>", m: 0.000001},
	],
	power: [
		{unit: "W", m: 1000},
		{unit: "kW", m: 1},
		{unit: "MW", m: 0.001},
		{unit: "TW", m: 0.000000001},
	],
	energy: [
		{unit: "Wh", m: 1000},
		{unit: "kWh", m: 1},
		{unit: "MWh", m: 0.001},
		{unit: "TWh", m: 0.000000001},
	],
}


index.Converter = function (_type, _value, _unit) {

	var value = null;
	var converstion_type = null;
	var conversion_lookup = null;

	var construct = function (_type, _value, _unit) {

		if (debug.sentinel(_type, "Empty converstion type value passed to Converter.") ||
			debug.sentinel(index.conversion_lookup.hasOwnProperty(_type), "Invalid conversion type '"+_type+"' passed to Converter.") ||
			debug.sentinel(utility.check_numeric(_value), "Invalid (non-numerical) value passed to Converter.")) {
			//debug.sentinel(index.conversion_lookup[_type].hasOwnProperty(_value), "Invalid unit '"+_unit+"' passed to Converter.")) {
			return;
		}

		conversion_type = _type;
		conversion_lookup = index.conversion_lookup[_type];

		var C = conversion_lookup.filter(function (a) {
			return a.unit == _unit;
		})[0];

		value = C ? _value/C.m : _value;
	}

	this.get_result = function (_unit) {
		var C;

		if (_unit) {
			C = conversion_lookup.filter(function (a) {
				return a.unit == _unit;
			})[0];
		}

		if (!C) {
			C = conversion_lookup[0];
			conversion_lookup.forEach(function (a) {
				if (value*a.m >= 0.1) {
					C = a;
				}
			})
		}

		return {
			value: value*C.m,
			unit: C.unit
		}
	}

	this.get_result_string = function (_unit) {

		var result = this.get_result(_unit);


		return utility.add_commas(utility.round(result.value, 2))+" "+result.unit;
	}

	construct (_type, _value, _unit);
}

index.Three_scene = function (_wrapper) {

	var set = false;
	var wrapper;

	var scene;
	var camera;
	var renderer;
	var lights = {}
	var groups = {}
	var materials = {}
	var fonts = {}
	var w = 100;

	function construct (_wrapper) {
		if (debug.sentinel(utility.is_element(_wrapper), "Failed to initialise scene as wrapper is not a valid DOM object.")) {
			return;
		}
		wrapper = _wrapper;

		set_scene();
		set_renderer();

		wrapper.appendChild(renderer.domElement);
	}

	function set_scene () {
		scene = new THREE.Scene();
	}

	function set_renderer () {
		renderer = new THREE.WebGLRenderer({preserveDrawingBuffer: true, antialias: true });
		renderer.setClearColor(new THREE.Color(0xeeeeee));
		renderer.setSize(wrapper.offsetWidth, wrapper.offsetHeight);
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		check_if_set();
	}

	this.set_light = function (_type) {
		if (debug.sentinel(typeof(THREE[_type]) == "function", "Failed to initialise light of nonexistant type "+_type+".")) {
			return;
		}
	
		light = new THREE[_type](0xffffff);
		light.position.set(100, 100, 0);
		light.castShadow = true;
		lights[_type] = light;
		scene.add(light);
	}

	this.get_light = function (_type) {
		if (debug.sentinel(lights.hasOwnProperty(_type), "Light of type '"+_type+"' has not been initialised.")) {
			return;
		}

		return lights[_type];
	}

	function check_if_set () {
		if (camera && renderer && scene) {
			set = true;
		}
	}

	this.set_camera = function (_type, _w) {

		if (debug.sentinel(typeof(THREE[_type]) == "function", "Failed to initialise camera of nonexistant type "+_type+".")) {
			return;
		}

		var aspect_ratio = wrapper.offsetWidth / wrapper.offsetHeight;

		switch (_type) {
			case "OrthographicCamera":
				if (_w && utility.check_positive_number(_w)) {
					w = _w;
				}
				camera = new THREE[_type](w/2, -w/2, w/(2*aspect_ratio), -w/(2*aspect_ratio), 1, 1000);
				break;
			default:
				camera = new THREE[_type](30, aspect_ratio, 0.1, 10000000);
		}

		camera.position.x = 50;
		camera.position.y = 10;
		camera.position.z = 50;
		camera.lookAt(new THREE.Vector3(0, 0, 0))
		scene.add(camera);

		check_if_set();
	}

	this.update_size = function () {
		if (!camera) {return}

		var type = camera.type;
		var aspect_ratio = wrapper.offsetWidth / wrapper.offsetHeight;

		renderer.setSize(wrapper.offsetWidth, wrapper.offsetHeight);

		switch (type) {
			case "OrthographicCamera":
				camera.top = w/(2*aspect_ratio);
				camera.bottom = -w/(2*aspect_ratio);
				break;
			default:
				camera.aspect = aspect_ratio;
		}
	}

	this.get_camera = function () {return camera};
	this.get_renderer = function () {return renderer};

	this.add = function (_obj, _add_to) {
		if (debug.sentinel(_obj instanceof THREE.Object3D, "Could not add object as it is not a valid instance of Object3D.")) {
			return;
		}

		if (!_add_to ||
			debug.sentinel(groups[_add_to], "Could not add object to nonexistant group "+_add_to+". Adding to scene instead")) {
			scene.add(_obj);
			return;
		}

		groups[_add_to].add(_obj);
		return;
	}
	this.get_material = function (_name) {
		if (debug.sentinel(materials[_name], "Failed to get material. No existing material by the name of "+_name+".")) {
			return;
		}

		return materials[_name];
	}

	this.set_material = function (_name, _material) {
		if (debug.sentinel(_material instanceof THREE.Material, "Failed to assign an invalid material to name "+_name+".")) {
			return;
		}

		debug.sentinel(!materials[_name], "Overwriting existing material by the name of "+_name+".")

		materials[_name] = _material;
	}

	this.set_group = function (_name, _group, _parent) {
		if (debug.sentinel(_group instanceof THREE.Object3D, "Failed to assign an invalid group to name "+_name+".")) {
			return;
		}

		if (debug.sentinel(groups[_parent], "Failed to add group to invalid wrapper "+_parent+". Adding to scene instead.")) {
			scene.add(_group);
		}
		else {
			groups[_parent].add(group);
		}

		debug.sentinel(!groups[_name], "Overwriting existing group by the name of "+_name+".");

		groups[_name] = _group;

	}

	this.get_group = function (_name) {
		if (debug.sentinel(groups[_name], "Failed to get group. No existing group by the name of "+_name+".")) {
			return;
		}

		return groups[_name];
	}

	this.clear_group = function (_name, _all_but) {
		if (debug.sentinel(groups[_name], "Failed to get group. No existing group by the name of "+_name+".")) {
			return;
		}

		if (debug.sentinel(!isNaN(_all_but) && _all_but >= 0, "Invalid or non-existant all_but value passed. Default value '0' used instead.")) {
			_all_but = 0;
		}

		var _group = groups[_name];

		while (_group.children.length > _all_but) {
			_group.remove(_group.children[_all_but]);
		}
	}

	this.set_font = function (_name, _font) {
		if (debug.sentinel(_font instanceof THREE.Font, "Failed to assign an invalid font to name "+_name+".")) {
			return;
		}

		debug.sentinel(!fonts[_name], "Overwriting existing font by the name of "+_name+".")

		fonts[_name] = _font;
	}

	this.get_font = function (_name) {
		if (debug.sentinel(fonts[_name], "Failed to get font. No existing font by the name of "+_name+".")) {
			return;
		}

		return fonts[_name];
	}

	this.render = function () {
		renderer.render(scene, camera);
	}

	construct(_wrapper)
}

index.Stack = function (_quantity_kg, _density_kg_m3) {

	var density_kg_m3 = null;

	var stack = {
		kg: null,
		m3: null,
		base: null,
		height: null,
		sphere_count: null
	}

	var sphere = {
		kg: null,
		m3: null,
		r_m: null
	}

	var set = false;
	
	var construct = function (_quantity_kg, _density_kg_m3) {
		_quantity_kg = parseFloat(_quantity_kg);
		_density_kg_m3 = parseFloat(_density_kg_m3);

		if (debug.sentinel(!isNaN(_quantity_kg), "Invalid non-numerical quantity value passed.") || 
			debug.sentinel(_quantity_kg >= 0, "Invalid negative quantity value passed.") ||
			debug.sentinel(!isNaN(_density_kg_m3), "Invalid non-numerical density value passed.") || 
			debug.sentinel(_density_kg_m3 >= 0, "Invalid negative density value passed.")
			) {
			return;
		}

		density_kg_m3 = _density_kg_m3

		stack.kg = _quantity_kg;
		stack.m3 = stack.kg/density_kg_m3;
	}

	function calculate_sphere () {

		var sphere_kg = 0.001;
		var spheres_per_stack_limit = stack.base*stack.base*stack.height;

		while (stack.kg/sphere_kg > spheres_per_stack_limit) {
			sphere_kg *= 10;
		}

		sphere.kg = sphere_kg;
		sphere.m3 = sphere.kg/density_kg_m3;
		sphere.r_m = sphere.r_m = Math.cbrt((3*sphere.m3)/(4*Math.PI));

		stack.sphere_count = Math.round(stack.kg/sphere.kg);
	}

	this.set_stack_parameters = function (_base, _height) {
		_base = parseInt(_base);
		_height = parseInt(_height);

		if (debug.sentinel(!isNaN(_base), "Invalid non-numerical base value passed.") || 
			debug.sentinel(_base >= 0, "Invalid negative base value passed.") ||
			debug.sentinel(!isNaN(_height), "Invalid non-numerical height value passed.") || 
			debug.sentinel(_height >= 0, "Invalid negative height value passed.")
			) {
			return;
		}

		stack.base = _base;
		stack.height = _height;

		calculate_sphere();
	}

	this.get_sphere_position = function (i) {
		i = parseInt(i);

		if (debug.sentinel(!isNaN(i), "Invalid non-numerical index value passed.") || 
			debug.sentinel(i >= 0, "Invalid negative index value passed.") ||
			debug.sentinel(i < stack.sphere_count, "Index value cannot be greater than the total sphere count.")
			) {
			return;
		}

		return {
			x: ((i%stack.base)*(sphere.r_m*2)) - (stack.base*sphere.r_m),
			y: (Math.floor(i/Math.pow(stack.base, 2))*(sphere.r_m*2))+sphere.r_m,
			z: ((Math.floor(i/stack.base)%stack.base)*(sphere.r_m*2)) - (stack.base*sphere.r_m)
		}
	}

	this.get_sphere = function () {
		return sphere;
	}

	this.get_stack = function () {
		return stack;
	}



	construct (_quantity_kg, _density_kg_m3);
}

index.Rate = function (_rate_kg_s, _density_kg_m3) {

	var density_kg_m3; 

	var rate = {
		kg_s: null,
		m3_s: null,
	}

	var sphere = {
		kg: null,
		m3: null,
		r_m: null,
		per_s: null,
		s_per: null,
	}

	var set = false;

	var construct = function (_rate_kg_s, _density_kg_m3) {
		_rate_kg_s = parseFloat(_rate_kg_s);
		_density_kg_m3 = parseFloat(_density_kg_m3);


		if (debug.sentinel(!isNaN(_rate_kg_s), "Invalid non-numerical rate value passed.") || 
			debug.sentinel(_rate_kg_s >= 0, "Invalid negative rate value passed.") ||
			debug.sentinel(!isNaN(_density_kg_m3), "Invalid non-numerical density value passed.") || 
			debug.sentinel(_density_kg_m3 >= 0, "Invalid negative density value passed.")
			) {
			return;
		}

		density_kg_m3 = _density_kg_m3

		rate.kg_s = _rate_kg_s;
		rate.m3_s = rate.kg_s/density_kg_m3;

		calculate_sphere ();
	}

	var calculate_sphere = function () {

		//setup starting sphere weight, then increase it in a loop until no more than 30 spheres per second are needed.
		var sphere_kg = 0.001;
		var spheres_per_s_limit = 20

		while (rate.kg_s/sphere_kg > spheres_per_s_limit) {
			sphere_kg *= 10;
		}

		sphere.kg = sphere_kg;
		sphere.m3 = sphere.kg/density_kg_m3;
		sphere.r_m = Math.cbrt((3*sphere.m3)/(4*Math.PI));
		sphere.per_s = rate.kg_s/sphere.kg;
		sphere.s_per = 1/sphere.per_s;
	}

	this.get_sphere = function () {
		return sphere;
	}

	this.get_rate = function () {
		return rate;
	}

	this.get_density_kg_m3 = function () {
		return density_kg_m3;
	}

	construct(_rate_kg_s, _density_kg_m3);
}

