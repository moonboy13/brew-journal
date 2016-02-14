(function () {
  'use strict';

  angular
    .module('brew_journal.authentication.controllers')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['$location', '$scope', 'Authentication'];

  /**
  * @namespace LoginController
  */
  function LoginController($location, $scope, Authentication) {
    var vm = this;

    vm.login = login;

    activate();

    /**
    * @name activate
    * @desc Actions to be performed when this controller is instanciated
    * @memberOf brew_journal.authentication.controllers.LoginController
    */
    function activate() {
      if (Authentication.isAuthenticated()) {
        $location.url('/');
      }
    }

    /**
    * @name login
    * @desc Attempt to log a user in
    * @memberOf brew_journal.authentication.controllers.LoginController
    */
    function login() {
      Authentication.login(vm.email, vm.password).then(showLoginResult);
    }

    /**
    * @name showLoginResult
    * @desc Report to the user the results of their login action
    * @memberOf brew_journal.authentication.controllers.LoginController
    */
    function showLoginResult() {
      vm.error = !Authentication.isAuthenticated();
      // Using a variable so that if I decide to make a dynamic error message
      // later it'll be easier.
      vm.loginErrorMessage = "Username/password not recognized. Please veryify credentials and try again.";
    }
  }
})();