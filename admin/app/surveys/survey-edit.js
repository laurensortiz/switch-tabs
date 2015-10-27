'use strict';

angular.module('switchTabsAppAdmin')
  .controller('surveyEditCtrl', ['$scope', '$rootScope', '$location', '$window', '$routeParams', 'NgTableParams', 'surveys', 'customers', 'categories', function ( $scope, $rootScope, $location, $window, $routeParams, NgTableParams, surveys, customers, categories ) {

    var self = this,
      surveyQuestions = [],
      guid, // Function that return a random number
      SURVEY_ID = $routeParams.id,
      surveyQuestionsSaved,
      surveyByLocationSaved = false,
      surveyByLocation,
      surveyByLocationStored,
      firstLoaded = true;


    $scope.surveyName = '';
    $scope.surveyCustomer = ''; //customerID
    $scope.locationsActiveInSurvey = [];
    $scope.processing = false; //Indicate when an action (eg.sending form data) is happening
    $scope.survey = {};
    $scope.surveyQuestions = [];
    $scope.customerLocations = [];

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

    //Fetch surveyInfo
    surveys.getSurvey( SURVEY_ID ).then( function(survey) {
      $scope.survey.name = survey.data.name;
      $scope.surveyName = $scope.survey.name;

    });

    //Fetch Questions
    surveys.getSurveyQuestions( SURVEY_ID ).then( function(questions) {
      console.log(questions);
      if ( questions.data.length > 0 ){
        angular.forEach(questions.data, function(question){
          var questionData = {
            surveyID    : SURVEY_ID,
            question    : question.question,
            categoryID  : question.questionCategoryID,
            type        : question.questionType
          };

          $scope.surveyQuestions.push(questionData);
        });
        console.log('Survey Questions Loaded!');
        surveyQuestionsSaved = true;
      }

    });



    //Fetch All locations from survey
    surveys.getSurveyByLocation( SURVEY_ID ).then( function(locations){

      $scope.locationsActiveInSurvey = locations.data;
      surveyByLocationSaved = true;

      //Get the customer info from one locationID locations.data[firstLocation = 0]
      customers.getCustomerByLocation( locations.data[0].locationID).then( function(customer){
        
        customers.getCustomerInfo( customer.data.idCustomer ).then(function(customerInfo){
          $scope.surveyCustomer = customerInfo.id;

        });

        
      });
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

          angular.forEach( $scope.locationsActiveInSurvey, function (val, key){

            _.filter($scope.customerLocations, function(value, key){
              if (value.id === val['locationID'] ) {

               $scope.customerLocations[key].Selected = true;

              }
              else {
                //@var firstLoaded =
                //At the beginning we will show selected only the locations related to this survey
                //after the user change the customer we will select all the locations in terms to
                //avoid empty locations for this survey
                if ( firstLoaded ){
                  $scope.customerLocations[key].Selected = false;
                  firstLoaded = false;
                }
                else{
                  $scope.customerLocations[key].Selected = true;
                }
              }

            });
 
          });


          $scope.selectAll = function (value) {
            if (value !== undefined) {
              return setAllSelected(value);
            } else {
              return getAllSelected();
            }
          }
        });
      }
      else {
        angular.forEach($scope.customerLocations, function(val,key) {
          $scope.customerLocations[key].Selected = true;
        })
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


    //Action from btn
    $scope.updateSurvey = function(){
      //Survey Name and Customer
      if ( $scope.survey.name !== $scope.surveyName ){
        var newSurveyInfo = {
          name : $scope.surveyName
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

      if ( $scope.tempQuestion === undefined ||  $scope.tempCategory === undefined ||  $scope.tempType === undefined){
        $rootScope.notification['text'] = 'Pregunta Incompleta';
        $rootScope.notification['type'] = 'error';

      }
      else {
      
        var questionData = {
          surveyID    : SURVEY_ID,
          question    : $scope.tempQuestion,
          categoryID  : $scope.tempCategory,
          type        : $scope.tempType
        };

        $scope.surveyQuestions.push(questionData);

        console.log($scope.surveyQuestions);

        //Clear inputs under create a question
        $scope.tempQuestion = undefined;
        $scope.tempCategory = undefined;
        $scope.tempType = undefined;
      }
    };

    function saveSurveyQuestions() {

      // For avoid store duplicated questions we need to
      // verify if the questions already stored
      // In case the answer is NO let's saved
      // In case the answer is YES let's remove it and then saved the new ones.

      if ( !surveyQuestionsSaved ) {
        surveys.saveSurveyQuestions($scope.surveyQuestions).then( function(response) {
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

            console.log('New Questions Saved!');
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