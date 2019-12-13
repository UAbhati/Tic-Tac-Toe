var origBoard;
var mode = "Hard";
const huPlayer = "X";
const compPlayer = "O";
const winCombos = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
]

const cells = document.querySelectorAll('.cell');
startGame();
function startGame(){
  document.querySelector(".endgame").style.display = "none";
  origBoard = Array.from(Array(9).keys());
  for (var i = 0; i < cells.length; i++) {
    cells[i].innerText = '';
    cells[i].style.removeProperty('background-color');
    cells[i].addEventListener('click',turnClick,false);
  }
}
function setMode(form){
  for (var i = 0; i < 2; i++) {
     if(form.rad[i].checked)
        mode = form.rad[i].value;
  }
  startGame();
}
function turnClick(square){
  if (typeof origBoard[square.target.id] == 'number') {
        turn(square.target.id,huPlayer);
        if((mode === "Hard") && !checkWin(origBoard, huPlayer) && !checkTie())  turn(bestSpot(),compPlayer);
        else if((mode === "Easy") && !checkWin(origBoard, huPlayer) && !checkTie())  turn(EasybestSpot(),compPlayer);
  }
}
function turn(squareId,player){
  origBoard[squareId] = player;
  document.getElementById(squareId).innerText = player;
  let gameWon = checkWin(origBoard, player);
  if(gameWon)  gameOver(gameWon);
}
function checkWin(board,player){
   let plays = board.reduce((a,e,i) => (e===player) ? a.concat(i) : a,[]);
   let gameWon = null;
   for(let [index, win] of winCombos.entries()){
     if(win.every(elem => plays.indexOf(elem) > -1)){
       gameWon = {index:index, player: player};
       break;
     }
   }
   return gameWon;
}
function gameOver(gameWon){
  for(let index of winCombos[gameWon.index]){
    document.getElementById(index).style.backgroundColor = gameWon.player == huPlayer ? "blue" : "red";
  }
  for (var i = 0; i < cells.length; i++) {
    cells[i].removeEventListener('click',turnClick, false);
  }
  declareWinner(gameWon.player == huPlayer ? "You Win!"  : "You Lose.");
}
function declareWinner(who){
  document.querySelector(".endgame").style.display = "block";
  document.querySelector(".endgame .text").innerText = who;
}
function emptySquares(){
  return origBoard.filter(s=> typeof s == 'number');
}
function bestSpot(){
  // return emptySquares()[0];
  return minimax(origBoard,compPlayer).index;
}

function EasybestSpot(){
  return Easyminimax(origBoard,compPlayer).index;
}

function checkTie(){
  if(emptySquares().length == 0){
    for (var i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = "green";
      cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner("Tie Game!")
    return true;
  }
  return false;
}
function minimax(newBoard, player){
  var availSpots = emptySquares();
  if(checkWin(newBoard,huPlayer)){
    return {score: -10};
  }
  else if(checkWin(newBoard, compPlayer)){
    return {score: 10};
  }
  else if(availSpots.length === 0){
    return {score: 0};
  }
  var moves = [];
  for (var i = 0; i < availSpots.length; i++) {
    var move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;
    if (player == compPlayer) {
        var result = minimax(newBoard, huPlayer);
        move.score = result.score;
    }else {
      var result = minimax(newBoard, compPlayer);
      move.score = result.score;
    }
    newBoard[availSpots[i]] = move.index;
    moves.push(move);
  }
  var bestMove;
  if (player === compPlayer) {
    var bestScore = -10000;
    for (var i = 0; i < moves.length; i++) {
      if(moves[i].score > bestScore){
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }else {
    var bestScore = 10000;
    for (var i = 0; i < moves.length; i++) {
      if(moves[i].score < bestScore){
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  return moves[bestMove];
}

function Easyminimax(newBoard, player){
    var availSpots = emptySquares();
    if(checkWin(newBoard,huPlayer)){
      return {score: -10};
    }
    else if(checkWin(newBoard, compPlayer)){
      return {score: 50};
    }
    else if(availSpots.length === 0){
      return {score: -10};
    }
    var moves = [];
    for (var i = 0; i < availSpots.length; i++) {
      var move = {};
      move.index = newBoard[availSpots[i]];
      newBoard[availSpots[i]] = player;
      if (player == compPlayer) {
          var result = Easyminimax(newBoard, huPlayer);
          move.score = result.score;
      }else {
        var result = Easyminimax(newBoard, compPlayer);
        move.score = result.score;
      }
      newBoard[availSpots[i]] = move.index;
      moves.push(move);
    }
    var bestMove;
    if (player === compPlayer) {
      var bestScore = -10000;
      for (var i = 0; i < moves.length; i++) {
        if(moves[i].score > bestScore){
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }else {
      var bestScore = 10000;
      for (var i = 0; i < moves.length; i++) {
        if(moves[i].score < bestScore){
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }
    return moves[bestMove];
  }
