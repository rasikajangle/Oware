angular.module('myApp') .controller('Ctrl',
	['$scope', '$log', '$timeout', 'gameService', 'stateService', 'gameLogic', 'resizeGameAreaService', 
	function ($scope, $log, $timeout, gameService, stateService, gameLogic,  resizeGameAreaService) {

	'use strict';

    var gameArea = document.getElementById("gameArea"),
        numRows = 2, numCols = 6,
        dragStartPos = null, 
        baseEl = null, 
        baseParent = null, 
        basePos = null, 
        baseVal = null, 
        dragEl = null, 
        nextZIndex = 15, 
        dragSet = false, 
        set = null, 
        setIndex = 0, 
        dragMove = null,
        boardTemp = null,
        scoreEl = [angular.element(document.getElementById('e2e_test_player1score')).parent(),
    		angular.element(document.getElementById('e2e_test_player2score')).parent()];

    function handleDrag(type, cx, cy) {
    	if(dragSet || !$scope.isYourTurn) {
            return;
        }

        var size = getSquareWidthHeight();
        var x = Math.min(Math.max(cx - gameArea.offsetLeft, 0), gameArea.clientWidth - size.width),
            y = Math.min(Math.max(cy - gameArea.offsetTop, 0), gameArea.clientHeight - size.height);

        var row = Math.floor( numRows * y / gameArea.clientHeight ),
            col = Math.floor( numCols * x / gameArea.clientWidth );

        if (type === "touchstart" && !dragEl) {
            
            dragStartPos = {row: row, col: col};
            baseEl = angular.element(document.getElementById("e2e_test_seeds_" + dragStartPos.row + "x" + dragStartPos.col));
            baseParent = baseEl.parent();
            baseParent.addClass('selected');
            baseVal = +baseEl.text();
            boardTemp = angular.copy($scope.board);

            boardTemp[row][col] = 0;
            $scope.$apply();

			var rect = baseEl[0].getBoundingClientRect();
			basePos = {left: rect.left - gameArea.offsetLeft, top: rect.top - gameArea.offsetTop};
            dragEl = angular.element('<div class="seeds dragging">' + baseVal + '</div>');
            dragEl.css({
            	'z-index': ++nextZIndex,
            	'top': Math.round(basePos.top) + 'px',
            	'left': Math.round(basePos.left) + (size.width * 0.25) + 'px',
            	'width': size.width * 0.3 + 'px',
            	'height': size.width * 0.3 + 'px',
            	'font-size': size.width * 0.2 + 'px',
            	'padding': size.width * 0.1 + 'px',
            	'line-height': size.width * 0.3 + 'px'
            });
            angular.element(gameArea).append(dragEl);
        }

        if (!dragEl) {
            return;
        }

        if (type === "touchend") {
            var to = {row: row, col: col};
	    	var cDiff = to.col - dragStartPos.col;
	    	if(!(dragStartPos.row === 0 && cDiff > 0 || dragStartPos.row === 1 && cDiff < 0)) {
/*	    		var t = $scope.board;
	    		$scope.board = boardTemp;*/
	            dragMove = selectCell(dragStartPos.row, dragStartPos.col);
	            if(dragMove) {
	            	set = getUpdatePos(dragStartPos.row, dragStartPos.col, $scope.board, dragMove[1].set.value);
	            	// $scope.board = t;
	            	setIndex = 0;
	            	dragSet = true;
	            	dragDone();
	            }
            }
        } 
        else {
            setDraggingPiece(row, col);
        }

        if (type === "touchend" || type === "touchcancel" || type === "touchleave") {
            if(!dragSet) {
				resetDragEl(baseVal);    	
            }
        }
    }
    window.handleDragEvent = handleDrag;

    function setDraggingPiece(row, col) {
    	var topLeft = getSquareTopLeft(row, col);
        var squareSize = getSquareWidthHeight();
        dragEl.css({
        	left: topLeft.left + ((row === 0 ) ? 0 : squareSize.width / 2) + "px",
        	top: topLeft.top + "px"
        });
    }

    function getSquareWidthHeight() {
        return {
            width: gameArea.clientWidth / numCols,
            height: gameArea.clientHeight / numRows
        };
    }

    function getSquareTopLeft(row, col) {
        var size = getSquareWidthHeight();
        return {top: (row === 0) ? size.height * 0.42 : size.height * 1.1, left: col * size.width};
    }

    function getNextPos(row, col) {
    	if(row === 0) {
    		col--;
    	}
    	else {
    		col++;
    	}

    	if(col < 0) {
    		row = 1;
    		col = 0;
    	}
    	else if(col > 5) {
    		row = 0;
    		col = 5;
    	}
    	return {row: row, col: col};
    }

    function resetDragEl(val){
	    dragEl[0].style.opacity = 0;
	    baseParent.removeClass('selected');
	    setTimeout(function(){
	    	boardTemp[dragStartPos.row][dragStartPos.col] = val;
            $scope.$apply();

	    	dragEl.detach();
	    	dragEl = null;
	    	dragStartPos = null;     	
	    }, 100);  	
    }

    function updateVals(val, callback){
		if(setIndex < set.updates.length) {
	    	var pos = set.updates[setIndex++];
			setDraggingPiece(pos.row, pos.col);
			dragEl.text(--val);
			var pEl = angular.element(document.getElementById("pit_" + pos.row + "x" + pos.col)).addClass('pos');
			setTimeout(function(){
				pEl.removeClass('pos');
			}, 2500);
			var uEl = angular.element(document.getElementById("e2e_test_seeds_" + pos.row + "x" + pos.col));

			boardTemp[pos.row][pos.col] = +uEl.text() + 1;
			if(boardTemp[pos.row][pos.col] === '2' || boardTemp[pos.row][pos.col] === '3'){
				pEl.addClass('captured');
			}
            $scope.$apply(function(){
				setTimeout(function(){
					updateVals(val, callback);
				}, 400);            	
            });


		}
		else {
			setIndex = 0;
			setTimeout(function(){
				updateCaptures(callback);
			}, 400);
		}
    }

    function updateCaptures(callback){
		if(setIndex < set.captures.length) {
			scoreEl[$scope.turnIndex].addClass('capture');
			dragEl.addClass('capture');
	    	var pos = set.captures[setIndex++];
	    	setDraggingPiece(pos.row, pos.col);
	    	var uEl = angular.element(document.getElementById("e2e_test_seeds_" + pos.row + "x" + pos.col));
	    	dragEl.text(+dragEl.text() + (+uEl.text()));

			boardTemp[pos.row][pos.col] = 0;
            $scope.$apply();

			setTimeout(function(){
				updateCaptures(callback);
			}, 400);
		}
		else {
			setIndex = 0;
			setTimeout(callback, 100);
		}
    }


    function dragDone() {
    	updateVals(baseVal, function(){
    		resetDragEl(0);
    		gameService.makeMove(dragMove);
    		scoreEl[$scope.turnIndex].removeClass('capture');
    		dragMove = null;
    		dragSet = false;
    	});
    }

    $scope.scores = [0, 0];
	resizeGameAreaService.setWidthToHeight(1.6);

/*	$translate('OWARE_GAME').then(function (translation) {
      console.log("Translation of 'OWARE_GAME' is " + translation);
    });*/

	
    function sendComputerMove() {
        var items = gameLogic.getPossibleMoves($scope.board, $scope.captures, $scope.turnIndex);
        gameService.makeMove(items[Math.floor(Math.random()*items.length)]);
    }
   
  
  	function getUpdatePos(row, col, board1, board2) {
  		var updates = [], captures = [];
  		var pos = {row: row, col: col}, diff, val = board1[row][col];
  		while(val){
  			pos = getNextPos(pos.row, pos.col);
            if(pos.row === row && pos.col === col) {
                continue;
            }
  			diff = board2[pos.row][pos.col] - board1[pos.row][pos.col];
  			if(diff > 0) {
  				updates.push({row: pos.row, col: pos.col});
  			}
  			else if(diff < 0){
  				updates.push({row: pos.row, col: pos.col});
  				captures.push({row: pos.row, col: pos.col});
  			}
            val--;
  		}
  		captures.reverse();
  		return { updates: updates, captures: captures };
  	}

	function updateUI(params) {
		$scope.board = params.stateAfterMove.board;
		$scope.delta = params.stateAfterMove.delta;
		$scope.scores = params.stateAfterMove.scores;
		
		if ($scope.board === undefined) {
			$scope.board = gameLogic.getInitialBoard();
			$scope.scores = [0, 0];
		}

		$scope.validMoves = gameLogic.getPossibleMoves($scope.board, params.turnIndexAfterMove, $scope.scores);

		$scope.isYourTurn = params.turnIndexAfterMove >= 0 && // game is ongoing
		params.yourPlayerIndex === params.turnIndexAfterMove; // it's my turn
		$scope.turnIndex = params.turnIndexAfterMove;

		// Is it the computer's turn?
        if ($scope.isYourTurn &&
          params.playersInfo[params.yourPlayerIndex].playerId === '') {
            $scope.isYourTurn = false; // to make sure the UI won't send another move.
            // Waiting 0.5 seconds to let the move animation finish; if we call aiService
            // then the animation is paused until the javascript finishes.
            $timeout(sendComputerMove, 500);
        }
	}
   
    window.e2e_test_stateService = stateService; // to allow us to load any state in our e2e tests.

	function selectCell(row, col) {
		$log.info(["Clicked on cell:", row, col]);
		if (window.location.search === '?throwException') { // to test encoding a stack trace with sourcemap
			throw new Error("Throwing the error because URL has '?throwException'");
		}
		if (!$scope.isYourTurn) {
			return false;
		}
		try {
			var move = gameLogic.createMove($scope.board, row, col, $scope.turnIndex, $scope.scores);
			$scope.isYourTurn = false; // to prevent making another move
			return move;

		} catch (e) {
			$log.info(["Cell is already full in position:", row, col]);
			return false;
		}
	}

    $scope.isValid = function(row, col) {
        for(var i = 0; i < $scope.validMoves.length; i++) {
            var pos = $scope.validMoves[i][2].set.value;
            if(row === pos.row && col === pos.col) {
                return true;
            }
        }
        return false;
    };

	$scope.getSeeds = function(row, col) {
		if(dragSet) {
			return boardTemp[row][col];
		}
		else{
			return $scope.board[row][col];	
		}
	 	
	};

	$scope.getScore = function(row) {
		return $scope.scores[row];
	};

	gameService.setGame({
	  gameDeveloperEmail: "rsjangle27@gmail.com",
	  minNumberOfPlayers: 2,
	  maxNumberOfPlayers: 2,
	  isMoveOk: gameLogic.isMoveOk,
	  updateUI: updateUI
	});
  }]);