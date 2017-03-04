var clock=0;
var FPS = 60;
var bgImg = document.createElement("img");
var badguy = document.createElement("img");
var towerimg = document.createElement("img");
var castleimg = document.createElement("img");
// 設定這個元素的要顯示的圖片
bgImg.src = "images/ground.png";
badguy.src = "images/rukia.gif";
towerimg.src = "images/tower-btn.png";
castleimg.src = "images/tower.png";
// 找出網頁中的 canvas 元素
var canvas = document.getElementById("game-canvas");

// 取得 2D繪圖用的物件
var ctx = canvas.getContext("2d");

function draw(){
	clock++;
	if((clock%90)==0){
		var newEnemy=new Enemy();
		enemies.push(newEnemy);
	}
	// 將背景圖片畫在 canvas 上的 (0,0) 位置
  ctx.drawImage(bgImg,0,0);
  for(var i=0;i<enemies.length;i++){
     enemies[i].move();
     ctx.drawImage(badguy,enemies[i].x,enemies[i].y);
  }
  ctx.drawImage(towerimg,576,416,64,64);
  if (isBuilding==true){
  ctx.drawImage(castleimg,cursor.x-cursor.x%32,cursor.y-cursor.y%32);
  }else{
  	ctx.drawImage(castleimg,tower.x,tower.y);
  }
}
// 執行 draw 函式
setInterval(draw,1000/FPS);
var enemypath=[
    {x:64,y:192},
    {x:128,y:192},
    {x:128,y:128},
    {x:160,y:128},
    {x:160,y:64},
    {x:256,y:64},
    {x:256,y:128},
    {x:224,y:128},
    {x:224,y:320},
    {x:128,y:320},
    {x:128,y:384},
    {x:320,y:384},
    {x:320,y:352},
    {x:352,y:352},
    {x:352,y:288},
    {x:320,y:288},
    {x:320,y:128},
    {x:352,y:128},
    {x:352,y:96},
    {x:416,y:96},
    {x:416,y:384},
    {x:576,y:384},
    {x:576,y:320},
    {x:512,y:320},
    {x:512,y:224},
    {x:576,y:224},
    {x:576,y:128},
]
function Enemy(){
	this.x=64;
	this.y=480-96;
	this.speedX=0;
	this.speedY=-64;
	this.pathDes=0;
	this.move=function(){
        if(iscollided(enemypath[this.pathDes].x,enemypath[this.pathDes].y,this.x,this.y,64/FPS,64/FPS)){
           this.x=enemypath[this.pathDes].x;
           this.y=enemypath[this.pathDes].y;
           this.pathDes++; 
           if(enemypath[this.pathDes].y<this.y){
               this.speedX=0;
               this.speedY=-64;
           }else if(enemypath[this.pathDes].x>this.x){
               this.speedX=64;
               this.speedY=0;
           }else if(enemypath[this.pathDes].y>this.y){
               this.speedX=0;
               this.speedY=64;
           }else if(enemypath[this.pathDes].x<this.x){
               this.speedX=-64;
               this.speedY=0;
           }
        }else{
        	this.x=this.x+this.speedX/FPS;
		    this.y=this.y+this.speedY/FPS;
        }
	}
};
var enemies=[];
var cursor={
	x:100,
	y:200
};
var tower={
  x:0,
  y:0
};
$("#game-canvas").on("mousemove",mousemove);
function mousemove(event){
	cursor.x=event.offsetX;
	cursor.y=event.offsetY;
}
var isBuilding=false;
$("#game-canvas").on("click",mouseclick);
function mouseclick(){
	if(cursor.x>576&&cursor.y>416){
      isBuilding=true;
  }else{
  	 if(isBuilding==true){
  	 	tower.x=cursor.x-cursor.x%32;
  	 	tower.y=cursor.y-cursor.y%32;
     }
  	 	isBuilding=false
  }
}
function iscollided(pointX,pointY,targetX,targetY,targetwidth,targetheight){
    if(targetX<=pointX&&
    	        pointX<=targetX+targetwidth&&
       targetY<=pointY&&
    	        pointY<=targetY+targetheight){
        return true;
    }else{
        return false;
    }
}