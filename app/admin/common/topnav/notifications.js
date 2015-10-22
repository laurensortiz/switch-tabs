'use strict';

angular.module('switchTabsAppAdmin')
  .directive('notifications', ['$rootScope', '$timeout', function ( $rootScope, $timeout ) {

    return {
      restrict : 'A',
      link : function ( scope, element, attrs, controller ){

        scope.$watch('notification.text', function (newN, oldN) {

          element.addClass('notification ' + scope.notification.type);


          var applyClass = $timeout( function() {
            element.removeClass('notification ' + scope.notification.type);

            //Reset by default values
            $rootScope.notification = {
              text : '',
              type : ''
            };

          }, 3000);

        });

      }

    };
  }]);