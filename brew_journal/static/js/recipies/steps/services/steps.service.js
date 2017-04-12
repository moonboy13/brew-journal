/**
 * Steps
 * @namespace brew_journal.steps.service
 */
(function () {
    'use strict';

    angular
        .module('brew_journal.recipies.steps.services')
        .factory('Steps', Steps);

    Steps.$inject = ['$http'];

    /**
     * @namespace Steps
     * @return {Factory}
     */
    function Steps($http) {
        /**
         * @name Steps
         * @desc The Factory to be returned to handle steps
         */
        var Steps = {
            test: test
        };

        return Steps;

        function test() {
            return 7;
        }
    }
})();
