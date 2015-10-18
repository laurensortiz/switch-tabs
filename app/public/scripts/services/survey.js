'use strict';

angular.module('switchTabsAppPublic')
  .factory('survey', function ($http, $q, $rootScope) {
    // Public API here
    var service = {};


    //Get Survey
    service.getSurvey = function (id, customerID, status) {
      var promise = $http({
        method: 'GET',
        url: switch_tabs_config.api_server + 'survey/' + id + '/customer/' + customerID + '/status/' + status,
        dataType: 'json'
      }).then(function (response) {
        return response;
      });
      return promise;
    }

    service.getLocationByCustomer = function (locationID, customerID) {
      var promise = $http({
        method: 'GET',
        url: switch_tabs_config.api_server + 'location/' + locationID + '/customer/' + customerID,
        dataType: 'json'
      }).then(function (response) {
        return response;
      });
      return promise;
    }

    //Get Survey
    service.getSurveyByCustomer = function (customerID) {
      var promise = $http({
        method: 'GET',
        url: switch_tabs_config.api_server + 'survey/customer/' + customerID,
        dataType: 'json'
      }).then(function (response) {

        return response.data.id;
      });
      return promise;
    }

    service.getSurveyQuestions = function (surveyID) {
      var promise = $http({
        method: 'GET',
        url: switch_tabs_config.api_server + 'survey/' + surveyID,
        dataType: 'json'
      }).then(function (response) {

        return response;
      });
      return promise;
    }

    service.saveAnswers = function(answers) {
      var promise = $http({
        method: 'POST',
        url: switch_tabs_config.api_server + 'survey/save',
        dataType: 'json',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data: answers
      }).then(function (response) {
        console.log(response);
        return response;
      });
      return promise;

    }

    return service;
  });
