'use strict';


class MaskService {
	constructor($q) {
		"ngInject";
		/* jshint validthis: true, node:true */
		this.$q = $q;
	}

	removeOptionals(mask) {
		let newMask;

		try {
			newMask = mask.replace(/\?/g, '');
		} catch (e) {
			throw e;
		}

		return newMask;
	}

	uniqueArray(array) {
		let u = {};
		let a = [];

		for (let i = 0, l = array.length; i < l; ++i) {
			if (u.hasOwnProperty(array[i])) {
				continue;
			}

			a.push(array[i]);
			u[array[i]] = 1;
		}

		return a;
	}

	create() {
		let remOptionals = this.removeOptionals;
		let uniqueArray = this.uniqueArray;
		let _$q = this.$q;
		let options;
		let maskWithoutOptionals;
		let maskWithoutOptionalsLength = 0;
		let maskWithoutOptionalsAndDivisorsLength = 0;
		let optionalDivisors = {};
		let optionalDivisorsCombinations = [];
		let divisors = [];
		let divisorElements = {};
		let regex = [];
		let patterns = {
			'9': /[0-9]/,
			'8': /[0-8]/,
			'7': /[0-7]/,
			'6': /[0-6]/,
			'5': /[0-5]/,
			'4': /[0-4]/,
			'3': /[0-3]/,
			'2': /[0-2]/,
			'1': /[0-1]/,
			'0': /[0-9]/,
			'*': /./,
			'w': /\w/,
			'W': /\W/,
			'd': /\d/,
			'D': /\D/,
			's': /\s/,
			'S': /\S/,
			'b': /\b/,
			'A': /[A-Z]/,
			'a': /[a-z]/,
			'Z': /[A-Z]/,
			'z': /[a-z]/,
			'@': /[a-zA-Z]/,
			'#': /[a-zA-Z]/,
			'%': /[0-9a-zA-Z]/
		};

		let generateIntermetiateRegex = (i) => {
			let elementRegex;
			let elementOptionalRegex;
			try {
				let charBaseRegex;
				let elementBase = maskWithoutOptionals[i];
				let elementBaseRegex = patterns[elementBase];
				charBaseRegex = elementBaseRegex ? '(' + elementBaseRegex.source + ')' : '(' + '\\' + elementBase + ')';

				if (!elementBaseRegex && (divisors.indexOf(i) === -1)) {
					divisors.push(i);
					divisorElements[i] = elementBase;
				}

				let intermetiateElementRegex = new RegExp(charBaseRegex);
				elementRegex = intermetiateElementRegex;
				let currentRegex = intermetiateElementRegex.source;
				elementOptionalRegex = new RegExp(currentRegex);
			} catch (e) {
				throw e;
			}
			return {
				elementRegex: () => {
					return elementRegex;
				},
				elementOptionalRegex: () => {
					return elementOptionalRegex;
				}
			};
		};

		let generateRegex = (opts) => {
			let deferred = _$q.defer();
			options = opts;

			try {
				if (!opts.mask) {
					return;
				}
				let mask = opts.mask;

				options.maskWithoutOptionals = maskWithoutOptionals = remOptionals(mask);
				maskWithoutOptionalsLength = maskWithoutOptionals.length;

				let cumulativeRegex;

				maskWithoutOptionals.split('').forEach((element, index) => {
					let charRegex = generateIntermetiateRegex(index);
					let elementRegex = charRegex.elementRegex();
					let elementOptionalRegex = charRegex.elementOptionalRegex();

					let newRegex = cumulativeRegex ? cumulativeRegex.source + elementOptionalRegex.source : elementOptionalRegex.source;
					newRegex = new RegExp(newRegex);
					cumulativeRegex = cumulativeRegex ? cumulativeRegex.source + elementRegex.source : elementRegex.source;
					cumulativeRegex = new RegExp(cumulativeRegex);

					regex.push(newRegex);
				});

				maskWithoutOptionalsAndDivisorsLength = removeDivisors(maskWithoutOptionals).length;

				deferred.resolve({
					options: options,
					divisors: divisors,
					divisorElements: divisorElements,
					optionalDivisors: optionalDivisors,
					optionalDivisorsCombinations: optionalDivisorsCombinations
				});
			} catch (e) {
				deferred.reject(e);
				throw e;
			}

			return deferred.promise;
		};

		let getRegex = (index) => {
			let currentRegex;

			try {
				currentRegex = regex[index] ? regex[index].source : '';
			} catch (e) {
				throw e;
			}

			return (new RegExp('^' + currentRegex + '$'));
		};

		let removeDivisors = (value) => {
			value = value.toString();
			try {
				if (divisors.length > 0 && value) {
					let keys = Object.keys(divisorElements);
					let elments = [];

					keys.reverse().forEach(key => {
						let divisor = divisorElements[key];
						if (divisor) {
							elments.push(divisor);
						}
					});

					elments = uniqueArray(elments);

					let regex = new RegExp(('[' + '\\' + elments.join('\\') + ']'), 'g');
					return value.replace(regex, '');
				} else {
					return value;
				}
			} catch (e) {
				throw e;
			}
		};

		let insertOneDivisor = (array, output) => {
			let out = output;
			array.forEach(item => {
				let divisor = item;
				if (divisor < out.length) {
					out.splice(divisor, 0, divisorElements[divisor]);
				}
			});
			return out;
		};

		let insertDivisors = (array, combination) => {
			let output = array;
			let divs = divisors.filter(it => {
				let optionalDivisorsKeys = Object.keys(optionalDivisors).map(it => {
					return parseInt(it);
				});

				return ((combination.indexOf(it) === -1) && (optionalDivisorsKeys.indexOf(it) === -1));
			});

			if (!angular.isArray(array) || !angular.isArray(combination)) {
				return output;
			}

			output = insertOneDivisor(divs, output);
			output = insertOneDivisor(combination, output);
			return output;
		};

		let tryDivisorConfiguration = (value) => {
			let output = value.split('');
			output = insertDivisors(output, divisors);
			return output.join('');
		};

		let getOptions = () => {
			return options;
		};

		let getViewValue = (value) => {
			try {
				let outputWithoutDivisors = removeDivisors(value);
				let output = tryDivisorConfiguration(outputWithoutDivisors);

				return {
					withDivisors: () => {
						return output.substr(0, maskWithoutOptionalsLength);
					},
					withoutDivisors: () => {
						return outputWithoutDivisors.substr(0, maskWithoutOptionalsAndDivisorsLength);
					}
				};
			} catch (e) {
				throw e;
			}
		};

		let getWrongPositions = (viewValueWithDivisors, onlyFirst) => {
			let pos = [];

			if (!viewValueWithDivisors) {
				return 0;
			}

			for (let i = 0; i < viewValueWithDivisors.length; i++) {
				let pattern = getRegex(i);
				let value = viewValueWithDivisors.substr(0, (i + 1));

				if (pattern && !pattern.test(value)) {
					pos.push(i);

					if (onlyFirst) {
						break;
					}
				}
			}

			return pos;
		};

		let getFirstWrongPosition = (viewValueWithDivisors) => {
			return getWrongPositions(viewValueWithDivisors, true)[0];
		};

		let removeWrongPositions = (viewValueWithDivisors) => {
			let wrongPositions = getWrongPositions(viewValueWithDivisors, false);
			let newViewValue = viewValueWithDivisors;

			wrongPositions.forEach(wrongPosition => {
				let viewValueArray = viewValueWithDivisors.split('');
				viewValueArray.splice(wrongPosition, 1);
				newViewValue = viewValueArray.join('');
			});

			return getViewValue(newViewValue);
		};

		return {
			getViewValue: getViewValue,
			generateRegex: generateRegex,
			getRegex: getRegex,
			getOptions: getOptions,
			removeDivisors: removeDivisors,
			getFirstWrongPosition: getFirstWrongPosition,
			removeWrongPositions: removeWrongPositions
		};
	}

}


export default angular
	.module('mask.service', [])
	.service('MaskService', MaskService);