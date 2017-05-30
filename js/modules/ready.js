function ready (sb) {
/*
This module's entire function is to send out a 'ready' notification meaning that all other
modules have been initialised and are ready to receive notifications.
*/

	function INIT () {
/*
'ready' notification means that all modules have been loaded and initialised, and are ready to be run.
*/
		
		sb.notify({
			type : "ready",
			data: null
		});
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