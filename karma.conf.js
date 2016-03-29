// Karma configuration
// Generated on Wed Mar 16 2016 12:31:39 GMT-0500 (CDT)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: ['node_modules/angular/angular.js',
    'node_modules/angular-mocks/angular-mocks.js',
    'node_modules/angular-ui-router/release/angular-ui-router.js',
    'node_modules/sinon/pkg/sinon-1.7.3.js',
    // 'client/app.config.js',
    // 'client/account/AccountController.js',
    // 'client/leagueResults/leagueResultsController.js',
    // 'client/portfolio/portfolioController.js',
    // 'client/services/dashboardService.js',
    // 'client/dashboard/dashboardController.js',
    // 'client/league/leagueController.js',
    // 'client/faqs/faqsController.js',
    // 'client/signin/signinController.js',
    // 'client/leaderboard/leaderBoardController.js',
    // 'client/news/newscontroller.js',
    // 'client/messageboard/messageBoardController.js',
    // 'client/services/messageBoardService.js',
    // 'client/services/authService.js',
    // 'client/botBar/botBarController.js',
    // 'client/preleague/preleagueController.js',
    // 'client/services/preLeagueService.js',
    // 'client/services/accountService.js',
    // 'client/services/portfolioService.js',
    // 'client/clock/clockController.js',
    // 'client/symbol/symbolController.js',
    // 'client/services/symbolService.js',
    'tests/*.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['spec'],

    plugins : [
      'karma-chrome-launcher',
      'karma-jasmine',
      'karma-spec-reporter'
    ],

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
