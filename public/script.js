//import {MDCSlider} from '@material/slider';

function login() {
    let url = "/create";
    let myForm = document.getElementById('form');
    myForm.action = url;
    myForm.submit();
}

window.onload = function(e){
    let canvas1 = document.getElementById('graph1');
    let context1 = canvas1.getContext('2d');
    let canvas2 = document.getElementById('graph2');
    let context2 = canvas2.getContext('2d');
    let canvas3 = document.getElementById('graph3');
    let context3 = canvas3.getContext('2d');

    var legend1 = document.getElementById("legend1");
    var legend2 = document.getElementById("legend2");
    var legend3 = document.getElementById("legend3");
    setInterval(async function(){
        let canvConv = {
            'context': context1, 
            'canvas': canvas1,
            'padding': 20,
            'legend': legend1
        };
        
        let data = await getData("localhost:3010/api");
        await graphRaw(canvConv, data[0]);

        canvConv = {
            'context': context2, 
            'canvas': canvas2,
            'padding': 20,
            'legend': legend2
        };
        await graphRaw(canvConv, data[1]);

        canvConv = {
            'context': context3, 
            'canvas': canvas3,
            'padding': 20,
            'legend': legend3
        };
        await graphRaw(canvConv, data[2]);
    }, 1000);
};

async function getData(dataUrl){
    let resp = await fetch("http://localhost:3010/api");
    let raw = await resp.json();

    let answ1 = {};
    let answ2 = {};
    let answ3 = {};
    
    raw.forEach(element => {
        answ1.__q = element.question1;
        answ2.__q = element.question2;
        answ3.__q = element.question3;

        if(element.answer1 in answ1){
            answ1[element.answer1] ++;
        }else{
            answ1[element.answer1] = 1;
        }
        if(element.answer2 in answ2){
            answ2[element.answer2] ++;
        }else{
            answ2[element.answer2] = 1;
        }
        if(element.answer3 in answ3){
            answ3[element.answer3] ++;
        }else{
            answ3[element.answer3] = 1;
        }
    });

    return [answ1, answ2, answ3];
}
async function graphRaw(canvConv, data){
    canvConv.context.clearRect(0, 0, canvConv.canvas.width, canvConv.canvas.height);

    var maxValue = 0;
    for (var categ in data){
        if(categ.includes("__")){
            continue;
        }
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
        if(categ.includes("__")){
            continue;
        }

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
    canvConv.context.fillText(data.__q, canvConv.canvas.width/2,canvConv.canvas.height);
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


