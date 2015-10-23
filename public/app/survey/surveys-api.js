'use strict';

angular.module('switchTabsAppPublic')
  .factory('surveys', ['$http', function ($http, $q, $rootScope) {
    // Public API here
    var service = {},
      customer = {};





    service.getLocationByCustomer = function (locationID, customerID) {
      var promise = $http({
        method: 'GET',
        url: switch_tabs_config.api_server + 'location/' + locationID + '/customer/' + customerID,
        dataType: 'json'
      }).then(function (response) {
        service.locationID = response.data.id;
        service.customerID = response.data.idCustomer;
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

    service.getSurveyQuestions = function (surveyID) {
      var promise = $http({
        method: 'GET',
        url: switch_tabs_config.api_server + 'survey/questions/' + surveyID
      }).then(function (response) {
        return response;
      });
      return promise;
    };

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

    };

    service.getSurveyByCustomerAndLocations = function (surveyID) {
      var promise = $http({
        method: 'GET',
        url: switch_tabs_config.api_server + 'survey/'+ surveyID +'/customer/'
      }).then(function (response) {
        return response;
      });
      return promise;
    };

    return service;
  }]);
