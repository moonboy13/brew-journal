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
        $routeProvider.when('/view/register', {
            controller:   'RegisterController',
            controllerAs: 'ctrl',
            templateUrl:  '/static/templates/authentication/register.html'
        }).when('/view/login', {
            controller:   'LoginController',
            controllerAs: 'ctrl',
            templateUrl:  '/static/templates/authentication/login.html'
        }).when('/view/recipe', {
            controller:   'RecipeController',
            controllerAs: 'ctrl',
            templateUrl:  '/static/templates/recipies/recipe.html'
        }).when('/view/steps', {
            controller:   'StepsController',
            controllerAs: 'ctrl',
            templateUrl:  '/static/templates/recipies/steps/steps.html'
        }).otherwise('/view/login');
    }
})();
