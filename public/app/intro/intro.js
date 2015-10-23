'use strict';

angular.module('switchTabsAppPublic')
  .controller('introCtrl', function ($scope, $cookies, $timeout, $location, $rootScope, $routeParams, surveys) {

    var shortcut = $cookies.shortcut,
        SURVEY_ID;


    SURVEY_ID = $routeParams.survey;



    $scope.location = $routeParams.location;
    $scope.loaded = false;
    $scope.error = false;
    $scope.errorMsg = "";
    $scope.shortCuteAlert = false;


    $scope.setCookie = function (){
      $cookies.shortcut = 'yes';
      $location.url('/survey/');
    };



    if(!$scope.customer || !$scope.location){
      $scope.error = true;
      $scope.loaded = true;
      $scope.errorMsg = "No se indicó el cliente";
    }else{
      $scope.loaded = false;

      //Get Customer
      surveys.getLocationByCustomer($scope.location, $scope.customer).then(function (customer) {

        //Verify if Customer and Location are correct.
        if (customer.data ===  'false') {
          $scope.error = true;
          $scope.loaded = true;
          $scope.errorMsg = "Verifique que el Customer y Location sean correctos.";

        } else {
          if (shortcut !== undefined) {
            $scope.error = false;
            $scope.loaded = false;
            $location.url('/survey/');

          }
          else {
            $scope.error = true;
            $scope.loaded = true;
            $scope.shortCuteAlert = true;
            $scope.errorMsg = "Por favor crear acceso directo en la pantalla principal e ingrese desde ahí.";
          }







        }




      });
    }

  });