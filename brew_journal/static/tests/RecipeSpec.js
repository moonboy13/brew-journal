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
      .when('GET', new RegExp("/api/v1/recipe/(.+)"), undefined, undefined, ['id'])
      .respond(function(method, url, data, headers, params) {
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
    var data;
    myFactory.listRecipes().then(function(response) {data = response});
    $httpBackend.flush();

    expect(data.status).toBe(200);
    // It's fake data.. as long as its returning the right amount on the right key its good.
    expect(data.data.length).toBe(3);
  });
});

describe('RecipeController', function() {

  function isEmpty(obj) {
    for(prop in obj) {
      if(obj.hasOwnProperty(prop)) {
        return false;
      }
    }

    return true;
  };

  var $controller, $rootScope, $location, myController;

  beforeEach(module('brew_journal'));

  beforeEach(inject(function($injector, _$controller_) {
      $controller = _$controller_;
      $rootScope  = $injector.get('$rootScope');
      $location   = $injector.get('$location');

      var $scope = {};
      myController = $controller('RecipeController', {$scope: $scope});
  }));
   
  // Running this one first to ensure its defined. If its not defined here
  // is no point in running any of the other tests.
  // (Could be considered useless b/c syntax error would blow up in browser but lets be complete)
  it('should be defined', function() {
    expect(myController).toBeDefined();
  }); 

  it('should reditect to login if no user is logged in', function() { 
    myController.activate();

    $rootScope.$digest();
    expect($location.path()).toBe('/view/login');
  }); 

  it('should load a blank hop form when no data is passed', function() { 
    expect(myController.hops.length).toBe(0);
    myController.addHop();
    expect(myController.hops.length).toBe(1);
    expect(isEmpty(myController.hops[0])).toBe(true);
  });

  it('should load hop information', function() {
    var hop_data = {
      hop_name: 'Cascade',
      alpha_acid_content: 9.9,
      beta_acid_content: 3.4,
      add_time: 25,
      add_time_unit: 'Minutes',
      dry_hops: true
    };

    expect(myController.hops.length).toBe(0);
    myController.addHop(hop_data);
    expect(myController.hops.length).toBe(1);
   
    expect(hop_data).toEqual(myController.hops[0]);
  });

  it('should load a blank malt form when no data is passed', function() { 
    expect(myController.malts.length).toBe(0);
    myController.addMalt();
    expect(myController.malts.length).toBe(1);
    expect(isEmpty(myController.malts[0])).toBe(true);
  });

  it('should load malt information', function() {
    var malt_data = {
      malt_brand: 'Mutons',
      malt_type: 'Extra Light',
      malt_extract: false,
      dry_malt: true,
      amount_by_weight: 6.7
    };

    expect(myController.malts.length).toBe(0);
    myController.addMalt(malt_data);
    expect(myController.malts.length).toBe(1);
   
    expect(malt_data).toEqual(myController.malts[0]); 
  });

  it('should load recipe information', function() { 
    var recipe_info = {
      recipe_name: 'UnitTest1',
      recipe_style: 'Kolsch',
      last_brew_date: '2016-05-26',
      recipe_notes: 'This is a longish note. Not really that long, but lets not write more',
      recipe_hops: [{
        hop_name: 'Cascade',
        alpha_acid_content: 9.9,
        beta_acid_content: 3.4,
        add_time: 25,
        add_time_unit: 'Minutes',
        dry_hops: true
      }],
      recipe_malts: [{
        malt_brand: 'Mutons',
        malt_type: 'Extra Light',
        malt_extract: false,
        dry_malt: true,
        amount_by_weight: 6.7
      }]
    }

    myController.setRecipeData(recipe_info);

    expect(myController.recipe_name).toEqual(recipe_info.recipe_name);
    expect(myController.recipe_style).toEqual(recipe_info.recipe_style);
    expect(myController.last_brew_date).toEqual(new Date(recipe_info.last_brew_date));
    expect(myController.recipe_notes).toEqual(recipe_info.recipe_notes);
    expect(myController.hops).toEqual(recipe_info.recipe_hops);
    expect(myController.malts).toEqual(recipe_info.recipe_malts);
  });
});
