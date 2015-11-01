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
      
      surveys.getSurveysByLocation().then(function(surveysLocation){
        console.log(surveysLocation);
      });

      surveys.getAllSurveys().then(function (surveys) {
        surveyData = surveys.data.survey;




        //Fetch Customer
        //customers.getAllCustomers().then(function (customers) {
        //  customersData = customers.data.customer;
        //
        //  _.forEach(surveyData, function(n, k) {
        //    surveyData[k].customerName = _.result(_.find(customersData, {'id': n.customerID}), 'name');
        //  });
        //
        //});



        //Fetch All locations from survey
        //surveys.getSurveyByLocation( surveyID ).then( function(locations){
        //
        //  $scope.locationsActiveInSurvey = locations.data;
        //
        //  //Get the customer info from one locationID locations.data[firstLocation = 0]
        //  customers.getCustomerByLocation( locations.data[0].locationID).then( function(customer){
        //
        //    customers.getCustomerInfo( customer.data.idCustomer ).then(function(customerInfo){
        //
        //
        //      console.log(customerInfo.name);
        //
        //    });
        //
        //
        //  });
        //});

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