'use strict';

function routeConfig($urlRouterProvider, $stateProvider) {
	'ngInject';

	$stateProvider
		.state('test', {
			url: '/test',
			template: '<div> TEST PAGE </div>',
		});


	$urlRouterProvider.otherwise('/');

}

export default angular
	.module('index.routes', [])
	.config(routeConfig);

