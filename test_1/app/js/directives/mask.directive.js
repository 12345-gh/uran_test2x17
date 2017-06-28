function maskDirective() {

	return {
		restrict: 'A',
		require: 'ngModel',
		link: ($scope, el, attrs, model) => {
			$scope.$watch(
				() => {
					return attrs.mask;
				},
				() => {
					debugger;
					if (model.$viewValue !== null) {
						model.$viewValue = formatByMask(String(model.$viewValue).replace(/\D/g, ''));
						el.val(model.$viewValue);
					}
				}
			);

			model.$formatters.push((value) => {
				debugger;
				return value === null ? '' : formatByMask(String(value).replace(/\D/g, ''));
			});

			model.$parsers.push((value) =>  {
				debugger;
				model.$viewValue = formatByMask(value);
				let modelValue = String(value).replace(/\D/g, '');
				el.val(model.$viewValue);
				return modelValue;
			});

			let formatByMask = (val) => {
				debugger;
				let format = attrs.mask,
					arrFormat = format.split('|');

				if (arrFormat.length > 1) {
					arrFormat.sort((a, b) => {
						return a.length - b.length;
					});
				}

				if (val === null || val == '') {
					return '';
				}
				let value = String(val).replace(/\D/g, '');
				if (arrFormat.length > 1) {
					for (let a in arrFormat) {
						if (value.replace(/\D/g, '').length <= arrFormat[a].replace(/\D/g, '').length) {
							format = arrFormat[a];
							break;
						}
					}
				}
				let newValue = '';
				for (let nmI = 0, mI = 0; mI < format.length;) {
					if (!value[nmI]) {
						break;
					}
					if (format[mI].match(/\D/)) {
						newValue += format[mI];
					} else {
						newValue += value[nmI];
						nmI++;
					}
					mI++;
				}
				return newValue;
			}
		}
	};

}

export default {
	name: 'mask',
	fn: maskDirective
};
