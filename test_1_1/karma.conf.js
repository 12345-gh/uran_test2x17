var webpackConfig = require('./webpack.config.js');

module.exports = function(config) {
	config.set({
		basePath: './',
		frameworks: ['jasmine'],
		files: [
			'node_modules/angular/angular.min.js',
			'node_modules/angular-mocks/angular-mocks.js',
			'src/**/*.js',
			'test/unit/spec/**/*Spec.js'
		],
		preprocessors: {
			'src/**/*.js' : ['webpack']
		},
		webpack: webpackConfig,
		reporters: ['mocha'],
		port: 9876,
		colors: true,
		logLevel: config.LOG_INFO,
		autoWatch: true,
		browsers: ['Chrome'],
		singleRun: true,
		concurrency: Infinity
	});
};