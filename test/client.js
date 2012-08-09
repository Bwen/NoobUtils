var net = require('net');
var client = net.connect({port: 1337}, function() {
  console.log('client connected');
  client.write(JSON.stringify({
    event: "details",
    namespace: "client",
    data: ['test1', 'test2', 'test3', {test4:'test4'}]
  }));
});

client.on('data', function(data) {
  console.log(data.toString());
  client.end();
});

client.on('end', function() {
  console.log('client disconnected');
});