describe('Steps', function () {
    var $httpBackend, myFactory;

    // TEST SETUP //
    beforeEach(module('brew_journal.recipies.steps.services'));

    beforeEach(inject(function($injector, Steps) {
        myFactory = Steps;

        $httpBackend = $injector.get('$httpBackend');

        //////// SETUP REQUEST HANDLERS ///////////
        $httpBackend
            .when('GET', new RegExp("/api/v1/recipe/(.+)/step/"), undefined, undefined, ['id'])
            .respond(function(method, url, data, headers, params) {
                if(params.id == 7) {
                    return [200, {
                        data: [
                            {
                                step:"Observe the beauty of the day",
                                step_order:1
                            },
                            {
                                step:"Have a homebrew",
                                step_order:3
                            },
                            {
                                step:"Relax and hug your wife",
                                step_order:2
                            }
                        ]
                    }];
                }
            });
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    // TESTS //
    it('should be defined', function() {
        expect(myFactory).toBeDefined();
    });

    it('should retrieve the customized steps for a recipe', function() {
    });

    it('should save a users customized steps to the indicated recipe', function() {});

});

describe('StepsController', function () {
    // Testing setup
    var $conroller, $rootScope, $location, myController;

    beforeEach(module('brew_journal'));
    
    beforeEach(inject(function($injector, _$controller_){
        $controller = _$controller_;
        $rootScope  = $injector.get('$rootScope');
        $location   = $injector.get('$location');

        var $scope = {};
        myController = $controller('StepsController', {$scope: $scope});
    }));
  
    it('should be defined', function() {});

    it('should redirect to login if no user is logged in', function() {});
    
    it('should clear the steps when a user changes recipies', function() {});
    
    it('should load a blank step form when there are no steps for a recipe', function() {});

    it('should load steps in their indicated order', function() {});

    it('should update step numbers when one is removed', function() {});
});
