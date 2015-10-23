'use strict';

angular.module('switchTabsAppAdmin')
  .controller('surveysCtrl', ['$scope', '$rootScope', '$location', '$window', '$routeParams', 'NgTableParams', 'surveys', 'customers', function ( $scope, $rootScope, $location, $window, $routeParams, NgTableParams, surveys, customers ) {

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
            key : 'desc'
          },
          filter : {
            name : ''
          }
        }, {
          defaultSort : 'desc',
          data : surveyData
        });

      });
    };

    listSurveys();



    $scope.deleteSurvey = function (surveyID) {
      //Confirm delete
      var confirmDelete = confirm('Desea borrar la encuesta?');

      if ( confirmDelete ) {
        surveys.deleteSurvey(surveyID).then(function (response) {
          //Update Survey table list
          listSurveys();

        });

      };


    };




  }]);