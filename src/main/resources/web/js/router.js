App.Router.map(function() {
    this.resource('index', { path:'/'}); 
    this.resource('fridges');
    this.resource('fridge', { path:'/fridge/:fridge_id' });
});

App.FridgeRoute = Ember.Route.extend({
	model: function(params) {
		var fridgeName = params.fridge_id;
		return App.Dao.initSessionData(fridgeName);
  	}
});