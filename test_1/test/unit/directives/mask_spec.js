/* global module */
'use strict';

describe('Unit: maskDirective', () => {
	let $scope;
	let compileAndDigest;

	beforeEach(angular.mock.module('app'));

	beforeEach(inject(($compile, $rootScope) => {
		$scope = $rootScope.$new();

		compileAndDigest = (inputHtml, scope) => {
			let inputElm = angular.element(inputHtml);
			$compile(inputElm)(scope);
			scope.$digest();
			return inputElm;
		};
	}));

	it('should change ngModel to value 12/12', () => {
		$scope.mask = '00/00/0000';
		$scope.model = '12DD12MM2017YYYY';
		compileAndDigest('<form name="myForm"><input name="myInput" mask="{{mask}}" ng-model="model" /></form>', $scope);
		expect($scope.myForm.myInput.$viewValue).toBe('12/12/2017');
	});

	it('should change ngModel to value 12/12', () => {
		$scope.mask = '00/00/0000';
		$scope.model = '1212YYYY';
		compileAndDigest('<form name="myForm"><input name="myInput" mask="{{mask}}" ng-model="model" /></form>', $scope);
		expect($scope.myForm.myInput.$viewValue).toBe('12/12');
	});

	it('should change ngModel to value 12/12/2017', () => {
		$scope.mask = '00/00/0000';
		$scope.model = '12122017';
		compileAndDigest('<form name="myForm"><input name="myInput" mask="{{mask}}" ng-model="model" /></form>', $scope);
		expect($scope.myForm.myInput.$viewValue).toBe('12/12/2017');
	});

});
