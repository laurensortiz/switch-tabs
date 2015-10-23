'use strict';

angular.module('switchTabsAppAdmin')
  .controller('customerCtrl', ['$scope', '$location', '$window', '$routeParams', 'NgTableParams', 'customers', function ( $scope, $location, $window, $routeParams, NgTableParams, customers ) {

    var self = this,
      customersLocationData = [],
      newLocation = {},// require attributes ->idCustomer: id, store: name, area: name
      currentCustomer = $routeParams.id;

    $scope.showCreateCutomerForm = false;
    $scope.newLocationName = '';
    $scope.newLocationArea = '';


    //Fetch Customer

    customers.getCustomer(currentCustomer).then(function (customer) {

      $scope.customerName = customer.data.name;
      //Fetch Customer Locations
      listLocationByCustomer();

    });


    var listLocationByCustomer = function() {
      customers.getCustomerLocations(currentCustomer).then(function (locations) {

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





    $scope.saveNewLocation = function () {
      //Fill the object with the new info location
      newLocation = {
        idCustomer: currentCustomer,
        store : $scope.newLocationName,
        area : $scope.newLocationArea
      };
      
      customers.addLocation(newLocation).then(function (response) {

        $scope.showCreateCutomerForm = false;
        $scope.newLocationName = '';
        $scope.newLocationArea = '';
        //Update Location table list
        listLocationByCustomer();

      });
    };

    $scope.deleteLocation = function (locationID) {
      //Confirm delete
      var confirmDelete = confirm('Desea borrar la tienda?');

      if ( confirmDelete ) {
        customers.deleteLocation(locationID).then(function (response) {
          //Update Location table list
          listLocationByCustomer();

        });

      };


    }




  }]);