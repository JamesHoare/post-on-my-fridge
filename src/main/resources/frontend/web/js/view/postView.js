App.PostView = Em.View.extend(App.Draggable, {
	tagName: 'article',
	classNames: ['post'],
	uiType: 'draggable',
	templateName: 'post',
    readMode : true,

	relativeDate: function() {
		var date = this.get('content').get('date');
		return moment(date, "YYYY-MM-DDTHH:mm:ssZZ").fromNow();
	}.property('content.date').cacheable(),

	generatedContent: function() {
		return this.generateContent();
	}.property('content.content').cacheable(),

	mouseEnter: function(event) {
		this.$().find(".header").css({
			'display': 'block'
		}).fadeIn(300);
	},

	mouseLeave: function(event) {
		var uiElmt = event.currentTarget;
		if (!$(uiElmt).hasClass("header")) {
			this.$().find(".header").fadeOut(300);
		}
	},

	didInsertElement: function() {
		var view = this;
		view.colorize();
		view.setupPosition();
		view.initIcons();
		view.$().draggable({
			revert: 'invalid',
			containment: "parent",
			stop: function(event) {
				var fridge = $('#fridge-content'),
				    fullPosition = view.$().offset().left / fridge.width() + ' ' + view.$().offset().top / fridge.height();
				view.get('content').set('fullPosition', fullPosition);
				view.get('content').updatePost()
			}
		});
	},

	setupPosition: function() {
		var left = this.get('content').get('positionX'),
	    	top = this.get('content').get('positionY'),
	    	fridge = $('#fridge-content');

	    this.$().offset({ "left" : left * fridge.width(), "top" : top * fridge.height()})
	    		.hide()
	    	    .fadeIn();
	},

	updatePhysicalPosition: function() {
		var left = this.get('content').get('positionX'),
		    top = this.get('content').get('positionY'),
		    fridge = $('#fridge-content'),
		    xTranslation = (left * fridge.width() - parseInt(this.$().offset().left, 10)),
		    yTranslation = (top * fridge.height() - parseInt(this.$().offset().top, 10));

		if (xTranslation !== 0 || yTranslation !== 0) {
			this.$().animate({
				'left': "+=" + xTranslation,
				'top': "+=" + yTranslation
			}, 'fast', 'swing');
		}
	}.observes('content.fullPosition'),

	colorize: function() {
		var color = this.get('content').get('color');
		this.$().css("background-color", color);
		this.$().css("color", getTxtColorFromBg(color));
	}.observes('content.color'),

	initIcons: function() {
		var view = this;
		// Trash
		view.$().find(".icon-trash").click(function() {
			view.$().effect("clip", 300, function(){
				    	infoMessage("Post from " + view.get('content').get('author') + " deleted");
						view.get('controller').deletePost(view.get('content').get('id'));
				    });
		});
		// Edit
		view.$().find(".icon-edit").click(function() {
			view.set('readMode',!view.get('readMode'));
		});
	},

	save: function(e) {
    	this.get('content').setProperties({
    		color: this.get('textFieldColor.value'), 
    		author: this.get('textFieldAuthor.value'), 
    		content: this.get('textFieldContent.value'), 
    		dueDate: this.get('textFieldDueDate.value')
    	});
    	this.set('readMode',!this.get('readMode'));
  	},

	generateContent: function() {
		var content = jQuery.trim(this.get('content').get('content'));
				
		if (textContainsSupportedMediaUrl(content)){
			firstWordUrl = content.split(' ').find(function(word) { return isUrl(word); });

			if (isPictureUrl(firstWordUrl)) {
				return generatePictureLink(firstWordUrl);
			}

			switch (url('domain', firstWordUrl)) {
			    case "youtube.com":
			        return generateYoutubeFrame(firstWordUrl);
			    case "vimeo.com":
			        return generateVimeoFrame(firstWordUrl);
			    case "dailymotion.com":
			        return generateDailyMotionLink(firstWordUrl);
			}        
		} else {
			// it does not contain supported media url, we just replace all url by href
			genArray = $.map( content.split(' '), function( word, i ) {
			  return (isUrl(word)) ? generateHrefLink(word) : word
			});
			return genArray.join(' ');;
		}
	}
});