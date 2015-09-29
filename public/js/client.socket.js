var socket;

function connectToServer() {
    socket = io.connect();

    socket.on('greeting', function(data) {
        alert(data);
    });

    socket.on('coordinates', function(coordinates) {
        updateWhiteBoardFromServer(coordinates);
    });

    socket.on('disconnect', function() {
        alert('Lost connection to server');
    });
}

function send(coordinates) {
    socket.emit('coordinates', JSON.stringify(coordinates));
}
