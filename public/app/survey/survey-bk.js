'use strict';

angular.module('switchTabsAppPublic')
  .controller('surveyCtrl', function ($scope, $location, $timeout, $filter, $rootScope, $routeParams, surveys) {

    //$scope.customer = customer.customerID;
    //$scope.location = customer.locationID;
    $scope.survey = null;
    $scope.questions = {};
    $scope.answersByCustomer = {};
    $scope.saveAnswer = [];
    $scope.currentStep = 1;
    $scope.numberOfQuestions = 0;
    $scope.pollCompleted = false;
    $scope.date = $filter('date')(new Date(),'dd-MM-yyyy HH:mm a');
    $scope.loaded = false;
    $scope.counter = 15;
    $scope.waiting = false;

    //if ($scope.customer === undefined || $scope.location === undefined) {
    //  $location.url('/?customer=X&location=X');
    //}
    //




    var stopped,
      colorAnswer;

    var countdown = function() {
      stopped = $timeout(function() {

        $scope.counter--;

        if($scope.counter === 5){
          $scope.waiting = true;
        } else if ($scope.counter === 0){
          resetSurvey(0);
        }
        countdown();
      }, 1000);
    };

    $scope.continueSurvey = function(){
      $scope.counter = 15;
      $scope.waiting = false;
    };

    var resetSurvey = function (time) {
      $timeout(function () {
        $scope.pollCompleted = false;
        $scope.waiting = false;
        $timeout.cancel(stopped);
        $scope.answersByCustomer = {};
        $scope.saveAnswer = [];
        $scope.currentStep = 1;
        $scope.counter = 15;
      }, time);
    }



    //----TEST VARS-- DELETE----->
    //$scope.customer = '1';
    //$scope.location = '3';
    //---------------<

    //Get Questions
    surveys.getSurveyByCustomer($scope.customer).then(function(surveyID){

      // surveyID = 1;

      surveys.getSurveyQuestions(surveyID).then(function (questions) {
        $scope.numberOfQuestions = questions.data.length;
        $scope.questions = questions.data;

      });

    });
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
      $scope.answersByCustomer.location = $scope.location;
      $scope.answersByCustomer.answer = answer;
      $scope.answersByCustomer.created = $scope.date;

      $scope.saveAnswer.push($scope.answersByCustomer);

      $scope.currentStep = $scope.currentStep + 1;


      if($scope.currentStep ===  $scope.numberOfQuestions + 1){
        $scope.pollCompleted = true;

        surveys.saveAnswers($scope.saveAnswer).then(function(data){
          resetSurvey(3000);
        });
      }
    }

    function guid() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
    }


  });