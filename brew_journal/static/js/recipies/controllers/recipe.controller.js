(function () {
  'use strict';

  angular
    .module('brew_journal.recipies.controllers')
    .controller('RecipeController', RecipeController);

  RecipeController.$inject = ['$scope', 'Recipe'];

  /**
  * @namespace RecipeController
  */
  function RecipeController($scope, Recipe) {
    var ctrl = this;

    ctrl.onRecipeSelect = onRecipeSelect;
    ctrl.openBrewDatepicker = openBrewDatepicker;

    // Setup default loading recipe
    ctrl.recipes = [{id:null, name:'Loading...'}]; 

    ctrl.datePickerIsOpen = false;
    ctrl.last_brewed_date = new Date();
    
    // Activate the page
    activate();

    /**
     * @name activate
     * @desc activate the page
     * @memberOf brew_journal.recipies.controllers.RecipeController
     */
    function activate() {
      Recipe.listRecipes().then(loadRecipeDropdown);
    }

    /**
     * @name loadRecipeDropdown
     * @desc Load the recipe results, indicating if there are none.
     * @memberOf brew_journal.recipies.controllers.RecipeController
     */
    function loadRecipeDropdown() {
      var userRecipes = Recipe.getListRecipesResponse();
      // 204 status indicates there was no content
      if(userRecipes.status = 204) {
        ctrl.recipes = [{id:null, name: "No Recipes"}];
        ctrl.selectedRecipe = ctrl.recipes[0];
      } else {
        ctrl.recipes = userRecipes.data;
      }
    }

    /** 
     * @name onRecipeSelect
     * @desc As long as the id isn't null, pull recipe data
     * @memberOf brew_journal.recipies.controllers.RecipeController
     */ 
    function onRecipeSelect (selectedRecipeId) {
      if(selectedRecipeId !== null) {
        Recipe.retrieveRecipe(selectedRecipeId).then(loadRecipe);
      }
    }

    function openBrewDatepicker () {
      ctrl.datePickerIsOpen = true;
      console.log(ctrl.datePickerIsOpen);
    }

    /**
     * @name loadRecipe
     * @desc Load recipe information.
     * @memberOf brew_journal.recipies.controllers.RecipeController
     */
    function loadRecipe(recipe) {
      console.log(recipe);
    }
  }
})();
