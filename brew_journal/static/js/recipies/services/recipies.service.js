/**
* Recipies
* @namespace brew_journal.recipies.services
*/
(function () {
  'use strict';

  angular
    .module('brew_journal.recipies.services')
    .factory('Recipe', Recipe);

  /**
  * @namespace Recipies
  * @returns {Factory}
  */
  function Recipe() {
    /**
    * @name Recipe
    * @desc The Factory to be returned
    */
    var Recipe = {};

    return Recipe;

    ////////////////
  }
})();