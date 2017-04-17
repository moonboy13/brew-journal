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
        ctrl.loadStepsData = loadStepsData;

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
         * @name loadStepsData
         * @desc Load the steps information in the order as indicated by the step_order index
         * @param {Array} stepsData
         * Array of all the individual step information
         * @memberOf brew_journal.recipies.steps.controllers.StepsController
         */
         function loadStepsData(stepsData) {
            stepsData = (!stepsData) ? [] : stepsData;
            stepsData.sort(function(a,b){
                return a.step_order - b.step_order;
            });
            ctrl.steps = stepsData;
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
