'use strict';

angular.module('switchTabsAppAdmin')
  .controller('surveyDetailCtrl', ['$scope', '$location', '$window', '$routeParams', 'NgTableParams', 'surveys', 'customers', function ( $scope, $location, $window, $routeParams, NgTableParams, surveys, customers ) {

    var self = this,
        surveyData = [],
        surveyAnswers = {},
        SURVEY_ID = $routeParams.id;

    $scope.surveyInfo = {};
    $scope.customerInfo = {};



    surveys.getSurveyByCustomerAndLocations(SURVEY_ID).then( function(survey) {
      $scope.surveyLocation = survey.data;

      $scope.customerInfo = {
        name : survey.data[0].customerName
      };
      $scope.surveyInfo = {
        name :  survey.data[0].surveyName,
        date :  survey.data[0].surveyDate

      };

    });
    
    surveys.getSurveyQuestions(SURVEY_ID).then( function (questions){
      $scope.questions = questions.data;
    });

    surveys.getSurveyAnswers(SURVEY_ID).then( function (answers){

      var result = _.chain(answers.data)
        .groupBy("Date")
        .pairs()
        .map(function (currentItem) {
          return _.object(_.zip(["date", "answers"], currentItem));
        })
        .value();

      $scope.answers = result;
      $scope.surveyInfo.numberAnswers = $scope.answers.length;

      listAnswers($scope.answers);

      console.log($scope.answers);


    });

    var listAnswers = function(data) {

      self.tableParams = new NgTableParams({
        page : 1,
        count : 20,
        sorting : {
          date : 'desc'
        },
        filter : {
          name : ''
        }
      }, {
        defaultSort : 'desc',
        data : data
      });
    };
    
    //Filters


    $scope.printReport = function(){
      var table = document.getElementById('printArea').innerHTML;
      var myWindow = $window.open('', '', 'width=800, height=600');
      myWindow.document.write(table);
      myWindow.print();
    };


  }]);