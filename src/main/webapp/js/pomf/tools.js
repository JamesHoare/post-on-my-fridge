function buildSpinner(){
	var opts = {
			  lines: 13, // The number of lines to draw
			  length: 7, // The length of each line
			  width: 4, // The line thickness
			  radius: 10, // The radius of the inner circle
			  rotate: 0, // The rotation offset
			  color: '#000', // #rgb or #rrggbb
			  speed: 1, // Rounds per second
			  trail: 60, // Afterglow percentage
			  shadow: false, // Whether to render a shadow
			  hwaccel: false, // Whether to use hardware acceleration
			  className: 'spinner', // The CSS class to assign to the spinner
			  zIndex: 2e9, // The z-index (defaults to 2000000000)
			  top: 'auto', // Top position relative to parent in px
			  left: 'auto' // Left position relative to parent in px
			};
	var target = document.getElementById('loading');
	var spinner = new Spinner(opts).spin(target);
}

function messageManagment(user,message){
	$("#chatLog").append("<br/><i>" + moment().format('h:mm:ss') + "</i></br>" +user+" : "+formatChatMessage(message));
	$("#chatLog").animate({ scrollTop: $("#chatLog").prop("scrollHeight") }, 3000);
}

function formatChatMessage(message){
	chatMessage = "<span class = 'chatMessage'>"+ message +"</span>";
	return chatMessage ;
}

function onChatTextAreaChange() {
    sendChatMessage();
    $("#message").val('');
}

function sendChatMessage(){
	var payload = {}; 
	payload.fridgeId = $("#fridgeId").val();
	payload.message = $("#message").val();
	payload.user = $("#pseudo").val();
	$.ajax({
		type: "POST",
		url: "/_ah/channel/"+payload.fridgeId+"/message",
		data: payload
	});
}

function channelManagement(){
	var fridgeId = $("#fridgeId").val();
	$.getJSON("/_ah/channel/"+fridgeId, function(tokenChannel) {
		if (tokenChannel !== undefined){
			var channel = new goog.appengine.Channel(tokenChannel);
			var socket = channel.open();
			socket.onopen = function(){
				
			};
			socket.onmessage = function(m){
				var data = $.parseJSON(m.data);
			    if (data.command == "#FRIDGE-UPATE#"){
			    	initPage();
			    }
			    if (data.command == "#FRIDGE-CHAT#"){
			    	messageManagment(data.user,data.message);
			    }
			};
			socket.onerror =  function(err){
            	jackedup = humane.create({baseCls: 'humane-jackedup', addnCls: 'humane-jackedup-error'});
            	jackedup.log("Websocket error :"+err.description);
			};
			socket.onclose =  function(){};
		}
	});
}	

function messageContain(message,test){
	if (message.indexOf(test) != -1){
		return true;
	}else{
		return false;
	}
}

function showFridge(){
    $('#loading').remove();
    $('.fridge').css({opacity: 0.0, visibility: "visible"}).animate({opacity: 1.0});
}

function redirectAfterSearch(){
	var fridgeId = $("#search").val();
	window.location = "/fridge/"+fridgeId;
}

function setupSearchAutocomplete(){
	$( "#search" ).autocomplete({
	    source: "/resources/fridge/noid/search",
	    delay: 1000,
	    minLength: 2
	});
}

function clearText(thefield){
    if (thefield.defaultValue==thefield.value)
    	thefield.value = "";
} 


function setRandomBackGround(){
	path = "/images/background/";
	myImages = ['bright_squares.png', 'circles.png', 'diagonal-noise.png', 'elastoplast.png',
	            'elegant_grid.png','gold_scale.png','light_checkered_tiles.png',
	            'noise_pattern_with_crosslines.png','plaid.png','ravenna.png',
	            'roughcloth.png','silver_scales.png','soft_circle_scales.png',
	            'wavecut.png','xv.png'] ;
	imageFileNumber = myImages.length;
	randomNumber = Math.floor(Math.random() * imageFileNumber);
	imageToAssign = myImages[randomNumber];
	imageFullPath = path + imageToAssign;
	$('#global').css('background-image', 'url(' + imageFullPath + ')');
}

function extractTwitterUser(url){
	var contentArray = url.split('/#!/');
	return contentArray[1];
}

function generateYoutubeFrame(videoId){
	return "<iframe class='youtube-player' type='text/html' width='218' height='200' src='http://www.youtube.com/embed/"+videoId+"?wmode=opaque&modestbranding=1&autohide=1 frameborder='0'></iframe>";
}

function getTxtColorFromBg(color){
	return isDark(color) ? 'white' : 'black';
}

function isDark( color ) {
    R = parseInt((cutHex(color)).substring(0,2),16);
    G = parseInt((cutHex(color)).substring(2,4),16);
    B = parseInt((cutHex(color)).substring(4,6),16);
    return R + G + B < 3 * 256 / 2; // r+g+b should be less than half of max (3 * 256)
}

function datePickerManagement(){
		$( "#dueDate" ).datepicker({
			showOn: "button",
			buttonImage: "/images/calendar.gif",
			buttonText: 'Choose a due date',
			buttonImageOnly: true
		});
}

function cutHex(h) {
	return (h.charAt(0)=="#") ? h.substring(1,7):h;
	}

function isRegExp(regExp, content){
	return regExp.test(content);
}

function filterData(data){
    data = data.replace(/<?\/body[^>]*>/g,'');
    data = data.replace(/[\r|\n]+/g,'');
    data = data.replace(/<--[\S\s]*?-->/g,'');
    data = data.replace(/<noscript[^>]*>[\S\s]*?<\/noscript>/g,'');
    data = data.replace(/<script[^>]*>[\S\s]*?<\/script>/g,'');
    data = data.replace(/<script.*\/>/,'');
    return data;
}
