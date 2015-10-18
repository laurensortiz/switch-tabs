'use strict';

angular.module('switchTabsAppAdmin')
  .controller('customersCtrl', function ($scope, $timeout, $filter, $location, $window, $rootScope, $routeParams, customers) {

    var currentCustomer = $routeParams.id;

    $scope.loaded = false;
    $scope.error = false;
    $scope.errorMsg = "";
    $scope.customerDetail = false;
    $scope.locationURL = $window.location.href;
    $scope.listLocations = true;
    $scope.showAnswers = false;


    //Show Customer Detail
    $scope.showCustomerDetail = function(customerID) {
      $scope.customerDetail = true;

      customers.getCustomerInfo(customerID).then( function (customer) {
        $scope.customer = customer;
        $scope.survey = customer.survey[0].name;
        $scope.surveyQuestions = customer.survey[0].questions;
      });

    };

    $scope.getAnswersByLocation = function (id) {
      var location = _.findKey($scope.customer.locations, { 'id': id});
      $scope.answersByLocation = $scope.customer.locations[location].answers;
      $scope.listLocations = false;
      $scope.showAnswers = true;
    };


    customers.getAllCustomers().then(function (customers) {
      $scope.customers = customers.data.customer;
    });

    if (currentCustomer !== undefined) {
      $scope.showCustomerDetail(currentCustomer);
    }


    $scope.hideAnswers = function () {
      $scope.listLocations = true;
      $scope.showAnswers = false;
    };

    $scope.tableToExcel = (function() {
      var uri = 'data:application/vnd.ms-excel;base64,'
        , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
        , base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) }
        , format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) }
      return function(table, name) {
        if (!table.nodeType) table = document.getElementById(table)
        var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML}
        window.location.href = uri + base64(format(template, ctx))
      }
    })();







  });