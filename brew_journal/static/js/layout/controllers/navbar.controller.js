/**
* NavbarController
* @namespace brew_journal.layout.controllers
*/
(function () {
  'use strict';

  angular
    .module('brew_journal.layout.controllers')
    .controller('NavbarController', NavbarController);

  NavbarController.$inject = ['$scope', 'Authentication'];

  /**
  * @namespace NavbarController
  */
  function NavbarController($scope, Authentication) {
    var vm = this;

    vm.logout = logout;

    /**
    * @name logout
    * @desc Log a user out of the application
    * @memberOf brew_journal.layout.controllers.NavbarController
    */
    function logout() {
      Authentication.logout();
    }
  }
})();