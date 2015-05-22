// Karma configuration
// Generated on Tue Feb 24 2015 10:02:59 GMT-0500 (Eastern Standard Time)
module.exports = function(config){

  
  'use strict';
  config.set({

    basePath : '',

    files : [
      'http://ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular.js',
      'http://ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular-mocks.js',
      'http://ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular-touch.min.js',
      'http://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/0.12.1/ui-bootstrap-tpls.min.js',
      'src/gameLogic.js',
      'src/gameLogicTest.js',
      'http://yoav-zibin.github.io/emulator/alphaBetaService.js',
      'src/aiService.js',
      'src/aiServiceTest.js'
    ],

    reporters: ['progress', 'coverage'],

    preprocessors: {
      'src/gameLogic.js': ['coverage']
    },

    // optionally, configure the reporter
    coverageReporter: {
      type : 'html',
      dir : 'coverage/',
	  file: 'coverage.html'
    },

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-chrome-launcher',
            'karma-jasmine',
            'karma-coverage'
            ],
			
	colors: true

  });
};
