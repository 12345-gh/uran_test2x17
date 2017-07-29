'use strict';

import homeTmpl from './home.html';
import homeCtrl from './home.ctrl';

function routeConfig($stateProvider) {
	'ngInject';

	$stateProvider
		.state('home', {
			url: '/',
			templateUrl: homeTmpl,
			controller: homeCtrl,
			controllerAs: 'home'
		});

}

export default routeConfig;
