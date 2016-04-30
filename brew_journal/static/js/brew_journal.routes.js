(function () {
  'use strict';

  angular
    .module('brew_journal.routes')
    .config(config);

  config.$inject = ['$routeProvider'];

  /**
  * @name config
  * @desc Define valid application routes
  */
  function config($routeProvider) {
    $routeProvider.when('/register', {
      controller:   'RegisterController',
      controllerAs: 'ctrl',
      templateUrl:  '/static/templates/authentication/register.html'
    }).when('/login', {
      controller:   'LoginController',
      controllerAs: 'ctrl',
      templateUrl:  '/static/templates/authentication/login.html'
    }).when('/recipe', {
      controller:   'RecipeController',
      controllerAs: 'ctrl',
      templateUrl:  '/static/templates/recipies/recipe.html'
    }).otherwise('/');
  }
})();
