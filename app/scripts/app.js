'use strict';

/**
 * @ngdoc overview
 * @name switchTabsApp
 * @description
 * # switchTabsApp
 *
 * Main module of the application.
 */
angular
  .module('switchTabsApp', [
    'ngAnimate',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngCookies',
    'ng-fastclick'
  ])
  .config(['$routeProvider', '$locationProvider', function ( $routeProvider, $locationProvider ) {
      $locationProvider.html5Mode(true);

    /*
     * Checks if a user is authorized to access a route
     *
     * @role (string) minimum role name required
     *
     */
    var requireAuth = function (role) {
      return {
        load : function ($q, $location) {
          var deferred = $q.defer(),
            //TODO: replace isLoggedIn variable value by a function
            //to check if the user is actually logged in
            isLoggedIn = true;

          deferred.resolve();

          if ( isLoggedIn ) { // fire $routeChangeSuccess
            console.log('user authorized');

            return deferred.promise;
          }
          else { // fire $routeChangeError
            console.log('reject!');

            $location.path('/login');
          }

        }
      };
    };

    //Main application routes

    $routeProvider
      .when('/', {
        redirectTo : 'public/',
        resolve     : requireAuth()
      })
      .when('/admin', {
        redirectTo : 'admin/',
        resolve     : requireAuth()
      })
  }]);

 // App Config

 var switch_tabs_config = {
   api_server : 'http://switchtabs/api/'
 }