'use strict';

angular.module('switchTabsAppAdmin')
  .directive('activeLink', ['$location', function ( $location ) {

  return {
    restrict : 'A',
    link : function ( scope, element, attrs, controller ){
      var activeClass = 'active',
          path = (attrs.href || attr[0].attributes['data-href'].value);

      //Verify in case the path is / because that means should be /admin/
      if ( path === '/admin/' ) {
        path = '/';
      }
      else {
        //Is necessary include a '/' before the path name because
        // location.path() returns the name with a '/' at the beginning
        path = '/' + path;
      }

      scope.location = $location;
      
      scope.$watch('location.path()', function (newPath) {
        if ( newPath === path ) {
          console.log('yes');
          element.addClass(activeClass);
        }
        else {
          element.removeClass(activeClass);
        }

      });

    }

  };
  }]);