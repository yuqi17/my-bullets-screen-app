
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

io.on('connection', function (socket) {
  console.log('connect')
  // 当客户端发出“new message”时，服务端监听到并执行相关代码
  socket.on('message-from-client', function (data) {
      console.log('message-from-client')
      // socket.emit('getData', data);
      socket.broadcast.emit('getData', data);
  });
  
  // 当用户断开时执行此指令
  socket.on('disconnect', function () {});
});

http.listen(3001, function(){
  console.log('listening on *:3001');
});