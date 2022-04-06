/* global $, sessionStorage */

$(document).ready(runProgram); // wait for the HTML / CSS elements of the page to fully load, then execute runProgram()
  
function runProgram(){
  ////////////////////////////////////////////////////////////////////////////////
  //////////////////////////// SETUP /////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  // Constant Variables
  var FRAME_RATE = 10;
  var FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;

  var BOARD_HEIGHT = $("#board").height();
  var BOARD_WIDTH = $("#board").width();
  
  // Game Item Objects

  //Creation of the snake head
  var head = Segment("#head", 200, 200, 0, 0)

  //Creation of the apple object - does not use the segment factory function due to not requiring speed
  var apple = {
    id: "#apple",
    xPos: 100,
    yPos: 100
  }

  //Declaration of the snake array, initially stores only the head but new segments are added on as the game progresses
  var snake = [head];


  // one-time setup
  var interval = setInterval(newFrame, FRAMES_PER_SECOND_INTERVAL);   // execute newFrame every 0.0166 seconds (60 Frames per second)
  $(document).on('keydown', updateSpeed);                           // change 'eventType' to the type of event you want to handle
  $("#reset").hide();
  ////////////////////////////////////////////////////////////////////////////////
  ///////////////////////// CORE LOGIC ///////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  /* 
  On each "tick" of the timer, a new frame is dynamically drawn using JavaScript
  by calling this function and executing the code inside.
  */
  function newFrame() {
    repositionBody();
    updatePosition(head);
    redrawGameItem(head);
    eatApple();
    redrawGameItem(apple)
    endState();

  }
  
  /* 
  Called in response to events.
  */

  //Function which, upon being recieving a key press, changes the speed of the snake in that direction.
  function updateSpeed(event) {
    if(event.key == "w" && head.ySpeed != 20){
      head.xSpeed = 0;
      head.ySpeed = -20;
      console.log("yes")
    }
    if(event.key == "s" && head.ySpeed != -20){
      head.xSpeed = 0;
      head.ySpeed = 20;
    }
    if(event.key == "a" && head.xSpeed != 20){
      head.xSpeed = -20;
      head.ySpeed = 0;
    }
    if(event.key == "d" && head.xSpeed != -20){
      head.xSpeed = 20;
      head.ySpeed = 0;
    }
  }

  //Function that uses key events to move the snake based off of current position and speed.
  function updatePosition(obj){
    obj.xPos += obj.xSpeed;
    obj.yPos += obj.ySpeed;
  }

  //Function that renders game objects after they are moved.
  function redrawGameItem(obj){
    $(obj.id).css({
      "left": obj.xPos,
      "top": obj.yPos
    });
  }

  //Function that checks if the snake head overlaps the apple, then moves the apple and calls addSnakeSegment.
  function eatApple(){
    if ((head.xPos == apple.xPos) && (head.yPos == apple.yPos)){
      addSnakeSegment();

      apple.xPos = 20 * Math.floor(Math.random() * 40)

      apple.yPos = 20 * Math.floor(Math.random() * 40)
    }
  }

  //Function that creates a new segment for the snake and pushes it to the end of the snake array.
  function addSnakeSegment(){
    //Creation of the new segment's ID
    var newID = "segment" + snake.length

    //Creation of the new div element for the tail segments
    $("<div>")
    .addClass("tail")
    .attr("id", newID)
    .appendTo("#board")


    //Creation of the new segments
    var newSegment = Segment("#" + newID, -50, -50, 0, 0);

    //Storing the new segments in the snake array
    snake.push(newSegment)
  }

  //Function that updates the position of every segment in the snake array, excluding the head.
  function repositionBody(){
    for(var i = snake.length - 1; i >= 1; i--){
      snake[i].xPos = snake[i - 1].xPos;
      snake[i].yPos = snake[i - 1].yPos;

      redrawGameItem(snake[i])
    }
  }

  //Factory function for creating new segments of the snake.
  function Segment(id, xPos, yPos, xSpeed, ySpeed){
    var segment = {
      id: id,
      xPos: xPos,
      yPos: yPos,
      xSpeed: xSpeed,
      ySpeed: ySpeed
    }

    return segment;
  }

  //Function that calls both checks for ending the game
  function endState(){
    for(var i = snake.length - 1; i >= 1; i--){
      bodyCollision(snake[i]);
    }
    border();
  }

  //Checks collision with body segments
  function bodyCollision(seg){
    if (((head.xPos == seg.xPos) &&
        (head.yPos == seg.yPos))
        ){
          endGame();
        }
          
  }

  //Function that checks for collision with the game border.
  function border(){
    if(!((head.xPos >= 0) &&
      (head.yPos >= 0) &&
      (head.xPos <= BOARD_WIDTH - 20) &&
      (head.yPos <= BOARD_HEIGHT - 20))
    ){
      endGame();
      }
  }

  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////// HELPER FUNCTIONS ////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  
  function endGame() {
    // stop the interval timer
    clearInterval(interval);

    // turn off event handlers
    $(document).off();
    $("#reset").show()
  }
  
}
