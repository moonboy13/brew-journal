/**
* Recipies
* @namespace brew_journal.recipies.services
*/
(function () {
  'use strict';

  angular
    .module('brew_journal.recipies.services')
    .factory('Recipe', Recipe);

  Recipe.$inject = ['$http'];

  /**
  * @namespace Recipies
  * @returns {Factory}
  */
  function Recipe($http) {
    /**
    * @name Recipe
    * @desc The Factory to be returned
    */
    var Recipe = {
      listRecipes:            listRecipes,
      retrieveRecipe:         retrieveRecipe,
      saveRecipe:             saveRecipe,
      deleteRecipe:           deleteRecipe
    };

    return Recipe;

    /**
    * @name listRecipes
    * @desc List all available recipies for a particular user
    * @returns {Promise}
    * @memberOf brew_journal.recipies.services.Recipe
    */
    function listRecipes() {
      return $http.get('/api/v1/recipe/');
    }

    /**
     * @name saveRecipe
     * @desc Either create or update recipe
     * @param {int} Optional recipe id to save. If ommited, a new recipe will be created
     * @param {Object} Recipe infrormation
     * @returns none
     * @memberOf brew_journal.recipies.services.Recipe
     */
    function saveRecipe(id, recipeData){
      var retPromise;
      if(id === null){
        retPromise = createRecipe(recipeData);
      } else {
        retPromise = updateRecipe(id, recipeData);
      }
      return retPromise;
    }

    /**
     * @name createRecipe
     * @desc Create a brand new recipe
     * @param {Object} New recipe information
     * @returns {Promise}
     * @memberOf brew_journal.recipies.services.Recipe
     */
    function createRecipe(recipeData) {
      var url = '/api/v1/recipe/';
      return $http.post(url, recipeData);
    }

    /**
     * @name updateRecipe
     * @desc Update an existing recipe
     * @param {int} Id of the recipe to update
     * @param {Object} Updated recipe information
     * @returns {Promise}
     * @memberOf brew_journal.recipies.services.Recipe
     */
    function updateRecipe(id, recipeData) {
      var url = '/api/v1/recipe/' + id + '/';
      return $http.put(url, recipeData);
    }

    /**
    * @name retrieveRecipe
    * @desc Retrieve information about a specific recipe.
    * @param {int} Id of the recipe to retrieve
    * @returns {Promise}
    * @memberOf brew_journal.recipies.services.Recipe
    */
    function retrieveRecipe(id) {
      var url = '/api/v1/recipe/' + id + '/';
      return $http.get(url);
    }

    /**
    * @name deleteRecipe
    * @desc Delete a recipe
    * @param {int} Id of the recipe to delete
    * @returns {Promise}
    * @memberOf brew_journal.recipes.services.Recipe
    */
    function deleteRecipe(id) {
      var url = '/api/v1/recipe/' + id + '/';
      return $http.delete(url);
    }
  }
})();
