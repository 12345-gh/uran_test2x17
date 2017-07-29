'use strict';

function maskDirective($log, $timeout, MaskService) {
	'ngInject';

	let directive = {
		restrict: 'A',
		require: 'ngModel',
		compile: function($element, $attrs) {
			if (!$attrs.mask || !$attrs.ngModel) {
				$log.info('Mask and ng-model attributes are required!');
				return;
			}
			let maskService = MaskService.create();
			let promise;

			return {
				pre: function($scope, $element, $attrs) {
					promise = maskService.generateRegex({
						mask: $attrs.mask,
						model: $attrs.ngModel,
						clean: (($attrs.clean || $attrs.maskClean) === 'true'),
						value: $attrs.ngValue
					});
				},
				post: function($scope, $element, $attrs, controller) {
					promise.then(() => {
						let timeout;
						let options = maskService.getOptions();

						let parseViewValue = (value) => {
							let untouchedValue = value;
							value = value || '';
							let viewValue = maskService.getViewValue(value);
							let maskWithoutOptionals = options.maskWithoutOptionals || '';
							let viewValueWithDivisors = viewValue.withDivisors();
							let viewValueWithoutDivisors = viewValue.withoutDivisors();

							try {
								let regex = maskService.getRegex(viewValueWithDivisors.length - 1);
								let fullRegex = maskService.getRegex(maskWithoutOptionals.length - 1);
								let validCurrentPosition = regex.test(viewValueWithDivisors) || fullRegex.test(viewValueWithDivisors);

								if (!validCurrentPosition) {
									viewValue = maskService.removeWrongPositions(viewValueWithDivisors);
									viewValueWithDivisors = viewValue.withDivisors();
									viewValueWithoutDivisors = viewValue.withoutDivisors();
								}

								controller.$setValidity('mask', (controller.$dirty && (fullRegex.test(viewValueWithDivisors) || controller.$isEmpty(untouchedValue))));

								if(value !== viewValueWithDivisors){
									controller.$viewValue = angular.copy(viewValueWithDivisors);
									controller.$render();
								}
							} catch (e) {
								$log.error('[mask - parseViewValue]');
								throw e;
							}

							return options.clean ? viewValueWithoutDivisors : viewValueWithDivisors;
						};

						controller.$parsers.push(parseViewValue);

						$element.on('click input paste keyup', () => {
							timeout = $timeout(() => {
								$timeout.cancel(timeout);

								parseViewValue($element.val());
								$scope.$apply();
							}, 10);
						});

						$scope.$watch($attrs.ngModel, (newValue) => {
							if (angular.isDefined(newValue)) {
								parseViewValue(newValue);
							}
						});

						if(options.value) {
							$scope.$evalAsync(() => {
								controller.$viewValue = angular.copy(options.value);
								controller.$render();
							});
						}
					});
				}
			};
		}

	};

	return directive;
}

export default maskDirective;
