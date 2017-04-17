(function () {
    'use strict';

    angular
        .module('brew_journal.recipies.steps.controllers')
        .controller('StepsController', StepsController);

    StepsController.$inject = ['$scope', '$location', 'Steps', 'Authentication', 'Recipe'];

    /**
    * @namespace StepsController
    */
    function StepsController($scope, $location, Steps, Authentication, Recipe) {
        var ctrl = this;

        // Controller variables
        ctrl.steps = [];

        // Controller function references, this makes the function public.
        ctrl.activate = activate;
        ctrl.clearSteps = clearSteps;
        ctrl.removeStep = removeStep;

        // Activate the page
        activate();

        /**
         * @name activate
         * @desc activate the page
         * @param none
         * @memberOf brew_journal.recipies.steps.controllers.StepsController
         */
        function activate() {
          // Ensure there is an active user session
          if(!Authentication.isAuthenticated()) {
            $location.url('/view/login');
          } else {
            Recipe.listRecipes().then(loadRecipeDropdown);
          }
        }

        /**
         * @name clearSteps
         * @desc Clear all steps from the UI
         * @param none
         * @memberOf brew_journal.recipies.steps.controllers.StepsController
         */
         function clearSteps() {
             ctrl.steps = [];
         }

         /**
         * @name removeStep
         * @desc Remove a particular step from the UI, re-numbering all remaining steps
         * @param {integer} index
         * Index of the step to remove
         * @memberOf brew_journal.recipies.steps.controllers.StepsController
         */
         function removeStep(index) {
             ctrl.steps.splice(index, 1);
             for(var i=1; i <= ctrl.steps.length; i++) {
                 ctrl.steps[(i-1)].step_order = i;
             }
         }
    }
})();
