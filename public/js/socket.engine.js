var SocketEngine = {
    instance: null,
    
    /*
        return socket engine instance
    */ 
    getInstance: function() {
        if (this.instance === null) {
            this.instance = this.createSocket();
        }

        return this.instance;
    },
    
    /*
        instantiate socket engine
    */
    createSocketEngine: function() {
        var socketEngine = {};
        
        socketEngine.socket = null;
       
        socketEngine.connectToServer = function() {
            socketEngine.socket = io.connect();

            /*
                set up different socket listeners to monitor
                and handle the data sent from the server
            */

            socketEngine.socket.on('drewCoordinates', function(coordinates) {

            });

            socketEngine.socket.on('erasedCoordinates', function(coordinates) {

            });

            socketEngine.socket.on('clear', function() {

            });

            socketEngine.socket.on('disconnect', function() {

            });
        }

        socketEngine.send = function(data, type) {

        };

        return socketEngine;
    }
};
