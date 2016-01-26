var lastX = -1;
var lastY = -1;
var otherLastX = -1;
var otherLastY = -1;
var mode = MODE_DRAW;
var isDrawing = false;
var isErasing = false;
var queue = [];
var erasedQueue = [];

$(document).ready(function() {
    connectToServer();

    $("#mode").change(function() {
        mode = $("#mode option:selected").val();

        if (mode == MODE_DRAW) {
            $("#tool").removeClass("eraser").addClass("cursor");
        } else {
            $("#tool").removeClass("cursor").addClass("eraser"); 
        }
    });

    $("#sensor").mouseenter(function(e) {
        $("body").css("cursor", "none");
        $("#tool").show();
    });

    $("#sensor").mousedown(function(e) {
        // update mode
        isDrawing = (mode == MODE_DRAW);
        isErasing = !isDrawing;
        var coordinates = getCoordinates(e, "myWhiteBoard");
        updateWhiteBoard(coordinates[0], coordinates[1]);
    });

    $("#sensor").mousemove(function(e) {
        var coordinates = getCoordinates(e, "myWhiteBoard");
        updateWhiteBoard(coordinates[0], coordinates[1]);
        
        if (mode == MODE_DRAW) {
	        $("#tool").css("left", e.pageX - 6).css("top", e.pageY - 115);
        } else {
            $("#tool").css("left", e.pageX - 15).css("top", e.pageY - 15);
        }
    });

    $("#sensor").mouseup(function(e) {
       reset();
    });

    $("#sensor").mouseleave(function(e) {
        $("#tool").hide();
        $("body").css("cursor", "default");
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

    setInterval(function() {
        var pivot = erasedQueue.length;
        if (pivot > 0) {
            sendErasedCoordinates(erasedQueue.slice(0, pivot));
            erasedQueue.splice(0, pivot);
        }
    }, 100);

});

function getCoordinates(e, elementId) {
    var x = e.pageX - $("#" + elementId).offset().left;
    var y = e.pageY - $("#" + elementId).offset().top;
    return [x, y];
}

function reset() {
    lastX = -1;
    lastY = -1;
    
    isDrawing = false;
    isErasing = false;
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

    if (isDrawing) {
        drawOnWhiteBoard(currentX, currentY, ctx);
    } else if (isErasing) {
        eraseOnWhiteBoard(currentX, currentY, ctx, false);
    }
}

function drawOnWhiteBoard(currentX, currentY, ctx) {
    if (lastX == -1 && lastY == -1) {
        enqueue(lastX, lastY);
        lastX = currentX - 1;
        lastY = currentY - 1;
        enqueue(lastX, lastY);
    }
    // record new coordinates
    enqueue(currentX, currentY);
    // draw new coordinates 
    draw(ctx, lastX, lastY, currentX, currentY);
    // update last coordinates
    lastX = currentX;
    lastY = currentY;
}

function eraseWhiteBoardFromServer(coordinates) {
    var ctx = document.getElementById("myWhiteBoard").getContext("2d");
    var coordinates = JSON.parse(coordinates);
    for (var i = 0; i < coordinates.length; ++i) {
        eraseOnWhiteBoard(coordinates[i]['x'], coordinates[i]['y'], ctx, true);    
    }
}

function eraseOnWhiteBoard(centreX, centreY, ctx, fromServer) {
    console.log("(" + centreX + ", " + centreY + ")");
    ctx.beginPath();
    // specify the circle area where will be erased
    ctx.arc(centreX, centreY, 15, 0, 2 * Math.PI);
    // save current canvas or it cannot be restored later
    ctx.save();
    // put a mask on canvas
    ctx.clip();
    // erase the area within the clip
    ctx.clearRect(centreX - 16, centreY - 16, 32, 32);
    // restore canvas so that all area will be activated again
    ctx.restore();
    
    if (!fromServer)
        erasedQueue.push({"x": centreX, 'y': centreY});
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
