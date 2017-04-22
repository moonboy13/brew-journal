(function () {
  'use strict'

  angular
    .module('brew_journal.recipies.steps.directives')
    .directive('step', StepDirective);

  function StepDirective() {
    return {
      restrict: 'E',
      templateUrl: '/static/templates/recipies/steps/step.html',
      replace: true
    };
  }
})();
