// Karma configuration
// Generated on Tue Feb 24 2015 10:02:59 GMT-0500 (Eastern Standard Time)
module.exports = function(config){
  config.set({

    basePath : '',

    files : [
      'http://ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular.js',
      'http://ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular-mocks.js',
      '*.js',
      '*Test.js'
    ],

    reporters: ['progress', 'coverage'],

    preprocessors: {
      'gameLogic.js': ['coverage']
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
