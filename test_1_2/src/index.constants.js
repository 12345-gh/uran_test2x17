'use strict';

const indexConstants = angular.module('index.constants', []);

indexConstants
	.constant('ROUTE', {
		url: "example.com",
	})
	.constant('LOGGER', {
		isEnabled: true,
	});

export default indexConstants;
