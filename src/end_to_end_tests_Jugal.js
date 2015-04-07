/**
 * End-to-end tests
 * @author Jugal Manjeshwar <jugalm9@gmail.com>
 */

describe('Oware', function() {

    'use strict';

    beforeEach(function() {
        browser.get('http://localhost:9000/game.min.html');
    });

    function getDiv(row, col) {
        return element(by.id('e2e_test_div_' + row + 'x' + col));
    }

    function getSeedDiv(row, col) {
        return element(by.id('e2e_test_seeds_' + row + 'x' + col));
    }

    function expectSeeds(row, col, seeds) {
        getSeedDiv(row, col).getText().then(function(seedValue){
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
        element(by.id('e2e_test_player1score')).getText().then(function(player1ScoreValue){
            expect(parseInt(player1ScoreValue)).toBe(player1Score);
        });
    }

    function expectPlayer2Score(player2Score){
        element(by.id('e2e_test_player2score')).getText().then(function(player2ScoreValue){
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

    it('should ignore clicking in row 1 when it\'s player 0\'s turn', function () {
        clickDivAndExpectSeeds(1, 0, 4);
        clickDivAndExpectSeeds(1, 1, 4);
        clickDivAndExpectSeeds(1, 2, 4);
        clickDivAndExpectSeeds(1, 3, 4);
        clickDivAndExpectSeeds(1, 4, 4);
        clickDivAndExpectSeeds(1, 5, 4);
        expectBoard(initialBoard);
    });

    it('should ignore clicking in row 0 when it\'s player 1\'s turn', function () {
        clickDivAndExpectSeeds(0, 0, 0);
        clickDivAndExpectSeeds(0, 1, 4);
        clickDivAndExpectSeeds(0, 2, 4);
        clickDivAndExpectSeeds(0, 3, 4);
        clickDivAndExpectSeeds(0, 4, 4);
        clickDivAndExpectSeeds(0, 5, 4);
        expectBoard([
            [0, 4, 4, 4, 4, 4],
            [5, 5, 5, 5, 4, 4]]);
    });

    var player1Score4 = 21;
    var player2Score4 = 15;
    var board4 = [
        [0, 0, 0, 0, 0, 11],
        [0, 0, 0, 0, 0, 1]];


    var delta5 = {row: 1, col: 5};    
    var player1Score5 = 21;
    var player2Score5 = 15;
    var board5 = [
        [0, 0, 0, 0, 0, 12],
        [0, 0, 0, 0, 0, 0]];

    var player1Score6 = 21;
    var player2Score6 = 15;
    var board6 = [
        [1, 1, 1, 1, 2, 0],
        [1, 1, 1, 1, 1, 1]];


    var matchState4 = {
        turnIndexBeforeMove: 1,
        turnIndex: 0,
        endMatchScores: null,
        lastMove: [{setTurn: {turnIndex: 0}},
              {set: {key: 'board', value: board5}},
              {set: {key: 'delta', value: delta5}},
              {set: {key: 'player1Score', value: player1Score5}},
              {set: {key: 'player2Score', value: player2Score5}}],
        lastState: {board: board4, player1Score: player1Score4, player2Score: player2Score4},
        currentState: {board: board5, player1Score: player1Score5, player2Score: player2Score5},
        lastVisibleTo: {},
        currentVisibleTo: {},
    };


    it('can start from a match that is about to play more than 11 seeds in a house, check player scores', function () {
        setMatchState(matchState4, 'passAndPlay');
        expectBoard(board5);
        clickDivAndExpectSeeds(0, 5, 0); // more than 11 seeds click!
        expectBoard(board6);
        expectPlayer1Score(player1Score6);
        expectPlayer2Score(player2Score6);
    });
});
