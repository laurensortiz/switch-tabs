'use strict';

angular.module('switchTabsAppAdmin')
  .controller('topNavCtrl', ['$scope', '$rootScope', function ( $scope, $rootScope ) {

  $rootScope.notification = {
    text : '', // Store any type of text message
    type : '' // The should be only: [success, error, alert] because should match with css class name
  };




  }]);