'use strict';

/**
 * @ngdoc overview
 * @name switchTabsAppPublic
 * @description
 * # switchTabsAppPublic
 *
 * Main module of the application.
 */
angular
  .module('switchTabsAppPublic', [
    'ngAnimate',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngCookies',
    'ng-fastclick'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      //.when('/', {
      //  redirectTo : '/admin/dashboard'
      //})
      .when('/', {
        templateUrl: 'public/views/intro.html',
        controller: 'introCtrl',
        controllerAs: 'intro'
      })
      .when('/survey', {
        templateUrl: 'public/views/survey.html',
        controller: 'surveyCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

