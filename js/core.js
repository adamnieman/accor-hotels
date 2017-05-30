window.onload = function () {
	init()
}

var core = function (sandBox) {
	var modules = {}

	return {
		register: function (moduleID, creator) {
			modules[moduleID] = {
				creator: creator,
				instance: null
			};
		},
		start: function (moduleID) {
			modules[moduleID].instance = modules[moduleID].creator(sandBox);
			modules[moduleID].instance.moduleID = moduleID

			modules[moduleID].instance.init()
		},
		end: function (moduleID) {
			var module = modules[moduleID];
			if (module.instance){
				module.instance.destroy()
				module.instance = null;
			}
		},
		startAll: function () {
			for (var i = 0; i < Object.keys(modules).length; i++) {
				var moduleID = "mod"+i
				if (modules.hasOwnProperty(moduleID)){
					this.start(moduleID)
				}
			}
		},
		endAll: function () {
			//console.log(modules)
			var keys = Object.keys(modules);
			var length = keys.length;
			var i;
			for (i=0; i<length; i++) {
				var moduleID = keys[i];
				if (modules.hasOwnProperty(moduleID)){
					this.end(moduleID)
				}
			}

		},

		modules: modules
	}
}

function init () {
	sandBox = {
		addEvent: function (target, event, func) {
			target.addEventListener(event, func)
		},
		removeEvent: function (target, event, func) {
			target.removeEventListener(event, func)
		},
		notify: function (evt) {
			//console.log(evt)

			for (var i = 0; i < this.listening.length; i++){
				if (evt.type === this.listening[i].type){

					var targetModuleID = this.listening[i].moduleID
					var targetModuleFunction = this.listening[i].moduleFunction


					if (CORE.modules[targetModuleID]){
						if (CORE.modules[targetModuleID].instance[targetModuleFunction]){
							CORE.modules[targetModuleID].instance[targetModuleFunction](evt.data)
						}
					}
				}
			}
		},
		listen: function (evts) {
			//console.log(evts.listenFor)

			for (var i = 0; i <evts.listenFor.length; i++){
				this.listening.push({
					type: evts.listenFor[i],
					moduleID: evts.moduleID,
					moduleFunction: evts.moduleFunction
				})

			}
		},
		unlisten: function (moduleID){
			for (var i = 0; i < this.listening.length; i++){
				if (this.listening[i].moduleID === moduleID){
					this.listening.splice(i, 1)
				}
			}
		},
		listening: []

	}

	var CORE;
	CORE = core(sandBox)

	d3.json("settings.json", function (error, data) {
		sandBox.settings = data.head_include;

		var modules = sandBox.settings.js.modules;

		var i;
		var l = modules.length;
		for (i=0; i<l; i++) {
			CORE.register("mod"+i, this[modules[i]]);
		}

		CORE.startAll();
	})

	sandBox.addEvent(window, 'beforeunload', unload)

	function unload () {
		CORE.endAll()
		sandBox.removeEvent(window, 'beforeunload', unload)
	}

	

}