(function () {
  'use strict';

  // Register the module and inject any needed controllers or services
  angular
    .module('brew_journal.recipies', [
      'brew_journal.recipies.controllers',
      'brew_journal.recipies.services',
      'brew_journal.recipies.directives'
    ]);

  // Handle dependancy injection for controllers and services
  angular
    .module('brew_journal.recipies.controllers', []);

  angular
    .module('brew_journal.recipies.services', []);

  angular
    .module('brew_journal.recipies.directives', []);
})();
