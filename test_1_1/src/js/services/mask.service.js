'use strict';


class MaskService {
	constructor($q, ArrayService) {
		"ngInject";
		/* jshint validthis: true, node:true */
		this.$q = $q;
		this.ArrayService = ArrayService;
	}

	getOptionals(mask) {
		let indexes = [];
		let optionalsRelativeMaskWithoutOptionals = (optionals) => {
			let indexes = [];
			for (let i = 0; i < optionals.length; i++) {
				indexes.push(optionals[i] - i);
			}
			return indexes;
		};

		try {
			let regexp = /\?/g;
			let match = [];

			while ((match = regexp.exec(mask)) !== null) {
				indexes.push((match.index - 1));
			}
		} catch (e) {
			throw e;
		}

		return {
			fromMask: () => {
				return indexes;
			},
			fromMaskWithoutOptionals: () => {
				return optionalsRelativeMaskWithoutOptionals(indexes);
			}
		};
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

	create() {
		let optionals = this.getOptionals;
		let remOptionals = this.removeOptionals;
		let _$q = this.$q;
		let _ArrayService = this.ArrayService;
		let options;
		let maskWithoutOptionals;
		let maskWithoutOptionalsLength = 0;
		let maskWithoutOptionalsAndDivisorsLength = 0;
		let optionalIndexes = [];
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

		let generateIntermetiateElementRegex = (i, forceOptional) => {
			let charRegex;
			let hasOptional;
			try {
				let element = maskWithoutOptionals[i];
				let elementRegex = patterns[element];
				hasOptional = isOptional(i);

				if (elementRegex) {
					charRegex = '(' + elementRegex.source + ')';
				} else {
					if (!isDivisor(i)) {
						divisors.push(i);
						divisorElements[i] = element;
					}

					charRegex = '(' + '\\' + element + ')';
				}
			} catch (e) {
				throw e;
			}

			if (hasOptional || forceOptional) {
				charRegex += '?';
			}

			return new RegExp(charRegex);
		};

		let generateIntermetiateRegex = (i, forceOptional) => {
			let elementRegex;
			let elementOptionalRegex;
			try {
				let intermetiateElementRegex = generateIntermetiateElementRegex(i, forceOptional);
				elementRegex = intermetiateElementRegex;

				let hasOptional = isOptional(i);
				let currentRegex = intermetiateElementRegex.source;

				if (hasOptional && ((i + 1) < maskWithoutOptionalsLength)) {
					let intermetiateRegex = generateIntermetiateRegex((i + 1), true).elementOptionalRegex();
					currentRegex += intermetiateRegex.source;
				}

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
				let mask = opts.mask;
				let repeat = opts.repeat;

				if (!mask) {
					return;
				}

				if (repeat) {
					mask = Array((parseInt(repeat) + 1)).join(mask);
				}

				optionalIndexes = optionals(mask).fromMaskWithoutOptionals();
				options.maskWithoutOptionals = maskWithoutOptionals = remOptionals(mask);
				maskWithoutOptionalsLength = maskWithoutOptionals.length;

				let cumulativeRegex;
				for (let i = 0; i < maskWithoutOptionalsLength; i++) {
					let charRegex = generateIntermetiateRegex(i);
					let elementRegex = charRegex.elementRegex();
					let elementOptionalRegex = charRegex.elementOptionalRegex();

					let newRegex = cumulativeRegex ? cumulativeRegex.source + elementOptionalRegex.source : elementOptionalRegex.source;
					newRegex = new RegExp(newRegex);
					cumulativeRegex = cumulativeRegex ? cumulativeRegex.source + elementRegex.source : elementRegex.source;
					cumulativeRegex = new RegExp(cumulativeRegex);

					regex.push(newRegex);
				}

				generateOptionalDivisors();
				maskWithoutOptionalsAndDivisorsLength = removeDivisors(maskWithoutOptionals).length;

				deferred.resolve({
					options: options,
					divisors: divisors,
					divisorElements: divisorElements,
					optionalIndexes: optionalIndexes,
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

		let isOptional = (currentPos) => {
			return _ArrayService.inArray(currentPos, optionalIndexes);
		};

		let isDivisor = (currentPos) => {
			return _ArrayService.inArray(currentPos, divisors);
		};

		let generateOptionalDivisors = () => {
			let sortNumber = (a, b) => {
				return a - b;
			};

			let sortedDivisors = divisors.sort(sortNumber);
			let sortedOptionals = optionalIndexes.sort(sortNumber);
			for (let i = 0; i < sortedDivisors.length; i++) {
				let divisor = sortedDivisors[i];
				for (let j = 1; j <= sortedOptionals.length; j++) {
					let optional = sortedOptionals[(j - 1)];
					if (optional >= divisor) {
						break;
					}

					if (optionalDivisors[divisor]) {
						optionalDivisors[divisor] = optionalDivisors[divisor].concat(divisor - j);
					} else {
						optionalDivisors[divisor] = [(divisor - j)];
					}

					divisorElements[(divisor - j)] = divisorElements[divisor];
				}
			}
		};

		let removeDivisors = (value) => {
			value = value.toString();
			try {
				if (divisors.length > 0 && value) {
					let keys = Object.keys(divisorElements);
					let elments = [];

					for (let i = keys.length - 1; i >= 0; i--) {
						let divisor = divisorElements[keys[i]];
						if (divisor) {
							elments.push(divisor);
						}
					}

					elments = _ArrayService.uniqueArray(elments);

					let regex = new RegExp(('[' + '\\' + elments.join('\\') + ']'), 'g');
					return value.replace(regex, '');
				} else {
					return value;
				}
			} catch (e) {
				throw e;
			}
		};

		let insertDivisors = (array, combination) => {
			let insert = (array, output) => {
				let out = output;
				for (let i = 0; i < array.length; i++) {
					let divisor = array[i];
					if (divisor < out.length) {
						out.splice(divisor, 0, divisorElements[divisor]);
					}
				}
				return out;
			};

			let output = array;
			let divs = divisors.filter(it => {
				let optionalDivisorsKeys = Object.keys(optionalDivisors).map(it => {
					return parseInt(it);
				});

				return !_ArrayService.inArray(it, combination) && !_ArrayService.inArray(it, optionalDivisorsKeys);
			});

			if (!angular.isArray(array) || !angular.isArray(combination)) {
				return output;
			}

			output = insert(divs, output);
			output = insert(combination, output);
			return output;
		};

		let tryDivisorConfiguration = (value) => {
			let output = value.split('');
			let defaultDivisors = true;

			if (optionalIndexes.length > 0) {
				let lazyArguments = [];
				let optionalDivisorsKeys = Object.keys(optionalDivisors);

				for (let i = 0; i < optionalDivisorsKeys.length; i++) {
					let val = optionalDivisors[optionalDivisorsKeys[i]];
					lazyArguments.push(val);
				}

				if (optionalDivisorsCombinations.length === 0) {
					_ArrayService.lazyProduct(lazyArguments, () => {
						optionalDivisorsCombinations.push(Array.prototype.slice.call(arguments));
					});
				}

				for (let i = optionalDivisorsCombinations.length - 1; i >= 0; i--) {
					let outputClone = angular.copy(output);
					outputClone = insertDivisors(outputClone, optionalDivisorsCombinations[i]);

					let viewValueWithDivisors = outputClone.join('');
					let regex = getRegex(maskWithoutOptionals.length - 1);

					if (regex.test(viewValueWithDivisors)) {
						defaultDivisors = false;
						output = outputClone;
						break;
					}
				}
			}

			if (defaultDivisors) {
				output = insertDivisors(output, divisors);
			}

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
					withDivisors: (capped) => {
						if (capped) {
							return output.substr(0, maskWithoutOptionalsLength);
						} else {
							return output;
						}
					},
					withoutDivisors: (capped) => {
						if (capped) {
							return outputWithoutDivisors.substr(0, maskWithoutOptionalsAndDivisorsLength);
						} else {
							return outputWithoutDivisors;
						}
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

			for (let i = 0; i < wrongPositions.length; i++) {
				let wrongPosition = wrongPositions[i];
				let viewValueArray = viewValueWithDivisors.split('');
				viewValueArray.splice(wrongPosition, 1);
				newViewValue = viewValueArray.join('');
			}

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