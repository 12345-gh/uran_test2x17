'use strict';

class ArrayService {

	constructor() {

	}

	lazyProduct(sets, f, context) {
		if (!context) {
			context = this;
		}

		let p = [];
		let max = sets.length - 1;
		let lens = [];

		for (let i = sets.length; i--;) {
			lens[i] = sets[i].length;
		}

		function dive(d) {
			let a = sets[d];
			let len = lens[d];

			if (d === max) {
				for (let i = 0; i < len; ++i) {
					p[d] = a[i];
					f.apply(context, p);
				}
			} else {
				for (let i = 0; i < len; ++i) {
					p[d] = a[i];
					dive(d + 1);
				}
			}

			p.pop();
		}

		dive(0);
	}

	inArray(i, array) {
		let output;

		try {
			output = array.indexOf(i) > -1;
		} catch (e) {
			throw e;
		}

		return output;
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
}

export default angular
	.module('array.service', [])
	.service('ArrayService', ArrayService);
