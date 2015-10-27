'use strict';

angular.module('switchTabsAppPublic')
  .factory('customers', function ($http, $q, $rootScope) {
    // Public API here
    var service = {},
      customer = {};


    service.getAllCustomers = function () {
      var promise = $http({
        method: 'GET',
        url: switch_tabs_config.api_server + 'customers',
        dataType: 'json'
      }).then(function (response) {
        return response;
      });
      return promise;
    };

    service.getCustomer = function (id) {
      var promise = $http({
        method: 'GET',
        url: switch_tabs_config.api_server + 'customer/' + id,
        dataType: 'json'
      }).then(function (response) {
        return response;
      });
      return promise;
    };

    service.addCustomer = function (customerName) {

      var promise = $http({
        method: 'POST',
        url: switch_tabs_config.api_server + 'customer/add',
        dataType: 'json',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data: customerName
      }).then(function (response) {
        console.log(response);
        return response;
      });
      return promise;
    };

    service.deleteCustomer = function (customerID) {

      var promise = $http({
        method: 'GET',
        url: switch_tabs_config.api_server + 'customer/delete/' + customerID,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data: customerID
      }).then(function (response) {
        console.log(response);
        return response;
      });
      return promise;
    };

    service.getCustomerLocations = function (id) {
      var promise = $http({
        method: 'GET',
        url: switch_tabs_config.api_server + 'customer/' + id + '/locations',
        dataType: 'json'
      }).then( function (response) {
          return response;
      });
      return promise;
    };

    service.getCustomerByLocation = function (id) {
      var promise = $http({
        method: 'GET',
        url: switch_tabs_config.api_server + 'location/' + id + '/customer/'
      }).then( function (response) {
        return response;
      });
      return promise;
    };

    service.addLocation = function (location) {

      var promise = $http({
        method: 'POST',
        url: switch_tabs_config.api_server + 'location/add',
        dataType: 'json',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data: location
      }).then(function (response) {
        return response;
      });
      return promise;
    };

    service.deleteLocation = function (locationID) {

      var promise = $http({
        method: 'GET',
        url: switch_tabs_config.api_server + 'location/delete/' + locationID,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data: locationID
      }).then(function (response) {
        return response;
      });
      return promise;
    };



    service.getQuestionsBySurvey = function (id) {
      var promise = $http({
        method: 'GET',
        url: switch_tabs_config.api_server + 'survey/' + id ,
        dataType: 'json'
      }).then( function (response) {
        return response;
      });
      return promise;
    };

    service.getSurveyAnswersByLocation = function (id) {
      var promise = $http({
        method: 'GET',
        url: switch_tabs_config.api_server + 'survey/location/' + id + '/answers',
        dataType: 'json'
      }).then( function (response) {
        return response;
      });
      return promise;
    };





    service.getCustomerInfo = function (id) {
      var deferred = $q.defer();

      service.getCustomer(id).then(function (detail) {


          customer.id = detail.data.id;
          customer.name = detail.data.name;

          service.getCustomerLocations(customer.id).then(function (customerLocations) {
            customer.locations = customerLocations.data;
            deferred.resolve(customer);

          });




      });



      return deferred.promise;
    };


    return service;
  });
