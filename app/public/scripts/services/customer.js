'use strict';

angular.module('switchTabsAppPublic')
  .factory('customer', function ($http, $q, $rootScope) {
    // Public API here
    var service = {};


    service.getAllCustomers = function () {
      var promise = $http({
        method: 'GET',
        url:switch_tabs_config.api_server + 'customers',
        dataType: 'json'
      }).then(function (response) {
        return response;
      });
      return promise;
    }


    service.getCustomer = function (id) {
      var promise = $http({
        method: 'GET',
        url: switch_tabs_config.api_server + 'customers/' + id,
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
        service.locationID = response.data.id;
        service.customerID = response.data.idCustomer;
        return response;
      });
      return promise;
    }


    return service;
  });
