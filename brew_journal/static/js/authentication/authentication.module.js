(function () {
  'use strict';

  // Register the authentication module and inject the controllers and services
  // for this module
  angular
    .module('brew_journal.authentication', [
      'brew_journal.authentication.controllers',
      'brew_journal.authentication.services'
    ]);

  // Handle the dependancy injection for sub-modules
  angular
    .module('brew_journal.authentication.controllers', []);

  angular
    .module('brew_journal.authentication.services', ['ngCookies']);
})();