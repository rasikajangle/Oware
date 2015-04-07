describe('Oware', function() {

    'use strict';

    beforeEach(function() {
        browser.get('http://localhost:9000/game.min.html');
    });

    function getDiv(row, col) {
        return element(by.id('e2e_test_div_' + row + 'x' + col));
    }

    function getSeedCount(row, col) {
        return element(by.id('e2e_test_seeds_' + row + 'x' + col));
    }


    function getPlayer1Score() {
        return element(by.id('e2e_test_player1score'));
    }

    function getPlayer2Score() {
        return element(by.id('e2e_test_player2score'));
    }

  
    function expectSeeds(row, col, seeds) {
        // Careful when using animations and asserting isDisplayed:
        // Originally, my animation started from {opacity: 0;}
        // And then the image wasn't displayed.
        // I changed it to start from {opacity: 0.1;}
        getSeedCount(row, col).getText().then(function(seedValue){
            expect(parseInt(seedValue)).toBe(seeds);
        });
    }

    function expectBoard(board) {
        for (var row = 0; row < 2; row++) {
            for (var col = 0; col < 6; col++) {
                expectSeeds(row, col, board[row][col]);
            }
        }
    }

    function expectPlayer1Score(player1Score){
        getPlayer1Score().getText().then(function(player1ScoreValue){
            expect(parseInt(player1ScoreValue)).toBe(player1Score);
        });
    }

    function expectPlayer2Score(player2Score){
        getPlayer2Score().getText().then(function(player2ScoreValue){
            expect(parseInt(player2ScoreValue)).toBe(player2Score);
        });
    }

    function clickDivAndExpectSeeds(row, col, seeds) {
        getDiv(row, col).click();
        expectSeeds(row, col, seeds);
    }

    // playMode is either: 'passAndPlay', 'playAgainstTheComputer', 'onlyAIs',
    // or a number representing the playerIndex (-2 for viewer, 0 for white player, 1 for black player, etc)
    function setMatchState(matchState, playMode) {
        browser.executeScript(function(matchStateInJson, playMode) {
            var stateService = window.e2e_test_stateService;
            stateService.setMatchState(angular.fromJson(matchStateInJson));
            stateService.setPlayMode(angular.fromJson(playMode));
            angular.element(document).scope().$apply(); // to tell angular that things changes.
        }, JSON.stringify(matchState), JSON.stringify(playMode));
    }

    var initialBoard = [
        [4, 4, 4, 4, 4, 4],
        [4, 4, 4, 4, 4, 4]
    ];

    it('should have a title', function () {
        expect(browser.getTitle()).toEqual('Oware');
    });

    it('should have a starting Oware board', function () {
        expectBoard(initialBoard);
    });

    it('should show 0 if I click in 0x0', function () {
        clickDivAndExpectSeeds(0, 0, 0);
        expectBoard([
            [0,4,4,4,4,4],
            [5,5,5,5,4,4]]);
    });

    it('should ignore clicking on a empty cell', function () {
        clickDivAndExpectSeeds(0, 0, 0);
        clickDivAndExpectSeeds(0, 0, 0); // clicking on a empty cell doesn't do anything.
        clickDivAndExpectSeeds(1, 5, 0);
        expectBoard([
            [0, 4, 5, 5, 5, 5],
            [5, 5, 5, 5, 4, 0]]);
    });

    var scores1 = [17, 13];
    var board1 = [
        [3, 1, 1, 1, 1, 6],
        [0, 1, 1, 1, 1, 5]];

    var delta2 = {row: 0, col: 5};
    var scores2 = [17, 13];
    var board2 = [
        [4, 2, 2, 2, 2, 0],
        [1, 1, 1, 1, 1, 5]];

    var delta3 = {row: 1, col: 5};
    var scores3 = [17, 25];
    var board3 = [
        [4, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 0]];

    var scores4 = [21, 15];
    var board4 = [
        [0, 0, 0, 0, 0, 11],
        [0, 0, 0, 0, 0, 1]];

    var delta5 = {row: 1, col: 5};    
    var scores5 = [21, 15];
    var board5 = [
        [0, 0, 0, 0, 0, 12],
        [0, 0, 0, 0, 0, 0]];

    var board6 = [
        [1, 1, 1, 1, 2, 0],
        [1, 1, 1, 1, 1, 1]];



    var matchState2 = {
        turnIndexBeforeMove: 0,
        turnIndex: 1,
        endMatchScores: null,
        lastMove: [{setTurn: {turnIndex: 1}},
              {set: {key: 'board', value: board2}},
              {set: {key: 'delta', value: delta2}},
              {set: {key: 'scores', value: scores2}}],
        lastState: {board: board1, scores: scores1},
        currentState: {board: board2, scores: scores2},
        lastVisibleTo: {},
        currentVisibleTo: {},
    };


    var matchState3 = {
        turnIndexBeforeMove: 1,
        turnIndex: -2,
        endMatchScores: [0, 1],
        lastMove: [{endMatch: {endMatchScores: [0, 1]}},
             {set: {key: 'board', value: board3}},
             {set: {key: 'delta', value: delta3}},
             {set: {key: 'scores', value: scores3}}],
        lastState: {board: board2, scores: scores2},
        currentState: {board: board3, scores: scores3},
        lastVisibleTo: {},
        currentVisibleTo: {},
    };


    var matchState4 = {
        turnIndexBeforeMove: 1,
        turnIndex: 0,
        endMatchScores: null,
        lastMove: [{setTurn: {turnIndex: 0}},
              {set: {key: 'board', value: board5}},
              {set: {key: 'delta', value: delta5}},
              {set: {key: 'scores', value: scores5}}],
        lastState: {board: board4, scores: scores4},
        currentState: {board: board5, scores: scores5},
        lastVisibleTo: {},
        currentVisibleTo: {},
    };


    it('can start from a match that is about to end, and win', function () {
        setMatchState(matchState2, 'passAndPlay');
        expectBoard(board2);
        
        clickDivAndExpectSeeds(1, 5, 0); // winning click!
        clickDivAndExpectSeeds(1, 5, 0); // can't click after game ended
        expectBoard(board3);
    });


    it('cannot play if it is not your turn', function () {
        // Now make sure that if you're playing "O" (your player index is 1) then
        // you can't do the winning click!
        setMatchState(matchState2, 0); // playMode=1 means that yourPlayerIndex=1.
        expectBoard(board2);
        clickDivAndExpectSeeds(1, 5, 5); // can't do the winning click!
        expectBoard(board2);
    });

    it('can start from a match that ended', function () {
        setMatchState(matchState3, 'passAndPlay');
        expectBoard(board3);
        clickDivAndExpectSeeds(1, 5, 0); // can't click after game ended
    });

    it('can start from a match that is about to end, and win and check the score of player 1', function () {
        setMatchState(matchState2, 'passAndPlay');
        expectBoard(board2);
        clickDivAndExpectSeeds(1, 5, 0); // winning click!
        expectBoard(board3);
        expectPlayer1Score(17);
    });

    it('can start from a match that is about to end, and win and check the score of player 2', function () {
        setMatchState(matchState2, 'passAndPlay');
        expectBoard(board2);
        clickDivAndExpectSeeds(1, 5, 0); // winning click!
        expectBoard(board3);
        expectPlayer2Score(25);
    });



    it('can start from a match that is about to play more than 11 seeds in a house', function () {
        setMatchState(matchState4, 'passAndPlay');
        expectBoard(board5);
        clickDivAndExpectSeeds(0, 5, 0); // more than 11 seeds click!
        expectBoard(board6);
    });
});
