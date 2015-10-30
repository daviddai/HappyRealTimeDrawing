var lastX = -1;
var lastY = -1;
var otherLastX = -1;
var otherLastY = -1;
var mode = MODE_DRAW;
var isDrawing = false;
var isEarsing = false;
var queue = [];

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

    $("#myWhiteBoard").mouseenter(function(e) {
        $("body").css("cursor", "none");
        $("#tool").show();
    });

    $("#myWhiteBoard").mousedown(function(e) {
        // update mode
        isDrawing = (mode == MODE_DRAW);
        isErasing = !isDrawing;

        var coordinates = getCoordinates(e, $(this).attr("id"));
        updateWhiteBoard(coordinates[0], coordinates[1]);
    });

    $("#tool").mousedown(function(e) {
        /*isDrawing = (mode == MODE_DRAW);
        isErasing = !isDrawing;
        // calculate coordinates on white board
        var x = e.pageX - $("#myWhiteBoard").offset().left;
        var y = e.pageY - $("#myWhiteBoard").offset().top;
        updateWhiteBoard(x, y); */
    });

    $("#myWhiteBoard").mousemove(function(e) {
        var coordinates = getCoordinates(e, $(this).attr("id"));
        updateWhiteBoard(coordinates[0], coordinates[1]);
        
        if (mode == MODE_DRAW) {
	        $("#tool").css("left", e.pageX - 6).css("top", e.pageY - 115);
        } else {
            $("#tool").css("left", e.pageX - 6).css("top", e.pageY - 115);
        }
    });

    $("#tool").mousemove(function(e) {
        /*var x = e.pageX - $("#myWhiteBoard").offset().left;
        var y = e.pageY - $("#myWhiteBoard").offset().top;
        updateWhiteBoard(x, y);
        
        if (mode == MODE_DRAW) {
            $("#tool").css("left", e.pageX - 6).css("top", e.pageY - 115);
        }*/
    });

    $("#myWhiteBoard, #tool").mouseup(function(e) {
       reset();
    });

    $("#myWhiteBoard").mouseleave(function(e) {
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
    isEarsing = false;
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
    } else {
        
    }
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
