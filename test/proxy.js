var net = require('net'),
  io = require('socket.io').listen(8000);

/* ############### VERIFY LOGIN COOKIE */

io.configure(function () {
  // io.set('log level', 2);
  io.set('transports', ['websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling']);
  io.set('authorization', function (handshakeData, callback) {
    var cookies = {};

    if (handshakeData.headers.cookie) {
      var rawCookies = handshakeData.headers.cookie.split(';');
      for (var i=0; i < rawCookies.length; i++) {
        var parts = rawCookies[i].split('=');
        cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
      }

      if (true) {
        console.log('##### cookie authorization success');
        callback(null, true);
        return;
      }
    }

    // console.log('##### authorization failed');
    // callback(new Error('Session expired'), false);

    callback(null, true); // TEMP ALWAYS GOOD... No auth...
  });
});

io.sockets.on('connection', function (socket) {
  console.log('##### browser connected');
});

var namespaces = {
  root: io.sockets,
  client: io.of('/client'),
  smartservers: io.of('/smartservers')
};

namespaces.client.on('connection', function (socket) {
  console.log('---------------------- connected to namespace client');
});

namespaces.smartservers.on('connection', function (socket) {
  console.log('---------------------- connected to namespace smartservers');
});


/* ############### SERVER TCP */
var server = net.createServer(function (socket) {
  console.log('###### TCP SERVER up and running');

  socket.on('data', function(data) {
    var data = JSON.parse(data);
    namespaces[ data.namespace ].emit(data.event, data.data);
  });
});

server.listen(1337);