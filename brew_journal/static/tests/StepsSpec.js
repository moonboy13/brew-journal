describe('RecipeStepsService', function () {
    // TEST SETUP //
    beforeEach(module('brew_journal.recipies.steps.services'));

    // TESTS //
    it('should be defined', function() {});

    it('should retrieve user recipies', function() {});

    it('should retrieve the customized steps for a recipe', function() {});

    it('should save a users customized steps to the indicated recipe', function() {});

});

describe('RecipeStepsController', function () {
    // Testing setup
    var $conroller, $rootScope, $location, myController;

    beforeEach(module('brew_journal'));
    
    beforeEach(inject(function($injector, _$controller_){
        $controller = _$controller_;
        $rootScope  = $injector.get('$rootScope');
        $location   = $injector.get('$location');

        var $scope = {};
        myController = $controller('RecipeStepsController', {$scope: $scope});
    }));
  
    it('should be defined', function() {});

    it('should redirect to login if no user is logged in', function() {});
    
    it('should clear the steps when a user changes recipies', function() {});
    
    it('should load a blank step form when there are no steps for a recipe', function() {});

    it('should load steps in their indicated order', function() {});

    it('should update step numbers when one is removed', function() {});
});
