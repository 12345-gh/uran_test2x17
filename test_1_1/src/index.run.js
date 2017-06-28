'use strict';

function run($log) {
	'ngInject';

	$log.debug('Hello from run block!');

	// Hot reload styles for webpack
	if (module.hot) {
		const hotEmitter = require("webpack/hot/emitter");
		const DEAD_CSS_TIMEOUT = 2000;

		hotEmitter.on("webpackHotUpdate", function() {
			document.querySelectorAll("link[href][rel=stylesheet]").forEach((link) => {
				const nextStyleHref = link.href.replace(/(\?\d+)?$/, `?${Date.now()}`);
				const newLink = link.cloneNode();
				newLink.href = nextStyleHref;

				link.parentNode.appendChild(newLink);
				setTimeout(() => {
					link.parentNode.removeChild(link);
				}, DEAD_CSS_TIMEOUT);
			});
		});
	}
}

export default run;