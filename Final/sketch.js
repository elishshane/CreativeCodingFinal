var font;
var ySound;
var startbgm;
var freezeSound;
var bombSound;
var gamebgm;
var letters = [];//to keep track of what letters are on the screen
var frame = 0;
var numColumns;
var score = 0;
var timeLimit = 3600;//game goes for one min 60fps
var correct = 0;
var numKeyTyped = 0.0000000000001;//can't divide by 0 
var fail = false;
var emp = [];//for item "f", keep track of permanently cleared columm
var infantY = 234;
var kidY = 294;
var wallstreetY = 354;
var matrixY = 414;
var gtfoY = 474;
var noItemY = 534;
var bWidth = 150;
var bHeight = 35;
var started = false;
var matrixStarted = false;
var gtfoStarted = false;
var niStarted = false;
var fpd; // frames per drop
var gameIsOver = false;
var loading = 0;
var restarting = 0;
var noItemMode = false;
var bombRadius = 0;


function preload(){
  font = loadFont('data/font0.otf');
  ySound = loadSound('data/341695__projectsu012__coins-1.wav');
  startbgm = loadSound('data/20 - Can You Dig It (Iron Man 3 Main Titles) (Iron Man 3 - Brian.mp3');
  gamebgm = loadSound('data/open Hexagon bgm.mp3');
  freezeSound = loadSound('data/freeze.m4a');
  bombSound = loadSound('data/s.m4a');
  matrixbgm = loadSound('data/BUG.m4a');
  gtfobgm = loadSound('data/Night of Nights.mp3');
  nibgm = loadSound('data/_Undertale - Megalovania.mp3')
}
function setup() {
  createCanvas( 300, 600);
  frameRate(60);
  startbgm.setVolume(1);
  startbgm.loop();

}

function draw() {
  if( started == false && matrixStarted == false && gtfoStarted == false && niStarted == false){
    startScreen();
    return;
  }
  if( loading < 300){
    loading += 1;
    howToPlay();
    return;
  }
  if(gameIsOver == true){
    restarting += 1
    if( restarting > 600){
      restart();
      return;
    }
  }
  for( var i = 0; i < letters.length; i++){
    if( fail == true || (letters[i].length != 0 && letters[i][letters[i].length - 1].restY < 0)){
      //when f is type or letter reaches the top display game over
      gameIsOver = true;
      gameover();
      return;
    }
  }
  if(frame == timeLimit){//game goes for a minute
    gameIsOver = true;
    youWon();
    return;
  }
  background(0);
  if( frame > timeLimit - 480){
    textAlign(CENTER);
    fill(190, 190, 190);
    textFont(font, 300);
    text( Math.ceil((timeLimit - frame) / 60), 135, 350);
  }
  for( var i = 0; i < letters.length; i++){//make every letter fall and display
    for( var j = 0; j < letters[i].length; j++){
      letters[i][j].fall();
      if( j == letters[i].length - 1){
        letters[i][j].display(true);
      }else{
        letters[i][j].display(false);
      }
    }
  }
  frame += 1;
  if( frame % fpd == 0){//repeating action for every 120 frames
    /*
    if(letters.length == 0){
      letters.push(new Letter(0, random(alphabet.split("")), height)); //adding random letter into "letters"
    }else{
      letters.push(new Letter(0, random(alphabet.split("")), letters[letters.length - 1].restY - 25)); 
      //make resting y position of new letter right above the last letter
    }*/
    var fontSize = 270 / numColumns;
    for( var i = 0; i < letters.length; i++){
      if(emp.indexOf(i) != -1){
        letters[i] = [];
      }else if( letters[i].length == 0 ){
        letters[i].push(new Letter((fontSize+5) * i, randomLetter(), height));
      }else{
        letters[i].push(new Letter((fontSize+5) * i, randomLetter(), letters[i][letters[i].length - 1].restY-fontSize));
      }
    }
  }
  if(bombRadius > 0){
    ellipseMode(CENTER);
    fill(random(256), random(256), random(256));
    ellipse(width / 2, height / 2, bombRadius * 2, bombRadius * 2)
    bombRadius += 20;
    if(bombRadius > 400){
      bombRadius = 0;
    }
  }
}

