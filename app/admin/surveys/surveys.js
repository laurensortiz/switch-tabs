'use strict';

angular.module('switchTabsAppAdmin')
  .controller('surveysCtrl', ['$scope', '$location', '$window', '$routeParams', 'NgTableParams', 'surveys', 'customers', function ( $scope, $location, $window, $routeParams, NgTableParams, surveys, customers ) {

    var self = this,
        surveyData = [],
        customersData = [];

    $scope.showCreateCutomerForm = false;
    $scope.newLocationName = '';
    $scope.newLocationArea = '';





    var listSurveys = function() {

      surveys.getAllSurveys().then(function (surveys) {
        surveyData = surveys.data.survey;
        //Fetch Customer
        customers.getAllCustomers().then(function (customers) {
          customersData = customers.data.customer;

          _.forEach(surveyData, function(n, k) {
            surveyData[k].customerName = _.result(_.find(customersData, {'id': n.customerID}), 'name');
          });

        });

        self.tableParams = new NgTableParams({
          page : 1,
          count : 15,
          sorting : {
            key : 'asc'
          },
          filter : {
            name : ''
          }
        }, {
          defaultSort : 'asc',
          data : surveyData
        });

      });
    };

    listSurveys();



    $scope.deleteLocation = function (locationID) {
      //Confirm delete
      var confirmDelete = confirm('Desea borrar la tienda?');

      if ( confirmDelete ) {
        customers.deleteLocation(locationID).then(function (response) {
          //Update Location table list
          listSurveys();

        });

      };


    };




  }]);