'use strict';

import headerAppComponent from './header-app.component';
import './header-app.scss';

const headerAppModule = angular.module('header-app.module', []);

headerAppModule
	.component('headerApp', headerAppComponent);

export default headerAppModule;
