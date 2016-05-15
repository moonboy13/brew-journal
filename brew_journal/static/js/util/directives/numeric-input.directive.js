(function () { 
  'use strict'

  angular
    .module('brew_journal.util.directives')
    .directive('numericInput', NumericInput);

  function HopDirective() {
    return {
      require: 'ngModel',
      link: formatters
    };

    function formatters(scope, element, attrs, ngModel) {
      ngModel.$formatters.push(function(value) {
        return parseFloat(value, 10);
      }
    }
  }
})();
