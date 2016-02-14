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
    var vm = this;

    vm.register = register;

    /**
    * @name register
    * @desc Register a new user for the appliction
    * @memberOf brew_journal.authentication.controlleres.RegisterController
    */
    function register() {
      // Required inputs, never should be null
      var username         = vm.username;
      var password         = vm.password;
      var confirm_password = vm.confirm_password;
      // Optional inputs. Set to null if they don't exist or are null
      var email            = (!vm.email || vm.email.length === 0) ? '' : vm.email;
      var first_name       = (!vm.first_name || vm.first_name === 0) ? '' : vm.first_name;
      var last_name        = (!vm.last_name || vm.last_name === 0) ? '' : vm.last_name;
      Authentication.register(username, password, confirm_password, email, first_name, last_name).then(postRegister);
    }

    /**
    * @name postRegister
    * @desc Display an informative message to a suer if their registration fails
    */
    function postRegister() {
      var data = Authentication.getRegistrationResult();
      vm.error = (data.status !== 200);
      vm.message = data.data.message;
      vm.errors = data.data.errors;
    }
  }
})();