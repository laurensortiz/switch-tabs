'use strict';

angular.module('switchTabsAppAdmin')
  .controller('customersCtrl', ['$scope', '$location', '$window', 'NgTableParams', 'customers', function ( $scope, $location, $window, NgTableParams, customers ) {

    var self = this;

    $scope.showCreateCutomerForm = false;
    $scope.newCustomerName = '';

    var customersData = [];


    //Fetch all Customer
    var listCustomers = function() {
      customers.getAllCustomers().then(function (customers) {

        customersData = customers.data.customer;



        $scope.tableParams = new NgTableParams({
          page : 1,
          count : 30,
          sorting : {
            key : 'asc'
          }
        }, {
          counts : '',
          defaultSort : 'asc',
          data : customersData
        });

      });
    };

    listCustomers();



    $scope.saveNewCustomer = function () {
      customers.addCustomer({'name' : $scope.newCustomerName}).then(function (response) {
        $scope.showCreateCutomerForm = false;
        $scope.newCustomerName = '';
        listCustomers();

      });
    };

    $scope.deleteCustomer = function (customerID) {
      //Confirm delete
      var confirmDelete = confirm('Desea borrar el cliente?');

      if ( confirmDelete ) {
        customers.deleteCustomer(customerID).then(function (response) {
          listCustomers();

        });

      };


    }




  }]);