function Letter(x, txt, restY){
  // x = x position of letter
  //restY = restingY of fall
  this.position = createVector(x, 0);
  this.velocity = createVector(0, random(2, 15));
  this.txt = txt;
  this.restY = restY;
}

Letter.prototype.fall = function(){
  if( this.position.y > this.restY){
    this.velocity.y = 0
    this.position.y = this.restY - 10
  }
  else{
    this.position.add(this.velocity);
  }
}

Letter.prototype.display = function(canBeTyped){
  textAlign(LEFT);
  if(canBeTyped == false){
    fill(255, 165, 0);
  }else if( noItemMode == true){
    fill(255, 255, 0); 
  }else if(this.txt == "!"){
    fill(255, 165, 0);
  }else if(this.txt == "c"){
    fill(0, 255, 0);
  }else if(this.txt == "x"){
    fill(255, 0, 0);
  }else if(this.txt == "s"){
    fill(random(0, 256), random(0, 256), random(0, 256));
  }else if(this.txt =="f"){
    fill(0, 255, 255);
  }else{
    fill(255, 255,0);
  }
  textFont( font, width / numColumns);
  text( this.txt, this.position.x, this.position.y);
}

function randomLetter(){
  var r  = random();
  if( noItemMode == true){
    return random("qwertyuiopasdfghjklzxcvbnm".split(""));
  }else if(r < 0.01){
    return "s";
  }else if(r < 0.09){
    return random(["!","c","f","x"]);
  }else{
    return random("qwertyuiopadghjklzvbnm".split(""));
  }
}

function keyTyped(){//deleted letters that are types
  if( gameIsOver == true ){
    return;
  }
  if (key == "!"){
    return;
  }
  for( var i = 0; i < letters.length; i++){
    if( letters[i].length != 0 && key == letters[i][letters[i].length - 1].txt){//compare last letter and whats typed
      if( key == "x" && noItemMode == false){
        fail = true;
      }else if( key == "c" && noItemMode == false){
        score += letters[i].length;
        letters[i] = [];
      }else if( key == "f" && noItemMode == false){
        emp.push(i);
        score += letters[i].length;
        letters[i] = [];
        freezeSound.setVolume(0.7);
        freezeSound.play();
      }else if( key == "s" && noItemMode == false){
        bomb();
        bombSound.setVolume(3);
        bombSound.play();
      }else{  
        letters[i].pop();
        score += 1;
        ySound.setVolume(0.5);
        ySound.play();
      }
      correct += 1;
    }
  }
  numKeyTyped += 1;
}

function bomb(){//clear screen
  bombRadius = 1;
  for( var i = 0; i < letters.length; i++){
    score += letters[i].length;
    letters[i] = [];
  }
  emp = [];
}
function mouseClicked(){
  if(mouseX < 150 + bWidth / 2 && mouseX > 150 - bWidth / 2 && started == false){
    if(mouseY > infantY - bHeight / 2 && mouseY < infantY + bHeight / 2){
      numColumns = 5;
      createColumns();
      fpd = 150;
      started = true;
    }else if(mouseY > kidY - bHeight / 2 && mouseY < kidY + bHeight / 2){
      numColumns = 5;
      createColumns();
      fpd = 100;
      started = true; 
    }else if(mouseY > wallstreetY - bHeight / 2 && mouseY < wallstreetY + bHeight / 2){
      numColumns = 5;
      createColumns();
      fpd = 70;
      started = true;
    }else if(mouseY > matrixY - bHeight / 2 && mouseY < matrixY + bHeight / 2){
      numColumns = 7;
      createColumns();
      fpd = 50;
      matrixStarted = true;
    }else if(mouseY > gtfoY - bHeight / 2 && mouseY < gtfoY + bHeight / 2){
      numColumns = 12;
      createColumns();
      fpd = 12;
      gtfoStarted = true;
    }else if(mouseY > noItemY - bHeight / 2 && mouseY < noItemY + bHeight /2){
      numColumns = 5;
      createColumns()
      fpd = 100;
      noItemMode = true;
      niStarted = true;
    }
    if(started == true){
      startbgm.stop();
      gamebgm.setVolume(0.6);
      gamebgm.loop();
    }else if(matrixStarted == true){
      startbgm.stop();
      matrixbgm.setVolume(0.3);
      matrixbgm.loop();
    }else if(gtfoStarted == true){
      startbgm.stop();
      gtfobgm.setVolume(0.6);
      gtfobgm.loop();
    }else if(niStarted == true){
      startbgm.stop();
      nibgm.loop();
    }
  }
}

