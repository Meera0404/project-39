var PLAY = 1;
var END = 0;
var gameState = PLAY;

var replay ,replayimg ; 

var gameoverimg, gameover ;

var checkpointS,jumpS ,gameoverS;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadImage("trex_collided.png");
  
  
  
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  gameoverimg = loadImage("gameOver.png");
  replayimg = loadImage("restart.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  back      = loadImage("backg.jpg");
  
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  
  gameover = createSprite(windowWidth/ 2  , 90, 70 , 100);
  gameover.scale = 0.75;
  gameover.addImage("gameover", gameoverimg); 
  gameover.visible = false ; 
  
  replay = createSprite(windowWidth/ 2  , 130 , 30, 30);
  replay.scale = 0.5;
  replay.addImage("gameover", replayimg); 
  replay.visible = false ; 
  
  trex = createSprite(80, 180 ,20,10);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.scale = 0.5;
  //trex.y = 300;
  
  ground = createSprite(200, 180 ,400,10);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.y = 180;
  
invisibleGround = createSprite(200, 190 ,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  
  score = 0;
  trex.collide(ground);

}

function draw() {
  background(back);
  //displaying score
  fill("black");
  text("Score: "+ score, 500,50);

  camera.position.x = windowWidth / 2 - 50;
  camera.position.y = trex.y;
  
  if(gameState === PLAY){
    
    gameover.visible = false;
    replay.visible = false;
    
    
    
    if( score >= 0 && score % 100 === 0 ){
      ground.velocityX = -(6+3*score/1000);
      
    }
    
     //scoring
    score = score + Math.round(getFrameRate() / 62);
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if( (keyDown("space") || touches.length > 0) && trex.y >= 160) {
        trex.velocityY = -13;
        touches = [];
        
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }
  }
   else if (gameState === END) {
     
     gameover.visible = true; 
       replay.visible = true;
     
      trex.velocityY=0;
      ground.velocityX = 0;
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
             
         
     obstaclesGroup.setLifetimeEach(-1);
     cloudsGroup.setLifetimeEach(-1);
       
    if(mousePressedOver(replay)){
     reset() ;
    }
     
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  
  
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(400,165,10,40);
   obstacle.velocityX = -(6+3*score/1000);

   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
   if (frameCount % 60 === 0) {
    cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
    }
}

function reset(){
  
    
     gameState = PLAY ;
  
gameover.visible = false ; 
 replay.visible = false ;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  score = 0;
}
