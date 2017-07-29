describe('MaskService', () => {
	let service,
		maskService,
		$q,
		$rootScope;

	beforeEach(() => {
		angular.module('test', ['mainApp']);
		module('test');
	});

	beforeEach(() => {
		inject((MaskService, _$q_, _$rootScope_) => {
			service = MaskService;
			$q = _$q_;
			$rootScope = _$rootScope_;
		});
	});

	beforeEach(() => {
		maskService = service.create();
	});

	describe('function uniqueArray', () => {
		it('should return an array without duplicated elements', () => {
			let uniqueArray = service.uniqueArray(['1', 1, 2, 4, 4, 1, '2']);
			expect(uniqueArray).toEqual(['1',2,4]);
		});
	});

	describe('function removeOptionals', () => {
		it('should remove all ? char from mask', () => {
			let mask = service.removeOptionals('6?6?6?6?.555?.444?');
			// mask: 6666.555.444
			expect(mask).toEqual('6666.555.444');

			mask = service.removeOptionals('(99) 9?9999-9999');
			// mask: (99) 99999-9999
			expect(mask).toEqual('(99) 99999-9999');

			mask = service.removeOptionals('aaA*#@?aaA*#@?aaA*#@?');
			// mask: aaA*#@aaA*#@aaA*#@
			expect(mask).toEqual('aaA*#@aaA*#@aaA*#@');
		});
	});

	describe('create function', () => {
		it('should create new instance of maskService', () => {
			expect( maskService.generateRegex ).toBeDefined();
			expect( maskService.getOptions ).toBeDefined();
			expect( maskService.getViewValue ).toBeDefined();
			expect( maskService.getRegex ).toBeDefined();
			expect( maskService.removeDivisors ).toBeDefined();
			expect( maskService.getFirstWrongPosition ).toBeDefined();
			expect( maskService.removeWrongPositions ).toBeDefined();
		});
	});

	describe('generateRegex function', () => {
		it('should create regex, divisors, options, indexes - mask: 39/19/9999', () => {
			let promise = maskService.generateRegex({
				mask: '39/19/9999',
				// repeat mask expression n times
				repeat: undefined,
				// clean model value - without divisors
				clean: undefined,
				// default model value
				model: undefined,
				// default input value
				value: undefined
			});

			promise.then((fullOptions) => {
				let oneRegex = '([0-1])';
				let threeRegex = '([0-3])';
				let barRegex = '(\\/)';
				nineRegex = '([0-9])';
				expect( maskService.getRegex(0).source ).toBe('^' + threeRegex + '$');
				expect( maskService.getRegex(1).source ).toBe('^' + threeRegex + nineRegex + '$');
				expect( maskService.getRegex(2).source ).toBe('^' + threeRegex + nineRegex + barRegex + '$');
				expect( maskService.getRegex(3).source ).toBe('^' + threeRegex + nineRegex + barRegex + oneRegex + '$');
				expect( maskService.getRegex(4).source ).toBe('^' + threeRegex + nineRegex + barRegex + oneRegex + nineRegex + '$');
				expect( maskService.getRegex(5).source ).toBe('^' + threeRegex + nineRegex + barRegex + oneRegex + nineRegex + barRegex + '$');
				expect( maskService.getRegex(6).source ).toBe('^' + threeRegex + nineRegex + barRegex + oneRegex + nineRegex + barRegex + nineRegex + '$');

				expect( fullOptions.divisors ).toEqual([2, 5]);
				expect( fullOptions.divisorElements ).toEqual({
					'2': '/',
					'5': '/'
				});
				// expect( fullOptions.optionalIndexes ).toEqual([]);
				expect( fullOptions.optionalDivisors ).toEqual({});
				expect( fullOptions.optionalDivisorsCombinations ).toEqual([]);
			});

			// Propagate promise resolution to 'then' functions using $apply().
			$rootScope.$apply();
		});
	});

	describe('getOptions function', () => {
		it('should return options object passed to generateRegex', () => {
			maskService.generateRegex({
				mask: '9?.9?',
				// repeat mask expression n times
				repeat: undefined,
				// clean model value - without divisors
				clean: undefined,
				// default model value
				model: undefined,
				// default input value
				value: '9.9'
			});

			expect( maskService.getOptions() ).toBeDefined();
			expect( maskService.getOptions().mask ).toBe('9?.9?');
			expect( maskService.getOptions().repeat ).toBeUndefined();
			expect( maskService.getOptions().clean ).toBeUndefined();
			expect( maskService.getOptions().model ).toBeUndefined();
			expect( maskService.getOptions().value ).toBe('9.9');
			expect( maskService.getOptions().maskWithoutOptionals ).toBe('9.9');
		});
	});

	describe('removeDivisors function', () => {
		it('should return a string when a number is passed in', () => {
			expect(typeof maskService.removeDivisors(1234567890)).toBe('string');
		});
	});
});