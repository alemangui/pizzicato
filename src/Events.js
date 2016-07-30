Pizzicato.Events = {

	/**
	 * Adds an event handler that will be treated upon
	 * the triggering of that event.
	 */
	on: function(name, callback, context) {
		if (!name || !callback)
			return;

		this._events = this._events || {};
		var _event = this._events[name] || (this._events[name] = []);

		_event.push({
			callback: callback,
			context: context || this,
			handler: this
		});
	},

	/**
	 * Triggers a particular event. If a handler
	 * is linked to that event, the handler will be
	 * executed.
	 */
	trigger: function(name) {
		if (!name)
			return;

		var _event, length, args, i;

		this._events = this._events || {};
		_event = this._events[name] || (this._events[name] = []);

		if (!_event)
			return;

		length = Math.max(0, arguments.length - 1);
		args = [];

		for (i = 0; i < length; i++) 
			args[i] = arguments[i + 1];

		for (i = 0; i < _event.length; i++)
			_event[i].callback.apply(_event[i].context, args);	
	},

	/**
	 * Removes an event handler. If no name is provided,
	 * all handlers for this object will be removed.
	 */
	off: function(name) {
		if (name)
			this._events[name] = undefined;

		else
			this._events = {};
	}

};