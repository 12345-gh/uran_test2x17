'use strict';

import route from './home.route';
import './home.scss';

const homePageModule = angular.module('home.module', [
	'ui.router'
]);

homePageModule
	.config(route);

export default homePageModule;
