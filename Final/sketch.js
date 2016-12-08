var font;
var alphabet = "qqqwwwweeeerrrttttyyyuuiiiooooppppaaaaassddddfffggghhhhjjjjkkkkllllzzzzzxxxcccvvvvvbbbbbnnnnnmmmm!!!!!!";
var letters = [];//to keep track of what letters are on the screen
var frame = 0;
var numColumns;
var score = 0;
var numKeyTyped = 0.0000000000001;//can't divide by 0 
var fail = false;
var emp = [];//for item "s", keep track of permanently cleared columm
var infantY = 294;
var kidY = 354;
var wallstreetY = 414;
var matrixY = 474;
var gtfoY = 534;
var bWidth = 150;
var bHeight = 35;
var started = false;
var fpd; // frames per drop

function preload(){
  font = loadFont('data/font0.otf');
}
function setup() {
  createCanvas( 300, 600);
  frameRate(60);
  startScreen();

}

function draw() {
  if( started == false){
    return;
  }
  for( var i = 0; i < letters.length; i++){
    if( fail == true || (letters[i].length != 0 && letters[i][letters[i].length - 1].restY < 0)){
      //when f is type or letter reaches the top display game over
      gameover();
      return;
    }
  }
  if(frame == 3600){//game goes for a minute
    youWon();
    return;
  }
  background(0);
  for( var i = 0; i < letters.length; i++){//make every letter fall and display
    for( var j = 0; j < letters[i].length; j++){
      letters[i][j].fall();
      letters[i][j].display();
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
        letters[i].push(new Letter((fontSize+5) * i, random(alphabet.split("")), height));
      }else{
        letters[i].push(new Letter((fontSize+5) * i, random(alphabet.split("")), letters[i][letters[i].length - 1].restY-fontSize));
      }
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

Letter.prototype.display = function(){
  textAlign(LEFT);
  if(this.txt == "!"){
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

function keyTyped(){//deleted letters that are types
  if (key == "!"){
    return;
  }
  for( var i = 0; i < letters.length; i++){
    if( letters[i].length != 0 && key == letters[i][letters[i].length - 1].txt){//compare last letter and whats typed
      if( key == "x"){
        fail = true;
      }else if( key == "c"){
        score += letters[i].length;
        letters[i] = [];
      }else if( key == "f"){
        emp.push(i);
        score += letters[i].length;
        letters[i] = [];
      }else if( key == "s"){
        bomb();
      }else{  
        letters[i].pop();
        score += 1;
      }
    }
  }
  numKeyTyped += 1;
}

function bomb(){//clear screen
  for( var i = 0; i < letters.length; i++){
    score += letters[i].length;
    letters[i] = [];
  }
}
function gameover(){
  background(0);
  textAlign(LEFT);
  fill(255,0,0);
  textFont(font, 20);
  text( "Game Over", 80, 200);
  text( "Score: " + score, 100, 230);
  text( "Accuracy: " + Math.round( score / numKeyTyped * 100 ) + "%", 63, 260);
}

function youWon(){
  background(0);
  fill(255);
  textAlign(LEFT);
  textFont( font, 20);
  text( "YOU WON", 90, 200);
  text( "Score: " + score, 100, 230);
  text( "Accuracy: " + Math.round( score / numKeyTyped * 100 ) + "%", 63, 260);
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
      started = true;
    }else if(mouseY > gtfoY - bHeight / 2 && mouseY < gtfoY + bHeight / 2){
      numColumns = 12;
      createColumns();
      fpd = 12;
      started = true;
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
  text( "Can You Type?!", 150, 130);
  
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
  stroke('rgb(0,0,255)');
  strokeWeight(4);
  rect(150, wallstreetY, bWidth, bHeight);
  strokeWeight(0);
  fill(0, 0, 255);
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
}
///difficulty(baby, kid, wallstreet, matrix, gtfo)
///sound