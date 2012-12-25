App.FridgeController = Ember.ArrayController.create({
	content: [],

	init: function() {
		this._super();
		this.retrievePost();
	},

	createPost: function(postData) {
		App.Post.create(postData).createPost();
	},

	deletePost: function(id) {
		postToRemove = this.findProperty('id', id);
		this.removeObject(postToRemove);
		postToRemove.deletePost();
	},

	updateExistingPost: function(postInput) {
		post = this.findProperty('id', postInput.id);
		post.set('content', postInput.content);
		post.set('color', postInput.color);
		newFullPosition = postInput.positionX + ' ' + postInput.positionY;
		if (post.get('fullPosition') != newFullPosition){
			post.set('fullPosition', newFullPosition);
		}
	},

	createOrUpdate: function(post) {
		var exists = this.filterProperty('id', post.id).length;
		if (exists === 0) {
			this.pushObject(App.Post.create(post));
		} else {
			this.updateExistingPost(post);
		}
	},

	deleteProcedure: function(fridgeContent) {
		var me = this;
		$.each(me.get('content'), function(indexPost, valuePost) {
			postId = valuePost.id;
			exist = _.find(fridgeContent, function(dataPost) {
				return dataPost.id == postId;
			});
			if (!exist) {
				me.removeObject(me.findProperty('id', postId));
			}
		});
	},

	retrievePost: function() {
		var me = this;
		$.getJSON("/fridge/" + App.get('fridgeId'), function(fridgeContent) {
			if (fridgeContent !== null && fridgeContent.posts != null ) {
				// remove post present in the fridge but not in the db
				me.deleteProcedure(fridgeContent.posts);

				//update or create the posts
				$.each(fridgeContent.posts, function(index, post) {
					me.createOrUpdate(post);
				});
			}
		});
	}
});