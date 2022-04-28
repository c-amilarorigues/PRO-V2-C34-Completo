const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;

var PLAY = 1;
var END = 0;
var WIN = 2;
var gameState = PLAY;

var mario, mario_running, mario_jumping, mario_stop;
var plantsGroup, plant_eating;
var coinsGroup, coins_img;
var star_png, one_star, two_star, tree_star;
var zero_star;
var cloud_img, cloudsGroup;
var ground, invisible_ground, ground_img;
var surpriseGroup, surprise_img;
var coin1, coin2, coin3;
var touches = [0, 1, 2];

var rope, fruit, ground;
var fruit_con;
var fruit_con_2;
var fruit_con_3;
var rope3;

var bg_img;
var food;
var rabbit;

var button, button2, button3;
var bunny;
var blink, eat, sad;
var mute_btn;

var fr;

var bk_song;
var cut_sound;
var sad_sound;
var eating_sound;
var air;

var star;
var star_img;
function preload() {
  // bg_img = loadImage('background.png');
  // food = loadImage('melon.png');
  // rabbit = loadImage('Rabbit-01.png');
  // star_img = loadImage('star.png');

  // bk_song = loadSound('sound1.mp3');
  // sad_sound = loadSound("sad.wav")
  // cut_sound = loadSound('rope_cut.mp3');
  // eating_sound = loadSound('eating_sound.mp3');
  // air = loadSound('air.wav');

  // blink = loadAnimation("blink_1.png", "blink_2.png", "blink_3.png");
  // eat = loadAnimation("eat_0.png", "eat_1.png", "eat_2.png", "eat_3.png", "eat_4.png");
  // sad = loadAnimation("sad_1.png", "sad_2.png", "sad_3.png");

  // empty_star = loadAnimation("empty.png");
  // one_star = loadAnimation("one_star.png");
  // two_star = loadAnimation("stars.png");

  // blink.playing = true;
  // eat.playing = true;
  // sad.playing = true;
  // sad.looping = false;
  // eat.looping = false;

  mario_running = loadAnimation("assets/mario1.png", "assets/mario2.png", "assets/mario3.png");
  mario_jumping = loadImage("assets/mariojump.png");
  mario_stop = loadImage("assets/mario1.png");

  plant_eating = loadAnimation("./assets/planta1.png", "./assets/planta2.png");
  surprise_img = loadImage("./assets/surprise.png");
  coins = loadImage("./assets/coin.png");

  one_star = loadImage("./assets/1star.png");
  two_star = loadImage("./assets/2star.png");
  tree_star = loadImage("./assets/3star.png");
  zero_star = loadImage("./assets/0star.png");

  cloud_img = loadImage("./assets/cloud.png");
  ground_img = loadImage("./assets/ground.png");

  mario_running.playing = true;
  mario_jumping.playing = true;
  mario_stop.playing = true;
  mario_stop.looping = false;
  mario_jumping.looping = false;
}

function setup() {
  createCanvas(windowWidth, windowHeight);


  engine = Engine.create();
  world = engine.world;
  mario = createSprite(50, windowHeight - 170, 20, 50);
  mario.scale = 0.2;

  mario.addAnimation("running", mario_running);
  mario.addImage("jumping", mario_jumping);
  mario.addImage("stop", mario_stop);
  //mario.addImage("stop");
  mario.setCollider("rectangle", 0, 0, mario.width, mario.height);

  ground = createSprite(windowWidth / 2, windowHeight - 10, 400, 20);

  ground.scale = 0.5
  ground.addImage("ground", ground_img);
  ground.x = ground.width / 2;

  var star_display = createSprite(50, 20, 30, 30);
  star_display.scale = 0.2;
  star_display.addImage("zero", zero_star);
  star_display.addImage("one", one_star);
  star_display.addImage("two", two_star);
  star_display.addImage("tree", tree_star);
  //star_display.addImage("'empty'");

  invisibleGround = createSprite(50, windowHeight - 10, 400, 10);
  invisibleGround.visible = false;
  console.log(invisibleGround.y);

  plantsGroup = createGroup();
  cloudsGroup = createGroup();
  surpriseGroup = createGroup();
  coinsGroup = createGroup();


  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50)

}

function draw() {
  background("lightBlue");
  if (gameState === PLAY) {

    ground.velocityX = -3;
    mario.addAnimation("running");

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    };

    if (keyDown("space") && mario.y >= windowHeight - 39 || touches.length > 0 || touches.length > 0) {
      mario.velocityY = -12;
      mario.addImage("jumping");
    };

    mario.velocityY = mario.velocityY + 0.8;
    mario.collide(ground);

    if (plantsGroup.isTouching(mario)) {
      gameState = END;
    };

    if (surpriseGroup.isTouching(mario) && touches[0]) {
      coinsGroup();
      star_display.addImage('one');
      touches[1];
    };

    if (surpriseGroup.isTouching(mario) && touches[1]) {
      coinsGroup();
      star_display.addImage('two');
      touches[2];
    };

    if (surpriseGroup.isTouching(mario) && touches[1]) {
      coinsGroup();
      star_display.addImage('tree');
      gameState = WIN;
    };


  } else if (gameState === WIN) {
    win();
  }
  else if (gameState === END) {
    gameOver();
  };

  drawSprites();
}
function spawPlants() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(windowWidth, windowHeight - 35, 10, 40);
    obstacle.velocityX = -3;
    obstacle.addAnimation("death", plant_eating);
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    plantsGroup.add(obstacle);
  }
};

function spawClouds() {
  if (frameCount % 60 === 0) {
    var cloud = createSprite(windowWidth, 120, 40, 10);
    cloud.y = Math.round(random(90, 110));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -2;
    cloud.lifetime = windowWidth;
    cloud.depth = mario.depth;
    mario.depth = mario.depth + 1;
    cloudsGroup.add(cloud);
  }
};

function spawSurprise() {
  var gift = createSprite(windowWidth, windowHeight - 35, 20, 20);
  gift.y = Math.round(random(90, 150));
  gift.addImage(surprise_img);
  gift.scale = 0.5;
  gift.velocityX = -3;
  gift.lifetime = 300;
  surpriseGroup.add(gift);
};

function spawCoins() {
  var options = {
    restitution: 0.5,
    frictionAir: 0,
    friction: 0.02
  }
  coin1 = Bodies.circle(300, 300, 20, options);
  coin1.addImage("coin", coins_img);
  coin1.scale = 0.5;
  coin2 = Bodies.circle(300, 300, 20, options);
  coin2.addImage("coin", coins_img);
  coin2.scale = 0.5;
  coin3 = Bodies.circle(300, 300, 20, options);
  coin3.addImage("coin", coins_img);
  coin3.scale = 0.5;
};

function win() {
  swal(
    {
      title: `YOU WIN!!`,
      text: "Obrigado por jogar!!",
      imageUrl:
        "https://o.remove.bg/downloads/98a5c951-a2d2-4e57-ad6f-bfd3e6fe764e/image-removebg-preview.png",
      imageSize: "150x150",
      confirmButtonText: "Jogar Novamente"
    },
    function (isConfirm) {
      if (isConfirm) {
        location.reload();
      }
    }
  );
}

function gameOver() {
  swal(
    {
      title: `GAME OVER!!`,
      text: "Obrigado por jogar!!",
      imageUrl:
        "https://o.remove.bg/downloads/8751b30c-085b-46d5-b3a5-179c768e10cb/image-removebg-preview.png",
      imageSize: "150x150",
      confirmButtonText: "Jogar Novamente"
    },
    function (isConfirm) {
      if (isConfirm) {
        location.reload();
      }
    }
  );
}



