(function () {
  'use strict';

  angular
    .module('brew_journal.authentication.controllers')
    .controller('RegisterController', RegisterController);

  RegisterController.$inject = ['$scope', 'Authentication'];

  /**
  * @namespae LoginController
  */
  function RegisterController($scope, Authentication) {
    var ctrl = this;

    ctrl.register = register;

    /**
    * @name register
    * @desc Register a new user for the appliction
    * @memberOf brew_journal.authentication.controlleres.RegisterController
    */
    function register() {
      // Required inputs, never should be null
      var username         = ctrl.username;
      var password         = ctrl.password;
      var confirm_password = ctrl.confirm_password;
      // Optional inputs. Set to null if they don't exist or are null
      var email            = (!ctrl.email || ctrl.email.length === 0) ? '' : ctrl.email;
      var first_name       = (!ctrl.first_name || ctrl.first_name === 0) ? '' : ctrl.first_name;
      var last_name        = (!ctrl.last_name || ctrl.last_name === 0) ? '' : ctrl.last_name;
      Authentication.register(username, password, confirm_password, email, first_name, last_name).then(postRegister);
    }

    /**
    * @name postRegister
    * @desc Display an informative message to a suer if their registration fails
    */
    function postRegister() {
      var data = Authentication.getRegistrationResult();
      ctrl.error = (data.status !== 200);
      ctrl.message = data.data.message;
      ctrl.errors = data.data.errors;
    }
  }
})();