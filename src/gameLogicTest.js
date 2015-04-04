describe("In Oware", function() {
  	'use strict';
  	var _gameLogic;

  	beforeEach(module("myApp"));

	beforeEach(inject(function (gameLogic) {
		_gameLogic = gameLogic;
	}));

	function expectMoveOk(turnIndexBeforeMove, stateBeforeMove, move) {
		expect(_gameLogic.isMoveOk({turnIndexBeforeMove: turnIndexBeforeMove, stateBeforeMove: stateBeforeMove, move: move})).toBe(true);
	}

	function expectIllegalMove(turnIndexBeforeMove, stateBeforeMove, move) {
		expect(_gameLogic.isMoveOk({turnIndexBeforeMove: turnIndexBeforeMove, stateBeforeMove: stateBeforeMove, move: move})).toBe(false);
	}
  
  	it("placing seeds from 1x3 in consecutive positions from initial state is legal", function() {
	expectMoveOk(1, 
		{board: undefined, scores: [0, 0]},
		[{setTurn: {turnIndex : 0}},
			{set: {key: 'board', value: [[4, 4, 4, 4, 5, 5], [4, 4, 4, 0, 5, 5]]}},
			{set: {key: 'delta', value: {row: 1, col: 3}}},
			{set: {key: 'scores' , value: [0, 0]}}
		]);
	});
	
	it("placing seeds from 0x1 house in consecutive positions from initial state is legal", function() {
	expectMoveOk(0, 
		{board: [[4, 4, 4, 4, 5, 5], [4, 4, 4, 0, 5, 5]], scores: [0, 0]},
		[{setTurn: {turnIndex : 1}},
			{set: {key: 'board', value: [[5, 0, 4, 4, 5, 5], [5, 5, 5, 0, 5, 5]]}},
			{set: {key: 'delta', value: {row: 0, col: 1}}},
			{set: {key: 'scores' , value: [0, 0]}}
		]);
	});
	
	it("placing seeds from house slot with zero seeds at 1x3 is illegal", function() {
	expectIllegalMove(1,
		{board: [[5, 0, 4, 4, 5, 5], [5, 5, 5, 0, 5, 5]], scores: [0, 0]},
		[{setTurn: {turnIndex : 0}},
			{set: {key: 'board', value: [[5, 0, 4, 4, 5, 5], [5, 5, 5, 0, 5, 5]]}},
			{set: {key: 'delta', value: {row: 1, col: 3}}},
			{set: {key: 'scores' , value: [0, 0]}}
		]);
	});
	
	it("placing seeds from opponent's house slot at 1x2 is illegal", function() {
	expectIllegalMove(0,
		{board: [[5, 0, 4, 4, 5, 5], [5, 5, 5, 0, 5, 5]], scores: [0, 0]},
		[{setTurn: {turnIndex : 1}},
			{set: {key: 'board', value: [[5, 0, 4, 4, 6, 6], [5, 5, 0, 1, 6, 6]]}},
			{set: {key: 'delta', value: {row: 1, col: 3}}},
			{set: {key: 'scores' , value: [0, 0]}}
		]);
	});
	
	it("placing seeds from house slot at 1x4 when there is already a winner is illegal", function() {
	expectIllegalMove(1,
		{board: [[1, 0, 0, 1, 0, 0], [0, 0, 1, 1, 2, 0]], scores: [25, 17]},
		[{setTurn: {turnIndex : 0}},
			{set: {key: 'board', value: [[1, 0, 0, 1, 0, 1], [0, 0, 1, 1, 0, 1]]}},
			{set: {key: 'delta', value: {row: 1, col: 4}}},
			{set: {key: 'scores' , value: [25, 17]}}
		]);
	});
	

	/* The following test case will not test the Tie condition since the
	 * given move is on an empty board and will return an exception before
	 * the check is made, hence will always return false. 
	 * 
	 * A test case to cover the Tie condition has been added below.
	 */

	it("placing seeds from house slot at 1x4 when there is already a tie is illegal", function() {
	var  firstOperation = {endMatch: {endMatchScores: [0,0]}};
	expectIllegalMove(1,
		{board: [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]], scores: [24, 24]},
		[firstOperation,
			{set: {key: 'board', value: [[0, 0, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0]]}},
			{set: {key: 'delta', value: {row: 1, col: 4}}},
			{set: {key: 'scores' , value: [24, 24]}}
		]);
	});
	
	it("placing seeds from 1x3 house in consecutive positions for player 1 to win the game is legal", function() {
	var  firstOperation = {endMatch: {endMatchScores: [0,1]}};
	expectMoveOk(1,
		{board: [[1, 3, 1, 2, 1, 3], [0, 0, 2, 6, 1, 2]], scores: [8, 18]},
		[firstOperation,
			{set: {key: 'board', value: [[1, 3, 0, 0, 0, 4], [0, 0, 2, 0, 2, 3]]}},
			{set: {key: 'delta', value: {row: 1, col: 3}}},
			{set: {key: 'scores' , value: [8, 25]}}
		]);
	});
	
	it("placing seeds from 0x2 house in consecutive positions for player 0 to win the game is legal", function() {
	expectMoveOk(0,
		{board: [[1, 3, 5, 0, 0, 0], [0, 0, 2, 1, 6, 0]], scores: [22, 8]},
		[{endMatch: {endMatchScores : [1, 0]}},
			{set: {key: 'board', value: [[2, 4, 0, 0, 0, 0], [1, 1, 0, 1, 6, 0]]}},
			{set: {key: 'delta', value: {row: 0, col: 2}}},
			{set: {key: 'scores' , value: [25, 8]}}
		]);
	});
	
	it("placing seeds from house slot with 12 seeds in consecutive positions", function() {
	expectMoveOk(1,
		{board: [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 12]], scores: [18, 18]},
		[{setTurn: {turnIndex : 0}},
			{set: {key: 'board', value: [[1, 1, 1, 1, 1, 0], [1, 1, 1, 1, 1, 0]]}},
			{set: {key: 'delta', value: {row: 1, col: 5}}},
			{set: {key: 'scores' , value: [18, 20]}}
		]);
	});
	
	it("placing seeds from house slot with 20 seeds in consecutive positions", function() {
	expectMoveOk(1,
		{board: [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 20]], scores: [14, 14]},
		[{setTurn: {turnIndex : 0}},
			{set: {key: 'board', value: [[2, 2, 2, 2, 2, 2], [2, 2, 2, 1, 1, 0]]}},
			{set: {key: 'delta', value: {row: 1, col: 5}}},
			{set: {key: 'scores' , value: [14, 14]}}
		]);
	});
	
	
	it("placing seeds from house slot with 7 seeds in consecutive positions", function() {
	expectMoveOk(1,
		{board: [[1, 1, 1, 1, 1, 1], [0, 0, 0, 0, 7, 0]], scores: [17, 18]},
		[{setTurn: {turnIndex : 0}},
			{set: {key: 'board', value: [[2, 2, 2, 2, 2, 2], [0, 0, 0, 0, 0, 1]]}},
			{set: {key: 'delta', value: {row: 1, col: 4}}},
			{set: {key: 'scores' , value: [17, 18]}}
		]);
	});


	/* Additional test cases.
	 * Author: Jugal Manjeshwar
	 */

	it("placing seeds from house slot at 0x2 when there is already a tie is illegal", function() {
	expectIllegalMove(0,
		{board: [[1, 2, 4, 0, 0, 0], [0, 1, 0, 1, 6, 0]], scores: [24, 24]},
		[{endMatch: {endMatchScores : [0, 0]}},
			{set: {key: 'board', value: [[1, 2, 4, 0, 0, 0], [0, 1, 0, 1, 6, 0]]}},
			{set: {key: 'delta', value: {row: 0, col: 2}}},
			{set: {key: 'scores' , value: [24, 24]}}
		]);
	});

	it("placing seeds from 0x2 house in consecutive positions for player 0 to tie the game is legal", function() {
	expectMoveOk(0,
		{board: [[1, 2, 4, 0, 0, 0], [0, 1, 0, 1, 6, 0]], scores: [22, 24]},
		[{endMatch: {endMatchScores : [0, 0]}},
			{set: {key: 'board', value: [[2, 3, 0, 0, 0, 0], [1, 0, 0, 1, 6, 0]]}},
			{set: {key: 'delta', value: {row: 0, col: 2}}},
			{set: {key: 'scores' , value: [24, 24]}}
		]);
	}); 


	it("placing seeds from house slot of player 0 with 13 seeds in consecutive positions", function() {
	expectMoveOk(0,
		{board: [[13, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]], scores: [18, 18]},
		[{setTurn: {turnIndex : 1}},
			{set: {key: 'board', value: [[0, 1, 1, 1, 1, 1], [0, 0, 1, 1, 1, 1]]}},
			{set: {key: 'delta', value: {row: 0, col: 0}}},
			{set: {key: 'scores' , value: [22, 18]}}
		]);
	});
	
	it("placing seeds from 1x3 house in consecutive positions for player 1 to win the game is legal", function() {
	expectMoveOk(1,
		{board: [[6, 0, 1, 2, 0, 0], [0, 0, 0, 5, 3, 1]], scores: [8, 22]},
		[{endMatch: {endMatchScores : [0, 1]}},
			{set: {key: 'board', value: [[6, 0, 1, 0, 1, 1], [0, 0, 0, 0, 4, 2]]}},
			{set: {key: 'delta', value: {row: 1, col: 3}}},
			{set: {key: 'scores' , value: [8, 25]}}
		]);
	});


	it("allows to place seed into player 1's row when player 1's row is empty and a seed from player 2's row can be sowed into player 1's row.", function() {
	expectMoveOk(1,
		{board: [[0, 0, 0, 0, 0, 0], [1, 0, 0, 0, 0, 1]], scores: [22, 24]},
		[{setTurn: {turnIndex : 0}},
			{set: {key: 'board', value: [[0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0]]}},
			{set: {key: 'delta', value: {row: 1, col: 5}}},
			{set: {key: 'scores' , value: [22, 24]}}
		]);
	});

	it("does not allow to place seed in player2's row when player 1's row is empty and a seed from player 2's row can be sowed in player 1's row.", function() {
	expectIllegalMove(1,
		{board: [[0, 0, 0, 0, 0, 0], [1, 0, 0, 0, 0, 1]], scores: [22, 24]},
		[{setTurn: {turnIndex : 0}},
			{set: {key: 'board', value: [[0, 0, 0, 0, 0, 0], [0, 1, 0, 0, 0, 1]]}},
			{set: {key: 'delta', value: {row: 1, col: 0}}},
			{set: {key: 'scores' , value: [22, 24]}}
		]);
  	});

	it("player 2 wins game if player 1's row is empty after PLAYER 1's turn and no seed can be moved into player 1's row from player 2's row, seeds in player 1's row are captured by player2.", function() {
	expectMoveOk(0,
		{board: [[1, 0, 0, 0, 0, 0], [0, 0, 0, 0, 1, 0]], scores: [23, 23]},
		[{endMatch: {endMatchScores : [0, 1]}},
			{set: {key: 'board', value: [[0, 0, 0, 0, 0, 0], [1, 0, 0, 0, 1, 0]]}},
			{set: {key: 'delta', value: {row: 0, col: 0}}},
			{set: {key: 'scores' , value: [23, 25]}}
		]);
	});

});