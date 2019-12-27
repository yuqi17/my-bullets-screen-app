
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

io.on('connection', function (socket) {
  console.log('connect')
  // 当客户端发出“new message”时，服务端监听到并执行相关代码
  socket.on('message-from-client', function (data) {
      // 广播给用户执行“new message”
      console.log('message-from-client')
      socket.emit('getMsg', data);
      socket.broadcast.emit('getMsg', data);
  });
  
  // 当客户端发出“add user”时，服务端监听到并执行相关代码
  // socket.on('add user', function (username) {
  //     socket.username = username;
  //     //服务端告诉当前用户执行'login'指令
  //     socket.emit('login', {});
  // });
  
  // 当用户断开时执行此指令
  socket.on('disconnect', function () {});
});

http.listen(3001, function(){
  console.log('listening on *:3001');
});