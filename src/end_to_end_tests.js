describe('Oware', function() {

  'use strict';

  beforeEach(function() {
    browser.get('http://localhost:9000/index.min.html');
  });

  function getDiv(row, col) {
    return element(by.id('e2e_test_div_' + row + 'x' + col));
  }

  function getSeedCount(row, col) {
    return element(by.id('e2e_test_seeds_' + row + 'x' + col));
  }
/*
  function getPlayer1Score() {
    return element(by.id('e2e_test_player1score'));
  }

  function getPlayer2Score() {
    return element(by.id('e2e_test_player2score'));
  }

*/  
  function expectSeeds(row, col, seeds) {
    // Careful when using animations and asserting isDisplayed:
    // Originally, my animation started from {opacity: 0;}
    // And then the image wasn't displayed.
    // I changed it to start from {opacity: 0.1;}
    expect(getSeedCount(row, col).getText()).toEqual(seeds);
  }

  function expectBoard(board) {
    for (var row = 0; row < 2; row++) {
      for (var col = 0; col < 6; col++) {
        expectSeeds(row, col, board[row][col]);
      }
    }
  }

  function clickDivAndExpectSeeds(row, col, seeds) {
    getDiv(row, col).click();
    getSeedCount(row, col, seeds);
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
    ['4', '4', '4','4', '4', '4'],
    ['4', '4', '4','4', '4', '4']];

  it('should have a title', function () {
    expect(browser.getTitle()).toEqual('Oware');
  });

  it('should have a starting Oware board', function () {
    expectBoard(initialBoard);
  });

  it('should show 0 if I click in 0x0', function () {
    clickDivAndExpectSeeds(0, 0, '0');
    expectBoard(
        [['0','4','4','4','4','4'],
         ['5','5','5','5','4','4']]);
  });

  it('should ignore clicking on a empty cell', function () {
    clickDivAndExpectSeeds(0, 0, '0');
    clickDivAndExpectSeeds(0, 0, '0'); // clicking on a empty cell doesn't do anything.
    clickDivAndExpectSeeds(1, 5, '0');
    expectBoard(
        [['0', '4', '5', '5', '5', '5'],
         ['5', '5', '5', '5', '4', '0']]);
  });


  /*var delta1 = {row: 1, col: 0};
  var board1 =
      [['2', '1', '1', '1', '1', '5'],
       ['6', '0', '0', '0', '0', '4']]);
*/
  var delta1 = {row: 0, col: 5};
  var player1Score1 = 17;
  var player2Score1 = 13;
  var board1 =
      [['3', '1', '1', '1', '1', '6'],
       ['0', '1', '1', '1', '1', '5']];

  var delta2 = {row: 0, col: 5};
  var player1Score2 = 17;
  var player2Score2 = 13;
  var board2 =
      [['4', '2', '2', '2', '2', '0'],
       ['1', '1', '1', '1', '1', '5']];

 // var delta3 = {row: 1, col: 5};
 // var player1Score3 = 17;
 // var player2Score3 = 25;
 /* var board3 =
      [['4', '0', '0', '0', '0', '1'],
       ['1', '1', '1', '1', '1', '0']];*/


  var matchState2 = {
    turnIndexBeforeMove: 1,
    turnIndex: 0,
    endMatchScores: null,
    lastMove: [{setTurn: {turnIndex: 0}},
          {set: {key: 'board', value: board2}},
          {set: {key: 'delta', value: delta2}},
          {set: {key: 'player1Score', value: player1Score2}},
          {set: {key: 'player2Score', value: player2Score2}}],
    lastState: {board: board1, delta: delta1, player1Score: player1Score1, player2Score: player2Score1},
    currentState: {board: board2, delta: delta2, player1Score: player1Score2, player2Score: player2Score2},
    lastVisibleTo: {},
    currentVisibleTo: {},
  };

  it('can start from a match that is about to end, and win', function () {
    setMatchState(matchState2, 'passAndPlay');
   // expectBoard(board2);
   // clickDivAndExpectSeeds(1, 5, '5'); // winning click!
   // clickDivAndExpectSeeds(1, 5, '0'); // can't click after game ended
   // expectBoard(board3);
  });

});