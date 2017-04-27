describe('Authentication', function() {
  // Variable for the factory
  var $httpBackend, myFactory, loginRequestHandler, registrationRequestHandler, logoutRequestHandler;

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
        if(requestData.username && requestData.password) {
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
          } else {
            return [406, {
              status:  'Invalid',
              message: 'Passwords must match'
            }]
          }
        } else {
          // The validate function can catch many things, so dynamically build its errors object
          errors = {};
          if(!requestData.username) {
            errors.username = "username is a required field";
          }
          if(!requestData.password) {
            errors.password = "password is a required field";
          }

          return [400, {
            status:  'Bad Request',
            message: 'Account could not be created with the received data.',
            errors:  errors
          }];
        }
      });

    logoutRequestHandler = $httpBackend
      .when('POST', '/api/v1/auth/logout/')
      .respond(function(method, url, data, headers, params){
        // Logout pretty much works (until I find an error...)
        return [204, {
          isUnitTest:true
        }];
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

  it('should throw an exception when validating login', function() {
    try {
      myFactory.checkAuthentication();
    } catch (e) {
      expect(e.message).toBe("Unathorized access attempted. Please login.");
    }
  });
  ///////////////////////////////////////////////

  //////// Registration Tests ///////////////////
  it('should register a user and log them in', function() {
    var fakeUsername = 'foo';
    var fakePassword = 'bar';
    myFactory.register(fakeUsername, fakePassword, fakePassword, 'fake@email.com', 'not', 'me');
    $httpBackend.flush();

    var results = myFactory.getRegistrationResult();
    expect(results).toBeDefined();

    validLogin(fakeUsername, fakePassword, myFactory);
  });

  it('should only require username and password', function() {
    var fakeUsername = 'foo';
    var fakePassword = 'bar';
    myFactory.register(fakeUsername, fakePassword, fakePassword, '', '', '');
    $httpBackend.flush();

    var results = myFactory.getRegistrationResult();
    expect(results).toBeDefined();

    validLogin(fakeUsername, fakePassword, myFactory);
  });

  it('should ensure both passwords are the same', function() {
    var fakeUsername = 'foo';
    var fakePasswordOne = 'bar';
    var fakePasswordTwo = 'zinc';
    myFactory.register(fakeUsername, fakePasswordOne, fakePasswordTwo);
    $httpBackend.flush();

    var results = myFactory.getRegistrationResult();

    expect(results).toBeDefined();
    expect(results.status).toEqual(406);
    expect(results.data.status).toEqual('Invalid');
    expect(results.data.message).toEqual('Passwords must match');
  });

  it('should verify all required fields are present', function() {
    var fakeUsername = 'foo';
    var fakePassword = 'bar';
    // First, forget the username
    myFactory.register(null,fakePassword);
    $httpBackend.flush();

    // Check the results
    var results = myFactory.getRegistrationResult();
    expect(results).toBeDefined();
    expect(results.status).toEqual(400);
    expect(results.data.status).toEqual('Bad Request');
    expect(results.data.message).toEqual('Account could not be created with the received data.');
    expect(results.data.errors.username).toEqual('username is a required field');

    // Now, forget the password
    myFactory.register(fakeUsername,null);
    $httpBackend.flush();

    // Check the results
    var results = myFactory.getRegistrationResult();
    expect(results).toBeDefined();
    expect(results.status).toEqual(400);
    expect(results.data.status).toEqual('Bad Request');
    expect(results.data.message).toEqual('Account could not be created with the received data.');
    expect(results.data.errors.password).toEqual('password is a required field');

    // Forget everything
    myFactory.register(null,null);
    $httpBackend.flush();

    // Check the results
    var results = myFactory.getRegistrationResult();
    expect(results).toBeDefined();
    expect(results.status).toEqual(400);
    expect(results.data.status).toEqual('Bad Request');
    expect(results.data.message).toEqual('Account could not be created with the received data.');
    expect(results.data.errors.username).toEqual('username is a required field');
    expect(results.data.errors.password).toEqual('password is a required field');
  });
  ///////////////////////////////////////////////

  ////////////////// Logout Tests ///////////////
  it('should log users out', function() {
    var fakeUsername = 'grease';
    var fakePassword = 'lightning';
    myFactory.login(fakeUsername, fakePassword);
    $httpBackend.flush();

    validLogin(fakeUsername, fakePassword, myFactory);

    myFactory.logout();
    $httpBackend.flush();

    expect(myFactory.isAuthenticated()).toBe(false);
  });

  //////////// HELPER FUNCTION //////////////////
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