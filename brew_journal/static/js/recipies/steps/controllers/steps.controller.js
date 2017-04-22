(function () {
    'use strict';

    angular
        .module('brew_journal.recipies.steps.controllers')
        .controller('StepsController', StepsController);

    StepsController.$inject = ['$scope', '$location', 'Steps', 'Authentication', 'Recipe', 'messageCenterService'];

    /**
    * @namespace StepsController
    */
    function StepsController($scope, $location, Steps, Authentication, Recipe, messageCenterService) {
        var ctrl = this;

        // Controller variables
        ctrl.steps = [];
        ctrl.recipes = [{id:null, name:'Loading...'}];
        ctrl.recipe_id = null;

        // Controller function references, this makes the function public.
        ctrl.activate = activate;
        ctrl.clearForm = clearForm;
        ctrl.addStep = addStep;
        ctrl.removeStep = removeStep;
        ctrl.loadStepsData = loadStepsData;
        ctrl.saveRecipeSteps = saveRecipeSteps;
        ctrl.onRecipeSelect = onRecipeSelect;

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
            stepsData = (!stepsData.data || !Array.isArray(stepsData.data)) ? [] : stepsData.data;
            stepsData.sort(function(a,b){
                return a.step_order - b.step_order;
            });
            ctrl.steps = stepsData;
         }

         /**
         * @name addStep
         * @desc Add a single step to the UI
         * @param none
         * @memberOf brew_journal.recipies.steps.controllers.StepsController
         */
         function addStep() {
             ctrl.steps.push({
                step_order: (ctrl.steps.length + 1),
                step: ''
             });
         }


        /**
         * @name clearForm
         * @desc Clear all steps from the UI
         * @param none
         * @memberOf brew_journal.recipies.steps.controllers.StepsController
         */
         function clearForm() {
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

         /**
         * @name loadRecipeDropdown
         * @desc Load the recipe results, indicating if there are none.
         * @param {Array} Recipe identification information
         * @memberOf brew_journal.recipies.steps.controllers.RecipeController
         */
        function loadRecipeDropdown(userRecipes) {
          // 204 status indicates there was no content
          if(userRecipes.status === 204) {
            ctrl.recipes = [{id:null, name: "No Recipes"}];
            ctrl.recipe_id = null;
          } else {
            ctrl.recipes = userRecipes.data;
          }
        }

        /**
         * @name onRecipeSelect
         * @desc As long as the id isn't null, pull recipe data
         * @param {int} Id of the selected recipe to load
         * @memberOf brew_journal.recipies.controllers.RecipeController
         */
        function onRecipeSelect (selectedRecipeId) {
            if(selectedRecipeId !== null) {
                ctrl.recipe_id = selectedRecipeId;
                Steps.listRecipeSteps(selectedRecipeId).then(loadStepsData);
            }
        }


        /**
        * @name save
        * @desc Collect the UI data and save them steps.
        * @param none
        * @memberOf brew_journal.recipies.steps.controllers.StepsController
        */
        function saveRecipeSteps() {
            Steps.saveRecipeSteps(ctrl.recipe_id, ctrl.steps).then(handleSaveStepsResponse, handleSaveStepsResponse);
        }

        /**
        * @name handleSaveStepsResponse
        * @desc Handle the returned object from the save action
        * @param
        * @memberOf brew_journal.recipies.steps.controllers.StepsController
        */
        function handleSaveStepsResponse(responseObj) {
            if(responseObj.status == 201) {
                messageCenterService.add('success', "Your recipe steps have been updated.", {timeout: 3000});
            } else {
                messageCenterService.add('danger', "There was an error saving the recipe. Please try again.", {timeout: 3000});
            }
        }
    }
})();
