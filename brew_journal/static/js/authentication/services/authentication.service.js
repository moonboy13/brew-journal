/**
* Authentication
* @namespace brew_journal.authentication.services
*/
// NOTE: 66% certain the anonymous function call is to setup the 'use strict'
(function () {
  'use strick';

  angular
    .module('brew_journal.authentication.services')
    .factory('Authentication', Authentication);

  Authentication.$inject = ['$cookies', '$http'];

  /**
  * @namespace Authentication
  * @returns {Factory}
  */
  function Authentication($cookies, $http) {
    /**
    * @name Authentication
    * @desc The Factor to be returned
    */
    var Authentication = {
      login:                   login,
      register:                register,
      getAuthenticatedAccount: getAuthenticatedAccount,
      isAuthenticated:         isAuthenticated,
      setAuthenticatedAccount: setAuthenticatedAccount,
      unauthenticate:          unauthenticate
    };

    return Authentication;

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
      });
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

      window.location = '/';
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
    }

    /**
    * @name unauthenticate
    * @desc Delete the cookie where the user object is stored
    * @returns {undefined}
    * @memberOf brew_journal.authentication.services.Authentication
    */
    function unauthenticate() {
      delete $cookies.authenticatedAccount;
    }
  }
})();