describe('Authentication', function() {
  // Variable for the factory
  var $httpBackend, myFactory, loginRequestHandler, registrationRequestHandler;

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

    // Given how the SimpleProvider handles things on the backend, this may have to eventually deal
    // with multiple request types since the provider can distinguish differnent requests from the
    // same URI (unknown if that is actually true yet).
    registrationRequestHandler = $httpBackend
      .when('POST', '/api/v1/account/')
      .respond(function(method, url, data, headers, params){
        var requestData = JSON.parse(data);
        // Ensures that required inputs are present
        if(requestData.username && requestData.password && requestData.confirm_password) {
          // Verifies password
          if(requestData.password === requestData.confirm_password) {
            fakeEmail     = requestData.email;
            fakeFirstName = requestData.first_name;
            fakeLastName  = requestData.last_name;
            return [201, {
              username   : requestData.username,
              password   : requestData.password,
              email      : fakeEmail,
              first_name : fakeFirstName,
              last_name  : fakeLastName,
              isUnitTest : true
            }];
          }
        }
      })
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

  ///////// LOGIN TESTS //////////////////
  it('should log users in', function() {
    var fakeUsername = 'grease';
    var fakePassword = 'lightning';
    myFactory.login(fakeUsername, fakePassword);
    $httpBackend.flush();

    validLogin(fakeUsername, fakePassword, myFactory);
  });

  it('should not log users in if a username is missing', function() {
    var fakePassword = 'lightning';
    myFactory.login(null, fakePassword);
    $httpBackend.flush();

    // Make sure there is no authenticated user
    expect(myFactory.isAuthenticated()).toBe(false);
  });

  it('should not log users in if a password is missing', function() {
    var fakeUsername = 'lightning';
    myFactory.login(fakeUsername, null);
    $httpBackend.flush();

    // Make sure there is no authenticated user
    expect(myFactory.isAuthenticated()).toBe(false);
  });

  /////////////////////////////////////////////

  //////// Registration Tests ///////////////////
  it('should register a user and log them in', function() {
    var fakeUsername = 'foo';
    var fakePassword = 'bar';
    myFactory.register(fakeUsername, fakePassword, fakePassword, 'fake@email.com', 'not', 'me');
    $httpBackend.flush();

    validLogin(fakeUsername, fakePassword, myFactory);
  });

  it('should only require username and password', function() {
    var fakeUsername = 'foo';
    var fakePassword = 'bar';
    myFactory.register(fakeUsername, fakePassword, fakePassword, '', '', '');
    $httpBackend.flush();

    validLogin(fakeUsername, fakePassword, myFactory);
  })

  //////////// HELPER FUNCTION ///////////////////
  // Validate the login. Username and password will change between tests.
  function validLogin(username, password, factory) {
    // At this point, as long as registration occurs successfully, and no-one is logged in, the newest user will be
    // logged in.
    expect(myFactory.isAuthenticated()).toBe(true);

    // Test that the login set data appropriately
    var data = myFactory.getAuthenticatedAccount();
    expect(data).toBeDefined();
    expect(username).toEqual(data.username);
    expect(password).toEqual(data.password);
    expect(fakeFirstName).toEqual(data.first_name);
    expect(fakeLastName).toEqual(data.last_name);
    expect(fakeEmail).toEqual(data.email);
  }
});