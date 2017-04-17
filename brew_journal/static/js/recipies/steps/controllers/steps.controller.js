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

        // Controller function references
        ctrl.activate = activate;
        ctrl.clearSteps = clearSteps;

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
    }
})();
