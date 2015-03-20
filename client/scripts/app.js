// YOUR CODE HERE:

var Message = Backbone.Model.extend({

});

var Messages = Backbone.Collection.extend({
  model: Message,
  url: 'https://api.parse.com/1/classes/chatterbox',
  loadMsgs: function(){
    this.fetch({data: {order: 'createdAt'}})
  },
  parse: function(response, options) {
    return response.results;
  },
});

var MessageView = Backbone.View.extend({

  template: _.template('<div>%= text %</div>'),

  render: function() {
    return this.template(this.model.attributes);
  },
});

var MessagesView = Backbone.View.extend({
  render: function(){
    this.collection.forEach(this.renderMessage, this);
  },

  renderMessage: function(message) {
    var messageView = new MessageView({model: message});
    var $html = messageView.render();
    $('#chats').prepend($html);
  }
});


var app = {
 server: 'https://api.parse.com/1/classes/chatterbox',
 unique: {},
 username : "anonymous",
 friends: {}
};

app.init = function() {
  app.username = decodeURI(window.location.search).slice(10);
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
      data = app.checkForSpam(data);
      app.updateRooms(data);
      app.addMessages(data,room);
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to retrieve message');
    }
   });

 }

app.addMessages = function(data, room) {
  data.forEach(function(value) {
    if (value.roomname === room || room === 'initialStartup') {
      app.addMessage(value);
    }
  })
}

app.updateRooms = function(data) {
  data.forEach(function(value){
    if (!(value.roomname in app.unique)) {
      app.unique[value.roomname] = true;
      app.addRoom(value.roomname);
    }  
  })  
}
app.checkForSpam = function(data) {
  var results = [];
  data.results.forEach(function(value){
    if (value.text && value.text.indexOf('<') !== 0) {
      results.push(value);
    }
  })
  return results;    
}
app.clearMessages = function() {
	$('#chats').children().remove();
}

app.addMessage = function(message) {

	$('#chats').append("<div class = 'chat'><p class = username>"+message.username+"</p><p class = msg>"+message.text+"</p></div>")
  $('#chats div:last-child .username').addClass(message.username);
}

app.addRoom = function(room) {
	$('#roomSelect').append("<option value = "+JSON.stringify(room)+">"+room+"</option>");
}

app.roomRefresh = function() {
  var $room = $('#roomSelect').val();
  app.fetch($room);
}

app.makeFriends = function (friend) {
  app.friends[friend.text()] = true;
  // console.log(app.friends[friend.val()]);
  // console.log(this.friends)
  console.log('Make friedns runs')
  // // for (var key in app.friends){
    // var temp = app.friends[key]
    var temp = friend.text();
    var friends = document.getElementsByClassName('username ' + temp)
    console.log(friends)
    Array.prototype.forEach.call(friends, function (friend) {
      $(friend).addClass('friend');
  });
  // if ($(this).hasClass(friend.val())) {
  //   $(this).addClass('friend');
  // }
}

$(document).ready(function(){
  app.init();

	$('#roomSelect').change(function() {
		app.roomRefresh();
	})

  $('.refresh').click(function() {
    app.roomRefresh();
  })

	$('.submitBtn').click(function() {
      var message = {
      	text: $('.messageBox').val(),
      	roomname : $('#roomSelect').val(),
      	username: app.username 
      }
      app.send(message);
      app.addMessage(message)
      app.fetch($('#roomSelect').val());
      $('.messageBox').val('');
	})

  $('.roomBtn').click(function () {
    app.addRoom($('.roomBox').val());
    $('.roomBox').val('');
  })
  $(document).on('click', '.username', function() {
    app.makeFriends($(this));
  })
})