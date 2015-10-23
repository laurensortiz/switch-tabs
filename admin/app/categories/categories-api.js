'use strict';

angular.module('switchTabsAppAdmin')
  .factory('categories', function ($http, $q, $rootScope) {
    // Public API here
    var service = {};


    service.getAllCategories = function () {
      var promise = $http({
        method: 'GET',
        url: switch_tabs_config.api_server + 'categories',
        dataType: 'json'
      }).then(function (response) {
        return response;
      });
      return promise;
    };

    service.getCategory= function (id) {
      var promise = $http({
        method: 'GET',
        url: switch_tabs_config.api_server + 'category/' + id,
        dataType: 'json'
      }).then(function (response) {
        return response;
      });
      return promise;
    };

    service.addCategory = function (categoryName) {

      var promise = $http({
        method: 'POST',
        url: switch_tabs_config.api_server + 'category/add',
        dataType: 'json',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data: categoryName
      }).then(function (response) {
        console.log(response);
        return response;
      });
      return promise;
    };

    service.deleteCategory = function (categoryID) {

      var promise = $http({
        method: 'GET',
        url: switch_tabs_config.api_server + 'category/delete/' + categoryID,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data: categoryID
      }).then(function (response) {
        console.log(response);
        return response;
      });
      return promise;
    };



    return service;
  });
