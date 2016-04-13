describe('Recipe', function() {
  // Setup the global (to the unit test) variables
  var $httpBackend, myFactory, listRecipesRequestHandler;

  // Setup and tear down functions
  beforeEach(module('brew_journal.recipies.services'));

  beforeEach(inject(function($injector, Recipe) {
    myFactory = Recipe;

    $httpBackend = $injector.get('$httpBackend');

    /////// SETUP THE REQUEST HANDLERS ////////
    listRecipesRequestHandler = $httpBackend
      .when('GET', '/api/v1/recipe/')
      .respond(function(method, url, data, headers, params){
        // I don't know how to fake a user login on the front end yet
        var retData = [
          {id: 1, name: 'Recipe uno'},
          {id: 2, name: 'Recipe duo'},
          {id: 3, name: 'Best Beer in the World (tribute)'}
        ];

        return [200, retData];
      });
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  // Running this one first to ensure its defined. If its not defined here
  // is no point in running any of the other tests.
  // (Could be considered useless b/c syntax error would blow up in browser but lets be complete)
  it('should be defined', function() {
    expect(myFactory).toBeDefined();
  });

  it('should retrieve a users recipes', function() {
    myFactory.listRecipes();
    $httpBackend.flush();

    var data = myFactory.getListRecipesResponse();
    expect(data.status).toBe(200);
    expect(data.data.length).toBe(3);
  })
});