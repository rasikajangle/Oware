describe("aiService", function() {

  'use strict';

  var _aiService;

  beforeEach(module("myApp"));

  beforeEach(inject(function (aiService) {
    _aiService = aiService;
  }));

  it("Player 1 finds an immediate winning move", function() {
    var move = _aiService.createComputerMove(
        [[2, 0, 0, 0, 0, 2],
         [1, 0, 0, 0, 0, 1]],[20, 22], 1, {maxDepth: 1});
    var expectedMove =
        [{endMatch: {endMatchScores: [0, 1]}},
          {set: {key: 'board', value:
                [[2, 0, 0, 0, 0, 0],
                 [1, 0, 0, 0, 0, 0]]}},
          {set: {key: 'delta', value: {row: 1, col: 5}}},
          {set: {key: 'scores', value: [20, 25]}}];
    expect(angular.equals(move, expectedMove)).toBe(true);
  });

  it("Player 0 finds an immediate winning move", function() {
    var move = _aiService.createComputerMove(
        [[1, 0, 0, 0, 0, 2],
         [2, 0, 0, 0, 0, 1]],[22, 20], 0, {maxDepth: 1});
    var expectedMove =
        [{endMatch: {endMatchScores: [1, 0]}},
          {set: {key: 'board', value:
                [[0, 0, 0, 0, 0, 2],
                 [0, 0, 0, 0, 0, 1]]}},
          {set: {key: 'delta', value: {row: 0, col: 0}}},
          {set: {key: 'scores', value: [25, 20]}}];
    expect(angular.equals(move, expectedMove)).toBe(true);
  });

  it("Player 1 prevents an immediate win", function() {
    var move = _aiService.createComputerMove(
        [[1, 0, 0, 0, 0, 2],
         [2, 0, 0, 2, 0, 5]],[22, 14], 1, {maxDepth: 2});
    expect(angular.equals(move[2].set.value, {row: 1, col: 0})).toBe(true);
  });

  it("Player 0 prevents an immediate win", function() {
    var move = _aiService.createComputerMove(
      [[5, 0, 2, 0, 0, 2],
         [2, 0, 0, 0, 0, 1]],[14, 22], 0, {maxDepth: 2});
    expect(angular.equals(move[2].set.value, {row: 0, col: 5})).toBe(true);
  });

  it("Player 1 finds a winning move that will lead to winning in 2 steps", function() {
    var move = _aiService.createComputerMove(
        [[2, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 2, 1]],[20, 23], 1, {maxDepth: 3});
    expect(angular.equals(move[2].set.value, {row: 1, col: 4})).toBe(true);
  });

  it("Player 0 finds a winning move that will lead to winning in 2 steps", function() {
    var move = _aiService.createComputerMove(
        [[1, 2, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 1]],[23, 21], 0, {maxDepth: 3});
    expect(angular.equals(move[2].set.value, {row: 0, col: 0})).toBe(true);
  });

  it("Player 1 finds a cool winning move that will lead to winning in 2 steps", function() {
    var move = _aiService.createComputerMove(
        [[2, 0, 0, 0, 0, 2],
         [0, 0, 0, 0, 5, 4]],[14, 21], 1, {maxDepth: 3});
    expect(angular.equals(move[2].set.value, {row: 1, col: 4})).toBe(true);
  });

  it("Player 1 finds the wrong move due to small depth", function() {
    var move = _aiService.createComputerMove(
        [[4, 0, 0, 0, 1, 0],
         [6, 0, 0, 0, 1, 1]],[19, 16], 1, {maxDepth: 2});
    expect(angular.equals(move[2].set.value, {row: 1, col: 4})).toBe(true);
  });

  it("Player 1 finds the correct move when depth is big enough", function() {
    var move = _aiService.createComputerMove(
        [[4, 0, 0, 0, 1, 0],
         [6, 0, 0, 0, 1, 1]],[19, 16], 1, {maxDepth: 9});
    expect(angular.equals(move[2].set.value, {row: 1, col: 0})).toBe(true);
  }); 

 it("Player 1 finds another winning move that will lead to a winning in 2 steps", function() {
    var move = _aiService.createComputerMove(
       [[4, 0, 0, 0, 1, 0],
         [10, 0, 0, 0, 0, 5]],[3, 15], 1, {maxDepth: 2});
    expect(angular.equals(move[2].set.value, {row: 1, col: 0})).toBe(true);
  });
});