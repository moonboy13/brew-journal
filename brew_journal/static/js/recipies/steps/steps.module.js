(function () {
    'use strict';

    angular
        .module('brew_journal.recipies.steps', [
            'brew_journal.recipies.steps.controllers',
            'brew_journal.recipies.steps.services',
            'brew_journal.recipies.steps.directives'
        ]);

    angular
        .module('brew_journal.recipies.steps.controllers' , []);
    
    angular
        .module('brew_journal.recipies.steps.services' , []);

    angular
        .module('brew_journal.recipies.steps.directives', []);
})();
