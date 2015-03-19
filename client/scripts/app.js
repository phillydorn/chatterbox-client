// YOUR CODE HERE:

var app = {
 server: 'https://api.parse.com/1/classes/chatterbox',
 unique: []
};

app.init = function() {
  app.fetch('initialStartup')
}

app.send = function(message) {
  $.ajax({
  url: app.server,
  type: 'POST',
  data: JSON.stringify(message),
  contentType: 'application/json',
  success: function (data) {
    console.log('chatterbox: Message sent');
  },
  error: function (data) {
    // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
    console.error('chatterbox: Failed to send message');
  }
});
}

app.fetch = function(room) {
     $.ajax({
	  url: app.server,
	  type: 'GET',
	  contentType: 'application/json',
	  data: {'order': '-createdAt'},
	  success: function (data) {
  		app.clearMessages();
      for( var i = 0; i < data.results.length; i++) {
        if (data.results[i].text && data.results[i].text.indexOf('<') !== 0) {
          if (data.results[i].roomname === room || room === 'initialStartup') {
            app.addMessage(data.results[i]);
            if (app.unique.indexOf(data.results[i].roomname) === -1) {
              app.unique.push(data.results[i].roomname);
              app.addRoom(data.results[i].roomname);
            }
          }
        }
      }

       //  if (room === 'all') {
       //   app.addMessage(data.results[i]);
         
       //  }  else if (data.results[i].roomname === room){
		  
		
	  },
	  error: function (data) {
	    // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
	    console.error('chatterbox: Failed to retrieve message');
	  }
	 });

 }

app.clearMessages = function() {
	$('#chats').children().remove();
}

app.addMessage = function(message) {

	$('#chats').append("<div class = 'chat'><p class = username>"+message.username+"</p><p class = msg>"+message.text+"</p></div>");
}

app.addRoom = function(room) {
	$('#roomSelect').append("<option value = "+JSON.stringify(room)+">"+room+"</option>");
}

$(document).ready(function(){
  app.init();

	$('#roomSelect').change(function() {
		var $room = $('#roomSelect').val();
		app.fetch($room);
	})

	$('.submitBtn').click(function() {
      var message = {
      	text: $('.messageBox').val(),
      	roomname : $('#roomSelect').val(),
      	username: decodeURI(window.location.search).slice(10)
      }
      app.send(message);
      app.addMessage(message)
      app.fetch($('#roomSelect').val());
	})
})