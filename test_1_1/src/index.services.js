'use strict';

const indexServices = angular.module('index.services', []);

import MaskService from './js/services/mask.service';
import ArrayService from './js/services/array.service';

MaskService(indexServices);
ArrayService(indexServices);

export default indexServices;
