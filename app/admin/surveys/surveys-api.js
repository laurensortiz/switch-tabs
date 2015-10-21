'use strict';

angular.module('switchTabsAppAdmin')
  .factory('surveys', function ($http, $q, $rootScope) {
    // Public API here
    var service = {},
      customer = {};


    service.getAllSurveys = function () {
      var promise = $http({
        method: 'GET',
        url: switch_tabs_config.api_server + 'surveys',
        dataType: 'json'
      }).then(function (response) {
        return response;
      });
      return promise;
    };

    service.getSurvey = function (id) {
      var promise = $http({
        method: 'GET',
        url: switch_tabs_config.api_server + 'survey/' + id,
        dataType: 'json'
      }).then(function (response) {
        return response;
      });
      return promise;
    };

    service.addSurvey = function (newSurvey) {

      var promise = $http({
        method: 'POST',
        url: switch_tabs_config.api_server + 'survey/add',
        dataType: 'json',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data: newSurvey
      }).then(function (response) {
        return response;
      });
      return promise;
    };

    service.deleteSurvey = function (surveyID) {

      var promise = $http({
        method: 'GET',
        url: switch_tabs_config.api_server + 'survey/delete/' + surveyID,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data: surveyID
      }).then(function (response) {
        console.log(response);
        return response;
      });
      return promise;
    };

    service.getSurveysByCustomer = function (customerID) {
      var promise = $http({
        method: 'GET',
        url: switch_tabs_config.api_server + 'survey/customer/' + customerID,
        data: customerID
      }).then(function (response) {
        return response;
      });
      return promise;
    };

    service.saveSurveyQuestions = function (surveyQuestions) {

      var promise = $http({
        method: 'POST',
        url: switch_tabs_config.api_server + 'survey/questions/save',

        data: surveyQuestions
      }).then(function (response) {
        console.log(response);
        return response;
      });
      return promise;
    };


    return service;
  });
