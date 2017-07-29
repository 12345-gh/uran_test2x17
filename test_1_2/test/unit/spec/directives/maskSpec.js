'use strict';

describe('Directive: mask', function() {
	var $scope;
	var compileAndDigest;

	beforeEach(angular.mock.module('mainApp'));

	beforeEach(inject(function($compile, $rootScope) {
		$scope = $rootScope.$new();

		compileAndDigest = function(inputHtml, scope) {
			var inputElm = angular.element(inputHtml);
			$compile(inputElm)(scope);
			scope.$digest();
			return inputElm;
		};
	}));

	it('should leave ngModel pristine with undefined model value', function() {
		$scope.myModel = undefined;
		compileAndDigest('<form name="myForm"><input name="myInput" ng-model="myModel" mask="* *" /></form>', $scope);
		expect($scope.myForm.myInput.$pristine).toBe(true);
		expect($scope.myForm.myInput.$dirty).toBe(false);
	});

	it('should leave ngModel pristine with predefined model value', function() {
		$scope.myModel = 'some value';
		compileAndDigest('<form name="myForm"><input name="myInput" ng-model="myModel" mask="* *" /></form>', $scope);
		expect($scope.myForm.myInput.$pristine).toBe(true);
		expect($scope.myForm.myInput.$dirty).toBe(false);
	});

	it('should change ngModel 12345 to 12-345 using mask 99-999', function() {
		$scope.myModel = '12345';
		compileAndDigest('<form name="myForm"><input name="myInput" ng-model="myModel" mask="99-999" /></form>', $scope);
		expect($scope.myForm.myInput.$viewValue).toBe('12-345');
	});

	it('should change ngModel ABC123BB45 to 12-345 using mask 99-999', function() {
		$scope.myModel = '12345';
		compileAndDigest('<form name="myForm"><input name="myInput" ng-model="myModel" mask="99-999" /></form>', $scope);
		expect($scope.myForm.myInput.$viewValue).toBe('12-345');
	});

	it('should change ngModel 28062017 to 28/06/2017 using mask 00/00/0000', function() {
		$scope.myModel = '28062017';
		compileAndDigest('<form name="myForm"><input name="myInput" ng-model="myModel" mask="00/00/0000" /></form>', $scope);
		expect($scope.myForm.myInput.$viewValue).toBe('28/06/2017');
	});

	it('should change ngModel 112233 to 11:22:33 using mask 00:00:00', function() {
		$scope.myModel = '112233';
		compileAndDigest('<form name="myForm"><input name="myInput" ng-model="myModel" mask="00:00:00" /></form>', $scope);
		expect($scope.myForm.myInput.$viewValue).toBe('11:22:33');
	});

	it('should change ngModel 28062017112233 to 28/06/2017 11:22:33 using mask 00/00/0000 00:00:00', function() {
		$scope.myModel = '28062017112233';
		compileAndDigest('<form name="myForm"><input name="myInput" ng-model="myModel" mask="00/00/0000 00:00:00" /></form>', $scope);
		expect($scope.myForm.myInput.$viewValue).toBe('28/06/2017 11:22:33');
	});

	it('should change ngModel 12345678 to 12345-678 using mask 00000-000', function() {
		$scope.myModel = '12345678';
		compileAndDigest('<form name="myForm"><input name="myInput" ng-model="myModel" mask="00000-000" /></form>', $scope);
		expect($scope.myForm.myInput.$viewValue).toBe('12345-678');
	});

	it('should change ngModel 0976862244 to (097) 686-2244 using mask (000) 000-0000', function() {
		$scope.myModel = '0976862244';
		compileAndDigest('<form name="myForm"><input name="myInput" ng-model="myModel" mask="(000) 000-0000" /></form>', $scope);
		expect($scope.myForm.myInput.$viewValue).toBe('(097) 686-2244');
	});

	it('should change ngModel XYZ555 5  to XYZ 555-D5D using mask AAA 000-S0S', function() {
		$scope.myModel = 'XYZ555D5D';
		compileAndDigest('<form name="myForm"><input name="myInput" ng-model="myModel" mask="AAA 000-S0S" /></form>', $scope);
		expect($scope.myForm.myInput.$viewValue).toBe('XYZ 555-D5D');
	});

	it('should change ngModel 255253146059  to 255.253.146.059 using mask 099.099.099.099', function() {
		$scope.myModel = '255253146059';
		compileAndDigest('<form name="myForm"><input name="myInput" ng-model="myModel" mask="099.099.099.099" /></form>', $scope);
		expect($scope.myForm.myInput.$viewValue).toBe('255.253.146.059');
	});

});