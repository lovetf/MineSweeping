var board = document.getElementById('board');
var ctx = board.getContext('2d');

var mines = [];
var colors = ["green", "blue", "red", "yellow", "magenta", "orange", "brown", "purple", "pink"];
var width = 30, height = 16, mineNum = 99;
var length = 50;

var _imgs = [];
var _mine = new Image(length, length);
_mine.src = 'image/mine.gif';
for(var i = 0; i < 9; i++)
{
    _imgs.push(new Image(length, length));
    _imgs[i].src = 'image/'+i.toString()+'.gif';
}

board.onmousedown = clickMine;
board.onmousemove = moveMine;

function Mine(x, y, color, data){
    this.x = x;
    this.y = y;
    this.color = color;
    this.data = data;
    this.isShow = false;
    this.isHang = false;
}

function boardobj(){
    this.width = 0;
    this.height = 0;
    this.toId = function(x, y)
    {
        return this.height*x + y;
    }
}

var theboard = new boardobj();

function randomFromTo(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
}

function initialize(width, height, number)
{

    board.width = width*length;
    board.height = height*length;
    theboard.width = width;
    theboard.height = height;
    mines = [];

    for(var i = 0; i < width; i++)
    {
        for(var j = 0; j < height; j++)
        {
            mines.push(new Mine(i, j, colors[0], 0));
        }
    }

    while(number-- > 0)
    {
        var w = randomFromTo(0, width-1);
        var h = randomFromTo(0, height-1);
        var id = theboard.toId(w, h);
        
        if(mines[id].data >= 0)
        {
            for(var i = -1; i <= 1; i++)
                for(var j = -1; j <= 1; j++)
                {
                    var wi = w + i;
                    var hj = h + j;

                    if(wi < 0 || wi >= width || hj < 0 || hj >= height)   continue;

                    if(i == j && i == 0)
                    {
                        mines[theboard.toId(w, h)].data = -1;
                        mines[theboard.toId(w, h)].color = colors[1];
                    }
                    else
                    {
                        if(mines[theboard.toId(w+i, h+j)].data >= 0)
                        {
                            mines[theboard.toId(w+i, h+j)].data++;
                            mines[theboard.toId(w+i, h+j)].color = colors[0];
                        }
                    }    
                }
        }
        else{
            number++;
        }
    }
}

function gameover()
{
    for(var i = mines.length - 1; i >=0 ; i--)
    {
        if(mines[i].data >= 0) continue;
        mines[i].isShow = true;
    }
}

function clickMine(e)
{
    var w = parseInt((e.clientX - board.offsetLeft)/length);
    var h = parseInt((e.clientY - board.offsetTop)/length);
    var id = theboard.toId(w, h);
    mines[id].isShow = true;
    if(mines[id].data == 0) neighbor(id)
    else if(mines[id].data == -1)   gameover();
    drawMines();
}

function moveMine(e)
{
    var w = parseInt((e.clientX - board.offsetLeft)/length);
    var h = parseInt((e.clientY - board.offsetTop)/length);
    var id = theboard.toId(w, h);
    for(var i = mines.length - 1; i >=0 ; i--)  mines[i].isHang = false;
    mines[id].isHang = true;
    drawMines();
}

function neighbor(id)
{
    var start, end, top;
    var w, h;
    var queue = [];
    
    start = end = 0;
    queue.push(id);
    while(start <= end)
    {
        top = queue[start++];
        w = parseInt(top/height);
        h = top%height;
        for(var i = -1; i <= 1; i++)
            for(var j = -1; j <= 1; j++)
            {
                var wi = w + i;
                var hj = h + j;
                if(wi < 0 || wi >= width || hj < 0 || hj >= height)   continue;
                if(mines[theboard.toId(wi, hj)].isShow == true)    continue;
                mines[theboard.toId(wi, hj)].isShow = true;
                if(mines[theboard.toId(wi, hj)].data == 0)
                {
                    queue.push(theboard.toId(wi, hj));
                    end++;
                } 
                
            }
    }
}

function drawMines()
{
    ctx.clearRect(0, 0, board.width, board.height);
    for(var i = mines.length - 1; i >=0 ; i--)
    {
        ctx.fillStyle = '#222';
        if(mines[i].isShow != false)
        {
            if(mines[i].data >= 0)  ctx.drawImage(_imgs[mines[i].data], mines[i].x*length, mines[i].y*length, length-1, length-1);
            else    ctx.drawImage(_mine, mines[i].x*length, mines[i].y*length, length-1, length-1);
            ctx.stroke();
        }
        else
        {
            if(mines[i].isHang == true)    ctx.fillStyle = '#333';
            ctx.fillRect(mines[i].x*length, mines[i].y*length, length-1, length-1);
            ctx.stroke();
        }
    }
}

initialize(width, height, mineNum);
drawMines();

var start = document.getElementById('start');
start.onmousedown = function(e)
{
    initialize(width, height, mineNum);
    drawMines();
}