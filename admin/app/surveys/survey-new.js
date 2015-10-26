'use strict';

angular.module('switchTabsAppAdmin')
  .controller('surveyNewCtrl', ['$scope', '$rootScope', '$location', '$window', '$routeParams', 'NgTableParams', 'surveys', 'customers', 'categories', function ( $scope, $rootScope, $location, $window, $routeParams, NgTableParams, surveys, customers, categories ) {

    var self = this,
      surveyQuestions = [],
      guid, // Function that return a random number
      SURVEY_ID,
      surveyQuestionsSaved = false,
      surveyByLocationSaved = false,
      surveyByLocation,
      surveyByLocationStored;

    $scope.showSurveyQuestion = false;
    $scope.newSurveyName = '';
    $scope.surveyCustomer = '1'; //customerID
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
    
    //Fetch the new locations on selection Customer 
    $scope.$watch('surveyCustomer', function(newCustomerID, oldCustomerID) {

      if ( newCustomerID !== oldCustomerID ) {
        //Fetch All Locations
        customers.getCustomerLocations( newCustomerID ).then( function( locations ) {
          $scope.customerLocations = locations.data;

          $scope.selectAll = function (value) {

            if (value !== undefined) {
              return setAllSelected(value);
            } else {
              return getAllSelected();
            }
          }
        });
      }

    });


    //Handler the selected location on the current survey
    var getAllSelected = function () {
      var selectedItems = $scope.customerLocations.filter(function (location) {
        return location.Selected;
      });

      return selectedItems.length === $scope.customerLocations.length;
    };

    var setAllSelected = function (value) {
      angular.forEach($scope.customerLocations, function (location) {
        location.Selected = value;
      });
    };

    //Show step 2 view where the user creates questions
    $scope.newSurvey = function(surveyInfo) {

      if( surveyInfo.$valid ){
        $scope.processing = true;

        var newSurveyInfo = {
          name       : $scope.newSurveyName,
          status     : 'active', // Every survey is active by default
          surveyKey  : guid() // get Key number
        };

        surveys.addSurvey( newSurveyInfo ).then( function(response) {

          if ( response.data.status === 'success' ) {

            surveys.getSurveyByKey( newSurveyInfo.surveyKey).then( function(survey) {
              $scope.showSurveyQuestion = true;
              $scope.survey = survey.data;

              SURVEY_ID = $scope.survey.id;

            });

          }//end IF

        });
      }
    };
    //Action from btn
    $scope.updateSurvey = function(){
      //Survey Name and Customer
      if ( $scope.survey.name !== $scope.newSurveyName ){
        var newSurveyInfo = {
          name : $scope.newSurveyName
        };

        surveys.updateSurvey(SURVEY_ID, newSurveyInfo).then( function(response) {
          console.log('Survey Info updated !');
        });
      }

      //Questions
      saveSurveyQuestions();
      //
      //Survey by Location
      saveSurveyByLocation();


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

    function saveSurveyQuestions() {

      // For avoid store duplicated questions we need to
      // verify if the questions already stored
      // In case the answer is NO let's saved
      // In case the answer is YES let's remove it and then saved the new ones.

      if ( !surveyQuestionsSaved ) {
        surveys.saveSurveyQuestions($scope.surveyQuestions).then( function(response) {
          surveyQuestionsSaved = true;
          $rootScope.notification['text'] = 'Encuesta guardada';
          $rootScope.notification['type'] = 'success';
        });
      }
      else {
        surveys.deleteSurveyQuestions( SURVEY_ID).then( function() {
          console.log('Questions Deleted!');

          surveys.saveSurveyQuestions($scope.surveyQuestions).then( function(response) {
            $rootScope.notification['text'] = 'Encuesta actualizada';
            $rootScope.notification['type'] = 'success';
          });
        });
      }

    };

    function saveSurveyByLocation(){
      surveyByLocation = _.pluck(_.filter($scope.customerLocations,{'Selected' : true}), 'id'),
      surveyByLocationStored;


      var setSurveyByLocation = function(data){
        angular.forEach( data, function(locationID){
          surveys.addSurveyByLocation( SURVEY_ID, locationID).then( function(){
            surveyByLocationSaved = true;
            console.log('Done Survey in location');

          });
        });
        //Return the location in this survey and saved into the var surveyByLocationStored
        //in terms to compare it later with the current selected locations
        getSurveyByLocation();



      };
      var getSurveyByLocation = function(){
        surveys.getSurveyByLocation( SURVEY_ID ).then(function(locations){
          surveyByLocationStored = _.pluck(_.filter(locations.data), 'locationID');
        });
      };
      var removeSurveyByLocation = function(data){
        angular.forEach( surveyByLocation, function(locationID){
          surveys.deleteSurveyByLocation( SURVEY_ID ).then( function(){
            //After clear the stored locations
            //now save the new ones
            surveyByLocationStored = [];
          });
        });
        setSurveyByLocation(surveyByLocation);
      };


      if ( !surveyByLocationSaved ){
        setSurveyByLocation(surveyByLocation);
      }
      else if ( surveyByLocationSaved && surveyByLocation !== surveyByLocationStored ){
        removeSurveyByLocation(surveyByLocationStored);
      }


      
    }
    
    $scope.removeQuestion = function(questionIndex) {
      $scope.surveyQuestions.splice(questionIndex, 1);
    };

    $scope.getPartialSrc = function(questionType) {
      return 'surveys/partials/question_type_' + questionType + '.html';
    };
    guid = function() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
    };

  }]);