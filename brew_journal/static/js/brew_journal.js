(function () {
	'use strict';

	angular
		.module('brew_journal',[
			// Future modules go here
      'ui.bootstrap',
			'brew_journal.config',
			'brew_journal.routes',
			'brew_journal.authentication',
			'brew_journal.recipies',
			'brew_journal.layout'
		]);

	angular
		.module('brew_journal.routes', ['ngRoute']);

	// Protect against CSFR attacks
	angular
		.module('brew_journal')
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
