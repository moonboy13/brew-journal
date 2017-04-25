(function () {
  'use strict';

  angular
    .module('brew_journal.recipies.controllers')
    .controller('RecipeController', RecipeController);

  RecipeController.$inject = ['$scope', '$filter', '$location', 'Recipe', 'Authentication', 'messageCenterService'];

  /**
  * @namespace RecipeController
  */
  function RecipeController($scope, $filter, $location, Recipe, Authentication, messageCenterService) {
    var ctrl = this;

    ctrl.activate = activate;
    ctrl.onRecipeSelect = onRecipeSelect;
    ctrl.openBrewDatepicker = openBrewDatepicker;
    ctrl.addHop = addHop;
    ctrl.removeHop = removeHop;
    ctrl.addMalt = addMalt;
    ctrl.removeMalt = removeMalt;
    ctrl.clearForm = clearForm;
    ctrl.deleteRecipe = deleteRecipe;
    ctrl.save = save;
    ctrl.setRecipeData = setRecipeData;

    // Setup default loading recipe
    ctrl.recipes = [{id:null, name:'Loading...'}];
    ctrl.selectedRecipe = null;
    ctrl.hops = [];
    ctrl.malts = [];
    ctrl.recipe_id = null;

    ctrl.datePickerIsOpen = false;
    ctrl.last_brew_date = new Date();

    // Activate the page
    activate();

    /**
     * @name activate
     * @desc activate the page
     * @param none
     * @memberOf brew_journal.recipies.controllers.RecipeController
     */
    function activate() {
      Recipe.listRecipes().then(loadRecipeDropdown);
    }

    /**
     * @name deleteRecipe
     * @desc Delete the selected recipe from the dropdown
     * @param {int} The id of the recipe to delete
     * @memberOf brew_journal.recipies.controllers.RecipeController
     */ 
    function deleteRecipe(recipe_id) {
      Recipe.deleteRecipe(recipe_id).then(onDeleteRecipeResponse);
    }

    /**
     * @name onDeleteRecipeResponse
     * @desc Handle the response message from the delete action
     * @param {Object} The response object.
     * @memberOf brew_journal.recipies.controllers.RecipeController
     */
    function onDeleteRecipeResponse(response) {
      if(response.status == 404) {
        messageCenterService.add('danger', 'Recipe has already been deleted', {timeout: 3000});
      }
      clearForm();
    }

    /**
     * @name loadRecipeDropdown
     * @desc Load the recipe results, indicating if there are none.
     * @param {Array} Recipe identification information
     * @memberOf brew_journal.recipies.controllers.RecipeController
     */
    function loadRecipeDropdown(userRecipes) {
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
     * @param {int} Id of the selected recipe to load
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
     * @desc Handle the response from the retrieve recipe backend call.
     * @param {Object} Response object from the AJAX call
     * @memberOf brew_journal.recipies.controllers.RecipeController
     */
     function loadRecipe(response) {
      if(response.status === 200) {
        setRecipeData(response.data);
      } else {
        messageCenterService.add('warn', "There was an error loading the recipe, please try again.", {timeout: 1000});
      }
    }

    /**
     * @name setRecipeData
     * @desc Load recipe data into the UI
     * @param {Object} Recipe information to load up
     * @memberOf brew_journal.recipies.controllers.RecipeController
     */
     function setRecipeData(recipe_data) {
      var i;
      ctrl.recipe_name    = recipe_data.recipe_name;
      ctrl.recipe_style   = recipe_data.recipe_style;
      ctrl.last_brew_date = new Date(recipe_data.last_brew_date);
      ctrl.recipe_notes   = recipe_data.recipe_notes;
      for (i = 0; i < recipe_data.recipe_hops.length; i++) {
        addHop(recipe_data.recipe_hops[i]);
      }
      for (i = 0; i < recipe_data.recipe_malts.length; i++) {
        addMalt(recipe_data.recipe_malts[i]);
      }
     }

    /**
     * @name addHop
     * @desc Add another set of inputs to add a hop to a recipe.
     * @param {Object} optional object of hop information
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
     * @param {Object} Optional object of malt data to load
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
      ctrl.selectedRecipe = null;
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
        last_brew_date: $filter('date')(ctrl.last_brew_date, 'yyyy-MM-dd'),
        recipe_notes:     ctrl.recipe_notes,
        recipe_hops:        ctrl.hops,
        recipe_malts:       ctrl.malts
      };
      Recipe.saveRecipe(ctrl.recipe_id, recipe_data).then(onSaveRecipeResponse);
    }

    /**
     * @name onSaveRecipeResponse
     * @desc Display any error messages to the user, or let them know that it saved successfully.
     * @param {Object} response object from the backend
     * @memberOf brew_journal.recipies.controllers.RecipeControllers
     */
    function onSaveRecipeResponse(response) {
      messageCenterService.add('success', "Your recipe has been saved", {timeout: 3000});
      Recipe.listRecipes().then(loadRecipeDropdown);
    }
  }
})();
