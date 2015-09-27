var net = require('net');
var data = require('./app.js');


var server = net.createServer(function(socket){
	socket.pipe(socket);
	socket.on('data', function(){
		data(function(results){
			console.log(results);
			var output = "";
			for(var i = 0; i < results.length; i++){
				output += results[i]+",";
			}
			socket.write(output.substring(0, output.length -1) + "\r\n");
		});
	});
});

server.listen(3000, '0.0.0.0');

// app.get('/', function(req, res){
// 	var data = require('./app.js');
// 	console.log(data);
// 	data(function(results){
// 		console.log(results);
// 	});
// 	res.send("hey there");
// });

// var server = app.listen(3000, function(){
// 	var host = server.address().address;
// 	var port = server.address().port;

// 	console.log('Example app listening at http://%s:%s', host, port);
// });