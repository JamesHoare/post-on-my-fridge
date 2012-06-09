$(function() {
	setRandomBackGround();
	colorPickerManagement();
	datePickerManagement();
	setupSearchAutocomplete();
	konami();
	initUiElement();
	initPage();
	channelManagement();
	setTimeout(showPage, 1000);
});

function initUiElement(){
	var fridge = $('.fridge');
	var fridgeId = $("#fridgeId").val();
	$( ".newPost" ).draggable({ revert: "invalid" ,scroll: true});
	$('.newPost [title]').tipsy({gravity: 'w'});
	
	$(".post").live({
        mouseenter:
            function()
            {
        		$(this).find(".header").css({'position':'absolute','left':0,'top':'-18px'}).fadeIn(300);
            },
         mouseleave:
            function(event)
            {
        	 var uiElmt = event.currentTarget;
        	 console.log(uiElmt);
        	 if(!$(uiElmt).hasClass("header")){
        		 $(this).find(".header").fadeOut(300);
        	 }
            }
        }
	);
			
				
	$( ".fridge" ).droppable({
		accept: ".post, .newPost",
		drop: function( event, ui ) {
			var myData = {};
			if ( ui.draggable.hasClass('newPost')){
				myData.author = $("#author").val();
				myData.content = $("#content").val();
				myData.color = $("#postColor").val();
				myData.dueDate = $("#dueDate").val();
				myData.positionX = (parseInt(ui.draggable.css('left'),10) - $('.leftPanel').width()) / fridge.width();
				myData.positionY = (parseInt(ui.draggable.css('top'),10)) / fridge.height();
				myData.fridgeId = fridgeId;
				$.ajax({
			            url: "/resources/post",
			            data : myData,
			            dataType: "html",
			            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			            type:"post",
			            success: initPage(),
			            complete: replaceNewPost(ui.draggable),
			            error:function (xhr, ajaxOptions, thrownError){
			            	jackedup = humane.create({baseCls: 'humane-jackedup', addnCls: 'humane-jackedup-error'});
			            	jackedup.log("Please solve the captcha!");
			             	}
		               });	
			}else{
				myData.positionX = (parseInt(ui.draggable.css('left'),10)) / fridge.width();
				myData.positionY = (parseInt(ui.draggable.css('top'),10)) / fridge.height();
				$.ajax({ 
					url: "/resources/post/"+ui.draggable.attr('id'),
					type: "put",
					data : myData});	
			}	
		}
	});		

}

function initPage(){
	var fridge = $('.fridge');
    var fridgeId = $("#fridgeId").val();
	$.getJSON("/resources/fridge/"+fridgeId, function(data) {
		if (data !== undefined){
			deleteProcedure(data);
			createOrUpdate(data);
		}	
	});
}