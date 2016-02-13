(function () {
	'use strict';

	angular
		.module('brewJournal',[
			// Future modules go here
		]);

	angular
		.module('brewJournal.routes', ['ngRoute']);

	// Protect against CSFR attacks
	angular
		.module('brewJournal')
		.run(run);

	run.$inject = ['$http'];

	/**
	* @name run
	* @desc Update xsr $http headers to align with Django's defaults
	*/
	function run($http) {
		$http.defaults.xsrfHeaderName = 'X-CSRFToken';
		$http.defaults.xsrfCookieName = 'csrftoken';
	}
})();