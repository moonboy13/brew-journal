describe('Authentication', function() {
  // Variable for the factory
  var $httpBackend, myFactory, loginRequestHandler;

  // Setting up some test values to make them overall accessable
  var fakeEmail     = 'unit_tests@moonboy.com';
  var fakeFirstName = 'John';
  var fakeLastName  = 'Doe';

  beforeEach(module('brew_journal.authentication.services'));

  beforeEach(inject(function($injector, Authentication) {
    myFactory = Authentication;

    $httpBackend = $injector.get('$httpBackend');

    loginRequestHandler = $httpBackend
      .when('POST', '/api/v1/auth/login/')
      .respond(function(method, url, data, headers, params){
        var requestData = JSON.parse(data);
        // Checks that data was actually entered. Allows handling for if users get around input checks
        if(requestData.username && requestData.password && requestData.username.length > 0 && requestData.password.length > 0) {
          // Return with some fake user data to compare against authenticatedUser function.
          return [200, {
            username   : requestData.username,
            password   : requestData.password,
            email      : fakeEmail,
            first_name : fakeFirstName,
            last_name  : fakeLastName,
            isUnitTest : true
          }];
        } else {
          return [401, {
            status:  'Unauthorized',
            message: 'Username/password combination invalid.'
          }];
        }
      });
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  // Running this one first to ensure its defined. If its not defined there
  // is no point in running any of the other tests.
  it('should be defined', function() {
    expect(myFactory).toBeDefined();
  });

  it('should log users in', function() {
    var fakeUsername = 'grease';
    var fakePassword = 'lightning';
    myFactory.login(fakeUsername, fakePassword);
    $httpBackend.flush();

    // Test that the login set data appropriately
    var data = myFactory.getAuthenticatedAccount();
    expect(data).toBeDefined();
    expect(fakeUsername).toEqual(data.username);
    expect(fakePassword).toEqual(data.password);
    expect(fakeFirstName).toEqual(data.first_name);
    expect(fakeLastName).toEqual(data.last_name);
    expect(fakeEmail).toEqual(data.email);
  });

});