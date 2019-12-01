function login() {
    let url = "/create";
    let myForm = document.getElementById('form');
    myForm.action = url;
    myForm.submit();
}

window.onload = function(e){
    let canvas1 = document.getElementById('graph1');
    let context1 = canvas1.getContext('2d');
    var legend = document.getElementById("legend1");
    setInterval(async function(){
        let canvConv = {
            'context': context1, 
            'canvas': canvas1,
            'padding': 20,
            'legend': legend
        };
        
        let data = await getData("localhost:3010/api");
        await graphRaw(canvConv, data);
    }, 1000);
}

async function getData(dataUrl){
    var myVinyls = {
        "Classical music": 10,
        "Alternative rock": 14,
        "Pop": 2,
        "Jazz": 12
    };
    return myVinyls;
}
async function graphRaw(canvConv, data){
    canvConv.context.clearRect(0, 0, canvConv.canvas.width, canvConv.canvas.height);

    var maxValue = 0;
    for (var categ in data){
        maxValue = Math.max(maxValue,data[categ]);
    }
    maxValue = Math.ceil(maxValue/5)*5 + 5;
    var canvasActualHeight = canvConv.canvas.height - canvConv.padding * 2;
    var canvasActualWidth = canvConv.canvas.height - canvConv.padding * 2;

    //drawing the grid lines
    var gridValue = 0;
    while (gridValue <= maxValue){
        var gridY = canvasActualHeight * (1 - gridValue/maxValue) - canvConv.padding * 1;
        drawLine(
            canvConv.context,
            0,
            gridY,
            canvConv.canvas.width,
            gridY,
            "#222"
        );
            
        //writing grid markers
        canvConv.context.save();
        canvConv.context.fillStyle = "#222";
        canvConv.context.font = "bold 10px Arial";
        canvConv.context.fillText(gridValue, 10, gridY - 2);
        canvConv.context.restore();

        gridValue+=5;
    }

    //drawing the bars
    var numberOfBars = Object.keys(data).length;
    var barSize = (canvasActualWidth)/numberOfBars;// - canvConv.padding * (numberOfBars-1);
    
    while (canvConv.legend.firstChild) {
        canvConv.legend.removeChild(canvConv.legend.firstChild);
    }
    var ul = document.createElement("ul");
    canvConv.legend.append(ul);
    
    var barIndex = 0;
    for (categ in data){
        var val = data[categ];
        var barHeight = Math.round(canvasActualHeight * val/maxValue);
        drawRect(
            canvConv.context,
            canvConv.padding * 2 + (barSize + canvConv.padding) * barIndex,
            canvasActualHeight - barHeight - canvConv.padding,
            barSize,
            barHeight,
            colors[barIndex % colors.length]
        );

        var li = document.createElement("li");
        li.style.listStyle = "none";
        li.style.borderLeft = "20px solid " + colors[barIndex % colors.length];
        li.style.padding = "5px";
        li.textContent = categ + " - " + val;
        ul.append(li);

        barIndex++;
    }

    
    canvConv.context.save();
    canvConv.context.textBaseline="bottom";
    canvConv.context.textAlign="center";
    canvConv.context.fillStyle = "#000000";
    canvConv.context.font = "bold 14px Arial";
    canvConv.context.fillText("seriesName", canvConv.canvas.width/2,canvConv.canvas.height);
    canvConv.context.restore();
}

function drawRect(context, upperLeftCornerX, upperLeftCornerY, width, height, color){
    context.save();
    context.fillStyle = color;
    context.fillRect(upperLeftCornerX,upperLeftCornerY,width,height);
    context.restore();
}
function drawLine(context, startX, startY, endX, endY, color){
    context.save();
    context.strokeStyle = color;
    context.beginPath();
    context.moveTo(startX,startY);
    context.lineTo(endX,endY);
    context.stroke();
    context.restore();
}

let colors = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', '#ffffff', '#000000'];