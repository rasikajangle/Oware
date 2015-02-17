'use strict';

angular.module('myApp', []).factory('gameLogic', function() {

  /** Returns the initial Oware board, which is a 2x6 matrix containing 4. */
  function getInitialBoard() {
    return [[4, 4, 4, 4, 4, 4],
            [4, 4, 4, 4, 4, 4]];
  }
  
   function isTie(player1Score, player2Score) {
    var score1 = player1Score;
	var score2 = player2Score;
	if(score1 == 24 && score2 == 24) {
		return true;
	}
	else {
		return false;
	}
  }
  
   function getWinner(player1Score, player2Score) {
    var score1 = player1Score;
	var score2 = player2Score;
	var winner = isWinner(score1, score2);
	if (ifWinner){ 
		if(score1 > 24) {
			return 0;
		}
		else if (score2 > 24){
			return 1;
		}
	}
	else {
		return -1;
		}
  }
	
	function isWinner(player1Score, player2Score) {
    var score1 = player1Score;
	var score2 = player2Score;
	if(score1 > 24 || score2 > 24) {
		return true;
	}
	else {
		return false;
	}
  }
	
	function isMoveOk(params) {
    var move = params.move;
    var turnIndexBeforeMove = params.turnIndexBeforeMove;
    var stateBeforeMove = params.stateBeforeMove;
    // The state and turn after move are not needed in Oware (or in any game where all state is public).
    //var turnIndexAfterMove = params.turnIndexAfterMove;
    //var stateAfterMove = params.stateAfterMove;

    // We can assume that turnIndexBeforeMove and stateBeforeMove are legal, and we need
    // to verify that move is legal.
    try {
      // Example move:
      // [{setTurn: {turnIndex : 1},
      //  {set: {key: 'board', value: [[4, 4, 5, 5, 5, 5], [4, 4, 4, 4, 4, 0]]}},
      //  {set: {key: 'delta', value: {row: 1, col: 6}}}
	  //  {set: {key: 'player1Score' , value: 12}
	  //  {set: {key: 'player2Score' , value: 10}
	  ]
      var deltaValue = move[2].set.value;
      var row = deltaValue.row;
      var col = deltaValue.col;
      var board = stateBeforeMove.board;
	  var previousPlayer1Score = stateBeforeMove[3].set.value;
	  var previousPlayer2Score = stateBeforeMove[4].set.value;
      var expectedMove = createMove(board, row, col, turnIndexBeforeMove, previousPlayer1Score, previousPlayer2Score);
      if (!angular.equals(move, expectedMove)) {
        return false;
      }
    } catch (e) {
      // if there are any exceptions then the move is illegal
      return false;
    }
    return true;
  }

  /**
   * Returns all the possible moves for the given board and turnIndexBeforeMove.
   * Returns an empty array if the game is over.
   */
  function getPossibleMoves(board, turnIndexBeforeMove,player1Score, player2Score ) {
    var possibleMoves = [];
    var i, j;
    for (i = 0; i < 6; i++) {
      for (j = 0; j < 6; j++) {
        try {
          possibleMoves.push(createMove(board, i, j, turnIndexBeforeMove, player1Score, player2Score));
        } catch (e) {
          // The cell in that position was full.
        }
      }
    }
    return possibleMoves;
  }
  
  
  /**
   * Returns the move that should be performed when player
   * with index turnIndexBeforeMove makes a move in cell row X col.
   */
  function createMove(board, row, col, turnIndexBeforeMove, player1Score, player2Score) {
    if (board === undefined) {
      // Initially (at the beginning of the match), the board in state is undefined.
      board = getInitialBoard();
    }
    if (turnIndexBeforeMove !== row) {
      throw new Error("One can only sow seeds from his own houses!");
    }
    
	if (board[row][col] === 0) {
      throw new Error("One cannot sow seeds from empty house!");
    }
	
	if (getWinner(player1Score, player2Score) !== -1 || isTie(player1Score, player2Score)) {
      throw new Error("Can only make a move if the game is not over!");
    }
    var boardAfterMove = angular.copy(board);
    //boardAfterMove[row][col] = turnIndexBeforeMove === 0 ? 'X' : 'O';
    
	var seeds = boardAfterMove[row][col];
	var i, j;
	var endTeam, loop;
	loop = 1;
	if (turnIndexBeforeMove === 1) {
		do {
			if(loop > 1){
				for (i = 0; (i<6) && (seeds>0) ; i++) {
					boardAfterMove[1][i]++;
					seeds--;
					endTeam = 1;
				}
			}
	
			if(loop ===1){
				for (i = col+1; (i<6) && (seeds>0) ; i++) {
					boardAfterMove[1][i]++;
					seeds--;
					endTeam = 1;
				}
			}

			for (j=5; j>=0, seeds >0; j--) {
				boardAfterMove[0][j]++;
				seeds--;
				endTeam = 0;
			}
		loop++;
		} while (seeds > 0);
	}
	
	else {
		do {
			if(loop > 1){
				for (j = 5; (j>0) && (seeds>0) ; j--) {
					boardAfterMove[0][j]++;
					seeds--;
					endTeam = 1;
				}
			}
	
			if(loop ===1){
				for (j=col-1; (j>=0) && (seeds>0) ; j--) {
					boardAfterMove[0][j]++;
					seeds--;
					endTeam = 0;
				}
			}
	
			for (i = 0; (i<6) && (seeds>0) ; i++) {
				boardAfterMove[1][i]++;
				seeds--;
				endTeam = 1;
			}
			loop++;
		} while (seeds > 0);
	}
	i--; j++;
	
	var updatedplayer1Score = player1Score;
	var updatedplayer2Score = player2Score;
	
	//Update Player Scores
	if(turnIndexBeforeMove !=== endTeam){
	// Update player score
		if(turnIndexBeforeMove === 1){
			while ((boardAfterMove[0][j] === 2 || boardAfterMove[0][j]===3) && (j<6) ){
				updatedplayer2Score = updatedplayer2Score + boardAfterMove[0][j];
				j++;
			}
		}
		else {
			while ((boardAfterMove[1][i] === 2 || boardAfterMove[1][i]===3) && (i>=0) ){
				updatedplayer1Score = updatedplayer1Score + boardAfterMove[0][j];
				i--;
			}
		}
	}
	var winner = getWinner(updatedplayer1Score, updatedplayer1Score);
    var firstOperation;
    if (winner !== -1 || isTie(updatedplayer1Score, updatedplayer1Score)) {
      // Game over.
      firstOperation = {endMatch: {endMatchScores:
        (winner === 0 ? [1, 0] : (winner === 1 ? [0, 1] : [0, 0]))}};
    } else {
      // Game continues. Now it's the opponent's turn (the turn switches from 0 to 1 and 1 to 0).
      firstOperation = {setTurn: {turnIndex: 1 - turnIndexBeforeMove}};
    }
    return [firstOperation,
            {set: {key: 'board', value: boardAfterMove}},
            {set: {key: 'delta', value: {row: row, col: col}}},updatedplayer1Score,updatedplayer2Score];
  }
  
   return {
      getInitialBoard: getInitialBoard,
      getPossibleMoves: getPossibleMoves,
      createMove: createMove,
      isMoveOk: isMoveOk
  };
});