'use strict';

angular.module('switchTabsAppAdmin')
  .controller('surveyNewCtrl', ['$scope', '$location', '$window', '$routeParams', 'NgTableParams', 'surveys', 'customers', 'categories', function ( $scope, $location, $window, $routeParams, NgTableParams, surveys, customers, categories ) {

    var self = this,
      surveyQuestions = [],
      SURVEY_ID;

    $scope.showSurveyQuestion = false;
    $scope.newSurveyName = '';
    $scope.surveyCustomer = ''; //customerID
    $scope.processing = false; //Indicate when an action (eg.sending form data) is happening
    $scope.survey = {};
    $scope.surveyQuestions = [];
    $scope.hasQuestions = false;

    //Default Settings
    $scope.settings = {
      questionsType : {
      '1': {
        name : 'polar'
      },
      '2': {
        name : 'multiple'
        }
      }
    };

    $scope.$watchCollection('surveyQuestions', function (newValue, oldValue) {

      ($scope.surveyQuestions.length > 0) ? $scope.hasQuestions = true :  $scope.hasQuestions = false;

    });
    

    //Fetch All Customers
    customers.getAllCustomers().then(function (customers) {

      $scope.customerList = customers.data.customer;

    });

    //Fetch All Categories
    categories.getAllCategories().then(function (categories) {

      $scope.categoryList = categories.data.category;

    });



    $scope.newSurvey = function () {
      $scope.processing = true;

      var newSurveyInfo = {
        customerID : $scope.surveyCustomer,// customerID
        name       : $scope.newSurveyName,
        status     : 'active' // Every survey is active by default
      };

      surveys.addSurvey( newSurveyInfo ).then( function(response) {
        
        if ( response.data.status === 'success' ) {
          
          surveys.getSurveysByCustomer( $scope.surveyCustomer ).then( function(response) {
            $scope.survey = _.last(response.data);
            $scope.showSurveyQuestion = true;

     
            SURVEY_ID = $scope.survey.id;


            //Fetch All Locations
            customers.getCustomerLocations( $scope.surveyCustomer ).then( function( locations ) {
              $scope.customerLocations = locations.data;
            });
            
          });
          
        }//end IF

      });
    };

    $scope.addQuestion = function (){

      if ( $scope.surveyQuestionsForm.$valid ){

        var questionData = {
          surveyID    : SURVEY_ID,
          question    : $scope.tempQuestion,
          categoryID  : $scope.tempCategory,
          type        : $scope.tempType
        };

        $scope.surveyQuestions.push(questionData);

      }
    };

    $scope.saveSurveyQuestions = function() {
      surveys.saveSurveyQuestions($scope.surveyQuestions).then( function(response) {
        console.log(response);
      });
    };
    
    $scope.removeQuestion = function(questionIndex) {
      $scope.surveyQuestions.splice(questionIndex, 1);
    };

    $scope.getPartialSrc = function(questionType) {
      return 'surveys/partials/question_type_' + questionType + '.html';
    }

  }]);