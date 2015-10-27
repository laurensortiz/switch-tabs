'use strict';

angular.module('switchTabsAppPublic')
  .controller('surveyCtrl', ['$scope', '$timeout', '$routeParams', 'surveys', 'customers', function ($scope, $timeout, $routeParams, surveys, customers) {

    var SURVEY_ID = $routeParams.survey,
        LOCATION_ID;

    var stopped,
      colorAnswer,
      countdown,
      resetSurvey,
      guid;

    $scope.answersByCustomer = {};
    $scope.saveAnswer = [];
    $scope.currentStep = 1;
    $scope.numberOfQuestions = 0;
    $scope.surveyInfo = [];


    //Handler Messages and alerts
    $scope.proccessing = false;// On true show an spinner at the corner top right
    $scope.showAlert = false; // Apply for all alerts or messages
    $scope.surveyInactive = false;// After some minutes of inactivity this variable is turns to true showing the alert to user
    $scope.surveyNotSelected = false;
    //-----
    //Survey indicated by the user
    //Function callback that brings the survey info
    $scope.surveySelected = function( surveyID ){
      SURVEY_ID = surveyID || $scope.surveyID;
      $scope.proccessing = true;

      //Fetch surveyInfo
      surveys.getSurvey( SURVEY_ID ).then( function(survey) {
        if ( survey.data !== 'false' ) {
          $scope.surveyName = survey.data.name;
          //Fetch All locations from survey
          surveys.getSurveyByLocation( SURVEY_ID ).then( function(locations){

            $scope.surveyLocation = locations.data;


            //Get the customer info from one locationID locations.data[firstLocation = 0]
            customers.getCustomerByLocation( locations.data[0].locationID).then( function(customer){
              customers.getCustomerInfo( customer.data.idCustomer ).then(function(customerInfo){
                $scope.customerName =  customerInfo.name;
                $scope.surveyCustomerID = customerInfo.id;

                angular.forEach( $scope.surveyLocation, function (val, key){
                  _.filter(customerInfo.locations, function(value, key){
                    if (value.id === val.locationID ) {
                      $scope.surveyInfo.push(customerInfo.locations[key]);

                    }

                  });

                });

                console.log( $scope.surveyInfo);

                $scope.surveyNotSelected = false;
                $scope.surveyVerify = true;
              });


            });
          });
        }
        else {
          $scope.errorText = 'Encuesta no existe';
          $timeout( function() {
            $scope.errorText = '';
          },3000);
        }

      });



      //surveys.getSurveyByCustomerAndLocations( SURVEY_ID ).then( function(response) {
      //  $scope.proccessing = false;
      //
      //  if ( response.data.length > 0 ) {
      //    $scope.surveyNotSelected = false;
      //    $scope.surveyVerify = true;
      //    $scope.surveyInfo = response.data;
      //    $scope.surveyName = response.data[0].surveyName;
      //    $scope.customerName = response.data[0].customerName;
      //
      //  }
      //  else {
      //    $scope.errorText = 'Encuesta no existe';
      //    $timeout( function() {
      //      $scope.errorText = '';
      //    },3000);
      //  }
      //});

    };

    //Survey not indicated
    if (!SURVEY_ID) {
      $scope.showAlert = true;
      $scope.surveyNotSelected = true;
    }
    else {
      $scope.showAlert = true;
      $scope.surveySelected(SURVEY_ID);
    }

    //Load Questions
    $scope.loadQuestions = function(locationID) {
      LOCATION_ID = locationID;
      
      surveys.getSurveyQuestions( SURVEY_ID).then( function(questions){
        $scope.selectLocation = false;
        $scope.showAlert = false;

        $scope.questions = questions.data;
        $scope.numberOfQuestions = questions.data.length;

        console.log($scope.questions);
      });
      

    };

    countdown = function() {
      stopped = $timeout(function() {

        $scope.counter--;

        if( $scope.counter === 5 ){

          $scope.showAlert = true;
          $scope.surveyInactive = true;

        } else if ($scope.counter === 0){
          resetSurvey(0);
        }
        countdown();
      }, 1000);
    };

    resetSurvey = function (time) {
      $timeout(function () {

        $scope.pollCompleted = false;
        $scope.showAlert = false;
        $scope.surveyInactive = false;
        $timeout.cancel(stopped);
        $scope.answersByCustomer = {};
        $scope.saveAnswer = [];
        $scope.currentStep = 1;
        $scope.counter = 15;

      }, time);
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


    $scope.continueSurvey = function() {
      $scope.counter = 15;
      $scope.showAlert = false;
      $scope.surveyInactive = false;
    };



    //Retrieve info by customer

    $scope.saveAnswers = function (idQuestion, answer) {

      if ($scope.currentStep === 1){
        //Start Counter
        countdown();
      }

      switch (answer){
        case 'excelente':
        case 'si':
          colorAnswer = '#39b54a';
          break;
        case 'bueno':
          colorAnswer = '#ffdb09';
          break;
        case 'regular':
          colorAnswer = '#ef8126';
          break;
        case 'malo':
        case 'no':
          colorAnswer = '#dd0717';
          break;
        default :
          colorAnswer = '#fff';
      }

      $scope.answerSelectedColor ={'background-color' : colorAnswer};
      $scope.counter = 15;
      $scope.answersByCustomer = {};
      $scope.answersByCustomer.id = idQuestion;
      $scope.answersByCustomer.location = LOCATION_ID;
      $scope.answersByCustomer.answer = answer;
      $scope.answersByCustomer.answerKey = guid();

      $scope.saveAnswer.push($scope.answersByCustomer);

      $scope.currentStep = $scope.currentStep + 1;


      if($scope.currentStep ===  $scope.numberOfQuestions + 1){

        $scope.pollCompleted = true;

        surveys.saveAnswers($scope.saveAnswer).then(function(data){
          resetSurvey(3000);
        });
      }
    }




    //Remove loader once the page is loaded
    $scope.$on('$viewContentLoaded', function() {
      $scope.loaded = true;
    });


  }]);