'use strict';

import MaskService from './js/services/mask.service';
import ArrayService from './js/services/array.service';

export default angular.module('index.services', [
	MaskService.name,
	ArrayService.name,
]);
