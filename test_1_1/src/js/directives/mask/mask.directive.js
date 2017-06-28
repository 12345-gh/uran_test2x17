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
			let timeout;
			let promise;

			let setSelectionRange = (selectionStart) => {
				if (typeof selectionStart !== 'number') {
					return;
				}
				$timeout.cancel(timeout);
				timeout = $timeout(() => {
					let selectionEnd = selectionStart + 1;
					let input = $element[0];

					if (input.setSelectionRange) {
						input.focus();
						input.setSelectionRange(selectionStart, selectionEnd);
					} else if (input.createTextRange) {
						let range = input.createTextRange();

						range.collapse(true);
						range.moveEnd('character', selectionEnd);
						range.moveStart('character', selectionStart);
						range.select();
					}
				});
			};

			return {
				pre: function($scope, $element, $attrs) {
					promise = maskService.generateRegex({
						mask: $attrs.mask,
						repeat: ($attrs.repeat || $attrs.maskRepeat),
						clean: (($attrs.clean || $attrs.maskClean) === 'true'),
						limit: (($attrs.limit || $attrs.maskLimit || 'true') === 'true'),
						restrict: ($attrs.restrict || $attrs.maskRestrict || 'select'), //select, reject, accept
						validate: (($attrs.validate || $attrs.maskValidate || 'true') === 'true'),
						model: $attrs.ngModel,
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
							let viewValueWithDivisors = viewValue.withDivisors(true);
							let viewValueWithoutDivisors = viewValue.withoutDivisors(true);

							try {
								let regex = maskService.getRegex(viewValueWithDivisors.length - 1);
								let fullRegex = maskService.getRegex(maskWithoutOptionals.length - 1);
								let validCurrentPosition = regex.test(viewValueWithDivisors) || fullRegex.test(viewValueWithDivisors);
								let diffValueAndViewValueLengthIsOne = (value.length - viewValueWithDivisors.length) === 1;
								let diffMaskAndViewValueIsGreaterThanZero = (maskWithoutOptionals.length - viewValueWithDivisors.length) > 0;

								if (options.restrict !== 'accept') {
									if (options.restrict === 'select' && (!validCurrentPosition || diffValueAndViewValueLengthIsOne)) {
										let lastCharInputed = value[(value.length-1)];
										let lastCharGenerated = viewValueWithDivisors[(viewValueWithDivisors.length-1)];

										if ((lastCharInputed !== lastCharGenerated) && diffMaskAndViewValueIsGreaterThanZero) {
											viewValueWithDivisors = viewValueWithDivisors + lastCharInputed;
										}

										let wrongPosition = maskService.getFirstWrongPosition(viewValueWithDivisors);
										if (angular.isDefined(wrongPosition)) {
											setSelectionRange(wrongPosition);
										}
									} else if (options.restrict === 'reject' && !validCurrentPosition) {
										viewValue = maskService.removeWrongPositions(viewValueWithDivisors);
										viewValueWithDivisors = viewValue.withDivisors(true);
										viewValueWithoutDivisors = viewValue.withoutDivisors(true);
									}
								}

								if (!options.limit) {
									viewValueWithDivisors = viewValue.withDivisors(false);
									viewValueWithoutDivisors = viewValue.withoutDivisors(false);
								}

								if (options.validate && controller.$dirty) {
									if (fullRegex.test(viewValueWithDivisors) || controller.$isEmpty(untouchedValue)) {
										controller.$setValidity('mask', true);
									} else {
										controller.$setValidity('mask', false);
									}
								}

								if(value !== viewValueWithDivisors){
									controller.$viewValue = angular.copy(viewValueWithDivisors);
									controller.$render();
								}
							} catch (e) {
								$log.error('[mask - parseViewValue]');
								throw e;
							}

							if (options.clean) {
								return viewValueWithoutDivisors;
							} else {
								return viewValueWithDivisors;
							}
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
