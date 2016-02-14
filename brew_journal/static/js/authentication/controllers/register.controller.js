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

    }
  }
})();