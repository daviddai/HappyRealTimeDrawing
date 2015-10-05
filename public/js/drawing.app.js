var lastX = -1;
var lastY = -1;
var otherLastX = -1;
var otherLastY = -1;
var isDrawing = false;
var queue = [];

$(document).ready(function() {
    connectToServer();
    
    $("#myWhiteBoard").hover(function() {
        $(this).css('cursor', 'crosshair');
        //$(this).css('cursor','url(./public/img/pencil.png),auto');
    });

    $("#myWhiteBoard").mousedown(function(e) {
        isDrawing = true;
        var x = e.pageX - this.offsetLeft;
        var y = e.pageY - this.offsetTop;
        updateWhiteBoard(x, y);
    });

    $("#myWhiteBoard").mousemove(function(e) {
        if (isDrawing) {
            var x = e.pageX - this.offsetLeft;
            var y = e.pageY - this.offsetTop;
            updateWhiteBoard(x, y);
        }
    });

    $("#myWhiteBoard").mouseup(function(e) {
        isDrawing = false;
        reset();
    });

    $("#myWhiteBoard").mouseleave(function(e) {
        isDrawing = false;
        reset();
    });

    $("#btnClear").click(function(e) {
        clearWhiteBoard(INTERNAL_REQUEST);     
    });

    setInterval(function() {
       var pivot = queue.length;
       if (pivot > 0) {
           sendCoordinates(queue.slice(0, pivot));
           queue.splice(0, pivot);
       }
    }, 100);

});

function reset() {
    lastX = -1;
    lastY = -1;
}

function clearWhiteBoard(requestType) {
    var ctx = document.getElementById("myWhiteBoard").getContext("2d");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    reset();

    if (requestType == INTERNAL_REQUEST) {
        sendClearRequest();
    } else if (requestType == SERVER_REQUEST) {
        showNotification(CLEAR_NOTIFICATION);
    }
}

function updateWhiteBoard(currentX, currentY) {
    var ctx = document.getElementById("myWhiteBoard").getContext("2d");
    if (lastX == -1 && lastY == -1) {
        enqueue(lastX, lastY);
        lastX = currentX - 1;
        lastY = currentY - 1;
        enqueue(lastX, lastY);
    }

    enqueue(currentX, currentY);
    
    draw(ctx, lastX, lastY, currentX, currentY);

    lastX = currentX;
    lastY = currentY;
}

function updateWhiteBoardFromServer(coordinates) {
    var ctx = document.getElementById("myWhiteBoard").getContext("2d");
    var coordinates = JSON.parse(coordinates);
    var otherCurrentX, otherCurrentY;

    if (otherLastX != -1 && otherLastY != -1) {
        if (coordinates[0]['x'] != -1 && coordinates[0]['y'] != -1) {
            draw(ctx, otherLastX, otherLastY, coordinates[0]['x'], coordinates[0]['y']);
        }
    }
    
    for (var i = 0; i < coordinates.length; ++i) {
        otherLastX = coordinates[i]['x'];
        otherLastY = coordinates[i]['y'];     
        
        if (otherLastX == -1 && otherLastY == -1) {
            continue;
        } else {
            if (i + 1 >= coordinates.length) {
                return;
            }
            otherCurrentX = coordinates[i + 1]['x'];
            otherCurrentY = coordinates[i + 1]['y'];

            if (otherCurrentX == -1 && otherCurrentY == -1) {
                continue;
            }

            draw(ctx, otherLastX, otherLastY, otherCurrentX, otherCurrentY); 
        }
    }
    
    otherLastX = otherCurrentX;
    otherLastY = otherCurrentY;
}

function setStyle(ctx) {
    ctx.lineJoin = "round";
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#659b41";
}

function draw(ctx, lastX, lastY, currentX, currentY) {
    console.log("(" + lastX + ", " + lastY + ") to (" + currentX + ", " + currentY + ")");
    setStyle(ctx);
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(currentX, currentY);
    ctx.closePath();
    ctx.stroke();
}

function enqueue(x, y) {
    queue.push({"x": x, "y": y});
}
