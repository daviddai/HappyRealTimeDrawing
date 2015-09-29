var lastX = -1;
var lastY = -1;
var isDrawing = false;
var queue = [];

$(document).ready(function() {
    connectToServer();
    
    $("#myWhiteBoard").hover(function() {
        $(this).css("cursor", "pointer");
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
        var ctx = document.getElementById("myWhiteBoard").getContext("2d");
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        reset();
    });

    setInterval(function() {
       var pivot = queue.length;
       if (pivot > 0) {
           send(queue.slice(0, pivot));
           queue.splice(0, pivot);
       }
    }, 100);

});

function reset() {
    lastX = -1;
    lastY = -1;
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
    var lastX, lastY, currentX, currentY;
    
    for (var i = 1; i < coordinates.length; ++i) {
        lastX = coordinates[i - 1]['x'];
        lastY = coordinates[i - 1]['y'];     
        
        if (lastX == -1 && lastY == -1) {
            continue;
        } else {
            currentX = coordinates[i]['x'];
            currentY = coordinates[i]['y'];

            if (currentX == -1 && currentY == -1) {
                continue;
            }
            draw(ctx, lastX, lastY, currentX, currentY); 
        }
    }
}

function draw(ctx, lastX, lastY, currentX, currentY) {
    console.log("(" + lastX + ", " + lastY + ") to (" + currentX + ", " + currentY + ")");
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(currentX, currentY);
    ctx.closePath();
    ctx.stroke();
}

function enqueue(x, y) {
    queue.push({"x": x, "y": y});
}
