describe('Recipe', function() {
  // Setup the global (to the unit test) variables
  var $httpBackend, myFactory, listRecipesRequestHandler, retrieveRecipeRequestHandler;

  // Setup and tear down functions
  beforeEach(module('brew_journal.recipies.services'));

  beforeEach(inject(function($injector, Recipe) {
    myFactory = Recipe;

    $httpBackend = $injector.get('$httpBackend');

    /////// SETUP THE REQUEST HANDLERS ////////
    listRecipesRequestHandler = $httpBackend
      .when('GET', '/api/v1/recipe/')
      .respond(function(method, url, data, headers, params) {
        // I don't know how to fake a user login on the front end yet
        var retData = [
          {id: 1, name: 'Recipe uno'},
          {id: 2, name: 'Recipe duo'},
          {id: 3, name: 'Best Beer in the World (tribute)'}
        ];
        return [200, retData];
    });

    retrieveRecipeRequestHandler = $httpBackend
      .when('GET', new RexExp("/api/v1/recipe/(.+)"), undefined, undefined, ['id'])
      .response(function(method, url, data, headers params) {
        // Doesn't really matter what the id is. for testing just one is designated as right
        if(params.id == 9) {
          return [200, {
            data: {
              recipe_name:"MyRecipe",
              recipe_style:"Kolsch",
              recipe_notes:"Full bodied with a hint of lemon zest. Amber color with fair head retention",
              last_brew_date:"2016-05-05",
              recipe_hops:[{
                  hop_name:"Amarillo",
                  alpha_acid_content:8.8,
                  add_time:30,
                  add_time_unit:"minutes"
                }
              ],
              recipe_malts:[{
                  malt_brand:"Moutons",
                  malt_type:"Extra Light",
                  amount_by_weight:6.6
                }
              ]
            }
          }];
        } else {
          return [404, {
            status_code: 404,
            reason_phrase: 'Not Found',
            data: {
              detail: 'not found.'
            }
          }];
        }
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
    // It's fake data.. as long as its returning the right amount on the right key its good.
    expect(data.data.length).toBe(3);
  });
});
