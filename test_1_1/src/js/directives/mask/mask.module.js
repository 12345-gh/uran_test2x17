'use strict';

import maskDirective from './mask.directive';
import './mask.scss';

const maskModule = angular.module('mask.module', []);

maskModule
  .directive('mask', maskDirective);

export default maskModule;