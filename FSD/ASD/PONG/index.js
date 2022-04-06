/* global $, sessionStorage */
$(document).ready(runProgram); // wait for the HTML / CSS elements of the page to fully load, then execute runProgram()
function runProgram(){
  ////////////////////////////////////////////////////////////////////////////////
  //////////////////////////// SETUP /////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  // Constant Variables
  const FRAME_RATE = 60;
  const FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;
  const BOARD_HEIGHT = 600;
  const BOARD_WIDTH = 1000;
  // Game Item Objects  

    $("#console").hide();
    var consoleShown = false;

    var SETTINGS = {
      PLAYER_ONE_SPEED: parseInt($("#p1Speed").val()),
      PLAYER_TWO_SPEED: parseInt($("#p2Speed").val()),
      BALL_X_SPEED: parseInt($("#ballSpeedX").val()),
      BALL_Y_SPEED: parseInt($("#ballSpeedY").val()),
      SCORE_TO_WIN: parseInt($("#scoreToWin").val())
    }

    $("#continueButton").hide();
    var player1 = Player($("#player1"), 10);
    var player2 = Player($("#player2"), 980);
    //Object for storing the properties of the ball game object
    var ball = {
      id: $("#ball"),
      yPos: 300,
      xPos: 500,
      xSpeed: 2,
      ySpeed: 2
    }
    var score = {
      leftID: $("#scoreLeft"),
      rightID: $("#scoreRight"),
      left: 0,
      right: 0
    } 

    
  // one-time setup
  let interval = setInterval(newFrame, FRAMES_PER_SECOND_INTERVAL);   // execute newFrame every 0.0166 seconds (60 Frames per second)
  $(document).on('keydown', buttonPress); 
  $(document).on('keyup', stopPaddle);
  $("#consoleInput").on("click", updateSettings);

  
  ////////////////////////////////////////////////////////////////////////////////
  ///////////////////////// CORE LOGIC ///////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  /* 
  On each "tick" of the timer, a new frame is dynamically drawn using JavaScript
  by calling this function and executing the code inside.
  */
  function newFrame() {
    updatePosition(player1);
    redrawGameItem(player1);
    playerBorder(player1, SETTINGS.PLAYER_ONE_SPEED);

    updatePosition(player2);
    redrawGameItem(player2);
    playerBorder(player2, SETTINGS.PLAYER_TWO_SPEED);

    doCollide();
    redrawGameItem(ball);
    updatePosition(ball);
    ballBorder();

    updateScoreBoard();

    endGame();
  }
  /* 
  Called in response to events.
  */
  //Controller for the first paddle
  function buttonPress(event) {
    if((event.key === "`") && (consoleShown === false)){
      $("#console").show();
      consoleShown = true;
    }
    else if((event.key === "`") && (consoleShown === true)){
      $("#console").hide();
      consoleShown = false;
    }
      if(event.key == "w"){
        player1.ySpeed = -SETTINGS.PLAYER_ONE_SPEED
      }
      if(event.key == "s"){
          player1.ySpeed = SETTINGS.PLAYER_ONE_SPEED
      }
      if(event.key == "ArrowUp"){
        player2.ySpeed = -SETTINGS.PLAYER_TWO_SPEED
      }
      if(event.key == "ArrowDown"){
         player2.ySpeed = SETTINGS.PLAYER_TWO_SPEED
      }
    
  }
  //When key is unpressed, the paddles stop
  function stopPaddle(event){
    if(event.key == "w" || event.key == "s"){
      player1.ySpeed = 0;
    }
    if(event.key == "ArrowUp" || event.key == "ArrowDown"){
      player2.ySpeed = 0;
    }
  }
  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////// HELPER FUNCTIONS ////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  function updateSettings(event){
    event.preventDefault();
    var updatedSettingsVal = $('form').serializeArray();

    SETTINGS.PLAYER_ONE_SPEED = parseInt(updatedSettingsVal[0].value)
    SETTINGS.PLAYER_TWO_SPEED = parseInt(updatedSettingsVal[1].value)
    SETTINGS.BALL_X_SPEED = parseInt(updatedSettingsVal[2].value)
    SETTINGS.BALL_Y_SPEED = parseInt(updatedSettingsVal[3].value)
    SETTINGS.SCORE_TO_WIN = parseInt(updatedSettingsVal[4].value)
    
  }


  //Factory function to create the paddles
  function Player(id, xBound){
    var newPlayer = {
        id: id,
        yPos: 100,
        xPos: NaN,
        ySpeed: 0,
        xBoundingBox: xBound
    }
    return newPlayer;
}
//Establishes the bounding box for the paddles so they don't leave the screem
function playerBorder(object, maxSpeed){
  if (object.yPos + 75 > BOARD_HEIGHT){
    object.yPos -= maxSpeed;
  }
  if (object.yPos < 0){
    object.yPos += maxSpeed;
  }
}
//Handles collision between the ball and the paddles
function doCollide(){
  //Collision for right paddle
  if((ball.xPos < player2.xBoundingBox + 10) &&
  (ball.xPos + 25 > player2.xBoundingBox) &&
  (ball.yPos + 25 > player2.yPos) &&
  (ball.yPos < player2.yPos + 75)&&
  (ball.xPos + 25 < BOARD_WIDTH) &&
  (ball.xSpeed > 0))
  {
    ball.xSpeed *= -1
    ball.xSpeed -= 1
    if(ball.ySpeed > 0){
      ball.ySpeed += 0.25
    }
    if(ball.ySpeed < 0){
      ball.ySpeed -= 0.25
    }
  }

  //Collision for left paddle
  if((ball.xPos < player1.xBoundingBox + 10) &&
  (ball.xPos + 25 > player1.xBoundingBox) &&
  (ball.yPos + 25 > player1.yPos) &&
  (ball.yPos < player1. yPos + 75) &&
  (ball.xPos > 0) &&
  (ball.xSpeed < 0))
  {
    ball.xSpeed *= -1
    ball.xSpeed += 1
    if(ball.ySpeed > 0){
      ball.ySpeed += 0.25
    }
    if(ball.ySpeed < 0){
      ball.ySpeed -= 0.25
    }
   }
}
//Creates the top and bottom borders for the ball
//Must be updated for interactions for beyond the left and right sides of the border
function ballBorder(){
  //Top and Bottom borders
  if (ball.yPos + 25 > BOARD_HEIGHT){
    ball.ySpeed *= -1
  }
  if(ball.yPos < 0){
    ball.ySpeed *= -1
  }

  //Detects when the ball leaves the left side of the board 
  if(ball.xPos < 0){
    ball.xSpeed = -2;
    ball.id.hide();
    if(ball.xPos < -50){

      var xSpeed
      var ySpeed

      if(SETTINGS.BALL_X_SPEED == 2){
        xSpeed = -Math.abs(randomizeSpeed());
      }
      else{
        xSpeed = -SETTINGS.BALL_X_SPEED;
      }

      if(SETTINGS.BALL_Y_SPEED == 2){
        ySpeed = randomizeSpeed();
      }
      else{
        xSpeed = SETTINGS.BALL_Y_SPEED;
      }
     
      ball.xSpeed = xSpeed;
      ball.ySpeed = ySpeed;
      ball.xPos = 500;
      ball.yPos = 300;
      score.right++;
      ball.id.show();
    }
  }

  //Detects when the ball leaves the right side of the board
  if(ball.xPos > BOARD_WIDTH){
    ball.xSpeed = 2;
    ball.id.hide();
    if(ball.xPos > BOARD_WIDTH + 50){
      var xSpeed
      var ySpeed

      if(SETTINGS.BALL_X_SPEED == 2){
        xSpeed = Math.abs(randomizeSpeed());
      }
      else{
        xSpeed = SETTINGS.BALL_X_SPEED;
      }

      if(SETTINGS.BALL_Y_SPEED == 2){
        ySpeed = randomizeSpeed();
      }
      else{
        xSpeed = SETTINGS.BALL_Y_SPEED;
      }

      ball.xSpeed = xSpeed
      ball.ySpeed = ySpeed
      ball.xPos = 500;
      ball.yPos = 300;
      score.left++;
      ball.id.show();
    }
  }
}
function randomizeSpeed(){
  var randNum = Math.random()
  var returnSpeed
  if (randNum >= 0.75){
    returnSpeed = 2.5
  }
  if(0.75 > randNum >= 0.5){
    returnSpeed = 2
  }
  if(0.5 > randNum >= 0.25){
    returnSpeed = -2.5
  }
  if(0.25 > randNum){
    returnSpeed = -2
  }
  return returnSpeed
}
//Updates the position of game objects
  function updatePosition(object){
    object.yPos += object.ySpeed;

    if(object.xPos != NaN){
      object.xPos += object.xSpeed;
    }
  }
  //Renders the new position of the game object
  function redrawGameItem(object){
    if(object.xPos != NaN){
      object.id.css("left", object.xPos)
    }
    object.id.css("top", object.yPos)
  }
  function updateScoreBoard(){
    score.leftID.html(score.left);
    score.rightID.html(score.right);
  }
  function restart(){
    ball.id.show();
    player1.id.show();
    player2.id.show();
    runProgram();
  }
  function endGame() {
    if(score.left >= SETTINGS.SCORE_TO_WIN || score.right >= SETTINGS.SCORE_TO_WIN){
      // stop the interval timer
      clearInterval(interval);

      // turn off event handlers
      $(document).off();
      $("#continueButton").show().click(restart);
      ball.id.hide();
      player1.id.hide();
      player2.id.hide();
    }
  }
}