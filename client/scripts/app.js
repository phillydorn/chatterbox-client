// YOUR CODE HERE:

var app = {
 server: 'https://api.parse.com/1/classes/chatterbox',
};

app.init = function() {

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
	 var room = room || 'all'
      $.ajax({
	  url: app.server,
	  type: 'GET',
	  contentType: 'application/json',
	  data: {'order': '-createdAt'},
	  success: function (data) {
  		app.clearMessages();
	    for( var i = 0; i < data.results.length; i++) {

        if (data.results[i].text && data.results[i].text.indexOf('<') !== 0) {
          if (data.results[i].roomname === room) {
      			app.addMessage(data.results[i]); 
          }
        }
      //   // var unique = []
      //   if (!unique.indexOf(data.results[i].roomname)) {
      //     unique.push(data.results[i].roomname);
      //   }
      // }
      // for (var j = 0; j < unique.length; j++) {
      //   app.addRoom(unique[j]);
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
	$('#roomSelect').append("<option value = "+room+">"+room+"</option>");
}

$(document).ready(function(){
  // app.fetch();


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
      app.addMessage(message);
	})
})