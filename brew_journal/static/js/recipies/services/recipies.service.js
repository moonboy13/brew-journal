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
      getListRecipesResponse: getListRecipesResponse,
      retrieveRecipe:         retrieveRecipe,
      getListRecipesResponse: getListRecipesResponse
    };

    return Recipe;

    ////////////////

    /**
    * @name listRecipesResponse
    * @desc Hold the results of the get recipes call
    */
    var listRecipesResponse = {};

    /**
    * @name setListRecipesResponse
    * @desc Set the response data from the list recipes call
    * @param {object} The response data
    */
    function setListRecipesResponse(data) {
      listRecipesResponse = data;
    }

    /**
    * @name getListRecipesResponse
    * @desc Return whatever is stored in the variable
    * @returns {Object}
    * @memberOf brew_journal.recipies.services.Recipe
    */
    function getListRecipesResponse() {
      return listRecipesResponse;
    }

    /**
    * @name retrieveRecipesResponse
    * @desc Hold the response from retrieving a specific recipe
    */
    var retrieveRecipesResponse = {};

    /**
    * @name setListRecipesResponse
    * @desc Set the response data from the list recipes call
    * @param {object} The response data
    */
    function setRetrieveRecipesResponse(data) {
      retrieveRecipesResponse = data;
    }

    /**
    * @name getRetrieveRecipesResponse
    * @desc Return whatever is stored in the variable
    * @returns {Object}
    * @memberOf brew_journal.recipies.services.Recipe
    */
    function getRetrieveRecipesResponse() {
      return retrieveRecipesResponse;
    }

    ////////////////

    /**
    * @name listRecipes
    * @desc List all available recipies for a particular user
    * @returns {Promise}
    * @memberOf brew_journal.recipies.services.Recipe
    */
    function listRecipes() {
      return $http.get('/api/v1/recipe/').then(listRecipesResponse, listRecipesResponse);
    }

    /**
    * @name listRecipesResponse
    * @desc Whether its a failure or success, this data will need to be translated over to the UI.
    * @desc Therefore, each will just set a variable that is reachable by the controller.
    */
    function listRecipesResponse(data, status, headers, config) {
      setListRecipesResponse(data);
    }

    /**
    * @name retrieveRecipe
    * @desc Retrieve information about a specific recipe.
    * @returns {Promise}
    * @memberOf brew_journal.recipies.services.Recipe
    */
    function retrieveRecipe(id) {
      var url = '/api/v1/recipe/' + id + '/';
      return $http.get(url).then(retrieveRecipeReponse, retrieveRecipeReponse);
    }

    /**
    * @name retrieveRecipeResponse
    * @desc Set the return data for later retrieval by the controller
    */
    function retrieveRecipeResponse(data, status, headers, config) {
      setRetrieveRecipeResponse(data);
    }

    /**
    * @name deleteRecipe
    * @desc Delete a recipe
    */
  }
})();