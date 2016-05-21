(function () {
  'use strict';

  angular
    .module('brew_journal.recipies.controllers')
    .controller('RecipeController', RecipeController);

  RecipeController.$inject = ['$scope', '$filter', 'Recipe'];

  /**
  * @namespace RecipeController
  */
  function RecipeController($scope, $filter, Recipe) {
    var ctrl = this;

    ctrl.onRecipeSelect = onRecipeSelect;
    ctrl.openBrewDatepicker = openBrewDatepicker;
    ctrl.addHop = addHop;
    ctrl.removeHop = removeHop;
    ctrl.addMalt = addMalt;
    ctrl.removeMalt = removeMalt;
    ctrl.clearForm = clearForm;
    ctrl.save = save;

    // Setup default loading recipe
    ctrl.recipes = [{id:null, name:'Loading...'}];
    ctrl.hops = [];
    ctrl.malts = [];
    ctrl.recipe_id = null;

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
      if(userRecipes.status === 204) {
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
        ctrl.recipe_id = selectedRecipeId;
        Recipe.retrieveRecipe(selectedRecipeId).then(loadRecipe);
      }
    }

    /**
     * @name openBrewDatepicker
     * @desc Open the data picker for the last brewed date.
     * @memberOf brew_journal.recipies.controllers.RecipeController
     */
    function openBrewDatepicker () {
      ctrl.datePickerIsOpen = true;
    }

    /**
     * @name loadRecipe
     * @desc Load recipe information.
     * @memberOf brew_journal.recipies.controllers.RecipeController
     */
    function loadRecipe(recipe) {
      console.log(recipe);
    }

    /**
     * @name addHop
     * @desc Add another set of inputs to add a hop to a recipe.
     * @memberOf brew_journal.recipies.controllers.RecipeController
     */
    function addHop(hopData) {
      hopData = (!hopData) ? {} : hopData;
      ctrl.hops.push(hopData);
    }

    /**
     * @name removeHop
     * @desc Remove a hop from the list.
     * @param {integer} index
     * The index of the hop to splice out.
     * @memberOf brew_journal.recipies.controllers.RecipeControllers
     */
    function removeHop(index) {
      ctrl.hops.splice(index, 1);
    }

    /**
     * @name addMalt
     * @desc Add another set of inputs to add a malt to a recipe.
     * @memberOf brew_journal.recipies.controllers.RecipeController
     */
    function addMalt(maltData) {
      maltData = (!maltData) ? {} : maltData;
      ctrl.malts.push(maltData);
    }

    /**
     * @name removeMalt
     * @desc Remove a malt from the list.
     * @param {integer} index
     * The index of the malt to splice out.
     * @memberOf brew_journal.recipies.controllers.RecipeControllers
     */
    function removeMalt(index) {
      ctrl.malts.splice(index, 1);
    }

    /**
     * @name clearForm
     * @desc Clear all form inputds
     * @memberOf brew_journal.recipies.controllers.RecipeControllers
     */
    function clearForm() {
      ctrl.hops = [];
      ctrl.malts = [];
      ctrl.recipe_notes = '';
      ctrl.last_brew_date = null;
      ctrl.recipe_style = null;
      ctrl.recipe_name = null;
      ctrl.recipe_id = null;
    }

    /**
     * @name save
     * @desc Save what has been placed into the form
     * @memberOf brew_journal.recipies.controllers.RecipeControllers
     */
    function save() {
      // Gather the recipe data.
      // TODO: Refactor to use a gather data function with form validation
      var recipe_data = {
        recipe_name:      ctrl.recipe_name,
        recipe_style:     ctrl.recipe_style,
        last_brew_date: $filter('date')(ctrl.last_brewed_date, 'yyyy-MM-dd'),
        recipe_notes:     ctrl.recipe_notes,
        recipe_hops:        ctrl.hops,
        recipe_malts:       ctrl.malts
      };
      Recipe.saveRecipe(ctrl.recipe_id, recipe_data).then(onSaveRecipeResponse);
    }

    /**
     * @name onSaveRecipeResponse
     * @desc Display any error messages to the user, or let them know that it saved successfully.
     * @memberOf brew_journal.recipies.controllers.RecipeControllers
     */
    function onSaveRecipeResponse() {
      var response = Recipe.getSaveRecipeResponse();
      console.log(response);
      Recipe.listRecipes().then(loadRecipeDropdown);
    }
  }
})();
