import angular from 'angular';

// angular modules
import onConfig  from './on_config';
import onRun     from './on_run';
import 'angular-ui-router';
import 'angular-animate';
import './templates';
import './controllers';
import './directives';

// create and bootstrap application
const requires = [
	'ui.router',
	'ngAnimate',
	'templates',
	'app.controllers',
	'app.directives'
];

// mount on window for testing
window.app = angular.module('app', requires);

angular.module('app').config(onConfig);

angular.module('app').run(onRun);

angular.bootstrap(document, ['app'], {
	strictDi: true
});
