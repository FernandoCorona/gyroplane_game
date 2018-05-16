var myGamePiece;
var myObstacles = [];
var myScore;

var html = '<div id="container"><h1 style = "text-align: center; color: orange;">Gyro Plane</h1><br><img src="images/airplane.gif"style= " width:30%; height: auto; margin-top: 20%; margin-bottom: 0%; margin-right: 40%; margin-left: 35%;" > <a href="index.html" class=""><img src="images/replay.gif"style= "width:30%; height: auto; margin-top: 0%; margin-bottom: 0%; margin-right: 40%; margin-left: 35%;"></a></div>';

//Funtion intializer
function startGame() {
    myGamePiece = new component(window.innerWidth/6, window.innerWidth/6, "images/airplane.gif", 10, 120, "image");
    myScore = new component("25px", "Comic Sans MS", "orange", window.innerWidth/2, 30, "text"); 
    //myObstacle  = new component(50, 50, "cloud.png", 300, 120, "image");    
    myGameArea.start();
    gyro()
}
//creates canvas
var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);

    }
}
//defines coponents and bouderies/crash
function component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "image") {
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;  
    this.update = function() {
        ctx = myGameArea.context;
        if (type == "image") {// if image make  image
            ctx.drawImage(this.image, 
                this.x, 
                this.y,
                this.width, this.height);
        }else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.updateScore = function() {// this function is use to update things
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        }else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }  
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;        
    }    
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}
//update the canvar by frame
function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            myGameArea.stop();
            document.getElementById("body").innerHTML = html;
            return;
        } 
    }
    //// stop game if gets out of canvas
    if (myGamePiece.y > (window.innerHeight-80) || myGamePiece.y < -10)
    {myGameArea.stop();
    document.getElementById("body").innerHTML = html;}

    ///
    myGameArea.clear();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 10 + window.innerWidth/6;
        maxGap = window.innerHeight - minGap;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        myObstacles.push(new component(window.innerWidth/6, window.innerWidth/6, "images/cloud.gif", x, height,"image"));// //myObstacle  = new component(50, 50, "cloud.png", 300, 120, "image"); 
        myObstacles.push(new component(window.innerWidth/6, window.innerWidth/6, "images/cloud.gif", x, height+gap,"image"));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -1;
        myObstacles[i].update();
    }
    myGamePiece.newPos();    
    myGamePiece.update();
    myScore.text="SCORE: " + myGameArea.frameNo;//myGamePiece.x; the commnet will give you the heig//myGamePiece.speedY;
    myScore.updateScore();
}
function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}
//read mobile device gyroscope data
function gyro() {
  // Check for support for DeviceMotion events
  //var dataContainerMotion = document.getElementById('dataContainerMotion');
      if(window.DeviceMotionEvent) {
        window.addEventListener('devicemotion', function(event) {          
        var z = event.accelerationIncludingGravity.z;
        myGamePiece.speedY = (z*2)+5;  //multiply by 2 to increase speed & add 5 to scale to good hand movement                          
        });
      }    
}

