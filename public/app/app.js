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
  ]).run(function() {
    FastClick.attach(document.body);
  })
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'survey/survey.html',
        controller: 'surveyCtrl',
        controllerAs : 'survey'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

var switch_tabs_config = {
  api_server : '/api/'
};