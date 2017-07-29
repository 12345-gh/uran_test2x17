'use strict';

import headerAppTmpl from './header-app.html';
import headerAppCtrl from './header-app.ctrl';

let headerAppComponent = {
	templateUrl: headerAppTmpl,
	controller:  headerAppCtrl,
	controllerAs: 'header',
	bindings: {
		// oneWay: '<',
		// twoWay: '='
		// attrValue: '@'
	},
	// require: {
	// 	parent: '^parentComponent'
	// }
};

export default headerAppComponent;

