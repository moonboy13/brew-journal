(function () {
  'use strict'

  angular
    .module('brew_journal.recipies.directives')
    .directive('hop', HopDirective);

  function HopDirective() {
    return {
      restrict: 'E',
      templateUrl: '/static/templates/recipies/hop.html',
      replace: true
    };
  }
})();
