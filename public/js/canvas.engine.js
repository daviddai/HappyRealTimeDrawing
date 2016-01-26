var CanvasEngine = {
    instance = null,

    getInstance: function(canvasId) {
        if (this.instance === null) {
            this.instance = this.createCanvasEngine(canvasId);
        }

        return this.instance;
    },

    createCanvasEngine: function(canvasId) {
        var canvasEngine = {};

        canvasEngine.setCanvas(canvasId);
        
        canvasEngine.setCanvas = function(canvasId) {
            canvasEngine.canvas = $('#' + canvasId);
        }

        canvasEngine.getCanvasContext = function() {
            return canvasEngine.canvas.getContext('2d');
        }

        canvasEngine.draw = function(lastX, lastY, currentX, currentY) {
            console.log('(' + lastX + ', ' + lastY + ') to (' + currentX + ", " + currentY + ')');
            var ctx = canvasEngine.getCanvasContext();
            ctx.beginPath(); 
            ctx.moveTo(lastX, lastY);
            ctx.lintTo(currentX, currentY);
            ctx.closePath();
            ctx.stroke();
        };

        canvasEngine.setStyle = function(newStyle) {
            var style = newStyle;
            var ctx = canvasEngine.getCanvasContext;

            if (style === null || style === undefined) {
                style = canvasEngine.getDefaultStyle(); 
            }

            ctx.lineJoin = style['lineJoin'];
            ctx.lineWidth = style['lineWidth'];
            ctx.strokeStyle = style['strokeStyle']; 
        };

        canvasEngine.getDefaultStyle = function() {
            return {'lineJoin': 'round', 'lineWidth': 5, 'strokeStyle': '#659b41'};
        }

        canvasEngine.getCanvasWidth = function() {
            return canvasEngine.getCanvasContext.canvas.width;
        };

        canvasEngine.getCanvasHeight = function() {
            return canvasEngine.getCanvasContext.canvas.height;
        };

        canvasEngine.clear = function() {
            var ctx = canvasEngine.getCanvasContext();
            ctx.clearRect(0, 0, canvasEngine.getCanvasWidth, canvasEngine.getCanvasHeight);
        };

        canvasEngine.clear = function(centreX, centreY) {
            console.log('erased circle (' + centreX + ', ' + centreY + ')');
            var ctx = canvasEngine.getCanvasContext();
            ctx.beginPath();
            // specify the circle area where will be erased
            ctx.arc(centreX, centreY, 15, 0, 2 * Math.PI);
            // save current canvas or it cannot be restored later
            ctx.save();
            // put a mask on canvas
            ctx.clip();
            // erase the area within the clip
            ctx.clearRect(centreX - 16, centreY - 16, 32, 32);
            // restore canvas so that all area will be active again
            ctx.restore();
        };
    }
};
