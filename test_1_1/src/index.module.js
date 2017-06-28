'use strict';

import uiRouter from 'angular-ui-router';
import config from './index.config';
import run from './index.run';

import indexConstants from './index.constants';
import indexComponents from './index.components';
import indexDirectives from './index.directives';
import indexPages from './index.pages';
import indexRoutes from './index.routes';
import indexServices from './index.services';

const MainApp = angular.module(
	"mainApp", [
		uiRouter,
		'ui.bootstrap',
		'ngAnimate',
		'ngSanitize',
		indexConstants.name,
		indexComponents.name,
		indexDirectives.name,
		indexPages.name,
		indexRoutes.name,
		indexServices.name
	]
);

MainApp
	.config(config)
	.run(run);

export default MainApp;
