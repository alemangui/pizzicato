describe('Events', function() {

	var obj = {
		on: Pizzicato.Events.on,
		off: Pizzicato.Events.off,
		trigger: Pizzicato.Events.trigger
	};

	beforeEach(function() {
		obj.off();
	});

	it('will execute function when triggering a listened event', function() {
		var triggerCallback = jasmine.createSpy('triggerCallback');

		obj.on('trigger', triggerCallback);
		expect(triggerCallback).not.toHaveBeenCalled();

		obj.trigger('trigger');
		expect(triggerCallback).toHaveBeenCalled();
	});


	it('will unbind from all events when using off without arguments', function() {
		var triggerCallback = jasmine.createSpy('triggerCallback');

		obj.on('trigger', triggerCallback);
		obj.off();
		obj.trigger('trigger');

		expect(triggerCallback).not.toHaveBeenCalled();
	});


	it('will unbind from a specific event when passing an argument to off', function() {
		var triggerCallback = jasmine.createSpy('triggerCallback');
		var sparkCallback = jasmine.createSpy('sparkCallback');

		obj.on('trigger', triggerCallback);
		obj.on('spark', sparkCallback);

		obj.off('spark');

		obj.trigger('trigger');
		obj.trigger('spark');

		expect(triggerCallback).toHaveBeenCalled();
		expect(sparkCallback).not.toHaveBeenCalled();
	});
});