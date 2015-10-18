'use strict';

angular.module('switchTabsAppAdmin')
  .controller('breadcrumbCtrl', ['$scope', 'breadcrumbs', function ( $scope, breadcrumbs ) {

    $scope.breadcrumbs = breadcrumbs;


  }]);