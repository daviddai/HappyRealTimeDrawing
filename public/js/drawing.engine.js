var DrawEngine = {
    instance: null,

    /*
        return draw engine instance
    */
    getInstance: function(canvasId) {
        if (this.instance == null) {
            this.instance = this.createDrawEngine(canvasId);
        }

        return this.instance;
    },

    /*
        instantiate draw engine
    */
    createDrawEngine: function(canvasId) {
        var drawEngine = {};

        drawEngine.setCanvas(canvasId);
        drawEngine.setSocketEngine();
        drawEngine.initProperties();
        
        drawEngine.initProperties = function() {
            // draw engine is not doing anything
            // when it is just initialised
            drawEngine.isDrawing = false;
            drawEngine.isErasing = false; 
            // draw engine has two modes: draw and erase
            // set it to draw mode once it is initialised
            drawEngine.modes = {"draw": 0, "erase": 1};
            drawEngine.currentMode = drawEngine.modes['draw'];
            // coordinates are set to -1 which indicate
            // the end of input to canvas  
            drawEngine.lastX = -1;
            drawEngine.lasty = -1;
            drawEngine.lastOtherX = -1;
            drawEngine.lastOtherY = -1; 
            //queue for storing coordinates of user input
            drawEngine.drawingQueue = [];
            drawEngine.eraserQueue = [];
        };        
        
        drawEngine.setCanvasEngine = function(canvasId) {
            drawEngine.canvasEngine = CanvasEngine.getInstance(canvasId);
        };

        drawEngine.setSocketEngine = function() {
            drawEngine.socketEngine = SocketEngine.getInstance();
        };

        /*
            clear whole content on draw engine's canvas
        */
        drawEngine.clearCanvas = function() {
            if (drawEngine.canvas !== null) {
                drawEngine.canvasEngine.clear();
                drawEngine.setIdle();
            } else {
                console.log('Draw Engine has no canvas engine');
            }
        };

        /*
            reset draw engine to idle
        */
        drawEngine.setIdle = function() {
            drawEngine.lastX = -1;
            drawEngine.lastY = -1;
            drawEngine.isDrawing = false;
            drawEngine.isEarsing = false;
        };

        drawEngine.updateCanvas = function() {
            if (drawEngine.isDrawing) {
                
            } else {

            }
        };

        drawEngine.draw = function(currentX, currentY) {
            if (drawEngine.lastX == -1 && drawEngine.lastY == -1) {
                // no connection between current point to the previous one
                
                // enqueue previous point
                drawEngine.enquque(drawEngine.lastX, drawEngine.lastY);
                // fake a previous point which is close enough to current one 
                lastX = currentX - 1;
                lastY = currentY - 1;
                // enquque the fake point
                drawEngine.enquque(lastX, lastY);
            }

            // enqueue the new point
            drawEngine.enqueue(currentX, lastY);
            // draw new point on canvas   
            
        };

        drawEngine.erase = function() {

        };

        return drawEngine;
    }
};
