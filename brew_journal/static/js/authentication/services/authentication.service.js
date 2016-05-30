/**
* Authentication
* @namespace brew_journal.authentication.services
*/
// NOTE: 66% certain the anonymous function call is to setup the 'use strict'
(function () {
  'use strict';

  angular
    .module('brew_journal.authentication.services')
    .factory('Authentication', Authentication);

  Authentication.$inject = ['$rootScope', '$cookies', '$http', '$location'];

  /**
  * @namespace Authentication
  * @returns {Factory}
  */
  function Authentication($rootScope, $cookies, $http, $location) {
    /**
    * @name Authentication
    * @desc The Factor to be returned
    */
    var Authentication = {
      login:                   login,
      logout:                  logout,
      register:                register,
      getAuthenticatedAccount: getAuthenticatedAccount,
      isAuthenticated:         isAuthenticated,
      setAuthenticatedAccount: setAuthenticatedAccount,
      unauthenticate:          unauthenticate,
      getRegistrationResult:   getRegistrationResult
    };

    return Authentication;

    ///////////////////////

    function broadcastAuthenticationUpdate() {
      $rootScope.$broadcast('authentication:change', isAuthenticated());
    }

    var registrationResult = {};

    //////////////////////

    /**
    * @name register
    * @desc Try to register a new user
    * @param {string} username The username entered by the user
    * @param {string} password The password entered by the user
    * @param {string} confirm_password Password confirmation. There is backend validation so needed
    * @param {string} email The email entered by the user
    * @param {string} first_name Registering user's first name
    * @param {string} last_name Registering user's last name
    * @returns {Promise}
    * @memberOf brew_journal.authentication.services.Authentication
    */
    function register(username, password, confirm_password, email, first_name, last_name) {
      return $http.post('/api/v1/account/', {
        username:         username,
        password:         password,
        confirm_password: confirm_password,
        email:            email,
        first_name:       first_name,
        last_name:        last_name
      }).then(registerSuccessFn,registerFailureFn);
    }

    /**
    * @name registerSuccessFn
    * @desc Upon a successful registration, login a user.
    */
    function registerSuccessFn(data, status, headers, config) {
      setRegistrationResult(data);

      // Check to see if a user is already loggedin. If so, then an admin is adding users so don't try to log the
      // new user in.
      if(!isAuthenticated()) {
        Authentication.login(data.data.username, data.data.password);
      }
    }

    /**
    * @name registerFailureFn
    * @desc Warn a user as to why a registration failed
    */
    function registerFailureFn(data, status, headers, config) {
      setRegistrationResult(data);
    }

    /**
    * @name setRegistarationResult
    * @desc set the value of the Registration result
    */
    function setRegistrationResult(data) {
      registrationResult = data;
    }

    /**
     * @name getRegistrationResult
     * @desc Return the results of a registration action
     * @returns {Object}
     * @memberOf brew_journal.authentication.services.Authentication
    */
    function getRegistrationResult() {
      return registrationResult;
    }

    /**
    * @name login
    * @desc Try to log in with username `username` and password `password`
    * @param {string} username The username entered by the user
    * @param {string} password The password entered by the user
    * @returns {Promise}
    * @memberOf brew_journal.authentication.services.Authentication
    */
    function login(username, password) {
      return $http.post('/api/v1/auth/login/', {
        username: username, password: password
      }).then(loginSuccessFn, loginErrorFn);
    }

    /**
    * @name loginSuccessFn
    * @desc Set the authenticated account and redirect to index
    */
    function loginSuccessFn(data, status, headers, config) {
      Authentication.setAuthenticatedAccount(data.data);

      // Adding a check that all spoofed HTTP requests will return. This is to avoid accidentially
      // redirecting during a unit test, which throws everything off and could end up in a nasty
      // redirect loop.
      if(!data.data.isUnitTest)
      {
        $location.url('/view/login');
      }
    }

    /**
    * @name loginErrorFn
    * @desc Log "Epic failure!" to the console
    * @todo Evaluate the necessity of this function
    */
    function loginErrorFn(data, status, headers, config) {
      console.log(data);
    }

    /**
    * @name logout
    * @desc Log the user out
    * @returns {Promise}
    * @memberOf brew_journal.authentication.services.Authentication
    */
    function logout() {
      return $http.post('/api/v1/auth/logout/')
        .then(logoutSuccessFn, logoutErrorFn);
    }

    /**
    * @name logoutSuccessFn
    * @desc Unathentication the user and redirect to login
    */
    function logoutSuccessFn(data, status, headers, config) {
      Authentication.unauthenticate();

      // Adding a check that all spoofed HTTP requests will return. This is to avoid accidentially
      // redirecting during a unit test, which throws everything off and could end up in a nasty
      // redirect loop.
      if(!data.data.isUnitTest)
      {
        $location.url('/view/login');
      }
    }

    /**
    * @name logoutErrorFn
    * @desc Log why the user could not logout
    */
    function logoutErrorFn(data, status, headers, config) {
      console.error(data);
    }

    /**
    * @name getAuthenticatedAccount
    * @desc Return the currently authenticated account
    * @returns {object|undefined} Account if authenticated, else `undefined`
    * @memberOf brew_journal.authentication.services.Authentication
    */
    function getAuthenticatedAccount() {
      if (!$cookies.authenticatedAccount) {
        return;
      }

      return JSON.parse($cookies.authenticatedAccount);
    }

    /**
    * @name isAuthenticated
    * @desc Check if the current user is authenticated
    * @returns {boolean} True is user is authenticated, else false.
    * @memberOf brew_journal.authentication.services.Authentication
    */
    function isAuthenticated() {
      return !!$cookies.authenticatedAccount;
    }

    /**
    * @name setAuthenticatedAccount
    * @desc Stringify the account object and store it in a cookie
    * @param {Object} user The account object to be stored
    * @returns {undefined}
    * @memberOf brew_journal.authentication.services.Authentication
    */
    function setAuthenticatedAccount(account) {
      $cookies.authenticatedAccount = JSON.stringify(account);
      broadcastAuthenticationUpdate();
    }

    /**
    * @name unauthenticate
    * @desc Delete the cookie where the user object is stored
    * @returns {undefined}
    * @memberOf brew_journal.authentication.services.Authentication
    */
    function unauthenticate() {
      delete $cookies.authenticatedAccount;
      broadcastAuthenticationUpdate();
    }
  }
})();
