var HP=100;
var score=0;
var money=25;
var clock=0;
var FPS = 60;
var bgImg = document.createElement("img");
var badguy = document.createElement("img");
var towerimg = document.createElement("img");
var castleimg = document.createElement("img");
var crosshairimg = document.createElement("img");
// 設定這個元素的要顯示的圖片
bgImg.src = "images/ground.png";
badguy.src = "images/rukia.gif";
towerimg.src = "images/tower-btn.png";
castleimg.src = "images/tower.png";
crosshairimg.src = "images/crosshair.png";
// 找出網頁中的 canvas 元素
var canvas = document.getElementById("game-canvas");

// 取得 2D繪圖用的物件
var ctx = canvas.getContext("2d");

function draw(){
	clock++;
	if((clock%1)==0){
		var newEnemy=new Enemy();
		enemies.push(newEnemy);
	}
	// 將背景圖片畫在 canvas 上的 (0,0) 位置
  ctx.drawImage(bgImg,0,0);
  for(var i=0;i<enemies.length;i++){
     if(enemies[i].hp<=0){
     	enemies.splice(i,1);
     	money+=5,
     	score+=5
     }else{

    enemies[i].move();
    ctx.drawImage(badguy,enemies[i].x,enemies[i].y);
    }
  }
  if(isBuilding==true){
  ctx.drawImage(castleimg,cursor.x-cursor.x%32,cursor.y-cursor.y%32);
};	  
  for (var i = 0; i < towers.length; i++) {
   	ctx.drawImage(castleimg,towers[i].x,towers[i].y);
   	towers[i].searchEnemy();
  	if(towers[i].aimingEnemyId!=null){
 	 	var id=towers[i].aimingEnemyId;
  		ctx.drawImage(crosshairimg,enemies[id].x,enemies[id].y);
 	 }
  }
  ctx.fillText("HP:"+HP,32,32);
  ctx.font="24px Arial";
  ctx.fillStyle="white";
  ctx.fillText("Score:"+score,32,55);
  ctx.font="24px Arial";
  ctx.fillStyle="white";
  ctx.fillText("Money:"+money,32,76);
  ctx.font="24px Arial";
  ctx.fillStyle="white";
  ctx.drawImage(towerimg,576,416,64,64);
  if(HP<=0){
  	clearInterval(intervalID)
  	ctx.font="64px Arial";
  	ctx.fillStyle="red";
  	ctx.fillText("Game over",32*6,32*4);
  	ctx.fillText(" You got ",32*6,32*6);
  	ctx.fillText(score+"point",32*6,32*8);
  }
};
// 執行 draw 函式
var intervalID=setInterval(draw,1000/FPS);
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
	this.hp=6;
	this.speedX=0;
	this.speedY=-64;
	this.pathDes=0;
	this.move=function(){
        if(iscollided(enemypath[this.pathDes].x,enemypath[this.pathDes].y,this.x,this.y,64/FPS,64/FPS)){
           this.x=enemypath[this.pathDes].x;
           this.y=enemypath[this.pathDes].y;
           this.pathDes++; 
           if(this.pathDes==enemypath.length){
           	this.hp=0;
           	HP-=10;
           	return;
           }
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
function Tower(){
  this.x=0;
  this.y=0,
  this.range=128;
  this.ainmingEnemyId=null;
  this.searchEnemy= function(){
  	    this.readyToShootTime-=1/FPS;
		for(var i=0; i<enemies.length; i++){
			var distance = Math.sqrt(Math.pow(this.x-enemies[i].x,2) + Math.pow(this.y-enemies[i].y,2));
			if (distance<=this.range) {
				this.aimingEnemyId = i;
				if(this.readyToShootTime<=0){
					this.shoot(i);
					this.readyToShootTime=this.fireRate;
				}
				return;
			}
		}
		this.aimingEnemyId = null;
	},
	this.shoot=function(id){
      ctx.beginPath();
      ctx.moveTo(this.x+16,this.y+16);
      ctx.lineTo(enemies[id].x+16,enemies[id].y+16);
      ctx.strokeStyle='blue';
      ctx.lineWidth=5;
      ctx.stroke();
      enemies[id].hp-=this.damage;
	},
	this.fireRate=0.1,
	this.readyToShootTime=0.1,
	this.damage=2
}
var towers=[];
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
  	 	if(money>=25){
  	 		var newTower=new Tower();
  	 		newTower.x=cursor.x-cursor.x%32
  	 		newTower.y=cursor.y-cursor.y%32
  	 		towers.push(newTower);
  	 		money-=25;
  	 	}
     }
  	 	isBuilding=false;
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