function createColumns(){
  letters = []
  for( var i = 0; i < numColumns; i++){
    letters.push([]);
  }
}
function startScreen(){
  background(0);
  textAlign(CENTER);
  fill(255, 255, 0);
  textFont(font, 20);
  text( "Can You Type?!", 150, 100);
  
  rectMode(CENTER);
  fill(0);
  stroke('rgb(255,105,180)');
  strokeWeight(4);
  rect(150, infantY, bWidth, bHeight);
  strokeWeight(0);
  fill(255, 105, 180);
  text( "infant", 150, infantY + 6);
  
  fill(0);
  stroke('rgb(255,165,0)');
  strokeWeight(4);
  rect(150, kidY, bWidth, bHeight);
  strokeWeight(0);
  fill(255, 165, 0);
  text( "little kid", 150, kidY + 6);
  
  fill(0);
  stroke('rgb(0,255,255)');
  strokeWeight(4);
  rect(150, wallstreetY, bWidth, bHeight);
  strokeWeight(0);
  fill(0, 255, 255);
  text( "wallstreet", 150, wallstreetY + 6);
  
  fill(0);
  stroke('rgb(0,255,0)');
  strokeWeight(4);
  rect(150, matrixY, bWidth, bHeight);
  strokeWeight(0);
  fill(0, 255, 0);
  text( "matrix", 150, matrixY + 6);
  
  fill(0);
  stroke('rgb(255,0,0)');
  strokeWeight(4);
  rect(150, gtfoY, bWidth, bHeight);
  strokeWeight(0);
  fill(255, 0, 0);
  text( "GTFO", 150, gtfoY + 6);
  
  fill(0);
  stroke('rgb(255,255,0)');
  strokeWeight(4);
  rect(150, noItemY, bWidth, bHeight);
  strokeWeight(0);
  fill(255, 255, 0);
  text( "No Item", 150, noItemY + 6);
}

function howToPlay(){
  background(0);
  textAlign(CENTER);
  textFont(font, 20);
  fill(255);
  text( "How To Play", 150, 50);
  fill(255, 255, 0);
  text("Type Yellow Letters", 150, 210)
  fill(random(256), random(256), random(256));
  text( "s = Wipe Everything", 150, 240);
  fill(0, 255, 0);
  text( "c = Clear Column", 150, 270);
  fill(0, 255, 255);
  text("f = Freeze Column", 150, 300);
  fill(250, 165, 0);
  text("! = Cannot be typed", 150, 330);
  fill(250, 0, 0);
  text("x = gameover", 150, 360);
  
}
function gameover(){
  background(0);
  textAlign(LEFT);
  fill(255,0,0);
  textFont(font, 20);
  text( "Game Over", 80, 200);
  text( "Score: " + score, 100, 230);
  text( "Accuracy: " + Math.round( correct / numKeyTyped * 100 ) + "%", 63, 260);
  text( "Game restarts in " + Math.ceil((600 - restarting)/ 60), 23, 290);
}

function youWon(){
  background(0);
  fill(255);
  textAlign(LEFT);
  textFont( font, 20);
  text( "YOU WON", 90, 200);
  text( "Score: " + score, 100, 230);
  text( "Accuracy: " + Math.round( correct / numKeyTyped * 100 ) + "%", 63, 260);
  text( "Game restarts in " + Math.ceil((600 - restarting)/ 60), 23, 290);  
}

function restart(){
  fail = false;
  started = false;
  gameIsOver = false;
  loading = 0;
  frame = 0;
  letters = [];
  numKeyTyped = 0.0000000000001;
  emp = [];
  score = 0;
  correct = 0;
  restarting = 0;
  gamebgm.stop();
  matrixbgm.stop();
  gtfobgm.stop();
  nibgm.stop();
  startbgm.loop();
  noItemMode = false;
  matrixStarted = false;
  gtfoStarted = false;
  niStarted = false;
}
///info screen before start
///sound