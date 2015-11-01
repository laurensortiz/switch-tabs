'use strict';

angular.module('switchTabsAppAdmin')
  .controller('surveyDetailCtrl', ['$scope', '$location', '$window', '$routeParams', 'NgTableParams', 'surveys', 'customers', function ( $scope, $location, $window, $routeParams, NgTableParams, surveys, customers ) {

    var self = this,
        surveyData = [],
        surveyAnswers = {},
        SURVEY_ID = $routeParams.id;

    $scope.surveyInfo = {};
    $scope.customerInfo = {};
    $scope.surveyLocation = [];
    $scope.hasQuestions = false;

    //Fetch surveyInfo
    surveys.getSurvey( SURVEY_ID ).then( function(survey) {

      $scope.surveyInfo = survey.data;

      console.log($scope.surveyInfo);

    });

    //Fetch All locations from survey
    surveys.getSurveyByLocation( SURVEY_ID ).then( function(locations){

      $scope.locationsActiveInSurvey = locations.data;


      //Get the customer info from one locationID locations.data[firstLocation = 0]
      customers.getCustomerByLocation( locations.data[0].locationID).then( function(customer){

        customers.getCustomerInfo( customer.data.idCustomer ).then(function(customerInfo){
          
          $scope.customerInfo = {
            name  : customerInfo.name,
            id    : customerInfo.id
          };

        });
        
      });
    });

    //Fetch All locations from survey
    surveys.getSurveyByLocation( SURVEY_ID ).then( function(locations){

      $scope.customerLocation = locations.data;


      //Get the customer info from one locationID locations.data[firstLocation = 0]
      customers.getCustomerByLocation( locations.data[0].locationID).then( function(customer){
        customers.getCustomerInfo( customer.data.idCustomer ).then(function(customerInfo){
          $scope.customerName =  customerInfo.name;
          $scope.surveyCustomerID = customerInfo.id;

          angular.forEach( $scope.customerLocation, function (val, key){
            _.filter(customerInfo.locations, function(value, key){

              if (value.id === val.locationID ) {
                $scope.surveyLocation.push(customerInfo.locations[key]);

              }

            });

          });
        });
      });
    });


    surveys.getSurveyQuestions(SURVEY_ID).then( function (questions){

      if( questions.data.length > 0 ){
        $scope.questions = questions.data;

      }


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

      if ( result.length ){
        $scope.hasQuestions = true;
      }
      else {
        $scope.hasQuestions = false;
      }

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