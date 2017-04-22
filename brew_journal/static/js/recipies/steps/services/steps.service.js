/**
 * Steps
 * @namespace brew_journal.steps.service
 */
(function () {
    'use strict';

    angular
        .module('brew_journal.recipies.steps.services')
        .factory('Steps', Steps);

    Steps.$inject = ['$http'];

    /**
     * @namespace Steps
     * @return {Factory}
     */
    function Steps($http) {
        /**
         * @name Steps
         * @desc The Factory to be returned to handle steps
         */
        var Steps = {
            listRecipeSteps: listRecipeSteps,
            saveRecipeSteps: saveRecipeSteps
        };

        return Steps;

        /**
         * @name listRecipeSteps
         * @desc Retrieve the list of steps for a particular recipe
         * @param {int} Id of the recipe whose steps are to be retrieved
         * @returns {Promise}
         * @memberOf brew_journal.recipies.steps.services.Steps
         */
        function listRecipeSteps(recipeId) {
            var url = "/api/v1/recipe/" + Number(recipeId) + "/step/";
            return $http.get(url);
        };

        /**
         * @name saveRecipeSteps
         * @desc Retrieve the list of steps for a particular recipe
         * @param {int} Id of the recipe whose steps are to be retrieved
         * @param {Array} Array of data objects describing each step
         * @returns {Promise}
         * @memberOf brew_journal.recipies.steps.services.Steps
         */
         function saveRecipeSteps(recipeId, stepsData) {
             var url = "/api/v1/recipe/" + Number(recipeId) + "/step/"
             return $http.post(url, stepsData);
         };
    }
})();
