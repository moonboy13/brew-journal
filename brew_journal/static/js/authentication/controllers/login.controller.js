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
    var ctrl = this;

    ctrl.login = login;

    activate();

    /**
    * @name activate
    * @desc Actions to be performed when this controller is instanciated
    * @memberOf brew_journal.authentication.controllers.LoginController
    */
    function activate() {
      var account = Authentication.getAuthenticatedAccount();
      if (Authentication.isAuthenticated()) {
        $location.path('/view/recipe');
      }
    }

    /**
    * @name login
    * @desc Attempt to log a user in
    * @memberOf brew_journal.authentication.controllers.LoginController
    */
    function login() {
      Authentication.login(ctrl.username, ctrl.password).then(showLoginResult);
    }

    /**
    * @name showLoginResult
    * @desc Report to the user the results of their login action
    * @memberOf brew_journal.authentication.controllers.LoginController
    */
    function showLoginResult() {
      ctrl.error = !Authentication.isAuthenticated();
      if(ctrl.error) {
        // Using a variable so that if I decide to make a dynamic error message
        // later it'll be easier.
        ctrl.loginErrorMessage = "Username/password not recognized. Please veryify credentials and try again.";
      } else {
        $location.path('/view/recipe');
      }
    }
  }
})();
