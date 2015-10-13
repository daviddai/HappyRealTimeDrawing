/*************************** Libraries for HTTP & Socket Server *******************************/
var express = require('express');
var io = require('socket.io');
var cmdLineArgs = require('./node_modules/command-line-args');

/*************************** Node HTTP Server via express framwork ****************************/
var app = new express();
// grant access to public folder
app.use('/public', express.static('public'));
// match request pattern
app.get('/', function(request, response) {
    response.sendFile(__dirname + '/home.html');
});

/*********************************** Socket.IO & Server ***************************************/
var options = collectCmdLineArgs();
var server = app.listen(options['port']);
var io = io.listen(server);
var clients = [];
var history = [];

io.sockets.on('connection', function(socket) {
    console.log("Server Log: A new user connected...");

    clients.push(socket);
    socket.emit('greeting', 'Welcome!');

    // send history to new connected user
    for (var i = 0; i < history.length; ++i) {
        socket.emit('coordinates', history[i]);
    }

    socket.on('disconnect', function(socket) {
        console.log("Server Log: A user disconnected...");
    });

    socket.on('coordinates', function(coordinates) {
        // record in history
        history.push(coordinates);

        clients.forEach(function(client) {
            if (client != socket) {
                console.log("Server Log: About to update other's white board");
                client.emit('coordinates', coordinates);
            }
        });
    });

    socket.on('clear', function() {
        history = [];

        clients.forEach(function(client) {
            if (client != socket) {
                console.log('Server Log: About to erase the whole board');    
                client.emit('clear');
            }
        });
    });

    socket.on('message', function(data) {

    });
});



/**********************************************************************************************/


/**
 * Collect commandline arguments
 */
function collectCmdLineArgs() {
    var args = cmdLineArgs([
        {name: "port", alia: "p", type: Number}
    ]);
    return args.parse();
}
