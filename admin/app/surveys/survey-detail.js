'use strict';

angular.module('switchTabsAppAdmin')
  .controller('surveyDetailCtrl', ['$scope', '$location', '$window', '$timeout', '$routeParams', 'NgTableParams', 'surveys', 'customers', function ( $scope, $location, $window, $timeout, $routeParams, NgTableParams, surveys, customers ) {

    var self = this,
        surveyData = [],
        surveyAnswers = {},
        chartData,
        SURVEY_ID = $routeParams.id;
    //Charts
    var ctx  = document.getElementById('surveyChart').getContext('2d');

    $scope.surveyInfo = {};
    $scope.customerInfo = {};
    $scope.surveyLocation = [];
    $scope.hasQuestions = false;

    //Fetch surveyInfo
    surveys.getSurvey( SURVEY_ID ).then( function(survey) {

      $scope.surveyInfo = survey.data;



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

      var group = _.groupBy(_.flatten(_.pluck(_.map($scope.answers),'answers')), 'answer');

     

      chartData = _.transform(group, function (result, val, key) {

        val.value = _.size(val);
        val.label = key.toLowerCase();
        val.color = Answer[key];

        result[key.toLowerCase()] = val;
      });


      var options = {
        scaleBeginAtZero : true
      };

      new Chart(ctx).PolarArea(_.values(chartData), options);



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
    

    $scope.filterLocationSelected = function(locationID){
      console.log(locationID);

      console.log($scope.answers);

      //angular.forEach($scope.filterLocation, function (location) {
      //  console.log(location);
      //});

     

    };







    $scope.printReport = function(){
      $timeout(function() {
        $window.print();
      })
    };


  }]);