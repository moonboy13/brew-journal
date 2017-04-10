(function () {
    'use strict';

    angular
        .module('brew_journal.recipies.steps.controllers')
        .controller('StepsController', StepsController);

    StepsController.$inject = ['$scope', 'Steps'];

    /**
    * @namespace StepsController
    */
    function StepsController($scope, Steps) {
        var ctrl = this;
    }
})();
