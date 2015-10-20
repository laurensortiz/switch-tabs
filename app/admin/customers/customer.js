'use strict';

angular.module('switchTabsAppAdmin')
  .controller('customerCtrl', ['$scope', '$location', '$window', '$routeParams', 'NgTableParams', 'customers', function ( $scope, $location, $window, $routeParams, NgTableParams, customers ) {

    var self = this,
        currentCustomer = $routeParams.id;

    $scope.showCreateCutomerForm = false;
    $scope.newCustomerName = '';

    var customersLocationData = [];
    
    

    //Fetch Customer
    console.log(currentCustomer);

    customers.getCustomer(currentCustomer).then(function (customer) {

      $scope.customerName = customer.data.name;

      //Fetch Customer Locations
      listLocationByCustomer();
    });


    var listLocationByCustomer = function() {
      customers.getCustomerLocations(currentCustomer).then(function (locations) {

        console.log(locations);
        customersLocationData = locations.data;

        $scope.tableParams = new NgTableParams({
          page : 1,
          count : 30,
          sorting : {
            key : 'asc'
          }
        }, {
          counts : '',
          defaultSort : 'asc',
          data : customersLocationData
        });

      });
    };





    $scope.saveNewCustomer = function () {
      customers.addCustomer({'name' : $scope.newCustomerName}).then(function (response) {
        $scope.showCreateCutomerForm = false;
        $scope.newCustomerName = '';
        listLocationByCustomer();

      });
    };

    $scope.deleteCustomer = function (customerID) {
      //Confirm delete
      var confirmDelete = confirm('Desea borrar el cliente?');

      if ( confirmDelete ) {
        customers.deleteCustomer(customerID).then(function (response) {
          listLocationByCustomer();

        });

      };


    }




  }]);