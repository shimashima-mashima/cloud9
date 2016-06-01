/*
var board,
    game = new Chess();
 
// ゲームオーバー処理
var onDragStart = function(source, piece, position, orientation) {
	if (game.in_checkmate() === true || game.in_draw() === true ||
			piece.search(/^b/) !== -1) {
	      return false;
	    }
};
 
// CPU処理
var cpuMove = function() {
 var possibleMoves = game.moves();
 
  // ゲームオーバー
  if (possibleMoves.length === 0) return;
 
  var randomIndex = Math.floor(Math.random() * possibleMoves.length);
  game.move(possibleMoves[randomIndex]);
  board.position(game.fen());
};
 
var onDrop = function(source, target) {
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q'
});
 
// 想定外の動きを防止
if (move === null) return
 
// CPU移動
window.setTimeout(cpuMove, 250);
};
 
// ボードの更新
var onSnapEnd = function() {
	board.position(game.fen());
};
 
// プレイヤー処理
var cfg = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd
};
board = new ChessBoard('board', cfg);
*/



var board, game = new Chess();

var removeGreySquares = function() {
  $('#board .square-55d63').css('background', '');
};

var greySquare = function(square) {
  var squareEl = $('#board .square-' + square);
  
  var background = '#a9a9a9';
  if (squareEl.hasClass('black-3c85d') === true) {
    background = '#696969';
  }

  squareEl.css('background', background);
};

var onDragStart = function(source, piece) {
  // do not pick up pieces if the game is over
  // or if it's not that side's turn
  if (game.game_over() === true ||
      (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false;
  }
};


// CPU処理
var cpuMove = function() {
 var possibleMoves = game.moves();
 
  // ゲームオーバー
  if (possibleMoves.length === 0) return;
 
  var randomIndex = Math.floor(Math.random() * possibleMoves.length);
  game.move(possibleMoves[randomIndex]);
  board.position(game.fen());
};


var onDrop = function(source, target) {
  removeGreySquares();

  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  });

  // illegal move
  if (move === null) return 'snapback';
  
  // CPU移動
  window.setTimeout(cpuMove, 250);
};

var onMouseoverSquare = function(square, piece) {
  // get list of possible moves for this square
  var moves = game.moves({
    square: square,
    verbose: true
  });

  // exit if there are no moves available for this square
  if (moves.length === 0) return;

  // highlight the square they moused over
  greySquare(square);

  // highlight the possible squares for this piece
  for (var i = 0; i < moves.length; i++) {
    greySquare(moves[i].to);
  }
};

var onMouseoutSquare = function(square, piece) {
  removeGreySquares();
};

var onSnapEnd = function() {
  board.position(game.fen());
};

var cfg = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onMouseoutSquare: onMouseoutSquare,
  onMouseoverSquare: onMouseoverSquare,
  onSnapEnd: onSnapEnd
};
board = new ChessBoard('board', cfg);

