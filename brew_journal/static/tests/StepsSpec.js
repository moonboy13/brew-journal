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
                    return [200, [
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
                    ];
                } else {
                    return [404, [{detail:'Not Found'}], null, "Not Found"];
                }
            });
        $httpBackend
            .when('POST', new RegExp("/api/v1/recipe/(.+)/step/"), undefined, undefined, ['id'])
            .respond(function(method, url, data, headers, params) {
                return [201, {message:'Steps have been created.'}, null, 'Created'];
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
        var data = {};
        myFactory.listRecipeSteps(7).then(function(response) {data = response;});
        $httpBackend.flush();

        expect(data.status).toBe(200);
        expect(data.data.length).toBe(3);
    });

    it('should not retrieve steps for a non-existant recipe', function() {
        var data = {};
        myFactory.listRecipeSteps(9999).then(null, function(response) {
            data = response;
        });
        $httpBackend.flush();

        expect(data.status).toBe(404);
        expect(data.statusText).toBe("Not Found");
    })

    it('should save a users customized steps to the indicated recipe', function() {
        var data = {};
        var steps = [{
            step:"this is a thing",
            step_order:1
        },{
          step:"this is another thing",
          step_order:2
        }];

        myFactory.saveRecipeSteps(5,steps).then(function(response){data=response;});
        $httpBackend.flush();

        expect(data.status).toBe(201);
        expect(data.statusText).toBe('Created');
        expect(data.data.message).toBe('Steps have been created.');
    });

});

describe('StepsController', function () {
    // Testing setup
    var $conroller, $rootScope, $location, myController, fakeStepsData;

    beforeEach(module('brew_journal'));
    
    beforeEach(inject(function($injector, _$controller_){
        $controller = _$controller_;
        $rootScope  = $injector.get('$rootScope');
        $location   = $injector.get('$location');

        fakeStepsData = {data:[{foo:'bar',step_order:2}, {bar:'foo',step_order:3}, {angular:'js', step_order:1}]};

        var $scope = {};
        myController = $controller('StepsController', {$scope: $scope});
    }));
  
    it('should be defined', function() {
        expect(myController).toBeDefined();
    });

    it('should redirect to login if no user is logged in', function() {
        myController.activate();

        $rootScope.$digest();
        expect($location.path()).toBe('/view/login');
    });
    
    it('should clear the all steps', function() {
        myController.steps = fakeStepsData.data;

        myController.clearForm();

        expect(myController.steps.length).toEqual(0);
    });
    
    it('should remove the specified step only', function() {
        myController.steps = fakeStepsData.data;
        var nFakeSteps = fakeStepsData.data.length;

        myController.removeStep(0);

        expect(myController.steps.length).toEqual((nFakeSteps - 1));
        expect(Object.keys(myController.steps[0])).toContain('bar');
        expect(myController.steps[0].bar).toEqual('foo');
        expect(myController.steps[0].step_order).toEqual(1);
    });

    it('should load steps in their indicated order', function() {
        myController.loadStepsData(fakeStepsData);

        expect(myController.steps.length).toEqual(fakeStepsData.data.length);
        expect(Object.keys(myController.steps[0])).toContain('angular');
        expect(Object.keys(myController.steps[1])).toContain('foo');
    });

    it('should load empty steps if no data given', function () {
        myController.loadStepsData([]);

        expect(myController.steps.length).toEqual(0);

        myController.loadStepsData(null);

        expect(myController.steps.length).toEqual(0);
    });
});
