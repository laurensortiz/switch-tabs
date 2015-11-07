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
    'ng-breadcrumbs',
    'ngTable',
    'chart.js'
  ])
  .config(['$routeProvider', '$locationProvider', 'ChartJsProvider', function ($routeProvider, $locationProvider, ChartJsProvider){


    $locationProvider.html5Mode(false);
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
      .when('/customer/:id', {
        templateUrl   : 'customers/customer.html',
        controller    : 'customerCtrl',
        controllerAs  : 'customer',
        label         : 'Cliente'
      })
      .when('/categories/', {
        templateUrl   : 'categories/categories.html',
        controller    : 'categoriesCtrl',
        controllerAs  : 'categories',
        label         : 'Categorías'
      })
      .when('/surveys/', {
        templateUrl   : 'surveys/surveys.html',
        controller    : 'surveysCtrl',
        controllerAs  : 'surveys',
        label         : 'Encuestas'
      })
      .when('/survey/detail/:id', {
        templateUrl   : 'surveys/survey-detail.html',
        controller    : 'surveyDetailCtrl',
        controllerAs  : 'surveyDetail',
        label         : 'Detalle de la Encuesta'
      })
      .when('/survey/edit/:id', {
        templateUrl   : 'surveys/survey-edit.html',
        controller    : 'surveyEditCtrl',
        controllerAs  : 'surveyEdit',
        label         : 'Editar Encuesta'
      })
      .when('/survey/new', {
        templateUrl   : 'surveys/survey-new.html',
        controller    : 'surveyNewCtrl',
        controllerAs  : 'survey',
        label         : 'Encuesta'
      })
      .otherwise({
        redirectTo: '/'
      });



    //Charts Global Config
    ChartJsProvider.setOptions({
      animationEasing : 'easeInOutQuart',
      responsive : true,
      onAnimationComplete: function(){

      }
    });



  }]);

var switch_tabs_config = {
  api_server : '/api/'
};

//Colors by Answers

var Answer = {
  excelente : '#39b54a',
  bueno : '#ffdb09',
  regular : '#ef8126',
  malo : '#dd0717',
  si : '#248a32',
  no : '#bb0a18',
  hombre : '#6995ee',
  mujer : '#d38ab7'
}