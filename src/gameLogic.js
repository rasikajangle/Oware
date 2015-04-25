angular.module('myApp', []).factory('gameLogic', function() {
	'use strict';

  	/** Returns the initial Oware board, which is a 2x6 matrix containing 4. */
  	function getInitialBoard() {
		return [[4, 4, 4, 4, 4, 4],
			[4, 4, 4, 4, 4, 4]];
  	}
  
  	function canSowOpponent(board, row, col) {
  		return (board[row][col]) > (row === 0 ? col : 5 - col);
  	}
 
    function hasHousesThatCanSowOpponent(board, turnIndex) {
        for(var i = 0; i < 6; i++) {
        	if(canSowOpponent(board, turnIndex, i)) {
        		return true;
        	}
        }
    	return false;
    }

  	function getSeedsInRow(board, rowIndex) {
  		var seeds = 0;
  		for(var i = 0; i < 6; i++) {
  			seeds += board[rowIndex][i];
  		}
  		return seeds;
  	}

  	function getWinner(board, scores) {
  		if(getSeedsInRow(board, 1) === 0 && !hasHousesThatCanSowOpponent(board, 0)) {
  			scores[0] += getSeedsInRow(board, 0);
  			return 0;
  		}
  		else if(getSeedsInRow(board, 0) === 0 && !hasHousesThatCanSowOpponent(board, 1)) {
  			scores[1] += getSeedsInRow(board, 1);
  			return 1;
  		}
  		else if(scores[0] > 24) {
  			return 0;
  		}
  		else if(scores[1] > 24){
  			return 1;
  		}
  		return -1;
  	}

   	function isTie(scores) {
		if(scores[0] === 24 && scores[1] === 24) {
			return true;
		}
		return false;
  	}
	
	function isMoveOk(params) {
		var move = params.move;
		var turnIndexBeforeMove = params.turnIndexBeforeMove;
		var stateBeforeMove = params.stateBeforeMove;
	
		/*		
		Example stateBeforeMove:
		{
		  	board : [[4, 4, 4, 4, 4, 4], [4, 4, 4, 4, 4, 4]],
		   	scores : [0, 0]
		}
		
		The state and turn after move are not needed in Oware (or in any game where all state is public).
		var turnIndexAfterMove = params.turnIndexAfterMove;
		var stateAfterMove = params.stateAfterMove;

		We can assume that turnIndexBeforeMove and stateBeforeMove are legal, and we need
		to verify that move is legal.
		*/
		try {
			/*			
			Example move:
			[{setTurn: {turnIndex : 1},
			 {set: {key: 'board', value: [[4, 4, 5, 5, 5, 5], [4, 4, 4, 4, 4, 0]]}},
			 {set: {key: 'delta', value: {row: 1, col: 6}}},
			 {set: {key: 'scores' , value: [0, 0]}}
			]
			*/
			var deltaValue = move[2].set.value;
			var row = deltaValue.row;
			var col = deltaValue.col;
			var board = stateBeforeMove.board;
			var scores = stateBeforeMove.scores;
			var expectedMove = createMove(board, row, col, turnIndexBeforeMove, scores);
			if (!angular.equals(move, expectedMove)) {
				//console.log(JSON.stringify(move, null, 2), JSON.stringify(expectedMove, null, 2));
				return false;
		  	}
		} catch (e) {
            console.log(e);
	  		// if there are any exceptions then the move is illegal
	  		return false;
		}
		return true;
    }

    /**
    * Returns all the possible moves for the given board and turnIndex.
    * Returns an empty array if the game is over.
    */
    function getPossibleMoves(board, turnIndex, scores) {
        var possibleMoves = [];
    	for (var j = 0; j < 6; j++) {
    		try {
                if (board[turnIndex][j] !== 0){
                    possibleMoves.push(createMove(board, turnIndex, j, turnIndex, scores));
                }
    		} catch (e) {
    	  		// The cell in that position was full.
    		}
    	}

        return possibleMoves;
    }
  
  
    /**
    * Returns the move that should be performed when player
    * with index turnIndexBeforeMove makes a move in cell row X col.
    */
    function createMove(board, row, col, turnIndexBeforeMove, scores) {
    	
        if (board === undefined) {
        	// Initially (at the beginning of the match), the board in state is undefined.
        	board = getInitialBoard();
        	scores = [0, 0];
        }

        if (turnIndexBeforeMove !== row) {
        	throw new Error("One can only sow seeds from his own houses!");
        }

        if (board[row][col] === 0) {
        	throw new Error("One cannot sow seeds from empty house!");
        }

        if (getWinner(board, scores) !== -1 || isTie(scores)) {
        	throw new Error("Can only make a move if the game is not over!");
        }

        if (!canSowOpponent(board, row, col) && getSeedsInRow(board, 1 - row) === 0) {
        	throw new Error("Cannot prevent the opponent from continuing the game!");
        }

        var boardAfterMove = angular.copy(board),
        	scoresAfterMove = angular.copy(scores);
        var seeds = boardAfterMove[row][col];

        var r = row, c = col, cd = r === 0 ? -1 : 1;

        boardAfterMove[r][c] = 0;
        while(seeds > 0) {
        	c = c + cd;
        	if( c === -1 ) {
        		r = 1;
        		c = 0;
        		cd *= -1;
        	}
        	else if( c === 6 ) {
        		r = 0;
        		c = 5;
        		cd *= -1;
        	}

        	if(r === row && c === col) {
        		continue;
        	}
        	boardAfterMove[r][c]++;
        	seeds--;
        }

        cd *= -1;
        var capCount = 0;
        var boardAfterMoveCopy = angular.copy(boardAfterMove), scoreCopy = scoresAfterMove[turnIndexBeforeMove];
        if( r === 1 - turnIndexBeforeMove ) {
        	while( c >= 0 && c <= 5) {
        		if(boardAfterMove[r][c] === 2 || boardAfterMove[r][c] === 3) {
        			scoresAfterMove[turnIndexBeforeMove] += boardAfterMove[r][c];
        			boardAfterMove[r][c] = 0;
        			capCount++;
        		}
        		else {
        			break;
        		}
        		c = c + cd;
        	}		
        }

        if(capCount === 6) {
        	boardAfterMove = boardAfterMoveCopy;
        	scoresAfterMove[turnIndexBeforeMove] = scoreCopy;
        }


        var winner = getWinner(boardAfterMove, scoresAfterMove);
        var firstOperation;
        if (winner !== -1 || isTie(scoresAfterMove)) {
          	// Game over.
        	firstOperation = {endMatch: {endMatchScores:
        		winner === 0 ? [1, 0] : winner === 1 ? [0, 1] : [0, 0]}};
        	
        } else {
          	// Game continues. Now it's the opponent's turn (the turn switches from 0 to 1 and 1 to 0).
        	firstOperation = {setTurn: {turnIndex: 1 - turnIndexBeforeMove}};
        }

        return [firstOperation,
        		{set: {key: 'board', value: boardAfterMove}},
        		{set: {key: 'delta', value: {row: row, col: col}}},
        		{set: {key: 'scores', value: scoresAfterMove}}
        		];
    }

    return {
      getInitialBoard: getInitialBoard,
      getPossibleMoves: getPossibleMoves,
      createMove: createMove,
      isMoveOk: isMoveOk
    };

});