(function () {
    'use strict';

    angular
        .module('brew_journal.routes')
        .config(config)
        .run(["$rootScope", "$location", function($rootScope, $location){
            $rootScope.$on("$routeChangeStart", function (evt, to, from) {
                if(to.$$route.authorize === true) {
                    to.$$route.resolve = to.$$route.resolve || {};
                    if(!to.$$route.resolve.authorizationResolver) {
                        to.$$route.resolve.authorizationResolver = ["Authentication", function(Authentication) {
                            return Authentication.checkAuthentication();
                        }];
                    }
                }
            });

            $rootScope.$on("$routeChangeError", function(evt, to, from, error) {
                if (error.message && error.message === "Forbidden") {
                    $location.path("/view/login");
                }
            });
        }]);

    config.$inject = ['$routeProvider'];

    /**
     * @name config
     * @desc Define valid application routes
     */
    function config($routeProvider, Authentication) {
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
            templateUrl:  '/static/templates/recipies/recipe.html',
            authorize: true
        }).when('/view/steps', {
            controller:   'StepsController',
            controllerAs: 'ctrl',
            templateUrl:  '/static/templates/recipies/steps/steps.html',
            authorize: true
        }).otherwise('/view/login');
    }
})();
