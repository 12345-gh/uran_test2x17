'use strict';

// index.html page to dist folder
import '!!file-loader?name=[name].[ext]!./favicon/favicon.ico';

// vendor files
import "./index.vendor";

// mainApp module
import "./index.module";

// style files
import "./scss/base.scss";

angular.element(document).ready(() => {
	angular.bootstrap(document, ['mainApp'], {
		strictDi: true
	});
});
