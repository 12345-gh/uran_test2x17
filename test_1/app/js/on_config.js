function OnConfig($stateProvider, $locationProvider, $urlRouterProvider, $qProvider) {
	'ngInject';

	$locationProvider.html5Mode(true);

	$qProvider.errorOnUnhandledRejections(false);

	$stateProvider
		.state('home', {
			url: '/',
			controller: 'HomeCtrl as home',
			templateUrl: 'home.html',
			title: 'home'
		});

	$urlRouterProvider.otherwise('/');

}

export default OnConfig;
