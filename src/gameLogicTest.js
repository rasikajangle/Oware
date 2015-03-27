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
		[{set: {key: 'board', value: undefined}},
		//[[4, 4, 4, 4, 4, 4], [4, 4, 4, 4, 4, 4]]}},
			{set: {key: 'player1Score' , value: 0}},
			{set: {key: 'player2Score' , value: 0}}
		],
		[{setTurn: {turnIndex : 0}},
			{set: {key: 'board', value: [[4, 4, 4, 4, 5, 5], [4, 4, 4, 0, 5, 5]]}},
			{set: {key: 'delta', value: {row: 1, col: 3}}},
			{set: {key: 'player1Score' , value: 0}},
			{set: {key: 'player2Score' , value: 0}}
		]);
	});
	
	it("placing seeds from 0x1 house in consecutive positions from initial state is legal", function() {
	expectMoveOk(0, 
		[{set: {key: 'board',  value: [[4, 4, 4, 4, 5, 5], [4, 4, 4, 0, 5, 5]]}},
			{set: {key: 'player1Score' , value: 0}},
			{set: {key: 'player2Score' , value: 0}}
		],
		[{setTurn: {turnIndex : 1}},
			{set: {key: 'board', value: [[5, 0, 4, 4, 5, 5], [5, 5, 5, 0, 5, 5]]}},
			{set: {key: 'delta', value: {row: 0, col: 1}}},
			{set: {key: 'player1Score' , value: 0}},
			{set: {key: 'player2Score' , value: 0}}
		]);
	});
	
	it("placing seeds from house slot with zero seeds at 1x3 is illegal", function() {
	expectIllegalMove(1, 
		[{set: {key: 'board',  value: [[5, 0, 4, 4, 5, 5], [5, 5, 5, 0, 5, 5]]}},
			{set: {key: 'player1Score' , value: 0}},
			{set: {key: 'player2Score' , value: 0}}
		],
		[{setTurn: {turnIndex : 0}},
			{set: {key: 'board', value: [[5, 0, 4, 4, 5, 5], [5, 5, 5, 0, 5, 5]]}},
			{set: {key: 'delta', value: {row: 1, col: 3}}},
			{set: {key: 'player1Score' , value: 0}},
			{set: {key: 'player2Score' , value: 0}}
		]);
	});
	
	it("placing seeds from opponent's house slot at 1x2 is illegal", function() {
	expectIllegalMove(0, 
		[{set: {key: 'board',  value: [[5, 0, 4, 4, 5, 5], [5, 5, 5, 0, 5, 5]]}},
			{set: {key: 'player1Score' , value: 0}},
			{set: {key: 'player2Score' , value: 0}}
		],
		[{setTurn: {turnIndex : 1}},
			{set: {key: 'board', value: [[5, 0, 4, 4, 6, 6], [5, 5, 0, 1, 6, 6]]}},
			{set: {key: 'delta', value: {row: 1, col: 3}}},
			{set: {key: 'player1Score' , value: 0}},
			{set: {key: 'player2Score' , value: 0}}
		]);
	});
	
	it("placing seeds from house slot at 1x4 when there is already a winner is illegal", function() {
	expectIllegalMove(1, 
		[{set: {key: 'board',  value: [[1, 0, 0, 1, 0, 0], [0, 0, 1, 1, 2, 0]]}},
			{set: {key: 'player1Score' , value: 25}},
			{set: {key: 'player2Score' , value: 17}}
		],
		[{setTurn: {turnIndex : 0}},
			{set: {key: 'board', value: [[1, 0, 0, 1, 0, 1], [0, 0, 1, 1, 0, 1]]}},
			{set: {key: 'delta', value: {row: 1, col: 4}}},
			{set: {key: 'player1Score' , value: 25}},
			{set: {key: 'player2Score' , value: 17}}
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
		[{set: {key: 'board',  value: [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]]}},
			{set: {key: 'player1Score' , value: 24}},
			{set: {key: 'player2Score' , value: 24}}
		],
		[firstOperation,
			{set: {key: 'board', value: [[0, 0, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0]]}},
			{set: {key: 'delta', value: {row: 1, col: 4}}},
			{set: {key: 'player1Score' , value: 24}},
			{set: {key: 'player2Score' , value: 24}}
		]);
	});
	
	it("placing seeds from 1x3 house in consecutive positions for player 1 to win the game is legal", function() {
	var  firstOperation = {endMatch: {endMatchScores: [0,1]}};
	expectMoveOk(1, 
		[{set: {key: 'board',  value: [[1, 3, 1, 2, 1, 3], [0, 0, 2, 6, 1, 2]]}},
			{set: {key: 'player1Score' , value: 8}},
			{set: {key: 'player2Score' , value: 18}}
		],
		[firstOperation,
			{set: {key: 'board', value: [[1, 3, 0, 0, 0, 4], [0, 0, 2, 0, 2, 3]]}},
			{set: {key: 'delta', value: {row: 1, col: 3}}},
			{set: {key: 'player1Score' , value: 8}},
			{set: {key: 'player2Score' , value: 25}}
		]);
	});
	
	it("placing seeds from 0x2 house in consecutive positions for player 0 to win the game is legal", function() {
	expectMoveOk(0, 
		[{set: {key: 'board',  value: [[1, 3, 5, 0, 0, 0], [0, 0, 2, 1, 6, 0]]}},
			{set: {key: 'player1Score' , value: 22}},
			{set: {key: 'player2Score' , value: 8}}
		],
		[{endMatch: {endMatchScores : [1, 0]}},
			{set: {key: 'board', value: [[2, 4, 0, 0, 0, 0], [1, 1, 0, 1, 6, 0]]}},
			{set: {key: 'delta', value: {row: 0, col: 2}}},
			{set: {key: 'player1Score' , value: 25}},
			{set: {key: 'player2Score' , value: 8}}
		]);
	});
	
	it("placing seeds from house slot with 12 seeds in consecutive positions", function() {
	expectMoveOk(1, 
		[{set: {key: 'board', value: [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 12]]}},
			{set: {key: 'player1Score' , value: 18}},
			{set: {key: 'player2Score' , value: 18}}
		],
		[{setTurn: {turnIndex : 0}},
			{set: {key: 'board', value: [[1, 1, 1, 1, 1, 0], [1, 1, 1, 1, 1, 0]]}},
			{set: {key: 'delta', value: {row: 1, col: 5}}},
			{set: {key: 'player1Score' , value: 18}},
			{set: {key: 'player2Score' , value: 20}}
		]);
	});
	
	it("placing seeds from house slot with 20 seeds in consecutive positions", function() {
	expectMoveOk(1, 
		[{set: {key: 'board', value: [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 20]]}},
			{set: {key: 'player1Score' , value: 14}},
			{set: {key: 'player2Score' , value: 14}}
		],
		[{setTurn: {turnIndex : 0}},
			{set: {key: 'board', value: [[2, 2, 2, 2, 2, 2], [2, 2, 2, 1, 1, 0]]}},
			{set: {key: 'delta', value: {row: 1, col: 5}}},
			{set: {key: 'player1Score' , value: 14}},
			{set: {key: 'player2Score' , value: 14}}
		]);
	});
	
	
	it("placing seeds from house slot with 7 seeds in consecutive positions", function() {
	expectMoveOk(1, 
		[{set: {key: 'board', value: [[1, 1, 1, 1, 1, 1], [0, 0, 0, 0, 7, 0]]}},
			{set: {key: 'player1Score' , value: 17}},
			{set: {key: 'player2Score' , value: 18}}
		],
		[{setTurn: {turnIndex : 0}},
			{set: {key: 'board', value: [[2, 2, 2, 2, 2, 2], [0, 0, 0, 0, 0, 1]]}},
			{set: {key: 'delta', value: {row: 1, col: 4}}},
			{set: {key: 'player1Score' , value: 17}},
			{set: {key: 'player2Score' , value: 18}}
		]);
	});


	/* Additional test cases.
	 * Author: Jugal Manjeshwar
	 */

	it("placing seeds from house slot at 0x2 when there is already a tie is illegal", function() {
	expectIllegalMove(0, 
		[{set: {key: 'board',  value: [[1, 2, 4, 0, 0, 0], [0, 1, 0, 1, 6, 0]]}},
			{set: {key: 'player1Score' , value: 24}},
			{set: {key: 'player2Score' , value: 24}}
		],
		[{endMatch: {endMatchScores : [0, 0]}},
			{set: {key: 'board', value: [[1, 2, 4, 0, 0, 0], [0, 1, 0, 1, 6, 0]]}},
			{set: {key: 'delta', value: {row: 0, col: 2}}},
			{set: {key: 'player1Score' , value: 24}},
			{set: {key: 'player2Score' , value: 24}}
		]);
	});

	it("placing seeds from 0x2 house in consecutive positions for player 0 to tie the game is legal", function() {
	expectMoveOk(0, 
		[{set: {key: 'board',  value: [[1, 2, 4, 0, 0, 0], [0, 1, 0, 1, 6, 0]]}},
			{set: {key: 'player1Score' , value: 22}},
			{set: {key: 'player2Score' , value: 24}}
		],
		[{endMatch: {endMatchScores : [0, 0]}},
			{set: {key: 'board', value: [[2, 3, 0, 0, 0, 0], [1, 0, 0, 1, 6, 0]]}},
			{set: {key: 'delta', value: {row: 0, col: 2}}},
			{set: {key: 'player1Score' , value: 24}},
			{set: {key: 'player2Score' , value: 24}}
		]);
	}); 


	it("placing seeds from house slot of player 0 with 13 seeds in consecutive positions", function() {
	expectMoveOk(0, 
		[{set: {key: 'board', value: [[13, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]]}},
			{set: {key: 'player1Score' , value: 18}},
			{set: {key: 'player2Score' , value: 18}}
		],
		[{setTurn: {turnIndex : 1}},
			{set: {key: 'board', value: [[0, 1, 1, 1, 1, 1], [0, 0, 1, 1, 1, 1]]}},
			{set: {key: 'delta', value: {row: 0, col: 0}}},
			{set: {key: 'player1Score' , value: 22}},
			{set: {key: 'player2Score' , value: 18}}
		]);
	});
	
	it("placing seeds from 1x3 house in consecutive positions for player 1 to win the game is legal", function() {
	expectMoveOk(1, 
		[{set: {key: 'board',  value: [[6, 0, 1, 2, 0, 0], [0, 0, 0, 5, 3, 1]]}},
			{set: {key: 'player1Score' , value: 8}},
			{set: {key: 'player2Score' , value: 22}}
		],
		[{endMatch: {endMatchScores : [0, 1]}},
			{set: {key: 'board', value: [[6, 0, 1, 0, 1, 1], [0, 0, 0, 0, 4, 2]]}},
			{set: {key: 'delta', value: {row: 1, col: 3}}},
			{set: {key: 'player1Score' , value: 8}},
			{set: {key: 'player2Score' , value: 25}}
		]);
	});
		
  });