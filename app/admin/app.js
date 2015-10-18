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
  .module('switchTabsAppAdmin', [
    'ngAnimate',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngCookies',
    'ng-fastclick',
    'ng-breadcrumbs'
  ])
  .config(function ($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
      //.when('/', {
      //  redirectTo : '/admin/dashboard'
      //})
      .when('/', {
        templateUrl   : 'dashboard/dashboard.html',
        controller    : 'dashboardCtrl',
        controllerAs  : 'dashboard',
        label         : 'Inicio'
      })
      .when('/customers/', {
        templateUrl   : 'customers/customers.html',
        controller    : 'customersCtrl',
        controllerAs  : 'customers',
        label         : 'Clientes'
      })
      .otherwise({
        redirectTo: '/'
      });



  });

var switch_tabs_config = {
  api_server : 'http://switchtabs/api/'
}