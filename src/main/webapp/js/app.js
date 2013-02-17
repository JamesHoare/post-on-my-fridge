window.App = Ember.Application.createWithMixins({

	//TODO : replace by ember-data when ready
	getPosts: function () {
		var me = this;
		$.getJSON("/fridge/" + this.fridgeId, function(fridgeContent) {
			if (fridgeContent !== null && fridgeContent.posts !== null) {
				me.set('posts',fridgeContent.posts);
			}
		});
	},

	posts : [],
	
	// TODO remove this ugly thing
	fridgeId : getFridgeUrl(),
	
	ready : function() {
		document.title = "Fridge "+ this.fridgeId;
		window.location.replace("#");
	},
	
	ApplicationView : Ember.View.extend({
		
		fridgeId: function() {
			return App.get('fridgeId')
		}.property(),

		rssUrl: function() {
			return "/fridge/" + this.get('fridgeId') + "/rss";
		}.property(),

		didInsertElement : function() {
			colorPickerManagement();

			$(".newPost").draggable({
				revert : "invalid",
				scroll : true,
				zIndex : 9999
			});

			$("#search").autocomplete({
				source : "/fridge/noid/search",
				delay : 100,
				minLength : 2,
				select : function(event, ui) {
					window.location = "/fridge/" + ui.item.value;
				},
				open: function (event, ui) {
			        $('.ui-autocomplete').css('z-index', '99999');
			    },
				response : function(event, ui) {
					if (ui.content.length === 0) {
						ui.content.push({
							label : "Click to create",
							value : $("#search").val()
						});
					}
				}
			});
			konami();
		}
	})
});