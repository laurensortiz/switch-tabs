'use strict';

angular.module('switchTabsAppAdmin')
  .controller('categoriesCtrl', ['$scope', '$location', '$window', 'NgTableParams', 'categories', function ( $scope, $location, $window, NgTableParams, categories ) {

    var self = this;

    $scope.showCreateCategoryForm = false;
    $scope.newCategoryName = '';

    var categoriesData = [];


    //Fetch all Customer
    var listCategories = function () {
      categories.getAllCategories().then(function (categories) {

        categoriesData = categories.data.category;



        $scope.tableParams = new NgTableParams({
          page : 1,
          count : 30,
          sorting : {
            key : 'asc'
          }
        }, {
          counts : '',
          defaultSort : 'asc',
          data : categoriesData
        });

      });
    };

    listCategories();



    $scope.saveNewCategory = function () {
      categories.addCategory({'name' : $scope.newCategoryName}).then(function (response) {
        $scope.showCreateCategoryForm = false;
        $scope.newCategoryName = '';
        listCategories();

      });
    };

    $scope.deleteCategory = function (categoryID) {
      //Confirm delete
      var confirmDelete = confirm('Desea borrar la categoría?');

      if ( confirmDelete ) {
        categories.deleteCategory(categoryID).then(function (response) {
          listCategories();

        });

      };


    }




  }]);