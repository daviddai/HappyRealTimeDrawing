var socket;

function connectToServer() {
    socket = io.connect();

    socket.on('greeting', function(data) {
        alert(data);
    });

    socket.on('coordinates', function(coordinates) {
        updateWhiteBoardFromServer(coordinates);
    });

    socket.on('erasedCoordinates', function(coordinates) {
        eraseWhiteBoardFromServer(coordinates);
    });

    socket.on('clear', function() {
        clearWhiteBoard(SERVER_REQUEST);       
    });

    socket.on('disconnect', function() {
        alert('Lost connection to server');
    });
}

function sendCoordinates(coordinates) {
    socket.emit('coordinates', JSON.stringify(coordinates));
}

function sendErasedCoordinates(coordinates) {
    socket.emit('erasedCoordinates', JSON.stringify(coordinates));
}

function sendClearRequest() {
    socket.emit('clear');
}
