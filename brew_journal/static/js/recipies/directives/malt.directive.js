(function () {
  'use strict'

  angular
    .module('brew_journal.recipies.directives')
    .directive('malt', MaltDirective);

  function MaltDirective() {
    return {
      restrict: 'E',
      templateUrl: '/static/templates/recipies/malt.html',
      replace: true
    };
  }
})();
