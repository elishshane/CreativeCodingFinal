var font;
var alphabet = "qwertyuiopasdfghjklzxcvbnm";
var letters = [];//to keep track of what letters are on the screen
var frame = 0;
var numColumns = 5;
var fontSize = 270 / numColumns;
var score = 0;
var numKeyTyped = 0.0000000000001;//can't divide by 0 


function preload(){
  font = loadFont('data/font0.otf');
}
function setup() {
  createCanvas( 300, 600);
  frameRate(60);
  for( var i = 0; i < numColumns; i++){
    letters.push([]);
  }
}

function draw() {
  for( var i = 0; i < letters.length; i++){
    if( letters[i].length != 0 && letters[i][letters[i].length - 1].restY < 0){
      gameover();
      return;
    }
  }
  if(frame == 3600){
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
  if( frame % 120 == 0){//repeating action for every 120 frames
    /*
    if(letters.length == 0){
      letters.push(new Letter(0, random(alphabet.split("")), height)); //adding random letter into "letters"
    }else{
      letters.push(new Letter(0, random(alphabet.split("")), letters[letters.length - 1].restY - 25)); 
      //make resting y position of new letter right above the last letter
    }*/
    for( var i = 0; i < letters.length; i++){
      if( letters[i].length == 0 ){
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
  fill(255, 255,0);
  textFont( font, width / numColumns);
  text( this.txt, this.position.x, this.position.y);
}

function keyTyped(){//deleted letters that are types
  for( var i = 0; i < letters.length; i++){
    if( letters[i].length != 0 && key == letters[i][letters[i].length - 1].txt){//compare last letter and whats typed
      letters[i].pop();
      score += 1;
    }
  }
  numKeyTyped += 1;
}

function gameover(){
  background(0);
  fill(255,0,0);
  textFont(font, 20);
  text( "Game Over", 80, 200);
  text( "Score: " + score, 100, 230);
  text( "Accuracy: " + Math.round( score / numKeyTyped * 100 ) + "%", 63, 260);
}

function youWon(){
  background(0);
  fill(255);
  textFont( font, 20);
  text( "YOU WON", 90, 300);
}
///difficulty()
///item